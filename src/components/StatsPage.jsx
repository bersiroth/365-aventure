import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Area, AreaChart,
} from 'recharts';
import { Trophy, Skull, AlertTriangle, Crown, Swords, BarChart2, Flame, TrendingDown, Zap, Layers2, EyeOff, Axe, FlaskConical } from 'lucide-react';

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
import { calculateScore } from '../data/gameData';

const GOLD = '#d4af37';
const COLORS = {
  score:       '#d4af37',
  monsters:    '#0284c7',
  undead:      '#facc15',
  elite:       '#ef4444',
  doubles:     '#818cf8',
  traps:       '#a78bfa',
  bosses:      '#fb923c',
  wings:       '#4ade80',
  invisibles:  '#9ca3af',
  necromancer: '#16a34a',
};

const UNDEAD_RULE_START      = 2; // Mars (index 2)
const MANA_RULE_START        = 1; // Février (index 1)
const ELITE_RULE_START       = 4; // Mai (index 4)
const DOUBLE_RULE_START      = 6; // Juillet (index 6)
const INVISIBLE_RULE_START   = 8; // Septembre (index 8)
const NECROMANCER_RULE_START = 8; // Septembre (index 8)


function buildMonthlyData(yearData) {
  if (!yearData) return [];

  let cumScore = 0;
  return yearData.map((monthData) => {
    const s = calculateScore([monthData]);
    cumScore += s.totalScore;
    return {
      month: monthData.name.substring(0, 3),
      score: s.totalScore,
      cumScore,
      monsters: s.monstersDefeated,
      undead: s.undeadDefeated,
      elite: s.eliteDefeated,
      doubles: s.doublesDefeated,
      traps: s.trapsDefeated,
      bosses: s.bossesDefeated,
      wings: s.completeWings,
      mana: s.manaPotionsEarned,
      invisibles: s.invisiblesDefeated,
      necromancer: s.necromancersDefeated ?? 0,
    };
  });
}

function calcLongestStreak(yearData) {
  let maxStreak = 0;
  let currentStreak = 0;

  const allDays = yearData
    .flatMap(month => month.weeks.flatMap(week => week.days))
    .sort((a, b) => a.globalIndex - b.globalIndex);

  for (const day of allDays) {
    if (day.completed) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

const tooltipStyle = {
  backgroundColor: '#2d2318',
  border: '1px solid #d4af3750',
  borderRadius: '8px',
  color: '#fff',
  fontSize: 12,
};

export function StatsPage({ yearData, maxMonth = 11 }) {
  if (!yearData) return null;

  const data = buildMonthlyData(yearData);

  // Détecter si les règles spéciales sont actives (basé sur le mois courant)
  const hasUndead      = maxMonth >= UNDEAD_RULE_START;
  const hasMana        = maxMonth >= MANA_RULE_START;
  const hasElite       = maxMonth >= ELITE_RULE_START;
  const hasDouble      = maxMonth >= DOUBLE_RULE_START;
  const hasInvisible   = maxMonth >= INVISIBLE_RULE_START;
  const hasNecromancer = maxMonth >= NECROMANCER_RULE_START;

  // Moyenne sur les mois joués (au moins 1 point)
  const playedMonths = data.filter(m => m.score > 0);
  const divisor = playedMonths.length || 1;
  const avg = (key) => Math.floor(data.reduce((s, m) => s + m[key], 0) / divisor);

  // Moyenne morts-vivants : depuis mars (index 2)
  const undeadData = data.slice(UNDEAD_RULE_START);
  const undeadDivisor = undeadData.filter(m => m.score > 0).length || 1;
  const avgUndead = Math.floor(undeadData.reduce((s, m) => s + m.undead, 0) / undeadDivisor);

  // Moyenne potions : depuis février (index 1)
  const manaData = data.slice(MANA_RULE_START);
  const manaDivisor = manaData.filter(m => m.score > 0).length || 1;
  const avgMana = Math.floor(manaData.reduce((s, m) => s + m.mana, 0) / manaDivisor);

  // Moyenne élites : depuis mai (index 4)
  const eliteData = data.slice(ELITE_RULE_START);
  const eliteDivisor = eliteData.filter(m => m.score > 0).length || 1;
  const avgElite = Math.floor(eliteData.reduce((s, m) => s + m.elite, 0) / eliteDivisor);

  // Moyenne doubles : depuis juillet (index 6)
  const doubleData = data.slice(DOUBLE_RULE_START);
  const doubleDivisor = doubleData.filter(m => m.score > 0).length || 1;
  const avgDouble = Math.floor(doubleData.reduce((s, m) => s + m.doubles, 0) / doubleDivisor);

  // Moyenne invisibles : depuis septembre (index 8)
  const invisibleData = data.slice(INVISIBLE_RULE_START);
  const invisibleDivisor = invisibleData.filter(m => m.score > 0).length || 1;
  const avgInvisible = Math.floor(invisibleData.reduce((s, m) => s + m.invisibles, 0) / invisibleDivisor);

  // Nécromancien vaincu (depuis septembre, max 1)
  const necromancerData = data.slice(NECROMANCER_RULE_START);
  const necromancerDefeatedTotal = necromancerData.reduce((s, m) => s + m.necromancer, 0);

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
      .filter(Boolean)
      .filter(m => m.index !== bestMonthIdx);
    return pastMonths.length > 0 ? pastMonths.reduce((w, m) => m.score < w.score ? m : w) : null;
  })();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart2 className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Statistiques</h2>
      </div>

      {/* Exploits */}
      <Section title="Exploits">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Flame size={28} className="text-orange-500 shrink-0" />
            <div>
              <div className="text-3xl font-bold text-orange-500 leading-none">{longestStreak}</div>
              <div className="text-xs text-gray-400 mt-1">cases consécutives validées</div>
            </div>
          </div>
          {bestMonth && (
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-dungeon-gold shrink-0" />
              <div>
                <div className="text-3xl font-bold text-dungeon-gold leading-none">{bestMonth.name}</div>
                <div className="text-xs text-gray-400 mt-1">meilleur mois — {bestMonth.score} pts</div>
              </div>
            </div>
          )}
          {mostCommonMonster && (
            <div className="flex items-center gap-3">
              <Skull size={28} className="text-gray-400 shrink-0" />
              <div>
                <div className="text-3xl font-bold text-gray-300 leading-none">{mostCommonMonster.value}</div>
                <div className="text-xs text-gray-400 mt-1">valeur de monstre la plus vaincue ({mostCommonMonster.count}x)</div>
              </div>
            </div>
          )}
          {bestBossValue > 0 && (
            <div className="flex items-center gap-3">
              <Crown size={28} className="text-orange-400 shrink-0" />
              <div>
                <div className="text-3xl font-bold text-orange-400 leading-none">{bestBossValue}</div>
                <div className="text-xs text-gray-400 mt-1">meilleur valeur de boss vaincu</div>
              </div>
            </div>
          )}
          {worstMonth && (
            <div className="flex items-center gap-3">
              <TrendingDown size={28} className="text-red-400 shrink-0" />
              <div>
                <div className="text-3xl font-bold text-red-400 leading-none">{worstMonth.name}</div>
                <div className="text-xs text-gray-400 mt-1">pire mois passé — {worstMonth.score} pts</div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Moyennes par mois */}
      <Section title="Moyenne mensuelle">
        {(() => {
          const optCount = (hasUndead ? 1 : 0) + (hasElite ? 1 : 0) + (hasDouble ? 1 : 0) + (hasMana ? 1 : 0) + (hasInvisible ? 1 : 0) + (hasNecromancer ? 1 : 0);
          const gridClass = optCount === 0 ? 'sm:grid-cols-5'
            : optCount === 1 ? 'sm:grid-cols-3'
            : optCount >= 6 ? 'sm:grid-cols-6'
            : optCount >= 4 ? 'sm:grid-cols-5'
            : 'sm:grid-cols-4';
          return (
        <div className={`grid gap-3 grid-cols-2 ${gridClass}`}>
          {[
            { icon: <Trophy size={22} className="text-dungeon-gold" />,       label: 'Score/mois',       value: avg('score'),    color: 'text-dungeon-gold' },
            { icon: <Axe size={22} className="text-sky-600" />,            label: 'Monstres/mois',    value: avg('monsters'), color: 'text-sky-400' },
            ...(hasUndead ? [{ icon: <CrossedBonesIcon size={22} className="text-yellow-400" />, label: 'Morts/mois', value: avgUndead, color: 'text-yellow-300' }] : []),
            ...(hasElite  ? [{ icon: <Zap size={22} className="text-red-400" />,      label: 'Élites/mois',  value: avgElite,  color: 'text-red-400'    }] : []),
            ...(hasDouble ? [{ icon: <Layers2 size={22} className="text-indigo-400" />, label: 'Doubles/mois', value: avgDouble, color: 'text-indigo-400'  }] : []),
            ...(hasInvisible ? [{ icon: <EyeOff size={22} className="text-gray-400" />, label: 'Invisibles/mois', value: avgInvisible, color: 'text-gray-300' }] : []),
            ...(hasNecromancer ? [{ icon: <Skull size={22} className="text-green-600" />, label: 'Nécromancien', value: necromancerDefeatedTotal, color: 'text-green-500' }] : []),
            { icon: <AlertTriangle size={22} className="text-violet-400" />,   label: 'Pièges/mois',      value: avg('traps'),    color: 'text-violet-400' },
            { icon: <Crown size={22} className="text-orange-400" />,          label: 'Boss/mois',        value: avg('bosses'),   color: 'text-orange-400' },
            { icon: <Swords size={22} className="text-green-400" />,          label: 'Ailes/mois',       value: avg('wings'),    color: 'text-green-400' },
            ...(hasMana ? [{ icon: <FlaskConical size={22} className="text-blue-400" />, label: 'Potions/mois', value: avgMana, color: 'text-blue-400' }] : []),
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="bg-dungeon-stone border border-dungeon-gold/30 rounded-lg p-3 flex items-center gap-3">
              {icon}
              <div>
                <div className={`text-2xl font-bold leading-none ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
          );
        })()}
      </Section>

      {/* Score cumulé */}
      <Section title="Évolution du score cumulé">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={GOLD} stopOpacity={0.4} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="cumScore" name="Score cumulé" stroke={GOLD} fill="url(#gradScore)" strokeWidth={2} dot={{ fill: GOLD, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* Score par mois */}
      <Section title="Score par mois">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" name="Score" fill={GOLD} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Combats par mois */}
      <Section title="Combats par mois">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
            <Bar dataKey="monsters" name="Monstres"      fill={COLORS.monsters} radius={[2, 2, 0, 0]} stackId="a" />
            {hasUndead && <Bar dataKey="undead" name="Morts-Vivants" fill={COLORS.undead} radius={[0, 0, 0, 0]} stackId="a" />}
            {hasElite  && <Bar dataKey="elite"   name="Élites"         fill={COLORS.elite}   radius={[0, 0, 0, 0]} stackId="a" />}
            {hasDouble && <Bar dataKey="doubles" name="Monstres Doubles" fill={COLORS.doubles} radius={[0, 0, 0, 0]} stackId="a" />}
            {hasInvisible && <Bar dataKey="invisibles" name="Invisibles" fill={COLORS.invisibles} radius={[0, 0, 0, 0]} stackId="a" />}
            <Bar dataKey="traps"    name="Pièges"         fill={COLORS.traps}    radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="bosses"   name="Boss"          fill={COLORS.bosses}   radius={[2, 2, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Ailes complètes */}
      <Section title="Ailes conquises par mois">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="wings" name="Ailes" fill={COLORS.wings} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Tableau récapitulatif */}
      <Section title="Récapitulatif mensuel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
                <th className="text-left py-2 font-medium">Mois</th>
                <th className="text-right py-2 font-medium text-dungeon-gold">Score</th>
                <th className="text-right py-2 font-medium text-sky-600">Monstres</th>
                {hasUndead && <th className="text-right py-2 font-medium text-yellow-400">Morts</th>}
                {hasElite  && <th className="text-right py-2 font-medium text-red-400">Élites</th>}
                {hasDouble && <th className="text-right py-2 font-medium text-indigo-400">Doubles</th>}
                {hasInvisible && <th className="text-right py-2 font-medium text-gray-400">Invisibles</th>}
                {hasNecromancer && <th className="text-right py-2 font-medium text-green-600">Nécro.</th>}
                <th className="text-right py-2 font-medium text-violet-400">Pièges</th>
                <th className="text-right py-2 font-medium text-orange-400">Boss</th>
                <th className="text-right py-2 font-medium text-green-400">Ailes</th>
                {hasMana && <th className="text-right py-2 font-medium text-blue-400">Potions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.month} className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-dungeon-dark/30' : ''}`}>
                  <td className="py-2 font-medieval text-gray-300">{yearData[i].name}</td>
                  <td className="py-2 text-right font-bold text-dungeon-gold">{row.score}</td>
                  <td className="py-2 text-right text-sky-400">{row.monsters}</td>
                  {hasUndead && <td className="py-2 text-right text-yellow-300">{row.undead}</td>}
                  {hasElite  && <td className="py-2 text-right text-red-400">{row.elite}</td>}
                  {hasDouble && <td className="py-2 text-right text-indigo-400">{row.doubles}</td>}
                  {hasInvisible && <td className="py-2 text-right text-gray-300">{row.invisibles}</td>}
                  {hasNecromancer && <td className="py-2 text-right text-green-500">{row.necromancer}</td>}
                  <td className="py-2 text-right text-violet-400">{row.traps}</td>
                  <td className="py-2 text-right text-orange-400">{row.bosses}</td>
                  <td className="py-2 text-right text-green-400">{row.wings}</td>
                  {hasMana && <td className="py-2 text-right text-blue-400">{row.mana}</td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dungeon-gold/30 font-bold">
                <td className="py-2 font-medieval text-dungeon-gold">Total</td>
                <td className="py-2 text-right text-dungeon-gold">{data.reduce((s, m) => s + m.score, 0)}</td>
                <td className="py-2 text-right text-sky-400">{data.reduce((s, m) => s + m.monsters, 0)}</td>
                {hasUndead && <td className="py-2 text-right text-yellow-300">{data.reduce((s, m) => s + m.undead, 0)}</td>}
                {hasElite  && <td className="py-2 text-right text-red-400">{data.reduce((s, m) => s + m.elite, 0)}</td>}
                {hasDouble && <td className="py-2 text-right text-indigo-400">{data.reduce((s, m) => s + m.doubles, 0)}</td>}
                {hasInvisible && <td className="py-2 text-right text-gray-300">{data.reduce((s, m) => s + m.invisibles, 0)}</td>}
                {hasNecromancer && <td className="py-2 text-right text-green-500">{necromancerDefeatedTotal}</td>}
                <td className="py-2 text-right text-violet-400">{data.reduce((s, m) => s + m.traps, 0)}</td>
                <td className="py-2 text-right text-orange-400">{data.reduce((s, m) => s + m.bosses, 0)}</td>
                <td className="py-2 text-right text-green-400">{data.reduce((s, m) => s + m.wings, 0)}</td>
                {hasMana && <td className="py-2 text-right text-blue-400">{data.reduce((s, m) => s + m.mana, 0)}</td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border border-dungeon-gold/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-dungeon-gold/20">
        <h3 className="font-medieval font-semibold text-dungeon-gold text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
