import React from 'react'
import "./RenderList.css"
import CardComponent from '../CardComponent/CardComponent'

let RenderList = ({ data }) => {
    let grid = true
    return (
        <div className={grid ? 'grid':'list'}>
            {
                data.map(element =>
                    <CardComponent
                        key={element.name}
                        image={grid ? element.grid_img.childImageSharp : element.list_img.childImageSharp}
                        title={element.title}
                    />)
            }
        </div>
    )
}

export default RenderList