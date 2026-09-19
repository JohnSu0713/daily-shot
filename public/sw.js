// Daily Shot intentionally does not cache the application shell.
// GitHub Pages is the source of truth so installed iOS PWAs receive each deployment.
self.addEventListener("install",()=>self.skipWaiting());

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(key=>caches.delete(key))))
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

  // Never satisfy same-origin app requests from Cache Storage.
  // Explicit no-store avoids a stale Home Screen app shell on iOS.
  event.respondWith(fetch(new Request(event.request,{cache:"no-store"})));
});