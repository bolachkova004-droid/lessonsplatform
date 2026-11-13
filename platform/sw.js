/* Iris School — офлайн-режим. Страница урока и картинки сохраняются после первого открытия:
   при обрыве связи кабинет и уроки открываются из памяти телефона, а ответы досылаются,
   когда связь вернётся. Страницу всегда сначала берём из сети (свежая версия), память — запасной путь. */
'use strict';
const CACHE = 'iris-v1';
const PAGE_TIMEOUT = 6000;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
})()));

const pageKey = url => { const u = new URL(url); return u.origin + u.pathname; }; // без ?k=… — личный код не хранится в памяти

async function page(req) {
    const cache = await caches.open(CACHE), key = pageKey(req.url);
    const net = fetch(req).then(r => { if (r && r.ok && r.type === 'basic') cache.put(key, r.clone()); return r; });
    const timeout = new Promise(res => setTimeout(() => res(null), PAGE_TIMEOUT));
    try {
        const r = await Promise.race([net, timeout]);
        if (r) return r;
    } catch (_) { }
    const hit = await cache.match(key);
    if (hit) return hit;
    return net; // в памяти нет — ждём сеть до конца
}

async function asset(req) {
    const cache = await caches.open(CACHE), hit = await cache.match(req.url);
    if (hit) return hit;
    const r = await fetch(req);
    if (r && r.ok && r.status === 200 && r.type === 'basic') cache.put(req.url, r.clone());
    return r;
}

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const u = new URL(req.url);
    if (u.origin !== location.origin) return;
    if (u.pathname.includes('/api/')) return; // почтовый ящик — всегда напрямую
    if (req.mode === 'navigate' || /\.html$/.test(u.pathname)) { e.respondWith(page(req)); return; }
    if (/\/img\//.test(u.pathname)) { e.respondWith(asset(req)); return; }
    // записи (audio) браузер просит кусками (Range) — их не кэшируем, отдаём как есть
});
