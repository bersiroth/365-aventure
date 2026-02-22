import { MONTH_CONFIGS } from './monthConfigs';

/**
 * Génère les 365 jours de l'année 2026
 * 1er Janvier 2026 = Jeudi (index 4)
 */

const MONTHS_2026 = [
  { name: 'Janvier', days: 31, startDay: 4 }, // Jeudi
  { name: 'Février', days: 28, startDay: 0 }, // Dimanche
  { name: 'Mars', days: 31, startDay: 0 }, // Dimanche
  { name: 'Avril', days: 30, startDay: 3 }, // Mercredi
  { name: 'Mai', days: 31, startDay: 5 }, // Vendredi
  { name: 'Juin', days: 30, startDay: 1 }, // Lundi
  { name: 'Juillet', days: 31, startDay: 3 }, // Mercredi
  { name: 'Août', days: 31, startDay: 6 }, // Samedi
  { name: 'Septembre', days: 30, startDay: 2 }, // Mardi
  { name: 'Octobre', days: 31, startDay: 4 }, // Jeudi
  { name: 'Novembre', days: 30, startDay: 0 }, // Dimanche
  { name: 'Décembre', days: 31, startDay: 2 }, // Mardi
];

const DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/**
 * Génère la structure complète des 365 jours de 2026
 */
export function generateYear2026() {
  const year = [];
  let globalDayIndex = 0;

  MONTHS_2026.forEach((month, monthIndex) => {
    const monthData = {
      name: month.name,
      index: monthIndex,
      weeks: [],
    };

    let currentWeek = [];
    let weekIndex = 0;

    let manaCount = 0;

    for (let day = 1; day <= month.days; day++) {
      const dayOfWeekIndex = (month.startDay + day - 1) % 7;
      const dayOfWeek = DAYS_OF_WEEK[dayOfWeekIndex];
      const isBoss = dayOfWeekIndex === 0; // Dimanche

      // Lire la configuration du mois (monthConfigs.js)
      const dayConfig = MONTH_CONFIGS[monthIndex]?.[day];
      const type = dayConfig?.type ?? (isBoss ? 'BOSS' : 'MONSTER');
      const value = dayConfig?.value ?? (isBoss ? 17 : 1);
      const hasMana = dayConfig?.hasMana ?? false;
      const isElite = dayConfig?.isElite ?? false;
      const isInvisible = dayConfig?.isInvisible ?? false;
      const isInfluenced = dayConfig?.isInfluenced ?? false;
      const value2 = dayConfig?.value2 ?? null;
      const manaSlot = hasMana ? manaCount++ : null;

      const dayData = {
        id: `day-${globalDayIndex}`,
        globalIndex: globalDayIndex,
        monthIndex,
        day,
        dayOfWeek,
        dayOfWeekIndex,
        type,
        completed: false,
        value,
        value2,
        hasMana,
        manaSlot,
        isElite,
        isInvisible,
        isInfluenced,
      };

      currentWeek.push(dayData);
      globalDayIndex++;

      // Nouvelle semaine le lundi (index 1) ou fin du mois
      if (dayOfWeekIndex === 6 || day === month.days) {
        monthData.weeks.push({
          id: `week-${monthIndex}-${weekIndex}`,
          weekIndex,
          days: currentWeek,
          completed: false,
        });
        currentWeek = [];
        weekIndex++;
      }
    }

    monthData.manaUsed  = new Array(manaCount).fill(false);
    monthData.hasStaff  = monthIndex >= 3; // Bâton du Sage — avril et suivants
    monthData.staffUsed = [false, false];
    monthData.hasCape   = monthIndex >= 5; // Cape des Illusions — juin et suivants
    monthData.capeUsed  = [false, false];
    monthData.hasRing   = monthIndex >= 7; // Anneau Ancien — août et suivants
    monthData.ringUsed  = [false, false];
    year.push(monthData);
  });

  return year;
}

/**
 * Retourne les informations d'une semaine spécifique
 */
export function getWeekInfo(yearData, monthIndex, weekIndex) {
  return yearData[monthIndex]?.weeks[weekIndex] || null;
}

/**
 * Calcule le score total selon les règles du jeu
 * - 1 point par monstre/piège vaincu
 * - 2 points par boss vaincu
 * - 3 points bonus par aile (semaine) complète (7 combats remportés)
 */
export function calculateScore(yearData) {
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

  yearData.forEach(month => {
    // ── Nécromancien : vérification par mois ──
    const monthDays = month.weeks.flatMap(w => w.days);
    const monthHasNecromancer = monthDays.some(d => d.type === 'NECROMANCER');
    const monthNecromancerDefeated = monthDays.some(d => d.type === 'NECROMANCER' && d.completed);

    // ── Points par jour ──
    month.weeks.forEach(week => {
      week.days.forEach(day => {
        if (!day.completed) return;
        if (day.type === 'NECROMANCER') { totalScore += 1; necromancersDefeated++; }
        else if (day.type === 'BOSS')   {
          totalScore += 2; bossesDefeated++;
          if (day.isInfluenced) { totalScore += 10; influencedBossesDefeated++; }
        }
        else if (day.type === 'TRAP')   { totalScore += 1; trapsDefeated++;  }
        else if (day.type === 'UNDEAD') {
          undeadDefeated++;
          if (!monthHasNecromancer || monthNecromancerDefeated) totalScore += 1;
        }
        else if (day.type === 'DOUBLE') { totalScore += 3; doublesDefeated++; }
        else                            { totalScore += 1; monstersDefeated++; }
        if (day.isElite) eliteDefeated++;
        if (day.hasMana) manaPotionsEarned++;
        if (day.isInvisible) invisiblesDefeated++;
      });
    });

    // ── Bonus aile : calculé sur les lignes d'affichage Mon→Sun ──
    // (même logique que DungeonGrid pour que visuel et score soient cohérents)
    const allDays = month.weeks.flatMap(w => w.days);
    if (allDays.length === 0) return;
    const firstDayIndex = allDays[0].dayOfWeekIndex;
    const offset = (firstDayIndex - 1 + 7) % 7;
    const numRows = Math.ceil((offset + allDays.length) / 7);

    for (let row = 0; row < numRows; row++) {
      const rowDays = [];
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col - offset;
        if (idx >= 0 && idx < allDays.length) rowDays.push(allDays[idx]);
      }
      if (rowDays.length === 7 && rowDays.every(d => d.completed)) {
        totalScore += 3;
        completeWings++;
      }
    }
  });

  return {
    totalScore,
    monstersDefeated,
    undeadDefeated,
    eliteDefeated,
    doublesDefeated,
    trapsDefeated,
    bossesDefeated,
    completeWings,
    manaPotionsEarned,
    invisiblesDefeated,
    necromancersDefeated,
    influencedBossesDefeated,
  };
}

/**
 * Vérifie si une semaine est complète (7 combats remportés)
 */
export function isWeekComplete(week) {
  return week.days.filter(day => day.completed).length === 7;
}

/**
 * Sérialise uniquement les états "complété" (365 bits → ~62 chars base64).
 * Beaucoup plus court que de sérialiser tout yearData.
 */
export function serializeSave(yearData) {
  const dayBits = yearData.flatMap(month =>
    month.weeks.flatMap(week => week.days.map(day => day.completed ? 1 : 0))
  );
  const manaBits  = yearData.flatMap(month =>
    (month.manaUsed ?? []).map(used => used ? 1 : 0)
  );
  const staffBits  = yearData.map(month => month.staffUsed?.[0] ? 1 : 0);
  const capeBits   = yearData.map(month => month.capeUsed?.[0]  ? 1 : 0);
  const ringBits   = yearData.map(month => month.ringUsed?.[0]  ? 1 : 0);
  // Bits du 2e slot (à partir d'octobre — rétrocompatibilité : absents = false)
  const staffBits2 = yearData.map(month => month.staffUsed?.[1] ? 1 : 0);
  const capeBits2  = yearData.map(month => month.capeUsed?.[1]  ? 1 : 0);
  const ringBits2  = yearData.map(month => month.ringUsed?.[1]  ? 1 : 0);
  const bits = [...dayBits, ...manaBits, ...staffBits, ...capeBits, ...ringBits, ...staffBits2, ...capeBits2, ...ringBits2];
  // Empaquetage en octets (LSB en premier)
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      byte |= (bits[i + j] << j);
    }
    bytes.push(byte);
  }
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Désérialise un save compact : génère yearData frais et applique les états.
 * Retourne null si le format est invalide.
 */
export function deserializeSave(encoded) {
  try {
    const binary = atob(encoded);
    const bits = [];
    for (let i = 0; i < binary.length; i++) {
      const byte = binary.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        bits.push((byte >> j) & 1);
      }
    }
    const yearData = generateYear2026();
    let idx = 0;
    yearData.forEach(month => {
      month.weeks.forEach(week => {
        week.days.forEach(day => {
          day.completed = idx < bits.length ? bits[idx++] === 1 : false;
        });
        week.completed = week.days.filter(d => d.completed).length === 7;
      });
    });
    // Lire les bits mana (optionnels — rétrocompatibilité avec les anciennes sauvegardes)
    yearData.forEach(month => {
      month.manaUsed = month.manaUsed.map(() =>
        idx < bits.length ? bits[idx++] === 1 : false
      );
    });
    // Lire les bits slot 0 (optionnels)
    yearData.forEach(month => {
      month.staffUsed = [idx < bits.length ? bits[idx++] === 1 : false, false];
    });
    yearData.forEach(month => {
      month.capeUsed  = [idx < bits.length ? bits[idx++] === 1 : false, false];
    });
    yearData.forEach(month => {
      month.ringUsed  = [idx < bits.length ? bits[idx++] === 1 : false, false];
    });
    // Lire les bits slot 1 (optionnels — nouvelles sauvegardes)
    yearData.forEach(month => {
      month.staffUsed[1] = idx < bits.length ? bits[idx++] === 1 : false;
    });
    yearData.forEach(month => {
      month.capeUsed[1]  = idx < bits.length ? bits[idx++] === 1 : false;
    });
    yearData.forEach(month => {
      month.ringUsed[1]  = idx < bits.length ? bits[idx++] === 1 : false;
    });
    return yearData;
  } catch {
    return null;
  }
}
