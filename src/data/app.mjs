// Facts copied from the app's own code (lib/data.dart). Do not invent numbers here.
export const tasks = [
  { id: 'sweep', key: 'taskSweepTitle', emoji: '🧹', stars: 3, time: 15, min: 4, max: 14, color: '#FF6B35' },
  { id: 'dishes', key: 'taskDishesTitle', emoji: '🍽️', stars: 4, time: 20, min: 7, max: 14, color: '#4D96FF' },
  { id: 'bed', key: 'taskBedTitle', emoji: '🛏️', stars: 2, time: 10, min: 4, max: 14, color: '#845EC2' },
  { id: 'plants', key: 'taskPlantsTitle', emoji: '🌿', stars: 2, time: 10, min: 3, max: 14, color: '#3DBE6C' },
  { id: 'trash', key: 'taskTrashTitle', emoji: '🗑️', stars: 3, time: 10, min: 6, max: 14, color: '#2BB5AC' },
  { id: 'toys', key: 'taskToysTitle', emoji: '🧸', stars: 2, time: 15, min: 3, max: 10, color: '#F0679A' },
  { id: 'vacuum', key: 'taskVacuumTitle', emoji: '🌀', stars: 4, time: 25, min: 8, max: 14, color: '#E0A800' },
  { id: 'laundry', key: 'taskLaundryTitle', emoji: '👕', stars: 4, time: 20, min: 8, max: 14, color: '#FF6B35' },
];
export const badges = [
  ['👣', 'badgeFirstStep'], ['🧹', 'badgeCleanHero'], ['🍽️', 'badgeKitchenHelper'], ['🌱', 'badgeGardenLover'],
  ['📦', 'badgeOrganizer'], ['🦸', 'badgeSuperHelper'], ['📅', 'badgeWeekHelper'], ['🥉', 'badgeStars10'],
  ['🥈', 'badgeStars25'], ['🥇', 'badgeStars50'], ['💎', 'badgeStars100'], ['🔥', 'badgeStreak3'],
  ['🔥🔥', 'badgeStreak7'], ['⚡', 'badgeStreak14'], ['💨', 'badgeSpeedStar'], ['📷', 'badgePhotoProof'],
];
export const ranks = [
  { at: 0, icon: '⭐', key: 'levelNew' }, { at: 10, icon: '🥉', key: 'levelBronze' }, { at: 25, icon: '🥈', key: 'levelSilver' },
  { at: 50, icon: '🥇', key: 'levelGold' }, { at: 100, icon: '💎', key: 'levelDiamond' },
];
export const rewards = [
  { key: 'r_ice', emoji: '🍦', cost: 15 }, { key: 'r_game', emoji: '🎮', cost: 20 },
  { key: 'r_dinner', emoji: '🍕', cost: 25 }, { key: 'r_movie', emoji: '🎬', cost: 30 },
];
