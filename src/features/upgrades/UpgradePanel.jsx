import React, { useState } from "react";
import { upgrades } from "./upgradesConfig";
import styles from "../../styles/UpgradePanel.module.scss";

const UpgradePanel = ({ credits, state, purchaseUpgrade, upgradeCounts }) => {
  const handlePurchase = (upgrade) => {
    const count = upgradeCounts[upgrade.id] || 0;
    const discount = state.upgradeDiscount || 0;
    const cost = Math.max(1, Math.floor(upgrade.baseCost * (1 - discount) * (1 + count * 0.3)));

    if (credits < cost) return;
    if (upgrade.maxCount && count >= upgrade.maxCount) return;

    purchaseUpgrade(upgrade);
  };

  return (
    <div className={styles.panel}>
      <h2>Апгрейди</h2>
      {upgrades.map((upgrade) => {
        const count = upgradeCounts[upgrade.id] || 0;
        const discount = state.upgradeDiscount || 0;
        const cost = Math.max(1, Math.floor(upgrade.baseCost * (1 - discount) * (1 + count * 0.3)));
        const isMaxed = upgrade.maxCount && count >= upgrade.maxCount;

        return (
          <div key={upgrade.id} className={styles.card}>
            <h3>{upgrade.name}</h3>
            <p>{upgrade.description}</p>
            <p>Кількість: <strong>{count}</strong></p>
            <p>Вартість: <strong>{isMaxed ? "Розпродано" : `${cost} кредитів`}</strong></p>
            <button onClick={() => handlePurchase(upgrade)} disabled={isMaxed || credits < cost}>
              {isMaxed ? "Розпродано" : "Купити"}
            </button>
          </div>
        );
      })}
    </div>
  );
};


export default UpgradePanel;
