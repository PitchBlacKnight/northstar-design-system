// Checks the live hero: film top against the header bottom.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('https://mikelrosenthal.com/northstar/index.html#/'); await p.waitForTimeout(3000);
  console.log(JSON.stringify(await p.evaluate(() => { const h = document.querySelector('.hdr').getBoundingClientRect().bottom, f = document.querySelector('.hm-film-bg').getBoundingClientRect().top; return { headerBottom: Math.round(h), filmTop: Math.round(f), gap: Math.round(f - h), playing: !document.querySelector('[data-film]').paused }; })));
  await p.screenshot({ path: 'shots/live-gap.jpg', type: 'jpeg', quality: 88 });
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
