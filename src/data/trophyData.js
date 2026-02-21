// === Niveaux de trophées ===
export const TROPHY_TIERS = {
  BRONZE: { id: 'bronze', label: 'Bronze', xp: 25, color: '#cd7f32', border: 'border-amber-700', bg: 'from-amber-900 to-amber-700' },
  ARGENT: { id: 'argent', label: 'Argent', xp: 50, color: '#c0c0c0', border: 'border-gray-400', bg: 'from-gray-500 to-gray-300' },
  OR:     { id: 'or',     label: 'Or',     xp: 100, color: '#d4af37', border: 'border-yellow-500', bg: 'from-yellow-600 to-amber-400' },
};

// === 30 définitions de trophées ===
export const TROPHY_DEFINITIONS = [
  // --- BRONZE (15) ---
  { id: 'premier_sang',        name: 'Premier Sang',         description: 'Remporter 1 combat',                       tier: 'BRONZE', icon: 'Swords' },
  { id: 'chasseur_novice',     name: 'Chasseur Novice',      description: 'Vaincre 10 monstres',                      tier: 'BRONZE', icon: 'Skull' },
  { id: 'piegeur',             name: 'Piégeur',              description: 'Désamorcer 5 pièges',                      tier: 'BRONZE', icon: 'AlertTriangle' },
  { id: 'dimanche_noir',       name: 'Dimanche Noir',        description: 'Terrasser le premier boss',                tier: 'BRONZE', icon: 'Crown' },
  { id: 'collectionneur',      name: 'Collectionneur',       description: 'Obtenir une potion de mana',               tier: 'BRONZE', icon: 'FlaskConical' },
  { id: 'alchimiste_debutant', name: 'Alchimiste Débutant',  description: 'Utiliser une potion de mana',              tier: 'BRONZE', icon: 'FlaskConical' },
  { id: 'baton_du_sage',       name: 'Le Bâton du Sage',     description: 'Utiliser le bâton du sage',                tier: 'BRONZE', icon: 'Wand2' },
  { id: 'premiere_aile',       name: 'Première Aile',        description: 'Conquérir 1 aile',                         tier: 'BRONZE', icon: 'Shield' },
  { id: 'pas_de_repos',        name: 'Pas de Repos',         description: 'Série de 7 jours consécutifs',             tier: 'BRONZE', icon: 'Flame' },
  { id: 'aventurier',          name: 'Aventurier',           description: 'Atteindre 50 points',                      tier: 'BRONZE', icon: 'Trophy' },
  { id: 'centurion',           name: 'Centurion',            description: 'Atteindre 100 points',                     tier: 'BRONZE', icon: 'Trophy' },
  { id: 'revenant',            name: 'Revenant',             description: 'Vaincre un mort-vivant',                   tier: 'BRONZE', icon: 'Skull' },
  { id: 'trois_mois',          name: 'Trois Mois au Donjon', description: 'Marquer des points dans 3 mois différents', tier: 'BRONZE', icon: 'Calendar' },
  { id: 'cinq_boss',           name: 'Cinq Boss',            description: 'Terrasser 5 boss',                         tier: 'BRONZE', icon: 'Crown' },
  { id: 'dix_pieges',          name: 'Dix Pièges',           description: 'Désamorcer 10 pièges',                     tier: 'BRONZE', icon: 'AlertTriangle' },

  // --- ARGENT (10) ---
  { id: 'chasseur_aguerri',    name: 'Chasseur Aguerri',     description: 'Vaincre 75 monstres',                      tier: 'ARGENT', icon: 'Skull' },
  { id: 'roi_des_boss',        name: 'Roi des Boss',         description: 'Terrasser 25 boss',                        tier: 'ARGENT', icon: 'Crown' },
  { id: 'conquerant_ailes',    name: "Conquérant d'Ailes",   description: 'Conquérir 10 ailes',                       tier: 'ARGENT', icon: 'Shield' },
  { id: 'maitre_potions',      name: 'Maître des Potions',   description: 'Utiliser 10 potions de mana',              tier: 'ARGENT', icon: 'FlaskConical' },
  { id: 'endurance',           name: 'Endurance',            description: 'Série de 21 jours consécutifs',            tier: 'ARGENT', icon: 'Flame' },
  { id: 'mi_parcours',         name: 'Mi-Parcours',          description: 'Atteindre 500 points',                     tier: 'ARGENT', icon: 'Trophy' },
  { id: 'mois_parfait',        name: 'Mois Parfait',         description: "Compléter 100% des jours d'un mois",       tier: 'ARGENT', icon: 'Calendar' },
  { id: 'chasseur_morts',      name: 'Chasseur de Morts',    description: 'Vaincre 25 morts-vivants',                 tier: 'ARGENT', icon: 'Skull' },
  { id: 'baton_maitrise',      name: 'Bâton Maîtrisé',       description: 'Utiliser le bâton du sage 6 fois',         tier: 'ARGENT', icon: 'Wand2' },
  { id: 'piege_expert',        name: 'Piège Expert',         description: 'Désamorcer 25 pièges',                     tier: 'ARGENT', icon: 'AlertTriangle' },

  // --- OR (5) ---
  { id: 'legende_donjon',      name: 'Légende du Donjon',    description: 'Atteindre 1000 points',                    tier: 'OR', icon: 'Trophy' },
  { id: 'inarretable',         name: 'Inarrêtable',          description: 'Série de 60 jours consécutifs',            tier: 'OR', icon: 'Flame' },
  { id: 'perfectionniste',     name: 'Perfectionniste',      description: 'Compléter 100% de 3 mois',                tier: 'OR', icon: 'Calendar' },
  { id: 'maitre_armes',        name: "Maître d'Armes",       description: 'Vaincre 200 ennemis (tous types)',         tier: 'OR', icon: 'Swords' },
  { id: 'donjon_complet',      name: 'Le Donjon Complet',    description: 'Compléter les 365 jours',                  tier: 'OR', icon: 'Award' },
];

// === Titres de niveau (20 niveaux) ===
export const LEVEL_TITLES = [
  'Vagabond', 'Paysan', 'Apprenti', 'Milicien', 'Écuyer',
  'Soldat', 'Garde', 'Combattant', 'Guerrier', 'Vétéran',
  'Chevalier', 'Capitaine', 'Champion', 'Paladin', 'Héros',
  'Commandeur', 'Seigneur', 'Maître de Guerre', 'Légende Vivante', 'Conquérant du Donjon',
];

// === Seuils XP cumulés (base 20, ×1.11 par niveau) ===
export const LEVEL_THRESHOLDS = (() => {
  const thresholds = [];
  let cumulative = 0;
  for (let i = 0; i < 20; i++) {
    cumulative += Math.ceil(20 * Math.pow(1.11, i));
    thresholds.push(cumulative);
  }
  return thresholds;
})();

// === Fonctions utilitaires ===

/** Calcule l'XP total depuis une map de trophées { trophy_id: date } */
export function calculateTrophyXP(trophies) {
  if (!trophies) return 0;
  return Object.keys(trophies).reduce((total, trophyId) => {
    const def = TROPHY_DEFINITIONS.find(t => t.id === trophyId);
    if (!def) return total;
    return total + TROPHY_TIERS[def.tier].xp;
  }, 0);
}

/** Retourne le niveau (1-20) pour un montant d'XP donné */
export function getLevel(xp) {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp < LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 20;
}

/** Retourne les infos détaillées de niveau */
export function getLevelInfo(xp) {
  const level = getLevel(xp);
  const prevThreshold = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
  const nextThreshold = LEVEL_THRESHOLDS[level - 1];
  return {
    level,
    title: LEVEL_TITLES[level - 1],
    totalXP: xp,
    xpIntoLevel: xp - prevThreshold,
    xpForLevel: nextThreshold - prevThreshold,
    isMaxLevel: level === 20 && xp >= LEVEL_THRESHOLDS[19],
  };
}
