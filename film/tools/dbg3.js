const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://localhost:8960/site/index.html#/'); await p.waitForTimeout(2500);
  for (const t of [4, 11, 24]) {
    const r = await p.evaluate((t) => new Promise((res) => { const f = document.querySelector('[data-film]'); f.pause(); f.onseeked = () => { const c = document.createElement('canvas'); c.width = 64; c.height = 36; const x = c.getContext('2d'); x.drawImage(f, 0, 0, 64, 36); const d = x.getImageData(0, 0, 64, 36).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; res({ ct: f.currentTime, sum: s, rect: [...f.getBoundingClientRect().toJSON ? Object.values(f.getBoundingClientRect().toJSON()).map(Math.round) : []] }); }; f.currentTime = t; }), t);
    console.log(t, JSON.stringify(r));
  }
  await b.close();
})();
