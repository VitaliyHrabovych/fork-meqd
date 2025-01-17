// use `let` to workaround https://github.com/jhnns/rewire/issues/144
/* eslint-disable prefer-const */
let fs = require(`fs`)
let workboxBuild = require(`workbox-build`)
const path = require(`path`)
const { slash } = require(`gatsby-core-utils`)
const glob = require(`glob`)
const _ = require(`lodash`)

let getResourcesFromHTML = require(`./get-resources-from-html`)
const { template } = require("lodash")

exports.onPreBootstrap = ({ cache }) => {
  const appShellSourcePath = path.join(__dirname, `app-shell.js`)
  const appShellTargetPath = path.join(cache.directory, `app-shell.js`)
  fs.copyFileSync(appShellSourcePath, appShellTargetPath)
}

exports.createPages = ({ actions, cache }) => {
  const appShellPath = path.join(cache.directory, `app-shell.js`)
  if (process.env.NODE_ENV === `production`) {
    const { createPage } = actions
    createPage({
      path: `/offline-plugin-app-shell-fallback/`,
      component: slash(appShellPath),
    })
  }
}

let s
const readStats = () => {
  if (s) {
    return s
  } else {
    s = JSON.parse(
      fs.readFileSync(`${process.cwd()}/public/webpack.stats.json`, `utf-8`)
    )
    return s
  }
}

function getAssetsForChunks(chunks) {
  const files = _.flatten(
    chunks.map(chunk => readStats().assetsByChunkName[chunk])
  )
  return _.compact(files)
}

function getPrecachePages(globs, base) {
  const precachePages = []

  globs.forEach(page => {
    const matches = glob.sync(base + page)
    matches.forEach(path => {
      const isDirectory = fs.lstatSync(path).isDirectory()
      let precachePath

      if (isDirectory && fs.existsSync(`${path}/index.html`)) {
        precachePath = `${path}/index.html`
      } else if (path.endsWith(`.html`)) {
        precachePath = path
      } else {
        return
      }

      if (precachePages.indexOf(precachePath) === -1) {
        precachePages.push(precachePath)
      }
    })
  })

  return precachePages
}

exports.onPostBuild = (
  args,
  {
    precachePages: precachePagesGlobs = [],
    debug = undefined,
    workboxConfig = {},
  }
) => {
  const { pathPrefix, reporter } = args
  const rootDir = `public`

  // Get exact asset filenames for app and offline app shell chunks
  const files = getAssetsForChunks([
    `app`,
    `webpack-runtime`,
    `component---node-modules-gatsby-plugin-offline-app-shell-js`,
  ])
  const appFile = files.find(file => file.startsWith(`app-`))

  function flat(arr) {
    return Array.prototype.flat ? arr.flat() : [].concat(...arr)
  }

  const offlineShellPath = `${process.cwd()}/${rootDir}/offline-plugin-app-shell-fallback/index.html`
  const precachePages = [
    offlineShellPath,
    ...getPrecachePages(
      precachePagesGlobs,
      `${process.cwd()}/${rootDir}`
    ).filter(page => page !== offlineShellPath),
  ]
  const criticalFilePaths = _.uniq(
    flat(precachePages.map(page => getResourcesFromHTML(page, pathPrefix)))
  )

  const globPatterns = files.concat([
    // criticalFilePaths doesn't include HTML pages (we only need this one)
    `offline-plugin-app-shell-fallback/index.html`,
    ...criticalFilePaths,
  ])

  const manifests = [`manifest.json`, `manifest.webmanifest`]
  manifests.forEach(file => {
    if (fs.existsSync(`${rootDir}/${file}`)) globPatterns.push(file)
  })

  const options = {
    globDirectory: rootDir,
    globPatterns,
    modifyURLPrefix: {
      // If `pathPrefix` is configured by user, we should replace
      // the default prefix with `pathPrefix`.
      "/": `${pathPrefix}/`,
    },
    
    // Don't cache-bust JS or CSS files, and anything in the static directory,
    // since these files have unique URLs and their contents will never change
    dontCacheBustURLsMatching: /(\.js$|\.css$|static\/)/,
  }

  const combinedOptions = _.merge(options, workboxConfig)

  const idbKeyvalFile = `idb-keyval-iife.min.js`
  const idbKeyvalSource = require.resolve(`idb-keyval/dist/${idbKeyvalFile}`)
  const idbKeyvalPackageJson = require(`idb-keyval/package.json`)
  const idbKeyValVersioned = `idb-keyval-${idbKeyvalPackageJson.version}-iife.min.js`
  const idbKeyvalDest = `public/${idbKeyValVersioned}`
  fs.createReadStream(idbKeyvalSource).pipe(fs.createWriteStream(idbKeyvalDest))
  const swDest = `public/sw.js`
  const swSrc = `public/sw.js`
  const swSrcReplace = fs
    .readFileSync(`${__dirname}/sw-template.js`, `utf8`)
    .replace(/%idbKeyValVersioned%/g, idbKeyValVersioned)
    .replace(/%pathPrefix%/g, pathPrefix)
    .replace(/%appFile%/g, appFile)
  fs.writeFileSync(`public/sw.js`, swSrcReplace)

  return workboxBuild
    .injectManifest({ swSrc, swDest, ...combinedOptions })
    .then(({ count, size, warnings }) => {
      if (warnings) warnings.forEach(warning => console.warn(warning))

      if (debug !== undefined) {
        const swText = fs
          .readFileSync(swDest, `utf8`)
          .replace(
            /(workbox\.setConfig\({modulePathPrefix: "[^"]+")}\);/,
            `$1, debug: ${JSON.stringify(debug)}});`
          )
        fs.writeFileSync(swDest, swText)
      }

      reporter.info(
        `Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.\n` +
          `The following pages will be precached:\n` +
          precachePages
            .map(path => path.replace(`${process.cwd()}/public`, ``))
            .join(`\n`)
      )
    })
}

const MATCH_ALL_KEYS = /^/
exports.pluginOptionsSchema = function ({ Joi }) {
  // These are the options of the v3: https://www.gatsbyjs.com/plugins/gatsby-plugin-offline/#available-options
  return Joi.object({
    precachePages: Joi.array()
      .items(Joi.string())
      .description(
        `An array of pages whose resources should be precached by the service worker, using an array of globs`
      ),
    debug: Joi.boolean().description(
      `Specifies whether Workbox should show debugging output in the browser console at runtime. When undefined, defaults to showing debug messages on localhost only`
    ),
    workboxConfig: Joi.object({
      importWorkboxFrom: Joi.string(),
      globDirectory: Joi.string(),
      globPatterns: Joi.array().items(Joi.string()),
      modifyURLPrefix: Joi.object().pattern(MATCH_ALL_KEYS, Joi.string()),
      cacheId: Joi.string(),
      dontCacheBustURLsMatching: Joi.object().instance(RegExp),
      maximumFileSizeToCacheInBytes: Joi.number(),
      runtimeCaching: Joi.array().items(
        Joi.object({
          urlPattern: Joi.object().instance(RegExp),
          handler: Joi.string().valid(
            `StaleWhileRevalidate`,
            `CacheFirst`,
            `NetworkFirst`,
            `NetworkOnly`,
            `CacheOnly`
          ),
          options: Joi.object({
            networkTimeoutSeconds: Joi.number(),
          }),
        })
      ),
      skipWaiting: Joi.boolean(),
      clientsClaim: Joi.boolean(),
    })
      .description(`Overrides workbox configuration. Helpful documentation: https://www.gatsbyjs.com/plugins/gatsby-plugin-offline/#overriding-workbox-configuration
      `),
  })
}
