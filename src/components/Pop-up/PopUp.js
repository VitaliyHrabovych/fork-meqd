import React from 'react';
import * as styles from './PopUp.module.css';
import { MdClose } from 'react-icons/md';

export default function PopUp({ show, setFirst, first, closePopup }) {
    const hidePopup = show ? `${styles.show}` : `${styles.hide}`;

    return (
        <div className={`${styles.popup} ${hidePopup}`}>
            <div className={styles.container}>
                <MdClose className={styles.closeButton} onClick={closePopup} />
                <div className={styles.popupInfo}>
                    <h2>Бажаєте додати новий контент?</h2>
                    <p>
                        Для додавання нового контенту потрібно заповнити форму.
                        Натискаючи "Додати", ви погоджуєтесь перейти на{' '}
                        <span>Google Forms</span>, де ви можете це зробити
                    </p>

                    <button onClick={setFirst} className={styles.addButton}>
                        Додати
                    </button>
                </div>
            </div>
        </div>
    );
}
