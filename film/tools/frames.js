// Two framed-screen options for the hero film, injected as CSS on the live local page. node frames.js
const { chromium } = require('playwright');
const BASE = `.hm-film-bg{mask-image:none!important;-webkit-mask-image:none!important;box-sizing:border-box;width:600px!important;right:40px!important;top:28px!important;overflow:hidden}
.hm-film-bg video{border-radius:0}`;
const OPTS = {
  // A: browser window. Title bar with traffic lights and an address pill, screen beneath it.
  a: `${BASE}
.hm-film-bg{padding-top:38px;border-radius:14px;background:#0d0d1c;box-shadow:0 0 0 1px #ffffff1f,0 40px 90px -30px #000}
.hm-film-bg::before{content:"";position:absolute;left:0;right:0;top:0;height:38px;background:#15152b;border-bottom:1px solid #ffffff14;z-index:2;
  background-image:radial-gradient(circle at 16px 19px,#ff5f57 4px,transparent 4.5px),radial-gradient(circle at 32px 19px,#febc2e 4px,transparent 4.5px),radial-gradient(circle at 48px 19px,#28c840 4px,transparent 4.5px)}
.hm-film-bg::after{content:"northstar.design-system";position:absolute;left:50%;top:9px;transform:translateX(-30%);width:300px;height:20px;border-radius:6px;background:#05050f;color:#9a9ac4;font:400 12px/20px "Open Sans",sans-serif;text-align:center;z-index:3}`,
  // B: device bezel. Thick rounded housing with a glossy edge, screen inside.
  b: `${BASE}
.hm-film-bg{padding:16px;border-radius:30px;background:linear-gradient(160deg,#2a2a44,#0b0b18 45%,#1c1c33);box-shadow:inset 0 0 0 1.5px #ffffff26,inset 0 0 0 4px #05050f,0 50px 100px -30px #000}
.hm-film-bg video{border-radius:16px}`,
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const k of Object.keys(OPTS)) {
    const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
    await p.goto('http://localhost:8960/site/index.html#/'); await p.waitForTimeout(1500);
    await p.addStyleTag({ content: OPTS[k] });
    await p.evaluate(() => document.querySelector('[data-film]').play());
    await p.waitForFunction(() => document.querySelector('[data-film]').currentTime >= 12, null, { timeout: 60000, polling: 200 });
    await p.waitForTimeout(300);
    await p.screenshot({ path: 'shots/frame-' + k + '.jpg', type: 'jpeg', quality: 90 }); console.log('shot', k);
    await p.close();
  }
  await b.close();
})().catch((e) => { console.log('ERR', e.message.split('\n')[0]); process.exit(1); });
