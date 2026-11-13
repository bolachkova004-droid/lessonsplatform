/* 🔁 Ошибка в задании → объяснение «почему не так» + задание попадает в «Работу над ошибками».
   Повторение: сразу, потом через 1, 3 и 7 дней; после трёх верных ответов подряд задание считается усвоенным. */
(function () {
    'use strict';
    var C = window.__irisCore;
    if (!C) return;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var DAY = 864e5, STEPS = [0, 1, 3, 7];
    var isTeacher = function () { var st = C.state(); return st.role === 'teacher' || document.body.classList.contains('teacher-access'); };
    // очередь хранится в «fields» (ключ iris-rv) — так она синхронизируется между устройствами ученика
    function store() {
        var f = C.profile().fields, r = f['iris-rv'];
        if (!r || typeof r !== 'object') r = f['iris-rv'] = { value: '', status: '', earned: false };
        if (!r.items || typeof r.items !== 'object') r.items = {};
        if (typeof r.mastered !== 'number') r.mastered = 0;
        return r;
    }
    var LESSONS = null;
    function lessonTitle(id) {
        if (!LESSONS) { try { LESSONS = JSON.parse(($('#platform-data') || {}).textContent || '[]'); } catch (_) { LESSONS = []; } }
        var list = Array.isArray(LESSONS) ? LESSONS : (LESSONS.lessons || []);
        for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i].title || '';
        return '';
    }
    function paneOf(el) { var st = el.closest('section.step'); return st && st.parentElement && st.parentElement.parentElement; }
    function stepTitle(el) {
        var st = el.closest('section.step'); if (!st) return '';
        var ex = el.closest('.ex, .mc'), h = null, n = ex;
        while (n && n !== st) { var p = n.previousElementSibling; while (p) { if (/^H[2-4]$/.test(p.tagName)) { h = p; break; } p = p.previousElementSibling; } if (h) break; n = n.parentElement; }
        return (h ? h.textContent : st.getAttribute('data-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    }
    // текст вокруг пропуска: что до, что после, всё предложение с ___
    function context(f) {
        var host = f.closest('li, tr, p, td') || f.parentElement;
        var before = '', after = '', seen = false, sentence = '';
        var walk = function (node) {
            if (node === f) { seen = true; sentence += ' ___ '; return; }
            if (node.nodeType === 3) { if (seen) after += node.nodeValue; else before += node.nodeValue; sentence += node.nodeValue; return; }
            if (node.nodeType !== 1) return;
            if (node.matches('.why-note, .near-note, .chips, .order-words, .result, .ex-actions, .irv-added, button, .fb-inline')) return;
            if (node.matches('input, select, textarea')) { sentence += ' … '; if (seen) after += ' … '; else before += ' … '; return; }
            for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
        };
        walk(host);
        var clean = function (s) { return s.replace(/\s+/g, ' ').trim(); };
        var b = clean(before), a = clean(after);
        var cut = Math.max(b.lastIndexOf('. '), b.lastIndexOf('? '), b.lastIndexOf('! '));
        if (cut > 0) b = b.slice(cut + 2);
        var hint = (a.match(/^\(([^)]{1,40})\)/) || [])[1] || '';
        if (hint) a = a.replace(/^\([^)]*\)\s*/, '');
        return { before: b.replace(/^\d+[.)]\s*/, ''), after: a, sentence: clean(sentence).replace(/^\d+[.)]\s*/, ''), hint: hint, placeholder: f.getAttribute('placeholder') || '' };
    }
    function answersOf(f) { return String(f.dataset.a || '').split('|').filter(Boolean); }
    function noteHtml(r, opts) {
        opts = opts || {};
        return '<div class="why-note" role="note"><div class="why-head">💡 Почему не так</div>' + r.html +
            '<details class="why-ans"><summary>Показать правильный ответ</summary><p>✅ ' + (r.diff || esc(r.answer)) + '</p></details>' +
            (opts.review === false ? '' : '<p class="why-rev">🔁 Задание добавлено в «Работу над ошибками» — повторим сегодня и через несколько дней.</p>') + '</div>';
    }
    function addItem(item) {
        var R = store(), old = R.items[item.k];
        item.added = old ? old.added : Date.now();
        item.box = 0; item.due = Date.now(); item.miss = (old ? old.miss || 0 : 0) + 1;
        R.items[item.k] = item;
        C.save();
        paintBadges();
    }
    // ---------- пропуски (input / select) ----------
    function explainField(f) {
        var ctx = context(f), r = window.irisExplain(f.value, answersOf(f), ctx);
        return { r: r, ctx: ctx };
    }
    function onChecked(ex) {
        if (isTeacher()) return;
        $$('.why-note', ex).forEach(function (n) { n.remove(); });
        var added = 0;
        $$('.gap[data-a].bad', ex).forEach(function (f) {
            if (f.closest('.hunt')) return;
            var x = explainField(f);
            if (!x.r) return;
            var note = f.nextElementSibling && f.nextElementSibling.classList.contains('near-note');
            var host = f.closest('li, td') || f.parentElement;
            var div = document.createElement('div');
            div.innerHTML = noteHtml(note ? { html: '', answer: x.r.answer, diff: x.r.diff } : x.r);
            var node = div.firstChild;
            if (note) node.querySelector('.why-head').remove();
            node.dataset.for = f.dataset.field || f.id;
            host.appendChild(node);
            var pane = paneOf(f);
            addItem({
                k: 'f:' + (f.dataset.field || f.id), kind: f.tagName === 'SELECT' ? 'select' : 'gap', lid: pane ? pane.id : '',
                q: x.ctx.sentence, hint: x.ctx.hint || (f.tagName === 'SELECT' ? '' : x.ctx.placeholder), task: stepTitle(f),
                a: answersOf(f), wrong: f.value,
                opts: f.tagName === 'SELECT' ? $$('option', f).map(function (o) { return o.value || o.textContent; }).filter(Boolean) : null,
                words: (function () { var ow = (f.closest('li') || f.parentElement).querySelector('.order-words'); return ow ? String(ow.dataset.words || '').split('|') : null; })()
            });
            added++;
        });
        paintAdded(ex, added);
    }
    function paintAdded(ex, n) {
        var bar = $('.ex-actions', ex) || ex, old = $('.irv-added', ex);
        if (old) old.remove();
        if (!n) return;
        bar.insertAdjacentHTML('afterend', '<div class="irv-added">🔁 В «Работу над ошибками» добавлено: <b>' + n + '</b>. <button type="button" class="ui-btn small soft irv-now">Повторить сейчас</button></div>');
    }
    // ---------- выбор ответа (.mc) ----------
    function onChoice(mc) {
        if (isTeacher()) return;
        setTimeout(function () {
            var bads = $$('.opt.bad', mc);
            var old = $('.why-note', mc);
            if (!bads.length) { if (old && $('.opt.ok', mc)) old.remove(); return; }
            if (old) return;
            var okBtn = $('.opt[data-ok]', mc), chosen = bads[bads.length - 1];
            if (!okBtn) return;
            var q = ($('.q', mc) || {}).textContent || '', opts = $$('.opt', mc).map(function (b) { return b.textContent.trim(); });
            var okText = okBtn.textContent.trim(), bad = chosen.textContent.trim(), html = '';
            if (/^(true|false|верно|неверно|yes|no|t|f|not given)$/i.test(okText)) {
                var step = mc.closest('section.step'), ev = window.irisExplainEvidence(q.replace(/^\d+\.\s*/, ''), step);
                html = ev ? '<p>📖 Найдите это место в тексте: <i>«' + esc(ev) + '»</i></p>' : '<p>Перечитайте текст ещё раз — ответ там есть.</p>';
            } else {
                var qq = q.replace(/^\d+\.\s*/, ''), parts = qq.split(/_{2,}|…{1,}|\.{3,}/);
                var r = window.irisExplain(bad, [okText], { before: parts[0] || '', after: parts[1] || '', sentence: qq });
                html = r ? r.html : '';
            }
            var r2 = { html: html, answer: okText, diff: esc(okText) };
            mc.insertAdjacentHTML('beforeend', noteHtml(r2));
            var pane = paneOf(mc);
            addItem({ k: 'c:' + (mc.dataset.choice || ''), kind: 'mc', lid: pane ? pane.id : '', q: q.replace(/^\d+\.\s*/, ''), task: stepTitle(mc), a: [okText], opts: opts, wrong: bad, ctxText: html });
        }, 30);
    }
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('.irv-now')) { openReview(); return; }
        var btn = t.closest('.ex .check');
        if (btn) { var ex = btn.closest('.ex'); setTimeout(function () { onChecked(ex); }, 40); return; }
        var opt = t.closest('.mc .opt');
        if (opt && opt.closest('.mc').dataset.choice) onChoice(opt.closest('.mc'));
    });
    document.addEventListener('input', function (e) {
        var f = e.target;
        if (!f || !f.matches || !f.matches('.gap[data-a]')) return;
        var host = f.closest('li, td') || f.parentElement;
        $$('.why-note', host).forEach(function (n) { if (n.dataset.for === (f.dataset.field || f.id)) n.remove(); });
    }, true);

    // ---------- окно «Работа над ошибками» ----------
    function dueList() {
        var R = store(), now = Date.now();
        return Object.keys(R.items).map(function (k) { return R.items[k]; }).filter(function (x) { return x && x.due <= now; }).sort(function (a, b) { return a.due - b.due; });
    }
    var session = null;
    function openReview(keys) {
        var list = dueList();
        if (keys) list = list.filter(function (x) { return keys.indexOf(x.k) >= 0; });
        list = list.slice(0, 12);
        session = { list: list, i: 0, ok: 0, retried: {} };
        var box = $('#iris-review');
        if (box) box.dataset.done = '';
        if (!box) {
            box = document.createElement('div');
            box.id = 'iris-review';
            box.className = 'irv';
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-modal', 'true');
            box.setAttribute('aria-label', 'Работа над ошибками');
            document.body.appendChild(box);
            box.addEventListener('click', onReviewClick);
            box.addEventListener('submit', function (e) { e.preventDefault(); if (box.dataset.done === '1') { box.dataset.done = ''; session.i++; paintCard(); } else checkCurrent(); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeReview(); });
        }
        box.hidden = false;
        document.body.classList.add('irv-open');
        paintCard();
    }
    function closeReview() { var b = $('#iris-review'); if (b) b.hidden = true; document.body.classList.remove('irv-open'); paintBadges(); }
    function shell(inner) {
        var s = session, n = s.list.length;
        return '<div class="irv-card"><div class="irv-top"><div><div class="kicker">ПОВТОРЕНИЕ</div><h2>🔁 Работа над ошибками</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>' +
            (n ? '<div class="irv-bar"><span style="width:' + Math.round(Math.min(s.i, n) / n * 100) + '%"></span></div>' : '') + inner + '</div>';
    }
    function promptHtml(it) {
        var q = esc(it.q || ''), opts = function (list) { return '<div class="irv-opts">' + list.map(function (o) { return '<button type="button" class="opt irv-opt">' + esc(o) + '</button>'; }).join('') + '</div>'; };
        var words = it.words ? '<p class="irv-hint">Слова: ' + it.words.map(function (w) { return '<span class="irv-chip">' + esc(w) + '</span>'; }).join(' ') + '</p>' : '';
        if (it.kind === 'gap') {
            var input = '<input class="field irv-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ваш ответ" placeholder="' + esc(it.hint || 'Ваш ответ') + '">';
            var inline = (it.a[0] || '').split(' ').length <= 3 && (q.match(/___/g) || []).length === 1 && !/^\s*___\s*$/.test(q);
            var body = inline ? '<p class="irv-q">' + q.replace('___', input) + '</p>' : '<p class="irv-q">' + q.replace(/\s*___\s*$/, '').replace(/^\s*___\s*/, '') + '</p>' + input;
            return '<form class="irv-form">' + body + words + '</form>';
        }
        if (it.kind === 'select') return '<p class="irv-q">' + q.replace('___', '<span class="irv-blank">____</span>') + '</p>' + opts(shuffle(it.opts || []));
        return '<p class="irv-q">' + q + '</p>' + opts(it.opts || []);
    }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function paintCard() {
        var box = $('#iris-review'), s = session;
        if (!s.list.length) {
            var R = store(), all = Object.keys(R.items).length;
            var next = Object.keys(R.items).map(function (k) { return R.items[k].due; }).sort()[0];
            box.innerHTML = shell('<div class="irv-empty"><div class="irv-big">🌿</div><h3>На сегодня всё повторено</h3><p>' + (all ? 'В очереди: ' + all + '. Следующее повторение — ' + when(next) + '.' : 'Ошибок пока нет. Когда в задании что-то не получится, оно появится здесь.') + '</p>' + (R.mastered ? '<p>Усвоено заданий: <b>' + R.mastered + '</b> 🎉</p>' : '') + '<button type="button" class="ui-btn irv-close">Готово</button></div>');
            return;
        }
        if (s.i >= s.list.length) {
            box.innerHTML = shell('<div class="irv-empty"><div class="irv-big">' + (s.ok === s.list.length ? '🏆' : '💪') + '</div><h3>Верно: ' + s.ok + ' из ' + s.list.length + '</h3><p>Задания вернутся через 1, 3 и 7 дней — так правило запомнится надолго. После трёх верных ответов подряд задание уходит из списка.</p><button type="button" class="ui-btn irv-close">Готово</button></div>');
            try { C.save(); } catch (_) { }
            paintBadges();
            return;
        }
        var it = s.list[s.i];
        var title = lessonTitle(it.lid);
        box.innerHTML = shell('<div class="irv-meta">' + (s.i + 1) + ' из ' + s.list.length + (title ? ' · ' + esc(title) : '') + '</div>' + (it.task ? '<div class="irv-task">' + esc(it.task) + '</div>' : '') +
            '<div class="irv-body">' + promptHtml(it) + '</div><div class="irv-fb" aria-live="polite"></div>' +
            '<div class="irv-actions">' + (it.kind === 'gap' ? '<button type="button" class="ui-btn irv-check">Проверить</button>' : '') + '<button type="button" class="ui-link irv-skip">Пропустить</button></div>' +
            (it.wrong ? '<p class="irv-was">В прошлый раз: <s>' + esc(it.wrong) + '</s></p>' : ''));
        var inp = $('.irv-in', box);
        if (inp) setTimeout(function () { try { inp.focus(); } catch (_) { } }, 50);
    }
    function when(t) {
        if (!t) return 'позже';
        var d = Math.round((t - Date.now()) / DAY);
        return d <= 0 ? 'сегодня' : d === 1 ? 'завтра' : 'через ' + d + ' ' + (d < 5 ? 'дня' : 'дней');
    }
    function grade(it, value, okFlag) {
        var R = store(), cur = R.items[it.k];
        if (!cur) return;
        if (okFlag) {
            cur.box = (cur.box || 0) + 1;
            if (cur.box >= STEPS.length) { delete R.items[it.k]; R.mastered++; }
            else cur.due = Date.now() + STEPS[cur.box] * DAY - 36e5;
        } else {
            cur.box = 0; cur.wrong = value; cur.miss = (cur.miss || 0) + 1;
            cur.due = Date.now() + (session.retried[it.k] ? DAY - 36e5 : 0);
            if (!session.retried[it.k]) { session.retried[it.k] = 1; session.list.push(cur); }
        }
        C.save();
    }
    function checkCurrent(choice) {
        var box = $('#iris-review'), it = session.list[session.i];
        if (!it || box.dataset.done === '1') return;
        var value = choice != null ? choice : (($('.irv-in', box) || {}).value || '');
        if (!String(value).trim()) { var i0 = $('.irv-in', box); if (i0) i0.focus(); return; }
        var n = C.norm, ok = it.a.some(function (a) { return n(a) === n(value); });
        box.dataset.done = '1';
        grade(it, value, ok);
        if (ok) session.ok++;
        var fb = $('.irv-fb', box), html;
        if (ok) html = '<div class="irv-ok">✅ Верно!' + (store().items[it.k] ? ' Повторим ' + when(store().items[it.k].due) + '.' : ' Задание усвоено 🎉') + '</div>';
        else {
            var r = it.kind === 'mc' && it.ctxText ? { html: it.ctxText, diff: esc(it.a[0]) } : window.irisExplain(value, it.a, { sentence: it.q, before: (it.q || '').split('___')[0] || '', after: (it.q || '').split('___')[1] || '' });
            html = '<div class="why-note"><div class="why-head">💡 Почему не так</div>' + (r ? r.html : '') + '<p>✅ Правильно: ' + (r && r.diff ? r.diff : esc(it.a[0])) + '</p>' + (session.retried[it.k] === 1 && session.list.indexOf(it, session.i + 1) > 0 ? '<p class="why-rev">Вернёмся к этому заданию в конце.</p>' : '') + '</div>';
        }
        fb.innerHTML = html;
        $$('.irv-opt', box).forEach(function (b) { b.disabled = true; if (it.a.some(function (a) { return n(a) === n(b.textContent); })) b.classList.add('ok'); else if (n(b.textContent) === n(value)) b.classList.add('bad'); });
        var inp = $('.irv-in', box); if (inp) { inp.readOnly = true; inp.classList.add(ok ? 'ok' : 'bad'); }
        var acts = $('.irv-actions', box);
        acts.innerHTML = '<button type="button" class="ui-btn irv-next">' + (session.i + 1 < session.list.length ? 'Дальше →' : 'Завершить') + '</button>';
        setTimeout(function () { var b = $('.irv-next', box); if (b) b.focus(); }, 30);
    }
    function onReviewClick(e) {
        var t = e.target, box = $('#iris-review');
        if (t === box || t.closest('.irv-close')) { closeReview(); return; }
        if (t.closest('.irv-check')) { checkCurrent(); return; }
        var o = t.closest('.irv-opt');
        if (o && !o.disabled) { checkCurrent(o.textContent.trim()); return; }
        if (t.closest('.irv-skip') || t.closest('.irv-next')) { box.dataset.done = ''; session.i++; paintCard(); return; }
    }
    function dueCount() { return dueList().length; }
    function totalCount() { return Object.keys(store().items).length; }
    function paintBadges() {
        var n = dueCount();
        $$('.irv-count').forEach(function (el) { el.textContent = String(n); });
        $$('.irv-home').forEach(function (el) { el.classList.toggle('has-due', n > 0); });
        if (window.irisPaintMe) try { window.irisPaintMe(); } catch (_) { }
    }
    window.irisReview = { open: openReview, due: dueCount, total: totalCount, paint: paintBadges };
})();
