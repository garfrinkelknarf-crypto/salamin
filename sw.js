var CACHE='salamin-v14';
/* The speech-engine files in lib/ are pinned versions, so they keep their own cache across app updates. Change LIB only when they change. */
var LIB='salamin-lib-3';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('salamin-')===0&&k!==CACHE&&k!==LIB}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
/* The page is served cross-origin isolated so the speech engine can use several processor cores. */
function iso(res){if(!res||res.type==='opaque'||res.type==='opaqueredirect')return res;var h=new Headers(res.headers);h.set('Cross-Origin-Opener-Policy','same-origin');h.set('Cross-Origin-Embedder-Policy','credentialless');return new Response(res.body,{status:res.status,statusText:res.statusText,headers:h})}
/* App files and the speech engine in lib/ are cached. api.anthropic.com, the speech model and the models/ folder go straight to the network: the speech model is kept by the browser itself. */
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    var rel=u.pathname.slice(new URL(self.registration.scope).pathname.length);
    if(rel.indexOf('models/')===0)return;
    if(rel.indexOf('lib/')===0){e.respondWith(caches.open(LIB).then(function(c){return c.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res.ok)c.put(r,res.clone());return res})})}).then(iso));return}
    e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match('index.html')})}).then(function(res){return r.mode==='navigate'?iso(res):res}));
    return;
  }
});
