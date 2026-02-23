import { Trophy, Skull, Crown, Swords, Eye, AlertTriangle, Zap, Layers2, EyeOff, Axe, FlaskConical, Flame, Ghost, Star } from 'lucide-react';

function CrossedBonesIcon({ size = 24, className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4.5" cy="4.5" r="2.5" /><circle cx="19.5" cy="19.5" r="2.5" />
      <rect x="3" y="11" width="18" height="2" rx="1" transform="rotate(45 12 12)" />
      <circle cx="19.5" cy="4.5" r="2.5" /><circle cx="4.5" cy="19.5" r="2.5" />
      <rect x="3" y="11" width="18" height="2" rx="1" transform="rotate(-45 12 12)" />
    </svg>
  );
}


/**
 * Panneau d'affichage du score
 */
export function ScorePanel({ score, isReadOnly, showUndead, showMana, showElite, showDouble, showInvisible, showNecromancer, showInfluenced, showShaman, showFinalBoss }) {
  if (!score) return null;

  const optCount = (showUndead ? 1 : 0) + (showMana ? 1 : 0) + (showElite ? 1 : 0) + (showDouble ? 1 : 0) + (showInvisible ? 1 : 0) + (showNecromancer ? 1 : 0) + (showInfluenced ? 1 : 0) + (showShaman ? 1 : 0) + (showFinalBoss ? 1 : 0);
  const gridCols = optCount === 0 ? 'grid-cols-5'
    : optCount === 1 ? 'grid-cols-3'
    : optCount >= 4 ? 'grid-cols-5'
    : 'grid-cols-4';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Alerte Mode Lecture Seule */}
      {isReadOnly && (
        <div className="mb-6 bg-dungeon-blue/20 border-2 border-dungeon-blue rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="text-blue-400" size={24} />
            <div>
              <h3 className="font-medieval font-bold text-blue-400">Mode Lecture Seule</h3>
              <p className="text-sm text-gray-300">
                Vous consultez la progression d'un autre joueur. Pour jouer, retournez à la page d'accueil.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Panneau de Score */}
      <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-dungeon-gold/10 border-b-2 border-dungeon-gold/30 px-4 py-2 md:px-6 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Trophy className="text-dungeon-gold" size={20} />
            <h2 className="text-base md:text-2xl font-medieval font-bold text-dungeon-gold">
              Progression
            </h2>
          </div>
        </div>

        {/* Stats — mobile: grille / desktop: cartes */}
        <div className="p-3 md:p-6">
          {/* Mobile compact */}
          <div className={`md:hidden grid gap-[1px] bg-gray-700/40 rounded-lg overflow-hidden ${gridCols}`}>
            <MiniStat icon={<Trophy className="text-dungeon-gold" size={18} />} value={score.totalScore} color="text-dungeon-gold" label="Score" />
            <MiniStat icon={<Axe className="text-sky-600" size={18} />} value={score.monstersDefeated} color="text-sky-400" label="Monstres" />
            {showUndead && <MiniStat icon={<CrossedBonesIcon className="text-yellow-400" size={18} />} value={score.undeadDefeated} color="text-yellow-300" label="Morts" />}
            {showElite && <MiniStat icon={<Zap className="text-red-400" size={18} />} value={score.eliteDefeated} color="text-red-400" label="Élites" />}
            {showDouble && <MiniStat icon={<Layers2 className="text-indigo-400" size={18} />} value={score.doublesDefeated} color="text-indigo-400" label="Doubles" />}
            {showInvisible && <MiniStat icon={<EyeOff className="text-gray-400" size={18} />} value={score.invisiblesDefeated} color="text-gray-300" label="Invisibles" />}
            {showNecromancer && <MiniStat icon={<Skull className="text-green-600" size={18} />} value={score.necromancersDefeated ?? 0} color="text-green-500" label="Nécro." />}
            {showInfluenced && <MiniStat icon={<Flame className="text-orange-400" size={18} />} value={score.influencedBossesDefeated ?? 0} color="text-orange-400" label="Influen." />}
            {showShaman && <MiniStat icon={<Ghost className="text-purple-400" size={18} />} value={score.shamansDefeated ?? 0} color="text-purple-400" label="Shamans" />}
            {showFinalBoss && <MiniStat icon={<Star className="text-rose-400" size={18} />} value={score.finalBossDefeated ?? 0} color="text-rose-400" label="Boss Final" />}
            <MiniStat icon={<AlertTriangle className="text-violet-400" size={18} />} value={score.trapsDefeated} color="text-violet-400" label="Pièges" />
            <MiniStat icon={<Crown className="text-orange-400" size={18} />} value={score.bossesDefeated} color="text-orange-400" label="Boss" />
            <MiniStat icon={<Swords className="text-green-400" size={18} />} value={score.completeWings} color="text-green-400" label="Ailes" />
            {showMana && <MiniStat icon={<FlaskConical className="text-blue-400" size={18} />} value={score.manaPotionsEarned} color="text-blue-400" label="Potions" />}
          </div>

          {/* Desktop full cards */}
          <div className={`hidden md:grid gap-4 ${gridCols}`}>
            <StatCard icon={<Trophy className="text-dungeon-gold" size={32} />} value={score.totalScore} color="text-dungeon-gold" subtext="Score Total" />
            <StatCard icon={<Axe className="text-sky-600" size={32} />} label="Monstres" value={score.monstersDefeated} color="text-sky-400" subtext="+1 pt" />
            {showUndead && <StatCard icon={<CrossedBonesIcon className="text-yellow-400" size={32} />} label="Morts" value={score.undeadDefeated} color="text-yellow-300" subtext="+1 point" labelClassName="text-xs" />}
            {showElite && <StatCard icon={<Zap className="text-red-400" size={32} />} label="Élites" value={score.eliteDefeated} color="text-red-400" subtext="+1 point" labelClassName="text-xs" />}
            {showDouble && <StatCard icon={<Layers2 className="text-indigo-400" size={32} />} label="Doubles" value={score.doublesDefeated} color="text-indigo-400" subtext="+2 points bonus" labelClassName="text-xs" />}
            {showInvisible && <StatCard icon={<EyeOff className="text-gray-400" size={32} />} label="Invisibles" value={score.invisiblesDefeated} color="text-gray-300" subtext="+1 point" labelClassName="text-xs" />}
            {showNecromancer && <StatCard icon={<Skull className="text-green-600" size={32} />} label="Nécro" value={score.necromancersDefeated ?? 0} color="text-green-500" subtext="+1 point" labelClassName="text-xs" />}
            {showInfluenced && <StatCard icon={<Flame className="text-orange-400" size={32} />} label="Influencés" value={score.influencedBossesDefeated ?? 0} color="text-orange-400" subtext="+10 points bonus" labelClassName="text-xs" />}
            {showShaman && <StatCard icon={<Ghost className="text-purple-400" size={32} />} label="Shamans" value={score.shamansDefeated ?? 0} color="text-purple-400" subtext="+1 point" labelClassName="text-xs" />}
            {showFinalBoss && <StatCard icon={<Star className="text-rose-400" size={32} />} label="Boss Final" value={score.finalBossDefeated ?? 0} color="text-rose-400" subtext="+30 pts bonus" labelClassName="text-xs" />}
            <StatCard icon={<AlertTriangle className="text-violet-400" size={32} />} label="Pièges" value={score.trapsDefeated} color="text-violet-400" subtext="+1 point" />
            <StatCard icon={<Crown className="text-orange-400" size={32} />} label="Boss" value={score.bossesDefeated} color="text-orange-400" subtext="+2 points" />
            <StatCard icon={<Swords className="text-green-400" size={32} />} label="Ailes" value={score.completeWings} color="text-green-400" subtext="+3 points" />
            {showMana && <StatCard icon={<FlaskConical className="text-blue-400" size={32} />} label="Potions" value={score.manaPotionsEarned} color="text-blue-400" labelClassName="text-xs" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat compacte pour mobile (1 ligne dans une bande horizontale)
 */
function MiniStat({ icon, value, color, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-1 gap-1 min-w-0 bg-dungeon-dark/80">
      {icon}
      <div className={`text-xl font-bold leading-none ${color}`}>{value}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-wide text-center truncate w-full px-0.5">{label}</div>
    </div>
  );
}

/**
 * Carte de statistique (desktop)
 */
function StatCard({ icon, label, value, color, subtext, labelClassName = 'text-xs' }) {
  return (
    <div className="bg-dungeon-dark/50 rounded-lg p-4 border border-gray-700 hover:border-dungeon-gold/50 transition-colors flex flex-row items-center gap-2 justify-center">
      <div className="shrink-0 pr-4">{icon}</div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-bold leading-none ${color}`}>{value}</span>
          <span className={`${labelClassName} text-gray-400 uppercase tracking-wide leading-tight`}>{label}</span>
        </div>
        {subtext && (
          <div className="text-xs text-gray-500 mt-1 text-center w-full">{subtext}</div>
        )}
      </div>
    </div>
  );
}
