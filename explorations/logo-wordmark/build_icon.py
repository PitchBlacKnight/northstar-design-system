"""NorthStar final set: matched-weight wordmark, icon on its own, animated icon.

Run after build_treatments.py:
  uv run --with fonttools --with uharfbuzz --with shapely build_icon.py /dir/with/fonts
Animated files are self-contained SVG (CSS keyframes inside), so they play in an
<img>, inline, or as a CSS background. Reduced-motion users get the still icon.
"""
import shutil, sys
from pathlib import Path
from shapely.geometry import box

HERE = Path(__file__).parent
exec((HERE / "build_faces.py").read_text().split("FACES = [")[0])   # CHEVRON, BODY, STAR, num ...

FINAL = HERE / "final"
FINAL.mkdir(exist_ok=True)
TEST = "--frames" in sys.argv

COLORS = {  # ink, star, spark
    "dark": ("#FFFFFF", "#27BDFA", "#FFFFFF"),
    "light": ("#191932", "#023AFF", "#023AFF"),
    "on-blue": ("#FFFFFF", "#01F1E3", "#FFFFFF"),
    "mono": ("currentColor", "currentColor", "currentColor"),
}

# ---- 1. wordmark and still icon, copied under final names
for v in COLORS:
    shutil.copy(HERE / "treatments" / f"northstar-ds-opensans-matched-{v}.svg", FINAL / f"northstar-ds-wordmark-{v}.svg")
    shutil.copy(HERE / "typefaces" / f"northstar-mark-star-up-{v}.svg", FINAL / f"northstar-icon-{v}.svg")

# ---- 2. animated icon. 600 x 600 stage, icon centred, room for rays and trails
pts = BODY + STAR
bx0, bx1 = min(p[0] for p in pts), max(p[0] for p in pts)
by0, by1 = min(p[1] for p in pts), max(p[1] for p in pts)
TX, TY = 300 - (bx0 + bx1) / 2, 300 - (by0 + by1) / 2
P = lambda poly: "M" + "L".join(num(x + TX) + " " + num(y + TY) for x, y in poly) + "Z"
body = Polygon(BODY)
# halves overlap by a hair so no seam shows down the middle
left = list(body.intersection(box(-1e4, -1e4, CX + 0.6, 1e4)).exterior.coords)[:-1]
right = [(2 * CX - x, y) for x, y in left][::-1]
SX, SY = CX + TX, APEX + STAR_DROP - 14 + TY          # optical centre of the star


def spark(R, r):
    return "M" + "L".join(f"{num(x)} {num(y)}" for x, y in
                          [(0, -R), (r, -r), (R, 0), (r, r), (0, R), (-r, r), (-R, 0), (-r, -r)]) + "Z"


EASE = "cubic-bezier(.16,1,.3,1)"
BASE = """
.star{transform-box:fill-box;transform-origin:50% 62%}
.spark,.ring{opacity:0}
*{animation-play-state:var(--p,running)}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
"""
D = lambda s: f"calc({s}s - var(--t,0s))"            # every delay can be scrubbed for stills

ANIMS = {
    # the chevron settles, the star rises onto the tip, one glint
    "rise": (f"""
.arm{{animation:chev .8s {EASE} {D(0)} both}}
.star{{animation:rise 1.1s cubic-bezier(.3,0,.2,1) {D(.3)} both}}
.s1{{animation:glint .8s ease-out {D(1.25)} both}}
@keyframes chev{{from{{opacity:0;transform:translateY(28px)}}}}
@keyframes rise{{0%{{opacity:0;transform:translateY(90px) scale(.45)}}35%{{opacity:1}}72%{{transform:translateY(-14px) scale(1.06)}}100%{{transform:none}}}}
@keyframes glint{{0%{{opacity:0;transform:scale(0)}}35%{{opacity:1;transform:scale(1)}}100%{{opacity:0;transform:scale(.25) rotate(45deg)}}}}
""", False),
    # idle loop: the star swells, lifts a little and throws a glint, with two small sparks nearby
    "twinkle": (f"""
.star{{animation:pulse 3.6s ease-in-out {D(0)} infinite}}
.s1{{animation:tw 3.6s ease-out {D(0)} infinite}}
.s2{{animation:tw2 3.6s ease-out {D(-1.5)} infinite}}
.s3{{animation:tw2 3.6s ease-out {D(-2.6)} infinite}}
@keyframes pulse{{0%,52%,100%{{transform:none}}66%{{transform:translateY(-9px) scale(1.13)}}80%{{transform:translateY(1px) scale(.98)}}}}
@keyframes tw{{0%,54%{{opacity:0;transform:scale(0)}}66%{{opacity:1;transform:scale(1)}}84%,100%{{opacity:0;transform:scale(.25) rotate(45deg)}}}}
@keyframes tw2{{0%,60%{{opacity:0;transform:scale(0)}}72%{{opacity:.9;transform:scale(1)}}88%,100%{{opacity:0;transform:scale(.2) rotate(45deg)}}}}
""", True),
    # a shooting star lands on the tip, the arms close in under it
    "shooting": (f"""
.fly{{animation:fly .62s cubic-bezier(.45,0,.25,1) {D(.1)} both}}
.trail{{animation:trail .95s ease-out {D(.1)} both}}
.star{{animation:land .5s {EASE} {D(.68)} both}}
.ring{{animation:ring .7s ease-out {D(.68)} both}}
.s1{{animation:glint .7s ease-out {D(.66)} both}}
.al{{animation:al .8s {EASE} {D(.62)} both}}
.ar{{animation:ar .8s {EASE} {D(.62)} both}}
@keyframes fly{{from{{transform:translate(340px,-440px)}}}}
@keyframes trail{{0%{{opacity:0}}20%,55%{{opacity:1}}100%{{opacity:0}}}}
@keyframes land{{from{{transform:scale(1.28)}}}}
@keyframes ring{{0%{{opacity:0;transform:scale(.2)}}8%{{opacity:.7}}100%{{opacity:0;transform:scale(1)}}}}
@keyframes glint{{0%{{opacity:0;transform:scale(0)}}35%{{opacity:1;transform:scale(1)}}100%{{opacity:0;transform:scale(.25) rotate(45deg)}}}}
@keyframes al{{from{{opacity:0;transform:translate(-46px,78px)}}}}
@keyframes ar{{from{{opacity:0;transform:translate(46px,78px)}}}}
""", False),
    # the star ignites from a point, then the arms travel up their own angle to point at it
    "ignite": (f"""
.star{{animation:ignite .9s {EASE} {D(.15)} both}}
.s1{{animation:flare 1s ease-out {D(.15)} both}}
.al{{animation:al .9s {EASE} {D(.6)} both}}
.ar{{animation:ar .9s {EASE} {D(.6)} both}}
@keyframes ignite{{0%{{opacity:0;transform:scale(0) rotate(-120deg)}}60%{{opacity:1;transform:scale(1.12) rotate(0)}}100%{{transform:none}}}}
@keyframes flare{{0%{{opacity:0;transform:scale(0) rotate(-45deg)}}30%{{opacity:1;transform:scale(1.15) rotate(0)}}100%{{opacity:0;transform:scale(.3) rotate(45deg)}}}}
@keyframes al{{from{{opacity:0;transform:translate(-60px,102px)}}}}
@keyframes ar{{from{{opacity:0;transform:translate(60px,102px)}}}}
""", False),
}


def animated(kind, ink, gem, glow, extra=""):
    css, _loop = ANIMS[kind]
    trail = ""
    if kind == "shooting":
        # tapered tail pointing back along the flight path
        ux, uy = 340 / 556.0, -440 / 556.0; nx, ny = -uy, ux; L, w = 300, 15
        tail = [(SX + nx * w, SY + ny * w), (SX + ux * L, SY + uy * L), (SX - nx * w, SY - ny * w)]
        trail = (f'<linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="{num(SX)}" y1="{num(SY)}" '
                 f'x2="{num(SX + ux * L)}" y2="{num(SY + uy * L)}"><stop offset="0" stop-color="{gem}" stop-opacity=".85"/>'
                 f'<stop offset="1" stop-color="{gem}" stop-opacity="0"/></linearGradient>'
                 '<path class="trail" fill="url(#tg)" d="M' + "L".join(f"{num(x)} {num(y)}" for x, y in tail) + 'Z"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" '
            f'aria-label="NorthStar"><title>NorthStar</title><style>{BASE}{css}{extra}</style>'
            f'<g fill="{ink}"><path class="arm al" d="{P(left)}"/><path class="arm ar" d="{P(right)}"/></g>'
            f'<g transform="translate({num(SX)} {num(SY)})">'
            f'<circle class="ring" r="150" fill="none" stroke="{gem}" stroke-width="5"/></g>'
            f'<g class="fly">{trail}<path class="star" fill="{gem}" d="{P(STAR)}"/></g>'
            f'<g transform="translate({num(SX)} {num(SY)})"><path class="spark s1" fill="{glow}" d="{spark(170, 9)}"/></g>'
            f'<g transform="translate({num(SX - 118)} {num(SY - 52)})"><path class="spark s2" fill="{glow}" d="{spark(40, 4)}"/></g>'
            f'<g transform="translate({num(SX + 104)} {num(SY + 22)})"><path class="spark s3" fill="{glow}" d="{spark(30, 3)}"/></g>'
            '</svg>\n')


for kind in ANIMS:
    for v in (COLORS if kind == "rise" else ("dark", "light")):   # rise is the main one: all four colors
        (FINAL / f"northstar-icon-{kind}-{v}.svg").write_text(animated(kind, *COLORS[v]))

if TEST:   # paused stills for checking the motion
    out = Path(sys.argv[sys.argv.index("--frames") + 1])
    frames = {"rise": (.5, .9, 1.5), "twinkle": (2.3, 2.5, 3.0), "shooting": (.4, .75, 1.0), "ignite": (.4, .9, 1.2)}
    cells = ""
    for kind, ts in frames.items():
        for t in ts:
            name = f"{kind}-{t}.svg"
            (out / name).write_text(animated(kind, *COLORS["dark"], extra=f":root{{--t:{t}s;--p:paused}}"))
            cells += f'<figure><img src="{name}"><figcaption>{kind} {t}s</figcaption></figure>'
    (out / "frames.html").write_text(
        '<body style="margin:0;background:#0f0f20;color:#fff;font:12px monospace;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:8px">'
        '<style>figure{margin:0;background:#191932}img{width:100%;display:block}figcaption{padding:4px 8px}</style>' + cells + "</body>")

# ---- 3. preview page
tiles = "".join(
    f'<button class="tile t-{k}" data-src="final/northstar-icon-{k}-dark.svg"><img src="final/northstar-icon-{k}-dark.svg" alt="">'
    f'<span><b>{k}</b>{note}</span></button>'
    for k, note in (("rise", "Star rises onto the tip, one glint"), ("shooting", "Shooting star lands, arms close in"),
                    ("ignite", "Star ignites, arms point to it"), ("twinkle", "Idle loop")))
(HERE / "final.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NorthStar DS, final set</title>
<style>
  html, body {{ margin: 0; background: #0f0f20; color: #fff; font: 12px/1.4 ui-monospace, Menlo, monospace; }}
  main {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 24px; }}
  .wm {{ grid-column: span 2; display: grid; place-items: center; padding: 56px 8%; border-radius: 10px; }}
  .wm img {{ width: 100%; height: auto; display: block; }}
  .ic {{ display: grid; place-items: center; padding: 28px; border-radius: 10px; }}
  .ic img {{ height: 120px; width: auto; display: block; }}
  .dark {{ background: #191932; }} .light {{ background: #fff; }} .blue {{ background: #023aff; }} .mono {{ background: #e9e9ee; color: #000; }}
  .tile {{ all: unset; cursor: pointer; background: #191932; border-radius: 10px; display: grid; }}
  .tile img {{ width: 100%; height: auto; display: block; }}
  .tile span {{ padding: 0 16px 16px; opacity: .7; letter-spacing: .4px; }}
  .tile b {{ display: block; text-transform: uppercase; letter-spacing: 1.4px; color: #fff; }}
  .tile:focus-visible {{ outline: 2px solid #01f1e3; outline-offset: 2px; }}
  h2 {{ grid-column: 1 / -1; margin: 18px 0 0; font: 600 12px/1 ui-monospace, Menlo, monospace; letter-spacing: 1.4px; text-transform: uppercase; opacity: .55; }}
  @media (max-width: 800px) {{ main {{ grid-template-columns: repeat(2, 1fr); }} }}
</style></head><body><main>
  <h2>Wordmark, matched weight</h2>
  <figure class="wm dark" style="margin:0"><img src="final/northstar-ds-wordmark-dark.svg" alt="NorthStar DS"></figure>
  <figure class="wm light" style="margin:0"><img src="final/northstar-ds-wordmark-light.svg" alt="NorthStar DS"></figure>
  <h2>Icon</h2>
  <div class="ic dark"><img src="final/northstar-icon-dark.svg" alt=""></div>
  <div class="ic light"><img src="final/northstar-icon-light.svg" alt=""></div>
  <div class="ic blue"><img src="final/northstar-icon-on-blue.svg" alt=""></div>
  <div class="ic mono"><img src="final/northstar-icon-mono.svg" alt=""></div>
  <h2>Animated icon, click a tile to replay</h2>
  {tiles}
</main>
<script>
  document.querySelectorAll('.tile').forEach(function (t) {{
    t.setAttribute('tabindex', '0');
    function replay() {{ t.querySelector('img').src = t.dataset.src + '?r=' + Date.now(); }}
    t.addEventListener('click', replay);
    t.addEventListener('keydown', function (e) {{ if (e.key === 'Enter' || e.key === ' ') {{ e.preventDefault(); replay(); }} }});
  }});
</script></body></html>
""")
print("final:", len(list(FINAL.glob("*.svg"))), "svg files")
