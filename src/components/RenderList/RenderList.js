import React, { useEffect, useRef, useState } from "react";
import CardComponent from "../CardComponent/CardComponent";
import ToolBar from "../ToolBar/ToolBar";
import * as styles from "./listsStyles.module.css";
import { debounceTime, fromEvent, startWith } from "rxjs";

const MAX_CONTAINER_WIDTH = 900;

let RenderList = ({ data, searchData }) => {
  let [view, setView] = useState("grid");

  let [containerWidth, setContainerWidth] = useState(MAX_CONTAINER_WIDTH);
  useEffect(() => {
    const subscribtion = fromEvent(window, "resize")
      .pipe(
        debounceTime(250),
        startWith(MAX_CONTAINER_WIDTH) // need to path some value
      )
      .subscribe(() => setContainerWidth(container.current.clientWidth));
    return () => subscribtion.unsubscribe();
  }, []);

  const container = useRef();

  const culcCardSize = () => {
    let result;
    let cardNumber = Math.round(containerWidth / 160);
    result = (containerWidth - (15 * (cardNumber - 1))) / cardNumber;
    return result;
  };  
  const cardSize = culcCardSize();

  return (
    <>
      <ToolBar setView={setView} data={searchData} />
      <div ref={container} className={styles[view]}>
        {data.map((element, i) => (
          <CardComponent
            key={i}
            path={element.path}
            image={element.image}
            title={element.title}
            variant={view}
            size={cardSize}
          />
        ))}        
      </div>
    </>
  );
};

export default RenderList;
