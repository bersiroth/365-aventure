import { useState, lazy, Suspense, useRef } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useAuth } from './contexts/AuthContext';
import { DungeonGrid } from './components/DungeonGrid';
import { MonthSelector } from './components/MonthSelector';
import { LoginPage } from './components/LoginPage';
import { PlayerList } from './components/PlayerList';
import { PlayerDetail } from './components/PlayerDetail';
import { TrophyNotification } from './components/TrophyNotification';
const StatsPage = lazy(() => import('./components/StatsPage').then(m => ({ default: m.StatsPage })));
const ProfilePage = lazy(() => import('./components/TrophyPage').then(m => ({ default: m.ProfilePage })));
const TrophiesListPage = lazy(() => import('./components/TrophyPage').then(m => ({ default: m.TrophiesListPage })));
import { Swords, LogOut, Users, BarChart2, Download, Upload, User, Award, Wrench, Dices } from 'lucide-react';
import { DevPage } from './components/DevPage';
import { DiceRoller } from './components/DiceRoller';

/**
 * Application principale
 * Views: game | players | player-detail
 * Si non connecté : uniquement LoginPage
 */
function App() {
  const { player, loading: authLoading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('game');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [pendingImportFile, setPendingImportFile] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const importInputRef = useRef(null);

  // Dev : mois actif overridable via slider (doit être avant tout return anticipé)
  const [devMaxMonth, setDevMaxMonthState] = useState(() => {
    if (!import.meta.env.DEV) return 11;
    const stored = localStorage.getItem('donjon_dev_maxMonth');
    return stored !== null ? parseInt(stored, 10) : 11;
  });
  const setDevMaxMonth = (v) => {
    setDevMaxMonthState(v);
    localStorage.setItem('donjon_dev_maxMonth', v);
  };

  const {
    yearData,
    selectedMonth,
    setSelectedMonth,
    toggleDayCompletion,
    toggleManaUsed,
    toggleStaffUsed,
    toggleCapeUsed,
    toggleRingUsed,
    setMonthCompleted,
    fillMonthRandom,
    fillAllMonthsRandom,
    resetTrophies,
    score,
    trophies,
    newTrophies,
    dismissTrophy,
    levelInfo,
    exportBackup,
    importBackup,
    importLoading,
    importError,
  } = useGameEngine(player);

  // Chargement de l'auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dungeon-dark flex items-center justify-center">
        <div className="text-center">
          <Swords className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={64} />
          <p className="text-dungeon-gold font-medieval text-xl">Chargement du donjon...</p>
        </div>
      </div>
    );
  }

  // Non connecté : uniquement la page de connexion/inscription
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dungeon-dark via-dungeon-stone to-dungeon-dark text-white">
        <header className="bg-dungeon-dark/80 border-b-2 border-dungeon-gold/50">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Swords className="text-dungeon-gold shrink-0" size={28} />
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-medieval font-bold text-dungeon-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] leading-tight">
                365 Aventures : Le Donjon
              </h1>
            </div>
            <p className="text-gray-400 mt-1 text-xs md:text-sm hidden sm:block">
              Guidez Mira à travers les dédales du donjon, vainquez les monstres et terrassez les boss !
            </p>
          </div>
        </header>
        <LoginPage />
        <footer className="mt-12 py-8 border-t border-dungeon-gold/30 bg-dungeon-dark/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              Inspiré du jeu "365 Aventures : Le Donjon" par Sorry We Are French
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Application web non officielle - Auto-hébergée avec ❤️ par Bersiroth
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Mois accessible : mois courant et passés (pour l'année 2026)
  const now = new Date();
  const dateMaxMonth = now.getFullYear() < 2026 ? 0
    : now.getFullYear() > 2026 ? 11
    : now.getMonth();
  const maxMonth = import.meta.env.DEV ? devMaxMonth : dateMaxMonth;

  // Connecté
  const navigateTo = (view) => {
    setCurrentView(view);
    setSelectedPlayerId(null);
  };

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayerId(playerId);
    setCurrentView('player-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'stats':
        return (
          <Suspense fallback={
            <div className="text-center py-12">
              <BarChart2 className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
              <p className="text-dungeon-gold font-medieval">Chargement des statistiques...</p>
            </div>
          }>
            <StatsPage yearData={yearData} maxMonth={maxMonth} />
          </Suspense>
        );

      case 'profile':
        return (
          <Suspense fallback={
            <div className="text-center py-12">
              <User className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
              <p className="text-dungeon-gold font-medieval">Chargement du profil...</p>
            </div>
          }>
            <ProfilePage trophies={trophies} levelInfo={levelInfo} score={score} yearData={yearData} maxMonth={maxMonth} showUndead={maxMonth >= 2} showElite={maxMonth >= 4} showDouble={maxMonth >= 6} showMana={maxMonth >= 1} showInvisible={maxMonth >= 8} showNecromancer={maxMonth >= 8} showInfluenced={maxMonth >= 9} showShaman={maxMonth >= 10} showFinalBoss={maxMonth >= 11} pseudo={player.pseudo} />
          </Suspense>
        );

      case 'trophies':
        return (
          <Suspense fallback={
            <div className="text-center py-12">
              <Award className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
              <p className="text-dungeon-gold font-medieval">Chargement des trophées...</p>
            </div>
          }>
            <TrophiesListPage trophies={trophies} maxMonth={maxMonth} score={score} yearData={yearData} />
          </Suspense>
        );

      case 'dev':
        return (
          <DevPage
            yearData={yearData}
            devMaxMonth={devMaxMonth}
            setDevMaxMonth={setDevMaxMonth}
            setMonthCompleted={setMonthCompleted}
            fillMonthRandom={fillMonthRandom}
            fillAllMonthsRandom={fillAllMonthsRandom}
            resetTrophies={resetTrophies}
          />
        );

      case 'players':
        return <PlayerList onSelectPlayer={handleSelectPlayer} currentPlayerId={player?.id} showUndead={maxMonth >= 2} showElite={maxMonth >= 4} showDouble={maxMonth >= 6} showMana={maxMonth >= 1} showInvisible={maxMonth >= 8} showNecromancer={maxMonth >= 8} showInfluenced={maxMonth >= 9} showShaman={maxMonth >= 10} showFinalBoss={maxMonth >= 11} />;

      case 'player-detail':
        return (
          <PlayerDetail
            playerId={selectedPlayerId}
            onBack={() => setCurrentView('players')}
            maxMonth={maxMonth}
          />
        );

      case 'game':
      default:
        if (!yearData) {
          return (
            <div className="text-center py-12">
              <Swords className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
              <p className="text-dungeon-gold font-medieval text-xl">Chargement...</p>
            </div>
          );
        }
        return (
          <>
            <MonthSelector
              months={yearData}
              selectedMonth={Math.min(selectedMonth, maxMonth)}
              onMonthChange={setSelectedMonth}
              maxMonth={maxMonth}
            />
            <DungeonGrid
              monthData={yearData[selectedMonth]}
              onDayClick={toggleDayCompletion}
              onManaToggle={toggleManaUsed}
              onStaffToggle={toggleStaffUsed}
              onCapeToggle={toggleCapeUsed}
              onRingToggle={toggleRingUsed}
            />
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPendingImportFile(file);
                e.target.value = '';
              }}
            />

            {/* Modale de confirmation d'import */}
            {pendingImportFile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                <div className="w-full max-w-sm bg-dungeon-stone border-2 border-red-600/60 rounded-xl shadow-2xl p-6">
                  <h3 className="text-dungeon-gold font-medieval font-bold text-lg mb-3 text-center">
                    Importer une sauvegarde
                  </h3>
                  <p className="text-gray-300 text-sm text-center mb-2">
                    Cette action va <span className="text-red-400 font-semibold">remplacer définitivement</span> ton calendrier actuel par le contenu du fichier&nbsp;:
                  </p>
                  <p className="text-dungeon-gold text-xs text-center font-medieval mb-4 truncate px-2">
                    {pendingImportFile.name}
                  </p>
                  <p className="text-gray-500 text-xs text-center mb-6">
                    Cette opération est irréversible.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPendingImportFile(null)}
                      className="flex-1 px-4 py-2 rounded-lg font-medieval font-semibold text-sm border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition-colors bg-dungeon-dark"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => { importBackup(pendingImportFile); setPendingImportFile(null); }}
                      disabled={importLoading}
                      className="flex-1 px-4 py-2 rounded-lg font-medieval font-semibold text-sm bg-red-700 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                    >
                      Confirmer l'import
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={exportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval text-xs text-gray-400 border border-gray-700 hover:border-dungeon-gold/50 hover:text-dungeon-gold transition-colors bg-dungeon-stone"
              >
                <Download size={13} />
                Exporter ma sauvegarde
              </button>
              <button
                onClick={() => importInputRef.current?.click()}
                disabled={importLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval text-xs text-gray-400 border border-gray-700 hover:border-dungeon-gold/50 hover:text-dungeon-gold transition-colors bg-dungeon-stone disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={13} />
                {importLoading ? 'Import...' : 'Importer une sauvegarde'}
              </button>
            </div>
            {importError && (
              <p className="text-center text-red-400 text-xs font-medieval -mt-1 mb-2 px-4">
                {importError}
              </p>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dungeon-dark via-dungeon-stone to-dungeon-dark text-white">
      {/* Header — masqué sur la vue d'un autre joueur */}
      <header className={`bg-dungeon-dark/80 border-b-2 border-dungeon-gold/50 backdrop-blur-sm top-0 z-40 ${currentView === 'player-detail' ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
          <div className="flex items-center justify-center gap-3">
            <Swords className="text-dungeon-gold shrink-0" size={28} />
            <h1
              onClick={() => navigateTo('game')}
              className="text-2xl sm:text-3xl md:text-5xl font-medieval font-bold text-dungeon-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] cursor-pointer leading-tight text-center"
            >
              365 Aventures : Le Donjon
            </h1>
          </div>
          <p className="text-center text-gray-400 mt-1 text-xs md:text-sm hidden sm:block">
            Guidez Mira à travers les dédales du donjon, vainquez les monstres et terrassez les boss !
          </p>

          {/* Navigation */}
          <nav className="flex items-center justify-center gap-2 mt-3">
            <NavButton active={currentView === 'game'} onClick={() => navigateTo('game')} icon={<Swords size={14} />} label="Donjon" />
            <NavButton active={currentView === 'profile'} onClick={() => navigateTo('profile')} icon={<User size={14} />} label="Profil" />
            <NavButton active={currentView === 'stats'} onClick={() => navigateTo('stats')} icon={<BarChart2 size={14} />} label="Stats" />
            <NavButton active={currentView === 'trophies'} onClick={() => navigateTo('trophies')} icon={<Award size={14} />} label="Trophées" />
            <NavButton active={false} onClick={() => setDiceOpen(true)} icon={<Dices size={14} />} label="Dés" />
            <NavButton active={currentView === 'players' || currentView === 'player-detail'} onClick={() => navigateTo('players')} icon={<Users size={14} />} label="Classement" />
            {import.meta.env.DEV && (
              <button
                onClick={() => navigateTo('dev')}
                title="Dev"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
                  currentView === 'dev'
                    ? 'bg-amber-500 text-dungeon-dark'
                    : 'bg-dungeon-stone border border-amber-700/50 text-amber-400 hover:border-amber-500 hover:text-amber-300'
                }`}
              >
                <Wrench size={14} />
                <span className="hidden sm:inline">Dev</span>
              </button>
            )}
            <button
              onClick={logout}
              title={player.pseudo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline max-w-[80px] truncate">{player.pseudo}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Notification trophée (PSN-style) */}
      {newTrophies.length > 0 && (
        <TrophyNotification trophy={newTrophies[0]} onDismiss={dismissTrophy} />
      )}

      {/* Modal Lancer de Dés */}
      {diceOpen && <DiceRoller onClose={() => setDiceOpen(false)} />}

      {/* Content */}
      {renderView()}

      {/* Footer */}
      <footer className="mt-6 py-8 border-t border-dungeon-gold/30 bg-dungeon-dark/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Inspiré du jeu "365 Aventures : Le Donjon" par Sorry We Are French
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Application web non officielle - Auto-hébergée avec ❤️ par Bersiroth
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-xs sm:text-sm transition-colors ${
        active
          ? 'bg-dungeon-gold text-dungeon-dark'
          : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default App;
