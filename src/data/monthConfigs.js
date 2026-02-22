/**
 * ════════════════════════════════════════════════════════════════
 *  CONFIGURATION DU CALENDRIER — À RENSEIGNER MANUELLEMENT
 * ════════════════════════════════════════════════════════════════
 *
 * Ce fichier contient la définition de chaque case du calendrier.
 * Seules les cases qui diffèrent des valeurs par défaut ont besoin
 * d'être listées. Les valeurs par défaut sont :
 *   • Dimanche    → BOSS,    value: 17  (à remplacer par la vraie valeur)
 *   • Lundi-Sam.  → MONSTER, value: 1   (à remplacer par la vraie valeur)
 *
 * Types disponibles :
 *   'MONSTER'    — Case monstre  : faire un triple de la valeur indiquée
 *                  Affichage : bouclier bleu avec la valeur au centre
 *
 *   'TRAP'       — Case piège    : faire un dé sans sortir la valeur indiquée
 *                  Affichage : triangle rouge avec la valeur négative
 *                  ⚠️  La valeur doit être négative  (ex: -2)
 *
 *   'BOSS'       — Case boss     : toujours un dimanche
 *                  Affichage : couronne dorée avec la valeur
 *
 *   'NECROMANCER'— Case nécromancien : combat spécial — si non vaincu, les points
 *                  des morts-vivants du mois ne comptent pas
 *                  Affichage : bouclier vert sombre avec la valeur
 *
 * Flags combinables :
 *   isInfluenced: true  — Boss influencé par un Mort-Vivant dans la même aile
 *                         Si le Mort-Vivant de l'aile est vaincu, +10 pts bonus
 *
 * Format :
 *   numéro_du_jour: { type: 'MONSTER' | 'TRAP' | 'BOSS', value: number }
 *
 * Exemple :
 *   8:  { type: 'MONSTER', value: 2  },   ← monstre, il faut un triple 2
 *   27: { type: 'TRAP',    value: -2 },   ← piège, il faut éviter le 2
 *   11: { type: 'BOSS',    value: 18 },   ← boss du dimanche, triple 18
 *
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Nouvelles règles introduites chaque mois.
 * Clé = index du mois (0 = janvier).
 */
export const MONTH_RULES = {
  1: {
    title: 'Potion de Mana',
    sections: [
      {
        heading: null,
        body: "Chaque fois que vous vainquez un monstre sur une case contenant une potion de mana, entourez une case Potion de mana en haut du calendrier.",
      },
      {
        heading: 'Utilisation',
        body: "Vous pouvez utiliser une potion de mana a tout moment en mettant un X dans une case entourée. Lorsque vous utilisez une potion de mana, vous pouvez relancer un dé blue. Les potions de mana non utilisées sur un niveau (mois en cours) disparaissent au début du mois suivant.",
      },
    ],
  },
  2: {
    title: 'Morts-Vivants Enchaînés',
    sections: [
      {
        heading: null,
        body: "Pour vaincre les morts-vivants enchaînés, vous devez inclure la valeur des deux dés bleus dans vos calculs.",
      },
    ],
  },
  4: {
    title: 'Monstres Élites',
    sections: [
      {
        heading: null,
        body: "Les monstres Élites apparaissent. Il doivent être vaincus avec un maximum de deux jets de dés au lieu de trois.",
      },
    ],
  },
  6: {
    title: 'Monstres Doubles',
    sections: [
      {
        heading: null,
        body: "Sur les cases avec deux monstres, deux valeurs sont indiquées. Pour vaincre les deux monstres, vous devez obtenir deux dés de chaque valeur.",
      },
      {
        heading: 'Bonus',
        body: "Si vous réussissez, vous gagnez un bonus de 2 points (soit 3 points au total : 1 pt de victoire + 2 pts de bonus).",
      },
      {
        heading: 'Exemple',
        body: "Sur une case avec deux monstres (valeurs 3 et 4), des résultat de dès tels 1, 3, 3, 4, 4 permettent de vaincre les deux monstres",
      },
    ],
  },
  9: {
    title: "L'Influence des Morts-Vivants Enchaînés",
    sections: [
      {
        heading: null,
        body: "Certains boss, marqués d'un bouclier en feu, sont influencés par la présence d'un Mort-Vivant Enchaîné dans leur aile.",
      },
      {
        heading: 'Affaiblissement',
        body: "Si vous vainquez le Mort-Vivant Enchaîné de l'aile (la règle de Mars s'applique), la valeur du boss est divisée par deux.",
      },
      {
        heading: 'Bonus',
        body: "Vaincre ce boss affaibli rapporte un bonus de +10 points.",
      },
      {
        heading: 'Objets magiques',
        body: "À partir de ce mois, tous les objets magiques peuvent être utilisés deux fois par mois au lieu d'une.",
      },
    ],
  },
  8: {
    title: 'Monstres Invisibles & Nécromancien',
    sections: [
      {
        heading: 'Monstres Invisibles',
        body: "Les monstres invisibles apparaissent dans tout le donjon. Ils se distinguent par leur contour pointillé et leur bouclier rond.",
      },
      {
        heading: 'Règle des invisibles',
        body: "Ils ne peuvent être affrontés que lorsque Mira se trouve précisément sur leur case.",
      },
      {
        heading: 'Nécromancien',
        body: "Un nécromancien rôde dans les profondeurs du donjon. Tant qu'il n'est pas vaincu, les points des morts-vivants ne sont pas comptabilisés.",
      },
    ],
  },
  7: {
    title: 'Anneau Ancien',
    sections: [
      {
        heading: null,
        body: "Si vous vainquez un monstre en utilisant au moins quatre dés identiques, vous pouvez immédiatement engager un combat supplémentaire. Le combat supplémentaire suit les mêmes règles qu'un combat normal.",
      },
      {
        heading: 'Utilisation',
        body: "Cette capacité peut être utilisée une fois par mois.",
      },
    ],
  },
  5: {
    title: 'Cape des Illusions',
    sections: [
      {
        heading: null,
        body: "La Cape des Illusions vous permet de modifier la valeur d'un dé bleu pour qu'elle corresponde à celle de l'autre dé bleu.",
      },
      {
        heading: 'Utilisation',
        body: "Cette capacité peut être utilisée une fois par mois.",
      },
    ],
  },
  3: {
    title: 'Bâton du Sage',
    sections: [
      {
        heading: null,
        body: "Le Bâton du Sage vous permet de retourner un dé rouge sur sa face opposée.",
      },
      {
        heading: 'Utilisation',
        body: "Cette capacité peut être utilisée une fois par mois.",
      },
    ],
  },
};

export const MONTH_CONFIGS = {

  // ──────────────────────────────────────────────────────────────
  //  JANVIER (index 0)
  //  Dimanches / Boss : 4, 11, 18, 25
  // ──────────────────────────────────────────────────────────────
  0: {
     1: { type: 'MONSTER', value: 1  }, // Lundi
     2: { type: 'MONSTER', value: 2  }, // Mardi    — TODO: vérifier
     3: { type: 'MONSTER', value: 3  }, // Mercredi — TODO: vérifier
     4: { type: 'BOSS',    value: 17 }, // Dimanche ✓
     5: { type: 'MONSTER', value: 1  }, // Lundi    — TODO: vérifier
     6: { type: 'MONSTER', value: 1  }, // Mardi    — TODO: vérifier
     7: { type: 'TRAP', value: -1  }, // Mercredi — TODO: vérifier
     8: { type: 'MONSTER', value: 2  }, // Jeudi    ✓ (valeur 2)
     9: { type: 'MONSTER', value: 4  }, // Vendredi — TODO: vérifier
    10: { type: 'MONSTER', value: 5  }, // Samedi   — TODO: vérifier
    11: { type: 'BOSS',    value: 18 }, // Dimanche ✓
    12: { type: 'MONSTER', value: 1  }, // Lundi    — TODO: vérifier
    13: { type: 'MONSTER', value: 2  }, // Mardi    — TODO: vérifier
    14: { type: 'MONSTER', value: 3  }, // Mercredi — TODO: vérifier
    15: { type: 'TRAP', value: -3  }, // Jeudi    — TODO: vérifier
    16: { type: 'MONSTER', value: 5  }, // Vendredi — TODO: vérifier
    17: { type: 'MONSTER', value: 6  }, // Samedi   — TODO: vérifier
    18: { type: 'BOSS',    value: 20 }, // Dimanche — TODO: vérifier la valeur
    19: { type: 'MONSTER', value: 2  }, // Lundi    — TODO: vérifier
    20: { type: 'MONSTER', value: 3  }, // Mardi    — TODO: vérifier
    21: { type: 'MONSTER', value: 5  }, // Mercredi — TODO: vérifier
    22: { type: 'MONSTER', value: 5  }, // Jeudi    — TODO: vérifier
    23: { type: 'TRAP', value: -5  }, // Vendredi — TODO: vérifier
    24: { type: 'TRAP', value: -5  }, // Samedi   — TODO: vérifier
    25: { type: 'BOSS',    value: 22 }, // Dimanche ✓
    26: { type: 'MONSTER', value: 1  }, // Lundi    — TODO: vérifier
    27: { type: 'TRAP',    value: -2 }, // Mardi    ✓ (piège -2)
    28: { type: 'MONSTER', value: 2  }, // Mercredi — TODO: vérifier
    29: { type: 'MONSTER', value: 3  }, // Jeudi    — TODO: vérifier
    30: { type: 'MONSTER', value: 4  }, // Vendredi — TODO: vérifier
    31: { type: 'MONSTER', value: 5  }, // Samedi   — TODO: vérifier
  },

  // ──────────────────────────────────────────────────────────────
  //  FÉVRIER (index 1)
  //  Dimanches / Boss : 1, 8, 15, 22
  // ──────────────────────────────────────────────────────────────
  1: {
     1: { type: 'BOSS',    value: 20 }, // Dimanche — TODO: valeur
     2: { type: 'MONSTER', value: 1  }, // Lundi    — TODO
     3: { type: 'MONSTER', value: 3, hasMana: true }, // Mardi
     4: { type: 'MONSTER', value: 3  }, // Mercredi — TODO
     5: { type: 'MONSTER', value: 4  }, // Jeudi    — TODO
     6: { type: 'MONSTER', value: 5  }, // Vendredi — TODO
     7: { type: 'TRAP', value: -6  }, // Samedi   — TODO
     8: { type: 'BOSS',    value: 21 }, // Dimanche — TODO: valeur
     9: { type: 'TRAP', value: -1  }, // Lundi    — TODO
    10: { type: 'TRAP', value: -2  }, // Mardi    — TODO
    11: { type: 'TRAP', value: -3  }, // Mercredi — TODO
    12: { type: 'MONSTER', value: 3  }, // Jeudi    — TODO
    13: { type: 'MONSTER', value: 3, hasMana: true }, // Vendredi — TODO
    14: { type: 'MONSTER', value: 4  }, // Samedi   — TODO
    15: { type: 'BOSS',    value: 22 }, // Dimanche — TODO: valeur
    16: { type: 'MONSTER', value: 2  }, // Lundi    — TODO
    17: { type: 'MONSTER', value: 4  }, // Mardi    — TODO
    18: { type: 'MONSTER', value: 5, hasMana: true }, // Mercredi — TODO
    19: { type: 'MONSTER', value: 5  }, // Jeudi    — TODO
    20: { type: 'MONSTER', value: 5  }, // Vendredi — TODO
    21: { type: 'MONSTER', value: 6  }, // Samedi   — TODO
    22: { type: 'BOSS',    value: 23 }, // Dimanche — TODO: valeur
    23: { type: 'MONSTER', value: 1  }, // Lundi    — TODO
    24: { type: 'MONSTER', value: 1  }, // Mardi    — TODO
    25: { type: 'MONSTER', value: 2  }, // Mercredi — TODO
    26: { type: 'TRAP', value: -4  }, // Jeudi    — TODO
    27: { type: 'MONSTER', value: 4  }, // Vendredi — TODO
    28: { type: 'MONSTER', value: 5  }, // Samedi   — TODO
  },

  // ──────────────────────────────────────────────────────────────
  //  MARS (index 2)
  //  Dimanches / Boss : 1, 8, 15, 22, 29
  // ──────────────────────────────────────────────────────────────
  2: {
     1: { type: 'BOSS',    value: 21 }, // Dimanche — TODO
     2: { type: 'TRAP', value: -1  },
     3: { type: 'MONSTER', value: 2  },
     4: { type: 'TRAP', value: -3  },
     5: { type: 'UNDEAD',  value: 3  }, // Jeudi
     6: { type: 'MONSTER', value: 4  },
     7: { type: 'MONSTER', value: 5  },
     8: { type: 'BOSS',    value: 21, hasMana: true }, // Dimanche — TODO
     9: { type: 'MONSTER', value: 2  },
    10: { type: 'MONSTER', value: 3  },
    11: { type: 'UNDEAD', value: 3  },
    12: { type: 'TRAP', value: -5  },
    13: { type: 'TRAP', value: -5  },
    14: { type: 'MONSTER', value: 6  },
    15: { type: 'BOSS',    value: 22 }, // Dimanche — TODO
    16: { type: 'MONSTER', value: 1  },
    17: { type: 'MONSTER', value: 2, hasMana: true  },
    18: { type: 'MONSTER', value: 2  },
    19: { type: 'MONSTER', value: 3  },
    20: { type: 'MONSTER', value: 3  },
    21: { type: 'MONSTER', value: 6, hasMana: true  },
    22: { type: 'BOSS',    value: 23 }, // Dimanche — TODO
    23: { type: 'MONSTER', value: 2  },
    24: { type: 'MONSTER', value: 4  },
    25: { type: 'UNDEAD', value: 4  },
    26: { type: 'MONSTER', value: 5  },
    27: { type: 'UNDEAD', value: 6  },
    28: { type: 'TRAP', value: -6  },
    29: { type: 'BOSS',    value: 24 }, // Dimanche — TODO
    30: { type: 'MONSTER', value: 1  },
    31: { type: 'MONSTER', value: 2  },
  },

  // ──────────────────────────────────────────────────────────────
  //  AVRIL (index 3)  — Dimanches : 5, 12, 19, 26
  // ──────────────────────────────────────────────────────────────
  3: {
     1: { type: 'MONSTER', value: 1  },
     2: { type: 'TRAP', value: -2  },
     3: { type: 'MONSTER', value: 3  },
     4: { type: 'MONSTER', value: 4  },
     5: { type: 'BOSS',    value: 18 }, // Dimanche — TODO
     6: { type: 'MONSTER', value: 1, hasMana: true  },
     7: { type: 'MONSTER', value: 2  },
     8: { type: 'UNDEAD', value: 2  },
     9: { type: 'TRAP', value: -3  },
    10: { type: 'MONSTER', value: 6  },
    11: { type: 'MONSTER', value: 6  },
    12: { type: 'BOSS',    value: 21 }, // Dimanche — TODO
    13: { type: 'MONSTER', value: 2  },
    14: { type: 'MONSTER', value: 4  },
    15: { type: 'MONSTER', value: 4  },
    16: { type: 'UNDEAD', value: 5  },
    17: { type: 'MONSTER', value: 6, hasMana: true  },
    18: { type: 'TRAP', value: -6  },
    19: { type: 'BOSS',    value: 23 }, // Dimanche — TODO
    20: { type: 'MONSTER', value: 1  },
    21: { type: 'MONSTER', value: 3, hasMana: true  },
    22: { type: 'TRAP', value: -4  },
    23: { type: 'TRAP', value: -4  },
    24: { type: 'MONSTER', value: 5  },
    25: { type: 'MONSTER', value: 6  },
    26: { type: 'BOSS',    value: 25 }, // Dimanche — TODO
    27: { type: 'UNDEAD', value: 2  },
    28: { type: 'MONSTER', value: 3  },
    29: { type: 'MONSTER', value: 4  },
    30: { type: 'MONSTER', value: 5  },
  },

  // ──────────────────────────────────────────────────────────────
  //  MAI (index 4)  — Dimanches : 3, 10, 17, 24, 31
  // ──────────────────────────────────────────────────────────────
  4: {
     1: { type: 'TRAP', value: -1  },
     2: { type: 'MONSTER', value: 4  },
     3: { type: 'BOSS',    value: 19, isElite: true }, // Dimanche — TODO
     4: { type: 'TRAP', value: -2  },
     5: { type: 'UNDEAD', value: 3  },
     6: { type: 'MONSTER', value: 4, isElite: true, hasMana: true  },
     7: { type: 'UNDEAD', value: 4  },
     8: { type: 'MONSTER', value: 5  },
     9: { type: 'MONSTER', value: 6, hasMana: true  },
    10: { type: 'BOSS',    value: 24 }, // Dimanche — TODO
    11: { type: 'MONSTER', value: 2  },
    12: { type: 'TRAP', value: -3  },
    13: { type: 'MONSTER', value: 3  },
    14: { type: 'MONSTER', value: 5  },
    15: { type: 'MONSTER', value: 5, isElite: true  },
    16: { type: 'TRAP', value: -6  },
    17: { type: 'BOSS',    value: 22 }, // Dimanche — TODO
    18: { type: 'MONSTER', value: 1  },
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'UNDEAD', value: 2  },
    21: { type: 'MONSTER', value: 2, hasMana: true  },
    22: { type: 'MONSTER', value: 3  },
    23: { type: 'MONSTER', value: 3  },
    24: { type: 'BOSS',    value: 19 }, // Dimanche — TODO
    25: { type: 'MONSTER', value: 1  },
    26: { type: 'MONSTER', value: 3, isElite: true  },
    27: { type: 'TRAP', value: -3  },
    28: { type: 'MONSTER', value: 5  },
    29: { type: 'UNDEAD', value: 5  },
    30: { type: 'MONSTER', value: 6  },
    31: { type: 'BOSS',    value: 23 }, // Dimanche — TODO
  },

  // ──────────────────────────────────────────────────────────────
  //  JUIN (index 5)  — Dimanches : 7, 14, 21, 28
  // ──────────────────────────────────────────────────────────────
  5: {
     1: { type: 'TRAP', value: -1  },
     2: { type: 'UNDEAD', value: 2  },
     3: { type: 'MONSTER', value: 3  },
     4: { type: 'MONSTER', value: 5  },
     5: { type: 'MONSTER', value: 6  },
     6: { type: 'TRAP', value: -6  },
     7: { type: 'BOSS',    value: 21, hasMana: true  }, // Dimanche — TODO
     8: { type: 'MONSTER', value: 2  },
     9: { type: 'MONSTER', value: 3  },
    10: { type: 'UNDEAD', value: 4  },
    11: { type: 'MONSTER', value: 4  },
    12: { type: 'MONSTER', value: 5, hasMana: true   },
    13: { type: 'MONSTER', value: 5  },
    14: { type: 'BOSS',    value: 22, isElite: true }, // Dimanche — TODO
    15: { type: 'MONSTER', value: 2  },
    16: { type: 'MONSTER', value: 3, isElite: true  },
    17: { type: 'MONSTER', value: 3, hasMana: true   },
    18: { type: 'UNDEAD', value: 5  },
    19: { type: 'TRAP', value: -5  },
    20: { type: 'TRAP', value: -5  },
    21: { type: 'BOSS',    value: 23 }, // Dimanche — TODO
    22: { type: 'MONSTER', value: 1  },
    23: { type: 'MONSTER', value: 1  },
    24: { type: 'MONSTER', value: 2  },
    25: { type: 'MONSTER', value: 2  },
    26: { type: 'UNDEAD', value: 3  },
    27: { type: 'MONSTER', value: 3  },
    28: { type: 'BOSS',    value: 21, isElite: true }, // Dimanche — TODO
    29: { type: 'MONSTER', value: 2  },
    30: { type: 'MONSTER', value: 3  },
  },

  // ──────────────────────────────────────────────────────────────
  //  JUILLET (index 6)  — Dimanches : 5, 12, 19, 26
  // ──────────────────────────────────────────────────────────────
  6: {
     1: { type: 'TRAP', value: 11  },
     2: { type: 'DOUBLE', value: 2, value2: 3  },
     3: { type: 'UNDEAD', value: 4  },
     4: { type: 'MONSTER', value: 5, isElite: true  },
     5: { type: 'BOSS',    value: 21 }, // Dimanche — TODO
     6: { type: 'MONSTER', value: 2  },
     7: { type: 'TRAP', value: -2  },
     8: { type: 'MONSTER', value: 3  },
     9: { type: 'MONSTER', value: 5, hasMana: true  },
    10: { type: 'MONSTER', value: 6, isElite: true  },
    11: { type: 'MONSTER', value: 6  },
    12: { type: 'BOSS',    value: 24, hasMana: true }, // Dimanche — TODO
    13: { type: 'MONSTER', value: 1  },
    14: { type: 'UNDEAD', value: 2  },
    15: { type: 'DOUBLE', value: 3, value2: 4  },
    16: { type: 'MONSTER', value: 5  },
    17: { type: 'TRAP', value: -5  },
    18: { type: 'UNDEAD', value: 6  },
    19: { type: 'BOSS',    value: 22 }, // Dimanche — TODO
    20: { type: 'UNDEAD', value: 1  },
    21: { type: 'MONSTER', value: 3, isElite: true  },
    22: { type: 'MONSTER', value: 3  },
    23: { type: 'MONSTER', value: 3, hasMana: true  },
    24: { type: 'DOUBLE', value: 4, value2: 5  },
    25: { type: 'MONSTER', value: 5  },
    26: { type: 'BOSS',    value: 24, isElite: true }, // Dimanche — TODO
    27: { type: 'MONSTER', value: 2  },
    28: { type: 'DOUBLE', value: 3, value2: 4  },
    29: { type: 'TRAP', value: -4  },
    30: { type: 'MONSTER', value: 5  },
    31: { type: 'MONSTER', value: 6  },
  },

  // ──────────────────────────────────────────────────────────────
  //  AOÛT (index 7)  — Dimanches : 2, 9, 16, 23, 30
  // ──────────────────────────────────────────────────────────────
  7: {
     1: { type: 'MONSTER', value: 1  },
     2: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
     3: { type: 'MONSTER', value: 1  },
     4: { type: 'MONSTER', value: 1  },
     5: { type: 'MONSTER', value: 1  },
     6: { type: 'MONSTER', value: 1  },
     7: { type: 'MONSTER', value: 1  },
     8: { type: 'MONSTER', value: 1  },
     9: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    10: { type: 'MONSTER', value: 1  },
    11: { type: 'MONSTER', value: 1  },
    12: { type: 'MONSTER', value: 1  },
    13: { type: 'MONSTER', value: 1  },
    14: { type: 'MONSTER', value: 1  },
    15: { type: 'MONSTER', value: 1  },
    16: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    17: { type: 'MONSTER', value: 1  },
    18: { type: 'MONSTER', value: 1  },
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'MONSTER', value: 1  },
    21: { type: 'MONSTER', value: 1  },
    22: { type: 'MONSTER', value: 1  },
    23: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    24: { type: 'MONSTER', value: 1  },
    25: { type: 'MONSTER', value: 1  },
    26: { type: 'MONSTER', value: 1  },
    27: { type: 'MONSTER', value: 1  },
    28: { type: 'MONSTER', value: 1, isInvisible: true   },
    29: { type: 'MONSTER', value: 1  },
    30: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    31: { type: 'MONSTER', value: 1  },
  },

  // ──────────────────────────────────────────────────────────────
  //  SEPTEMBRE (index 8)  — Dimanches : 6, 13, 20, 27
  // ──────────────────────────────────────────────────────────────
  8: {
     1: { type: 'MONSTER', value: 1  },
     2: { type: 'UNDEAD', value: 1  },
     3: { type: 'MONSTER', value: 1  },
     4: { type: 'MONSTER', value: 1  },
     5: { type: 'MONSTER', value: 1  },
     6: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
     7: { type: 'MONSTER', value: 1  },
     8: { type: 'MONSTER', value: 1  },
     9: { type: 'MONSTER', value: 1  },
    10: { type: 'MONSTER', value: 1  },
    11: { type: 'MONSTER', value: 1  },
    12: { type: 'MONSTER', value: 1, isInvisible: true   },
    13: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    14: { type: 'MONSTER', value: 1  },
    15: { type: 'MONSTER', value: 1  },
    16: { type: 'MONSTER', value: 1  },
    17: { type: 'MONSTER', value: 1  },
    18: { type: 'MONSTER', value: 1  },
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    21: { type: 'MONSTER', value: 1  },
    22: { type: 'MONSTER', value: 1  },
    23: { type: 'MONSTER', value: 1  },
    24: { type: 'MONSTER', value: 1  },
    25: { type: 'MONSTER', value: 1  },
    26: { type: 'MONSTER', value: 1  },
    27: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    28: { type: 'MONSTER', value: 1  },
    29: { type: 'MONSTER', value: 1  },
    30: { type: 'NECROMANCER', value: 1  }, // Mercredi — TODO: vérifier la valeur
  },

  // ──────────────────────────────────────────────────────────────
  //  OCTOBRE (index 9)  — Dimanches : 4, 11, 18, 25
  //  Règle : Influence des Morts-Vivants Enchaînés
  //  Boss avec isInfluenced: true → si UNDEAD de l'aile vaincu, +10 pts bonus
  // ──────────────────────────────────────────────────────────────
  9: {
     1: { type: 'MONSTER', value: 1  },
     2: { type: 'UNDEAD',  value: 1  }, // Aile du boss 4 — TODO: vérifier
     3: { type: 'MONSTER', value: 1  },
     4: { type: 'BOSS',    value: 17, isInfluenced: true }, // Dimanche — TODO: valeur
     5: { type: 'MONSTER', value: 1  },
     6: { type: 'MONSTER', value: 1  },
     7: { type: 'UNDEAD',  value: 1  }, // Aile du boss 11 — TODO: vérifier
     8: { type: 'MONSTER', value: 1  },
     9: { type: 'MONSTER', value: 1  },
    10: { type: 'MONSTER', value: 1  },
    11: { type: 'BOSS',    value: 17, isInfluenced: true }, // Dimanche — TODO: valeur
    12: { type: 'MONSTER', value: 1  },
    13: { type: 'MONSTER', value: 1  },
    14: { type: 'UNDEAD',  value: 1  }, // Aile du boss 18 — TODO: vérifier
    15: { type: 'MONSTER', value: 1  },
    16: { type: 'MONSTER', value: 1  },
    17: { type: 'MONSTER', value: 1  },
    18: { type: 'BOSS',    value: 17, isInfluenced: true }, // Dimanche — TODO: valeur
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'MONSTER', value: 1  },
    21: { type: 'UNDEAD',  value: 1  }, // Aile du boss 25 — TODO: vérifier
    22: { type: 'MONSTER', value: 1  },
    23: { type: 'MONSTER', value: 1  },
    24: { type: 'MONSTER', value: 1  },
    25: { type: 'BOSS',    value: 17, isInfluenced: true }, // Dimanche — TODO: valeur
    26: { type: 'MONSTER', value: 1  },
    27: { type: 'MONSTER', value: 1  },
    28: { type: 'MONSTER', value: 1  },
    29: { type: 'MONSTER', value: 1  },
    30: { type: 'MONSTER', value: 1  },
    31: { type: 'MONSTER', value: 1  },
  },

  // ──────────────────────────────────────────────────────────────
  //  NOVEMBRE (index 10)  — Dimanches : 1, 8, 15, 22, 29
  // ──────────────────────────────────────────────────────────────
  10: {
     1: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
     2: { type: 'MONSTER', value: 1  },
     3: { type: 'MONSTER', value: 1  },
     4: { type: 'MONSTER', value: 1  },
     5: { type: 'MONSTER', value: 1  },
     6: { type: 'MONSTER', value: 1  },
     7: { type: 'MONSTER', value: 1  },
     8: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
     9: { type: 'MONSTER', value: 1  },
    10: { type: 'MONSTER', value: 1  },
    11: { type: 'MONSTER', value: 1  },
    12: { type: 'MONSTER', value: 1  },
    13: { type: 'MONSTER', value: 1  },
    14: { type: 'MONSTER', value: 1  },
    15: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    16: { type: 'MONSTER', value: 1  },
    17: { type: 'MONSTER', value: 1  },
    18: { type: 'MONSTER', value: 1  },
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'MONSTER', value: 1  },
    21: { type: 'MONSTER', value: 1  },
    22: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    23: { type: 'MONSTER', value: 1  },
    24: { type: 'MONSTER', value: 1  },
    25: { type: 'MONSTER', value: 1  },
    26: { type: 'MONSTER', value: 1  },
    27: { type: 'MONSTER', value: 1  },
    28: { type: 'MONSTER', value: 1  },
    29: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    30: { type: 'MONSTER', value: 1  },
  },

  // ──────────────────────────────────────────────────────────────
  //  DÉCEMBRE (index 11)  — Dimanches : 6, 13, 20, 27
  // ──────────────────────────────────────────────────────────────
  11: {
     1: { type: 'MONSTER', value: 1  },
     2: { type: 'MONSTER', value: 1  },
     3: { type: 'MONSTER', value: 1  },
     4: { type: 'MONSTER', value: 1  },
     5: { type: 'MONSTER', value: 1  },
     6: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
     7: { type: 'MONSTER', value: 1  },
     8: { type: 'MONSTER', value: 1  },
     9: { type: 'MONSTER', value: 1  },
    10: { type: 'MONSTER', value: 1  },
    11: { type: 'MONSTER', value: 1  },
    12: { type: 'MONSTER', value: 1  },
    13: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    14: { type: 'MONSTER', value: 1  },
    15: { type: 'MONSTER', value: 1  },
    16: { type: 'MONSTER', value: 1  },
    17: { type: 'MONSTER', value: 1  },
    18: { type: 'MONSTER', value: 1  },
    19: { type: 'MONSTER', value: 1  },
    20: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    21: { type: 'MONSTER', value: 1  },
    22: { type: 'MONSTER', value: 1  },
    23: { type: 'MONSTER', value: 1  },
    24: { type: 'MONSTER', value: 1  },
    25: { type: 'MONSTER', value: 1  },
    26: { type: 'MONSTER', value: 1  },
    27: { type: 'BOSS',    value: 17 }, // Dimanche — TODO
    28: { type: 'MONSTER', value: 1  },
    29: { type: 'MONSTER', value: 1  },
    30: { type: 'MONSTER', value: 1  },
    31: { type: 'MONSTER', value: 1  },
  },
};
