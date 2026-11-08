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
      /* Compare 2x2 block averages: sub-pixel text anti-aliasing jitter between runs averages out, while a
         real change (color, size, position, missing element) still moves whole blocks. */
      const out = new ImageData(w, h); let n = 0, blocks = 0;
      const avg = (img, bx, by, c) => { let s = 0; for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) s += img.data[((t.y + by + dy) * img.width + (t.x + bx + dx)) * 4 + c]; return s / 4; };
      for (let by = 0; by + 1 < h; by += 2) for (let bx = 0; bx + 1 < w; bx += 2) {
        blocks++;
        const d = Math.max(Math.abs(avg(a, bx, by, 0) - avg(b, bx, by, 0)), Math.abs(avg(a, bx, by, 1) - avg(b, bx, by, 1)), Math.abs(avg(a, bx, by, 2) - avg(b, bx, by, 2)));
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
          const i = ((t.y + by + dy) * a.width + (t.x + bx + dx)) * 4, o = ((by + dy) * w + (bx + dx)) * 4;
          if (d > 40) { out.data[o] = 255; out.data[o + 1] = 0; out.data[o + 2] = 60; out.data[o + 3] = 255; }
          else { const g = (b.data[i] + b.data[i + 1] + b.data[i + 2]) / 3; out.data[o] = out.data[o + 1] = out.data[o + 2] = g; out.data[o + 3] = 70; }
        }
        if (d > 40) n++;
      }
      const pct = (n / Math.max(blocks, 1)) * 100;
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
