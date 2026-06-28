/* Service Worker — ค้นหาเขตรับผิดชอบ สภ. (PWA v3.1) */
const CACHE = 'pct-sb-v3-1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; /* ข้ามไฟล์ภายนอก เช่น LIFF SDK */
  e.respondWith(
    caches.match(req).then(function(cached){
      var net = fetch(req).then(function(res){
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){ return cached; });
      return cached || net;
    })
  );
});
