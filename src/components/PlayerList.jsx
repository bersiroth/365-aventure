import { useState, useEffect } from 'react';
import { Trophy, Skull, Crown, Swords, AlertTriangle, Users, Zap, Layers2, EyeOff, Axe, FlaskConical, Flame, Ghost, Star, ChevronRight } from 'lucide-react';

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
import { getLevelInfo } from '../data/trophyData';

function MobileStat({ icon, value, label, color }) {
  return (
    <span className={`flex flex-col items-center gap-0 ${color}`}>
      <span className="flex items-center gap-0.5">{icon} {value}</span>
      <span className="text-[8px] text-gray-500 leading-none">{label}</span>
    </span>
  );
}


export function PlayerList({ onSelectPlayer, currentPlayerId, showUndead, showElite, showDouble, showMana, showInvisible, showNecromancer, showInfluenced, showShaman, showFinalBoss }) {
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Titre de page */}
      <div>
        <div className="flex items-center gap-3">
          <Users className="text-dungeon-gold" size={32} />
          <div>
            <h2 className="text-2xl font-medieval font-bold text-dungeon-gold">Classement</h2>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-0.5 pt-0.5">Appuie sur un aventurier pour voir son profile</p>
      </div>

      <div className="bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/50 shadow-2xl overflow-hidden">
        {players.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="font-medieval text-lg">Aucun aventurier pour le moment...</p>
            <p className="text-sm mt-2">Soyez le premier à vous inscrire !</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {/* Table header */}
            {(() => {
              // Colonnes optionnelles du milieu (entre Monstres et Pièges)
              const optMiddleCount = (showUndead ? 1 : 0) + (showElite ? 1 : 0) + (showDouble ? 1 : 0) + (showInvisible ? 1 : 0) + (showNecromancer ? 1 : 0) + (showInfluenced ? 1 : 0) + (showShaman ? 1 : 0) + (showFinalBoss ? 1 : 0);
              const optMiddleCols = optMiddleCount > 0 ? Array(optMiddleCount).fill('4rem').join(' ') + ' ' : '';
              // Inline style pour éviter les problèmes de Tailwind JIT avec les colonnes dynamiques
              // 4rem pour colonnes optionnelles (évite que 1fr = 0 quand beaucoup de colonnes)
              const gridTemplateColumns = `2rem 1fr 4rem 4rem ${optMiddleCols}4rem 4rem 4rem${showMana ? ' 4rem' : ''}`;
              // 2rem 1fr 4rem 4rem 4rem 4rem 4rem 3rem 4rem 4rem 4rem 4rem 4rem 4rem 4rem 4rem
              return (
                <>
                  <div className="hidden md:grid gap-2 px-6 py-3 text-xs text-gray-500 uppercase tracking-wide font-medieval" style={{ gridTemplateColumns }}>
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
                    {showShaman && <div className="text-center text-purple-400">Shamans</div>}
                    {showFinalBoss && <div className="text-center text-rose-400">Boss F.</div>}
                    <div className="text-center text-violet-400">Pièges</div>
                    <div className="text-center text-orange-400">Boss</div>
                    <div className="text-center text-green-400">Ailes</div>
                    {showMana && <div className="text-center text-blue-400">Potions</div>}
                  </div>

                  {players.map((player, index) => {
                    const isCurrentPlayer = player.id === currentPlayerId;
                    const levelInfo = getLevelInfo((player.trophy_xp ?? 0) + ((player.total_score ?? 0) * 4.5));
                    return (
                      <button
                        key={player.id}
                        onClick={() => !isCurrentPlayer && onSelectPlayer(player.id)}
                        disabled={isCurrentPlayer}
                        className={`w-full text-left transition-colors ${isCurrentPlayer ? 'bg-dungeon-gold/10 cursor-default' : 'hover:bg-dungeon-gold/5 cursor-pointer'}`}
                      >
                        {/* Desktop */}
                        <div className="hidden md:grid gap-2 px-6 py-4 items-center" style={{ gridTemplateColumns }}>
                          <div className={`font-bold text-lg ${index < 3 ? 'text-dungeon-gold' : 'text-gray-500'}`}>{index + 1}</div>
                          <div className="min-w-0">
                            <div className={`font-medieval font-bold truncate ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</div>
                            <div className="text-xs text-gray-500 truncate">Niv.{levelInfo.level} — {levelInfo.title}</div>
                          </div>
                          <div className="text-center font-bold text-dungeon-gold">{player.total_score}</div>
                          <div className="text-center text-sky-400">{player.monsters_defeated}</div>
                          {showUndead && <div className="text-center text-yellow-300">{player.undead_defeated ?? 0}</div>}
                          {showElite && <div className="text-center text-red-400">{player.elite_defeated ?? 0}</div>}
                          {showDouble && <div className="text-center text-indigo-400">{player.doubles_defeated ?? 0}</div>}
                          {showInvisible && <div className="text-center text-gray-300">{player.invisibles_defeated ?? 0}</div>}
                          {showNecromancer && <div className="text-center text-green-500">{player.necromancer_defeated ?? 0}</div>}
                          {showInfluenced && <div className="text-center text-orange-400">{player.influenced_bosses_defeated ?? 0}</div>}
                          {showShaman && <div className="text-center text-purple-400">{player.shamans_defeated ?? 0}</div>}
                          {showFinalBoss && <div className="text-center text-rose-400">{player.final_boss_defeated ?? 0}</div>}
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
                                <div className={`font-medieval font-bold ${isCurrentPlayer ? 'text-dungeon-gold' : 'text-white'}`}>{player.pseudo}</div>
                                <div className="text-[10px] text-gray-500">Niv.{levelInfo.level} — {levelInfo.title}</div>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1 text-dungeon-gold font-bold">
                                <Trophy size={16} />
                                {player.total_score}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1 ml-11 text-xs text-gray-400">
                            <MobileStat icon={<Axe size={12} className="text-sky-600" />} value={player.monsters_defeated} label="mons." color="text-sky-400" />
                            {showUndead && <MobileStat icon={<CrossedBonesIcon size={12} className="text-yellow-400" />} value={player.undead_defeated ?? 0} label="morts" color="text-yellow-300" />}
                            {showElite && <MobileStat icon={<Zap size={12} className="text-red-400" />} value={player.elite_defeated ?? 0} label="élites" color="text-red-400" />}
                            {showDouble && <MobileStat icon={<Layers2 size={12} className="text-indigo-400" />} value={player.doubles_defeated ?? 0} label="dubl." color="text-indigo-400" />}
                            {showInvisible && <MobileStat icon={<EyeOff size={12} className="text-gray-400" />} value={player.invisibles_defeated ?? 0} label="invis." color="text-gray-300" />}
                            {showNecromancer && <MobileStat icon={<Skull size={12} className="text-green-600" />} value={player.necromancer_defeated ?? 0} label="nécro." color="text-green-500" />}
                            {showInfluenced && <MobileStat icon={<Flame size={12} className="text-orange-400" />} value={player.influenced_bosses_defeated ?? 0} label="infl." color="text-orange-400" />}
                            {showShaman && <MobileStat icon={<Ghost size={12} className="text-purple-400" />} value={player.shamans_defeated ?? 0} label="sham." color="text-purple-400" />}
                            {showFinalBoss && <MobileStat icon={<Star size={12} className="text-rose-400" />} value={player.final_boss_defeated ?? 0} label="boss f." color="text-rose-400" />}
                            <MobileStat icon={<AlertTriangle size={12} className="text-violet-400" />} value={player.traps_defeated} label="pièges" color="text-violet-400" />
                            <MobileStat icon={<Crown size={12} className="text-orange-400" />} value={player.bosses_defeated} label="boss" color="text-orange-400" />
                            <MobileStat icon={<Swords size={12} className="text-green-400" />} value={player.complete_wings} label="ailes" color="text-green-400" />
                            {showMana && <MobileStat icon={<FlaskConical size={12} className="text-blue-400" />} value={player.mana_potions_earned ?? 0} label="pot." color="text-blue-400" />}
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
