/* 🔒 Загрузчик: открывает уроки ключом из личной ссылки и запускает платформу.
   Без ссылки (или с чужой) показывается только вход — материалы в коде страницы зашифрованы. */
(function () {
    'use strict';
    window.__irisBooting = true;
    var sealedEl = document.getElementById('iris-sealed');
    var INFLATE = (__IRIS_INFLATE__);
    function b64d(str) {
        var s = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4)), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        return u;
    }
    function b64e(buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
    function tokenOf(text) {
        var v = String(text || '').trim(), m = /[?&]k=([A-Za-z0-9_-]+)/.exec(v) || /#k\.([A-Za-z0-9_-]+)/.exec(v);
        return m ? m[1] : /^[A-Za-z0-9_-]{16,64}$/.test(v.replace(/^k\./, '')) ? v.replace(/^k\./, '') : '';
    }
    function token() {
        var q = tokenOf(location.search) || tokenOf(location.hash);
        if (q) return q;
        try { var s = JSON.parse(localStorage.getItem('iris-access-v1') || 'null'); return s && s.t || ''; } catch (_) { return ''; }
    }
    function inflate(bytes) {
        if (window.DecompressionStream) {
            try {
                var st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                return new Response(st).arrayBuffer().then(function (b) { return new Uint8Array(b); }).catch(function () { return INFLATE.raw(bytes); });
            } catch (_) { }
        }
        return Promise.resolve(INFLATE.raw(bytes));
    }
    function open(t) {
        var data = JSON.parse(sealedEl.textContent), enc = new TextEncoder(), S = crypto.subtle;
        return Promise.all([S.digest('SHA-256', enc.encode('iris-content:' + t)), S.digest('SHA-256', enc.encode('iris-kid:' + t))]).then(function (d) {
            var kid = b64e(d[1]).slice(0, 16), mine = data.keys.filter(function (k) { return k.kid === kid; });
            if (!mine.length) return false;
            return S.importKey('raw', d[0], 'AES-GCM', false, ['decrypt']).then(function (kek) {
                return Promise.all(mine.map(function (k) {
                    return S.decrypt({ name: 'AES-GCM', iv: b64d(k.iv) }, kek, b64d(k.k)).then(function (raw) {
                        return S.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
                    }).then(function (ck) {
                        return Promise.all(k.p.map(function (n) {
                            var part = data.parts[n];
                            return S.decrypt({ name: 'AES-GCM', iv: b64d(part.iv) }, ck, b64d(part.ct)).then(function (z) { return inflate(new Uint8Array(z)); }).then(function (html) {
                                var slot = document.querySelector('template[data-iris-part="' + n + '"]');
                                if (slot) { slot.insertAdjacentHTML('beforebegin', new TextDecoder().decode(html)); slot.remove(); }
                            });
                        }));
                    });
                }));
            }).then(function () {
                // уроки, которые этим кодом не открываются, убираем из списка — платформа их не увидит
                var left = Array.prototype.map.call(document.querySelectorAll('template[data-iris-part]'), function (x) { return Number(x.getAttribute('data-iris-part')); });
                if (left.length) {
                    var gone = {};
                    left.forEach(function (n) { data.parts[n].ids.forEach(function (id) { gone[id] = 1; }); });
                    var pd = document.getElementById('platform-data');
                    try { pd.textContent = JSON.stringify(JSON.parse(pd.textContent).filter(function (d) { return !gone[d.id]; })); } catch (_) { }
                    Array.prototype.forEach.call(document.querySelectorAll('template[data-iris-part]'), function (x) { x.remove(); });
                }
                return true;
            });
        });
    }
    function boot() {
        // общие словари (одинаковые на всех страницах) — отдельными файлами; дождаться их, затем код платформы
        var data = Array.prototype.slice.call(document.querySelectorAll('script[data-iris-json]'));
        Promise.all(data.map(function (el) {
            return fetch(el.getAttribute('data-iris-json'), { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw Error(r.status); return r.text(); }).then(function (t) { el.textContent = t; el.removeAttribute('data-iris-json'); });
        })).then(run, function () { window.__irisBooting = false; fail('Не удалось загрузить платформу. Проверьте интернет и обновите страницу.'); });
    }
    function run() {
        // все файлы качаются параллельно, выполняются по порядку (async = false)
        var list = Array.prototype.slice.call(document.querySelectorAll('script[data-iris-src]')), left = list.length, failed = false;
        if (!left) { window.__irisBooting = false; return; }
        list.forEach(function (ph) {
            var s = document.createElement('script');
            if (ph.id) { var id = ph.id; ph.removeAttribute('id'); s.id = id; }
            s.async = false;
            s.src = ph.getAttribute('data-iris-src');
            s.onload = function () { if (--left === 0) window.__irisBooting = false; };
            s.onerror = function () { if (failed) return; failed = true; window.__irisBooting = false; fail('Не удалось загрузить платформу. Проверьте интернет и обновите страницу.'); };
            ph.parentNode.insertBefore(s, ph.nextSibling);
        });
        setTimeout(function () { if (window.__irisBooting && !window.__irisReady) fail('Платформа загружается слишком долго. Проверьте интернет и обновите страницу.'); }, 45000);
    }
    function fail(msg) {
        document.documentElement.className = document.documentElement.className.replace(/\s*iris-checking/g, '');
        var d = document.createElement('div');
        d.className = 'boot-fail';
        d.setAttribute('role', 'alert');
        d.innerHTML = '<b>' + msg + '</b> <button type="button" onclick="location.reload()">Обновить</button>';
        document.body.appendChild(d);
    }
    function login(note) {
        window.__irisBooting = false;
        document.documentElement.className = document.documentElement.className.replace(/\s*iris-checking/g, '');
        var box = document.createElement('div');
        box.className = 'iris-login';
        box.innerHTML = '<form class="iris-login-card"><div class="kicker">IRIS SCHOOL</div><h1>Вход по личной ссылке</h1>' +
            '<p>' + (note || 'Уроки открываются только по вашей личной ссылке. Откройте её из сообщения преподавателя или вставьте сюда.') + '</p>' +
            '<input class="field" id="iris-login-code" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ссылка или код" aria-label="Личная ссылка или код">' +
            '<button class="ui-btn" type="submit">Войти</button></form>';
        document.body.appendChild(box);
        box.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault();
            var t = tokenOf(box.querySelector('input').value);
            if (!t) { box.querySelector('input').focus(); return; }
            location.href = location.pathname.replace(/[^/]*$/, 'index.html') + '?k=' + encodeURIComponent(t) + location.hash;
        });
    }
    if (!sealedEl) { boot(); return; }
    if (!window.crypto || !crypto.subtle || !window.TextEncoder || !window.Promise) {
        login('Этот браузер не умеет открывать защищённые уроки. Откройте ссылку в Chrome или Safari (не внутри мессенджера). На старом планшете обновите браузер.');
        return;
    }
    var t = token();
    if (!t) { login(); return; }
    open(t).then(function (ok) {
        if (ok) boot();
        else login('Эта ссылка не подходит. Проверьте, что она скопирована полностью, или попросите у преподавателя новую.');
    }, function () { login('Не получилось открыть уроки этой ссылкой. Попробуйте ещё раз или попросите у преподавателя новую.'); });
})();
