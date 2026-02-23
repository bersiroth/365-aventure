import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Area, AreaChart,
} from 'recharts';
import { Trophy, Skull, AlertTriangle, Crown, Swords, BarChart2, Flame, Zap, Layers2, EyeOff, Axe, FlaskConical, Ghost, Star } from 'lucide-react';

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
  influenced:  '#f97316',
  shaman:      '#a855f7',
  finalBoss:   '#e11d48',
};

const UNDEAD_RULE_START      = 2; // Mars (index 2)
const MANA_RULE_START        = 1; // Février (index 1)
const ELITE_RULE_START       = 4; // Mai (index 4)
const DOUBLE_RULE_START      = 6; // Juillet (index 6)
const INVISIBLE_RULE_START   = 8; // Septembre (index 8)
const NECROMANCER_RULE_START = 8; // Septembre (index 8)
const INFLUENCED_RULE_START  = 9; // Octobre (index 9)
const SHAMAN_RULE_START      = 10; // Novembre (index 10)
const FINAL_BOSS_RULE_START  = 11; // Décembre (index 11)


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
      influenced: s.influencedBossesDefeated ?? 0,
      shaman: s.shamansDefeated ?? 0,
      finalBoss: s.finalBossDefeated ?? 0,
    };
  });
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
  const hasInfluenced  = maxMonth >= INFLUENCED_RULE_START;
  const hasShaman      = maxMonth >= SHAMAN_RULE_START;
  const hasFinalBoss   = maxMonth >= FINAL_BOSS_RULE_START;

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

  // Boss influencés vaincus (depuis octobre)
  const influencedData = data.slice(INFLUENCED_RULE_START);
  const influencedDefeatedTotal = influencedData.reduce((s, m) => s + m.influenced, 0);

  // Shamans vaincus (depuis novembre)
  const shamanData = data.slice(SHAMAN_RULE_START);
  const shamanDefeatedTotal = shamanData.reduce((s, m) => s + m.shaman, 0);

  // Boss Final vaincu (décembre uniquement)
  const finalBossDefeatedTotal = data[FINAL_BOSS_RULE_START]?.finalBoss ?? 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart2 className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Statistiques</h2>
      </div>

      {/* Moyennes par mois */}
      <Section title="Moyenne mensuelle">
        {(() => {
          return (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-7">
          {[
            { icon: <Trophy size={22} className="text-dungeon-gold" />,       label: 'Score',       value: avg('score'),    color: 'text-dungeon-gold' },
            { icon: <Axe size={22} className="text-sky-600" />,            label: 'Monstres',    value: avg('monsters'), color: 'text-sky-400' },
            ...(hasUndead ? [{ icon: <CrossedBonesIcon size={22} className="text-yellow-400" />, label: 'Morts', value: avgUndead, color: 'text-yellow-300' }] : []),
            ...(hasElite  ? [{ icon: <Zap size={22} className="text-red-400" />,      label: 'Élites',  value: avgElite,  color: 'text-red-400'    }] : []),
            ...(hasDouble ? [{ icon: <Layers2 size={22} className="text-indigo-400" />, label: 'Doubles', value: avgDouble, color: 'text-indigo-400'  }] : []),
            ...(hasInvisible ? [{ icon: <EyeOff size={22} className="text-gray-400" />, label: 'Invisibles', value: avgInvisible, color: 'text-gray-300' }] : []),
            ...(hasNecromancer ? [{ icon: <Skull size={22} className="text-green-600" />, label: 'Nécro', value: necromancerDefeatedTotal, color: 'text-green-500' }] : []),
            ...(hasInfluenced ? [{ icon: <Flame size={22} className="text-orange-400" />, label: 'Influencés', value: influencedDefeatedTotal, color: 'text-orange-400' }] : []),
            ...(hasShaman ? [{ icon: <Ghost size={22} className="text-purple-400" />, label: 'Shamans', value: shamanDefeatedTotal, color: 'text-purple-400' }] : []),
            { icon: <AlertTriangle size={22} className="text-violet-400" />,   label: 'Pièges',      value: avg('traps'),    color: 'text-violet-400' },
            { icon: <Crown size={22} className="text-orange-400" />,          label: 'Boss',        value: avg('bosses'),   color: 'text-orange-400' },
            { icon: <Swords size={22} className="text-green-400" />,          label: 'Ailes',       value: avg('wings'),    color: 'text-green-400' },
            ...(hasMana ? [{ icon: <FlaskConical size={22} className="text-blue-400" />, label: 'Potions', value: avgMana, color: 'text-blue-400' }] : []),
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="bg-dungeon-stone border border-dungeon-gold/30 rounded-lg p-3 flex items-center sm:gap-3 gap-2">
              <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] flex items-center justify-center shrink-0">{icon}</div>
              <div className={`sm:leading-none leading-none sm:text-2xl text-xl w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] font-bold  ${color}`}>{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
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
            <Tooltip
              contentStyle={{ ...tooltipStyle, fontSize: 10, padding: '4px 8px' }}
              wrapperStyle={{ maxWidth: '55%', zIndex: 100 }}
              itemStyle={{ padding: '1px 0' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            <Bar dataKey="monsters" name="Monstres"      fill={COLORS.monsters} radius={[2, 2, 0, 0]} stackId="a" />
            {hasUndead && <Bar dataKey="undead" name="Morts-Vivants" fill={COLORS.undead} radius={[0, 0, 0, 0]} stackId="a" />}
            {hasElite  && <Bar dataKey="elite"   name="Élites"         fill={COLORS.elite}   radius={[0, 0, 0, 0]} stackId="a" />}
            {hasDouble && <Bar dataKey="doubles" name="Monstres Doubles" fill={COLORS.doubles} radius={[0, 0, 0, 0]} stackId="a" />}
            {hasInvisible   && <Bar dataKey="invisibles" name="Invisibles"      fill={COLORS.invisibles}  radius={[0, 0, 0, 0]} stackId="a" />}
            {hasNecromancer && <Bar dataKey="necromancer" name="Nécromancien"   fill={COLORS.necromancer} radius={[0, 0, 0, 0]} stackId="a" />}
            {hasInfluenced  && <Bar dataKey="influenced"  name="Boss influencés" fill={COLORS.influenced}  radius={[0, 0, 0, 0]} stackId="a" />}
            {hasShaman      && <Bar dataKey="shaman"      name="Shamans"         fill={COLORS.shaman}      radius={[0, 0, 0, 0]} stackId="a" />}
            {hasFinalBoss   && <Bar dataKey="finalBoss"   name="Boss Final"      fill={COLORS.finalBoss}   radius={[0, 0, 0, 0]} stackId="a" />}
            <Bar dataKey="traps"    name="Pièges"         fill={COLORS.traps}    radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="bosses"   name="Boss"           fill={COLORS.bosses}   radius={[2, 2, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Tableau récapitulatif */}
      <Section title="Récapitulatif mensuel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-x-1 sm:border-spacing-x-0">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 font-medium text-xs uppercase text-gray-500">Mois</th>
                <th className="py-1 text-right px-1"><span className="hidden sm:inline text-dungeon-gold font-medium text-xs">Score</span><Trophy size={13} className="text-dungeon-gold sm:hidden inline" /></th>
                <th className="py-1 text-right px-1"><span className="hidden sm:inline text-sky-400 font-medium text-xs">Monstres</span><Axe size={13} className="text-sky-600 sm:hidden inline" /></th>
                {hasUndead && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-yellow-300 font-medium text-xs">Morts</span><CrossedBonesIcon size={13} className="text-yellow-400 sm:hidden inline" /></th>}
                {hasElite  && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-red-400 font-medium text-xs">Élites</span><Zap size={13} className="text-red-400 sm:hidden inline" /></th>}
                {hasDouble && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-indigo-400 font-medium text-xs">Doubles</span><Layers2 size={13} className="text-indigo-400 sm:hidden inline" /></th>}
                {hasInvisible && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-gray-300 font-medium text-xs">Invisibles</span><EyeOff size={13} className="text-gray-400 sm:hidden inline" /></th>}
                {hasNecromancer && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-green-500 font-medium text-xs">Nécro</span><Skull size={13} className="text-green-600 sm:hidden inline" /></th>}
                {hasInfluenced && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-orange-400 font-medium text-xs">Influencés</span><Flame size={13} className="text-orange-400 sm:hidden inline" /></th>}
                {hasShaman && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-purple-400 font-medium text-xs">Shamans</span><Ghost size={13} className="text-purple-400 sm:hidden inline" /></th>}
                {hasFinalBoss && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-rose-400 font-medium text-xs">Boss Final</span><Star size={13} className="text-rose-400 sm:hidden inline" /></th>}
                <th className="py-1 text-right px-1"><span className="hidden sm:inline text-violet-400 font-medium text-xs">Pièges</span><AlertTriangle size={13} className="text-violet-400 sm:hidden inline" /></th>
                <th className="py-1 text-right px-1"><span className="hidden sm:inline text-orange-400 font-medium text-xs">Boss</span><Crown size={13} className="text-orange-400 sm:hidden inline" /></th>
                <th className="py-1 text-right px-1"><span className="hidden sm:inline text-green-400 font-medium text-xs">Ailes</span><Swords size={13} className="text-green-400 sm:hidden inline" /></th>
                {hasMana && <th className="py-1 text-right px-1"><span className="hidden sm:inline text-blue-400 font-medium text-xs">Potions</span><FlaskConical size={13} className="text-blue-400 sm:hidden inline" /></th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-dungeon-dark/30' : ''}`}>
                  <td className="py-2 font-medieval text-gray-300">{yearData[i].name}</td>
                  <td className="py-2 text-right px-1 font-bold text-dungeon-gold">{row.score}</td>
                  <td className="py-2 text-right px-1 text-sky-400">{row.monsters}</td>
                  {hasUndead && <td className="py-2 text-right px-1 text-yellow-300">{row.undead}</td>}
                  {hasElite  && <td className="py-2 text-right px-1 text-red-400">{row.elite}</td>}
                  {hasDouble && <td className="py-2 text-right px-1 text-indigo-400">{row.doubles}</td>}
                  {hasInvisible && <td className="py-2 text-right px-1 text-gray-300">{row.invisibles}</td>}
                  {hasNecromancer && <td className="py-2 text-right px-1 text-green-500">{row.necromancer}</td>}
                  {hasInfluenced && <td className="py-2 text-right px-1 text-orange-400">{row.influenced}</td>}
                  {hasShaman && <td className="py-2 text-right px-1 text-purple-400">{row.shaman}</td>}
                  {hasFinalBoss && <td className="py-2 text-right px-1 text-rose-400">{row.finalBoss}</td>}
                  <td className="py-2 text-right px-1 text-violet-400">{row.traps}</td>
                  <td className="py-2 text-right px-1 text-orange-400">{row.bosses}</td>
                  <td className="py-2 text-right px-1 text-green-400">{row.wings}</td>
                  {hasMana && <td className="py-2 text-right px-1 text-blue-400">{row.mana}</td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dungeon-gold/30 font-bold">
                <td className="py-2 font-medieval text-dungeon-gold">Total</td>
                <td className="py-2 text-right px-1 text-dungeon-gold">{data.reduce((s, m) => s + m.score, 0)}</td>
                <td className="py-2 text-right px-1 text-sky-400">{data.reduce((s, m) => s + m.monsters, 0)}</td>
                {hasUndead && <td className="py-2 text-right px-1 text-yellow-300">{data.reduce((s, m) => s + m.undead, 0)}</td>}
                {hasElite  && <td className="py-2 text-right px-1 text-red-400">{data.reduce((s, m) => s + m.elite, 0)}</td>}
                {hasDouble && <td className="py-2 text-right px-1 text-indigo-400">{data.reduce((s, m) => s + m.doubles, 0)}</td>}
                {hasInvisible && <td className="py-2 text-right px-1 text-gray-300">{data.reduce((s, m) => s + m.invisibles, 0)}</td>}
                {hasNecromancer && <td className="py-2 text-right px-1 text-green-500">{necromancerDefeatedTotal}</td>}
                {hasInfluenced && <td className="py-2 text-right px-1 text-orange-400">{influencedDefeatedTotal}</td>}
                {hasShaman && <td className="py-2 text-right px-1 text-purple-400">{shamanDefeatedTotal}</td>}
                {hasFinalBoss && <td className="py-2 text-right px-1 text-rose-400">{finalBossDefeatedTotal}</td>}
                <td className="py-2 text-right px-1 text-violet-400">{data.reduce((s, m) => s + m.traps, 0)}</td>
                <td className="py-2 text-right px-1 text-orange-400">{data.reduce((s, m) => s + m.bosses, 0)}</td>
                <td className="py-2 text-right px-1 text-green-400">{data.reduce((s, m) => s + m.wings, 0)}</td>
                {hasMana && <td className="py-2 text-right px-1 text-blue-400">{data.reduce((s, m) => s + m.mana, 0)}</td>}
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
