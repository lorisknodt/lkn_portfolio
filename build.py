"""Export the portfolio as a static site (GitHub Pages or any static host).

    python build.py          # writes dist/ : index.html + static/

The page has no backend logic, so rendering the template once is all it takes.
URLs are relative, so dist/ works at a domain root and under a sub-path
(e.g. https://lorisknodt.github.io/lkn_portfolio/).
"""
import shutil
from pathlib import Path

from main import templates, view_data

ROOT = Path(__file__).parent
OUT = ROOT / "dist"


def build(out: Path = OUT) -> Path:
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(ROOT / "static", out / "static")
    html = templates.get_template("index.html").render(view_data())
    (out / "index.html").write_text(html, encoding="utf-8")
    return out


if __name__ == "__main__":
    out = build()
    size = sum(f.stat().st_size for f in out.rglob("*") if f.is_file())
    print(f"Built {out} ({size / 1e6:.1f} MB)")
