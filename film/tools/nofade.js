// Checks the staged live-folder copy: film position, mask, and light mark visibility.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://127.0.0.1:8976/northstar/index.html#/'); await p.waitForTimeout(3000);
  console.log(JSON.stringify(await p.evaluate(() => { const bg = document.querySelector('.hm-film-bg'), cs = getComputedStyle(bg), r = bg.getBoundingClientRect(); return { rect: [r.left, r.top, r.right, r.bottom].map(Math.round), mask: cs.maskImage === 'none' || cs.maskImage === '' ? 'none' : 'set', lightMark: getComputedStyle(document.querySelector('.hero-rays__mark')).display, playing: !document.querySelector('[data-film]').paused }; })), 'errors', errs.length);
  await p.screenshot({ path: 'shots/nofade.jpg', type: 'jpeg', quality: 88 });
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
