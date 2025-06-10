import React, { useState } from "react";
import { useClicker } from "./hooks/useClicker";

import ClickerDisplay from "./components/ClickerDisplay";
import ClickButton from "./components/ClickButton";
import UpgradePanel from "./features/upgrades/UpgradePanel";
import BonusPanel from "./features/bonuses/BonusPanel";
import AntiBonusPanel from "./features/bonuses/AntiBonusPanel";
import PrestigePanel from "./features/prestige/PrestigePanel";
import SkinPanel from "./features/skins/SkinPanel";
import AchievementPanel from "./features/achievements/AchievementPanel";

import "./App.scss";
import styles from "./styles/AppLayout.module.scss";

function App() {
  const {
    credits,
    clickMultiplier,
    autoClickers,
    passiveIncome,
    upgradeDiscount,
    comboActive,
    duiktcoins,
    upgradeCounts,
    isClickBlocked,
    isBugged,
    isDDoSed,
    unlockedSkins,
    activeSkin,
    click,
    purchaseUpgrade,
    applyBonus,
    applyAntiBonus,
    removeAntiBonus,
    prestigeReset,
    unlockSkin,
    applySkin,
    saveMessage,
    bonusMessage,
    antiBonusMessage,
    boosterTime,
    unlockedAchievements,
  } = useClicker();

  const [activeTab, setActiveTab] = useState("upgrades");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "upgrades":
        return (
          <UpgradePanel
            credits={credits}
            state={{ clickMultiplier, autoClickers, passiveIncome, upgradeDiscount }}
            purchaseUpgrade={purchaseUpgrade}
            upgradeCounts={upgradeCounts}
          />
        );
      case "bonuses":
        return <BonusPanel credits={credits} applyBonus={applyBonus} />;
      case "antibonuses":
        return (
          <AntiBonusPanel
            isClickBlocked={isClickBlocked}
            isBugged={isBugged}
            isDDoSed={isDDoSed}
            removeAntiBonus={removeAntiBonus}
            credits={credits}
          />
        );
      case "prestige":
        return (
          <PrestigePanel
            credits={credits}
            duiktcoins={duiktcoins}
            prestigeReset={prestigeReset}
          />
        );
      case "skins":
        return (
          <SkinPanel
            unlockedSkins={unlockedSkins}
            activeSkin={activeSkin}
            credits={credits}
            duiktcoins={duiktcoins}
            unlockSkin={unlockSkin}
            applySkin={applySkin}
          />
        );
      case "achievements":
        return <AchievementPanel unlockedAchievements={unlockedAchievements} />

      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      {saveMessage && <div className={styles.saveMessage}>{saveMessage}</div>}
      {bonusMessage && <div className={styles.saveMessage}>{bonusMessage}</div>}
      {antiBonusMessage && <div className={styles.antiBonusMessage}>{antiBonusMessage}</div>}

      <ClickerDisplay credits={Math.floor(credits)} multiplier={clickMultiplier} boosterTime={boosterTime} />
      <ClickButton onClick={click} disabled={isClickBlocked} />

      {/* Панель вкладок */}
      <div className={styles.tabButtons}>
        <button onClick={() => setActiveTab("upgrades")}>🛠️ Апгрейди</button>
        <button onClick={() => setActiveTab("bonuses")}>🎁 Бонуси</button>
        <button onClick={() => setActiveTab("antibonuses")}>🚫 Антибонуси</button>
        <button onClick={() => setActiveTab("prestige")}>🔁 Престиж</button>
        <button onClick={() => setActiveTab("skins")}>🎨 Скіни</button>
        <button onClick={() => setActiveTab("achievements")}>🎖️ Досягнення</button>
      </div>

      {/* Активна панель */}
      <div className={styles.tabContent}>
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default App;
