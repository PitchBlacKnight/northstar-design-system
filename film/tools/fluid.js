// Fluid hero check at three widths: film versus copy and container edges, card bottom versus stats, plus screenshots.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, h] of [[1920, 1080], [1600, 900], [1280, 800]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('http://127.0.0.1:8984/index.html#/', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(2500);
    console.log(w, JSON.stringify(await p.evaluate(() => { const R = (s) => document.querySelector(s).getBoundingClientRect(); const c = R('.hm-hero__copy'), f = R('.hm-film-bg'), g = R('.hm-hero__grid'), k = R('.hm-film-card'), st = R('.hm-stats'); return { copyRight: Math.round(c.right), filmLeft: Math.round(f.left), filmRight: Math.round(f.right), gridRight: Math.round(g.right), filmTop: Math.round(f.top), headTop: Math.round(R('.hero__brand').top), cardBottom: Math.round(k.bottom), statsBottom: Math.round(st.bottom), clear: f.left >= c.right }; })), 'errors', errs.length);
    if (w === 1920) await p.screenshot({ path: 'shots/fluid-1920.jpg', type: 'jpeg', quality: 88 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
