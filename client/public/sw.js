/* 오래(oraem.com) 서비스 워커
 * - 화면(페이지): 인터넷 우선, 끊기면 저장본 → 그것도 없으면 오프라인 안내
 * - 같은 사이트의 js/css/이미지/글꼴: 저장본 먼저 보여 주고 뒤에서 새로 받아 둠
 * - /api, /objects(업로드 파일), setup.php 는 저장하지 않음 (로그인·글·쪽지는 항상 최신)
 * 사이트를 크게 바꾼 뒤 앱에 바로 반영하려면 VERSION 을 올리세요 (v1 → v2).
 */
const VERSION = "v1";
const STATIC_CACHE = "orae-static-" + VERSION;
const PAGE_CACHE = "orae-pages-" + VERSION;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/manifest.json", "/pwa-192.png", "/pwa-512.png", "/apple-touch-icon.png", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k.startsWith("orae-") && k !== STATIC_CACHE && k !== PAGE_CACHE)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 다른 사이트(구글 글꼴 등)는 브라우저에 맡김
  const p = url.pathname;
  if (p.startsWith("/api") || p.startsWith("/objects") || p.startsWith("/uploads") || p === "/setup.php") return;
  if (p.startsWith("/@") || p.startsWith("/src/") || p.startsWith("/node_modules/")) return; // 개발 서버 파일

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(PAGE_CACHE).then((c) => c.put("/", copy)); }
          return res;
        })
        .catch(async () => (await caches.match("/")) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (["script", "style", "image", "font", "manifest"].includes(req.destination)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
