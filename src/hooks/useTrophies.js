import { TROPHY_DEFINITIONS, TROPHY_TIERS } from '../data/trophyData';

/**
 * Calcule les métriques nécessaires à l'évaluation des trophées
 */
function computeTrophyMetrics(yearData) {
  let totalDaysCompleted = 0;
  let longestStreak = 0;
  let currentStreak = 0;
  let totalManaUsed = 0;
  let totalStaffUsed = 0;
  let monthsWithScore = 0;
  let perfectMonths = 0;

  const allDays = yearData
    .flatMap(m => m.weeks.flatMap(w => w.days))
    .sort((a, b) => a.globalIndex - b.globalIndex);

  for (const day of allDays) {
    if (day.completed) {
      totalDaysCompleted++;
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  yearData.forEach(month => {
    const monthDays = month.weeks.flatMap(w => w.days);
    const completedInMonth = monthDays.filter(d => d.completed).length;
    if (completedInMonth > 0) monthsWithScore++;
    if (completedInMonth === monthDays.length && monthDays.length > 0) perfectMonths++;

    totalManaUsed += (month.manaUsed || []).filter(Boolean).length;
    if (month.staffUsed) totalStaffUsed++;
  });

  return { totalDaysCompleted, longestStreak, totalManaUsed, totalStaffUsed, monthsWithScore, perfectMonths };
}

/**
 * Évalue tous les trophées et retourne les nouveaux débloqués
 * @param {Array} yearData — données de l'année
 * @param {Object} score — résultat de calculateScore(yearData)
 * @param {Object} existingTrophies — { trophy_id: ISO_date, ... }
 * @returns {{ updatedTrophies: Object, newlyUnlocked: Array }}
 */
export function evaluateTrophies(yearData, score, existingTrophies = {}) {
  const now = new Date().toISOString();
  const updated = { ...existingTrophies };
  const newlyUnlocked = [];

  const m = computeTrophyMetrics(yearData);

  const checks = {
    // Bronze
    premier_sang:        m.totalDaysCompleted >= 1,
    chasseur_novice:     score.monstersDefeated >= 10,
    piegeur:             score.trapsDefeated >= 5,
    dimanche_noir:       score.bossesDefeated >= 1,
    collectionneur:      score.manaPotionsEarned >= 1,
    alchimiste_debutant: m.totalManaUsed >= 1,
    baton_du_sage:       m.totalStaffUsed >= 1,
    premiere_aile:       score.completeWings >= 1,
    pas_de_repos:        m.longestStreak >= 7,
    aventurier:          score.totalScore >= 50,
    centurion:           score.totalScore >= 100,
    revenant:            score.undeadDefeated >= 1,
    trois_mois:          m.monthsWithScore >= 3,
    cinq_boss:           score.bossesDefeated >= 5,
    dix_pieges:          score.trapsDefeated >= 10,

    // Argent
    chasseur_aguerri:    score.monstersDefeated >= 75,
    roi_des_boss:        score.bossesDefeated >= 25,
    conquerant_ailes:    score.completeWings >= 10,
    maitre_potions:      m.totalManaUsed >= 10,
    endurance:           m.longestStreak >= 21,
    mi_parcours:         score.totalScore >= 500,
    mois_parfait:        m.perfectMonths >= 1,
    chasseur_morts:      score.undeadDefeated >= 25,
    baton_maitrise:      m.totalStaffUsed >= 6,
    piege_expert:        score.trapsDefeated >= 25,

    // Or
    legende_donjon:      score.totalScore >= 1000,
    inarretable:         m.longestStreak >= 60,
    perfectionniste:     m.perfectMonths >= 3,
    maitre_armes:        m.totalDaysCompleted >= 200,
    donjon_complet:      m.totalDaysCompleted >= 365,
  };

  for (const [trophyId, earned] of Object.entries(checks)) {
    if (earned && !updated[trophyId]) {
      updated[trophyId] = now;
      const def = TROPHY_DEFINITIONS.find(t => t.id === trophyId);
      if (def) newlyUnlocked.push(def);
    }
  }

  return { updatedTrophies: updated, newlyUnlocked };
}
