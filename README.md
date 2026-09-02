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

Ouvre → **http://localhost:8000**

## Fonctionnalités

- 🌌 Système de particules interactif (canvas WebGL-style)
- 🖱️ Curseur personnalisé avec effet magnétique
- ✍️ Typewriter sur le tagline du hero
- 🔢 Compteurs animés au scroll
- 📐 Effet tilt 3D sur les cards de projets
- 📊 Barres de langues animées au scroll
- 🔦 Scroll reveal avec stagger

## Structure

```
portfolio_v2/
├── main.py               ← FastAPI + toutes les données
├── requirements.txt
├── templates/
│   └── index.html        ← Template Jinja2
└── static/
    ├── css/style.css     ← Design system complet
    └── js/main.js        ← Toutes les animations
```
