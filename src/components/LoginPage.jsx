import { useState } from 'react';
import { Swords, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(pseudo, password, honeypot);
      } else {
        await login(pseudo, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-dungeon-gold/10 border-b-2 border-dungeon-gold/30 px-6 py-5 text-center">
          <Swords className="text-dungeon-gold mx-auto mb-2" size={40} />
          <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister ? 'Rejoignez le donjon !' : 'Entrez dans le donjon'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/40 border border-red-600 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1 font-medieval">Pseudo</label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-4 py-3 bg-dungeon-dark border-2 border-gray-700 rounded-lg text-white focus:border-dungeon-gold focus:outline-none transition-colors"
              placeholder="Votre pseudo"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1 font-medieval">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dungeon-dark border-2 border-gray-700 rounded-lg text-white focus:border-dungeon-gold focus:outline-none transition-colors"
              placeholder="Votre mot de passe"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
            {isRegister && (
              <p className="text-xs text-gray-500 mt-1">
                8 caractères minimum · 1 chiffre · 1 caractère spécial (!@#$%...)
              </p>
            )}
          </div>

          {/* Honeypot — caché aux humains, visible par les bots */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dungeon-gold hover:bg-yellow-500 text-dungeon-dark rounded-lg transition-colors font-medieval font-bold text-lg disabled:opacity-50"
          >
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
            {submitting ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-dungeon-gold hover:text-yellow-400 text-sm underline transition-colors"
            >
              {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
