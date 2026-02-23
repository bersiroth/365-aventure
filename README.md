# 365 Aventures : Le Donjon (2026)

Application web auto-hébergée pour suivre votre progression dans le jeu "365 Aventures : Le Donjon" par Sorry We Are French.

---

## 🎮 Fonctionnalités

### Calendrier & Jeu
- **365 jours** de combats pour l'année 2026
- **Validation des cases** en un clic avec sauvegarde automatique
- **Ailes conquises** : bannière visuelle quand les 7 jours d'une semaine sont validés
- **Blocage de validation** : impossible de valider une case de valeur > 30 (max 5 dés × 6), popup explicative
- **Mode lecture seule** pour consulter la progression d'un autre joueur

### Système de scoring
| Type | Points |
|---|---|
| Monstre vaincu | +1 pt |
| Piège désamorcé | +1 pt |
| Mort-Vivant vaincu | +1 pt (si Nécromancien du mois vaincu ou absent) |
| Monstre Invisible vaincu | +1 pt |
| Monstre Élite vaincu | +1 pt (en plus du type de base) |
| Monstres Doubles vaincus | +3 pts |
| Nécromancien vaincu | +1 pt |
| Shaman de l'Ombre vaincu | +1 pt |
| Boss terrassé (Dimanche) | +2 pts |
| Boss Influencé terrassé | +2 pts + 10 pts bonus |
| Boss Final terrassé (31 Déc.) | +2 pts + 30 pts bonus |
| Aile complète (7 jours) | +3 pts bonus (bloquée si UNDEAD non débloqué) |

### Comptes & Multijoueur
- **Inscription / Connexion** avec mot de passe haché (bcrypt)
- **Classement** des aventuriers trié par score, avec niveau et titre
- **Consultation** de la progression de chaque joueur — menu principal masqué, navigation via "Retour au classement"

### Navigation (ordre des pages)
| Page | Contenu |
|---|---|
| **Donjon** | Calendrier mensuel uniquement |
| **Profil** | Niveau + barre XP · Progression (score, compteurs) · Exploits |
| **Statistiques** | Graphiques · Moyennes mensuelles · Tableau récapitulatif |
| **Trophées** | Liste complète des trophées débloqués/verrouillés |
| **Classement** | Tableau de tous les aventuriers |

Vue d'un autre joueur : onglets **Profil → Statistiques → Trophées → Donjon** (mode lecture seule affiché uniquement sur l'onglet Donjon).

### Profil joueur
- **Niveau & titre** avec barre d'XP (Vagabond → Conquérant du Donjon)
- **Panneau Progression** : score total et tous les compteurs par type de combat
- **Exploits** : meilleur mois, plus longue série de jours consécutifs, monstre le plus vaincu, pire mois

### Trophées (style PSN)
- **30 trophées** à débloquer (15 Bronze · 10 Argent · 5 Or)
- **Système XP** : Bronze = 25 XP · Argent = 50 XP · Or = 100 XP
- **Niveaux 1–20** avec titres médiévaux
- **Notifications popup** slide-in à chaque nouveau trophée débloqué
- **Trophées rétroactifs** : calculés au chargement sans flood de notifications

### Sauvegarde
- **Sync serveur** automatique (debounce 500 ms) quand connecté
- **localStorage** pour les joueurs non connectés
- **Export JSON** (v2 — inclut la progression + les trophées)
- **Import JSON** avec confirmation modale et vérification du pseudo

### Statistiques
- Score cumulé et score par mois (graphiques)
- Combats par mois (barres empilées par type, dont Boss Final)
- Moyennes mensuelles par catégorie (8 valeurs/ligne sur desktop)
- Tableau récapitulatif mensuel complet avec totaux

---

## 📅 Règles mensuelles progressives

Chaque mois débloque une nouvelle règle affichée dans le calendrier via le bouton "Nouvelle règle".

| Mois | Règle | Mécanique |
|---|---|---|
| Janvier | — | Règles de base |
| Février | **Potion de Mana** | Cases spéciales qui octroient une potion utilisable pour relancer un dé bleu |
| Mars | **Morts-Vivants Enchaînés** | Nouveau type `UNDEAD` — nécessite les deux dés bleus dans le calcul |
| Avril | **Bâton du Sage** | Pouvoir 1×/mois — retourner un dé rouge sur sa face opposée |
| Mai | **Monstres Élites** | Flag `isElite` — vaincre en max 2 jets au lieu de 3 |
| Juin | **Cape des Illusions** | Pouvoir 1×/mois — modifier un dé bleu pour qu'il corresponde à l'autre |
| Juillet | **Monstres Doubles** | Type `DOUBLE` avec deux valeurs — nécessite 2 dés de chaque valeur, +3 pts |
| Août | **Anneau Ancien** | Pouvoir 1×/mois — enchaîner un combat supplémentaire après 4 dés identiques |
| Septembre | **Monstres Invisibles & Nécromancien** | Flag `isInvisible` + type `NECROMANCER` — si le Nécromancien du mois n'est pas vaincu : points des Morts-Vivants annulés, ailes contenant un UNDEAD non comptabilisées |
| Octobre | **Boss Influencé & Objets Magiques ×2** | Flag `isInfluenced` sur les boss (dimanche) — valeur affichée dans un cercle rouge, +10 pts bonus ; si un `UNDEAD` de l'aile est vaincu, la valeur du boss est divisée par 2. Les objets magiques (Bâton, Cape, Anneau) peuvent être utilisés **2 fois** ce mois |
| Novembre | **Shaman de l'Ombre** | Type `SHAMAN` — apparaît en début d'aile (lundi), bloque les relances de dés jusqu'à sa défaite |
| Décembre | **Le Défi Final** | Boss Final le 31 décembre — valeur de base 2048, divisée par 2 pour chaque `UNDEAD` du mois vaincu (uniquement si le `NECROMANCER` est vaincu), +30 pts bonus |

---

## 🗂️ Types de cases

| Type | Visuel | Scoring | Config |
|---|---|---|---|
| `MONSTER` | Bouclier bleu | +1 pt | `{ type: 'MONSTER', value: N }` |
| `BOSS` | Bouclier gris (Dimanche) | +2 pts | `{ type: 'BOSS', value: N }` |
| `TRAP` | Triangle violet | +1 pt | `{ type: 'TRAP', value: -N }` |
| `UNDEAD` | Bouclier jaune + anneau doré épais | +1 pt (si Nécromancien du mois vaincu ou absent) | `{ type: 'UNDEAD', value: N }` |
| `DOUBLE` | Deux boucliers bleus | +3 pts | `{ type: 'DOUBLE', value: N, value2: M }` |
| `NECROMANCER` | Bouclier vert sombre + anneau vert + 💀 | +1 pt, débloque les pts UNDEAD et les ailes du mois | `{ type: 'NECROMANCER', value: N }` |
| `SHAMAN` | Bouclier violet + anneau violet + 👻 | +1 pt | `{ type: 'SHAMAN', value: N }` |

### Flags combinables
| Flag | Visuel | Effet |
|---|---|---|
| `isElite: true` | Fond rouge, badge ⚡ bas-gauche | Compteur séparé `eliteDefeated` |
| `isInvisible: true` | Bordure pointillée épaisse, bouclier rond translucide | Compteur séparé `invisiblesDefeated` |
| `isInfluenced: true` | Fond jaune, cercle rouge + badge 🔥 + badge +10 | +10 pts bonus ; si `UNDEAD` de l'aile vaincu → valeur divisée par 2, affichage bouclier |
| `isFinalBoss: true` | Fond jaune, cercle rouge + badge 🔥 + badge +30 | Valeur dynamique (2048 ÷ 2 par UNDEAD vaincu si NECRO vaincu), +30 pts bonus |
| `hasMana: true` | Icône fiole bas-droite | Octroie une potion de mana |

### Overlays de validation
| État | Overlay |
|---|---|
| Case validée (normal) | Vert transparent + ✓ (rayures si aile complète) |
| `UNDEAD` validé, Nécromancien non vaincu | Orange rayé + 💀 (points et aile en attente) |
| Aile complète avec UNDEAD bloqué | Pas de bannière "Aile Conquise" |

---

## 🚀 Déploiement Docker

### Prérequis
- Docker
- Docker Compose

### Installation

```bash
git clone <votre-repo>
cd 365-aventure

docker-compose up -d
# Application disponible sur http://localhost:8080
```

### Configuration du port

```yaml
# docker-compose.yml
ports:
  - "VOTRE_PORT:80"
```

### Commandes utiles

```bash
docker-compose down          # Arrêter
docker-compose up -d --build # Rebuild après modifications
docker-compose logs -f       # Voir les logs
docker-compose restart       # Redémarrer
```

---

## 🛠️ Développement local

```bash
npm install
npm run dev    # Frontend Vite (port 5173)
```

Pour le serveur backend :
```bash
node server/index.js   # ou via votre script de démarrage
```

### Page Dev (mode développement uniquement)

En mode dev (`import.meta.env.DEV`), un bouton "Dev" apparaît dans la navigation. Il donne accès à :
- **Slider mois actif** : simule n'importe quel mois de l'année (persisté en localStorage)
- **Remplissage aléatoire** : remplit un mois avec des données aléatoires
- **Forcer mois complet** : marque toutes les cases d'un mois comme validées

---

## 📦 Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Graphiques | Recharts |
| Backend | Express.js |
| Base de données | better-sqlite3 |
| Auth | bcrypt + JWT (cookie httpOnly) |
| Containerisation | Docker multi-stage + Nginx Alpine |

---

## 📝 Licence

Application non officielle inspirée du jeu "365 Aventures : Le Donjon" par Sorry We Are French.
