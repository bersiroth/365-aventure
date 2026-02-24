import { Award, Lock, User, TrendingDown, Share2 } from 'lucide-react';
import {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Shield, Flame, Trophy, Zap, Layers2, EyeOff, Ghost,
} from 'lucide-react';
import { TROPHY_DEFINITIONS, TROPHY_TIERS } from '../data/trophyData';
import { downloadProgressImage } from '../utils/shareCard';
import { ScorePanel } from './ScorePanel';
import { calculateScore } from '../data/gameData';
import { getTrophyProb, DEV_COMPLETION_RATE, DEV_COMPLETION_RATE_BRONZE, DEV_COMPLETION_RATE_GOLD } from '../utils/trophyProbability';

const TIER_RATE = {
  BRONZE: DEV_COMPLETION_RATE_BRONZE,
  ARGENT: DEV_COMPLETION_RATE,
  OR:     DEV_COMPLETION_RATE_GOLD,
};

const ICON_MAP = {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Shield, Flame, Trophy, Award, Zap, Layers2, EyeOff, Ghost,
};

const TIER_ORDER = ['OR', 'ARGENT', 'BRONZE'];

const TROPHY_THRESHOLDS = {
  premier_sang: 171, piegeur: 26, premier_boss: 20, chasseur_20: 82,
  premiere_aile: 1, alchimiste: 14, serie_7: 7, score_50: 248, score_100: 254,
  revenant: 18, elite_abattu: 11, double_vaincu: 8, invisible_vaincu: 4,
  influence_brisee: 1, shaman_vaincu: 1,
  massacreur: 112, briseur_boss: 29, piegeur_expert: 37, score_200: 353,
  score_300: 356, chasseur_morts: 26, elite_10: 17, double_10: 13,
  conquerant: 8, legende: 467, massacreur_120: 140, boss_final_vaincu: 1,
  trois_necros: 3, boss_influences_3: 4, invisible_5: 9,
};

function getTrophyCurrentValue(trophyId, score, metrics) {
  if (!score || !metrics) return 0;
  const map = {
    premier_sang:      metrics.totalDaysCompleted,
    piegeur:           score.trapsDefeated,
    premier_boss:      score.bossesDefeated,
    chasseur_20:       score.monstersDefeated,
    premiere_aile:     score.completeWings,
    alchimiste:        score.manaPotionsEarned,
    serie_7:           metrics.longestStreak,
    score_50:          score.totalScore,
    score_100:         score.totalScore,
    revenant:          score.undeadDefeated,
    elite_abattu:      score.eliteDefeated,
    double_vaincu:     score.doublesDefeated,
    invisible_vaincu:  score.invisiblesDefeated,
    influence_brisee:  score.influencedBossesDefeated,
    shaman_vaincu:     score.shamansDefeated,
    massacreur:        score.monstersDefeated,
    briseur_boss:      score.bossesDefeated,
    piegeur_expert:    score.trapsDefeated,
    score_200:         score.totalScore,
    score_300:         score.totalScore,
    chasseur_morts:    score.undeadDefeated,
    invisible_5:       score.invisiblesDefeated,
    elite_10:          score.eliteDefeated,
    double_10:         score.doublesDefeated,
    conquerant:        score.completeWings,
    legende:           score.totalScore,
    massacreur_120:    score.monstersDefeated,
    boss_final_vaincu: score.finalBossDefeated,
    trois_necros:      score.necromancersDefeated,
    boss_influences_3: score.influencedBossesDefeated,
  };
  return map[trophyId] ?? 0;
}

function computeMetrics(yearData) {
  const allDays = yearData
    .flatMap(m => m.weeks.flatMap(w => w.days))
    .sort((a, b) => a.globalIndex - b.globalIndex);
  let totalDaysCompleted = 0, longestStreak = 0, currentStreak = 0;
  for (const day of allDays) {
    if (day.completed) {
      totalDaysCompleted++;
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }
  return { totalDaysCompleted, longestStreak };
}

function buildMonthlyScores(yearData) {
  if (!yearData) return [];
  return yearData.map((monthData) => {
    const s = calculateScore([monthData]);
    return { score: s.totalScore, wings: s.completeWings };
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

export function ProfilePage({ trophies, levelInfo, score, yearData, maxMonth = 11, showUndead, showMana, showElite, showDouble, showInvisible, showNecromancer, showInfluenced, showShaman, showFinalBoss, pseudo }) {
  const unlockedCount = Object.keys(trophies || {}).length;
  const totalCount = TROPHY_DEFINITIONS.length;

  const completion = yearData ? (() => {
    const days = yearData.slice(0, maxMonth + 1).flatMap(m => m.weeks.flatMap(w => w.days));
    const total = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const done = days.filter(d => d.completed).length;
    return { done, total, rate: total > 0 ? Math.round(done / total * 100) : 0 };
  })() : { done: 0, total: 0, rate: 0 };
  const completionRate = completion.rate;

  const handleShare = () => downloadProgressImage({
    score,
    pseudo: pseudo || 'Aventurier',
    levelInfo,
    completionRate,
    unlockedCount,
    totalCount,
    showUndead,
    showMana,
    showElite,
    showDouble,
    showInvisible,
    showNecromancer,
    showInfluenced,
    showShaman,
    showFinalBoss,
  });

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
    const bestWingsMonthIdx = data.reduce((bestIdx, m, i) => m.wings > data[bestIdx].wings ? i : bestIdx, 0);
    const bestWingsMonth = data[bestWingsMonthIdx]?.wings > 0
      ? { wings: data[bestWingsMonthIdx].wings, name: yearData[bestWingsMonthIdx].name }
      : null;
    return { longestStreak, bestMonth, mostCommonMonster, bestBossValue, worstMonth, bestWingsMonth };
  })() : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <User className="text-dungeon-gold" size={32} />
          <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Profil</h2>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medieval font-semibold text-sm bg-gradient-to-r from-dungeon-gold/20 to-amber-700/20 border border-dungeon-gold/50 text-dungeon-gold hover:from-dungeon-gold/30 hover:to-amber-700/30 hover:border-dungeon-gold transition-colors"
        >
          <Share2 size={16} />
          Partager
        </button>
      </div>

      {/* Bannière niveau */}
      <LevelBanner levelInfo={levelInfo} unlockedCount={unlockedCount} totalCount={totalCount} />

      {/* Barre de complétion */}
      {yearData && (
        <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-dungeon-gold/30 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medieval font-semibold text-sm uppercase tracking-wide text-gray-400">Complétion</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-400 leading-none">{completion.rate}%</span>
              <span className="text-xs text-gray-500">{completion.done} / {completion.total} cases</span>
            </div>
          </div>
          <div className="w-full h-3 bg-dungeon-dark/80 rounded-full overflow-hidden border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-700"
              style={{ width: `${completion.rate}%` }}
            />
          </div>
        </div>
      )}

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
              {exploits.bestWingsMonth && (
                <div className="flex items-center gap-3">
                  <Swords size={28} className="text-green-400 shrink-0" />
                  <div>
                    <div className="text-3xl font-bold text-green-400 leading-none">{exploits.bestWingsMonth.wings}</div>
                    <div className="text-xs text-gray-400 mt-1">ailes en un mois — {exploits.bestWingsMonth.name}</div>
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

export function TrophiesListPage({ trophies, maxMonth = 11, score, yearData }) {
  const metrics = yearData ? computeMetrics(yearData) : null;

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
        const visibleDefs = defs.filter(d => maxMonth >= (d.minMonth ?? 0));
        const unlockedInTier = visibleDefs.filter(d => trophies?.[d.id]).length;
        const secretCount = defs.length - visibleDefs.length;
        return (
          <div key={tierKey} className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-dungeon-gold/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-dungeon-gold/20 flex items-center justify-between">
              <h3 className="font-medieval font-semibold text-sm uppercase tracking-wide" style={{ color: tierInfo.color }}>
                Trophées {tierInfo.label}
              </h3>
              <span className="text-xs text-gray-500">{unlockedInTier}/{defs.length}</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {visibleDefs.map(def => {
                const total = TROPHY_THRESHOLDS[def.id];
                const current = getTrophyCurrentValue(def.id, score, metrics);
                return (
                  <TrophyCard
                    key={def.id}
                    definition={def}
                    unlockedDate={trophies?.[def.id]}
                    devProb={import.meta.env.DEV ? getTrophyProb(def.id) : null}
                    progress={total !== undefined ? { current, total } : null}
                  />
                );
              })}
              {secretCount > 0 && Array.from({ length: secretCount }, (_, i) => (
                <SecretTrophyCard key={`secret-${tierKey}-${i}`} tier={tierInfo} />
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

function TrophyCard({ definition, unlockedDate, devProb, progress }) {
  const isUnlocked = !!unlockedDate;
  const tier = TROPHY_TIERS[definition.tier];
  const Icon = ICON_MAP[definition.icon] || Trophy;

  const probColor = typeof devProb === 'number'
    ? (devProb >= 70 ? '#22c55e' : devProb >= 30 ? '#f59e0b' : '#ef4444')
    : '#6b7280';

  return (
    <div className={`rounded-lg border p-3 text-center transition-all ${
      isUnlocked ? `${tier.border} bg-dungeon-dark/50` : 'border-gray-700/50 bg-dungeon-dark/30 opacity-40 grayscale'
    }`}>
      <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${
        isUnlocked ? tier.bg : 'from-gray-700 to-gray-600'
      } flex items-center justify-center mb-2`}>
        {isUnlocked ? <Icon size={24} className="text-dungeon-dark" /> : <Lock size={20} className="text-gray-400" />}
      </div>
      <div className="font-medieval font-bold text-s leading-tight" style={{ color: isUnlocked ? tier.color : '#6b7280' }}>
        {definition.name}
      </div>
      <div className="text-[13px] text-gray-400 mt-1 leading-tight">{definition.description}</div>
      {isUnlocked && (
        <div className="mt-1.5 space-y-0.5">
          <div className="text-[11px] text-gray-400">{new Date(unlockedDate).toLocaleDateString('fr-FR')}</div>
          <div className="text-[11px] font-bold" style={{ color: tier.color }}>+{tier.xp} XP</div>
        </div>
      )}
      {!isUnlocked && progress && (
        <div className="mt-2">
          <div className="w-full h-1 bg-dungeon-dark/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
                backgroundColor: tier.color,
              }}
            />
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 text-right">
            {progress.current}<span className="opacity-50">/{progress.total}</span>
          </div>
        </div>
      )}
      {import.meta.env.DEV && devProb !== null && (
        <div className="mt-1 text-[13px] font-semibold" style={{ color: probColor }}>
          {devProb}% <span className="opacity-60 font-normal">p={TIER_RATE[definition.tier] * 100}%</span>
        </div>
      )}
    </div>
  );
}

function SecretTrophyCard({ tier }) {
  return (
    <div className="rounded-lg border border-gray-700/30 bg-dungeon-dark/20 p-3 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mb-2">
        <span className="text-xl font-bold text-gray-600">?</span>
      </div>
      <div className="font-medieval font-bold text-xs leading-tight text-gray-600">???</div>
      <div className="text-[13px] text-gray-700 mt-1 leading-tight">Règle à venir</div>
      <div className="mt-1.5">
        <div className="text-[10px] font-bold text-gray-700">+{tier.xp} XP</div>
      </div>
    </div>
  );
}
