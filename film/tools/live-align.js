const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, sh] of [[1600, 900], [1280, 800]]) {
    const p = await b.newPage({ viewport: { width: w, height: sh } });
    await p.goto('https://mikelrosenthal.com/northstar/index.html#/', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2500);
    console.log(w, JSON.stringify(await p.evaluate(() => { const h = document.querySelector('.hero__brand').getBoundingClientRect(), f = document.querySelector('.hm-film-bg').getBoundingClientRect(); return { headingTop: Math.round(h.top), filmTop: Math.round(f.top), diff: Math.round(f.top - h.top) }; })));
    if (w === 1600) await p.screenshot({ path: 'shots/live-align.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
