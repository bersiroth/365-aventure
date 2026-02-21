import { useState, useEffect, lazy, Suspense } from 'react';
import { Swords, ArrowLeft, BarChart2, Award } from 'lucide-react';
import { getPlayer } from '../api';
import { deserializeSave, calculateScore } from '../data/gameData';
import { calculateTrophyXP, getLevelInfo } from '../data/trophyData';
import { DungeonGrid } from './DungeonGrid';
import { ScorePanel } from './ScorePanel';
import { MonthSelector } from './MonthSelector';

const StatsPage = lazy(() => import('./StatsPage').then(m => ({ default: m.StatsPage })));
const TrophyPage = lazy(() => import('./TrophyPage').then(m => ({ default: m.TrophyPage })));

export function PlayerDetail({ playerId, onBack }) {
  const [player, setPlayer] = useState(null);
  const [yearData, setYearData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [tab, setTab] = useState('calendar'); // 'calendar' | 'stats' | 'trophies'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlayer(playerId)
      .then(data => {
        setPlayer(data.player);
        if (data.player.save_data) {
          const restored = deserializeSave(data.player.save_data);
          setYearData(restored);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Swords className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-dungeon-gold font-medieval">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-900/40 border border-red-600 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error || 'Joueur introuvable'}
        </div>
        <button onClick={onBack} className="mt-4 text-dungeon-gold hover:text-yellow-400 flex items-center gap-2 font-medieval">
          <ArrowLeft size={18} /> Retour au classement
        </button>
      </div>
    );
  }

  const score = yearData
    ? calculateScore(yearData)
    : { totalScore: 0, monstersDefeated: 0, trapsDefeated: 0, bossesDefeated: 0, completeWings: 0 };

  const playerTrophies = (() => {
    try { return typeof player.trophies === 'string' ? JSON.parse(player.trophies) : (player.trophies || {}); }
    catch { return {}; }
  })();
  const playerLevelInfo = getLevelInfo(calculateTrophyXP(playerTrophies));

  const now = new Date();
  const maxMonth = now.getFullYear() < 2026 ? 0
    : now.getFullYear() > 2026 ? 11
    : now.getMonth();

  return (
    <div>
      {/* Header joueur */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-4">
        <button onClick={onBack} className="text-dungeon-gold hover:text-yellow-400 flex items-center gap-2 font-medieval mb-4">
          <ArrowLeft size={18} /> Retour au classement
        </button>
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-medieval font-bold text-dungeon-gold">
            Donjon de {player.pseudo}
          </h2>
        </div>

        {/* Onglets */}
        {yearData && (
          <div className="flex justify-center gap-2 mb-2">
            <button
              onClick={() => setTab('calendar')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medieval font-semibold text-sm transition-colors ${
                tab === 'calendar'
                  ? 'bg-dungeon-gold text-dungeon-dark'
                  : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
              }`}
            >
              <Swords size={14} />
              Calendrier
            </button>
            <button
              onClick={() => setTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medieval font-semibold text-sm transition-colors ${
                tab === 'stats'
                  ? 'bg-dungeon-gold text-dungeon-dark'
                  : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
              }`}
            >
              <BarChart2 size={14} />
              Statistiques
            </button>
            <button
              onClick={() => setTab('trophies')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medieval font-semibold text-sm transition-colors ${
                tab === 'trophies'
                  ? 'bg-dungeon-gold text-dungeon-dark'
                  : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
              }`}
            >
              <Award size={14} />
              Trophées
            </button>
          </div>
        )}
      </div>

      <ScorePanel score={score} isReadOnly={true} showUndead={true} showMana={true} />

      {!yearData && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medieval text-lg">Ce joueur n'a pas encore commencé son aventure.</p>
        </div>
      )}

      {yearData && tab === 'calendar' && (
        <>
          <MonthSelector
            months={yearData}
            selectedMonth={Math.min(selectedMonth, maxMonth)}
            onMonthChange={setSelectedMonth}
            maxMonth={maxMonth}
          />
          <DungeonGrid
            monthData={yearData[Math.min(selectedMonth, maxMonth)]}
            onDayClick={() => {}}
            isReadOnly={true}
          />
        </>
      )}

      {yearData && tab === 'stats' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <BarChart2 className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-dungeon-gold font-medieval">Chargement des statistiques...</p>
          </div>
        }>
          <StatsPage yearData={yearData} />
        </Suspense>
      )}

      {tab === 'trophies' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <Award className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-dungeon-gold font-medieval">Chargement des trophées...</p>
          </div>
        }>
          <TrophyPage trophies={playerTrophies} levelInfo={playerLevelInfo} />
        </Suspense>
      )}
    </div>
  );
}
