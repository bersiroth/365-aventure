import { useState } from 'react';
import { X, Settings, Volume2, Vibrate, Sparkles } from 'lucide-react';
import { getSetting, setSetting } from '../utils/settings';

export function SettingsModal({ onClose }) {
  const [sound, setSound]           = useState(() => getSetting('sound'));
  const [vibration, setVibration]   = useState(() => getSetting('vibration'));
  const [animations, setAnimations] = useState(() => getSetting('animations'));

  const toggle = (key, value, setter) => {
    setSetting(key, value);
    setter(value);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/60 shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-dungeon-gold transition-colors">
          <X size={18} />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-4 pr-6">
          <div className="p-2 rounded-lg bg-dungeon-gold/10 border border-dungeon-gold/30">
            <Settings className="text-dungeon-gold" size={20} />
          </div>
          <h3 className="text-lg font-medieval font-bold text-dungeon-gold">Paramètres</h3>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-dungeon-gold/40 to-transparent mb-5" />

        {/* Options */}
        <div className="space-y-4">
          <SettingRow
            icon={<Volume2 size={18} className="text-blue-400" />}
            label="Sons"
            description="Son d'épée à la validation"
            enabled={sound}
            onToggle={v => toggle('sound', v, setSound)}
          />
          <SettingRow
            icon={<Vibrate size={18} className="text-purple-400" />}
            label="Vibrations"
            description="Retour haptique sur les interactions"
            enabled={vibration}
            onToggle={v => toggle('vibration', v, setVibration)}
          />
          <SettingRow
            icon={<Sparkles size={18} className="text-yellow-400" />}
            label="Animations"
            description="Confetti lors d'une aile conquise"
            enabled={animations}
            onToggle={v => toggle('animations', v, setAnimations)}
          />
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-lg bg-dungeon-gold/10 border border-dungeon-gold/30 text-dungeon-gold font-medieval text-sm hover:bg-dungeon-gold/20 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <div className="min-w-0">
          <p className="text-sm font-medieval font-semibold text-gray-200 leading-tight">{label}</p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        className={`shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-dungeon-gold' : 'bg-gray-700'}`}
        aria-label={enabled ? 'Désactiver' : 'Activer'}
      >
        <span
          className={`absolute top-1 right-[1.75rem] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}
