const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://127.0.0.1:8960/tools/layouts/index.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForTimeout(2500);
  const secs = await p.$$('section.opt');
  for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: `shots/layout-${i + 1}.jpg`, type: 'jpeg', quality: 88 });
  console.log('shots', secs.length);
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
