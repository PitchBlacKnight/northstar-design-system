"""NorthStar DS wordmark, round 2: star on the tip of the A, five typefaces.

Run: uv run --with fonttools --with uharfbuzz --with shapely build_faces.py /dir/with/fonts
The chevron now stands on the baseline and reaches the cap line like a real A.
The star sits on its tip, with a clear gap cut out of the chevron so the two
never merge (also in one color). NORTHSTAR's weight is solved per typeface so
the letter stem equals the chevron arm; DS uses the lightest weight that still holds at small sizes.
"""
import io, math, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.basePen import BasePen
from shapely.geometry import Polygon
import uharfbuzz as hb

FONTS = Path(sys.argv[1])
OUT = Path(__file__).parent / "typefaces"
OUT.mkdir(exist_ok=True)

# ---- source mark (NorthStar repo assets/logo/northstar-mark.svg), y down
CHEVRON = [(227, 46.1094), (393.703, 328.086), (290.844, 281.977), (227, 170.25),
           (163.156, 281.977), (60.2969, 328.086)]
DIAMOND = [(227, 255.375), (289.07, 360.008), (227, 404.344), (164.93, 360.008)]
CX, APEX, FOOT = 227.0, 46.1094, 328.086
CH_H, CH_W = FOOT - APEX, 393.703 - 60.2969

STAR_SCALE = 0.86      # star size against the original mark
STAR_DROP = 30.0       # how far the star's shoulders sit below the tip (mark units)
GAP = 17.0             # clear space between star and chevron (mark units)

# star: scaled about its shoulder line, shoulders moved to APEX + STAR_DROP
sy = 360.008
STAR = [(CX + (x - CX) * STAR_SCALE, APEX + STAR_DROP + (y - sy) * STAR_SCALE) for x, y in DIAMOND]
cut = Polygon(STAR).buffer(GAP, join_style=2, mitre_limit=10)
body = Polygon(CHEVRON).difference(cut)
assert body.geom_type == "Polygon", body.geom_type
BODY = list(body.exterior.coords)[:-1]
# keep exact mirror symmetry after the boolean
BODY = [(round(x, 3), round(y, 3)) for x, y in BODY]
STAR_TOP = min(y for _, y in STAR)


def arm():
    (ax, ay), (bx, by) = CHEVRON[0], CHEVRON[1]
    (cx, cy), (dx, dy) = CHEVRON[3], CHEVRON[2]
    mx, my = (cx + dx) / 2, (cy + dy) / 2
    return abs((bx - ax) * (ay - my) - (ax - mx) * (by - ay)) / math.hypot(bx - ax, by - ay)


TARGET = arm() / CH_H


class Cubics(BasePen):
    """Every glyph as move, line, cubic, close."""
    def __init__(self, gs):
        super().__init__(gs); self.ops = []; self.cur = None
    def _moveTo(self, p): self.ops.append(("M", [p])); self.cur = p
    def _lineTo(self, p): self.ops.append(("L", [p])); self.cur = p
    def _curveToOne(self, a, b, c): self.ops.append(("C", [a, b, c], self.cur)); self.cur = c
    def _closePath(self): self.ops.append(("Z", []))
    def _endPath(self): self.ops.append(("Z", []))


def ops(font, name):
    gs = font.getGlyphSet(); pen = Cubics(gs); gs[name].draw(pen); return pen.ops


def flat(font, name, n=12):
    """Contours as point lists."""
    out, cur = [], []
    for op in ops(font, name):
        if op[0] == "M": cur = [op[1][0]]
        elif op[0] == "L": cur.append(op[1][0])
        elif op[0] == "C":
            p0, (a, b, c) = op[2], op[1]
            for i in range(1, n + 1):
                t = i / n; u = 1 - t
                cur.append(tuple(u**3 * p0[j] + 3*u*u*t * a[j] + 3*u*t*t * b[j] + t**3 * c[j] for j in (0, 1)))
        else:
            if cur: out.append(cur); cur = []
    return out


def extent(font, name):
    pts = [p for c in flat(font, name) for p in c]
    return (min(p[0] for p in pts), max(p[0] for p in pts), min(p[1] for p in pts), max(p[1] for p in pts))


def stem_ratio(font):
    """Stem of H on a scanline a quarter of the way up, as a share of cap height."""
    cap = extent(font, "H")[3]; y = cap * 0.25; xs = []
    for c in flat(font, "H"):
        for (x1, y1), (x2, y2) in zip(c, c[1:] + c[:1]):
            if (y1 - y) * (y2 - y) < 0:
                xs.append(x1 + (x2 - x1) * (y - y1) / (y2 - y1))
    xs.sort()
    return (xs[1] - xs[0]) / cap, cap


def instance(path, axes):
    f = instantiateVariableFont(TTFont(path), axes)
    buf = io.BytesIO(); f.save(buf)
    return f, buf.getvalue()


def shape(data, font, text):
    hf = hb.Font(hb.Face(data)); buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hf, buf, {"kern": True})
    order = font.getGlyphOrder()
    return [(order[i.codepoint], p.x_advance) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]


num = lambda v: ("%.2f" % v).rstrip("0").rstrip(".")

FACES = [  # slug, label, file, fixed axes, weight range, tracking (em), DS weight
    ("archivo-expanded", "Archivo Expanded", "archivo.ttf", {"wdth": 125}, (100, 900), 0.03, 100),
    ("unbounded", "Unbounded", "unbounded.ttf", {}, (200, 900), 0.02, 200),
    ("jost", "Jost", "jost.ttf", {}, (100, 900), 0.06, 200),
    ("oxanium", "Oxanium", "oxanium.ttf", {}, (200, 800), 0.05, 200),
    ("fraunces", "Fraunces", "fraunces.ttf", {"opsz": 144, "SOFT": 0, "WONK": 0}, (100, 900), 0.03, 300),
]
VERSIONS = {
    "dark": ("#FFFFFF", "#27BDFA"),
    "light": ("#191932", "#023AFF"),
    "on-blue": ("#FFFFFF", "#01F1E3"),
    "mono": ("currentColor", "currentColor"),
}
rows = []

for slug, label, file, fixed, (wmin, wmax), track_em, w_ds in FACES:
    path = FONTS / file
    lo, hi = float(wmin), float(wmax)
    for _ in range(12):
        mid = (lo + hi) / 2
        r, _c = stem_ratio(instance(path, {**fixed, "wght": mid})[0])
        lo, hi = (mid, hi) if r < TARGET else (lo, mid)
    w_main = round((lo + hi) / 2)
    f_main, b_main = instance(path, {**fixed, "wght": w_main})
    f_ds, b_ds = instance(path, {**fixed, "wght": w_ds})
    ratio, CAP = stem_ratio(f_main)
    UPM = f_main["head"].unitsPerEm
    TRACK = track_em * UPM
    k = CAP / CH_H                       # chevron: baseline to cap line
    mark_w = CH_W * k

    letters, mark, x = [], None, 0.0
    for name, adv in shape(b_main, f_main, "NORTHSTAR"):
        if name == "A":
            x0, x1, _, _ = extent(f_main, "A")
            grow = mark_w - (x1 - x0)
            mark = x + (x0 + x1) / 2 + grow / 2
            x += adv + grow + TRACK
        else:
            letters.append((f_main, name, x)); x += adv + TRACK
    x += CAP * 0.42 - TRACK            # same word gap in every face
    for name, adv in shape(b_ds, f_ds, "DS"):
        letters.append((f_ds, name, x)); x += adv + TRACK

    S = 200 / CAP
    ex = [(px, extent(f, n)) for f, n, px in letters]
    xmin = min(px + e[0] for px, e in ex); xmax = max(px + e[1] for px, e in ex)
    ymin = min(e[2] for _, e in ex)
    ymax = max(max(e[3] for _, e in ex), CAP + (APEX - STAR_TOP) * k)
    fx = lambda v: round((v - xmin) * S, 2)
    fy = lambda v: round((ymax - v) * S, 2)

    def glyph_d(font, name, px):
        d = []
        for op in ops(font, name):
            d.append(op[0] + " ".join(num(fx(px + p[0])) + " " + num(fy(p[1])) for p in op[1]))
        return "".join(d)

    def mark_d(points):
        return "M" + "L".join(num(fx(mark + (mx - CX) * k)) + " " + num(fy(CAP - (my - APEX) * k))
                              for mx, my in points) + "Z"

    main_d = " ".join(glyph_d(f, n, px) for f, n, px in letters if f is f_main)
    ds_d = " ".join(glyph_d(f, n, px) for f, n, px in letters if f is f_ds)
    W = num((xmax - xmin) * S); H = num((ymax - ymin) * S)
    for vname, (ink, gem) in VERSIONS.items():
        (OUT / f"northstar-ds-{slug}-{vname}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
            f'role="img" aria-label="NorthStar DS"><title>NorthStar DS</title>'
            f'<g fill="{ink}"><path id="northst-r" d="{main_d}"/>'
            f'<path id="a-chevron" d="{mark_d(BODY)}"/><path id="ds" d="{ds_d}"/></g>'
            f'<path id="a-star" fill="{gem}" d="{mark_d(STAR)}"/></svg>\n')
    rows.append((slug, label, w_main, w_ds, ratio))
    print(f"{label:18} wght {w_main} (stem/cap {ratio:.3f}, target {TARGET:.3f})  DS {w_ds}  {W} x {H}")

# ---- the new mark on its own
pts = BODY + STAR
x0 = min(p[0] for p in pts); y0 = min(p[1] for p in pts)
mw = max(p[0] for p in pts) - x0; mh = max(p[1] for p in pts) - y0
md = lambda P: "M" + "L".join(num(x - x0) + " " + num(y - y0) for x, y in P) + "Z"
for vname, (ink, gem) in VERSIONS.items():
    (OUT / f"northstar-mark-star-up-{vname}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(mw)} {num(mh)}" width="{num(mw)}" height="{num(mh)}" '
        f'role="img" aria-label="NorthStar"><title>NorthStar</title>'
        f'<path id="chevron" fill="{ink}" d="{md(BODY)}"/><path id="star" fill="{gem}" d="{md(STAR)}"/></svg>\n')

# ---- preview sheet
cells = "".join(
    f'<section><h2>{label}<span>NORTHSTAR {w} / DS {d}</span></h2>'
    f'<div class="pair"><figure class="dark"><img src="typefaces/northstar-ds-{slug}-dark.svg" alt=""></figure>'
    f'<figure class="light"><img src="typefaces/northstar-ds-{slug}-light.svg" alt=""></figure>'
    f'<figure class="blue"><img src="typefaces/northstar-ds-{slug}-on-blue.svg" alt=""></figure>'
    f'<figure class="mono"><img src="typefaces/northstar-ds-{slug}-mono.svg" alt=""></figure></div></section>'
    for slug, label, w, d, _ in rows)
(OUT.parent / "faces.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NorthStar DS wordmark, five typefaces</title>
<style>
  html, body {{ margin: 0; background: #0f0f20; color: #fff; }}
  section {{ padding: 20px 24px 28px; border-bottom: 1px solid #2a2a48; }}
  h2 {{ margin: 0 0 14px; font: 600 12px/1 ui-monospace, Menlo, monospace; letter-spacing: 1.4px; text-transform: uppercase; display: flex; justify-content: space-between; }}
  h2 span {{ opacity: .55; }}
  .pair {{ display: grid; grid-template-columns: 1.6fr 1.6fr 1fr 1fr; gap: 12px; }}
  figure {{ margin: 0; display: grid; place-items: center; padding: 34px 5%; border-radius: 10px; }}
  figure img {{ width: 100%; height: auto; display: block; }}
  .dark {{ background: #191932; }} .light {{ background: #fff; }} .blue {{ background: #023aff; }} .mono {{ background: #e9e9ee; }}
  @media (max-width: 800px) {{ .pair {{ grid-template-columns: 1fr; }} }}
</style></head><body>{cells}</body></html>
""")
