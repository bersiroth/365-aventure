import { Award, Lock, User, TrendingDown } from 'lucide-react';
import {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar,
} from 'lucide-react';
import { TROPHY_DEFINITIONS, TROPHY_TIERS } from '../data/trophyData';
import { ScorePanel } from './ScorePanel';
import { calculateScore } from '../data/gameData';

const ICON_MAP = {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar, Award,
};

const TIER_ORDER = ['OR', 'ARGENT', 'BRONZE'];

function buildMonthlyScores(yearData) {
  if (!yearData) return [];
  return yearData.map((monthData) => {
    const s = calculateScore([monthData]);
    return { score: s.totalScore };
  });
}

function calcLongestStreak(yearData) {
  let maxStreak = 0, currentStreak = 0;
  const allDays = yearData
    .flatMap(month => month.weeks.flatMap(week => week.days))
    .sort((a, b) => a.globalIndex - b.globalIndex);
  for (const day of allDays) {
    if (day.completed) { currentStreak++; if (currentStreak > maxStreak) maxStreak = currentStreak; }
    else { currentStreak = 0; }
  }
  return maxStreak;
}

export function ProfilePage({ trophies, levelInfo, score, yearData, maxMonth = 11, showUndead, showMana, showElite, showDouble, showInvisible, showNecromancer, showInfluenced, showShaman, showFinalBoss }) {
  const unlockedCount = Object.keys(trophies || {}).length;
  const totalCount = TROPHY_DEFINITIONS.length;

  const exploits = yearData ? (() => {
    const data = buildMonthlyScores(yearData);
    const longestStreak = calcLongestStreak(yearData);
    const bestMonthIdx = data.reduce((bestIdx, m, i) => m.score > data[bestIdx].score ? i : bestIdx, 0);
    const bestMonth = data[bestMonthIdx]?.score > 0
      ? { score: data[bestMonthIdx].score, name: yearData[bestMonthIdx].name }
      : null;
    const allCompletedDays = yearData.flatMap(m => m.weeks.flatMap(w => w.days)).filter(d => d.completed);
    const monsterValueCounts = allCompletedDays
      .filter(d => d.type === 'MONSTER')
      .reduce((counts, d) => { counts[d.value] = (counts[d.value] || 0) + 1; return counts; }, {});
    const mostCommonMonster = Object.entries(monsterValueCounts).length > 0
      ? Object.entries(monsterValueCounts).reduce((best, [val, count]) =>
          count > best.count ? { value: Number(val), count } : best, { value: 0, count: 0 })
      : null;
    const bestBossValue = allCompletedDays.filter(d => d.type === 'BOSS').reduce((max, d) => Math.max(max, d.value), 0);
    const worstMonth = (() => {
      const pastMonths = yearData
        .map((month, i) => i < maxMonth ? { name: month.name, score: data[i].score, index: i } : null)
        .filter(Boolean).filter(m => m.index !== bestMonthIdx);
      return pastMonths.length > 0 ? pastMonths.reduce((w, m) => m.score < w.score ? m : w) : null;
    })();
    return { longestStreak, bestMonth, mostCommonMonster, bestBossValue, worstMonth };
  })() : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Profil</h2>
      </div>

      {/* Bannière niveau */}
      <LevelBanner levelInfo={levelInfo} unlockedCount={unlockedCount} totalCount={totalCount} />

      {/* Progression */}
      {score && (
        <ScorePanel score={score} showUndead={showUndead} showMana={showMana} showElite={showElite} showDouble={showDouble} showInvisible={showInvisible} showNecromancer={showNecromancer} showInfluenced={showInfluenced} showShaman={showShaman} showFinalBoss={showFinalBoss} />
      )}

      {/* Exploits */}
      {exploits && (
        <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-dungeon-gold/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-dungeon-gold/20">
            <h3 className="font-medieval font-semibold text-dungeon-gold text-sm uppercase tracking-wide">Exploits</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Flame size={28} className="text-orange-500 shrink-0" />
                <div>
                  <div className="text-3xl font-bold text-orange-500 leading-none">{exploits.longestStreak}</div>
                  <div className="text-xs text-gray-400 mt-1">cases consécutives validées</div>
                </div>
              </div>
              {exploits.bestMonth && (
                <div className="flex items-center gap-3">
                  <Trophy size={28} className="text-dungeon-gold shrink-0" />
                  <div>
                    <div className="text-3xl font-bold text-dungeon-gold leading-none">{exploits.bestMonth.name}</div>
                    <div className="text-xs text-gray-400 mt-1">meilleur mois — {exploits.bestMonth.score} pts</div>
                  </div>
                </div>
              )}
              {exploits.mostCommonMonster && (
                <div className="flex items-center gap-3">
                  <Skull size={28} className="text-gray-400 shrink-0" />
                  <div>
                    <div className="text-3xl font-bold text-gray-300 leading-none">{exploits.mostCommonMonster.value}</div>
                    <div className="text-xs text-gray-400 mt-1">valeur de monstre la plus vaincue ({exploits.mostCommonMonster.count}x)</div>
                  </div>
                </div>
              )}
              {exploits.bestBossValue > 0 && (
                <div className="flex items-center gap-3">
                  <Crown size={28} className="text-orange-400 shrink-0" />
                  <div>
                    <div className="text-3xl font-bold text-orange-400 leading-none">{exploits.bestBossValue}</div>
                    <div className="text-xs text-gray-400 mt-1">meilleure valeur de boss vaincu</div>
                  </div>
                </div>
              )}
              {exploits.worstMonth && (
                <div className="flex items-center gap-3">
                  <TrendingDown size={28} className="text-red-400 shrink-0" />
                  <div>
                    <div className="text-3xl font-bold text-red-400 leading-none">{exploits.worstMonth.name}</div>
                    <div className="text-xs text-gray-400 mt-1">pire mois passé — {exploits.worstMonth.score} pts</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrophiesListPage({ trophies }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Award className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Trophées</h2>
      </div>

      {/* Sections par tier */}
      {TIER_ORDER.map(tierKey => {
        const defs = TROPHY_DEFINITIONS.filter(t => t.tier === tierKey);
        const tierInfo = TROPHY_TIERS[tierKey];
        const unlockedInTier = defs.filter(d => trophies?.[d.id]).length;
        return (
          <div key={tierKey} className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-dungeon-gold/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-dungeon-gold/20 flex items-center justify-between">
              <h3 className="font-medieval font-semibold text-sm uppercase tracking-wide" style={{ color: tierInfo.color }}>
                Trophées {tierInfo.label}
              </h3>
              <span className="text-xs text-gray-500">{unlockedInTier}/{defs.length}</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {defs.map(def => (
                <TrophyCard key={def.id} definition={def} unlockedDate={trophies?.[def.id]} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LevelBanner({ levelInfo, unlockedCount, totalCount }) {
  const xpProgress = levelInfo.isMaxLevel
    ? 100
    : Math.min(100, Math.round((levelInfo.xpIntoLevel / levelInfo.xpForLevel) * 100));

  return (
    <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-2xl overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dungeon-gold to-amber-700 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl font-bold text-dungeon-dark">{levelInfo.level}</span>
            </div>
            <div>
              <div className="text-dungeon-gold font-medieval font-bold text-xl leading-tight">{levelInfo.title}</div>
              <div className="text-gray-400 text-sm">Niveau {levelInfo.level}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>{levelInfo.totalXP} XP</span>
              <span>{unlockedCount}/{totalCount} trophées</span>
            </div>
            <div className="w-full h-3 bg-dungeon-dark/80 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-gradient-to-r from-dungeon-gold to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {levelInfo.isMaxLevel
                ? 'Niveau maximum atteint !'
                : `${levelInfo.xpIntoLevel} / ${levelInfo.xpForLevel} XP`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrophyCard({ definition, unlockedDate }) {
  const isUnlocked = !!unlockedDate;
  const tier = TROPHY_TIERS[definition.tier];
  const Icon = ICON_MAP[definition.icon] || Trophy;

  return (
    <div className={`rounded-lg border p-3 text-center transition-all ${
      isUnlocked ? `${tier.border} bg-dungeon-dark/50` : 'border-gray-700/50 bg-dungeon-dark/30 opacity-40 grayscale'
    }`}>
      <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${
        isUnlocked ? tier.bg : 'from-gray-700 to-gray-600'
      } flex items-center justify-center mb-2`}>
        {isUnlocked ? <Icon size={24} className="text-dungeon-dark" /> : <Lock size={20} className="text-gray-500" />}
      </div>
      <div className="font-medieval font-bold text-xs leading-tight" style={{ color: isUnlocked ? tier.color : '#6b7280' }}>
        {definition.name}
      </div>
      <div className="text-[10px] text-gray-500 mt-1 leading-tight">{definition.description}</div>
      {isUnlocked && (
        <div className="mt-1.5 space-y-0.5">
          <div className="text-[9px] text-gray-600">{new Date(unlockedDate).toLocaleDateString('fr-FR')}</div>
          <div className="text-[9px] font-bold" style={{ color: tier.color }}>+{tier.xp} XP</div>
        </div>
      )}
    </div>
  );
}
