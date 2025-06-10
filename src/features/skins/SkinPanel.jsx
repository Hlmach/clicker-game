import React from "react";
import { skins } from "./skinsConfig";
import styles from "../../styles/SkinPanel.module.scss";

const SkinPanel = ({
  unlockedSkins,
  activeSkin,
  credits,
  duiktcoins,
  unlockSkin,
  applySkin,
}) => {
  return (
    <div className={styles.panel}>
      <h2>Скіни</h2>
      <div className={styles.skinList}>
        {skins.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isActive = activeSkin === skin.id;

          const canAffordCredits = skin.costCredits && credits >= skin.costCredits;
          const canAffordCoins = skin.costDuiktcoins && duiktcoins >= skin.costDuiktcoins;
          const canAfford = canAffordCredits || canAffordCoins;

          return (
            <div
              key={skin.id}
              className={`${styles.skinCard} ${isActive ? styles.active : ""}`}
            >
              <h3>{skin.name}</h3>
              <p>{skin.description}</p>

              <div className={styles.palette}>
                {Object.values(skin.colors).map((color, i) => (
                  <div
                    key={i}
                    className={styles.colorBox}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {!isUnlocked ? (
                <>
                  {skin.costCredits > 0 && (
                    <p className={styles.price}>
                      💰 {skin.costCredits} кредитів
                    </p>
                  )}
                  {skin.costDuiktcoins > 0 && (
                    <p className={styles.price}>
                      🪙 {skin.costDuiktcoins} Duiktcoins
                    </p>
                  )}
                  <button
                    disabled={!canAfford}
                    onClick={() =>
                      unlockSkin(
                        skin.id,
                        skin.costCredits > 0 ? skin.costCredits : skin.costDuiktcoins,
                        skin.costCredits > 0 ? "credits" : "duiktcoins"
                      )
                    }
                  >
                    Відкрити
                  </button>
                </>
              ) : (
                <button disabled={isActive} onClick={() => applySkin(skin.id)}>
                  {isActive ? "✅ Активний" : "🎨 Застосувати"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkinPanel;
