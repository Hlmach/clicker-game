import { useState, useEffect, useRef } from "react";
import { loadGameState, saveGameState } from "../db/indexedDB";
import { skins } from "../features/skins/skinsConfig";
import clickSfx from '../assets/sounds/click.mp3';
import upgradeSfx from '../assets/sounds/upgrade.mp3';
import bonusSfx from '../assets/sounds/bonus.mp3';
import antiSfx from '../assets/sounds/antibonus.mp3';
import achievementSfx from '../assets/sounds/achievement.mp3';
import { useWithSound } from './useWithSound';
import { achievementsConfig } from "../features/achievements/achievementsConfig";

export const useClicker = () => {
  const playClick = useWithSound(clickSfx, { volume: 0.5 });
  const playUpgrade = useWithSound(upgradeSfx);
  const playBonus = useWithSound(bonusSfx);
  const playAnti = useWithSound(antiSfx);
  const playAchievement = useWithSound(achievementSfx, { volume: 0.7 });

  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalUpgrades, setTotalUpgrades] = useState(0);
  const [totalBoostersUsed, setTotalBoostersUsed] = useState(0);
  const [antibonusesRemoved, setAntibonusesRemoved] = useState(0);
  const [prestigeCount, setPrestigeCount] = useState(0);
  const [unlockedSkinCount, setUnlockedSkinCount] = useState(1);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Стан користувача
  const [credits, setCredits] = useState(0);
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [comboActive, setComboActive] = useState(false);
  const [upgradeDiscount, setUpgradeDiscount] = useState(0);
  const [duiktcoins, setDuiktcoins] = useState(0);
  const [upgradeCounts, setUpgradeCounts] = useState({});
  const [unlockedSkins, setUnlockedSkins] = useState(["default"]);
  const [activeSkin, setActiveSkin] = useState("default");

  // Обробка стану анти-бонусів
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const [isBugged, setIsBugged] = useState(false);
  const [isDDoSed, setIsDDoSed] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [antiBonusMessage, setAntiBonusMessage] = useState("");


  // Рефи для актуального зчитування у loop
  const creditsRef = useRef(0);
  const clickMultRef = useRef(1);
  const autoClickersRef = useRef(0);
  const passiveIncRef = useRef(0);
  const comboActiveRef = useRef(false);
  const upgradeDiscountRef = useRef(0);
  const duiktcoinsRef = useRef(0);
  const upgradeCountsRef = useRef({});
  const unlockedSkinsRef = useRef(["default"]);
  const activeSkinRef = useRef("default");
  const unlockedAchievementsRef = useRef([]);

  const [bonusMessage, setBonusMessage] = useState("");
  const [boosterTime, setBoosterTime] = useState(0);

  // Функція повідомлення про збереження
  const showSaveMessage = () => {
    setSaveMessage("Дані збережено ✅");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Завантаження з DB
  useEffect(() => {
    loadGameState().then((state) => {
      setCredits(state.credits || 0);
      setClickMultiplier(state.clickMultiplier || 1);
      setAutoClickers(state.autoClickers || 0);
      setPassiveIncome(state.passiveIncome || 0);
      setUpgradeDiscount(state.upgradeDiscount || 0);
      setDuiktcoins(state.duiktcoins || 0);
      setUpgradeCounts(state.upgradeCounts || {});
      setUnlockedSkins(state.unlockedSkins || ["default"]);
      setActiveSkin(state.activeSkin || "default");

      creditsRef.current = state.credits || 0;
      clickMultRef.current = state.clickMultiplier || 1;
      autoClickersRef.current = state.autoClickers || 0;
      passiveIncRef.current = state.passiveIncome || 0;
      upgradeDiscountRef.current = state.upgradeDiscount || 0;
      duiktcoinsRef.current = state.duiktcoins || 0;
      upgradeCountsRef.current = state.upgradeCounts || {};
      unlockedSkinsRef.current = state.unlockedSkins || ["default"];
      activeSkinRef.current = state.activeSkin || "default";
      setTotalClicks(state.totalClicks || 0);
      setTotalEarned(state.totalEarned || 0);
      setTotalUpgrades(state.totalUpgrades || 0);
      setTotalBoostersUsed(state.totalBoostersUsed || 0);
      setAntibonusesRemoved(state.antibonusesRemoved || 0);
      setPrestigeCount(state.prestigeCount || 0);
      setUnlockedSkinCount(state.unlockedSkinCount || 1);
      setUnlockedAchievements(state.unlockedAchievements || []);
      unlockedAchievementsRef.current = state.unlockedAchievements || [];

      setIsLoaded(true);

      // Запуск автозбереження
      autoSaveLoop();
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const gameState = {
      totalClicks,
      totalEarned,
      totalUpgrades,
      totalBoostersUsed,
      antibonusesRemoved,
      prestigeCount,
      unlockedSkins,
      totalSkinsAvailable: skins.length,
      timeSinceLastVisit: 0,
    };

    achievementsConfig.forEach(ach => {
      const isAlreadyUnlocked = unlockedAchievementsRef.current.includes(ach.id);
      if (!isAlreadyUnlocked && ach.condition(gameState)) {
        setUnlockedAchievements(prev => {
          const updated = [...prev, ach.id];
          unlockedAchievementsRef.current = updated;
          return updated;
        });
        playAchievement();
      }
    });

  }, [
    totalClicks,
    totalEarned,
    totalUpgrades,
    totalBoostersUsed,
    antibonusesRemoved,
    prestigeCount,
    unlockedSkins,
    isLoaded
  ]);

  const checkAchievement = (id) => {
    if (!unlockedAchievementsRef.current.includes(id)) {
      setUnlockedAchievements((prev) => {
        const updated = [...prev, id];
        unlockedAchievementsRef.current = updated;
        return updated;
      });
    }
  };

  // Автоклік щосекунди
  const getIncomeMultiplier = () => 1 + duiktcoinsRef.current * 0.1;
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDDoSed) {
        const income =
          (autoClickersRef.current * clickMultRef.current + passiveIncRef.current) *
          getIncomeMultiplier();
        setCredits((prev) => {
          const gain = Math.floor(income);
          setTotalEarned(e => e + gain);
          const updated = Math.floor(prev + income);
          creditsRef.current = updated;
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDDoSed]);

  // Анти-бонуси
  useEffect(() => {
    const interval = setInterval(() => {
      const effects = [];
      if (!isClickBlocked) effects.push("virus");
      if (!isBugged) effects.push("bug");
      if (!isDDoSed) effects.push("ddos");
      if (effects.length && Math.random() < 0.5) {
        applyAntiBonus(effects[Math.floor(Math.random() * effects.length)]);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [isClickBlocked, isBugged, isDDoSed]);

  // Скіни
  useEffect(() => {
    applySkin(activeSkin);
  }, [activeSkin]);

  // Обробники дій — оновлюють рeфи
  const click = () => {
    if (!isClickBlocked) {
      playClick();
      setTotalClicks(prev => {
        const total = prev + 1;
        if (total === 100) checkAchievement('click_100');
        return total;
      });
      const income = (isBugged ? 0 : clickMultiplier) * getIncomeMultiplier();
      setCredits((prev) => {
        const updated = Math.floor(prev + income);
        creditsRef.current = updated;
        return updated;
      });
    }
  };

  const activateCombo = () => {
    if (!comboActive) {
      setComboActive(true);
      comboActiveRef.current = true;
      setClickMultiplier((prev) => {
        const newVal = prev * 2;
        clickMultRef.current = newVal;
        return newVal;
      });
      setTimeout(() => {
        setClickMultiplier((prev) => {
          const newVal = prev / 2;
          clickMultRef.current = newVal;
          return newVal;
        });
        setComboActive(false);
        comboActiveRef.current = false;
      }, 10000);
    }
  };

  const purchaseUpgrade = (upgrade) => {
    playUpgrade();
    setTotalUpgrades(prev => {
      const total = prev + 1;
      if (total === 10) checkAchievement('upgrades_10');
      return total;
    });
    const count = upgradeCounts[upgrade.id] || 0;
    const cost = Math.max(
      1,
      Math.floor(upgrade.baseCost *
        (1 - upgradeDiscount) *
        (1 + count * 0.3))
    );
    if (credits < cost || (upgrade.maxCount && count >= upgrade.maxCount)) return;

    setCredits((prev) => {
      const updated = Math.floor(prev - cost);
      creditsRef.current = updated;
      return updated;
    });

    const effects = upgrade.effect({
      clickMultiplier,
      autoClickers,
      passiveIncome,
      upgradeDiscount
    }, count + 1);

    if (effects.clickMultiplier !== undefined) {
      setClickMultiplier(effects.clickMultiplier);
      clickMultRef.current = effects.clickMultiplier;
    }
    if (effects.autoClickers !== undefined) {
      setAutoClickers(effects.autoClickers);
      autoClickersRef.current = effects.autoClickers;
    }
    if (effects.passiveIncome !== undefined) {
      setPassiveIncome(effects.passiveIncome);
      passiveIncRef.current = effects.passiveIncome;
    }
    if (effects.upgradeDiscount !== undefined) {
      setUpgradeDiscount(effects.upgradeDiscount);
      upgradeDiscountRef.current = effects.upgradeDiscount;
    }
    if (effects.comboActive) activateCombo();

    const newCounts = { ...upgradeCounts, [upgrade.id]: count + 1 };
    setUpgradeCounts(newCounts);
    upgradeCountsRef.current = newCounts;
  };

  const applyBonus = (type) => {
    let message = "";
    let boosterDuration = 0;
    playBonus();

    if (type === "case" && credits >= 50) {
      const reward = Math.floor(Math.random() * 100) + 20;
      setCredits(prev => {
        const updated = Math.floor(prev - 50 + reward);
        creditsRef.current = updated;
        return updated;
      });
      message = `🎁 Кейс: +${reward} кредитів`;
    }

    if (type === "wheel" && credits >= 75) {
      setCredits(prev => {
        const updated = Math.floor(prev - 75);
        creditsRef.current = updated;
        return updated;
      });
      const outcome = Math.random();
      if (outcome < 0.33) {
        setClickMultiplier(prev => {
          const updated = prev + 1; clickMultRef.current = updated; return updated;
        });
        message = "🔄 Колесо: +1 до множника";
      } else if (outcome < 0.66) {
        setCredits(prev => {
          const updated = prev + 100; creditsRef.current = updated; return updated;
        });
        message = "🔄 Колесо: +100 кредитів";
      } else {
        setPassiveIncome(prev => {
          const updated = prev + 1; passiveIncRef.current = updated; return updated;
        });
        message = "🔄 Колесо: +1 пасивний дохід";
      }
    }

    if (type === "booster" && credits >= 100 && !comboActive) {
      setCredits(prev => {
        const updated = Math.floor(prev - 100);
        creditsRef.current = updated;
        return updated;
      });
      activateCombo();
      boosterDuration = 10;
      setBoosterTime(boosterDuration);
      message = "⚡ Booster x2 активовано";
      setTotalBoostersUsed(prev => {
        const total = prev + 1;
        if (total === 5) checkAchievement('booster_5');
        return total;
      });

      const timer = setInterval(() => {
        setBoosterTime(prev => {
          if (prev <= 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
    }

    setBonusMessage(message);
    setTimeout(() => setBonusMessage(""), 3000);

    return { message, boosterDuration };
  };

  const applyAntiBonus = (type) => {
    let message = "";

    if (type === "virus" && !isClickBlocked) {
      playAnti();
      setIsClickBlocked(true);
      setAntiBonusMessage("🦠 Вірус: клік заблоковано на 1 хвилину.");
      setTimeout(() => setIsClickBlocked(false), 60000);
      setTimeout(() => setAntiBonusMessage(""), 3000);
    }

    if (type === "bug" && !isBugged) {
      playAnti();
      setIsBugged(true);
      const prevMultiplier = clickMultRef.current;
      setClickMultiplier(0); 
      clickMultRef.current = 0;

      setAntiBonusMessage("🐛 Баг: множник кліку обнулено на 30 сек.");
      setTimeout(() => setAntiBonusMessage(""), 3000);
      setTimeout(() => {
        setClickMultiplier(clickMultRef.current = prevMultiplier); 
        setIsBugged(false);
      }, 30000);
    }

    if (type === "ddos" && !isDDoSed) {
      playAnti();
      setIsDDoSed(true);
      setAntiBonusMessage("🌐 DDoS: автоматичний дохід зупинено на 2 хвилини.");
      setTimeout(() => setIsDDoSed(false), 120000);
      setTimeout(() => setAntiBonusMessage(""), 3000);
    }

    if (message) {
      setAntiBonusMessage(message);
      setTimeout(() => setAntiBonusMessage(""), 3000);
    }
  };

  const removeAntiBonus = (type) => {
    if (type === "virus" && isClickBlocked && credits >= 2500) {
      setCredits((prev) => Math.floor(prev - 2500));
      setIsClickBlocked(false);
      setAntibonusesRemoved(prev => {
        const total = prev + 1;
        if (total === 3) checkAchievement('remove_anti_3');
        return total;
      });
    }

    if (type === "bug" && isBugged && credits >= 2000) {
      setCredits((prev) => Math.floor(prev - 2000));
      setIsBugged(false);
      setAntibonusesRemoved(prev => {
        const total = prev + 1;
        if (total === 3) checkAchievement('remove_anti_3');
        return total;
      });
    }

    if (type === "ddos" && isDDoSed && credits >= 3000) {
      setCredits((prev) => Math.floor(prev - 3000));
      setIsDDoSed(false);
      setAntibonusesRemoved(prev => {
        const total = prev + 1;
        if (total === 3) checkAchievement('remove_anti_3');
        return total;
      });
    }
  };

  const prestigeReset = () => {
    if (credits >= 1000) {
      setPrestigeCount(prev => {
        const total = prev + 1;
        if (total === 1) checkAchievement('prestige_first');
        return total;
      });
      const earned = Math.floor(credits / 1000);

      setDuiktcoins((prev) => {
        const updated = prev + earned;
        duiktcoinsRef.current = updated;
        return updated;
      });

      setCredits(0);
      creditsRef.current = 0;
      setClickMultiplier(1);
      clickMultRef.current = 1;
      setAutoClickers(0);
      autoClickersRef.current = 0;
      setPassiveIncome(0);
      passiveIncRef.current = 0;
      setUpgradeDiscount(0);
      upgradeDiscountRef.current = 0;
      setComboActive(false);
      comboActiveRef.current = false;
      setUpgradeCounts({});
      upgradeCountsRef.current = {};
      setIsClickBlocked(false);
      setIsBugged(false);
      setIsDDoSed(false);
    }
  };


  const unlockSkin = (skinId, cost, currency) => {
    if (unlockedSkins.includes(skinId)) return;

    if (currency === "credits" && credits >= cost) {
      setCredits((prev) => prev - cost);
      setUnlockedSkins((prev) => [...prev, skinId]);
    }

    if (currency === "duiktcoins" && duiktcoins >= cost) {
      setDuiktcoins((prev) => prev - cost);
      setUnlockedSkins((prev) => [...prev, skinId]);
    }
    setUnlockedSkinCount(prev => {
      const total = prev + 1;
      if (total === skins.length) checkAchievement('unlock_all_skins');
      return total;
    });
  };

  const applySkin = (skinId) => {
    const selected = skins.find((s) => s.id === skinId);
    if (!selected || !unlockedSkins.includes(skinId)) return;
    setActiveSkin(skinId);
    Object.entries(selected.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  // Рекурсивний автозапис
  const autoSaveLoop = () => {
    setTimeout(() => {
      const state = {
        credits: creditsRef.current,
        clickMultiplier: clickMultRef.current,
        autoClickers: autoClickersRef.current,
        passiveIncome: passiveIncRef.current,
        comboActive: comboActiveRef.current,
        upgradeDiscount: upgradeDiscountRef.current,
        duiktcoins: duiktcoinsRef.current,
        upgradeCounts: upgradeCountsRef.current,
        unlockedSkins: unlockedSkinsRef.current,
        activeSkin: activeSkinRef.current,
        totalClicks,
        totalEarned,
        totalUpgrades,
        totalBoostersUsed,
        antibonusesRemoved,
        prestigeCount,
        unlockedSkinCount,
        totalSkinsAvailable: skins.length,
        unlockedAchievements: unlockedAchievementsRef.current,
      };

      saveGameState(state);
      showSaveMessage();
      autoSaveLoop();
    }, 60000);
  };

  return {
    credits,
    clickMultiplier,
    autoClickers,
    passiveIncome,
    comboActive,
    upgradeDiscount,
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
    boosterTime,
    antiBonusMessage,
    totalClicks,
    totalEarned,
    totalUpgrades,
    totalBoostersUsed,
    antibonusesRemoved,
    prestigeCount,
    unlockedSkinCount,
    totalSkinsAvailable: skins.length,
    unlockedAchievements,
  };
};