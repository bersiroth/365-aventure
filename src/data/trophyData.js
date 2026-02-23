// === Niveaux de trophées ===
export const TROPHY_TIERS = {
  BRONZE: { id: 'bronze', label: 'Bronze', xp: 25, color: '#cd7f32', border: 'border-amber-700', bg: 'from-amber-900 to-amber-700' },
  ARGENT: { id: 'argent', label: 'Argent', xp: 50, color: '#c0c0c0', border: 'border-gray-400', bg: 'from-gray-500 to-gray-300' },
  OR:     { id: 'or',     label: 'Or',     xp: 100, color: '#d4af37', border: 'border-yellow-500', bg: 'from-yellow-600 to-amber-400' },
};

// === 30 définitions de trophées ===
// minMonth : index du mois à partir duquel le trophée est visible (0 = toujours visible)
export const TROPHY_DEFINITIONS = [
  // --- BRONZE (15) ---
  { id: 'premier_sang',      name: 'Premier Sang',        description: 'Remporter 1 combat',                      tier: 'BRONZE', icon: 'Swords',        minMonth: 0  },
  { id: 'piegeur',           name: 'Désamorceur',         description: 'Désamorcer 1 piège',                      tier: 'BRONZE', icon: 'AlertTriangle', minMonth: 0  },
  { id: 'premier_boss',      name: 'Dimanche Noir',       description: 'Terrasser 1 boss',                        tier: 'BRONZE', icon: 'Crown',         minMonth: 0  },
  { id: 'chasseur_20',       name: 'Chasseur',            description: 'Vaincre 20 monstres',                     tier: 'BRONZE', icon: 'Skull',         minMonth: 0  },
  { id: 'premiere_aile',     name: 'Première Aile',       description: 'Conquérir 1 aile',                        tier: 'BRONZE', icon: 'Shield',        minMonth: 0  },
  { id: 'alchimiste',        name: 'Alchimiste',          description: 'Obtenir 1 potion de mana',                tier: 'BRONZE', icon: 'FlaskConical',  minMonth: 1  },
  { id: 'serie_7',           name: 'Sans Répit',          description: 'Série de 7 jours consécutifs',            tier: 'BRONZE', icon: 'Flame',         minMonth: 0  },
  { id: 'score_50',          name: 'Aventurier',          description: 'Atteindre 50 points',                     tier: 'BRONZE', icon: 'Trophy',        minMonth: 0  },
  { id: 'score_100',         name: 'Centurion',           description: 'Atteindre 100 points',                    tier: 'BRONZE', icon: 'Trophy',        minMonth: 0  },
  { id: 'revenant',          name: 'Face à la Mort',      description: 'Vaincre 1 mort-vivant',                   tier: 'BRONZE', icon: 'Skull',         minMonth: 2  },
  { id: 'elite_abattu',      name: 'Élite Terrassé',      description: 'Vaincre 1 monstre élite',                 tier: 'BRONZE', icon: 'Zap',           minMonth: 4  },
  { id: 'double_vaincu',     name: 'Double Victoire',     description: 'Vaincre 1 monstre double',                tier: 'BRONZE', icon: 'Layers2',       minMonth: 6  },
  { id: 'invisible_vaincu',  name: 'Révélé',              description: 'Vaincre 1 monstre invisible',             tier: 'BRONZE', icon: 'EyeOff',        minMonth: 8  },
  { id: 'influence_brisee',  name: 'Influence Brisée',    description: 'Vaincre 1 boss influencé',                tier: 'BRONZE', icon: 'Flame',         minMonth: 9  },
  { id: 'shaman_vaincu',     name: 'Brise-Sort',          description: "Vaincre 1 Shaman de l'Ombre",             tier: 'BRONZE', icon: 'Ghost',         minMonth: 10 },

  // --- ARGENT (10) ---
  { id: 'massacreur',        name: 'Massacreur',          description: 'Vaincre 60 monstres',                     tier: 'ARGENT', icon: 'Skull',         minMonth: 0  },
  { id: 'briseur_boss',      name: 'Briseur de Boss',     description: 'Terrasser 15 boss',                       tier: 'ARGENT', icon: 'Crown',         minMonth: 0  },
  { id: 'conquerant',        name: 'Conquérant',          description: 'Conquérir 8 ailes',                       tier: 'ARGENT', icon: 'Swords',        minMonth: 0  },
  { id: 'piegeur_expert',    name: 'Maître des Pièges',   description: 'Désamorcer 20 pièges',                    tier: 'ARGENT', icon: 'AlertTriangle', minMonth: 0  },
  { id: 'score_200',         name: 'Héros',               description: 'Atteindre 200 points',                    tier: 'ARGENT', icon: 'Trophy',        minMonth: 0  },
  { id: 'score_300',         name: 'Vétéran',             description: 'Atteindre 300 points',                    tier: 'ARGENT', icon: 'Trophy',        minMonth: 0  },
  { id: 'chasseur_morts',    name: 'Exterminateur',       description: 'Vaincre 15 morts-vivants',                tier: 'ARGENT', icon: 'Skull',         minMonth: 2  },
  { id: 'invisible_5',       name: "Traqueur de l'Ombre", description: 'Vaincre 5 monstres invisibles',           tier: 'ARGENT', icon: 'EyeOff',        minMonth: 8  },
  { id: 'elite_10',          name: 'Chasseur Élite',      description: 'Vaincre 10 monstres élites',              tier: 'ARGENT', icon: 'Zap',           minMonth: 4  },
  { id: 'double_10',         name: 'Duelliste',           description: 'Vaincre 10 monstres doubles',             tier: 'ARGENT', icon: 'Layers2',       minMonth: 6  },

  // --- OR (5) ---
  { id: 'legende',           name: 'Légende du Donjon',   description: 'Atteindre 450 points',                    tier: 'OR',     icon: 'Trophy',        minMonth: 0  },
  { id: 'massacreur_120',    name: 'Fléau des Monstres',  description: 'Vaincre 120 monstres',                    tier: 'OR',     icon: 'Skull',         minMonth: 0  },
  { id: 'boss_final_vaincu', name: 'Maître du Donjon',    description: 'Vaincre le Boss Final',                   tier: 'OR',     icon: 'Award',         minMonth: 11 },
  { id: 'trois_necros',      name: 'Exorciste',           description: 'Vaincre 3 nécromanciers',                 tier: 'OR',     icon: 'Skull',         minMonth: 8  },
  { id: 'boss_influences_3', name: 'Ombre Dissipée',      description: 'Vaincre 3 boss influencés',               tier: 'OR',     icon: 'Flame',         minMonth: 9  },
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
