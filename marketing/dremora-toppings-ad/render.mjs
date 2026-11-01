// Renders the Dremora Toppings ad frame by frame in headless Chrome, then encodes it with ffmpeg.
// Run from the project root:
//   node marketing/dremora-toppings-ad/render.mjs portrait            -> dremora-toppings-ad-9x16.mp4 (1080x1920)
//   node marketing/dremora-toppings-ad/render.mjs landscape           -> dremora-toppings-ad-16x9.mp4 (1920x1080)
//   node marketing/dremora-toppings-ad/render.mjs portrait 1,9,26     -> preview stills at those seconds
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logos } from '../../src/lib/logo.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const [orientation = 'portrait', previewArg] = process.argv.slice(2);
const [W, H] = orientation === 'landscape' ? [1920, 1080] : [1080, 1920];
const FPS = 30, SECONDS = 30;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

// 1. Put the real logo artwork into the template.
const m = logos.mark, w = logos.wordmark;
const rects = (l, ids, fill) => l.squares.map(([x, y, rw, rh], i) => `<rect${ids ? ` id="${ids[i]}"` : ''} x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${fill}"/>`).join('');
const markSvg = `<svg viewBox="0 0 ${m.viewBox[0]} ${m.viewBox[1]}" width="100%" height="100%" style="overflow:visible">${rects(m, ['m_sq1', 'm_sq2'], '#C8CCD2')}<g transform="translate(${m.path.dx} ${m.path.dy})"><path id="m_d" fill-rule="evenodd" fill="#FFFFFF" d="${m.path.d}"/></g></svg>`;
const wordSvg = `<svg viewBox="0 0 ${w.viewBox[0]} ${w.viewBox[1]}">${rects(w, null, '#C8CCD2')}<path transform="translate(${w.path.dx} ${w.path.dy})" fill-rule="evenodd" fill="#FFFFFF" d="${w.path.d}"/></svg>`;
const html = readFileSync(join(here, 'ad.template.html'), 'utf8').replace('<!--MARK-->', markSvg).replace('<!--WORDMARK-->', wordSvg);
writeFileSync(join(here, 'ad.html'), html);

// 2. Drive headless Chrome over the DevTools Protocol.
const port = 9335;
const profile = join(here, '.chrome-profile');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-allow-origins=*', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 80 && !ws; i++) {
  try { const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); if (page) ws = new WebSocket(page.webSocketDebuggerUrl); } catch {}
  if (!ws) await sleep(250);
}
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const msg = JSON.parse(e.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } });
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; const t = setTimeout(() => rej(new Error(method + ' timed out')), 60000);
  pending.set(i, (msg) => { clearTimeout(t); msg.error ? rej(new Error(method + ': ' + msg.error.message)) : res(msg.result); });
  ws.send(JSON.stringify({ id: i, method, params }));
});
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(join(here, 'ad.html')).href + `?w=${W}&h=${H}` });
await sleep(1500);
await send('Runtime.evaluate', { expression: 'window.ready', awaitPromise: true });
await sleep(300);

const grab = async (t, file, format = 'jpeg') => {
  await send('Runtime.evaluate', { expression: `render(${t})` });
  const { data } = await send('Page.captureScreenshot', format === 'jpeg' ? { format: 'jpeg', quality: 95 } : { format: 'png' });
  writeFileSync(file, Buffer.from(data, 'base64'));
};

if (previewArg) {
  const dir = join(here, 'preview'); mkdirSync(dir, { recursive: true });
  for (const t of previewArg.split(',').map(Number)) await grab(t, join(dir, `${orientation}-${String(t).replace('.', '_')}.png`), 'png');
  console.log('previews in', dir);
} else {
  const dir = join(here, `.frames-${orientation}`); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const total = FPS * SECONDS;
  for (let f = 0; f < total; f++) {
    await grab(f / FPS, join(dir, `f${String(f).padStart(4, '0')}.jpg`));
    if (f % 90 === 0) console.log(`frame ${f}/${total}`);
  }
  const out = join(here, `dremora-toppings-ad-${orientation === 'landscape' ? '16x9' : '9x16'}.mp4`);
  const r = spawnSync(FFMPEG, ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(dir, 'f%04d.jpg'), '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg failed');
  rmSync(dir, { recursive: true, force: true });
  console.log('wrote', out);
}
ws.close(); chrome.kill();
