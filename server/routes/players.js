import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/players — classement
router.get('/', (req, res) => {
  const players = db.prepare(`
    SELECT id, pseudo, total_score, monsters_defeated, undead_defeated, elite_defeated, doubles_defeated,
           traps_defeated, bosses_defeated, complete_wings, mana_potions_earned, trophy_xp, level, created_at
    FROM players
    ORDER BY total_score DESC, pseudo ASC
  `).all();
  res.json({ players });
});

// GET /api/players/:id — detail d'un joueur (avec save_data)
router.get('/:id', (req, res) => {
  const player = db.prepare(`
    SELECT id, pseudo, save_data, total_score, monsters_defeated, undead_defeated, elite_defeated, doubles_defeated,
           traps_defeated, bosses_defeated, complete_wings, mana_potions_earned, trophies, trophy_xp, level, created_at
    FROM players WHERE id = ?
  `).get(req.params.id);

  if (!player) {
    return res.status(404).json({ error: 'Joueur introuvable' });
  }
  res.json({ player });
});

export default router;
