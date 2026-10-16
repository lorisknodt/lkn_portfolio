# Portfolio V2 — Loris Knodt

Site portfolio moderne avec particules interactives, animations avancées et showcase de projets GitHub.

## Lancer le projet dans PyCharm

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

## Mise en ligne (GitHub Pages)

Le site n'a pas de logique serveur : `python build.py` génère une version statique dans `dist/`
(`index.html` + `static/`). Le workflow `.github/workflows/pages.yml` le fait automatiquement
et publie sur GitHub Pages à chaque push sur `main`.

1. **Settings → Pages → Build and deployment → Source : GitHub Actions** (une seule fois)
2. Push sur `main` → le site est en ligne sur `https://lorisknodt.github.io/lkn_portfolio/`
3. Domaine perso : **Settings → Pages → Custom domain** + enregistrements DNS chez le registrar
   (voir la doc GitHub « Managing a custom domain for your GitHub Pages site »)

Les URL des fichiers sont relatives et versionnées (`?v=` = empreinte du contenu) :
le même `dist/` fonctionne à la racine d'un domaine comme sous `/lkn_portfolio/`.

## Fonctionnalités

- 🌌 Hero avec champ lumineux WebGL (shader maison, aucune librairie externe)
- ✍️ Statement « scroll-scrubbed » : les mots s'allument au fil du scroll
- 🍱 Bento grid (About, stats, langues, localisation, disponibilité)
- 🃏 Cartes projets avec visuels animés + fenêtre de détail (`<dialog>`)
- 📱 Feastly : visite guidée avec les vraies captures de l'appli (chapitres façon Apple, lecture auto, pause) + galerie d'écrans
- 🔦 Effet spotlight qui suit le curseur sur les cartes
- 🧭 Timeline expérience / formation qui se remplit au scroll
- 🌗 Mode clair / sombre, menu mobile, respect de `prefers-reduced-motion`

## Structure

```
portfolio_v2/
├── main.py               ← FastAPI + toutes les données
├── requirements.txt
├── templates/
│   ├── index.html        ← Template Jinja2
│   └── visuals/          ← Visuels animés des projets (+ visite guidée)
└── static/
    ├── media/<projet>/   ← Vidéos MP4/WebM + captures WebP (générées depuis les GIFs)
    ├── css/style.css     ← Design system complet
    └── js/main.js        ← Toutes les animations
```
