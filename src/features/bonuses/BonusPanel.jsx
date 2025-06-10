import React, { useState } from "react";
import styles from "../../styles/BonusPanel.module.scss";

const baseCosts = {
  case: 50,
  wheel: 75,
  booster: 100,
};

export default function BonusPanel({ credits, applyBonus }) {
  const [counts, setCounts] = useState({ case: 0, wheel: 0, booster: 0 });

  const handleBonus = (type) => {
    const count = counts[type];
    const cost = Math.ceil(baseCosts[type] * (1 + count * 0.2));
    if (credits < cost) return;

    applyBonus(type);
    setCounts((prev) => ({ ...prev, [type]: count + 1 }));
  };

  return (
    <div className={styles.panel}>
      <h2>Бонуси</h2>

      {["case", "wheel", "booster"].map((type) => {
        const count = counts[type];
        const cost = Math.ceil(baseCosts[type] * (1 + count * 0.2));
        const label = {
          case: "🎁 Кейс",
          wheel: "🔄 Колесо фортуни",
          booster: "⚡ Booster x2"
        }[type];

        return (
          <div key={type} className={styles.card}>
            <p>{label}</p>
            <p>Ціна: {cost}</p>
            <button onClick={() => handleBonus(type)} disabled={credits < cost}>
              Активувати
            </button>
          </div>
        );
      })}
    </div>
  );
}
