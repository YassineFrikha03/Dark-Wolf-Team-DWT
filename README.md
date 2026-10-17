# 🐺 Dark Wolf Team (DWT)

Plateforme web officielle pour l'organisation esports **Dark Wolf Team**. Ce projet intègre une interface moderne pour les fans et membres de l'équipe (roster, matchs, actualités, boutique, statistiques) ainsi qu'un backend robuste avec authentification, gestion des rôles et panneau d'administration.

---

## 📁 Structure du Projet

```text
DWT/
├── dwt-backend/          # API REST Node.js / Express & Base de données MongoDB
│   ├── config/           # Configuration DB & services tiers
│   ├── controllers/      # Contrôleurs métier (auth, matchs, joueurs, etc.)
│   ├── middlewares/      # Middlewares d'authentification et upload
│   ├── models/           # Schémas Mongoose (User, Player, Match, News...)
│   ├── routes/           # Définition des routes d'API
│   ├── uploads/          # Fichiers médias & avatars uploadés
│   ├── seed.js           # Données initiales / seeds
│   └── server.js         # Point d'entrée de l'API
│
└── dwt-frontend/         # Application Frontend React (Vite)
    ├── public/           # Assets statiques
    └── src/
        ├── components/   # Composants réutilisables (Navbar, Footer, Modals...)
        ├── pages/        # Vues principales (Accueil, Équipe, Matchs, Admin...)
        ├── sections/     # Sections de page interactives
        └── context/      # Contextes React (Auth, Thème, etc.)
```

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [MongoDB](https://www.mongodb.com/) (instance locale ou cluster Atlas)
- [Git](https://git-scm.com/)

---

### 1. Configuration du Backend

```bash
cd dwt-backend
npm install
```

Créez un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```
Renseignez vos variables d'environnement (`MONGO_URI`, `JWT_SECRET`, etc.).

Lancer le backend :
```bash
# Mode développement avec rechargement automatique
npm run dev

# Ou démarrage standard
npm start
```
Le serveur sera disponible sur `http://localhost:5000`.

---

### 2. Configuration du Frontend

```bash
cd ../dwt-frontend
npm install
```

Lancer le serveur de développement Vite :
```bash
npm run dev
```
L'application web sera accessible sur `http://localhost:5173`.

---

## 🛠️ Technologies Utilisées

- **Frontend** : React, Vite, Lucide Icons, Vanilla CSS / CSS Modules
- **Backend** : Node.js, Express.js, Mongoose (MongoDB)
- **Authentification & Sécurité** : JWT (JSON Web Tokens), bcryptjs
- **Emails** : Nodemailer
- **Uploads** : Multer

---

## 🐺 Auteur & Organisation

- **Organisation** : Dark Wolf Team
- **Dépôt GitHub** : [Dark-Wolf-Team-DWT](https://github.com/YassineFrikha03/Dark-Wolf-Team-DWT.git)
