// Screenshots the home hero at desktop and phone widths, and reports console errors and video state.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [name, w, h] of [['desk', 1600, 900], ['phone', 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('http://localhost:8960/site/index.html#/'); await p.waitForTimeout(2200);
    const v = await p.evaluate(() => { const f = document.querySelector('[data-film]'); return f ? { paused: f.paused, ready: f.readyState, err: f.error && f.error.code, w: f.videoWidth } : null; });
    console.log(name, 'video', JSON.stringify(v), 'errors', errs.length, errs.slice(0, 3).join(' | '));
    await p.screenshot({ path: 'shots/hero-' + name + '.jpg', type: 'jpeg', quality: 90 });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
