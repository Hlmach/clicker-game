import React from "react";
import styles from "../../styles/PrestigePanel.module.scss";

const PrestigePanel = ({ duiktcoins, credits, prestigeReset }) => {
  const canPrestige = credits >= 1000;
  const reward = Math.floor(credits / 1000);

  return (
    <div className={styles.panel}>
      <h2>Престиж</h2>
      <p>Duiktcoins: <strong>{duiktcoins}</strong></p>
      <p>
        Отримай <strong>{reward}</strong> Duiktcoins за скидання {credits} кредитів
      </p>
      <button
        onClick={prestigeReset}
        disabled={!canPrestige}
      >
        Застосувати престиж
      </button>
    </div>
  );
};

export default PrestigePanel;
