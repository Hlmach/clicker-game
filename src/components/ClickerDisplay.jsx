import React from "react";
import styles from "../styles/ClickerDisplay.module.scss";

const ClickerDisplay = ({ credits, multiplier, boosterTime }) => {
  return (
    <div className={styles.display}>
      <h1>Кредити: {credits}</h1>
      <p>Множник за клік: x{multiplier}</p>
      {boosterTime > 0 && (
        <p className={styles.booster}>
          ⏱ Booster x2 активний: {boosterTime} с
        </p>
      )}
    </div>
  );
};

export default ClickerDisplay;
