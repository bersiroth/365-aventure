import { useState } from 'react';
import { AlertTriangle, Trash2, Calendar, CheckSquare, Square, Shuffle } from 'lucide-react';
import { devReset } from '../api';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function DevPage({ yearData, devMaxMonth, setDevMaxMonth, setMonthCompleted, fillMonthRandom }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setResetting(true);
    try {
      await devReset();
      setResetDone(true);
      setConfirmReset(false);
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Bandeau avertissement */}
      <div className="bg-amber-900/40 border-2 border-amber-500 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="text-amber-400 shrink-0" size={28} />
        <div>
          <h2 className="font-medieval font-bold text-amber-400 text-lg">Zone de Développement</h2>
          <p className="text-amber-200/60 text-sm">Ces outils ne sont disponibles qu'en mode local.</p>
        </div>
      </div>

      {/* Reset BDD */}
      <Section title="Base de données" icon={<Trash2 size={16} />}>
        <p className="text-gray-400 text-sm mb-4">Supprime tous les comptes joueurs de la base de données.</p>
        {resetDone ? (
          <p className="text-green-400 text-sm font-medieval">✓ Base de données vidée</p>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            {confirmReset && (
              <p className="text-red-400 text-sm">Confirmer ? Cette action est irréversible.</p>
            )}
            <button
              onClick={handleReset}
              disabled={resetting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medieval font-semibold text-sm transition-colors disabled:opacity-50 ${
                confirmReset
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'border border-red-700 text-red-400 hover:bg-red-900/30'
              }`}
            >
              <Trash2 size={14} />
              {resetting ? 'Suppression...' : confirmReset ? 'Oui, tout supprimer' : 'Reset la BDD'}
            </button>
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="text-gray-500 text-sm hover:text-gray-300"
              >
                Annuler
              </button>
            )}
          </div>
        )}
      </Section>

      {/* Mois actif */}
      <Section title="Mois actif" icon={<Calendar size={16} />}>
        <p className="text-gray-400 text-sm mb-4">
          Simule le mois courant pour débloquer ou bloquer les règles progressives.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={11}
            value={devMaxMonth}
            onChange={e => setDevMaxMonth(parseInt(e.target.value, 10))}
            className="flex-1 accent-amber-400"
          />
          <span className="font-medieval text-amber-400 font-bold text-lg w-28 text-right">
            {MONTH_NAMES[devMaxMonth]}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5">
          <span>Janvier</span>
          <span>Décembre</span>
        </div>
      </Section>

      {/* Remplir / Vider les mois */}
      <Section title="Remplir / Vider un mois" icon={<CheckSquare size={16} />}>
        <p className="text-gray-400 text-sm mb-4">
          Marque tous les jours d'un mois comme complétés ou non complétés.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, i) => {
            const monthData = yearData?.[i];
            const total = monthData?.weeks.flatMap(w => w.days).length ?? 0;
            const done = monthData?.weeks.flatMap(w => w.days).filter(d => d.completed).length ?? 0;
            return (
              <div key={i} className="bg-dungeon-dark/50 border border-gray-700 rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medieval text-gray-300 text-sm">{name}</span>
                  <span className="text-xs text-gray-600">{done}/{total}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setMonthCompleted(i, true)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medieval bg-green-900/40 border border-green-700 text-green-400 hover:bg-green-900/70 transition-colors"
                  >
                    <CheckSquare size={11} /> Remplir
                  </button>
                  <button
                    onClick={() => fillMonthRandom(i)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medieval bg-amber-900/20 border border-amber-700 text-amber-400 hover:bg-amber-900/40 transition-colors"
                  >
                    <Shuffle size={11} /> Aléa
                  </button>
                  <button
                    onClick={() => setMonthCompleted(i, false)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medieval bg-red-900/20 border border-red-800 text-red-400 hover:bg-red-900/40 transition-colors"
                  >
                    <Square size={11} /> Vider
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-amber-700/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-700/20 flex items-center gap-2">
        <span className="text-amber-500">{icon}</span>
        <h3 className="font-medieval font-semibold text-amber-400 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
