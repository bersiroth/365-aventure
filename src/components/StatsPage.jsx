import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Area, AreaChart,
} from 'recharts';
import { Trophy, Skull, AlertTriangle, Crown, Swords, BarChart2 } from 'lucide-react';
import { calculateScore } from '../data/gameData';

const GOLD = '#d4af37';
const COLORS = {
  score:    '#d4af37',
  monsters: '#9ca3af',
  undead:   '#facc15',
  traps:    '#f87171',
  bosses:   '#fb923c',
  wings:    '#4ade80',
};

const UNDEAD_RULE_START = 2; // Mars (index 2)
const MANA_RULE_START   = 1; // Février (index 1)

function ManaPotionIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 20 26" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0.5" width="6" height="3.5" rx="1.2" fill="#7f1d1d"/>
      <rect x="6.5" y="3.5" width="7" height="1.5" rx="0.5" fill="#991b1b"/>
      <rect x="7.5" y="5" width="5" height="5" rx="0.8" fill="#bfdbfe"/>
      <circle cx="10" cy="18" r="7.5" fill="#1e40af" opacity="0.5"/>
      <circle cx="10" cy="18" r="7" fill="#1d4ed8"/>
      <circle cx="10" cy="18" r="5.5" fill="#3b82f6"/>
      <ellipse cx="8.5" cy="15.5" rx="2.8" ry="2" fill="#bfdbfe" opacity="0.6"/>
      <circle cx="12" cy="19" r="1.2" fill="#93c5fd" opacity="0.4"/>
    </svg>
  );
}

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
      traps: s.trapsDefeated,
      bosses: s.bossesDefeated,
      wings: s.completeWings,
      mana: s.manaPotionsEarned,
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

export function StatsPage({ yearData }) {
  if (!yearData) return null;

  const data = buildMonthlyData(yearData);

  // Détecter si les règles spéciales sont actives dans ce yearData
  const hasUndead = yearData.some(m =>
    m.weeks.some(w => w.days.some(d => d.type === 'UNDEAD'))
  );
  const hasMana = yearData.some(m =>
    m.weeks.some(w => w.days.some(d => d.hasMana))
  );

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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart2 className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Statistiques</h2>
      </div>

      {/* Moyennes par mois */}
      <div className={`grid gap-3 grid-cols-2 ${
        hasUndead && hasMana ? 'sm:grid-cols-4 lg:grid-cols-7' :
        hasUndead || hasMana ? 'sm:grid-cols-3 lg:grid-cols-6' :
        'sm:grid-cols-5'
      }`}>
        {[
          { icon: <Trophy size={22} className="text-dungeon-gold" />,       label: 'Score/mois',       value: avg('score'),    color: 'text-dungeon-gold' },
          { icon: <Skull size={22} className="text-gray-400" />,            label: 'Monstres/mois',    value: avg('monsters'), color: 'text-gray-300' },
          ...(hasUndead ? [{ icon: <Skull size={22} className="text-yellow-400" />, label: 'Morts/mois', value: avgUndead, color: 'text-yellow-300' }] : []),
          { icon: <AlertTriangle size={22} className="text-red-400" />,     label: 'Pièges/mois',      value: avg('traps'),    color: 'text-red-400' },
          { icon: <Crown size={22} className="text-orange-400" />,          label: 'Boss/mois',        value: avg('bosses'),   color: 'text-orange-400' },
          { icon: <Swords size={22} className="text-green-400" />,          label: 'Ailes/mois',       value: avg('wings'),    color: 'text-green-400' },
          ...(hasMana ? [{ icon: <ManaPotionIcon size={22} />, label: 'Potions/mois', value: avgMana, color: 'text-blue-400' }] : []),
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
            <Bar dataKey="traps"    name="Pièges"        fill={COLORS.traps}    radius={[0, 0, 0, 0]} stackId="a" />
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
                <th className="text-right py-2 font-medium text-gray-400">Monstres</th>
                {hasUndead && <th className="text-right py-2 font-medium text-yellow-400">Morts</th>}
                <th className="text-right py-2 font-medium text-red-400">Pièges</th>
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
                  <td className="py-2 text-right text-gray-400">{row.monsters}</td>
                  {hasUndead && <td className="py-2 text-right text-yellow-300">{row.undead}</td>}
                  <td className="py-2 text-right text-red-400">{row.traps}</td>
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
                <td className="py-2 text-right text-gray-300">{data.reduce((s, m) => s + m.monsters, 0)}</td>
                {hasUndead && <td className="py-2 text-right text-yellow-300">{data.reduce((s, m) => s + m.undead, 0)}</td>}
                <td className="py-2 text-right text-red-400">{data.reduce((s, m) => s + m.traps, 0)}</td>
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
