# Crédits, Licences & Attributions - Studio de Personnalisation 3D DARK WOLF TEAM (DWT)

Ce document centralise l'ensemble des licences, attributions et règles d'utilisation des technologies et assets composant le Studio 3D Dark Wolf Team.

---

## 1. Propriété du Code & Développement
- **Architecture & Implémentation** : 100 % propriétaire et originale pour Dark Wolf Team (DWT).
- **Règle stricte d'étanchéité légale** : Aucun code source, composant ou asset graphique n'a été copié depuis les dépôts d'inspiration GitHub étudiés (*Fabriqo*, *project_threejs_ai*, *3d-tshirt-customizer*, *t-shirt-customization*).

---

## 2. Dépendances Logicielles (Client de Production)

Toutes les dépendances exécutées dans le navigateur client respectent strictement des licences open-source hautement permissives autorisant l'exploitation commerciale sans restriction virale :

| Dépendance | Version | Licence | Usage |
| :--- | :--- | :--- | :--- |
| **three** | `^0.186.1` | **MIT** | Moteur de rendu WebGL 3D, DecalGeometry, Textures PBR |
| **react** | `^19.2.8` | **MIT** | Framework d'interface utilisateur |
| **react-dom** | `^19.2.8` | **MIT** | Moteur de rendu DOM pour React |
| **react-router-dom** | `^7.18.4` | **MIT** | Routage applicatif (/studio en React.lazy) |
| **lucide-react** | `^1.55.0` | **ISC** | Bibliothèque d'icônes vectorielles modernes |
| **axios** | `^1.20.0` | **MIT** | Client HTTP pour communication API e-commerce |

---

## 3. Dépendances Hors Ligne & Outils Dev (Non incluses dans le bundle client)

| Dépendance | Version | Licence | Règle d'usage impérative |
| :--- | :--- | :--- | :--- |
| **@imgly/background-removal-node** | `^1.4.5` | **AGPL-3.0** | **STRICTEMENT CANTONNÉ AU DEV HORS LIGNE.** Interdiction totale d'import dans `src/` ou tout bundle distribué au client afin d'éviter toute contagion de licence copyleft. |
| **sharp** | `^0.35.5` | **Apache-2.0** | Utilisé uniquement dans les scripts Node.js d'analyse de textures et préparation UV. |
| **oxlint** | `^1.81.0` | **MIT** | Linter statique haute performance. |
| **vite** | `^8.3.0` | **MIT** | Bundler de développement et production. |

---

## 4. Modèles 3D & Assets

| Modèle / Asset | Fichier cible | Licence d'origine | Usage Commercial | Modifications apportées |
| :--- | :--- | :--- | :--- | :--- |
| **T-Shirt Athlétique** | `/models/tshirt.glb` | CC0 1.0 / MIT | Autorisé | Compression Draco (`KHR_draco_mesh_compression`), réduction de 6.79 Mo à 684 Ko. Normalisation Box3 à 0.70 m. |
| **Maillot Esport Pro** | `/models/tshirt.glb` | CC0 1.0 / MIT | Autorisé | Utilise la géométrie athlétique avec habillage esport contrasté et motifs sublimés M1–M5. |
| **Hoodie Techwear** | `/models/hoodie.glb` | CC0 1.0 / CC-BY 4.0 | Autorisé | Redressement des manches en pose naturelle A (script Node `pose_hoodie_node.cjs`), compression Draco de 1.1 Mo à 118 Ko. |
| **Casquettes** | *Bientôt disponible* | N/A | N/A | Modèle .glb non fourni actuellement. Statut « Modèle bientôt disponible ». |
| **Tote Bags** | *Bientôt disponible* | N/A | N/A | Modèle .glb non fourni actuellement. Statut « Modèle bientôt disponible ». |

---

## 5. Polices Typographiques

| Famille | Fonderie / Source | Licence |
| :--- | :--- | :--- |
| **Orbitron** | Matt McInerney (Google Fonts) | SIL Open Font License 1.1 (Usage commercial libre) |
| **Rajdhani** | Indian Type Foundry (Google Fonts) | SIL Open Font License 1.1 (Usage commercial libre) |
| **Inter** | Rasmus Andersson (Google Fonts) | SIL Open Font License 1.1 (Usage commercial libre) |
