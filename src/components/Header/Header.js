import { Link } from "gatsby";
import React from "react";
import tank from "./tank.svg"
import addContent from "./add-content.svg"
import * as styles from "./Header.module.css"
import arrow from "../../equipment/images/arrow-left.png";
import clsx from "clsx"

let Header = (props) => {
    const isIOS = typeof navigator !== 'undefined' ? /iPhone/.test(navigator.userAgent) && !window.MSStream : null;

    return (
        <div className={clsx(styles.container, { [styles.ios]: isIOS })}>
            <Link to={props.backPath || "/"}>
                <div className={styles.head}>
                    {props.backPath ? <img height="24px" src={arrow} /> : <img src={tank} alt="" className={styles.logo} />}
                    <h1>{props.name}</h1>
                </div>
            </Link>
            <a href="https://forms.gle/JkwZaui4AjKtvZDe6" target="_blank" rel="noreferrer" >
                <img src={addContent} width="35px" alt="" />
            </a>
        </div>
    )
}

export default Header;
