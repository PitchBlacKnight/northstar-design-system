"""Updates the NorthStar share image (assets/og-northstar.jpg) to the new logo, in place.

Run: uv run --with fonttools --with uharfbuzz --with shapely --with pillow build_og.py /fonts old.jpg wordmark.png out.jpg
The image is a flat composite with no source file, so this edits pixels:
  1. removes the old icon and wordmark (fills from the rows above and below, the background is a smooth gradient)
  2. pastes the new wordmark, left edge on the existing text column
  3. on the large background mark: lifts the diamond out from under the chevron and puts the star on the tip
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops

HERE = Path(__file__).parent
exec((HERE / "build_faces.py").read_text().split("FACES = [")[0])   # CHEVRON, DIAMOND, STAR, GAP ...

old, word_png, out = sys.argv[2], sys.argv[3], sys.argv[4]
im = Image.open(old).convert("RGB"); W, H = im.size; px = im.load()

# ---- 1. erase the old lockup
X0, X1, Y0, Y1 = 50, 528, 134, 204
for x in range(X0, X1):
    a, b = px[x, Y0 - 1], px[x, Y1]
    for y in range(Y0, Y1):
        t = (y - Y0 + 1) / (Y1 - Y0 + 1)
        px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# ---- 3. the background mark. Measured in the old image: apex (607, 194.6), 1.70 px per mark unit
S, AX, AY, SS = 1.70, 607.0, 194.6, 4
to_px = lambda P: [((AX + (x - CX) * S) * SS, (AY + (y - APEX) * S) * SS) for x, y in P]


def mask(*polys):
    m = Image.new("L", (W * SS, H * SS), 0); d = ImageDraw.Draw(m)
    for P in polys: d.polygon(to_px(P), fill=255)
    return m.resize((W, H), Image.LANCZOS)


card = Image.new("L", (W, H), 255); ImageDraw.Draw(card).rectangle([689, 0, W, H], fill=0)   # the cards sit on top
m_chev = mask(CHEVRON)
m_exp = ImageChops.multiply(mask(list(cut.exterior.coords)[:-1]), card)     # star plus its clear gap
m_star = ImageChops.multiply(mask(STAR), card)
m_old = mask(DIAMOND)

src = im.copy().load()
d_gem = tuple(src[607, 600][i] - src[520, 600][i] for i in range(3))         # diamond tint at the bottom
avg = lambda x, y: tuple(sum(src[min(max(x + k, 0), 686), y][i] for k in (-1, 0, 1)) / 3 for i in range(3))


def refill(y, L, R, alpha):
    """Rebuild row y between clean background samples at L and R; alpha(x) says how much to replace."""
    a, b = avg(L, y), avg(R, y)
    for x in range(L, R + 1):
        t = (x - L) / max(1, R - L); w = alpha(x)
        if w:
            p = px[x, y]
            px[x, y] = tuple(round(p[i] * (1 - w) + (a[i] + (b[i] - a[i]) * t) * w) for i in range(3))


expp, chevp, starp, oldp = m_exp.load(), m_chev.load(), m_star.load(), m_old.load()
for y in range(H):
    # the old diamond: plain background on both sides, so refill the whole span
    xs = [x for x in range(W) if oldp[x, y] > 0]
    if xs: refill(y, xs[0] - 5, xs[-1] + 5, lambda x: 1)
    # the tip: clear the star's footprint (and the chevron under it), sampling outside both
    xs = [x for x in range(W) if expp[x, y] > 0]
    if xs:
        cs = [x for x in range(W) if chevp[x, y] > 0] or xs
        L, R = min(xs[0], cs[0]) - 5, min(max(xs[-1], cs[-1]) + 5, 686)
        refill(y, L, R, lambda x: expp[x, y] / 255)
        for x in xs:
            w = starp[x, y] / 255
            if w:
                p = px[x, y]
                px[x, y] = tuple(max(0, min(255, round(p[i] + d_gem[i] * 1.25 * w))) for i in range(3))
# ---- last: new wordmark (rendered with cap top 8px below its top edge)
wm = Image.open(word_png).convert("RGBA")
im.paste(wm, (131, 143), wm)
im.save(out, quality=90)
