// Zen OS Arka Plan Motoru (Service Worker)
self.addEventListener('install', (e) => {
    console.log('[Zen OS] Uygulama motoru kuruldu.');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Zen OS] Motor aktif edildi.');
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Şimdilik kodlarını geliştirirken eski sürümde kalmaman için
    // önbellek (cache) yapmıyoruz, doğrudan internetten çekiyoruz.
    e.respondWith(fetch(e.request).catch(() => {
        return caches.match(e.request);
    }));
});
