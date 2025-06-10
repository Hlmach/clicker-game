import React from "react";
import { achievementsConfig } from "./achievementsConfig";
import styles from "../../styles/AchievementPanel.module.scss";

const AchievementPanel = ({ unlockedAchievements }) => {
  return (
    <div className={styles.panel}>
      <h2>🎖️ Досягнення</h2>
      <ul className={styles.list}>
        {achievementsConfig.map(ach => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <li key={ach.id} className={isUnlocked ? styles.unlocked : styles.locked}>
              <strong>{ach.title}</strong>
              <p>{ach.desc}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AchievementPanel;
