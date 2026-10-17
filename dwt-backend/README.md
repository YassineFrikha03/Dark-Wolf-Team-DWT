# 🐺 Dark Wolf Team (DWT) - Backend API

Backend complet, moderne et sécurisé pour l'organisation esport **Dark Wolf Team**.

---

## 🚀 Fonctionnalités Implémentées

### 1. 🛡️ Authentification & Sécurité Complète
- **Inscription & Connexion** : Hachage bcrypt, tokens JWT (30 jours).
- **Email de Bienvenue** : Envoyé automatiquement à chaque nouvel inscrit.
- **Alerte Admin** : Notification par email au staff pour toute nouvelle inscription.
- **Mot de passe oublié & Code de sécurité à 6 chiffres** :
  - Génération d'un code de sécurité aléatoire à 6 chiffres (expirant en 15 min).
  - Envoi direct du code par email avec template esport soigné.
  - Endpoint de vérification `/api/auth/verify-code`.
  - Endpoint de réinitialisation sécurisé `/api/auth/reset-password`.
- **Protection anti-brute force** : `express-rate-limit` sur les endpoints sensibles.
- **Protection HTTP** : Headers sécurisés avec `helmet` et support `cors`.

### 2. 🎮 Gestion des Rosters & Joueurs (`/api/players`)
- Listing des joueurs avec filtres (par jeu : Valorant, LoL, CS2, etc., titulaires/remplaçants, recherche par pseudo).
- Fiches de joueurs avec statistiques (KDA, Winrate, matchs joués) et réseaux sociaux (Twitch, Twitter, Discord, YouTube).
- CRUD complet réservé au staff et administrateurs.

### 3. ⚔️ Matchs, Tournois & Calendrier (`/api/matches`)
- Gestion du calendrier esport : matchs à venir (`upcoming`), matchs en direct (`live`) avec scores en temps réel, et résultats passés (`finished`).
- Support des formats (BO1, BO3, BO5), liens de stream (Twitch, YouTube), et désignation du MVP.

### 4. 🎯 Système de Recrutement & Tryouts (`/api/applications`)
- Formulaire de candidature pour les joueurs (pseudo, email, Discord, rang, jeu, rôle, expérience, tracker).
- **Email de confirmation automatique au joueur** après envoi de sa candidature.
- **Email d'alerte instantané à l'équipe admin**.
- Gestion du statut (`pending`, `under_review`, `accepted`, `rejected`) avec notification automatique par email au candidat.

### 5. 📰 Actualités & Annonces Esport (`/api/news`)
- Articles avec images de couverture, catégories (Esport, Tournoi, Recrutement, Annonce), génération automatique de slugs.
- Système de likes pour les utilisateurs connectés et compteur de vues.

### 6. 📬 Newsletter & Diffusion (`/api/newsletter`)
- Inscription et désabonnement public.
- Fonction de broadcast par email réservée aux administrateurs pour envoyer des annonces à tous les abonnés.

### 7. 📩 Formulaire de Contact & Partenariats (`/api/contact`)
- Réception des messages de contact avec notification automatique par email à l'administrateur.
- Interface d'administration pour lire, marquer et répondre aux messages directement par email.

### 8. 🏆 Palmarès & Trophées (`/api/achievements`)
- Vitrine des trophées, classements et prize pools remportés par les équipes DWT.

### 9. 📊 Statistiques & Dashboard (`/api/stats`)
- `/api/stats/overview` : Vue d'ensemble publique (taux de victoire, nombre de matchs, membres, rosters actifs).
- `/api/stats/admin-dashboard` : Statistiques clés pour le panneau d'administration.

### 10. 🖼️ Téléversement de Médias (`/api/upload`)
- Upload d'images (avatars, logos de match, bannières d'actualités) via Multer, servies statiquement sur `/uploads`.

---

## 📧 Configuration Nodemailer

Les variables d'environnement dans [.env](file:///c:/Users/yassine/Desktop/DWT/dwt-backend/.env) contrôlent l'envoi d'emails :

```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_google
EMAIL_FROM="Dark Wolf Team <no-reply@darkwolfteam.gg>"
ADMIN_EMAIL=admin@darkwolfteam.gg
```

> **Note :** Si aucun identifiant n'est fourni, le backend bascule automatiquement sur un compte de test **Ethereal**, générant des URLs de prévisualisation dans la console sans bloquer le serveur.

---

## 🛠️ Démarrage Rapide

### 1. Démarrer le serveur en développement :
\`\`\`bash
npm run dev
\`\`\`

### 2. Réinitialiser et peupler la base de données :
\`\`\`bash
npm run seed
\`\`\`
*(Crée un compte admin par défaut : `admin@darkwolfteam.gg` / `AdminPassword2026!` ainsi que les joueurs et matchs exemples).*

---

## 📡 Liste des Endpoints de l'API

### Authentification & Utilisateurs (`/api/auth`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/auth/register` | Inscription d'un nouveau membre | Public |
| `POST` | `/api/auth/login` | Connexion (email/pseudo + mot de passe) | Public |
| `POST` | `/api/auth/forgot-password` | Envoi d'un code à 6 chiffres par email | Public |
| `POST` | `/api/auth/verify-code` | Vérifie la validité du code de sécurité | Public |
| `POST` | `/api/auth/reset-password` | Réinitialise le mot de passe avec le code | Public |
| `GET` | `/api/auth/me` | Profil de l'utilisateur connecté | Privé (Bearer Token) |
| `PUT` | `/api/auth/profile` | Mise à jour du profil | Privé |
| `PUT` | `/api/auth/change-password` | Changement du mot de passe | Privé |

### Joueurs & Rosters (`/api/players`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/players` | Liste des joueurs (filtres : `game`, `isStarter`, `search`) | Public |
| `GET` | `/api/players/games/list` | Liste des jeux supportés | Public |
| `GET` | `/api/players/:id` | Détails d'un joueur | Public |
| `POST` | `/api/players` | Ajouter un joueur | Admin/Staff |
| `PUT` | `/api/players/:id` | Modifier un joueur | Admin/Staff |
| `DELETE` | `/api/players/:id` | Supprimer un joueur | Admin |

### Matchs & Tournois (`/api/matches`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/matches` | Liste des matchs (filtres : `status`, `game`) | Public |
| `GET` | `/api/matches/:id` | Détails d'un match | Public |
| `POST` | `/api/matches` | Créer un match | Admin/Staff |
| `PUT` | `/api/matches/:id` | Mettre à jour (scores, live, etc.) | Admin/Staff |
| `DELETE` | `/api/matches/:id` | Supprimer un match | Admin |

### Recrutement (`/api/applications`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/applications` | Soumettre une candidature (emails auto envoyés) | Public |
| `GET` | `/api/applications` | Liste des candidatures | Admin/Staff |
| `GET` | `/api/applications/:id` | Détails d'une candidature | Admin/Staff |
| `PUT` | `/api/applications/:id/status` | Changer le statut (accepter/refuser + email) | Admin/Staff |
| `DELETE` | `/api/applications/:id` | Supprimer une candidature | Admin |

### Actualités (`/api/news`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/news` | Articles d'actualité avec pagination | Public |
| `GET` | `/api/news/:idOrSlug` | Lire un article | Public |
| `POST` | `/api/news/:id/like` | Liker / Unliker un article | Privé |
| `POST` | `/api/news` | Créer un article | Admin/Staff |
| `PUT` | `/api/news/:id` | Modifier un article | Admin/Staff |
| `DELETE` | `/api/news/:id` | Supprimer un article | Admin |

### Newsletter & Contact
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/newsletter/subscribe` | S'abonner aux nouveautés | Public |
| `POST` | `/api/newsletter/unsubscribe` | Se désabonner | Public |
| `POST` | `/api/newsletter/broadcast` | Diffuser un email à tous les abonnés | Admin |
| `POST` | `/api/contact` | Envoyer un message de contact | Public |
| `GET` | `/api/contact` | Voir les messages | Admin |
| `PUT` | `/api/contact/:id` | Répondre au message par email | Admin |

### Statistiques (`/api/stats`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/stats/overview` | Statistiques globales (winrate, matchs, membres) | Public |
| `GET` | `/api/stats/admin-dashboard` | Dashboard de bord administrateur | Admin |

### Boutique & Merchandising (`/api/products` & `/api/orders`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/products` | Catalogue des articles (filtres catégorie, prix, stock) | Public |
| `GET` | `/api/products/categories/list` | Liste des catégories (Maillots, Vêtements, Périphériques...) | Public |
| `GET` | `/api/products/:idOrSlug` | Fiche détaillée d'un article | Public |
| `POST` | `/api/products` | Ajouter un produit | Admin |
| `PUT` | `/api/products/:id` | Modifier un produit | Admin |
| `DELETE` | `/api/products/:id` | Retirer un produit | Admin |
| `POST` | `/api/orders` | Passer une commande (déduction de stock + email automatique) | Public / Connecté |
| `GET` | `/api/orders/my-orders` | Historique de commandes du joueur/client | Privé |
| `GET` | `/api/orders/:id` | Détails d'une commande | Propriétaire / Admin |
| `GET` | `/api/orders` | Liste de toutes les commandes | Admin |
| `PUT` | `/api/orders/:id/status` | Mettre à jour l'expédition (+ email de suivi automatique) | Admin |

