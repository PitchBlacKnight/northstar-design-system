// Measures the header, rays box and film top at a few widths.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const w of [1600, 1280, 1920]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto('http://127.0.0.1:8961/index.html#/'); await p.waitForTimeout(2000);
    console.log(w, JSON.stringify(await p.evaluate(() => {
      const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
      const hdr = document.querySelector('.hdr'), rays = document.querySelector('.hero-rays'), bg = document.querySelector('.hm-film-bg');
      return { hdr: r('.hdr'), rays: r('.hero-rays'), film: r('.hm-film-bg'), raysPos: getComputedStyle(rays).position, filmTopCss: getComputedStyle(bg).top, hdrPos: hdr && getComputedStyle(hdr).position, scrollY: scrollY };
    })));
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
