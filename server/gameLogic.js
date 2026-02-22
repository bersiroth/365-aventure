import { MONTH_CONFIGS } from '../src/data/monthConfigs.js';

const MONTHS_2026 = [
  { name: 'Janvier', days: 31, startDay: 4 },
  { name: 'Février', days: 28, startDay: 0 },
  { name: 'Mars', days: 31, startDay: 0 },
  { name: 'Avril', days: 30, startDay: 3 },
  { name: 'Mai', days: 31, startDay: 5 },
  { name: 'Juin', days: 30, startDay: 1 },
  { name: 'Juillet', days: 31, startDay: 3 },
  { name: 'Août', days: 31, startDay: 6 },
  { name: 'Septembre', days: 30, startDay: 2 },
  { name: 'Octobre', days: 31, startDay: 4 },
  { name: 'Novembre', days: 30, startDay: 0 },
  { name: 'Décembre', days: 31, startDay: 2 },
];

/**
 * Decode a compact base64 save string into an array of 365 booleans.
 * Returns null if the format is invalid.
 */
export function decodeSave(encoded) {
  if (!encoded || typeof encoded !== 'string') return null;
  try {
    const binary = Buffer.from(encoded, 'base64');
    const bits = [];
    for (let i = 0; i < binary.length; i++) {
      const byte = binary[i];
      for (let j = 0; j < 8; j++) {
        bits.push((byte >> j) & 1);
      }
    }
    // We expect exactly 365 days (bits may have padding up to next byte boundary)
    if (bits.length < 365) return null;
    return bits.slice(0, 365);
  } catch {
    return null;
  }
}

/**
 * Compute score from a compact base64 save string.
 * Returns the score object matching the frontend's calculateScore output.
 */
export function computeScoreFromSave(encoded) {
  const bits = decodeSave(encoded);
  if (!bits) {
    return { totalScore: 0, monstersDefeated: 0, trapsDefeated: 0, bossesDefeated: 0, completeWings: 0 };
  }

  let totalScore = 0;
  let monstersDefeated = 0;
  let undeadDefeated = 0;
  let eliteDefeated = 0;
  let doublesDefeated = 0;
  let trapsDefeated = 0;
  let bossesDefeated = 0;
  let completeWings = 0;
  let manaPotionsEarned = 0;
  let invisiblesDefeated = 0;
  let necromancersDefeated = 0;
  let influencedBossesDefeated = 0;
  let globalIndex = 0;

  MONTHS_2026.forEach((month, monthIndex) => {
    // Collecter les données du mois
    const monthDays = [];
    for (let day = 1; day <= month.days; day++) {
      const dayOfWeekIndex = (month.startDay + day - 1) % 7;
      const isBoss = dayOfWeekIndex === 0;
      const dayConfig = MONTH_CONFIGS[monthIndex]?.[day];
      const type = dayConfig?.type ?? (isBoss ? 'BOSS' : 'MONSTER');
      const hasMana = dayConfig?.hasMana ?? false;
      const isElite = dayConfig?.isElite ?? false;
      const isInvisible = dayConfig?.isInvisible ?? false;
      const isInfluenced = dayConfig?.isInfluenced ?? false;
      const completed = bits[globalIndex] === 1;
      monthDays.push({ dayOfWeekIndex, type, hasMana, isElite, isInvisible, isInfluenced, completed });
      globalIndex++;
    }

    // Vérification nécromancien par mois
    const monthHasNecromancer = monthDays.some(d => d.type === 'NECROMANCER');
    const monthNecromancerDefeated = monthDays.some(d => d.type === 'NECROMANCER' && d.completed);

    // Scoring du mois
    monthDays.forEach(d => {
      if (!d.completed) return;
      if (d.type === 'NECROMANCER') { totalScore += 1; necromancersDefeated++; }
      else if (d.type === 'BOSS')   {
        totalScore += 2; bossesDefeated++;
        if (d.isInfluenced) { totalScore += 10; influencedBossesDefeated++; }
      }
      else if (d.type === 'TRAP')   { totalScore += 1; trapsDefeated++; }
      else if (d.type === 'UNDEAD') {
        undeadDefeated++;
        if (!monthHasNecromancer || monthNecromancerDefeated) totalScore += 1;
      }
      else if (d.type === 'DOUBLE') { totalScore += 3; doublesDefeated++; }
      else                          { totalScore += 1; monstersDefeated++; }
      if (d.isElite) eliteDefeated++;
      if (d.hasMana) manaPotionsEarned++;
      if (d.isInvisible) invisiblesDefeated++;
    });

    // Wing bonus: same Mon→Sun grid logic as frontend
    if (monthDays.length === 0) return;
    const firstDayIndex = monthDays[0].dayOfWeekIndex;
    const offset = (firstDayIndex - 1 + 7) % 7;
    const numRows = Math.ceil((offset + monthDays.length) / 7);

    for (let row = 0; row < numRows; row++) {
      const rowDays = [];
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col - offset;
        if (idx >= 0 && idx < monthDays.length) rowDays.push(monthDays[idx]);
      }
      if (rowDays.length === 7 && rowDays.every(d => d.completed)) {
        totalScore += 3;
        completeWings++;
      }
    }
  });

  return { totalScore, monstersDefeated, undeadDefeated, eliteDefeated, doublesDefeated, trapsDefeated, bossesDefeated, completeWings, manaPotionsEarned, invisiblesDefeated, necromancersDefeated, influencedBossesDefeated };
}
