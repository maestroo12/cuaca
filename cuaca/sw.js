const CACHE="cuaca-v2";
const ASSETS=["./","index.html","style.css","script.js","manifest.json","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png","icons/favicon-32.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Stale-while-revalidate: tampil dari cache dulu, diperbarui di belakang layar
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  const ok=u.origin===location.origin||u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com";
  if(!ok)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res})
      .catch(()=>hit||(r.mode==="navigate"?c.match("index.html"):undefined));
    return hit||net;
  }));
});
