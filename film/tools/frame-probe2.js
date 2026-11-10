// Checks pseudo-elements on the shell, main and page wrappers for a visible cyan frame.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://127.0.0.1:8986/index.html#/foundations/how-tokens-work', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2000);
  console.log(JSON.stringify(await p.evaluate(() => {
    const res = [];
    for (const sel of ['.shell', '.shell > .main', '.main', '.prose', '.art', 'main', 'body', 'html']) {
      const e = document.querySelector(sel); if (!e) continue;
      for (const ps of ['::before', '::after']) {
        const cs = getComputedStyle(e, ps);
        if (cs.content && cs.content !== 'none' && cs.content !== 'normal') res.push({ sel, ps, content: cs.content.slice(0, 20), pos: cs.position, inset: [cs.top, cs.left, cs.right, cs.bottom].join('/'), border: cs.borderTopColor + ' ' + cs.borderTopWidth + ' ' + cs.borderTopStyle, outline: cs.outlineStyle + ' ' + cs.outlineColor, shadow: cs.boxShadow.slice(0, 90), bg: cs.backgroundImage.slice(0, 60) });
      }
      const cs = getComputedStyle(e);
      if (cs.outlineStyle !== 'none' || cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') res.push({ sel, self: true, outline: cs.outlineStyle + ' ' + cs.outlineColor, border: cs.borderTopColor + ' ' + cs.borderTopWidth + ' ' + cs.borderTopStyle });
    }
    return res;
  })));
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
