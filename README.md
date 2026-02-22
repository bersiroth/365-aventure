# 365 Aventures : Le Donjon (2026)

Application web auto-hébergée pour suivre votre progression dans le jeu "365 Aventures : Le Donjon" par Sorry We Are French.

---

## 🎮 Fonctionnalités

### Calendrier & Jeu
- **365 jours** de combats pour l'année 2026
- **Validation des cases** en un clic avec sauvegarde automatique
- **Ailes conquises** : bannière visuelle quand les 7 jours d'une semaine sont validés
- **Mode lecture seule** pour consulter la progression d'un autre joueur

### Système de scoring
| Type | Points |
|---|---|
| Monstre vaincu | +1 pt |
| Piège désamorcé | +1 pt |
| Mort-Vivant vaincu | +1 pt (si Nécromancien du mois vaincu ou absent) |
| Monstre Invisible vaincu | +1 pt |
| Monstre Élite vaincu | +1 pt (en plus du type de base) |
| Monstres Doubles vaincus | +2 pts |
| Nécromancien vaincu | +1 pt |
| Shaman de l'Ombre vaincu | +1 pt |
| Boss terrassé (Dimanche) | +2 pts |
| Boss Influencé terrassé | +2 pts + 10 pts bonus |
| Aile complète (7 jours) | +3 pts bonus |

### Comptes & Multijoueur
- **Inscription / Connexion** avec mot de passe haché (bcrypt)
- **Classement** des aventuriers trié par score
- **Consultation** de la progression de chaque joueur (mode lecture seule)

### Trophées (style PSN)
- **30 trophées** à débloquer (15 Bronze · 10 Argent · 5 Or)
- **Système XP** : Bronze = 25 XP · Argent = 50 XP · Or = 100 XP
- **Niveaux 1–20** avec titres médiévaux (Vagabond → Conquérant du Donjon)
- **Notifications popup** slide-in à chaque nouveau trophée débloqué
- **Trophées rétroactifs** : calculés au chargement sans flood de notifications

### Sauvegarde
- **Sync serveur** automatique (debounce 500 ms) quand connecté
- **localStorage** pour les joueurs non connectés
- **Export JSON** (v2 — inclut la progression + les trophées)
- **Import JSON** avec confirmation modale et vérification du pseudo

### Statistiques
- Score cumulé, score par mois (graphiques)
- Combats par mois (barres empilées par type)
- Moyennes mensuelles par catégorie
- Tableau récapitulatif mensuel complet
- Exploits : meilleur mois, plus longue série, monstre le plus vaincu, pire mois

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
| Juillet | **Monstres Doubles** | Type `DOUBLE` avec deux valeurs — nécessite 2 dés de chaque valeur, +2 pts |
| Août | **Anneau Ancien** | Pouvoir 1×/mois — enchaîner un combat supplémentaire après 4 dés identiques |
| Septembre | **Monstres Invisibles & Nécromancien** | Flag `isInvisible` + type `NECROMANCER` — si le Nécromancien du mois n'est pas vaincu, les points des Morts-Vivants de ce mois ne comptent pas |
| Octobre | **Boss Influencé & Objets Magiques ×2** | Flag `isInfluenced` sur les boss (dimanche) — valeur affichée dans un cercle rouge, +10 pts bonus ; si un `UNDEAD` de l'aile est vaincu, la valeur du boss est divisée par 2. Les objets magiques (Bâton, Cape, Anneau) peuvent être utilisés **2 fois** ce mois |
| Novembre | **Shaman de l'Ombre** | Type `SHAMAN` — apparaît en début d'aile (lundi), bloque les relances de dés jusqu'à sa défaite |

---

## 🗂️ Types de cases

| Type | Visuel | Scoring | Config |
|---|---|---|---|
| `MONSTER` | Bouclier bleu | +1 pt | `{ type: 'MONSTER', value: N }` |
| `BOSS` | Bouclier gris (Dimanche) | +2 pts | `{ type: 'BOSS', value: N }` |
| `TRAP` | Triangle violet | +1 pt | `{ type: 'TRAP', value: -N }` |
| `UNDEAD` | Bouclier jaune + anneau doré épais | +1 pt (si Nécromancien du mois vaincu ou absent) | `{ type: 'UNDEAD', value: N }` |
| `DOUBLE` | Deux boucliers bleus | +2 pts | `{ type: 'DOUBLE', value: N, value2: M }` |
| `NECROMANCER` | Bouclier vert sombre + anneau vert + 💀 | +1 pt, débloque les pts UNDEAD du mois | `{ type: 'NECROMANCER', value: N }` |
| `SHAMAN` | Bouclier violet + anneau violet + 👻 | +1 pt | `{ type: 'SHAMAN', value: N }` |

### Flags combinables
| Flag | Visuel | Effet |
|---|---|---|
| `isElite: true` | Fond rouge, badge ⚡ bas-gauche | Compteur séparé `eliteDefeated` |
| `isInvisible: true` | Bordure pointillée épaisse, bouclier rond translucide | Compteur séparé `invisiblesDefeated` |
| `isInfluenced: true` | Fond jaune, cercle rouge + badge 🔥 + badge +10 | +10 pts bonus ; si `UNDEAD` de l'aile vaincu → valeur divisée par 2, affichage bouclier | `{ isInfluenced: true }` sur un `BOSS` |
| `hasMana: true` | Icône fiole bas-droite | Octroie une potion de mana |

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
