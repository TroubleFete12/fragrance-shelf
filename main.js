const { app, BrowserWindow, ipcMain, dialog, clipboard, nativeImage, shell } = require('electron');
const path = require('path');
const fs   = require('fs');
const https = require('https');
const http  = require('http');

// ── HTTP ────────────────────────────────────────────────────────────────────
function httpGet(url, hops = 0) {
  return new Promise((resolve, reject) => {
    if (hops > 8) return reject(new Error('Too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        'Accept': 'text/html,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      },
      timeout: 12000,
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : 'https://www.fragrantica.com' + res.headers.location;
        return resolve(httpGet(next, hops + 1));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let d = '';
      res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

// ── 파일 ────────────────────────────────────────────────────────────────────
const ud   = () => app.getPath('userData');
const rj   = f => { try { return JSON.parse(fs.readFileSync(f, 'utf-8')); } catch { return null; } };
const wj   = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2), 'utf-8');
const fp   = name => path.join(ud(), name + '.json');

// ── HTML 파싱 ────────────────────────────────────────────────────────────────
function dh(s) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&nbsp;/g,' ')
          .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(n));
}
const st = s => s.replace(/<[^>]+>/g,'').trim();

function parsePage(html, fb, fn) {
  let name = fn, brand = fb, logoUrl = null;
  let notes = { top:[], middle:[], base:[] };

  const h1 = html.match(/<h1[^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const t = dh(st(h1[1].replace(/<span[\s\S]*?<\/span>/gi, '')));
    if (t) name = t;
  }
  const bb = html.match(/itemprop="brand"[\s\S]{0,800}/i);
  if (bb) {
    const bm = bb[0].match(/itemprop="name"[^>]*>([\s\S]*?)<\/span>/i);
    if (bm) { const b = dh(st(bm[1])); if (b) brand = b; }
  }
  const lm = html.match(/fimgs\.net\/mdimg\/dizajneri\/[mo]\.(\d+)\.jpg/i);
  if (lm) logoUrl = `https://fimgs.net/mdimg/dizajneri/o.${lm[1]}.jpg`;

  const sec = html.match(/pyramid[\s\S]{0,6000}/i)?.[0] || html;
  for (const [label, key] of [['Top','top'],['Heart','middle'],['Middle','middle'],['Base','base']]) {
    const re = new RegExp(label + '[\\s\\S]{0,600}?(?=' + ['Top','Heart','Middle','Base'].join('|') + '|$)', 'i');
    const m = sec.match(re);
    if (m) {
      const pills = [...m[0].matchAll(/href="\/notes\/[^"]*"[^>]*>([^<]+)</gi)].map(n=>dh(n[1].trim()));
      if (pills.length) notes[key] = [...new Set([...notes[key], ...pills])];
    }
  }
  return { name, brand, logoUrl, notes };
}

// ── 크롤링 ──────────────────────────────────────────────────────────────────
async function scrapeUrl(url) {
  const im = url.match(/-(\d+)\.html/);
  if (!im) throw new Error('올바른 Fragrantica URL이 아닙니다.\n예) https://www.fragrantica.com/perfume/Creed/Aventus-9828.html');
  const id = im[1];
  const parts = url.replace(/^https?:\/\/[^/]+\/perfume\//, '').split('/');
  const fb = dh((parts[0]||'').replace(/-/g,' '));
  const fn = dh((parts[1]||'').replace(/-\d+\.html$/,'').replace(/-/g,' '));
  let r = { id, brand:fb, name:fn, logoUrl:null, notes:{top:[],middle:[],base:[]} };
  try { Object.assign(r, parsePage(await httpGet(url), fb, fn)); } catch(e) { console.log('parse fail:', e.message); }
  return { ...r, imgHq:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${id}.jpg`,
    imgLq:`https://fimgs.net/mdimg/perfume-thumbs/dark-m.${id}.jpg`,
    url, addedAt:Date.now(), rating:0, wishlist:false, owned:true, tags:[] };
}

// ── 윈도우 ──────────────────────────────────────────────────────────────────
let win;
function createWindow() {
  win = new BrowserWindow({
    width:1400, height:900, minWidth:900, minHeight:600,
    webPreferences:{ nodeIntegration:false, contextIsolation:true, preload:path.join(__dirname,'preload.js') },
    backgroundColor:'#fff', show:false,
  });
  win.loadFile('index.html');
  win.once('ready-to-show', () => win.show());
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });

// ── IPC ─────────────────────────────────────────────────────────────────────
ipcMain.handle('scrape',       async (_,url) => { try { return {ok:true,data:await scrapeUrl(url)}; } catch(e) { return {ok:false,error:e.message}; } });
ipcMain.handle('db:get',       (_,k)         => rj(fp(k)) );
ipcMain.handle('db:set',       (_,k,v)       => { wj(fp(k),v); return true; });
ipcMain.handle('shell:open',   (_,url)       => { shell.openExternal(url); return true; });
ipcMain.handle('png:save',     async(e,data,name) => {
  const {filePath} = await dialog.showSaveDialog(win, {
    defaultPath:`${name||'fragrance'}-${new Date().toISOString().slice(0,10)}.png`,
    filters:[{name:'PNG',extensions:['png']}],
  });
  if (!filePath) return {ok:false};
  fs.writeFileSync(filePath, data.replace(/^data:image\/png;base64,/,''), 'base64');
  return {ok:true,filePath};
});
ipcMain.handle('png:copy', (_,data) => {
  const buf = Buffer.from(data.replace(/^data:image\/png;base64,/,''), 'base64');
  clipboard.writeImage(nativeImage.createFromBuffer(buf));
  return true;
});
ipcMain.handle('json:export', async e => {
  const {filePath} = await dialog.showSaveDialog(win, {
    defaultPath:`fragrance-backup-${new Date().toISOString().slice(0,10)}.json`,
    filters:[{name:'JSON',extensions:['json']}],
  });
  if (!filePath) return {ok:false};
  wj(filePath, { perfumes:rj(fp('perfumes'))||[], settings:rj(fp('settings'))||{}, shelves:rj(fp('shelves'))||{} });
  return {ok:true,filePath};
});
ipcMain.handle('json:import', async e => {
  const {filePaths} = await dialog.showOpenDialog(win, { filters:[{name:'JSON',extensions:['json']}], properties:['openFile'] });
  if (!filePaths?.length) return {ok:false};
  try {
    const d = JSON.parse(fs.readFileSync(filePaths[0],'utf-8'));
    if (d.perfumes) wj(fp('perfumes'), d.perfumes);
    if (d.settings) wj(fp('settings'), d.settings);
    if (d.shelves)  wj(fp('shelves'),  d.shelves);
    return {ok:true};
  } catch(e) { return {ok:false,error:e.message}; }
});
