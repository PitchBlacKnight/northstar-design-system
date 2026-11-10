"""Builds the NorthStar DS wordmark: the NorthStar mark stands in for the A.

Run: uv run --with fonttools --with uharfbuzz build.py /path/to/OpenSans-VF.ttf
Letters are outlined from Open Sans (OFL). The weight of NORTHSTAR is solved so
its vertical stem equals the thickness of the mark's arms. Output is pure paths.
"""
import io, math, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import RecordingPen
import uharfbuzz as hb

FONT = sys.argv[1]
OUT = Path(__file__).parent

# ---- the mark (assets/logo/northstar-mark.svg in the NorthStar repo), y down
CHEVRON = [(227, 46.1094), (393.703, 328.086), (290.844, 281.977), (227, 170.25),
           (163.156, 281.977), (60.2969, 328.086)]
DIAMOND = [(227, 255.375), (289.07, 360.008), (227, 404.344), (164.93, 360.008)]
M_CX, M_TOP, M_BOT = 227.0, 46.1094, 404.344
M_H = M_BOT - M_TOP
M_W = 393.703 - 60.2969


def arm_thickness():
    """Perpendicular thickness of the chevron arm, measured at the inner edge midpoint."""
    (ax, ay), (bx, by) = CHEVRON[0], CHEVRON[1]          # outer edge
    (cx, cy), (dx, dy) = CHEVRON[3], CHEVRON[2]          # inner edge
    mx, my = (cx + dx) / 2, (cy + dy) / 2
    return abs((bx - ax) * (ay - my) - (ax - mx) * (by - ay)) / math.hypot(bx - ax, by - ay)


TARGET = arm_thickness() / M_H       # stem as a share of cap height


def instance(wght):
    f = instantiateVariableFont(TTFont(FONT), {"wght": wght, "wdth": 100})
    buf = io.BytesIO(); f.save(buf)
    return f, buf.getvalue()


def outline(font, name):
    pen = RecordingPen(); font.getGlyphSet()[name].draw(pen); return pen.value


def stem_ratio(font):
    pts = [p for op, args in outline(font, "H") for p in args]
    xs = sorted({round(p[0]) for p in pts}); cap = max(p[1] for p in pts)
    return (xs[1] - xs[0]) / cap, cap


lo, hi = 300.0, 800.0
for _ in range(14):
    mid = (lo + hi) / 2
    r, _cap = stem_ratio(instance(mid)[0])
    lo, hi = (mid, hi) if r < TARGET else (lo, mid)
W_MAIN = round((lo + hi) / 2)
W_DS = 300                            # Light, the thinnest Open Sans has

f_main, b_main = instance(W_MAIN)
f_ds, b_ds = instance(W_DS)
ratio, CAP = stem_ratio(f_main)
UPM = f_main["head"].unitsPerEm
TRACK = 0.035 * UPM                   # even tracking on every letter
OVERSHOOT = 0.012                     # the mark's points pass cap line and baseline equally


def shape(data, font, text):
    face = hb.Face(data); hf = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hf, buf, {"kern": True})
    order = font.getGlyphOrder()
    return [(order[i.codepoint], p.x_advance) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]


def bbox(font, name):
    pts = [p for op, args in outline(font, name) for p in args]
    return min(p[0] for p in pts), max(p[0] for p in pts)


# ---- layout in font units, y up, baseline 0
letters, mark = [], None            # letters: (font, glyph, x)
x = 0.0
k = CAP * (1 + 2 * OVERSHOOT) / M_H  # mark scale into font units
mark_w = M_W * k
for name, adv in shape(b_main, f_main, "NORTHSTAR"):
    if name == "A":
        x0, x1 = bbox(f_main, "A")
        grow = mark_w - (x1 - x0)
        mark = x + (x0 + x1) / 2 + grow / 2      # centre line of the mark
        x += adv + grow + TRACK
    else:
        letters.append((f_main, name, x)); x += adv + TRACK
x += f_main["hmtx"]["space"][0] * 0.8
for name, adv in shape(b_ds, f_ds, "DS"):
    letters.append((f_ds, name, x)); x += adv + TRACK

# ---- to SVG units: cap height = 200, tight box
S = 200 / CAP
xmin = min(px + bbox(f, n)[0] for f, n, px in letters)
xmax = max(px + bbox(f, n)[1] for f, n, px in letters)
top = CAP * (1 + OVERSHOOT)
# round letters dip below the baseline a little; take the real extent
ymin = min(p[1] for f, n, _ in letters for op, a in outline(f, n) for p in a)
ymax = max(max(p[1] for f, n, _ in letters for op, a in outline(f, n) for p in a), top)
ymin = min(ymin, -CAP * OVERSHOOT)
fx = lambda v: round((v - xmin) * S, 2)
fy = lambda v: round((ymax - v) * S, 2)
num = lambda v: ("%.2f" % v).rstrip("0").rstrip(".")


def glyph_d(font, name, px):
    d = []
    for op, args in outline(font, name):
        c = {"moveTo": "M", "lineTo": "L", "qCurveTo": "Q", "curveTo": "C"}.get(op)
        if op in ("closePath", "endPath"):
            d.append("Z"); continue
        if op == "qCurveTo" and len(args) > 2:   # expand TrueType implied on-curve points
            pts = list(args); segs = []
            for i in range(len(pts) - 2):
                a, b = pts[i], pts[i + 1]
                segs.append((a, ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)))
            segs.append((pts[-2], pts[-1]))
            for ctrl, on in segs:
                d.append("Q" + " ".join(num(fx(px + p[0])) + " " + num(fy(p[1])) for p in (ctrl, on)))
            continue
        d.append(c + " ".join(num(fx(px + p[0])) + " " + num(fy(p[1])) for p in args))
    return "".join(d)


def mark_d(points):
    out = []
    for mx, my in points:
        ux = mark + (mx - M_CX) * k
        uy = top - (my - M_TOP) * k
        out.append(num(fx(ux)) + " " + num(fy(uy)))
    return "M" + "L".join(out) + "Z"


main_d = " ".join(glyph_d(f, n, px) for f, n, px in letters if f is f_main)
ds_d = " ".join(glyph_d(f, n, px) for f, n, px in letters if f is f_ds)
W = num(round((xmax - xmin) * S, 2)); H = num(round((ymax - ymin) * S, 2))

VERSIONS = {  # name: (letters and chevron, diamond)
    "dark": ("#FFFFFF", "#27BDFA"),        # on navy: the original sky blue
    "light": ("#191932", "#023AFF"),       # on white: sky blue is 2.1:1, blue-500 holds
    "on-blue": ("#FFFFFF", "#01F1E3"),     # on blue-500: teal-500 stays visible
    "mono": ("currentColor", "currentColor"),
}
for name, (ink, gem) in VERSIONS.items():
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
           f'role="img" aria-label="NorthStar DS"><title>NorthStar DS</title>'
           f'<g fill="{ink}"><path id="northst-r" d="{main_d}"/>'
           f'<path id="a-chevron" d="{mark_d(CHEVRON)}"/>'
           f'<path id="ds" d="{ds_d}"/></g>'
           f'<path id="a-star" fill="{gem}" d="{mark_d(DIAMOND)}"/></svg>\n')
    (OUT / f"northstar-ds-wordmark-{name}.svg").write_text(svg)

print(f"arm/cap target {TARGET:.4f}  solved wght {W_MAIN} (stem/cap {ratio:.4f})  DS wght {W_DS}")
print(f"viewBox 0 0 {W} {H}  mark centre x {num(fx(mark))}  mark width {num(mark_w * S)}")
