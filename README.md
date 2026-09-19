# Mon Compagnon

**Application personnelle de compagnon numérique créatif**

Un véritable compagnon pour l'écriture de romans, la gestion d'univers, de personnages, d'idées et le quotidien créatif.

> « L'IA m'aide à créer. Elle ne crée pas à ma place. »

## Vision

- Conversation naturelle avec personnalité personnalisable
- Mémoire persistante et organisée
- Gestion de projets isolés (romans / univers)
- Fiches personnages & univers
- Carnet d'idées + Journal
- Aide à l'écriture (propositions, jamais de prise de contrôle)
- Recherche intelligente
- Sauvegarde locale + export/import
- Priorité Android + version Web/PC
- Local-first, confidentialité maximale

## Stack technique (MVP)

| Couche | Technologie |
|--------|-------------|
| Mobile + Web | **Expo (React Native)** |
| Stockage | SQLite (`expo-sqlite`) |
| Navigation | Expo Router |
| État | Zustand |
| UI | Style doux, littéraire, mode clair/sombre |
| Sauvegarde | Export JSON + partage fichier |

## Fonctionnalités MVP (v1)

- [x] Structure du projet
- [ ] Accueil / Chat
- [ ] Mémoire structurée
- [ ] Projets (création & isolation)
- [ ] Idées / Carnet
- [ ] Personnages (fiches)
- [ ] Univers
- [ ] Journal
- [ ] Recherche
- [ ] Sauvegarde locale + export/import

## Installation rapide

```bash
npm install
npx expo start
```

Puis scanne le QR code avec **Expo Go** (Android) ou ouvre dans le navigateur pour la version Web.

## Structure des dossiers

```
Mon-Compagnon/
├── app/                  # Écrans (Expo Router)
├── components/           # Composants UI
├── db/                   # Schéma SQLite + helpers
├── stores/               # Zustand stores
├── types/                # Types TypeScript
├── utils/                # Utilitaires (export, recherche...)
├── assets/               # Images, fonts
├── constants/            # Thèmes, couleurs
└── README.md
```

## Principe fondamental

L'IA propose. **Toi** décides.

---

Créé avec ♥ pour les auteurs qui veulent un vrai compagnon créatif.
