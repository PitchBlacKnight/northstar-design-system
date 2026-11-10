// Frame-by-frame film renderer.
//   node render.js <url> <out.mp4> [fps]          -> MP4 via ffmpeg
//   STILLS=1.5,9,20 node render.js <url> <out.png> -> PNG stills at those seconds
// Watchdog: any single step over 20s exits with code 2 and logs where it stuck,
// so a hang shows up in the log within seconds instead of sitting silent.
const { chromium } = require('playwright'); const { spawn } = require('child_process');
let step = 'start', last = Date.now();
const mark = (s) => { step = s; last = Date.now(); };
setInterval(() => { if (Date.now() - last > 20000) { console.log('HANG at', step); process.exit(2); } }, 2000).unref();
(async () => {
  const [url, out, fpsArg] = process.argv.slice(2); const fps = +fpsArg || 30;
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  mark('load'); await p.goto(url + '?render'); await p.waitForFunction(() => window.__ready, null, { timeout: 60000, polling: 250 });
  await p.waitForTimeout(1200);
  const dur = await p.evaluate(() => window.__film.duration); console.log('ready, duration', dur);
  const frame = async (t) => { mark('seek ' + t.toFixed(2)); await p.evaluate((t) => new Promise((r) => { window.__film.seek(t); requestAnimationFrame(() => requestAnimationFrame(() => r(1))); }), t); };
  if (process.env.STILLS) {
    for (const t of process.env.STILLS.split(',').map(Number)) {
      await frame(0); await frame(t); await p.waitForTimeout(300); mark('shot ' + t);
      await p.screenshot({ path: out.replace('.png', '-' + t + '.png') }); console.log('still', t);
    }
    await b.close(); process.exit(0);
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out]);
  const n = Math.ceil(dur * fps);
  for (let i = 0; i <= n; i++) {
    await frame(i / fps); mark('shot frame ' + i);
    ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 }));
    if (i % 60 === 0) console.log('frame', i, '/', n);
  }
  mark('encode'); ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('done', out, n, 'frames'); process.exit(0);
})().catch((e) => { console.log('ERROR at', step, e.message.split('\n')[0]); process.exit(1); });
