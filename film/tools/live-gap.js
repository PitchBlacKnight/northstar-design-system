// Loads the staged live-folder copy of the NorthStar site and checks the hero film.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); const pre = {};
  const errs = [], bad = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('response', (r) => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().split('/').slice(-2).join('/')); });
  await p.goto('https://mikelrosenthal.com/northstar/index.html#/'); await p.waitForTimeout(3000);
  console.log(JSON.stringify(await p.evaluate(() => { const f = document.querySelector('[data-film]'), bg = document.querySelector('.hm-film-bg'); return { film: !!f, playing: f && !f.paused, ready: f && f.readyState, w: f && f.videoWidth, inRays: !!(bg && bg.parentElement.classList.contains('hero-rays')), markHidden: getComputedStyle(document.querySelector('.hero-rays__mark')).display }; })));
  console.log('page errors', errs.length, errs[0] || '', '| bad responses', bad.length, bad.join(', '));
  await p.screenshot({ path: 'shots/live-gap.jpg', type: 'jpeg', quality: 88 });
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
