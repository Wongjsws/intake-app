const C='ekoway-web-v1';
const SHELL=['./','index.html','manifest.json','icon.png'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));
 self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))
 .then(()=>self.clients.claim())));
// Shell = cache-first (it never changes); anything else = network with
// cache fallback. Navigations always land on the cached app, so the form
// opens with the Mac off and even with no network at all.
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 if(new URL(r.url).origin!==location.origin)return; // API calls pass through
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{
  if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}
  return res;
 }).catch(()=>r.mode==='navigate'?caches.match('./'):Response.error())));
});
