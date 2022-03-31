import React from "react";
import '../components/reset.css';
import * as styles from '../components/index.module.css';
import RenderList from "../components/RenderList/RenderList";
import Layout from '../components/Layout/Layout';
import { graphql } from "gatsby";

export const query = graphql`
  query {
    allCategoriesYaml {
      nodes {
        name
        title
        image {
          childImageSharp {
            gatsbyImageData(width: 240, height: 240)
          }
        }
      }
    },
    gitCommit(latest: {eq: true}) {
      hash
      date(formatString: "YYYYMMDDHHmmss")
    },
    gitTag(latest: {eq: true}) {
      name
    }
   }
`;

let FirstPage = ({ data }) => {
  return (
    <div className={styles.addMargins}>
      <Layout commitInfo={data.gitCommit} tagInfo={data.gitTag}>
        <RenderList
          data={data.allCategoriesYaml.nodes.map((n) => ({
            path: n.name,
            image: n.image.childImageSharp,
            title: n.title,
          }))}
        />
      </Layout>
    </div>
  );
};

export default FirstPage;
