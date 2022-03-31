const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require('path')
exports.createPages = async ({graphql, actions}) => {
  const { createPage } = actions;
  const data = await graphql(
    `
      {
        allMdx {
          nodes {
            frontmatter {
              category {
                name
              }
            }
            slug
          }
        }
      }
    `
  )

  if (data.errors) {
    console.log(errors);
    return
  }

  const equipmentPageTemplate = path.resolve(`src/templates/equipment-page.js`);
  for (let item of data.data.allMdx.nodes) {
    createPage({
      path: item.slug,
      component: equipmentPageTemplate,
      context: {slug: item.slug, imageDir: item.slug + 'images', category: item.frontmatter.category.name}
    });
  }
}

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
      type Mdx implements Node {
        frontmatter: Frontmatter
      }
      type Frontmatter {
        category: CategoriesYaml @link(by: "name")
      }
      type CategoriesYaml implements Node {
        equipment: [Mdx] @link(by: "frontmatter.category.name", from: "name")
      }
    `
    createTypes(typeDefs)
}