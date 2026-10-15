from datetime import date

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

data = {
    "name": "Loris Knodt",
    "title": "Computer Systems Architecture",
    "tagline": "Building systems at the edge of software & hardware.",
    "about": "23-year-old student in the Master's in Computer Systems Architecture at HEPL, Liège.",
    # Scroll-driven statement below the hero. Words wrapped in *asterisks* get the accent gradient.
    "statement": (
        "I build things across mobile, AI, IoT and backend — from neural networks "
        "and Kotlin apps to FastAPI backends and Flutter experiences. "
        "I'm drawn to projects where *disciplines* *meet.*"
    ),
    "tagline_highlight": "software & hardware",
    "available": "January 2027",
    "contact": {
        "email": "loris.knodt@gmail.com",
        "phone": "+32 497 93 95 40",
        "location": "Kettenis, Belgium",
        "github": "https://github.com/lorisknodt",
    },
    "skills": [
        {"category": "Networking & Security",  "techs": ["TCP/IP", "Cybersecurity", "Wireless", "VPN"]},
        {"category": "Cloud & DevOps",          "techs": ["Cloud Computing", "DevOps", "CI/CD", "Docker"]},
        {"category": "Data & AI",               "techs": ["Machine Learning", "Big Data", "Neural Networks", "Keras"]},
        {"category": "Mobile & IoT",            "techs": ["Kotlin", "Flutter", "Dart", "Android", "IoT"]},
        {"category": "Languages",               "techs": ["Python", "C/C++", "Java", "C#", "PL/SQL"]},
        {"category": "Vision & VR",             "techs": ["Computer Vision", "Unity", "VR", "C#"]},
    ],
    "projects": [
        {
            "id": "feastly",
            "visual": "feastly", "accent": "#FE7603",
            "name": "Feastly",
            "tagline": "Find the right place for the right mood.",
            "description": (
                "A contextual restaurant recommendation app built with Flutter. "
                "Input your mood, it finds the spot. Built with Clean Architecture, "
                "Firebase, Google Places API and a full CI/CD pipeline via GitHub Actions."
            ),
            "tech": ["Flutter", "Dart", "Firebase", "Google Places API", "CI/CD"],
            "lang": "Dart", "lang_color": "#00B4AB",
            "highlights": ["134 commits", "Clean Architecture", "CI/CD", "Chatbot"],
            "github": "https://github.com/TonyVandeWiele/Feastly",
            "type": "Mobile · Team",
            # Real screen recordings (static/media/feastly/<id>.mp4 + <id>-poster.webp),
            # played as an auto-advancing tour on the project card.
            "tour": [
                {"id": "discover",   "title": "Discover",
                 "text": "Places picked for you, from popular and nearby to food and drinks, one tab away."},
                {"id": "chatbot",    "title": "Mood chatbot",
                 "text": "Say how you feel. The bot asks a question or two, then suggests a spot."},
                {"id": "onboarding", "title": "Taste onboarding",
                 "text": "Swipe what you like and pick your cuisines, so recommendations fit from day one."},
                {"id": "schedule",   "title": "Schedule",
                 "text": "Plan an outing on the calendar, down to the minute."},
                {"id": "darkmode",   "title": "Dark mode",
                 "text": "A warm dark theme, one tap away in the profile."},
                {"id": "language",   "title": "Three languages",
                 "text": "English, French and Chinese, switched on the fly."},
            ],
            # Stills for the gallery in the project dialog (static/media/feastly/shot-<file>.webp).
            "screens": [
                {"file": "discover",         "alt": "Discover tab with nearby recommendations"},
                {"file": "chatbot",          "alt": "Chatbot suggesting a bowling alley"},
                {"file": "onboarding",       "alt": "Onboarding: swiping through activities you like"},
                {"file": "onboarding-prefs", "alt": "Onboarding: picking favourite cuisines"},
                {"file": "schedule",         "alt": "Schedule with the time picker open"},
                {"file": "darkmode",         "alt": "Profile screen with the theme switch"},
                {"file": "language",         "alt": "Language picker: English, French, Chinese"},
            ],
        },
        {
            "id": "iot2",
            "visual": "shop", "accent": "#A97BFF",
            "name": "CLM Shop",
            "tagline": "Full e-commerce Android app with 3DSecure.",
            "description": (
                "Complete Android e-commerce application in Kotlin with MVVM. "
                "Product listing, shopping cart, order management and 3DSecure payment."
            ),
            "tech": ["Kotlin", "MVVM", "Retrofit", "Coroutines", "LiveData"],
            "lang": "Kotlin", "lang_color": "#A97BFF",
            "highlights": ["28 commits", "MVVM", "3DSecure", "Retrofit"],
            "github": "https://github.com/lorisknodt/iot2_clm",
            "type": "Android · Solo",
        },
        {
            "id": "ann",
            "visual": "ann", "accent": "#FF8A3D",
            "name": "ANN — Neural Network",
            "tagline": "Trained & optimized Keras neural network.",
            "description": (
                "Machine learning project implementing and optimizing an Artificial Neural Network. "
                "Covers data preparation, architecture, training, hyperparameter tuning and model export."
            ),
            "tech": ["Python", "Keras", "TensorFlow", "Jupyter", "NumPy"],
            "lang": "Jupyter Notebook", "lang_color": "#DA5B0B",
            "highlights": ["Keras export", "Hyperparameter tuning", "Data pipeline"],
            "github": "https://github.com/lorisknodt/IA_ANN",
            "type": "ML · Solo",
        },
        {
            "id": "vr",
            "visual": "vr", "accent": "#3DDC84",
            "name": "VR Horror Game",
            "tagline": "Immersive VR horror experience in Unity.",
            "description": (
                "A virtual reality horror game developed in Unity using C#. "
                "Explores VR interaction design, spatial audio and immersive environment building."
            ),
            "tech": ["Unity", "C#", "VR", "3D Modeling", "Spatial Audio"],
            "lang": "C#", "lang_color": "#178600",
            "highlights": ["VR interactions", "Unity engine", "Spatial audio"],
            "github": "https://github.com/TonyVandeWiele/PROJET_VR_HORROR_HEPL",
            "type": "VR · Team",
        },
    ],
    "experience": [
        {
            "role": "Fullstack Developer Intern",
            "company": "NetBee",
            "location": "Grace-Hollogne, BE",
            "period": "Jan 2024 – May 2024",
            "description": "React JS dashboard for real-time data visualization and REST API design.",
            "tags": ["React JS", "REST API", "Fullstack"],
        },
        {
            "role": "Industrial Assembler",
            "company": "Automation & Robotics",
            "location": "Lambermont, BE",
            "period": "Jul 2019 – Jul 2026",
            "description": "Assembly of industrial machinery — hands-on production environment experience.",
            "tags": ["Industrial", "Hardware"],
        },
    ],
    "education": [
        {
            "degree": "Master — Computer Systems Architecture",
            "school": "HEPL · ISIL, Liège",
            "period": "2024 – present",
            "details": "120 ECTS · Networking, cybersecurity, cloud, Big Data & ML, IoT, VR",
        },
        {
            "degree": "Bachelor — Computer Science & Systems",
            "school": "HEPL, Seraing",
            "period": "2021 – 2024",
            "details": "Industrial IT · Programming, databases, TCP/IP, OS",
        },
        {
            "degree": "CESS — Modern Languages & Economics",
            "school": "PDS Eupen",
            "period": "2015 – 2021",
            "details": "",
        },
    ],
    "languages": [
        {"lang": "French",  "level": "Native",         "pct": 100},
        {"lang": "German",  "level": "Native",         "pct": 100},
        {"lang": "English", "level": "Advanced B2/C1", "pct": 85},
    ],
}


def view_data() -> dict:
    """Derive the small presentation helpers the template needs from `data`."""
    before, hl, after = data["tagline"].partition(data["tagline_highlight"])
    return {
        **data,
        "tagline_parts": (before, hl, after),
        "statement_words": [
            {"text": w.strip("*"), "hl": w.startswith("*")}
            for w in data["statement"].split()
        ],
        "year": date.today().year,
    }


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(request, "index.html", view_data())
