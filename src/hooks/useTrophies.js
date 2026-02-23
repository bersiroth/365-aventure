import { TROPHY_DEFINITIONS } from '../data/trophyData';

/**
 * Calcule les métriques nécessaires à l'évaluation des trophées
 */
function computeTrophyMetrics(yearData) {
  let totalDaysCompleted = 0;
  let longestStreak = 0;
  let currentStreak = 0;

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

  return { totalDaysCompleted, longestStreak };
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
    premier_sang:      m.totalDaysCompleted >= 1,
    piegeur:           score.trapsDefeated >= 1,
    premier_boss:      score.bossesDefeated >= 1,
    chasseur_20:       score.monstersDefeated >= 20,
    premiere_aile:     score.completeWings >= 1,
    alchimiste:        score.manaPotionsEarned >= 1,
    serie_7:           m.longestStreak >= 7,
    score_50:          score.totalScore >= 50,
    score_100:         score.totalScore >= 100,
    revenant:          score.undeadDefeated >= 1,
    elite_abattu:      score.eliteDefeated >= 1,
    double_vaincu:     score.doublesDefeated >= 1,
    invisible_vaincu:  score.invisiblesDefeated >= 1,
    influence_brisee:  score.influencedBossesDefeated >= 1,
    shaman_vaincu:     score.shamansDefeated >= 1,

    // Argent
    massacreur:        score.monstersDefeated >= 60,
    briseur_boss:      score.bossesDefeated >= 15,
    conquerant:        score.completeWings >= 8,
    piegeur_expert:    score.trapsDefeated >= 20,
    score_200:         score.totalScore >= 200,
    score_300:         score.totalScore >= 300,
    chasseur_morts:    score.undeadDefeated >= 15,
    invisible_5:       score.invisiblesDefeated >= 5,
    elite_10:          score.eliteDefeated >= 10,
    double_10:         score.doublesDefeated >= 10,

    // Or
    legende:           score.totalScore >= 450,
    massacreur_120:    score.monstersDefeated >= 120,
    boss_final_vaincu: score.finalBossDefeated >= 1,
    trois_necros:      score.necromancersDefeated >= 3,
    boss_influences_3: score.influencedBossesDefeated >= 3,
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
