// XP par niveau de trophée
const TIER_XP = { BRONZE: 25, ARGENT: 50, OR: 100 };

// Mapping trophy_id → tier
const TROPHY_TIER_MAP = {
  premier_sang: 'BRONZE', chasseur_novice: 'BRONZE', piegeur: 'BRONZE',
  dimanche_noir: 'BRONZE', collectionneur: 'BRONZE', alchimiste_debutant: 'BRONZE',
  baton_du_sage: 'BRONZE', premiere_aile: 'BRONZE', pas_de_repos: 'BRONZE',
  aventurier: 'BRONZE', centurion: 'BRONZE', revenant: 'BRONZE',
  trois_mois: 'BRONZE', cinq_boss: 'BRONZE', dix_pieges: 'BRONZE',

  chasseur_aguerri: 'ARGENT', roi_des_boss: 'ARGENT', conquerant_ailes: 'ARGENT',
  maitre_potions: 'ARGENT', endurance: 'ARGENT', mi_parcours: 'ARGENT',
  mois_parfait: 'ARGENT', chasseur_morts: 'ARGENT', baton_maitrise: 'ARGENT',
  piege_expert: 'ARGENT',

  legende_donjon: 'OR', inarretable: 'OR', perfectionniste: 'OR',
  maitre_armes: 'OR', donjon_complet: 'OR',
};

/** Calcule l'XP total depuis une map de trophées */
export function computeTrophyXP(trophies) {
  if (!trophies || typeof trophies !== 'object') return 0;
  return Object.keys(trophies).reduce((total, id) => {
    const tier = TROPHY_TIER_MAP[id];
    return total + (tier ? TIER_XP[tier] : 0);
  }, 0);
}

/** Retourne le niveau (1-20) pour un montant d'XP donné */
export function computeLevel(xp) {
  let cumulative = 0;
  for (let i = 0; i < 20; i++) {
    cumulative += Math.ceil(20 * Math.pow(1.11, i));
    if (xp < cumulative) return i + 1;
  }
  return 20;
}
