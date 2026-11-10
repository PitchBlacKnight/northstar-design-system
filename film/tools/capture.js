// Captures docs-site pages as stills for the film. node capture.js  -> ../shots/<name>.jpg
// Each page has a 20s watchdog so a stuck page fails loudly instead of hanging.
const { chromium } = require('playwright');
const ROUTES = [
  ['home', ''], ['components', 'components', 'full'], ['button', 'components/button'], ['data-table', 'components/data-table'],
  ['color', 'foundations/color'], ['typography', 'foundations/typography'], ['tokens', 'foundations/tokens'], ['how-tokens', 'foundations/how-tokens-work'],
  ['motion', 'foundations/motion'], ['patterns', 'patterns/production'], ['forms', 'patterns/forms'], ['code', 'components/button/code'], ['spec', 'components/button/spec'], ['element-ref', 'getting-started/element-reference'], ['developers', 'getting-started/developers'], ['status', 'getting-started/component-status'], ['wcag', 'accessibility/wcag'], ['graphics', 'graphics/gallery'], ['floorplans', 'floorplans/'],
  ['charts', 'data-viz/charts', 'full'], ['contrast', 'accessibility/contrast'], ['token-editor', 'tools/token-editor'], ['builder', 'tools/live-builder'],
  ['ai', 'tools/ai'], ['changelog', 'changelog'], ['dashboards', 'dashboards'], ['cmdk', '', 'cmdk']];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.EXE, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
  require('fs').mkdirSync('../shots', { recursive: true });
  const only = process.argv.slice(2);
  for (const [name, route, mode] of ROUTES.filter((r) => !only.length || only.includes(r[0]))) {
    const t = setTimeout(() => { console.log('HANG on', name); process.exit(2); }, 20000);
    await p.goto('http://localhost:8960/site/index.html#/' + route); await p.waitForTimeout(1500);
    if (mode === 'cmdk') { await p.keyboard.press('Meta+k'); await p.keyboard.type('chart'); await p.waitForTimeout(600); }
    await p.screenshot({ path: '../shots/' + name + '.jpg', type: 'jpeg', quality: 90, fullPage: mode === 'full' });
    clearTimeout(t); console.log('ok', name);
  }
  await b.close();
})();
