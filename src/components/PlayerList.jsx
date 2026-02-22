import { useState, useEffect } from 'react';
import { Trophy, Skull, Crown, Swords, AlertTriangle, Users, Zap, Layers2, EyeOff, Axe, FlaskConical, Flame } from 'lucide-react';

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
import { getPlayers } from '../api';
import { LEVEL_TITLES } from '../data/trophyData';


export function PlayerList({ onSelectPlayer, currentPlayerId, showUndead, showElite, showDouble, showMana, showInvisible, showNecromancer, showInfluenced }) {
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
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
              const optCount = (showUndead ? 1 : 0) + (showElite ? 1 : 0) + (showDouble ? 1 : 0) + (showMana ? 1 : 0) + (showInvisible ? 1 : 0) + (showNecromancer ? 1 : 0) + (showInfluenced ? 1 : 0);
              const gridCols = optCount >= 5
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem]'
                : optCount === 4
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem]'
                : optCount === 3
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem_5rem_5rem]'
                : optCount === 2
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem_5rem]'
                : optCount === 1
                ? 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem]'
                : 'grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_5rem]';
              return (
                <>
                  <div className={`hidden md:grid ${gridCols} gap-2 px-6 py-3 text-xs text-gray-500 uppercase tracking-wide font-medieval`}>
                    <div>#</div>
                    <div>Joueur</div>
                    <div className="text-center text-dungeon-gold">Score</div>
                    <div className="text-center text-sky-600">Mons.</div>
                    {showUndead && <div className="text-center text-yellow-400">Morts</div>}
                    {showElite && <div className="text-center text-red-400">Élites</div>}
                    {showDouble && <div className="text-center text-indigo-400">Doubles</div>}
                    {showInvisible && <div className="text-center text-gray-400">Invis.</div>}
                    {showNecromancer && <div className="text-center text-green-600">Nécro.</div>}
                    {showInfluenced && <div className="text-center text-orange-400">Influen.</div>}
                    <div className="text-center text-violet-400">Pièges</div>
                    <div className="text-center text-orange-400">Boss</div>
                    <div className="text-center text-green-400">Ailes</div>
                    {showMana && <div className="text-center text-blue-400">Potions</div>}
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
                          <div className="truncate">
                            <span className={`font-medieval font-bold ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</span>
                            {player.level != null && <span className="ml-2 text-xs font-normal text-gray-500">Niv.{player.level} — {LEVEL_TITLES[(player.level || 1) - 1]}</span>}
                          </div>
                          <div className="text-center font-bold text-dungeon-gold">{player.total_score}</div>
                          <div className="text-center text-sky-400">{player.monsters_defeated}</div>
                          {showUndead && <div className="text-center text-yellow-300">{player.undead_defeated ?? 0}</div>}
                          {showElite && <div className="text-center text-red-400">{player.elite_defeated ?? 0}</div>}
                          {showDouble && <div className="text-center text-indigo-400">{player.doubles_defeated ?? 0}</div>}
                          {showInvisible && <div className="text-center text-gray-300">{player.invisibles_defeated ?? 0}</div>}
                          {showNecromancer && <div className="text-center text-green-500">{player.necromancer_defeated ?? 0}</div>}
                          {showInfluenced && <div className="text-center text-orange-400">{player.influenced_bosses_defeated ?? 0}</div>}
                          <div className="text-center text-violet-400">{player.traps_defeated}</div>
                          <div className="text-center text-orange-400">{player.bosses_defeated}</div>
                          <div className="text-center text-green-400">{player.complete_wings}</div>
                          {showMana && <div className="text-center text-blue-400">{player.mana_potions_earned ?? 0}</div>}
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`font-bold text-lg w-8 ${index < 3 ? 'text-dungeon-gold' : 'text-gray-500'}`}>{index + 1}</span>
                              <span>
                                <span className={`font-medieval font-bold ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</span>
                                {player.level != null && <span className="ml-1.5 text-[10px] text-gray-500">Niv.{player.level}— {LEVEL_TITLES[(player.level || 1) - 1]}</span>}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-dungeon-gold font-bold">
                              <Trophy size={16} />
                              {player.total_score}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1 ml-11 text-xs text-gray-400">
                            <span className="text-sky-400"><Axe size={12} className="inline text-sky-600" /> {player.monsters_defeated}</span>
                            {showUndead && <span className="text-yellow-300"><CrossedBonesIcon size={12} className="inline text-yellow-400" /> {player.undead_defeated ?? 0}</span>}
                            {showElite && <span className="text-red-400"><Zap size={12} className="inline" /> {player.elite_defeated ?? 0}</span>}
                            {showDouble && <span className="text-indigo-400"><Layers2 size={12} className="inline" /> {player.doubles_defeated ?? 0}</span>}
                            {showInvisible && <span className="text-gray-300"><EyeOff size={12} className="inline text-gray-400" /> {player.invisibles_defeated ?? 0}</span>}
                            {showNecromancer && <span className="text-green-500"><Skull size={12} className="inline text-green-600" /> {player.necromancer_defeated ?? 0}</span>}
                            {showInfluenced && <span className="text-orange-400"><Flame size={12} className="inline" /> {player.influenced_bosses_defeated ?? 0}</span>}
                            <span className="text-violet-400"><AlertTriangle size={12} className="inline" /> {player.traps_defeated}</span>
                            <span><Crown size={12} className="inline text-orange-400" /> {player.bosses_defeated}</span>
                            <span><Swords size={12} className="inline text-green-400" /> {player.complete_wings}</span>
                            {showMana && <span className="text-blue-400"><FlaskConical size={12} className="inline text-blue-400" /> {player.mana_potions_earned ?? 0}</span>}
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
