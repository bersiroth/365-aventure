import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import playersRoutes from './routes/players.js';
import saveRoutes from './routes/save.js';
import devRoutes from './routes/dev.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3636;

app.use(express.json());

// Rate limiting — auth endpoints uniquement
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 requêtes max par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes.' },
});

// API routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/save', saveRoutes);

// Dev routes — non disponibles en production
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}

// Serve static frontend (production)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — all non-API routes serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API introuvable' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
