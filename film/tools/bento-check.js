// Bento hero check: copy vs film overlap at three widths, plus a screenshot at 1600.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, sh] of [[1600, 900], [1280, 800], [1920, 1080]]) {
    const p = await b.newPage({ viewport: { width: w, height: sh } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('http://127.0.0.1:8983/index.html#/', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2500);
    console.log(w, JSON.stringify(await p.evaluate(() => {
      const R = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) }; };
      const copy = document.querySelector('.hm-hero__copy').getBoundingClientRect();
      const film = R('.hm-film-bg'), card = R('.hm-film-card');
      const copyRight = Math.round(copy.right), copyBottom = Math.round(copy.bottom);
      return { copyRight, copyBottom, film, card, filmClearOfCopy: film ? film.l >= copyRight : null, cardClearOfCopy: card ? card.l >= copyRight : null, ctl: R('.hm-film__ctl') };
    })), 'errors', errs.length);
    if (w === 1600) await p.screenshot({ path: 'shots/bento-hero.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
