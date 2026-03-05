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
import { Swords, LogOut, Users, BarChart2, Download, Upload, User, Award, Wrench, Dices, Settings } from 'lucide-react';
import { DevPage } from './components/DevPage';
import { DiceRoller } from './components/DiceRoller';
import { SettingsModal } from './components/SettingsModal';
import { playValidate, playDevalidate } from './utils/sound';
import { getSetting } from './utils/settings';
import confetti from 'canvas-confetti';

function fireWingComplete() {
  if (getSetting('animations')) {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.45 },
      colors: ['#D4AF37', '#F59E0B', '#F97316', '#EF4444', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  }
  if (getSetting('vibration')) navigator.vibrate?.([50, 30, 80]);
}

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
  const [pendingDayClick, setPendingDayClick] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const [unlockedMonths, setUnlockedMonths] = useState(new Set());
  const [versionOpen, setVersionOpen] = useState(false);
  const [showPrevRelease, setShowPrevRelease] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const importInputRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

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

  const handleDayClick = (monthIndex, weekIndex, dayIndex, willCompleteWing = false) => {
    if (!yearData) return;

    // Mois futur : toujours bloqué
    if (monthIndex > maxMonth) return;

    // Mois passé verrouillé : bloqué silencieusement (isReadOnly gère le visuel)
    if (monthIndex < maxMonth && !unlockedMonths.has(monthIndex)) return;

    const now = new Date();
    if (now.getFullYear() !== 2026) {
      const d = yearData[monthIndex]?.weeks[weekIndex]?.days[dayIndex];
      if (d?.completed) playDevalidate(); else playValidate();
      toggleDayCompletion(monthIndex, weekIndex, dayIndex);
      if (willCompleteWing) fireWingComplete();
      return;
    }

    // Calcul du lundi et dimanche de la semaine courante
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dow = today.getDay(); // 0=Dim, 1=Lun, …, 6=Sam
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const dayData = yearData[monthIndex]?.weeks[weekIndex]?.days[dayIndex];
    if (!dayData) {
      if (dayData?.completed) playDevalidate(); else playValidate();
      toggleDayCompletion(monthIndex, weekIndex, dayIndex);
      if (willCompleteWing) fireWingComplete();
      return;
    }

    const clickedDate = new Date(2026, monthIndex, dayData.day);
    if (clickedDate < monday || clickedDate > sunday) {
      setPendingDayClick({ monthIndex, weekIndex, dayIndex, dayData, monthName: yearData[monthIndex].name, willCompleteWing });
      return;
    }

    if (dayData.completed) playDevalidate(); else playValidate();
    toggleDayCompletion(monthIndex, weekIndex, dayIndex);
    if (willCompleteWing) fireWingComplete();
  };

  const toggleMonthLock = () => {
    setUnlockedMonths(prev => {
      const next = new Set(prev);
      if (next.has(selectedMonth)) {
        next.delete(selectedMonth);
      } else {
        next.add(selectedMonth);
      }
      return next;
    });
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < dy) return;
    const newMonth = dx < 0
      ? Math.min(selectedMonth + 1, maxMonth)
      : Math.max(selectedMonth - 1, 0);
    if (newMonth !== selectedMonth) setSelectedMonth(newMonth);
  };

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
              <h1 className="text-xl sm:text-3xl md:text-5xl font-medieval font-bold text-dungeon-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] leading-tight whitespace-nowrap">
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
        const isSelectedMonthLocked = selectedMonth < maxMonth && !unlockedMonths.has(selectedMonth);
        return (
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <MonthSelector
              months={yearData}
              selectedMonth={Math.min(selectedMonth, maxMonth)}
              onMonthChange={setSelectedMonth}
              maxMonth={maxMonth}
            />

            <DungeonGrid
              monthData={yearData[selectedMonth]}
              onDayClick={handleDayClick}
              isReadOnly={isSelectedMonthLocked}
              isPastMonth={selectedMonth < maxMonth}
              onToggleLock={toggleMonthLock}
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
            {/* Modale de confirmation hors semaine */}
            {pendingDayClick && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                <div className="w-full max-w-sm bg-dungeon-stone border-2 border-dungeon-gold/50 rounded-xl shadow-2xl p-6">
                  <h3 className="text-dungeon-gold font-medieval font-bold text-lg mb-3 text-center">
                    Modification hors semaine
                  </h3>
                  <p className="text-gray-300 text-sm text-center mb-2">
                    Le <span className="text-dungeon-gold font-semibold">{pendingDayClick.dayData.day} {pendingDayClick.monthName}</span> ne fait pas partie de la semaine en cours.
                  </p>
                  <p className="text-gray-500 text-xs text-center mb-6">
                    Confirme si c'est intentionnel, sinon annule pour éviter une erreur de manipulation.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPendingDayClick(null)}
                      className="flex-1 px-4 py-2 rounded-lg font-medieval font-semibold text-sm border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition-colors bg-dungeon-dark"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        const d = yearData[pendingDayClick.monthIndex]?.weeks[pendingDayClick.weekIndex]?.days[pendingDayClick.dayIndex];
                        if (d?.completed) playDevalidate(); else playValidate();
                        toggleDayCompletion(pendingDayClick.monthIndex, pendingDayClick.weekIndex, pendingDayClick.dayIndex);
                        if (pendingDayClick.willCompleteWing) fireWingComplete();
                        setPendingDayClick(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg font-medieval font-semibold text-sm bg-dungeon-gold text-dungeon-dark hover:bg-yellow-400 transition-colors font-bold"
                    >
                      Confirmer
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
                Exporter
              </button>
              <button
                onClick={() => importInputRef.current?.click()}
                disabled={importLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval text-xs text-gray-400 border border-gray-700 hover:border-dungeon-gold/50 hover:text-dungeon-gold transition-colors bg-dungeon-stone disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={13} />
                {importLoading ? 'Import...' : 'Importer'}
              </button>
            </div>

            {/* FAB Dés */}
            <button
              onClick={() => setDiceOpen(true)}
              className="fixed bottom-20 md:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-dungeon-gold text-dungeon-dark shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all"
              title="Lancer les dés"
            >
              <Dices size={26} />
            </button>
            {importError && (
              <p className="text-center text-red-400 text-xs font-medieval -mt-1 mb-2 px-4">
                {importError}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dungeon-dark via-dungeon-stone to-dungeon-dark text-white">
      {/* Header — masqué sur la vue d'un autre joueur */}
      <header className={`bg-dungeon-dark/80 border-b-2 border-dungeon-gold/50 ${currentView === 'player-detail' ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">

          {/* Titre */}
          <div className="flex items-center justify-between md:justify-center gap-3">
            {/* Mobile gauche : bouton Dev si DEV */}
            {import.meta.env.DEV && (
              <div className="md:hidden flex items-center w-16">
                  <button onClick={() => navigateTo('dev')} title="Dev"
                    className={`p-1.5 rounded-lg transition-colors ${currentView === 'dev' ? 'text-amber-400' : 'text-amber-700 hover:text-amber-400'}`}>
                    <Wrench size={15} />
                  </button>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <Swords className="text-dungeon-gold shrink-0" size={24} />
              <h1 onClick={() => navigateTo('game')}
                className="text-base sm:text-3xl md:text-5xl font-medieval font-bold text-dungeon-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] cursor-pointer leading-tight text-center md:whitespace-nowrap">
                365 Aventures : Le Donjon
              </h1>
            </div>

            {/* Mobile droite : Settings + Logout */}
            <div className="md:hidden flex items-center gap-1 w-16 justify-end">
              <button onClick={() => setSettingsOpen(true)} title="Paramètres"
                className="p-1.5 rounded-lg text-gray-400 hover:text-dungeon-gold transition-colors">
                <Settings size={17} />
              </button>
              <button onClick={() => setLogoutConfirmOpen(true)} title={`Se déconnecter (${player.pseudo})`}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                <LogOut size={17} />
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-1 text-xs md:text-sm hidden sm:block">
            Guidez Mira à travers les dédales du donjon, vainquez les monstres et terrassez les boss !
          </p>

          {/* Nav desktop uniquement */}
          <nav className="hidden md:flex flex-wrap items-center justify-center gap-2 mt-3">
            <NavButton active={currentView === 'game'}    onClick={() => navigateTo('game')}    icon={<Swords size={12} />}    label="Donjon" />
            <NavButton active={currentView === 'profile'} onClick={() => navigateTo('profile')} icon={<User size={12} />}      label="Profil" />
            <NavButton active={currentView === 'stats'}   onClick={() => navigateTo('stats')}   icon={<BarChart2 size={12} />} label="Stats" />
            <NavButton active={currentView === 'trophies'} onClick={() => navigateTo('trophies')} icon={<Award size={12} />}  label="Trophées" />
            <NavButton active={currentView === 'players' || currentView === 'player-detail'} onClick={() => navigateTo('players')} icon={<Users size={12} />} label="Classement" />
            {import.meta.env.DEV && (
              <button onClick={() => navigateTo('dev')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-sm transition-colors ${
                  currentView === 'dev' ? 'bg-amber-500 text-dungeon-dark' : 'bg-dungeon-stone border border-amber-700/50 text-amber-400 hover:border-amber-500 hover:text-amber-300'
                }`}>
                <Wrench size={12} />Dev
              </button>
            )}
            <button onClick={() => setSettingsOpen(true)} title="Paramètres"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-sm bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold transition-colors">
              <Settings size={12} />Paramètres
            </button>
            <button onClick={() => setLogoutConfirmOpen(true)} title={player.pseudo}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-medieval font-semibold text-sm bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors">
              <LogOut size={12} />
            </button>
          </nav>
        </div>
      </header>

      {/* Bottom navigation — mobile uniquement */}
      {currentView !== 'player-detail' && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dungeon-dark border-t-2 border-dungeon-gold/30 flex items-stretch"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <BottomNavItem active={currentView === 'game'}    onClick={() => navigateTo('game')}    icon={<Swords size={18} />}    label="Donjon" />
          <BottomNavItem active={currentView === 'profile'} onClick={() => navigateTo('profile')} icon={<User size={18} />}      label="Profil" />
          <BottomNavItem active={currentView === 'trophies'} onClick={() => navigateTo('trophies')} icon={<Award size={18} />}  label="Trophées" />
          <BottomNavItem active={currentView === 'stats'}   onClick={() => navigateTo('stats')}   icon={<BarChart2 size={18} />} label="Stats" />
          <BottomNavItem active={currentView === 'players' || currentView === 'player-detail'} onClick={() => navigateTo('players')} icon={<Users size={18} />} label="Classe." />
        </nav>
      )}

      {/* Notification trophée (PSN-style) */}
      {newTrophies.length > 0 && (
        <TrophyNotification trophy={newTrophies[0]} onDismiss={dismissTrophy} />
      )}

      {/* Modal Paramètres */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      {/* Modal Lancer de Dés */}
      {diceOpen && <DiceRoller onClose={() => setDiceOpen(false)} />}

      {/* Content */}
      {/*<div className={currentView !== 'player-detail' ? 'pb-0 md:pb-0' : ''}>*/}
        {renderView()}
      {/*</div>*/}

      {/* Footer */}
      <footer className="mt-6 py-8 sm:pb-8 pb-20 border-t border-dungeon-gold/30 bg-dungeon-dark/50">
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <p className="text-gray-400 text-sm">
            Inspiré du jeu "365 Aventures : Le Donjon" par Sorry We Are French
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Application web non officielle - Auto-hébergée avec ❤️ par Bersiroth
          </p>
          <button
            onClick={() => setVersionOpen(true)}
            className="absolute bottom--2 right-5 text-gray-400 hover:text-gray-400 text-xs font-medieval transition-colors"
          >
            v1.2.0
          </button>
        </div>
      </footer>

      {/* Modale confirmation déconnexion */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setLogoutConfirmOpen(false)}>
          <div className="bg-dungeon-stone border border-red-500/40 rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <LogOut className="text-red-400 shrink-0" size={22} />
              <h3 className="font-medieval font-bold text-white text-lg">Se déconnecter ?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              Ta progression est sauvegardée sur le serveur. Tu pourras te reconnecter avec ton pseudo et mot de passe.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 rounded-lg font-medieval text-sm bg-dungeon-dark border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => { setLogoutConfirmOpen(false); logout(); }}
                className="px-4 py-2 rounded-lg font-medieval text-sm bg-red-900/50 border border-red-500/60 text-red-300 hover:bg-red-900/80 hover:text-red-200 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale release notes */}
      {versionOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
          onClick={() => { setVersionOpen(false); setShowPrevRelease(false); }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-md bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.15)] p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* v1.2.0 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-dungeon-gold font-medieval font-bold text-lg">Notes de version</h3>
              <span className="text-dungeon-gold/60 font-medieval text-sm border border-dungeon-gold/30 rounded px-2 py-0.5">v1.2.0</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-dungeon-gold/40 to-transparent mb-4" />

            <div className="space-y-4 text-sm">
              <ReleaseSection title="Navigation mobile">
                <ReleaseItem>Barre de navigation fixe en bas de l'écran (5 onglets)</ReleaseItem>
                <ReleaseItem>Bouton flottant (FAB) pour le lanceur de dés</ReleaseItem>
                <ReleaseItem>Header simplifié sur mobile avec accès rapide aux paramètres</ReleaseItem>
              </ReleaseSection>

              <ReleaseSection title="Sons & Retour sensoriel">
                <ReleaseItem>Son d'épée à la validation d'une case</ReleaseItem>
                <ReleaseItem>Bruit sourd à la dévalidation</ReleaseItem>
                <ReleaseItem>Vibration haptique sur les interactions</ReleaseItem>
                <ReleaseItem>Confetti à la conquête d'une aile complète</ReleaseItem>
              </ReleaseSection>

              <ReleaseSection title="Paramètres">
                <ReleaseItem>Modal de paramètres : sons, vibrations et animations activables indépendamment</ReleaseItem>
              </ReleaseSection>

              <ReleaseSection title="Correctifs">
                <ReleaseItem>Affichage correct des cases Double + Invisible (octobre)</ReleaseItem>
              </ReleaseSection>
            </div>

            {/* Lien vers v1.1.0 */}
            <button
              onClick={() => setShowPrevRelease(v => !v)}
              className="mt-5 text-xs text-gray-500 hover:text-dungeon-gold transition-colors font-medieval flex items-center gap-1"
            >
              <span>{showPrevRelease ? '▲' : '▼'}</span>
              {showPrevRelease ? 'Masquer' : 'Voir'} les notes v1.1.0
            </button>

            {showPrevRelease && (
              <div className="mt-3 pt-4 border-t border-dungeon-gold/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-dungeon-gold/50 font-medieval text-xs uppercase tracking-wide">Version précédente</span>
                  <span className="text-dungeon-gold/40 font-medieval text-xs border border-dungeon-gold/20 rounded px-2 py-0.5">v1.1.0</span>
                </div>
                <div className="space-y-4 text-sm">
                  <ReleaseSection title="Navigation & Lisibilité">
                    <ReleaseItem>Labels toujours visibles sur tous les boutons de navigation mobile</ReleaseItem>
                    <ReleaseItem>Menu du donjon d'un autre joueur aligné sur la navigation principale</ReleaseItem>
                    <ReleaseItem>Mini labels sous les icônes de stats (liste des joueurs & tableau récap)</ReleaseItem>
                    <ReleaseItem>Labels sous les boutons Cadenas et Nouvelle règle sur mobile</ReleaseItem>
                  </ReleaseSection>

                  <ReleaseSection title="Calendrier">
                    <ReleaseItem>Verrouillage automatique des mois passés (lecture seule par défaut)</ReleaseItem>
                    <ReleaseItem>Bouton cadenas pour déverrouiller temporairement un mois</ReleaseItem>
                    <ReleaseItem>Swipe horizontal pour changer de mois (donjon perso & consultation)</ReleaseItem>
                    <ReleaseItem>Popup de confirmation lors d'une modification hors semaine courante</ReleaseItem>
                  </ReleaseSection>

                  <ReleaseSection title="Statistiques">
                    <ReleaseItem>Graphiques et tableau limités aux mois passés + mois courant</ReleaseItem>
                  </ReleaseSection>

                  <ReleaseSection title="Général">
                    <ReleaseItem>Numéro de version en pied de page avec popup de release notes</ReleaseItem>
                    <ReleaseItem>Popup de confirmation avant la déconnexion</ReleaseItem>
                  </ReleaseSection>
                </div>
              </div>
            )}

            <button
              onClick={() => { setVersionOpen(false); setShowPrevRelease(false); }}
              className="mt-6 w-full py-2 rounded-lg bg-dungeon-gold/10 border border-dungeon-gold/30 text-dungeon-gold font-medieval text-sm hover:bg-dungeon-gold/20 transition-colors"
            >
              Fermer
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReleaseSection({ title, children }) {
  return (
    <div>
      <h4 className="text-dungeon-gold font-medieval font-semibold text-xs uppercase tracking-wide mb-1.5">{title}</h4>
      <ul className="space-y-1 pl-1">{children}</ul>
    </div>
  );
}

function ReleaseItem({ children, muted }) {
  return (
    <li className={`flex items-start gap-2 ${muted ? 'text-gray-600 italic' : 'text-gray-300'}`}>
      <span className="text-dungeon-gold/50 mt-0.5 shrink-0">·</span>
      <span>{children}</span>
    </li>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medieval font-semibold text-sm transition-colors ${
        active ? 'bg-dungeon-gold text-dungeon-dark' : 'bg-dungeon-stone border border-gray-700 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold'
      }`}
    >
      {icon}{label}
    </button>
  );
}

function BottomNavItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
        active ? 'text-dungeon-gold' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon}
      <span className="text-[9px] font-medieval font-semibold leading-none uppercase">
        {label}
      </span>
      {active && <span className="absolute bottom-0 w-8 h-0.5 bg-dungeon-gold rounded-t-full" />}
    </button>
  );
}

export default App;
