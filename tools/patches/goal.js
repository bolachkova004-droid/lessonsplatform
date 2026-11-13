/* 🎯 Персонализация: ученик пишет, для чего ему английский (учёба / работа / … и сфера: химия, математика, туризм…),
   и получает свой набор слов с транскрипцией, живой озвучкой и тренировкой. Цель уходит преподавателю вместе с ответами. */
(function () {
    'use strict';
    var C = window.__irisCore;
    if (!C) return;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var P = {};
    try { P = JSON.parse(($('#iris-packs') || {}).textContent || '{}'); } catch (_) { }
    if (!P.areas) return;
    var GOALS = P.goals, AREAS = P.areas, PACKS = P.packs;
    var goalById = function (id) { for (var i = 0; i < GOALS.length; i++) if (GOALS[i][0] === id) return GOALS[i]; return null; };
    var isTeacher = function () { var st = C.state(); return st.role === 'teacher' || document.body.classList.contains('teacher-access'); };
    var isStudent = function () { var st = C.state(); return !isTeacher() && st.profile && st.profile !== 'teacher'; };
    var speak = function (t) { if (window.irisSpeak) window.irisSpeak(t); };
    var ipa = function (t) { return window.irisIpa ? window.irisIpa(t) : ''; };
    // цель и прогресс хранятся в «fields» — так они синхронизируются между телефоном и ноутбуком
    function goal() { var f = C.profile().fields['iris-goal']; return f && f.goal && typeof f.goal === 'object' ? f.goal : null; }
    function areaFor(g) {
        if (!g) return '';
        if (g.area && AREAS[g.area]) return g.area;
        var t = String(g.text || '').toLowerCase();
        var best = '';
        Object.keys(AREAS).forEach(function (k) {
            var a = AREAS[k];
            if (best || !a[3] || (g.g && a[0] !== g.g && !(g.g === 'study' || g.g === 'work'))) return;
            if (new RegExp(a[3]).test(t) && (!g.g || a[0] === g.g)) best = k;
        });
        if (!best) Object.keys(AREAS).forEach(function (k) { if (!best && AREAS[k][3] && new RegExp(AREAS[k][3]).test(t)) best = k; });
        return best || ({ study: 'school', work: 'office', travel: 'travel', exam: 'exam', move: 'move', talk: 'talk' }[g.g] || 'talk');
    }
    function goalLabel(g) {
        if (!g) return '';
        var G = goalById(g.g), a = AREAS[areaFor(g)];
        var s = (G ? G[1] + ' ' + G[2] : '') + (a && (g.g === 'study' || g.g === 'work') ? ' · ' + a[2] : '');
        return s;
    }
    // цель — в скрытом поле каждого урока: уходит преподавателю вместе с ответами (видно в «Работах учеников»)
    function goalText(g) { return g ? goalLabel(g) + (g.text ? ' — «' + g.text + '»' : '') : ''; }
    function injectFields() {
        $$('main > section.step:last-of-type').forEach(function (sec) {
            if ($('.iris-goal-in', sec)) return;
            var inp = document.createElement('input');
            inp.type = 'hidden';
            inp.className = 'iris-goal-in';
            inp.setAttribute('data-field', 'iris-goal');
            inp.setAttribute('aria-label', '🎯 Цель ученика');
            inp.setAttribute('placeholder', '🎯 Цель ученика');
            sec.appendChild(inp);
        });
    }
    function saveGoal(g) {
        var p = C.profile();
        g.at = Date.now();
        p.fields['iris-goal'] = { value: goalText(g), status: '', attempted: false, revealed: false, earned: false, goal: g };
        C.save();
        paintMe();
    }
    // ---------- окно выбора цели ----------
    function modal(id, html) {
        var m = $('#' + id);
        if (!m) {
            m = document.createElement('div');
            m.id = id;
            m.className = 'irv iris-modal';
            m.setAttribute('role', 'dialog');
            m.setAttribute('aria-modal', 'true');
            document.body.appendChild(m);
            m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.irv-close')) close(id); });
        }
        m.innerHTML = '<div class="irv-card">' + html + '</div>';
        m.hidden = false;
        document.body.classList.add('irv-open');
        return m;
    }
    function close(id) { var m = $('#' + id); if (m) m.hidden = true; if (!$$('.irv').some(function (x) { return !x.hidden; })) document.body.classList.remove('irv-open'); }
    var draft = {};
    function openGoal(step) {
        var g = goal() || {};
        if (!step) draft = { g: g.g || '', area: g.area || '', text: g.text || '' };
        step = step || 1;
        var top = '<div class="irv-top"><div><div class="kicker">МОЯ ЦЕЛЬ · ШАГ ' + step + ' ИЗ ' + (draft.g === 'study' || draft.g === 'work' ? 3 : 2) + '</div><h2>🎯 ' + (step === 1 ? 'Для чего вам английский?' : step === 2 ? (draft.g === 'study' ? 'Что вы изучаете?' : 'Чем вы занимаетесь?') : 'Пара слов о вашей цели') + '</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>';
        var body = '';
        if (step === 1) {
            body = '<p class="irv-sub">Подберу слова и примеры под вашу цель. Поменять можно в любой момент.</p><div class="goal-grid">' + GOALS.map(function (x) {
                return '<button type="button" class="goal-btn' + (draft.g === x[0] ? ' on' : '') + '" data-goal="' + x[0] + '"><span class="goal-emo">' + x[1] + '</span><b>' + esc(x[2]) + '</b><small>' + esc(x[3]) + '</small></button>';
            }).join('') + '</div>';
        } else if (step === 2) {
            body = '<div class="goal-grid areas">' + Object.keys(AREAS).filter(function (k) { return AREAS[k][0] === draft.g; }).map(function (k) {
                var a = AREAS[k];
                return '<button type="button" class="goal-btn small' + (draft.area === k ? ' on' : '') + '" data-area="' + k + '"><span class="goal-emo">' + a[1] + '</span><b>' + esc(a[2]) + '</b></button>';
            }).join('') + '<button type="button" class="goal-btn small' + (draft.area === 'other' ? ' on' : '') + '" data-area="other"><span class="goal-emo">✍️</span><b>Другое</b></button></div>';
        } else {
            body = '<p class="irv-sub">Напишите своими словами — преподаватель увидит и подберёт материалы.</p><textarea class="field goal-text" maxlength="300" rows="3" placeholder="' + esc(draft.g === 'work' ? 'Например: провожу конные туры, хочу общаться с иностранными гостями' : draft.g === 'study' ? 'Например: учусь на химика, читаю статьи на английском' : 'Например: хочу свободно говорить в поездках') + '">' + esc(draft.text || '') + '</textarea>' +
                '<div class="irv-actions"><button type="button" class="ui-btn goal-save">Сохранить и открыть мои слова</button></div>';
        }
        var back = step > 1 ? '<button type="button" class="ui-link goal-back">← Назад</button>' : '<button type="button" class="ui-link goal-later">Позже</button>';
        var m = modal('iris-goal', top + body + '<div class="goal-foot">' + back + '</div>');
        m.dataset.step = String(step);
        if (!m._wired) {
            m._wired = true;
            m.addEventListener('click', function (e) {
                var t = e.target, st = Number(m.dataset.step);
                var gb = t.closest('[data-goal]'), ab = t.closest('[data-area]');
                if (gb) { draft.g = gb.dataset.goal; if (AREAS[draft.area] && AREAS[draft.area][0] !== draft.g) draft.area = ''; openGoal(draft.g === 'study' || draft.g === 'work' ? 2 : 3); return; }
                if (ab) { draft.area = ab.dataset.area; openGoal(3); return; }
                if (t.closest('.goal-back')) { openGoal(st === 3 && (draft.g === 'study' || draft.g === 'work') ? 2 : 1); return; }
                if (t.closest('.goal-later')) { try { localStorage.setItem('iris-goal-later:' + C.state().profile, String(Date.now())); } catch (_) { } close('iris-goal'); return; }
                if (t.closest('.goal-save')) {
                    var txt = (($('.goal-text', m) || {}).value || '').trim().slice(0, 300);
                    var g = { g: draft.g, area: draft.area && draft.area !== 'other' ? draft.area : '', text: txt };
                    g.area = areaFor(g);
                    saveGoal(g);
                    close('iris-goal');
                    openPack(g.area);
                }
            });
        }
    }
    // ---------- мои слова ----------
    function packProgress(area) {
        var f = C.profile().fields, rec = f['iris-packs'];
        if (!rec || typeof rec !== 'object' || !rec.p) rec = f['iris-packs'] = { value: '', status: '', earned: false, p: {} };
        if (!rec.p[area]) rec.p[area] = {};
        return rec.p[area];
    }
    function known(area) { var pr = packProgress(area); return (PACKS[area] || []).filter(function (w) { return (pr[w.en] || 0) >= 2; }).length; }
    function inDict(en) { return (C.profile().words || []).some(function (w) { return String(w.en).toLowerCase() === en.toLowerCase(); }); }
    var packArea = '';
    function openPack(area, tab) {
        area = area || areaFor(goal()) || 'talk';
        packArea = area;
        var a = AREAS[area], list = PACKS[area] || [], pr = packProgress(area);
        var others = '<select class="field pack-switch" aria-label="Другая сфера">' + GOALS.map(function (G) {
            var ks = Object.keys(AREAS).filter(function (k) { return AREAS[k][0] === G[0]; });
            return '<optgroup label="' + esc(G[2]) + '">' + ks.map(function (k) { return '<option value="' + k + '"' + (k === area ? ' selected' : '') + '>' + AREAS[k][1] + ' ' + esc(AREAS[k][2]) + '</option>'; }).join('') + '</optgroup>';
        }).join('') + '</select>';
        var top = '<div class="irv-top"><div><div class="kicker">СЛОВА ДЛЯ МОЕЙ ЦЕЛИ</div><h2>' + a[1] + ' ' + esc(a[2]) + '</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>' +
            '<div class="pack-tools">' + others + '<span class="pack-known">Выучено: <b>' + known(area) + '</b> из ' + list.length + '</span></div>' +
            '<div class="pack-tabs" role="tablist"><button type="button" role="tab" class="pack-tab' + (tab !== 'train' ? ' on' : '') + '" data-tab="list">📖 Слова</button><button type="button" role="tab" class="pack-tab' + (tab === 'train' ? ' on' : '') + '" data-tab="train">🎯 Тренировка</button></div>';
        var body;
        if (tab === 'train') body = '<div class="pack-train"></div>';
        else body = '<ul class="pack-list">' + list.map(function (w, i) {
            var lvl = pr[w.en] || 0, tr = ipa(w.en);
            return '<li class="pack-row' + (lvl >= 2 ? ' known' : '') + '"><button type="button" class="icon-btn pack-say" data-i="' + i + '" aria-label="Послушать ' + esc(w.en) + '">🔊</button>' +
                '<div class="pack-main"><div><b class="pack-en">' + esc(w.en) + '</b>' + (tr ? ' <span class="ipa">' + esc(tr) + '</span>' : '') + ' — <span class="pack-ru">' + esc(w.ru) + '</span></div>' +
                '<div class="pack-ex"><button type="button" class="ui-link pack-say-ex" data-i="' + i + '" aria-label="Послушать пример">▶</button> ' + esc(w.ex) + '</div></div>' +
                '<button type="button" class="ui-btn small soft pack-add" data-i="' + i + '"' + (inDict(w.en) ? ' disabled' : '') + '>' + (inDict(w.en) ? '✓ В словаре' : '+ В словарь') + '</button></li>';
        }).join('') + '</ul>';
        var m = modal('iris-pack', top + body);
        if (!m._wired) {
            m._wired = true;
            m.addEventListener('click', function (e) {
                var t = e.target, L = PACKS[packArea] || [];
                var b;
                if ((b = t.closest('.pack-say'))) { speak(L[b.dataset.i].en); return; }
                if ((b = t.closest('.pack-say-ex'))) { speak(L[b.dataset.i].ex); return; }
                if ((b = t.closest('.pack-add'))) {
                    var w = L[b.dataset.i];
                    try { C.addWord(w.en, w.ru, w.ex, 'Мои слова · ' + AREAS[packArea][2]); } catch (_) { }
                    b.disabled = true; b.textContent = '✓ В словаре';
                    return;
                }
                if ((b = t.closest('.pack-tab'))) { openPack(packArea, b.dataset.tab); return; }
                if ((b = t.closest('.pt-opt'))) { answer(b); return; }
                if (t.closest('.pt-next')) { trainStep(); return; }
                if (t.closest('.pt-replay')) { speak(train.cur.en); return; }
                if (t.closest('.pt-again')) { openPack(packArea, 'train'); return; }
            });
            m.addEventListener('change', function (e) { if (e.target.closest('.pack-switch')) openPack(e.target.value); });
        }
        if (tab === 'train') startTrain();
    }
    // тренировка: 10 вопросов — «что значит» и «что прозвучало»
    var train = null;
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function startTrain() {
        var L = PACKS[packArea] || [], pr = packProgress(packArea);
        var order = L.slice().sort(function (x, y) { return (pr[x.en] || 0) - (pr[y.en] || 0) + (Math.random() - 0.5); }).slice(0, 10);
        train = { list: shuffle(order), i: 0, ok: 0 };
        trainStep();
    }
    function trainStep() {
        var box = $('#iris-pack .pack-train'), L = PACKS[packArea] || [];
        if (!box) return;
        if (train.i >= train.list.length) {
            box.innerHTML = '<div class="irv-empty"><div class="irv-big">' + (train.ok >= 8 ? '🏆' : '💪') + '</div><h3>Верно: ' + train.ok + ' из ' + train.list.length + '</h3><p>Слово считается выученным после двух верных ответов.</p><button type="button" class="ui-btn pt-again">Ещё раз</button></div>';
            var k = $('#iris-pack .pack-known b'); if (k) k.textContent = String(known(packArea));
            paintMe();
            return;
        }
        var w = train.list[train.i], listen = train.i % 2 === 1;
        train.cur = w; train.listen = listen;
        var wrong = shuffle(L.filter(function (x) { return x.en !== w.en; })).slice(0, 3);
        var opts = shuffle([w].concat(wrong));
        box.innerHTML = '<div class="irv-meta">' + (train.i + 1) + ' из ' + train.list.length + '</div>' +
            (listen ? '<p class="irv-q">🎧 Что прозвучало? <button type="button" class="ui-btn small soft pt-replay">🔊 Ещё раз</button></p>' : '<p class="irv-q">Что значит <b>' + esc(w.en) + '</b>' + (ipa(w.en) ? ' <span class="ipa">' + esc(ipa(w.en)) + '</span>' : '') + '?</p>') +
            '<div class="irv-opts">' + opts.map(function (o) { return '<button type="button" class="opt pt-opt" data-en="' + esc(o.en) + '">' + esc(listen ? o.en : o.ru) + '</button>'; }).join('') + '</div><div class="irv-fb" aria-live="polite"></div>';
        if (listen) speak(w.en);
    }
    function answer(b) {
        var box = $('#iris-pack .pack-train'), w = train.cur;
        if (!box || box.dataset.lock === String(train.i)) return;
        box.dataset.lock = String(train.i);
        var ok = b.dataset.en === w.en, pr = packProgress(packArea);
        pr[w.en] = Math.max(0, (pr[w.en] || 0) + (ok ? 1 : -1));
        if (ok) train.ok++;
        C.save();
        $$('.pt-opt', box).forEach(function (x) { x.disabled = true; if (x.dataset.en === w.en) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
        $('.irv-fb', box).innerHTML = (ok ? '<div class="irv-ok">✅ Верно!</div>' : '<div class="why-note"><p>✅ <b>' + esc(w.en) + '</b> — ' + esc(w.ru) + '</p></div>') +
            '<p class="pack-ex">' + esc(w.ex) + '</p><div class="irv-actions"><button type="button" class="ui-btn pt-next">Дальше →</button></div>';
        if (!train.listen || !ok) speak(w.en);
        train.i++;
    }
    // ---------- карточка в кабинете ----------
    function paintMe() {
        var home = $('#screen-home');
        if (!home || !isStudent()) { var o = $('#iris-me'); if (o) o.remove(); return; }
        var intro = $('.home-intro', home);
        if (!intro) return;
        var box = $('#iris-me', home), anchor = $('.hw-home', home) || intro;
        if (!box) { box = document.createElement('section'); box.id = 'iris-me'; box.className = 'panel iris-me'; }
        if (anchor.nextElementSibling !== box) anchor.insertAdjacentElement('afterend', box); // после домашки: она важнее
        var g = goal(), area = g ? areaFor(g) : '', a = AREAS[area];
        var rv = window.irisReview, due = rv ? rv.due() : 0, total = rv ? rv.total() : 0;
        box.innerHTML = '<div class="me-row"><div><div class="kicker">МОЯ ЦЕЛЬ</div><b>' + (g ? esc(goalLabel(g)) : 'Расскажите, для чего вам английский') + '</b>' + (g && g.text ? '<div class="me-sub">' + esc(g.text) + '</div>' : '') + '</div><button type="button" class="ui-btn small ' + (g ? 'soft' : '') + ' me-goal">' + (g ? 'Изменить' : '🎯 Выбрать цель') + '</button></div>' +
            '<div class="me-tiles">' +
            (a ? '<button type="button" class="me-tile me-pack"><span class="me-emo">' + a[1] + '</span><span><b>Слова: ' + esc(a[2]) + '</b><small>выучено ' + known(area) + ' из ' + (PACKS[area] || []).length + ' · с транскрипцией и озвучкой</small></span></button>' : '') +
            '<button type="button" class="me-tile irv-home' + (due ? ' has-due' : '') + '"><span class="me-emo">🔁</span><span><b>Работа над ошибками' + (due ? ' · <span class="irv-count">' + due + '</span>' : '') + '</b><small>' + (due ? 'задания на сегодня — 3–5 минут' : total ? 'на сегодня всё, в очереди ' + total : 'ошибки из домашки появятся здесь') + '</small></span></button>' +
            '</div>';
    }
    window.irisPaintMe = paintMe;
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('.me-goal')) openGoal();
        else if (t.closest('.me-pack')) openPack();
        else if (t.closest('.irv-home') && window.irisReview) window.irisReview.open();
    });
    // первое знакомство: окно цели показываем один раз (потом — не чаще раза в три дня, если нажали «Позже»)
    function maybeAsk() {
        if (!isStudent() || goal()) return;
        var home = $('#screen-home');
        if (!home || home.hidden) return;
        var later = 0;
        try { later = Number(localStorage.getItem('iris-goal-later:' + C.state().profile)) || 0; } catch (_) { }
        if (Date.now() - later < 3 * 864e5) return;
        if ($$('.irv').some(function (x) { return !x.hidden; })) return;
        openGoal();
    }
    function tick() {
        try { injectFields(); } catch (_) { }
        try { paintMe(); } catch (_) { }
    }
    var obs = new MutationObserver(function () {
        var h = $('#screen-home'), me = h && $('#iris-me', h), hw = h && $('.hw-home', h);
        if (h && $('.home-intro', h) && (!me || (hw && hw.nextElementSibling !== me))) tick();
    });
    function boot() {
        var h = $('#screen-home');
        if (h) obs.observe(h, { childList: true });
        tick();
        setTimeout(maybeAsk, 1800);
        window.addEventListener('hashchange', function () { setTimeout(tick, 60); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.irisGoal = { open: openGoal, pack: openPack, label: function () { return goalText(goal()); } };
})();
