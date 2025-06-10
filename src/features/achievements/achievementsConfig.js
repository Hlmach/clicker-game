// src/features/achievements/achievementsConfig.js
export const achievementsConfig = [
  {
    id: "first_click",
    title: "Перший клік",
    desc: "Зроби свій перший клік.",
    condition: (s) => s.totalClicks >= 1,
  },
  {
    id: "click_novice",
    title: "Клікер-початківець",
    desc: "Наклікай 1 000 разів.",
    condition: (s) => s.totalClicks >= 1000,
  },
  {
    id: "click_machine",
    title: "Клік-машина",
    desc: "Зроби 10 000 кліків.",
    condition: (s) => s.totalClicks >= 10000,
  },
  {
    id: "wealthy",
    title: "Багатій",
    desc: "Отримай 10 000 кредитів загалом.",
    condition: (s) => s.totalEarned >= 10000,
  },
  {
    id: "millionaire",
    title: "Мільйонер",
    desc: "Зароби 1 000 000 кредитів за весь час.",
    condition: (s) => s.totalEarned >= 1000000,
  },
  {
    id: "upgrade_enthusiast",
    title: "Любитель апгрейдів",
    desc: "Купи 50 апгрейдів.",
    condition: (s) => s.totalUpgrades >= 50,
  },
  {
    id: "combo_master",
    title: "Майстер бустерів",
    desc: "Активуй 10 бустерів.",
    condition: (s) => s.totalBoostersUsed >= 10,
  },
  {
    id: "anti_hacker",
    title: "Борець з вірусами",
    desc: "Усунути 10 антибонусів.",
    condition: (s) => s.antibonusesRemoved >= 10,
  },
  {
    id: "prestige_legend",
    title: "Престиж-легенда",
    desc: "Зроби 10 престижів.",
    condition: (s) => s.prestigeCount >= 10,
  },
  {
    id: "skin_collector",
    title: "Колекціонер скінів",
    desc: "Відкрий усі доступні скіни.",
    condition: (s) => s.unlockedSkins?.length >= s.totalSkinsAvailable,
  },
  {
    id: "offline_return",
    title: "Повернення героя",
    desc: "Повернись у гру після 12 годин.",
    condition: (s) => s.timeSinceLastVisit >= 43200, // 12 год у секундах
  },
];
