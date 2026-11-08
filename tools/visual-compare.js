/* Loaded by tools/visual-check.mjs. For each screenshot pair, compares every tile region on a canvas and
   posts a diff image (changed pixels in red over a faded copy) for tiles that moved. */
(async () => {
  const load = (src) => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = "/" + src + "?t=" + Math.random(); });
  const px = (img) => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height); };
  const changed = []; let tiles = 0;
  for (const job of window.__jobs) {
    let a, b;
    try { a = px(await load(job.base)); b = px(await load(job.cur)); } catch { changed.push({ shot: job.name, name: "(image failed to load)", pct: 100 }); continue; }
    for (const t of job.tiles) {
      tiles++;
      const w = Math.min(t.w, a.width - t.x, b.width - t.x), h = Math.min(t.h, a.height - t.y, b.height - t.y);
      if (w <= 0 || h <= 0 || a.width !== b.width || a.height !== b.height) { changed.push({ shot: job.name, name: t.name, pct: 100 }); continue; }
      const out = new ImageData(w, h); let n = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = ((t.y + y) * a.width + (t.x + x)) * 4, o = (y * w + x) * 4;
        const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2]));
        if (d > 40) { n++; out.data[o] = 255; out.data[o + 1] = 0; out.data[o + 2] = 60; out.data[o + 3] = 255; }
        else { const g = (b.data[i] + b.data[i + 1] + b.data[i + 2]) / 3; out.data[o] = out.data[o + 1] = out.data[o + 2] = g; out.data[o + 3] = 70; }
      }
      const pct = (n / (w * h)) * 100;
      if (pct > 0.3) {
        changed.push({ shot: job.name, name: t.name, pct: +pct.toFixed(2) });
        const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").putImageData(out, 0, 0);
        await fetch("/__save?name=" + encodeURIComponent(job.name + "--" + t.name + ".png"), { method: "POST", body: c.toDataURL("image/png") });
      }
    }
  }
  const o = document.createElement("script"); o.type = "application/json"; o.id = "ns-visual-result";
  o.textContent = JSON.stringify({ tiles, changed });
  document.body.appendChild(o);
})();
