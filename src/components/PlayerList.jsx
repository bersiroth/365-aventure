import { useState, useEffect } from 'react';
import { Trophy, Skull, Crown, Swords, AlertTriangle, Users } from 'lucide-react';
import { getPlayers } from '../api';

function ManaPotionIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 20 26" style={{ width: size, height: size, display: 'inline' }} xmlns="http://www.w3.org/2000/svg">
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

export function PlayerList({ onSelectPlayer, currentPlayerId, showUndead, showMana }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlayers()
      .then(data => setPlayers(data.players))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Swords className="text-dungeon-gold mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-dungeon-gold font-medieval">Chargement du classement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-900/40 border border-red-600 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-2xl overflow-hidden">
        <div className="bg-dungeon-gold/10 border-b-2 border-dungeon-gold/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <Users className="text-dungeon-gold" size={32} />
            <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">
              Classement des Aventuriers
            </h2>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="font-medieval text-lg">Aucun aventurier pour le moment...</p>
            <p className="text-sm mt-2">Soyez le premier à vous inscrire !</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {/* Table header */}
            {(() => {
              const gridCols = showUndead && showMana
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem_5rem]'
                : showUndead || showMana
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem]'
                : 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem]';
              return (
                <>
                  <div className={`hidden md:grid ${gridCols} gap-2 px-6 py-3 text-xs text-gray-500 uppercase tracking-wide font-medieval`}>
                    <div>#</div>
                    <div>Joueur</div>
                    <div className="text-center"><Trophy size={14} className="inline text-dungeon-gold" /></div>
                    <div className="text-center"><Skull size={14} className="inline text-gray-400" /></div>
                    {showUndead && <div className="text-center"><Skull size={14} className="inline text-yellow-400" /></div>}
                    <div className="text-center"><AlertTriangle size={14} className="inline text-red-400" /></div>
                    <div className="text-center"><Crown size={14} className="inline text-orange-400" /></div>
                    <div className="text-center"><Swords size={14} className="inline text-green-400" /></div>
                    {showMana && <div className="text-center"><ManaPotionIcon size={14} /></div>}
                  </div>

                  {players.map((player, index) => {
                    const isCurrentPlayer = player.id === currentPlayerId;
                    return (
                      <button
                        key={player.id}
                        onClick={() => !isCurrentPlayer && onSelectPlayer(player.id)}
                        disabled={isCurrentPlayer}
                        className={`w-full text-left transition-colors ${isCurrentPlayer ? 'bg-dungeon-gold/10 cursor-default' : 'hover:bg-dungeon-gold/5'}`}
                      >
                        {/* Desktop */}
                        <div className={`hidden md:grid ${gridCols} gap-2 px-6 py-4 items-center`}>
                          <div className={`font-bold text-lg ${index < 3 ? 'text-dungeon-gold' : 'text-gray-500'}`}>{index + 1}</div>
                          <div className={`font-medieval font-bold truncate ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</div>
                          <div className="text-center font-bold text-dungeon-gold">{player.total_score}</div>
                          <div className="text-center text-gray-300">{player.monsters_defeated}</div>
                          {showUndead && <div className="text-center text-yellow-300">{player.undead_defeated ?? 0}</div>}
                          <div className="text-center text-red-400">{player.traps_defeated}</div>
                          <div className="text-center text-orange-400">{player.bosses_defeated}</div>
                          <div className="text-center text-green-400">{player.complete_wings}</div>
                          {showMana && <div className="text-center text-blue-400">{player.mana_potions_earned ?? 0}</div>}
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`font-bold text-lg w-8 ${index < 3 ? 'text-dungeon-gold' : 'text-gray-500'}`}>{index + 1}</span>
                              <span className={`font-medieval font-bold ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</span>
                            </div>
                            <div className="flex items-center gap-1 text-dungeon-gold font-bold">
                              <Trophy size={16} />
                              {player.total_score}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1 ml-11 text-xs text-gray-400">
                            <span><Skull size={12} className="inline" /> {player.monsters_defeated}</span>
                            {showUndead && <span className="text-yellow-300"><Skull size={12} className="inline text-yellow-400" /> {player.undead_defeated ?? 0}</span>}
                            <span><AlertTriangle size={12} className="inline text-red-400" /> {player.traps_defeated}</span>
                            <span><Crown size={12} className="inline text-orange-400" /> {player.bosses_defeated}</span>
                            <span><Swords size={12} className="inline text-green-400" /> {player.complete_wings}</span>
                            {showMana && <span className="text-blue-400"><ManaPotionIcon size={12} /> {player.mana_potions_earned ?? 0}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
