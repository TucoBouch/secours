# Premiers secours

Application de premiers secours, mobile d'abord, sans backend. 

- Vue 3 + Vue Router (mode « hash » : chaque écran est une entrée d'historique, le bouton retour du
  téléphone revient à l'écran précédent)
- Réglages (thème clair/sombre/auto, 8 couleurs, taille du texte, options du massage cardiaque)
  conservés dans le `localStorage`
- Quiz de révision : 10 questions à choix multiple tirées au hasard parmi 173, explication après chaque réponse,
  5 derniers quiz conservés (`localStorage`), rappel s'il n'y en a pas eu depuis un mois
- Build en **un seul fichier** : `dist/index.html` (JS, CSS, polices et icônes embarqués)

## Commandes

```bash
npm install
npm run dev      # développement
npm run build    # produit dist/index.html
```

Le fichier `dist/index.html` peut être ouvert directement ou posé sur n'importe quel hébergement statique.

## Où modifier le contenu

| Fichier | Contenu |
| --- | --- |
| `src/data/situations.js` | Situations (icône, étapes, « à ne pas faire »…) |
| `src/data/techniques.js` | PLS, massage cardiaque, DEA, etc. |
| `src/data/principles.js` | Réflexes, appel au 112, chaîne de sauvetage |
| `src/data/quiz.js` | Banque de questions du quiz (bonne réponse, 3 pièges, explication) |
| `src/style.css` | Jetons de design (couleurs OKLCH, palettes, échelle typographique) |
