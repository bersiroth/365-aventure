import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { decodeSave, computeScoreFromSave } from '../gameLogic.js';
import { computeTrophyXP, computeLevel } from '../trophyLogic.js';

const router = Router();

// PUT /api/save
router.put('/', requireAuth, (req, res) => {
  const { save_data, trophies } = req.body;

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

  // Trophées
  let trophiesJson = '{}';
  let trophyXp = 0;
  let level = 1;
  if (trophies && typeof trophies === 'object') {
    trophiesJson = JSON.stringify(trophies);
    trophyXp = computeTrophyXP(trophies);
    level = computeLevel(trophyXp);
  }

  db.prepare(`
    UPDATE players
    SET save_data = ?, total_score = ?, monsters_defeated = ?, undead_defeated = ?,
        elite_defeated = ?, doubles_defeated = ?, invisibles_defeated = ?, necromancer_defeated = ?, influenced_bosses_defeated = ?, traps_defeated = ?, bosses_defeated = ?, complete_wings = ?,
        mana_potions_earned = ?, trophies = ?, trophy_xp = ?, level = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    save_data,
    score.totalScore, score.monstersDefeated, score.undeadDefeated,
    score.eliteDefeated, score.doublesDefeated, score.invisiblesDefeated, score.necromancersDefeated, score.influencedBossesDefeated, score.trapsDefeated, score.bossesDefeated, score.completeWings,
    score.manaPotionsEarned, trophiesJson, trophyXp, level,
    req.playerId
  );

  res.json({ ok: true, score });
});

export default router;
