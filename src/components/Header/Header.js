import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import tank from "./tank.svg"
import addContent from "./add-content.svg"
import * as styles from "./Header.module.css"
import arrow from "../../equipment/images/arrow-left.png";
import clsx from "clsx"

let Header = (props) => {

    let [isIOS, setIsIOS] = useState(false)
    useEffect(() => {
        setIsIOS(typeof navigator !== 'undefined' ? /iPhone/.test(navigator.userAgent) && !window.MSStream : false)
    }, [])

    return (
        <div className={clsx(styles.container, { [styles.ios]: isIOS })}>
            <Link to={props.params.backPath || "/"}>
                <div className={styles.head}>
                    {props.params.backPath ? <img height="24px" src={arrow} /> : <img src={tank} alt="" className={styles.logo} />}
                    <h1>{props.params.name}</h1>
                </div>
            </Link>
            <a href="https://forms.gle/JkwZaui4AjKtvZDe6" target="_blank" rel="noreferrer" >
                <img src={addContent} width="35px" alt="" />
            </a>
        </div>
    )
}

export default Header;
