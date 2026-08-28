import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET est obligatoire en production : sans lui, le secret de repli public permettrait de forger un token pour n\'importe quel joueur.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '30d';

export function signToken(playerId) {
  return jwt.sign({ id: playerId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    req.playerId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}
