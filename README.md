# 365 Aventures : Le Donjon (2026)

Application web auto-hébergée pour suivre votre progression dans le jeu "365 Aventures : Le Donjon".

## 🎮 Fonctionnalités

- **Calendrier 2026 complet** : 365 jours de combats
- **Système de scoring** :
  - +1 point par monstre/piège vaincu
  - +2 points par boss terrassé (Dimanches)
  - +3 points bonus par semaine complète (7 combats)
- **Persistance locale** : Sauvegarde automatique dans `localStorage`
- **Partage URL** : Partagez votre progression via URL (mode lecture seule)
- **Design Dungeon Crawler** : Ambiance médiévale avec typographie Cinzel
- **Responsive** : Desktop-first, utilisable sur mobile

## 🚀 Déploiement Docker

### Prérequis

- Docker
- Docker Compose

### Installation

```bash
# Cloner le dépôt
git clone <votre-repo>
cd 365-aventure

# Build et démarrage
docker-compose up -d

# L'application sera disponible sur http://localhost:8080
```

### Configuration

Par défaut, l'application écoute sur le port `8080`. Pour changer le port :

```yaml
# docker-compose.yml
ports:
  - "VOTRE_PORT:80"
```

### Commandes utiles

```bash
# Arrêter l'application
docker-compose down

# Rebuild après modifications
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart
```

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Lancer en mode dev
npm run dev

# Build pour production
npm run build
```

## 📦 Stack Technique

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Compression** : lz-string (partage URL)
- **Server** : Nginx Alpine
- **Containerization** : Docker multi-stage build

## 🎯 Système de jeu

### Types de cases

- **Monstres** (Lun-Sam) : Valeur 1-6
- **Boss** (Dimanche) : Valeur 17-22, fond doré

### Bonus Semaine (Critique)

Une semaine complète (7 combats Lun-Dim) = **+3 points bonus**

### Partage

1. Cliquez sur "Partager"
2. Copiez l'URL générée
3. Envoyez à vos amis
4. Ils verront votre progression en **mode lecture seule**

## 📝 Licence

Application non officielle inspirée du jeu "365 Aventures : Le Donjon" par Sorry We Are French.

## 🐛 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.
