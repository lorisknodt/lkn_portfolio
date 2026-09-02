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
    "about": (
        "23-year-old student in the Master's in Computer Systems Architecture at HEPL, Liège. "
        "I build things across mobile, AI, IoT and backend — "
        "from neural networks and Kotlin apps to FastAPI backends and Flutter experiences. "
        "Looking for a first opportunity starting January 2027."
    ),
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
        },
        {
            "id": "iot2",
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


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, **data})
