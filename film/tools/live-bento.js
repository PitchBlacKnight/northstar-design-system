// Live hero check: copy versus film and card at 1600 and 1280, plus a screenshot.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const w of [1600, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('https://mikelrosenthal.com/northstar/index.html#/', { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForTimeout(3000);
    console.log(w, JSON.stringify(await p.evaluate(() => { const c = document.querySelector('.hm-hero__copy').getBoundingClientRect(), f = document.querySelector('.hm-film-bg').getBoundingClientRect(), k = document.querySelector('.hm-film-card').getBoundingClientRect(); return { copyRight: Math.round(c.right), filmLeft: Math.round(f.left), cardBottom: Math.round(k.bottom), clear: f.left >= c.right, tokenNumber: document.querySelector('.hm-film-card b').textContent }; })), 'errors', errs.length);
    if (w === 1600) await p.screenshot({ path: 'shots/live-bento.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
