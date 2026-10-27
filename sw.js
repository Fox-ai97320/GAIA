const CACHE="gaia-v5";
self.addEventListener("install",event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith("gaia-"))await caches.delete(key)}await self.clients.claim()})())});
self.addEventListener("fetch",event=>{const req=event.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(req,{cache:"no-store"}).catch(()=>caches.match(req)))});
