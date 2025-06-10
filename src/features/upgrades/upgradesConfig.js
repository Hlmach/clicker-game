export const upgrades = [
  {
    id: "clickValue",
    name: "Click Value",
    description: "Збільшує дохід за клік",
    baseCost: 50,
    effect: (state, count) => ({
      clickMultiplier: state.clickMultiplier + 1,
    }),
  },
  {
    id: "autoClicker",
    name: "Auto Clicker",
    description: "Надає автоматичні кліки щосекунди",
    baseCost: 100,
    maxCount: 5,
    effect: (state, count) => ({
      autoClickers: state.autoClickers + 1,
    }),
  },
  {
    id: "passiveIncome",
    name: "Passive Income",
    description: "Додає пасивний дохід",
    baseCost: 120,
    effect: (state, count) => ({
      passiveIncome: state.passiveIncome + 1,
    }),
  },
  {
    id: "upgradeEfficiency",
    name: "Upgrade Efficiency",
    description: "Зменшує вартість усіх апгрейдів на 10%",
    baseCost: 300,
    maxCount: 5,
    effect: (state, count) => {
      const newDiscount = Math.min(0.5, (state.upgradeDiscount || 0) + 0.1);
      return {
        upgradeDiscount: newDiscount,
      };
    },
  },
  {
    id: "comboMode",
    name: "Combo Mode",
    description: "Подвоює прибуток на 10 секунд",
    baseCost: 200,
    effect: (state, count) => ({
      comboActive: true,
    }),
  },
];
