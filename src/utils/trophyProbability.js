/**
 * Calcul des probabilités de chaque trophée pour un taux de complétion p.
 * Utilisé uniquement en mode DEV.
 *
 * Modèles utilisés :
 *  - Comptes (monstres, boss…) : approximation normale binomiale avec correction de continuité
 *  - Série consécutive          : récurrence exacte
 *  - Score total                : approximation normale (somme de variables indépendantes + bonus ailes)
 *  - Ailes                      : binomiale sur les 41 ailes complétables de 2026
 */

import { generateYear2026 } from '../data/gameData';

export const DEV_COMPLETION_RATE = 0.65; // argent (référence)
export const DEV_COMPLETION_RATE_BRONZE = 0.50;
export const DEV_COMPLETION_RATE_GOLD   = 0.80;

// ── Fonctions mathématiques ────────────────────────────────────────────────

/** CDF de la loi normale standard — approximation Abramowitz & Stegun (erreur max 7.5e-8) */
function normalCDF(z) {
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const q = (Math.exp(-absZ * absZ / 2) / 2.5066282746) * poly;
  return z >= 0 ? 1 - q : q;
}

/** P(X >= k) avec X ~ Binomiale(n, p) — approximation normale avec correction de continuité */
function pAtLeast(k, n, p) {
  if (k <= 0) return 1;
  if (n === 0 || k > n) return 0;
  const mu = n * p;
  const sigma = Math.sqrt(n * p * (1 - p));
  if (sigma < 1e-9) return k <= mu ? 1 : 0;
  return 1 - normalCDF((k - 0.5 - mu) / sigma);
}

/**
 * P(au moins une série de k succès consécutifs dans n essais indépendants Bernoulli(p))
 * Récurrence exacte : a_n = Σ_{j=1}^{k} p^{j-1}(1-p) a_{n-j}
 */
function pStreak(k, n, p) {
  if (n < k) return 0;
  const a = new Float64Array(n + 1);
  for (let i = 0; i < k; i++) a[i] = 1;
  for (let i = k; i <= n; i++) {
    for (let j = 1; j <= k; j++) {
      a[i] += Math.pow(p, j - 1) * (1 - p) * a[i - j];
    }
  }
  return 1 - a[n];
}

// ── Statistiques du jeu (calculées une seule fois) ────────────────────────

let _stats = null;

function getStats() {
  if (_stats) return _stats;

  const yearData = generateYear2026();
  const allDays = yearData.flatMap(m => m.weeks.flatMap(w => w.days));

  // Compter les ailes complétables (rangées de exactement 7 jours réels)
  let wings = 0;
  yearData.forEach(month => {
    const days = month.weeks.flatMap(w => w.days);
    const offset = (days[0].dayOfWeekIndex - 1 + 7) % 7;
    const numRows = Math.ceil((offset + days.length) / 7);
    for (let row = 0; row < numRows; row++) {
      let count = 0;
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col - offset;
        if (idx >= 0 && idx < days.length) count++;
      }
      if (count === 7) wings++;
    }
  });

  // Valeur en points et variance de chaque cellule
  let sumValues = 0, sumSq = 0;
  allDays.forEach(d => {
    const v = d.type === 'BOSS'
      ? 2 + (d.isInfluenced ? 10 : 0) + (d.isFinalBoss ? 30 : 0)
      : d.type === 'DOUBLE' ? 3 : 1;
    sumValues += v;
    sumSq += v * v;
  });

  _stats = {
    n:          allDays.length,
    monsters:   allDays.filter(d => d.type === 'MONSTER').length,
    bosses:     allDays.filter(d => d.type === 'BOSS').length,
    traps:      allDays.filter(d => d.type === 'TRAP').length,
    undead:     allDays.filter(d => d.type === 'UNDEAD').length,
    necros:     allDays.filter(d => d.type === 'NECROMANCER').length,
    elites:     allDays.filter(d => d.isElite).length,
    doubles:    allDays.filter(d => d.type === 'DOUBLE').length,
    invisibles: allDays.filter(d => d.isInvisible).length,
    influenced: allDays.filter(d => d.isInfluenced).length,
    shamans:    allDays.filter(d => d.type === 'SHAMAN').length,
    mana:       allDays.filter(d => d.hasMana).length,
    finalBoss:  allDays.filter(d => d.isFinalBoss).length,
    wings,
    sumValues,
    sumSq,
  };

  return _stats;
}

// ── Probabilité de score ───────────────────────────────────────────────────

function pScore(threshold, p) {
  const { sumValues, sumSq, wings } = getStats();
  const q = Math.pow(p, 7); // P(aile complète)

  // Espérance : cellules individuelles + bonus ailes
  const mu = p * sumValues + wings * 3 * q;
  // Variance : cellules (indépendantes) + ailes (approximation indépendante)
  const variance = p * (1 - p) * sumSq + wings * 9 * q * (1 - q);
  const sigma = Math.sqrt(variance);

  if (sigma < 1e-9) return threshold <= mu ? 1 : 0;
  return 1 - normalCDF((threshold - 0.5 - mu) / sigma);
}

// ── API publique ──────────────────────────────────────────────────────────

/**
 * Retourne la probabilité (0–100, entier) d'obtenir un trophée
 * pour un joueur complétant chaque case avec p = DEV_COMPLETION_RATE.
 * Retourne null si le trophée n'est pas connu.
 */
// ── Coefficients de difficulté par type d'ennemi ─────────────────────────
// Appliqués au taux de complétion p pour affiner les probabilités affichées.
// N'affecte pas les seuils de déblocage réels (useTrophies.js).
const D_BOSS    = 0.90; // boss (dimanche)
const D_ELITE   = 0.85; // élites, doubles, invisibles
const D_INFLU   = 0.75; // boss influencés
const D_FINAL   = 0.75; // boss final

export function getTrophyProb(trophyId) {
  const p   = DEV_COMPLETION_RATE;        // p_argent = 0.65
  const p_b = DEV_COMPLETION_RATE_BRONZE; // p_bronze = 0.50
  const p_g = DEV_COMPLETION_RATE_GOLD;   // p_or     = 0.80
  const s = getStats();
  const q   = Math.pow(p,   7); // prob aile à p=0.65
  const q_g = Math.pow(p_g, 7); // prob aile à p=0.80

  const table = {
    // Bronze — cible 85-90 % à p=0.50
    premier_sang:      pAtLeast(171, s.n,         p_b),
    piegeur:           pAtLeast(26,  s.traps,      p_b),
    premier_boss:      pAtLeast(20,  s.bosses,     p_b * D_BOSS),
    chasseur_20:       pAtLeast(82,  s.monsters,   p_b),
    alchimiste:        pAtLeast(14,  s.mana,       p_b),
    serie_7:           pStreak(7,    s.n,          p_b),
    score_50:          pScore(248,   p_b),
    score_100:         pScore(254,   p_b),
    revenant:          pAtLeast(18,  s.undead,     p_b),
    elite_abattu:      pAtLeast(11,  s.elites,     p_b * D_ELITE),
    double_vaincu:     pAtLeast(8,   s.doubles,    p_b * D_ELITE),
    invisible_vaincu:  pAtLeast(4,   s.invisibles, p_b * D_ELITE),
    influence_brisee:  pAtLeast(1,   s.influenced, p_b * D_INFLU), // exception n=6 : saut 93%→74%
    shaman_vaincu:     pAtLeast(1,   s.shamans,    p_b),           // exception n=4 : saut 93%→69%
    // Argent — cible 70-75 % à p=0.65
    premiere_aile:     pAtLeast(1,   s.wings,      q),             // exception : saut 86%→64%
    massacreur:        pAtLeast(112, s.monsters,   p),
    briseur_boss:      pAtLeast(29,  s.bosses,     p * D_BOSS),    // exception : saut 76%→66%
    piegeur_expert:    pAtLeast(37,  s.traps,      p),
    score_200:         pScore(353,   p),
    score_300:         pScore(356,   p),
    chasseur_morts:    pAtLeast(26,  s.undead,     p),
    elite_10:          pAtLeast(17,  s.elites,     p * D_ELITE),
    double_10:         pAtLeast(13,  s.doubles,    p * D_ELITE),
    // Or — cible 55-65 % à p=0.80
    conquerant:        pAtLeast(8,   s.wings,      q_g),           // exception : saut 66%→52%
    legende:           pScore(467,   p_g),
    massacreur_120:    pAtLeast(140, s.monsters,   p_g),
    boss_final_vaincu: pAtLeast(1,   s.finalBoss,  p_g * D_FINAL),
    trois_necros:      pAtLeast(3,   s.necros,     p),             // exception p=0.65 (n=4)
    boss_influences_3: pAtLeast(4,   s.influenced, p_g * D_INFLU), // exception n=6 : saut 53%→23%
    invisible_5:       pAtLeast(9,   s.invisibles, p_g * D_ELITE),
  };

  const prob = table[trophyId];
  if (prob === undefined) return null;

  const pct = prob * 100;
  if (pct < 0.5)  return '<1';
  if (pct > 99.4) return '>99';
  return Math.round(pct);
}
