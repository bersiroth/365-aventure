import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { decodeSave, computeScoreFromSave } from '../gameLogic.js';

const router = Router();

// PUT /api/save
router.put('/', requireAuth, (req, res) => {
  const { save_data } = req.body;

  if (typeof save_data !== 'string') {
    return res.status(400).json({ error: 'save_data requis (string)' });
  }

  // Validate that save_data is a valid base64 save
  if (save_data !== '') {
    const bits = decodeSave(save_data);
    if (!bits) {
      return res.status(400).json({ error: 'Format de sauvegarde invalide' });
    }
  }

  const score = computeScoreFromSave(save_data);

  db.prepare(`
    UPDATE players
    SET save_data = ?, total_score = ?, monsters_defeated = ?, undead_defeated = ?, traps_defeated = ?, bosses_defeated = ?, complete_wings = ?, mana_potions_earned = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    save_data,
    score.totalScore,
    score.monstersDefeated,
    score.undeadDefeated,
    score.trapsDefeated,
    score.bossesDefeated,
    score.completeWings,
    score.manaPotionsEarned,
    req.playerId
  );

  res.json({ ok: true, score });
});

export default router;
