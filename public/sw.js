const CACHE="daily-shot-v6";
const BASE="/daily-shot/";
const OFFLINE_URL=BASE;

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.add(new Request(OFFLINE_URL,{cache:"reload"})))
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data?.type==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Always ask the network for navigations, HTML, manifests and scripts.
  // Next.js build assets are content-hashed, so stale app code should never win.
  const mustRevalidate =
    event.request.mode==="navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css");

  if(mustRevalidate){
    event.respondWith(
      fetch(new Request(event.request,{cache:"no-store"}))
        .then(response=>{
          if(response.ok && event.request.mode==="navigate"){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(OFFLINE_URL,copy));
          }
          return response;
        })
        .catch(()=>caches.match(event.request).then(hit=>hit||caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Static same-origin assets can be cached safely. Third-party images bypass this worker.
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }))
  );
});