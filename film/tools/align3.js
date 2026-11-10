const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, sh] of [[1600, 900], [1280, 800], [1920, 1080]]) {
    const p = await b.newPage({ viewport: { width: w, height: sh } });
    await p.goto('http://127.0.0.1:8979/index.html#/', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2500);
    console.log(w, JSON.stringify(await p.evaluate(() => { const h = document.querySelector('.hero__brand').getBoundingClientRect(), f = document.querySelector('.hm-film-bg').getBoundingClientRect(); return { headingTop: Math.round(h.top), filmTop: Math.round(f.top), diff: Math.round(f.top - h.top) }; })));
    if (w === 1600) await p.screenshot({ path: 'shots/align.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
