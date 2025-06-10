import React from "react";
import styles from "../../styles/AntiBonusPanel.module.scss";

const AntiBonusPanel = ({
  isClickBlocked,
  isBugged,
  isDDoSed,
  removeAntiBonus,
  credits,
}) => {
  return (
    <div className={styles.panel}>
      <h2>Активні Антибонуси</h2>

      {isClickBlocked && (
        <div className={styles.card}>
          <p>🦠 <strong>Вірус:</strong> кнопка кліку заблокована на 1 хвилину.</p>
          <button onClick={() => removeAntiBonus("virus")} disabled={credits < 2500}>
            Видалити вірус (2500 кредитів)
          </button>
        </div>
      )}

      {isBugged && (
        <div className={styles.card}>
          <p>🐞 <strong>Баг:</strong> множник кліку тимчасово обнулено.</p>
          <button onClick={() => removeAntiBonus("bug")} disabled={credits < 2000}>
            Виправити баг (2000 кредитів)
          </button>
        </div>
      )}

      {isDDoSed && (
        <div className={styles.card}>
          <p>🌐 <strong>DDoS:</strong> автоінком та пасивний дохід зупинено.</p>
          <button onClick={() => removeAntiBonus("ddos")} disabled={credits < 3000}>
            Усунути атаку (3000 кредитів)
          </button>
        </div>
      )}

      {!isClickBlocked && !isBugged && !isDDoSed && (
        <p>Все працює стабільно 😌</p>
      )}
    </div>
  );
};

export default AntiBonusPanel;
