// Finds the element that draws the cyan frame around the docs page copy.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://127.0.0.1:8986/index.html#/foundations/how-tokens-work', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2000);
  console.log(JSON.stringify(await p.evaluate(() => {
    const out = []; let el = document.elementFromPoint(700, 300);
    for (let n = el, i = 0; n && i < 14; n = n.parentElement, i++) {
      const cs = getComputedStyle(n);
      const hit = [cs.outlineStyle !== 'none' && 'outline:' + cs.outlineColor, cs.boxShadow !== 'none' && 'shadow:' + cs.boxShadow.slice(0, 80), cs.borderLeftStyle !== 'none' && 'bl:' + cs.borderLeftColor + ' ' + cs.borderLeftWidth, cs.borderTopStyle !== 'none' && 'bt:' + cs.borderTopColor].filter(Boolean);
      if (hit.length) out.push({ tag: n.tagName, cls: String(n.className).slice(0, 60), id: n.id, hit });
    }
    return out;
  })));
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
