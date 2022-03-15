import React, { useState } from 'react'
import CardComponent from '../CardComponent/CardComponent'
import lookup from "../../images/lookup.svg"
import Switcher from "../Switcher/Switcher";
import * as styles from "./CategoryList.module.css"

let CategoryList = ({ data }) => {
    let [view, setView] = useState('grid')
    
    return (
        <>
            <div className={styles.toolbar}>
                  <img className={styles.lookup} src={lookup} alt="" />
                  <input type="search" placeholder="Пошук..." autoComplete="off" />
                  <Switcher onViewChange={setView} />
              </div>
              <div className={styles[view]}>
              {
                  
                  data.map((element, i)=>
                      <CardComponent
                          key={i}
                          path={element.slug}
                          image={element.frontmatter.image.childImageSharp}
                          title={element.frontmatter.title}
                          variant={view}
                      />)
              }
            </div>
        </>
    )
}

export default CategoryList
 
        
