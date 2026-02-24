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
    // Bronze — cible 85-90 % à p=0.50
    premier_sang:      m.totalDaysCompleted >= 170,
    piegeur:           score.trapsDefeated >= 25,
    premier_boss:      score.bossesDefeated >= 20,
    chasseur_20:       score.monstersDefeated >= 80,
    alchimiste:        score.manaPotionsEarned >= 10,
    serie_7:           m.longestStreak >= 7,
    score_50:          score.totalScore >= 200,
    score_100:         score.totalScore >= 275,
    revenant:          score.undeadDefeated >= 15,
    elite_abattu:      score.eliteDefeated >= 10,
    double_vaincu:     score.doublesDefeated >= 5,
    invisible_vaincu:  score.invisiblesDefeated >= 5,
    influence_brisee:  score.influencedBossesDefeated >= 1,
    shaman_vaincu:     score.shamansDefeated >= 1,

    // Argent — cible 70-75 % à p=0.65
    premiere_aile:     score.completeWings >= 1,
    massacreur:        score.monstersDefeated >= 110,
    briseur_boss:      score.bossesDefeated >= 30,
    piegeur_expert:    score.trapsDefeated >= 35,
    score_200:         score.totalScore >= 350,
    score_300:         score.totalScore >= 400,
    chasseur_morts:    score.undeadDefeated >= 25,
    elite_10:          score.eliteDefeated >= 15,
    double_10:         score.doublesDefeated >= 10,

    // Or — cible 55-65 % à p=0.80
    conquerant:        score.completeWings >= 8,
    legende:           score.totalScore >= 450,
    massacreur_120:    score.monstersDefeated >= 140,
    boss_final_vaincu: score.finalBossDefeated >= 1,
    trois_necros:      score.necromancersDefeated >= 3,
    boss_influences_3: score.influencedBossesDefeated >= 4,
    invisible_5:       score.invisiblesDefeated >= 9,
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
