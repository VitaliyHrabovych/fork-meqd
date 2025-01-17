import React, { useEffect, useState, useContext } from "react";
import * as styles from "./Progressbar.module.css";
import doneIcon from "../../images/progressDone.png";
import hideIcon from "../../images/hideIcon.png";
import ProgressContext from "../Layout/ProgressContext";
import { Network } from '@capacitor/network';
import clsx from 'clsx';

export const Progressbar = () => {
  const [progress, setProgress] = useState(0);

  const {progressState, setProgressState, showProgress, setShowProgress} = useContext(ProgressContext)

  const caclProgress = (cached, total) => {
    if (total != 0) {
      return Math.round((cached / total) * 100);
    } else {
      return 100;
    }
  }

  const notSsr = typeof window !== 'undefined';
  let [online, setOnline] = useState(notSsr ? navigator.onLine : true);

  useEffect(() => {
      if (notSsr) {
          const handle = Network.addListener('networkStatusChange', status =>
              setOnline(status.connected)
          );
          return () => handle.then(h => h.remove());
      }
  }, [notSsr]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker.addEventListener('message', event => {
          // event is a MessageEvent object
          setProgress(caclProgress(event.data.cached, event.data.total))
          if (event.data.type === "INSTALLING") {
            setProgressState(true)
          }
          if (event.data.type === "DONE") {
            setTimeout(function () {
              setProgressState(false);
            }, 5000);
          }
        });
      } catch (e) {
        console.log('sw register fail');
      }
    }

  }, []);

  return (
    <>
      <div
        style={{ display: progressState ? 'block' : 'none'}}
        className={clsx(
          styles.progressbar, 
          {[styles.done]: progress === 100},
          {[styles.offline]: !online}
        )}
      >
        <div
          style={{ bottom: showProgress ? "70px" : "0px" } }
          className={styles.hideElement}
          onClick={() => setShowProgress(!showProgress)}
        >
          <p>{showProgress ? "Сховати" : `${progress}%`}</p>
          <img
            src={hideIcon}
            style={
              showProgress
                ? { transform: "rotate(0deg)" }
                : { transform: "rotate(180deg)" }
            }
          />
        </div>
        <div
          style={{ display: !showProgress && progress !== 100 ? "none" : "block"  }}
          className={styles.progressbarContent}
        >
          <div className={styles.progressbarHeader}>
            {
              online ? 
              (
                <div className={styles.onlineContent}>
                  <p>
                    {
                      progress !== 100
                        ? "Завантаження даних для роботи офлайн"
                        : "Дані завантажились"
                    }
                  </p>
                  <p>
                    {
                      progress !== 100 ? `${progress}%` : <img src={doneIcon} />
                    }
                  </p>  
                </div>
              ) 
              : 
              (
                <div className={styles.offlineContent}>
                  <p>
                    Помилка завантаження даних. Зв'язок розірвано 
                  </p>
                  <p style={{fontSize: "12px"}}>
                    Встановіть зв'язок та перезавантажте сторінку
                  </p>
                </div>
              )
            }
          </div>
          <div className={styles.bar}>
            <div
              className={styles.progress}
              style={{ width: progress + "%" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
