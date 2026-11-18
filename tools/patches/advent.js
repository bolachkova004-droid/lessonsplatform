/* 🎄 Адвент-календарь и новогоднее оформление.
   Данные — в <script id="iris-advent"> (tools/data/advent.py). Пока on = false, ничего не видно;
   предпросмотр: ?ny=2026-12-05 (любая дата) — запоминается до закрытия вкладки, ?ny=off — выключить. */
(function () {
    'use strict';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var A = null;
    try { A = JSON.parse(($('#iris-advent') || {}).textContent || 'null'); } catch (_) { }
    if (!A || !A.days) return;
    var C = window.__irisCore || null;
    var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    // ---------- дата (с предпросмотром) ----------
    var preview = '';
    try {
        var q = (location.search.match(/[?&]ny=([^&#]+)/) || [])[1];
        if (q === 'off') sessionStorage.removeItem('iris-ny');
        else if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) sessionStorage.setItem('iris-ny', q);
        preview = sessionStorage.getItem('iris-ny') || '';
    } catch (_) { }
    function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function today() { return window.IRIS_ADV_DATE || preview || iso(new Date()); }
    var enabled = A.on || !!preview || !!window.IRIS_ADV_DATE;
    function nyOn() { var t = today(); return enabled && t >= A.nyFrom && t <= A.nyTo; }
    function advOn() { var t = today(); return enabled && t >= A.start && t <= A.nyTo; }
    function dayISO(n) { return A.start.slice(0, 8) + ('0' + n).slice(-2); }
    function openDay() { // сколько окошек уже можно открыть
        var t = today();
        if (t < A.start) return 0;
        if (t.slice(0, 7) !== A.start.slice(0, 7)) return A.days.length;
        return Math.min(A.days.length, Number(t.slice(8)));
    }
    function daysToNY() { var t = today(), y = Number(t.slice(0, 4)), d = new Date(t + 'T12:00:00'), ny = new Date((y + 1) + '-01-01T12:00:00'); return Math.round((ny - d) / 864e5); }
    function plural(n, a, b, c) { var m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; }
    // ---------- кто смотрит и какой уровень ----------
    function st() { return C ? C.state() : {}; }
    function isTeacher() { var s = st(); return s.role === 'teacher' || document.body.classList.contains('teacher-access'); }
    function isStudent() { var s = st(); return !!C && !isTeacher() && s.profile && s.profile !== 'teacher'; }
    function me() { return st().profile || 'guest'; }
    function autoTier() {
        var data = [];
        try { data = JSON.parse(($('#platform-data') || {}).textContent || '[]'); } catch (_) { }
        var lv = data.filter(function (d) { return d.owner === me() && d.level; }).map(function (d) { return d.level; });
        var l = lv.length ? lv[lv.length - 1] : '';
        return /B1|B2|C1|Intermediate|Upper/i.test(l) && !/^A/.test(l) ? 'b' : 'a';
    }
    // ---------- прогресс: окошки и звёзды (у ученика — в профиле, синхронизируется) ----------
    function store() {
        var key = 'iris-adv:' + me(), s = null;
        if (isStudent()) { var f = C.profile().fields['iris-advent']; s = f && f.adv; }
        if (!s) { try { s = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { } }
        s = s && typeof s === 'object' ? s : {};
        s.o = s.o || {}; s.r = s.r || {};
        return s;
    }
    function save(s) {
        try { localStorage.setItem('iris-adv:' + me(), JSON.stringify(s)); } catch (_) { }
        if (!isStudent()) return;
        var n = Object.keys(s.o).length, stars = Object.keys(s.r).filter(function (k) { return s.r[k] === 1; }).length;
        C.profile().fields['iris-advent'] = { value: '🎄 Адвент: открыто ' + n + ' из ' + A.days.length + ', ⭐ ' + stars, status: '', attempted: false, revealed: false, earned: false, adv: s };
        try { C.save(); } catch (_) { }
    }
    function tier() { var s = store(); return s.tier || autoTier(); }
    function speak(t) {
        if (window.irisSpeak) { window.irisSpeak(t); return; }
        try { var u = new SpeechSynthesisUtterance(t); u.lang = 'en-GB'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (_) { }
    }
    // ---------- новогоднее оформление: снег, гирлянда ----------
    var snow = null;
    function snowOn() { try { return localStorage.getItem('iris-snow') !== 'off'; } catch (_) { return true; } }
    function startSnow() {
        if (snow || !snowOn() || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
        var cv = document.createElement('canvas');
        cv.id = 'iris-snow'; cv.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cv);
        var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), flakes = [], raf = 0;
        function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
        size();
        var N = Math.round(Math.min(70, Math.max(28, W * H / 22000)));
        for (var i = 0; i < N; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: 1.2 + Math.random() * 2.6, s: .25 + Math.random() * .7, w: Math.random() * 6.28, d: .4 + Math.random() * .8 });
        function frame() {
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < flakes.length; i++) {
                var f = flakes[i];
                f.y += f.s; f.w += .012; f.x += Math.sin(f.w) * f.d * .35;
                if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
                ctx.beginPath(); ctx.arc(f.x, f.y, f.r + 1, 0, 6.283);
                ctx.fillStyle = 'rgba(150,180,225,' + (.18 + f.r / 14) + ')';
                ctx.fill();
                ctx.beginPath(); ctx.arc(f.x, f.y, f.r * .6, 0, 6.283);
                ctx.fillStyle = 'rgba(255,255,255,.95)';
                ctx.fill();
            }
            raf = requestAnimationFrame(frame);
        }
        frame();
        window.addEventListener('resize', size);
        document.addEventListener('visibilitychange', function () { if (document.hidden) cancelAnimationFrame(raf); else if (snow) { cancelAnimationFrame(raf); frame(); } });
        snow = { stop: function () { cancelAnimationFrame(raf); cv.remove(); snow = null; } };
    }
    function decorate() {
        if (!nyOn()) { document.body.classList.remove('iris-ny'); if (snow) snow.stop(); return; }
        document.body.classList.add('iris-ny');
        if (!$('#iris-garland')) {
            var g = document.createElement('div');
            g.id = 'iris-garland'; g.setAttribute('aria-hidden', 'true');
            var h = '';
            for (var i = 0; i < 28; i++) h += '<i style="--i:' + i + '"></i>';
            g.innerHTML = h;
            document.body.appendChild(g);
        }
        startSnow();
    }
    // ---------- баннер на главной ----------
    function banner() {
        var home = $('#screen-home'), old = $('#iris-adv-banner');
        if (!advOn() || !home) { if (old) old.remove(); return; }
        var intro = $('.home-intro', home);
        if (!intro) return;
        var box = old || document.createElement('section');
        box.id = 'iris-adv-banner'; box.className = 'adv-banner';
        if (intro.nextElementSibling !== box) intro.insertAdjacentElement('afterend', box);
        var n = openDay(), s = store(), opened = Object.keys(s.o).length, left = daysToNY(), todayOpen = n && !s.o[n];
        var html = '<div class="adv-b-snow" aria-hidden="true"></div><div class="adv-b-txt"><div class="adv-b-kick">🎄 Адвент-календарь Iris School</div><b>' +
            (n <= A.days.length && todayOpen ? 'Окошко №' + n + ' ждёт тебя!' : opened >= A.days.length ? 'Все окошки открыты! ⭐' : 'Сегодняшнее окошко открыто ✨') + '</b><small>' +
            (left > 0 && left <= 31 ? 'До Нового года ' + left + ' ' + plural(left, 'день', 'дня', 'дней') + ' · ' : '') + 'открыто ' + opened + ' из ' + A.days.length + '</small></div>' +
            '<button type="button" class="adv-b-btn' + (todayOpen ? ' pulse' : '') + '" data-adv-open>Открыть</button>' +
            '<button type="button" class="adv-b-snowbtn" data-adv-snow aria-label="Снег: включить или выключить" title="Снег">' + (snowOn() ? '❄️' : '🌙') + '</button>';
        if (box.innerHTML !== html) box.innerHTML = html;
    }
    // плавающая кнопка — там, где нет баннера (у преподавателя, в уроке)
    function fab() {
        var b = $('#iris-adv-fab'), home = $('#screen-home'), show = advOn() && !(home && !home.hidden && $('#iris-adv-banner'));
        if (!show) { if (b) b.remove(); return; }
        if (!b) { b = document.createElement('button'); b.id = 'iris-adv-fab'; b.type = 'button'; b.setAttribute('data-adv-open', ''); b.setAttribute('aria-label', 'Адвент-календарь'); b.innerHTML = '🎄'; document.body.appendChild(b); }
        var s = store(), n = openDay();
        b.classList.toggle('has-due', !!(n && !s.o[n]));
    }
    // ---------- календарь ----------
    // окошки вперемешку, как в настоящем календаре; 24, 25 и 31 — большие
    var ORDER = [12, 3, 25, 7, 18, 1, 22, 9, 15, 28, 5, 20, 31, 11, 2, 26, 14, 8, 24, 17, 4, 29, 10, 21, 6, 13, 27, 19, 16, 23, 30];
    var BIG = { 24: 1, 25: 1, 31: 1 };
    function render() {
        var ov = $('#iris-adv');
        if (!ov) {
            ov = document.createElement('div');
            ov.id = 'iris-adv'; ov.className = 'adv'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Адвент-календарь');
            document.body.appendChild(ov);
        }
        var s = store(), n = openDay(), t = tier(), stars = Object.keys(s.r).filter(function (k) { return s.r[k] === 1; }).length, opened = Object.keys(s.o).length;
        var doors = ORDER.map(function (d, i) {
            var day = A.days[d - 1], can = d <= n, isOpen = !!s.o[d];
            return '<button type="button" class="adv-door c' + (i % 6) + (BIG[d] ? ' big' : '') + (isOpen ? ' open' : '') + (can ? '' : ' locked') + (d === n && !isOpen ? ' today' : '') + '" data-d="' + d + '" aria-label="Окошко ' + d + (can ? '' : ', откроется ' + d + ' декабря') + '">' +
                '<span class="adv-in"><span class="adv-emo">' + day.e + '</span>' + (s.r[d] === 1 ? '<span class="adv-star">⭐</span>' : '') + '</span>' +
                '<span class="adv-lid"><b>' + d + '</b>' + (d === n && !isOpen ? '<small>сегодня</small>' : '') + '</span></button>';
        }).join('');
        ov.innerHTML = '<div class="adv-sky" aria-hidden="true"></div><div class="adv-wrap"><div class="adv-head"><div><div class="adv-kick">IRIS SCHOOL · ДЕКАБРЬ</div><h2>Адвент-календарь</h2>' +
            '<p>Каждый день открывается новое окошко: факт, шутка или слово дня — и маленькое задание. ⭐ за верный ответ!</p></div>' +
            '<button type="button" class="adv-x" data-adv-close aria-label="Закрыть">✕</button></div>' +
            '<div class="adv-stats"><span>🎁 <b>' + opened + '</b> из ' + A.days.length + '</span><span>⭐ <b>' + stars + '</b></span>' +
            '<span class="adv-tier" role="group" aria-label="Уровень заданий"><button type="button" data-adv-tier="a" class="' + (t === 'a' ? 'on' : '') + '">Проще</button><button type="button" data-adv-tier="b" class="' + (t === 'b' ? 'on' : '') + '">Сложнее</button></span></div>' +
            '<div class="adv-grid">' + doors + '</div><p class="adv-foot">Пропустили день? Ничего страшного — прошлые окошки можно открыть в любой момент.</p></div><div class="adv-toast" aria-live="polite"></div>';
        ov.hidden = false;
        document.documentElement.classList.add('adv-lock');
    }
    function open() { render(); }
    function close() {
        var ov = $('#iris-adv');
        if (ov) ov.hidden = true;
        document.documentElement.classList.remove('adv-lock');
        banner(); fab();
    }
    function toast(msg) {
        var t = $('#iris-adv .adv-toast');
        if (!t) return;
        t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    }
    function burst(el, n, chars, big) {
        var r = el.getBoundingClientRect(), box = document.createElement('div');
        box.className = 'adv-burst' + (big ? ' big' : ''); box.style.left = (r.left + r.width / 2) + 'px'; box.style.top = (r.top + r.height / 2) + 'px';
        var h = '';
        for (var i = 0; i < n; i++) {
            var a = Math.random() * 6.283, dist = 50 + Math.random() * 90;
            h += '<i style="--x:' + Math.round(Math.cos(a) * dist) + 'px;--y:' + Math.round(Math.sin(a) * dist) + 'px;--d:' + (Math.random() * .15).toFixed(2) + 's">' + chars[i % chars.length] + '</i>';
        }
        box.innerHTML = h;
        document.body.appendChild(box);
        setTimeout(function () { box.remove(); }, 1300);
    }
    function card(d) {
        var day = A.days[d - 1], t = tier(), L = day[t], s = store(), done = s.r[d];
        var c = document.createElement('div');
        c.className = 'adv-card-wrap' + (day.k === 'wish' ? ' fireworks' : '');
        var opts = L.o.map(function (o, i) {
            var cls = done ? (i === L.ok ? ' ok' : '') : '';
            return '<button type="button" class="adv-opt' + cls + '" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + esc(o) + '</button>';
        }).join('');
        var dt = dayISO(d).split('-');
        c.innerHTML = '<div class="adv-card" role="document"><button type="button" class="adv-x" data-adv-card-close aria-label="Закрыть">✕</button>' +
            '<div class="adv-c-kick">' + esc(A.kinds[day.k] || '') + ' · ' + Number(dt[2]) + ' ' + MONTHS[Number(dt[1]) - 1] + '</div>' +
            '<div class="adv-c-emo">' + day.e + '</div><h3>' + esc(day.t) + '</h3>' +
            '<p class="adv-c-en">' + esc(L.en) + ' <button type="button" class="adv-say" data-say-adv="' + esc(L.say || L.en) + '" aria-label="Послушать">🔊</button></p>' +
            (t === 'a' ? '<p class="adv-c-ru">' + esc(L.ru) + '</p>' : '<button type="button" class="adv-ru-btn" data-adv-ru>Показать перевод</button><p class="adv-c-ru" hidden>' + esc(L.ru) + '</p>') +
            '<div class="adv-q"><b>' + esc(L.q) + '</b><div class="adv-opts" data-d="' + d + '">' + opts + '</div><div class="adv-fb" aria-live="polite">' +
            (done === 1 ? '✅ Верно! ⭐' : done === 2 ? '✅ Правильный ответ отмечен зелёным.' : '') + '</div></div>' +
            '<button type="button" class="adv-done" data-adv-card-close>' + (d < A.days.length ? 'Закрыть · завтра новое окошко ✨' : 'С Новым годом! 🥂') + '</button></div>';
        $('#iris-adv').appendChild(c);
        requestAnimationFrame(function () { c.classList.add('in'); });
        if (day.k === 'wish') setTimeout(function () { burst(c.querySelector('.adv-c-emo'), 26, ['🎆', '✨', '🎇', '⭐', '🎉'], true); }, 350);
    }
    function openDoor(btn) {
        var d = Number(btn.getAttribute('data-d')), s = store();
        if (btn.classList.contains('locked')) {
            btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
            toast('Это окошко откроется ' + d + ' декабря ❄️');
            return;
        }
        if (!s.o[d]) {
            s.o[d] = Date.now(); save(s);
            btn.classList.add('opening', 'open'); btn.classList.remove('today');
            burst(btn, 16, ['✨', '❄️', '⭐', '✦']);
            setTimeout(function () { card(d); }, 650);
        } else card(d);
    }
    function answer(b) {
        var box = b.parentNode, d = Number(box.getAttribute('data-d')), day = A.days[d - 1], L = day[tier()], s = store();
        if (s.r[d]) return;
        var i = Number(b.getAttribute('data-i')), ok = i === L.ok;
        s.r[d] = ok ? 1 : 2; save(s);
        Array.prototype.forEach.call(box.children, function (x, j) { x.disabled = true; if (j === L.ok) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
        var fb = box.parentNode.querySelector('.adv-fb');
        fb.innerHTML = ok ? '✅ Верно! +⭐' : '❌ Почти! Правильный ответ — зелёный. Завтра получится!';
        if (ok) burst(b, 12, ['⭐', '✨', '🌟']);
        var door = $('#iris-adv .adv-door[data-d="' + d + '"] .adv-in');
        if (ok && door && !door.querySelector('.adv-star')) door.insertAdjacentHTML('beforeend', '<span class="adv-star">⭐</span>');
        var stt = $('#iris-adv .adv-stats');
        if (stt) stt.children[1].innerHTML = '⭐ <b>' + Object.keys(s.r).filter(function (k) { return s.r[k] === 1; }).length + '</b>';
    }
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('[data-adv-open]')) { open(); return; }
        if (t.closest('[data-adv-snow]')) {
            var on = snowOn();
            try { localStorage.setItem('iris-snow', on ? 'off' : 'on'); } catch (_) { }
            if (on && snow) snow.stop(); else startSnow();
            banner(); return;
        }
        if (!t.closest('#iris-adv')) return;
        var x;
        if (t.closest('[data-adv-card-close]')) { var w = t.closest('.adv-card-wrap'); if (w) { w.classList.remove('in'); setTimeout(function () { w.remove(); }, 250); } return; }
        if (t.classList.contains('adv-card-wrap')) { t.classList.remove('in'); setTimeout(function () { t.remove(); }, 250); return; }
        if (t.closest('[data-adv-close]')) { close(); return; }
        if ((x = t.closest('[data-adv-tier]'))) { var s = store(); s.tier = x.getAttribute('data-adv-tier'); save(s); render(); return; }
        if ((x = t.closest('.adv-door'))) { openDoor(x); return; }
        if ((x = t.closest('.adv-opt'))) { answer(x); return; }
        if ((x = t.closest('[data-say-adv]'))) { speak(x.getAttribute('data-say-adv')); return; }
        if ((x = t.closest('[data-adv-ru]'))) { x.nextElementSibling.hidden = false; x.remove(); }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var w = $('#iris-adv .adv-card-wrap');
        if (w) w.remove(); else if ($('#iris-adv') && !$('#iris-adv').hidden) close();
    });
    function tick() { try { decorate(); banner(); fab(); } catch (_) { } }
    function boot() {
        tick();
        var h = $('#screen-home');
        if (h) new MutationObserver(function () { if (advOn() && $('.home-intro', h) && !$('#iris-adv-banner', h)) banner(); }).observe(h, { childList: true });
        window.addEventListener('hashchange', function () { setTimeout(fab, 80); });
        document.addEventListener('click', function () { setTimeout(fab, 120); }, true);
        setInterval(tick, 60000); // в полночь откроется новое окошко без перезагрузки
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.irisAdvent = { open: open, close: close, on: advOn, today: today, refresh: function () { enabled = A.on || !!preview || !!window.IRIS_ADV_DATE; tick(); var ov = $('#iris-adv'); if (ov && !ov.hidden) render(); } };
})();
