import { Award, Lock } from 'lucide-react';
import {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar,
} from 'lucide-react';
import { TROPHY_DEFINITIONS, TROPHY_TIERS, LEVEL_THRESHOLDS } from '../data/trophyData';

const ICON_MAP = {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar, Award,
};

const TIER_ORDER = ['OR', 'ARGENT', 'BRONZE'];

export function TrophyPage({ trophies, levelInfo }) {
  const unlockedCount = Object.keys(trophies || {}).length;
  const totalCount = TROPHY_DEFINITIONS.length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Award className="text-dungeon-gold" size={32} />
        <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Trophées</h2>
      </div>

      {/* Bannière niveau */}
      <LevelBanner levelInfo={levelInfo} unlockedCount={unlockedCount} totalCount={totalCount} />

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
          {/* Niveau */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dungeon-gold to-amber-700 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl font-bold text-dungeon-dark">{levelInfo.level}</span>
            </div>
            <div>
              <div className="text-dungeon-gold font-medieval font-bold text-xl leading-tight">{levelInfo.title}</div>
              <div className="text-gray-400 text-sm">Niveau {levelInfo.level}</div>
            </div>
          </div>

          {/* Barre XP + compteur */}
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
    <div
      className={`rounded-lg border p-3 text-center transition-all ${
        isUnlocked
          ? `${tier.border} bg-dungeon-dark/50`
          : 'border-gray-700/50 bg-dungeon-dark/30 opacity-40 grayscale'
      }`}
    >
      {/* Icône */}
      <div
        className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${
          isUnlocked ? tier.bg : 'from-gray-700 to-gray-600'
        } flex items-center justify-center mb-2`}
      >
        {isUnlocked
          ? <Icon size={24} className="text-dungeon-dark" />
          : <Lock size={20} className="text-gray-500" />
        }
      </div>

      {/* Nom */}
      <div
        className="font-medieval font-bold text-xs leading-tight"
        style={{ color: isUnlocked ? tier.color : '#6b7280' }}
      >
        {definition.name}
      </div>

      {/* Description */}
      <div className="text-[10px] text-gray-500 mt-1 leading-tight">{definition.description}</div>

      {/* Date + XP */}
      {isUnlocked && (
        <div className="mt-1.5 space-y-0.5">
          <div className="text-[9px] text-gray-600">
            {new Date(unlockedDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-[9px] font-bold" style={{ color: tier.color }}>
            +{tier.xp} XP
          </div>
        </div>
      )}
    </div>
  );
}
