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

## Fonctionnalités

- 🌌 Hero avec champ lumineux WebGL (shader maison, aucune librairie externe)
- ✍️ Statement « scroll-scrubbed » : les mots s'allument au fil du scroll
- 🍱 Bento grid (About, stats, langues, localisation, disponibilité)
- 🃏 Cartes projets avec visuels animés + fenêtre de détail (`<dialog>`)
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
│   └── visuals/          ← Visuels animés des projets
└── static/
    ├── css/style.css     ← Design system complet
    └── js/main.js        ← Toutes les animations
```
