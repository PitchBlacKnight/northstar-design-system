"""Writes the logo into a NorthStar docs checkout: js/logo.js and assets/logo/*.

Run: uv run --with fonttools --with uharfbuzz --with shapely build_site.py /dir/with/fonts /path/to/northstar-repo
One geometry source (build_faces.py head) feeds the JS component and every file.
"""
import sys
from pathlib import Path

HERE = Path(__file__).parent
exec((HERE / "build_faces.py").read_text().split("FACES = [")[0])   # mark geometry and font helpers

REPO = Path(sys.argv[2])
LOGO = REPO / "assets" / "logo"
FONT = FONTS / "OpenSans-VF.ttf"
SKY, NAVY, BLUE, TEAL = "#27BDFA", "#191932", "#023AFF", "#01F1E3"


def spark(cx, cy, R, r):
    return "M" + "L".join(f"{num(cx + x)} {num(cy + y)}" for x, y in
                          [(0, -R), (r, -r), (R, 0), (r, r), (0, R), (-r, r), (-R, 0), (-r, -r)]) + "Z"


# ---------- the mark, tight box
pts = BODY + STAR
x0 = min(p[0] for p in pts); y0 = min(p[1] for p in pts)
MW = max(p[0] for p in pts) - x0; MH = max(p[1] for p in pts) - y0
md = lambda P: "M" + "L".join(num(x - x0) + " " + num(y - y0) for x, y in P) + "Z"
STAR_CY = APEX + STAR_DROP - 14
mark = dict(box=[num(MW), num(MH)], chevron=md(BODY), star=md(STAR),
            glint=spark(CX - x0, STAR_CY - y0, 170, 9), rise=90)

# ---------- the wordmark: NORTHSTAR at the chevron's weight, DS Light
lo, hi = 300.0, 800.0
for _ in range(12):
    mid = (lo + hi) / 2
    r, _c = stem_ratio(instance(FONT, {"wght": mid, "wdth": 100})[0])
    lo, hi = (mid, hi) if r < TARGET else (lo, mid)
W_MATCH = round((lo + hi) / 2)
f_main, b_main = instance(FONT, {"wght": W_MATCH, "wdth": 100})
f_ds, b_ds = instance(FONT, {"wght": 300, "wdth": 100})
CAP = extent(f_main, "H")[3]
TRACK = 0.035 * 2048
k = CAP / CH_H
letters, mx, x = [], None, 0.0
for name, adv in shape(b_main, f_main, "NORTHSTAR"):
    if name == "A":
        a0, a1, _, _ = extent(f_main, "A")
        grow = CH_W * k - (a1 - a0)
        mx = x + (a0 + a1) / 2 + grow / 2
        x += adv + grow + TRACK
    else:
        letters.append((f_main, name, x)); x += adv + TRACK
x += CAP * 0.42
for name, adv in shape(b_ds, f_ds, "DS"):
    letters.append((f_ds, name, x)); x += adv + TRACK
S = 200 / CAP
ex = [(px, extent(f, n)) for f, n, px in letters]
xmin = min(px + e[0] for px, e in ex); xmax = max(px + e[1] for px, e in ex)
ymin = min(e[2] for _, e in ex)
ymax = max(max(e[3] for _, e in ex), CAP + (APEX - STAR_TOP) * k)
fx = lambda v: round((v - xmin) * S, 2)
fy = lambda v: round((ymax - v) * S, 2)
gd = lambda f, n, px: "".join(op[0] + " ".join(num(fx(px + p[0])) + " " + num(fy(p[1])) for p in op[1]) for op in ops(f, n))
wm = lambda P: "M" + "L".join(num(fx(mx + (a - CX) * k)) + " " + num(fy(CAP - (b - APEX) * k)) for a, b in P) + "Z"
ks = k * S
word = dict(box=[num((xmax - xmin) * S), num((ymax - ymin) * S)],
            letters=" ".join(gd(f, n, px) for f, n, px in letters if f is f_main),
            ds=" ".join(gd(f, n, px) for f, n, px in letters if f is f_ds),
            chevron=wm(BODY), star=wm(STAR),
            glint=spark(fx(mx), fy(CAP - (STAR_CY - APEX) * k), 170 * ks, 9 * ks), rise=round(90 * ks))

# ---------- js/logo.js
obj = lambda d: "{ box: [%s, %s], rise: %s,\n      %s }" % (
    d["box"][0], d["box"][1], d["rise"],
    ",\n      ".join(f'{key}: "{d[key]}"' for key in ("letters", "ds", "chevron", "star", "glint") if key in d))
(REPO / "js" / "logo.js").write_text(f"""/* The logo component. Every screen draws the logo from this file: the header, the home hero,
   the dashboard rail and the Logo page. Files for use outside the site are in assets/logo.

   To use your own logo: replace the path data in NS.LOGO (and its name), then replace the files
   in assets/logo, keeping their names. Nothing else on the site needs to change.

   Generated from the logo source; chevron and letters take the text color (currentColor),
   the star takes NS.LOGO.color and turns to the action blue in the light theme. */
(function () {{
  const NS = (window.NS = window.NS || {{}});
  const L = (NS.LOGO = {{
    name: "NorthStar DS",
    color: "{SKY}",
    mark: {obj(mark)},
    wordmark: {obj(word)},
  }});
  const draw = (p, kind, cls, label, live) =>
    `<svg class="ns-logo ns-logo--${{kind}}${{live ? " ns-logo--live" : ""}}${{cls ? " " + cls : ""}}" viewBox="0 0 ${{p.box[0]}} ${{p.box[1]}}" ${{label ? `role="img" aria-label="${{label}}"` : 'aria-hidden="true"'}} style="--ns-logo-rise:${{p.rise}}px" xmlns="http://www.w3.org/2000/svg">` +
    (p.letters ? `<path class="ns-logo__word" fill="currentColor" d="${{p.letters}}"/><path class="ns-logo__ds" fill="currentColor" d="${{p.ds}}"/>` : "") +
    `<path class="ns-logo__chevron" fill="currentColor" d="${{p.chevron}}"/><path class="ns-logo__star" fill="${{L.color}}" d="${{p.star}}"/>` +
    (live ? `<path class="ns-logo__glint" fill="currentColor" opacity="0" d="${{p.glint}}"/>` : "") + "</svg>";
  /* cls: extra class. label: accessible name, empty when the parent already names it. live: Rise on load, one twinkle, twinkle again on hover. */
  NS.logoSvg = (cls = "", label = "", live = false) => draw(L.mark, "mark", cls, label, live);
  NS.wordmarkSvg = (cls = "", label = L.name, live = false) => draw(L.wordmark, "word", cls, label, live);
}})();
""")

# ---------- assets/logo
LOGO.mkdir(parents=True, exist_ok=True)
VERS = {"": ("#FFFFFF", SKY), "-light": (NAVY, BLUE), "-on-blue": ("#FFFFFF", TEAL), "-mono": ("currentColor", "currentColor")}
head = lambda d, name: (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {d["box"][0]} {d["box"][1]}" '
                        f'width="{d["box"][0]}" height="{d["box"][1]}" role="img" aria-label="{name}"><title>{name}</title>')
for suf, (ink, gem) in VERS.items():
    (LOGO / f"northstar-mark{suf}.svg").write_text(
        head(mark, "NorthStar") + f'<path fill="{ink}" d="{mark["chevron"]}"/><path fill="{gem}" d="{mark["star"]}"/></svg>\n')
    (LOGO / f"northstar-ds-wordmark{suf}.svg").write_text(
        head(word, "NorthStar DS") + f'<g fill="{ink}"><path d="{word["letters"]}"/><path d="{word["ds"]}"/>'
        f'<path d="{word["chevron"]}"/></g><path fill="{gem}" d="{word["star"]}"/></svg>\n')

# animated mark for use outside the site: Rise once, then a slow twinkle loop. 600 stage, room for the glint
TX, TY = 300 - MW / 2, 300 - MH / 2
ANIM = """
.s{transform-box:fill-box;transform-origin:50% 62%;animation:rise 1.1s cubic-bezier(.3,0,.2,1) .3s both,pulse 7.2s ease-in-out 3s infinite}
.c{animation:chev .8s cubic-bezier(.16,1,.3,1) both}
.g{transform-box:fill-box;transform-origin:center;animation:glint .8s ease-out 1.25s both,twinkle 7.2s ease-out 3s infinite}
@keyframes chev{from{opacity:0;transform:translateY(28px)}}
@keyframes rise{0%{opacity:0;transform:translateY(90px) scale(.45)}35%{opacity:1}72%{transform:translateY(-14px) scale(1.06)}100%{transform:none}}
@keyframes glint{0%{opacity:0;transform:scale(0)}35%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.25) rotate(45deg)}}
@keyframes pulse{0%,80%,100%{transform:none}88%{transform:translateY(-9px) scale(1.13)}94%{transform:translateY(1px) scale(.98)}}
@keyframes twinkle{0%,81%{opacity:0;transform:scale(0)}88%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(.25) rotate(45deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
"""
for suf, (ink, gem) in (("", ("#FFFFFF", SKY)), ("-light", (NAVY, BLUE))):
    (LOGO / f"northstar-mark-animated{suf}.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="NorthStar">'
        f'<title>NorthStar</title><style>{ANIM}</style><g transform="translate({num(TX)} {num(TY)})">'
        f'<path class="c" fill="{ink}" d="{mark["chevron"]}"/><path class="s" fill="{gem}" d="{mark["star"]}"/>'
        f'<path class="g" fill="{ink if suf == "" else gem}" opacity="0" d="{mark["glint"]}"/></g></svg>\n')

# favicon: the mark on a navy tile so it holds on light and dark browser chrome
fs = 44 / MH; ox, oy = (64 - MW * fs) / 2, (64 - MH * fs) / 2
(LOGO / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="' + NAVY + '"/>'
    f'<g transform="translate({num(ox)} {num(oy)}) scale({fs:.4f})"><path fill="#FFFFFF" d="{mark["chevron"]}"/>'
    f'<path fill="{SKY}" d="{mark["star"]}"/></g></svg>\n')
print("wordmark", word["box"], "mark", mark["box"], "weight", W_MATCH, "rise", word["rise"])
