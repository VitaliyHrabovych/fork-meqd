import "../components/reset.css";
import * as styles from "../components/index.module.css";
import React from "react";
import Header from "../components/Header/Header";
import RenderList from "../components/RenderList/RenderList";
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
    }
  }
`;

let FirstPage = ({ data }) => {
  return (
    <div className={styles.addMargins}>
      <Header name="Військова техніка" />
      <RenderList
        data={data.allCategoriesYaml.nodes.map((n) => ({
          path: n.name,
          image: n.image.childImageSharp,
          title: n.title,
        }))}
      />
      <a href={`https://github.com/softwareplanet/mec/commit/${data.gitCommit.hash}`}>{data.gitCommit.hash}</a>
    </div>
  );
};

export default FirstPage;
