import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/dev/reset — supprime tous les joueurs de la BDD
router.post('/reset', (_req, res) => {
  db.prepare('DELETE FROM players').run();
  res.json({ ok: true });
});

export default router;
