const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://localhost:8960/site/index.html#/'); await p.waitForTimeout(2500);
  console.log(JSON.stringify(await p.evaluate(() => {
    const bg = document.querySelector('.hm-film-bg'), v = document.querySelector('[data-film]');
    const r = bg && bg.getBoundingClientRect(), cs = bg && getComputedStyle(bg);
    const h = document.documentElement; return { theme: h.dataset.theme, display: cs && cs.display, w: cs && cs.width, pos: cs && cs.position, raysW: getComputedStyle(document.querySelector('.hero-rays')).width, inRays: !!(bg && bg.parentElement.classList.contains('hero-rays')), kids: [...document.querySelector('.hero-rays').children].map((c) => c.tagName + '.' + c.className), rect: r && [r.x, r.y, r.width, r.height].map(Math.round), z: cs && cs.zIndex, blend: cs && cs.mixBlendMode, v: v && [v.paused, v.currentTime, v.readyState, v.videoWidth] };
  })));
  await b.close();
})();
