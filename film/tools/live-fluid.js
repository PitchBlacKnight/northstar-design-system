// Live fluid hero check at 1920, 1600, 1280 and 1024.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, h] of [[1920, 1080], [1600, 900], [1280, 800], [1024, 768]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('https://mikelrosenthal.com/northstar/index.html#/', { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForTimeout(3000);
    console.log(w, JSON.stringify(await p.evaluate(() => { const R = (s) => document.querySelector(s).getBoundingClientRect(); const c = R('.hm-hero__copy'), f = R('.hm-film-bg'), g = R('.hm-hero__grid'); const stacked = f.top >= c.bottom - 1; return { layout: stacked ? 'stacked' : 'side-by-side', clear: stacked || f.left >= c.right, filmRight: Math.round(f.right), gridRight: Math.round(g.right), sidewaysScroll: document.documentElement.scrollWidth > innerWidth, playing: !document.querySelector('[data-film]').paused }; })), 'errors', errs.length);
    if (w === 1920) await p.screenshot({ path: 'shots/live-fluid.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
