import { useEffect, useState } from 'react';
import { TROPHY_TIERS } from '../data/trophyData';
import {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar, Award,
} from 'lucide-react';

const ICON_MAP = {
  Swords, Skull, AlertTriangle, Crown, FlaskConical,
  Wand2, Shield, Flame, Trophy, Calendar, Award,
};

const AUTO_DISMISS_MS = 4000;

export function TrophyNotification({ trophy, onDismiss }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setLeaving(false);
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(onDismiss, 300);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [trophy.id]);

  const tier = TROPHY_TIERS[trophy.tier];
  const Icon = ICON_MAP[trophy.icon] || Trophy;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] cursor-pointer ${leaving ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
      onClick={() => { setLeaving(true); setTimeout(onDismiss, 300); }}
    >
      <div className="flex overflow-hidden rounded-lg shadow-2xl border border-dungeon-gold/30">
        {/* Barre couleur tier */}
        <div className="w-1.5 shrink-0" style={{ backgroundColor: tier.color }} />

        <div className="flex items-center gap-3 px-4 py-3 bg-dungeon-stone/95 backdrop-blur">
          {/* Icône dans cercle tier */}
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${tier.bg} flex items-center justify-center shrink-0`}
          >
            <Icon size={22} className="text-dungeon-dark" />
          </div>

          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: tier.color }}>
              Trophée {tier.label} débloqué !
            </div>
            <div className="text-white font-medieval font-bold text-sm truncate">{trophy.name}</div>
            <div className="text-gray-400 text-xs truncate">{trophy.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
