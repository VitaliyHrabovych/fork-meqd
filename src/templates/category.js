import "../components/index.css"
import React from "react";
import Header from "../components/Header/Header"
import RenderList from "../components/RenderList/RenderList";
import { graphql } from "gatsby"

export const query = graphql`
  query {
    allMarkdownRemark(filter: {frontmatter: {category: {eq: "tanks"}}}) {
        nodes {
          frontmatter {
            category
            image
            title
          }
        }
    }
  }
`

let CategoryPage = ({ data }) => {
  return (
    <>
      <Header />
      <RenderList data={data.markdownRemark.nodes} />
    </>
  )
}

export default CategoryPage