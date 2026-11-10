// Home hero shots while the film plays in real time. node hero2.js 5 12 24 ...
// (python http.server has no range support, so the video cannot be seeked here; Vercel serves ranges.)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:8960/site/index.html#/'); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('[data-film]').play());
  for (const t of process.argv.slice(2)) {
    await p.waitForFunction((t) => document.querySelector('[data-film]').currentTime >= t, +t, { timeout: 60000, polling: 200 });
    await p.screenshot({ path: 'shots/bg-' + t + '.jpg', type: 'jpeg', quality: 90 }); console.log('shot', t);
  }
  console.log('errors', errs.length, errs[0] || '');
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
