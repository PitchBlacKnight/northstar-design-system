"""NorthStar DS wordmark in the system typeface (Open Sans), five type treatments.

Run: uv run --with fonttools --with uharfbuzz --with shapely build_treatments.py /dir/with/fonts
Reuses the mark geometry and helpers from build_faces.py (star on the tip).
"""
import sys
from pathlib import Path

HERE = Path(__file__).parent
exec((HERE / "build_faces.py").read_text().split("FACES = [")[0])   # mark, helpers, TARGET

OUT = HERE / "treatments"
OUT.mkdir(exist_ok=True)
FONT = FONTS / "OpenSans-VF.ttf"

# weight whose stem equals the chevron arm (Open Sans tops out at 800)
lo, hi = 300.0, 800.0
for _ in range(12):
    mid = (lo + hi) / 2
    r, _c = stem_ratio(instance(FONT, {"wght": mid, "wdth": 100})[0])
    lo, hi = (mid, hi) if r < TARGET else (lo, mid)
W_MATCH = round((lo + hi) / 2)

# each run: text, wght, wdth, tracking (em), size (1 = full), gap before it (cap heights)
TREATMENTS = [
    ("matched", "Matched weight", "NORTHSTAR at the chevron's weight, DS Light",
     [("NORTHSTAR", W_MATCH, 100, 0.035, 1, 0), ("DS", 300, 100, 0.035, 1, 0.42)]),
    ("light-wide", "Light, wide tracking", "All Light 300, letters spaced far apart, the mark carries the weight",
     [("NORTHSTAR", 300, 100, 0.22, 1, 0), ("DS", 300, 100, 0.22, 1, 0.75)]),
    ("condensed", "Condensed", "Width 75, ExtraBold 800, set tight, DS Light",
     [("NORTHSTAR", 800, 75, 0.02, 1, 0), ("DS", 300, 75, 0.02, 1, 0.34)]),
    ("two-weight", "North light, Star bold", "The weight change splits the two words, DS Light",
     [("NORTH", 300, 100, 0.04, 1, 0), ("STAR", 800, 100, 0.04, 1, 0.0), ("DS", 300, 100, 0.04, 1, 0.42)]),
    ("small-ds", "Small DS", "NORTHSTAR SemiBold 600, DS at half size on the baseline",
     [("NORTHSTAR", 600, 100, 0.05, 1, 0), ("DS", 400, 100, 0.14, 0.5, 0.3)]),
]
VERSIONS = {
    "dark": ("#FFFFFF", "#27BDFA"),
    "light": ("#191932", "#023AFF"),
    "on-blue": ("#FFFFFF", "#01F1E3"),
    "mono": ("currentColor", "currentColor"),
}
rows = []
cache = {}


def inst(wght, wdth):
    if (wght, wdth) not in cache:
        cache[(wght, wdth)] = instance(FONT, {"wght": wght, "wdth": wdth})
    return cache[(wght, wdth)]


for slug, label, note, runs in TREATMENTS:
    CAP = extent(inst(runs[0][1], runs[0][2])[0], "H")[3]
    UPM = 2048
    letters, mark, mark_k, x = [], None, None, 0.0     # letters: font, glyph, x, size
    for text, wght, wdth, track_em, size, gap in runs:
        f, data = inst(wght, wdth)
        track = track_em * UPM * size
        x += gap * CAP
        for name, adv in shape(data, f, text):
            if name == "A":
                x0, x1, _, _ = extent(f, "A")
                mark_k = CAP * size / CH_H
                grow = CH_W * mark_k - (x1 - x0) * size
                mark = x + (x0 + x1) / 2 * size + grow / 2
                x += adv * size + grow + track
            else:
                letters.append((f, name, x, size)); x += adv * size + track
    S = 200 / CAP
    ex = [(px, sz, extent(f, n)) for f, n, px, sz in letters]
    xmin = min(px + e[0] * sz for px, sz, e in ex); xmax = max(px + e[1] * sz for px, sz, e in ex)
    ymin = min(e[2] * sz for _, sz, e in ex)
    ymax = max(max(e[3] * sz for _, sz, e in ex), CAP + (APEX - STAR_TOP) * mark_k)
    fx = lambda v: round((v - xmin) * S, 2)
    fy = lambda v: round((ymax - v) * S, 2)

    def glyph_d(font, name, px, sz):
        return "".join(op[0] + " ".join(num(fx(px + p[0] * sz)) + " " + num(fy(p[1] * sz)) for p in op[1])
                       for op in ops(font, name))

    def mark_d(points):
        return "M" + "L".join(num(fx(mark + (mx - CX) * mark_k)) + " " + num(fy(CAP - (my - APEX) * mark_k))
                              for mx, my in points) + "Z"

    text_d = " ".join(glyph_d(*l) for l in letters)
    W = num((xmax - xmin) * S); H = num((ymax - ymin) * S)
    for vname, (ink, gem) in VERSIONS.items():
        (OUT / f"northstar-ds-opensans-{slug}-{vname}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
            f'role="img" aria-label="NorthStar DS"><title>NorthStar DS</title>'
            f'<g fill="{ink}"><path id="letters" d="{text_d}"/><path id="a-chevron" d="{mark_d(BODY)}"/></g>'
            f'<path id="a-star" fill="{gem}" d="{mark_d(STAR)}"/></svg>\n')
    rows.append((slug, label, note, float(W)))
    print(f"{label:24} {W} x {H}")

widest = max(r[3] for r in rows)
cells = "".join(
    f'<section><h2>{label}<span>{note}</span></h2><div class="pair">'
    + "".join(f'<figure class="{c}"><img style="width:{w / widest * 100:.1f}%" '
              f'src="treatments/northstar-ds-opensans-{slug}-{v}.svg" alt=""></figure>'
              for c, v in (("dark", "dark"), ("light", "light"), ("blue", "on-blue"), ("mono", "mono")))
    + "</div></section>"
    for slug, label, note, w in rows)
(HERE / "treatments.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NorthStar DS wordmark, Open Sans treatments</title>
<style>
  html, body {{ margin: 0; background: #0f0f20; color: #fff; }}
  section {{ padding: 20px 24px 28px; border-bottom: 1px solid #2a2a48; }}
  h2 {{ margin: 0 0 14px; font: 600 12px/1 ui-monospace, Menlo, monospace; letter-spacing: 1.4px; text-transform: uppercase; display: flex; justify-content: space-between; gap: 16px; }}
  h2 span {{ opacity: .55; text-align: right; }}
  .pair {{ display: grid; grid-template-columns: 1.6fr 1.6fr 1fr 1fr; gap: 12px; }}
  figure {{ margin: 0; display: grid; place-items: center; padding: 34px 5%; border-radius: 10px; }}
  figure img {{ height: auto; display: block; }}
  .dark {{ background: #191932; }} .light {{ background: #fff; }} .blue {{ background: #023aff; }} .mono {{ background: #e9e9ee; }}
  @media (max-width: 800px) {{ .pair {{ grid-template-columns: 1fr; }} }}
</style></head><body>{cells}</body></html>
""")
print("matched weight", W_MATCH)
