/* Shared film runtime: fits the 1920x1080 stage to the window, builds dashboard
   frames, and exposes window.__film for the frame-by-frame renderer. */
(function () {
  const stage = document.querySelector(".stage");
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  };
  addEventListener("resize", fit); fit();

  // A dashboard frame: the real layout page at 1600x900, scaled into its box.
  window.dash = (id, cls = "") => {
    const el = document.createElement("div");
    el.className = "dash " + cls;
    el.innerHTML = `<iframe src="ns/dashboards/${id}.html" scrolling="no" tabindex="-1" loading="eager"></iframe>`;
    return el;
  };

  window.setTheme = (theme) => document.querySelectorAll(".dash iframe").forEach((f) => {
    try { f.contentDocument.documentElement.dataset.theme = theme; } catch (e) {}
  });

  window.film = (tl) => {
    const render = new URLSearchParams(location.search).has("render");
    tl.pause(0);
    window.__film = { duration: tl.duration(), seek: (t) => tl.seek(t, false) };
    const ready = () => Promise.all([...document.querySelectorAll("iframe")].map((f) =>
      f.contentDocument && f.contentDocument.readyState === "complete" ? 1 : new Promise((r) => f.addEventListener("load", r, { once: true }))));
    ready().then(() => document.fonts.ready).then(() => {
      window.__ready = true;
      if (!render) tl.play(0);
    });
    if (!render) addEventListener("click", () => tl.restart());
  };
})();
