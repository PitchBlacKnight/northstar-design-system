const { chromium } = require('playwright');
(async () => {
  console.log('launch'); const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  p.on('pageerror', (e) => console.log('pageerror', e.message));
  console.log('goto'); await p.goto('http://127.0.0.1:8979/index.html#/', { waitUntil: 'domcontentloaded', timeout: 20000 }); console.log('dcl');
  await p.waitForTimeout(2500);
  console.log('eval', JSON.stringify(await p.evaluate(() => { const h = document.querySelector('.hero__brand'); const f = document.querySelector('.hm-film-bg'); return { h: !!h, f: !!f, ftop: f && f.style.top }; })));
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
