/* 📶 Офлайн: регистрируем sw.js (страница открывается без связи) и досылаем ответы, когда связь вернулась. */
(function () {
    'use strict';
    try {
        if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
            window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
        }
    } catch (_) { }
    var bar = null;
    function show(on) {
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'iris-offline';
            bar.setAttribute('role', 'status');
            document.body.appendChild(bar);
        }
        bar.textContent = on ? '📶 Нет связи — можно заниматься дальше, ответы сохраняются и уйдут сами' : '✅ Связь вернулась — отправляем ответы';
        bar.hidden = false;
        clearTimeout(bar._t);
        if (!on) bar._t = setTimeout(function () { bar.hidden = true; }, 3500);
    }
    window.addEventListener('offline', function () { show(true); });
    window.addEventListener('online', function () {
        show(false);
        setTimeout(function () {
            try { if (window.__irisResync) window.__irisResync(); } catch (_) { }
            try { if (window.irisProgressSync) window.irisProgressSync(); } catch (_) { }
        }, 1500);
    });
    if (navigator.onLine === false) window.addEventListener('load', function () { show(true); });
})();
