// Checks the docs page container has no outline after navigation, and shoots How tokens work.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://127.0.0.1:8988/index.html#/components', { waitUntil: 'domcontentloaded', timeout: 20000 }); await p.waitForTimeout(1200);
  await p.evaluate(() => { location.hash = '#/foundations/how-tokens-work'; }); await p.waitForTimeout(1500);
  console.log(JSON.stringify(await p.evaluate(() => { const m = document.getElementById('main-content'); return { focused: document.activeElement === m, outline: getComputedStyle(m).outlineStyle }; })));
  await p.screenshot({ path: 'shots/noframe.jpg', type: 'jpeg', quality: 88 });
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
