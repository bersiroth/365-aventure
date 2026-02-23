import { useState, useEffect, lazy, Suspense } from 'react';
import { Swords, ArrowLeft, BarChart2, User, Award, Eye } from 'lucide-react';
import { getPlayer } from '../api';
import { deserializeSave, calculateScore } from '../data/gameData';
import { calculateTrophyXP, getLevelInfo } from '../data/trophyData';
import { DungeonGrid } from './DungeonGrid';
import { MonthSelector } from './MonthSelector';

const StatsPage = lazy(() => import('./StatsPage').then(m => ({ default: m.StatsPage })));
const ProfilePage = lazy(() => import('./TrophyPage').then(m => ({ default: m.ProfilePage })));
const TrophiesListPage = lazy(() => import('./TrophyPage').then(m => ({ default: m.TrophiesListPage })));

export function PlayerDetail({ playerId, onBack, maxMonth = 11 }) {
  const [player, setPlayer] = useState(null);
  const [yearData, setYearData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [tab, setTab] = useState('profile'); // 'profile' | 'stats' | 'trophies' | 'calendar'
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
        <div className="flex justify-center gap-2 mb-2">
          <button
            onClick={() => setTab('profile')}
            title="Profil"
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
              tab === 'profile'
                ? 'bg-dungeon-gold text-dungeon-dark'
                : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
            }`}
          >
            <User size={14} />
            <span className="hidden sm:inline">Profil</span>
          </button>
          {yearData && (
            <>
              <button
                onClick={() => setTab('stats')}
                title="Statistiques"
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
                  tab === 'stats'
                    ? 'bg-dungeon-gold text-dungeon-dark'
                    : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
                }`}
              >
                <BarChart2 size={14} />
                <span className="hidden sm:inline">Statistiques</span>
              </button>
            </>
          )}
          <button
            onClick={() => setTab('trophies')}
            title="Trophées"
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
              tab === 'trophies'
                ? 'bg-dungeon-gold text-dungeon-dark'
                : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
            }`}
          >
            <Award size={14} />
            <span className="hidden sm:inline">Trophées</span>
          </button>
          {yearData && (
            <button
              onClick={() => setTab('calendar')}
              title="Donjon"
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
                tab === 'calendar'
                  ? 'bg-dungeon-gold text-dungeon-dark'
                  : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
              }`}
            >
              <Swords size={14} />
              <span className="hidden sm:inline">Donjon</span>
            </button>
          )}
        </div>
      </div>

      {tab === 'profile' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <User className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-dungeon-gold font-medieval">Chargement du profil...</p>
          </div>
        }>
          <ProfilePage trophies={playerTrophies} levelInfo={playerLevelInfo} score={score} yearData={yearData} maxMonth={maxMonth} showUndead={maxMonth >= 2} showElite={maxMonth >= 4} showDouble={maxMonth >= 6} showMana={maxMonth >= 1} showInvisible={maxMonth >= 8} showNecromancer={maxMonth >= 8} showInfluenced={maxMonth >= 9} showShaman={maxMonth >= 10} showFinalBoss={maxMonth >= 11} />
        </Suspense>
      )}

      {!yearData && tab !== 'profile' && tab !== 'trophies' && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medieval text-lg">Ce joueur n'a pas encore commencé son aventure.</p>
        </div>
      )}

      {tab === 'trophies' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <Award className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-dungeon-gold font-medieval">Chargement des trophées...</p>
          </div>
        }>
          <TrophiesListPage trophies={playerTrophies} maxMonth={maxMonth} />
        </Suspense>
      )}

      {yearData && tab === 'stats' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <BarChart2 className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
            <p className="text-dungeon-gold font-medieval">Chargement des statistiques...</p>
          </div>
        }>
          <StatsPage yearData={yearData} maxMonth={maxMonth} />
        </Suspense>
      )}

      {yearData && tab === 'calendar' && (
        <>
          <div className="flex items-center justify-center gap-1.5 text-blue-400/70 text-xs font-medieval py-2">
            <Eye size={12} />
            <span>Mode lecture seule</span>
          </div>
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
    </div>
  );
}
