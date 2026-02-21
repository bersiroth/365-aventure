import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();
const SALT_ROUNDS = 10;
const PSEUDO_REGEX    = /^[a-zA-Z0-9_-]{3,20}$/;
const PASSWORD_REGEX  = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { pseudo, password, _hp } = req.body;

  // Honeypot — les bots remplissent ce champ, les humains non
  if (_hp) {
    return res.status(201).json({ token: 'ok', player: { id: 0, pseudo, save_data: '' } });
  }

  if (!pseudo || !password) {
    return res.status(400).json({ error: 'Pseudo et mot de passe requis' });
  }
  if (!PSEUDO_REGEX.test(pseudo)) {
    return res.status(400).json({ error: 'Pseudo: 3-20 caractères (lettres, chiffres, - et _)' });
  }
  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: 'Mot de passe: 8 caractères minimum, avec au moins 1 chiffre et 1 caractère spécial' });
  }

  const existing = db.prepare('SELECT id FROM players WHERE pseudo = ?').get(pseudo);
  if (existing) {
    return res.status(409).json({ error: 'Ce pseudo est déjà pris' });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = db.prepare('INSERT INTO players (pseudo, password_hash) VALUES (?, ?)').run(pseudo, hash);
    const token = signToken(result.lastInsertRowid);
    res.status(201).json({
      token,
      player: { id: result.lastInsertRowid, pseudo, save_data: '', trophies: '{}' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ error: 'Pseudo et mot de passe requis' });
  }

  const player = db.prepare('SELECT id, pseudo, password_hash, save_data, trophies FROM players WHERE pseudo = ?').get(pseudo);
  if (!player) {
    return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
  }

  try {
    const valid = await bcrypt.compare(password, player.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
    }

    const token = signToken(player.id);
    res.json({
      token,
      player: { id: player.id, pseudo: player.pseudo, save_data: player.save_data, trophies: player.trophies },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const player = db.prepare('SELECT id, pseudo, save_data, trophies, trophy_xp, level, total_score, monsters_defeated, traps_defeated, bosses_defeated, complete_wings, created_at FROM players WHERE id = ?').get(req.playerId);
  if (!player) {
    return res.status(404).json({ error: 'Joueur introuvable' });
  }
  res.json({ player });
});

export default router;
