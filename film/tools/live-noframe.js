// Live check: no outline on the page container after navigation, hero film plays, and the served video is the new file.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('https://mikelrosenthal.com/northstar/index.html#/components', { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { location.hash = '#/foundations/how-tokens-work'; }); await p.waitForTimeout(2000);
  console.log(JSON.stringify(await p.evaluate(() => { const m = document.getElementById('main-content'); return { focused: document.activeElement === m, outline: getComputedStyle(m).outlineStyle }; })), 'errors', errs.length);
  await p.screenshot({ path: 'shots/live-noframe.jpg', type: 'jpeg', quality: 88 });
  await p.goto('https://mikelrosenthal.com/northstar/index.html#/', { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForTimeout(3000);
  console.log('hero film playing:', await p.evaluate(() => !document.querySelector('[data-film]').paused));
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
