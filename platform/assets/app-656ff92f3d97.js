'use strict';
(function () {
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
    const esc = s => String(s !== null && s !== void 0 ? s : '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const DATA = JSON.parse($('#platform-data').textContent);
    const VOCAB = JSON.parse($('#vocabulary-data').textContent);
    const KEY = 'iris-classroom-2026-v1';
    const icons = {
        home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
        class: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 21h10M12 18v3m-3-12 5 2-5 2z"/>',
        book: '<path d="M12 6C8 3 3 4 3 4v15s5-1 9 2c4-3 9-2 9-2V4s-5-1-9 2v15"/>',
        words: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h5m-5 4 2 2 5-4"/>',
        teacher: '<path d="M4 21v-5M12 21v-7M20 21v-5M3 7l9-4 9 4-9 4zM6 9v4c4 3 8 3 12 0V9"/>',
        arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
        back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
        close: '<path d="m6 6 12 12M18 6 6 18"/>',
        sound: '<path d="m11 5-6 4H2v6h3l6 4zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        trash: '<path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
        download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
        edit: '<path d="m4 16 12-12 4 4L8 20H4zM13 7l4 4"/>',
        link: '<path d="m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m4 2 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 -1)"/>',
        search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
        note: '<path d="M8 3h8v4H8zM8 5H4v16h16V5h-4M8 11h8M8 15h6"/>'
    };
    function icon(name) { return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.book}</svg>`; }
    $$('[data-icon]').forEach(b => b.insertAdjacentHTML('afterbegin', icon(b.dataset.icon)));
    let state;
    try {
        state = JSON.parse(localStorage.getItem(KEY) || 'null');
    }
    catch (_) {
        state = null;
    }
    if (!state || typeof state !== 'object' || state.version !== 1 || !state.profiles || typeof state.profiles !== 'object' || Array.isArray(state.profiles)) {
        state = { version: 1, profile: DATA[0].id, role: 'student', profiles: {}, materials: [], translations: {} };
    }
    if (!DATA.some(d => d.id === state.profile))
        state.profile = DATA[0].id;
    if (!['teacher', 'student'].includes(state.role))
        state.role = 'student';
    state.materials = Array.isArray(state.materials) ? state.materials.filter(validMaterial) : [];
    if (!state.translations || typeof state.translations !== 'object')
        state.translations = {};
    let screen = 'home', currentLesson = null, currentSection = null, toastTimer, selectionTimer;
    let popupSerial = 0, requestController = null, wordQuery = '', review = null, previousModalFocus = null;
    const activeTimers = new Map();
    const popup = $('#translation-popup');
    const meta = () => DATA.find(d => d.id === state.profile);
    window.__irisCore = { profile: function () { return profile(); }, save: function () { return save(); }, notify: function (m) { return notify(m); }, norm: function (x) { return norm(x); }, state: function () { return state; }, addWord: function (a, b, c, d) { return addWord(a, b, c, d); } }; /*iris-core-hook*/
    function profile() {
        let p = state.profiles[state.profile];
        if (!p || typeof p !== 'object')
            p = state.profiles[state.profile] = {};
        ['fields', 'choices', 'flips', 'pickers', 'completed', 'steps'].forEach(k => { if (!p[k] || typeof p[k] !== 'object')
            p[k] = {}; });
        if (!Array.isArray(p.words))
            p.words = [];
        return p;
    }
    function notify(message) { const t = $('#toast'); t.textContent = message; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3400); }
    function save() {
        const s = $('#save-state');
        try {
            localStorage.setItem(KEY, JSON.stringify(state));
            s.textContent = 'Сохранено в браузере';
            s.classList.remove('failed');
            return true;
        }
        catch (_) {
            s.textContent = 'Сохранение недоступно';
            s.classList.add('failed');
            notify('Браузер не сохраняет данные. Скачай ответы перед закрытием страницы.');
            return false;
        }
    }
    const norm = s => String(s !== null && s !== void 0 ? s : '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\bcan't\b/g, 'cannot').replace(/\bwon't\b/g, 'will not').replace(/\b(don't|doesn't|didn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|couldn't|shouldn't)\b/g, s => ({ "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not', "wouldn't": 'would not', "couldn't": 'could not', "shouldn't": 'should not' }[s])).replace(/\b(i'm|you're|we're|they're|i've|we've|they've|i'll|he'll|she'll|we'll|they'll)\b/g, s => ({ "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are', "i've": 'i have', "we've": 'we have', "they've": 'they have', "i'll": 'i will', "he'll": 'he will', "she'll": 'she will', "we'll": 'we will', "they'll": 'they will' }[s])).replace(/[.,!?;:"]/g, ' ').replace(/\s+/g, ' ').trim();
    const lookupKey = s => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/^[\s.,!?;:"“”]+|[\s.,!?;:"“”]+$/g, '').replace(/\s+/g, ' ').trim();
    function allLessons() { return [...DATA, ...state.materials.map(m => (Object.assign(Object.assign({}, m), { owner: m.owner, category: 'Авторский урок', minutes: '60 min', grammar: m.description || 'Reading & vocabulary', sections: [] })))]; }
    function availableLessons() { return allLessons().filter(m => state.role === 'teacher' || document.body.classList.contains('teacher-access') || m.owner === state.profile); }
    function paneFor(id) { return document.getElementById(id); }
    function sectionsFor(id) { return $$('main > section.step', paneFor(id)); }
    function lessonMeta(id) { return allLessons().find(d => d.id === id); }
    function completedCount(id) { var _a; const p = state.profiles[(_a = lessonMeta(id)) === null || _a === void 0 ? void 0 : _a.owner] || {}; return sectionsFor(id).filter(s => { var _a; return (_a = p.completed) === null || _a === void 0 ? void 0 : _a[s.id]; }).length; }
    function progress(id) { const total = sectionsFor(id).length; return total ? Math.round(completedCount(id) / total * 100) : 0; }
    function stats() { const p = profile(); const good = Object.values(p.fields).filter(f => f && f.status === 'ok').length + Object.values(p.choices).filter(c => c && c.correct).length; const points = Object.values(p.fields).filter(f => f && f.earned).length * 10 + Object.values(p.choices).filter(c => c && c.earned).length * 10; return { good, points, stages: Object.values(p.completed).filter(Boolean).length, words: p.words.length }; }
    function lessonCard(m) { var _a; return `<article class="material-card"><div class="card-top"><span class="pill">${esc(m.category || m.level)}</span><span>${esc(((_a = DATA.find(d => d.id === m.owner)) === null || _a === void 0 ? void 0 : _a.name) || meta().name)}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.grammar || m.description)}</p><div class="small-progress" aria-label="Завершено ${progress(m.id)}%"><div style="width:${progress(m.id)}%"></div></div><div class="card-bottom"><span>${completedCount(m.id)} / ${sectionsFor(m.id).length} этапов · ${esc(m.minutes || '60 min')}</span><button class="ui-link" data-open="${esc(m.id)}">Открыть ${icon('arrow')}</button></div></article>`; }
    function updateChrome() {
        const m = meta();
        $('#profile-select').value = m.id;
        $('#profile-avatar').textContent = m.initials;
        $('#mode-label').textContent = state.role === 'teacher' ? 'Режим ученика' : 'Режим преподавателя';
        $('#teacher-nav').hidden = state.role !== 'teacher';
        $('#builder-nav').hidden = state.role !== 'teacher';
        $('#nav-word-count').textContent = profile().words.length;
        $$('.app-nav [data-screen]').forEach(b => { const active = b.dataset.screen === screen; b.classList.toggle('active', active); b.setAttribute('aria-current', active ? 'page' : 'false'); });
        const labels = { home: 'Моё пространство', lesson: 'Интерактивный класс', words: 'Мой словарь', library: 'Библиотека', teacher: 'Планы преподавателя', builder: 'Конструктор' };
        $('#breadcrumb').textContent = labels[screen] || 'Моё пространство';
    }
    function hidePopup() { popup.hidden = true; popupSerial++; requestController === null || requestController === void 0 ? void 0 : requestController.abort(); requestController = null; }
    function stopTimers() { activeTimers.forEach(t => { if (t.interval) {
        t.left = Math.max(0, Math.ceil((t.deadline - Date.now()) / 1000));
        clearInterval(t.interval);
        t.interval = null;
        t.draw();
    } }); }
    function resetScreens() { hidePopup(); stopTimers(); $$('.app-screen').forEach(s => { s.hidden = true; }); $$('#lesson-panels > .pane').forEach(p => { p.hidden = true; }); $('#teacher').hidden = true; }
    function route(next, replaceHash = true) {
        if (['teacher', 'builder'].includes(next) && state.role !== 'teacher')
            next = 'home';
        if (next === 'lesson') {
            openLesson(profile().lastLesson || meta().id);
            return;
        }
        resetScreens();
        screen = next;
        currentLesson = currentSection = null;
        if (next === 'home')
            renderHome();
        if (next === 'library')
            renderLibrary();
        if (next === 'words')
            renderWords();
        if (next === 'teacher') {
            $('#screen-teacher').hidden = false;
            $('#teacher').hidden = false;
        }
        if (next === 'builder')
            renderBuilder();
        updateChrome();
        if (replaceHash)
            history.replaceState(null, '', '#' + next);
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
    function selectProfile(id, navigate = true) {
        if (!DATA.some(d => d.id === id))
            return;
        stopTimers();
        state.profile = id;
        review = null;
        wordQuery = '';
        profile();
        hydrate();
        save();
        updateChrome();
        if (navigate)
            route('home');
    }
    function renderHome() {
        const p = profile(), m = meta(), st = stats();
        let lesson = lessonMeta(p.lastLesson);
        if (!lesson || lesson.owner !== state.profile)
            lesson = m;
        const percentage = progress(lesson.id);
        $('#screen-home').innerHTML = `<div class="home-intro"><div class="kicker">IRIS SCHOOL · ЛИЧНОЕ ПРОСТРАНСТВО</div><h1>Привет, ${esc(m.greeting)}.</h1><p>Здесь твои уроки, заметки и слова. Продолжим с того места, где остановились.</p></div><div class="welcome-row"><article class="next-lesson"><div class="book-cover" aria-hidden="true"><small>IRIS / ENGLISH</small><strong>One step.<br>One conversation.</strong><span>YOUR LEARNING SPACE</span></div><div class="lesson-feature"><div class="kicker">ТВОЙ ТЕКУЩИЙ УРОК</div><h2>${esc(lesson.title)}</h2><p>${esc(lesson.grammar || lesson.description)}</p><div class="progress-caption"><span>${completedCount(lesson.id)} из ${sectionsFor(lesson.id).length} этапов завершено</span><span>${percentage}%</span></div><div class="small-progress"><div style="width:${percentage}%"></div></div><button class="ui-btn" data-open="${esc(lesson.id)}">${percentage ? 'Продолжить урок' : 'Начать урок'} ${icon('arrow')}</button></div></article><aside class="panel"><h2>Всё рядом с уроком</h2><ul class="checklist"><li><span>1</span><div>Открой этап и работай в своём темпе.</div></li><li><span>2</span><div>Выделяй слова: перевод появится рядом.</div></li><li><span>3</span><div>Сохраняй полезные фразы и возвращайся к ним.</div></li></ul><p class="help-text" style="margin-top:20px">Ответы сохраняются на этом устройстве. Переключение профиля сохраняет отдельные данные каждого.</p></aside></div><div class="stat-row"><div class="stat-box"><strong>${st.stages}</strong><span>этапов завершено</span></div><div class="stat-box"><strong>${st.good}</strong><span>верных ответов</span></div><div class="stat-box"><strong>${st.words}</strong><span>слов в словаре</span></div></div><div class="section-title"><h2>${state.role === 'teacher' ? 'Уроки для занятий' : 'Мои материалы'}</h2><button class="ui-link" data-screen="library">Вся библиотека ${icon('arrow')}</button></div><div class="lesson-grid">${availableLessons().map(lessonCard).join('')}</div><div class="data-tools"><button class="ui-link" data-action="export-answers">${icon('download')} Скачать мои ответы</button><span class="help-text">Можно отправить преподавателю после занятия.</span></div>`;
        $('#screen-home').hidden = false;
    }
    function renderLibrary() {
        $('#screen-library').innerHTML = `<div class="screen-heading"><div><div class="kicker">УРОКИ И МАТЕРИАЛЫ</div><h1>Твоя библиотека.</h1><p>Авторские уроки, собранные по темам и учебным задачам.</p></div>${state.role === 'teacher' ? '<button class="ui-btn" data-screen="builder">' + icon('plus') + ' Добавить материал</button>' : ''}</div><div class="lesson-grid">${availableLessons().map(lessonCard).join('')}</div><div class="hint-panel" style="margin-top:24px"><strong>Учебники — следующий этап.</strong><br>Сейчас здесь готовые персональные уроки. Через конструктор можно добавить текст с вопросом и домашним заданием.</div>`;
        $('#screen-library').hidden = false;
    }
    function initializePane(pane) {
        if (pane.dataset.initialized)
            return;
        pane.dataset.initialized = '1';
        $$('input.gap,textarea.gap,select.gap,textarea.lesson-note,textarea.homework-text', pane).forEach((f, i) => {
            var _a;
            const k = f.id || `${pane.id}-field-${i}`;
            f.dataset.field = k;
            if (!f.id)
                f.id = k;
            if (!f.getAttribute('aria-label') && !(window.__lblFor || (window.__lblFor = new Set(Array.from(document.querySelectorAll('label[for]'), l => l.htmlFor)))).has(k))
                f.setAttribute('aria-label', (((_a = f.closest('li,tr')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Ответ или заметка').replace(/\s+/g, ' ').trim().slice(0, 160));
            if (f.matches('input.gap[data-a]:not(.line)'))
                f.style.width = Math.min(Math.max(Math.max(...f.dataset.a.split('|').map(a => a.length)) + 3, 6), 30) + 'ch';
            f.addEventListener('input', () => { const prev = profile().fields[k] || {}; profile().fields[k] = Object.assign(Object.assign({}, prev), { value: f.value, status: '' }); f.classList.remove('ok', 'bad', 'shown'); f.removeAttribute('aria-invalid'); save(); refreshLessonStats(); });
            f.addEventListener('change', () => { const prev = profile().fields[k] || {}; profile().fields[k] = Object.assign(Object.assign({}, prev), { value: f.value, status: '' }); f.classList.remove('ok', 'bad', 'shown'); f.removeAttribute('aria-invalid'); save(); refreshLessonStats(); });
            if (f.tagName === 'INPUT' && f.closest('.ex'))
                f.addEventListener('keydown', e => { if (e.key === 'Enter') {
                    e.preventDefault();
                    checkEx(f.closest('.ex'));
                } });
        });
        $$('.ex', pane).forEach(ex => {
            var _a, _b, _c;
            (_a = $('.check', ex)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => checkEx(ex));
            (_b = $('.reveal', ex)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => revealEx(ex));
            (_c = $('.result', ex)) === null || _c === void 0 ? void 0 : _c.setAttribute('aria-live', 'polite');
        });
        $$('.mc', pane).forEach((mc, i) => {
            const k = mc.id || `${pane.id}-choice-${i}`;
            mc.dataset.choice = k;
            const out = document.createElement('div');
            out.className = 'mc-result';
            out.setAttribute('aria-live', 'polite');
            mc.appendChild(out);
            $$('.opt', mc).forEach((b, n) => {
                b.type = 'button';
                b.addEventListener('click', () => {
                    const c = profile().choices[k] || { bads: [], attempted: false, correct: false };
                    if (c.correct)
                        return;
                    const correct = b.hasAttribute('data-ok');
                    if (correct) {
                        c.correct = true;
                        c.earned = !c.attempted;
                    }
                    else if (!c.bads.includes(n))
                        c.bads.push(n);
                    c.attempted = true;
                    c.selected = n;
                    profile().choices[k] = c;
                    paintChoice(mc, c);
                    save();
                    refreshLessonStats();
                });
            });
        });
        $$('.flip', pane).forEach((f, i) => {
            const k = `${pane.id}-flip-${i}`;
            f.dataset.flip = k;
            f.type = 'button';
            f.setAttribute('aria-pressed', 'false');
            f.addEventListener('click', () => { const on = f.classList.toggle('flipped'); f.setAttribute('aria-pressed', String(on)); profile().flips[k] = on; save(); });
        });
        $$('.picker', pane).forEach((p, i) => {
            const k = `${pane.id}-picker-${i}`;
            p.dataset.picker = k;
            const items = $$('li', p).map(x => x.innerHTML);
            const btn = $('button', p);
            btn.type = 'button';
            btn.textContent = 'Следующий вопрос';
            btn.addEventListener('click', () => { if (!items.length)
                return; let saved = profile().pickers[k] || { pool: [], current: null }; if (!saved.pool.length)
                saved.pool = items.map((_, n) => n); const index = Math.floor(Math.random() * saved.pool.length); saved.current = saved.pool.splice(index, 1)[0]; profile().pickers[k] = saved; paintPicker(p, saved); save(); });
        });
        $$('.timer', pane).forEach(t => {
            const total = Number(t.dataset.sec), btn = $('button', t), out = $('.t', t);
            btn.type = 'button';
            const o = { left: total, interval: null, deadline: null, draw() { out.textContent = Math.floor(o.left / 60) + ':' + String(o.left % 60).padStart(2, '0'); btn.textContent = o.interval ? 'Пауза' : o.left === 0 ? 'Ещё раз' : o.left < total ? 'Продолжить' : 'Старт'; t.classList.toggle('done', o.left === 0); } };
            btn.addEventListener('click', () => { if (o.interval) {
                o.left = Math.max(0, Math.ceil((o.deadline - Date.now()) / 1000));
                clearInterval(o.interval);
                o.interval = null;
                o.draw();
                return;
            } if (o.left === 0)
                o.left = total; o.deadline = Date.now() + o.left * 1000; o.interval = setInterval(() => { o.left = Math.max(0, Math.ceil((o.deadline - Date.now()) / 1000)); if (o.left === 0) {
                clearInterval(o.interval);
                o.interval = null;
            } o.draw(); }, 250); o.draw(); });
            const reset = document.createElement('button');
            reset.type = 'button';
            reset.className = 'icon-btn';
            reset.setAttribute('aria-label', 'Сбросить таймер');
            reset.innerHTML = icon('back');
            reset.addEventListener('click', () => { clearInterval(o.interval); o.interval = null; o.left = total; o.draw(); });
            t.appendChild(reset);
            o.draw();
            activeTimers.set(t, o);
        });
    }
    function fieldRecord(f) { return profile().fields[f.dataset.field] || { value: f.value || '', status: '', attempted: false, revealed: false, earned: false }; }
    function paintField(f, r) { f.classList.remove('ok', 'bad', 'shown'); if (['ok', 'bad', 'shown'].includes(r.status))
        f.classList.add(r.status); if (r.status === 'bad')
        f.setAttribute('aria-invalid', 'true');
    else
        f.removeAttribute('aria-invalid'); }
    function checkEx(ex) {
        const fields = $$('.gap[data-a]', ex);
        let good = 0, empty = 0;
        fields.forEach(f => { const r = fieldRecord(f), value = norm(f.value); r.value = f.value; if (!value) {
            empty++;
            r.status = '';
        }
        else if (r.revealed && r.value === r.revealedValue) {
            r.status = 'shown';
        }
        else {
            const ok = f.dataset.a.split('|').some(a => norm(a) === value);
            r.status = ok ? 'ok' : 'bad';
            if (ok && !r.attempted && !r.revealed)
                r.earned = true;
            r.attempted = true;
            if (ok)
                good++;
        } profile().fields[f.dataset.field] = r; paintField(f, r); });
        $('.result', ex).textContent = `Верно: ${good} / ${fields.length}${empty ? ' · Без ответа: ' + empty : good === fields.length ? ' · Всё получилось!' : ''}`;
        save();
        refreshLessonStats();
    }
    function revealEx(ex) {
        let shown = 0;
        $$('.gap[data-a]', ex).forEach(f => { const r = fieldRecord(f); if (r.status === 'ok')
            return; f.value = f.dataset.a.split('|')[0]; r.value = f.value; r.revealedValue = f.value; r.status = 'shown'; r.revealed = true; r.attempted = true; profile().fields[f.dataset.field] = r; paintField(f, r); shown++; });
        $('.result', ex).textContent = shown ? 'Показаны ответы для самопроверки. Их можно разобрать с преподавателем.' : 'Все ответы уже верные.';
        save();
        refreshLessonStats();
    }
    function paintChoice(mc, c) {
        $$('.opt', mc).forEach((b, n) => { var _a; b.classList.toggle('ok', !!c.correct && b.hasAttribute('data-ok')); b.classList.toggle('bad', (_a = c.bads) === null || _a === void 0 ? void 0 : _a.includes(n)); b.classList.toggle('selected', c.selected === n); b.disabled = !!c.correct; b.setAttribute('aria-pressed', String(c.selected === n)); });
        $('.mc-result', mc).textContent = c.correct ? 'Верно.' : c.attempted ? 'Этот вариант не подходит. Попробуй ещё раз.' : '';
    }
    function paintPicker(p, s) { const items = $$('li', p); if (Number.isInteger(s.current) && items[s.current])
        $('.shown-q', p).innerHTML = items[s.current].innerHTML; if ($('.count', p))
        $('.count', p).textContent = s.pool ? `${items.length - s.pool.length} / ${items.length}${s.pool.length ? '' : ' · Все вопросы этого круга пройдены'}` : ''; }
    function hydrate() {
        const p = profile();
        $$('#lesson-panels input.gap,#lesson-panels textarea.gap,#lesson-panels select.gap,#lesson-panels textarea.lesson-note,#lesson-panels textarea.homework-text').forEach(f => { const r = p.fields[f.dataset.field] || { value: '', status: '' }; f.value = r.value || ''; paintField(f, r); });
        $$('#lesson-panels .mc').forEach(mc => paintChoice(mc, p.choices[mc.dataset.choice] || { bads: [], correct: false, attempted: false }));
        $$('#lesson-panels .flip').forEach(f => { const on = !!p.flips[f.dataset.flip]; f.classList.toggle('flipped', on); f.setAttribute('aria-pressed', String(on)); });
        $$('#lesson-panels .picker').forEach(pane => { const saved = p.pickers[pane.dataset.picker]; if (saved)
            paintPicker(pane, saved);
        else {
            $('.shown-q', pane).textContent = 'Нажми, чтобы открыть вопрос.';
            if ($('.count', pane))
                $('.count', pane).textContent = '';
        } });
        $$('#lesson-panels .result').forEach(r => { const fields = $$('.gap[data-a]', r.closest('.ex')); const checked = fields.some(f => { var _a; return (_a = p.fields[f.dataset.field]) === null || _a === void 0 ? void 0 : _a.status; }); if (checked) {
            const ok = fields.filter(f => { var _a; return ((_a = p.fields[f.dataset.field]) === null || _a === void 0 ? void 0 : _a.status) === 'ok'; }).length;
            r.textContent = `Верно: ${ok} / ${fields.length}`;
        }
        else
            r.textContent = ''; });
    }
    function openLesson(id, sectionId) {
        var _a;
        const m = lessonMeta(id);
        if (!m) {
            route('home');
            return;
        }
        if (m.owner !== state.profile)
            selectProfile(m.owner, false);
        resetScreens();
        screen = 'lesson';
        currentLesson = id;
        const sections = sectionsFor(id);
        const saved = sectionId || profile().steps[id];
        currentSection = ((_a = sections.find(s => s.id === saved)) === null || _a === void 0 ? void 0 : _a.id) || sections[0].id;
        profile().lastLesson = id;
        profile().steps[id] = currentSection;
        save();
        $('#screen-lesson').hidden = false;
        paneFor(id).hidden = false;
        showSection(false);
        updateChrome();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
    function showSection(scrolling = true) {
        hidePopup();
        stopTimers();
        const sections = sectionsFor(currentLesson), p = profile();
        sections.forEach(s => { s.hidden = s.id !== currentSection; });
        p.steps[currentLesson] = currentSection;
        save();
        refreshLessonStats();
        const section = sections.find(s => s.id === currentSection);
        const pos = sections.indexOf(section), complete = !!p.completed[currentSection];
        $('#lesson-mobile-nav').innerHTML = `<button class="ui-btn outline" data-action="previous-stage" aria-label="Предыдущий этап" ${pos === 0 ? 'disabled' : ''}>${icon('back')}</button><select id="stage-select" aria-label="Этап урока">${sections.map((s, i) => `<option value="${esc(s.id)}" ${s.id === currentSection ? 'selected' : ''}>${i + 1}. ${esc(s.dataset.label)}${p.completed[s.id] ? ' ✓' : ''}</option>`).join('')}</select><button class="ui-btn outline" data-action="next-stage" aria-label="Следующий этап" ${pos === sections.length - 1 ? 'disabled' : ''}>${icon('arrow')}</button>`;
        $('#lesson-footer').innerHTML = `<div class="footer-left"><button class="ui-btn outline" data-action="previous-stage" ${pos === 0 ? 'disabled' : ''}>${icon('back')} Назад</button><span class="save-state">Этап ${pos + 1} из ${sections.length}</span></div><div class="footer-left"><button class="ui-btn ${complete ? 'soft' : 'outline'}" data-action="complete-stage">${icon('check')} ${complete ? 'Этап завершён' : 'Завершить этап'}</button>${pos < sections.length - 1 ? '<button class="ui-btn" data-action="next-stage">Далее ' + icon('arrow') + '</button>' : '<button class="ui-btn" data-screen="home">В кабинет ' + icon('arrow') + '</button>'}</div>`;
        history.replaceState(null, '', '#' + currentSection);
        if (scrolling)
            window.scrollTo({ top: 0, behavior: 'auto' });
    }
    function refreshLessonStats() {
        updateChrome();
        if (screen !== 'lesson' || !currentLesson)
            return;
        const sections = sectionsFor(currentLesson), p = profile(), st = stats();
        $('#lesson-rail').innerHTML = `<p class="rail-title">ПЛАН УРОКА</p><div class="rail-progress">${completedCount(currentLesson)} из ${sections.length} этапов завершено</div><div class="small-progress" style="margin-top:9px"><div style="width:${progress(currentLesson)}%"></div></div><div class="outline-list">${sections.map((s, i) => `<button class="outline-step ${currentSection === s.id ? 'active' : ''} ${p.completed[s.id] ? 'done' : ''}" data-stage="${esc(s.id)}" ${currentSection === s.id ? 'aria-current="step"' : ''}><span class="num">${p.completed[s.id] ? '✓' : String(i + 1).padStart(2, '0')}</span>${esc(s.dataset.label)}</button>`).join('')}</div><div class="rail-note">${icon('check')} ${st.good} ${plural(st.good, 'верный ответ', 'верных ответа', 'верных ответов')}${state.profile === 'milana' ? '<br>' + st.points + ' баллов за первую попытку' : ''}</div><button class="ui-btn soft rail-action" data-screen="words">${icon('words')} Мой словарь · ${p.words.length}</button><button class="ui-btn outline rail-action" data-action="lookup">${icon('search')} Перевести слово</button><p class="rail-note">Выдели слово или короткую фразу в тексте — откроется перевод.</p><button class="ui-link" data-action="share-lesson">${icon('link')} Ссылка на урок</button><br><button class="ui-link" data-action="export-answers">${icon('download')} Скачать ответы</button><div class="reset-tools"><button class="ui-link" data-action="reset-lesson">Начать урок заново</button></div>`;
        const mobile = $('#lesson-mobile-stats');
        if (mobile)
            mobile.innerHTML = `<span>${st.good} ${plural(st.good, 'верный ответ', 'верных ответа', 'верных ответов')}${state.profile === 'milana' ? ' · ' + st.points + ' баллов' : ''}</span><button class="ui-link" data-action="lookup">${icon('search')} Перевод</button>`;
    }
    function moveStage(delta) { const arr = sectionsFor(currentLesson); const pos = arr.findIndex(s => s.id === currentSection); if (arr[pos + delta]) {
        currentSection = arr[pos + delta].id;
        showSection();
    } }
    function validMaterial(m) { return m && m.format === 'iris-lesson' && m.version === 1 && typeof m.id === 'string' && /^custom-[a-z0-9-]{1,80}$/.test(m.id) && DATA.some(d => d.id === m.owner) && typeof m.title === 'string' && m.title.trim().length > 0 && m.title.length <= 140 && typeof m.text === 'string' && m.text.trim().length > 0 && m.text.length <= 20000 && typeof m.question === 'string' && m.question.trim().length > 0 && m.question.length <= 500 && Array.isArray(m.options) && m.options.length === 3 && m.options.every(s => typeof s === 'string' && s.trim() && s.length <= 300) && Number.isInteger(m.correct) && m.correct >= 0 && m.correct < 3 && (m.homework === undefined || typeof m.homework === 'string' && m.homework.length <= 3000) && (m.description === undefined || typeof m.description === 'string' && m.description.length <= 300); }
    function createMaterialPane(m) {
        let pane = paneFor(m.id);
        if (pane)
            pane.remove();
        pane = document.createElement('div');
        pane.className = 'pane';
        pane.id = m.id;
        pane.hidden = true;
        pane.innerHTML = `<header class="hero"><div class="hero-inner"><div class="eyebrow">IRIS SCHOOL · АВТОРСКИЙ УРОК</div><h1>${esc(m.title)}</h1><p class="lead">${esc(m.description || 'Reading, vocabulary & practice')}</p><div class="tags"><span class="tag">${esc(m.level || 'Custom')}</span></div></div></header><main><section class="step" id="${m.id}-reading" data-label="Чтение"><div class="step-head"><h2>Reading</h2></div><div class="reading translation-text">${esc(m.text).split('\n').filter(Boolean).map(t => '<p>' + t + '</p>').join('')}</div></section><section class="step" id="${m.id}-practice" data-label="Практика"><div class="step-head"><h2>Check your understanding</h2></div><div class="mc"><p class="q">${esc(m.question)}</p><div class="opts">${m.options.map((o, i) => `<button class="opt" ${i === m.correct ? 'data-ok' : ''}>${esc(o)}</button>`).join('')}</div></div></section><section class="step" id="${m.id}-homework" data-label="Домашнее задание"><div class="step-head"><h2>Homework</h2></div><p>${esc(m.homework || 'Write a short summary of the text. Use three new words from the lesson.')}</p></section></main>`;
        $('#lesson-panels').appendChild(pane);
        decorateNotes(pane);
        initializePane(pane);
    }
    function decorateNotes(pane) {
        sectionsFor(pane.id).forEach(s => {
            if (s.dataset.notes)
                return;
            s.dataset.notes = '1';
            if (/homework$/.test(s.id)) {
                const d = document.createElement('div');
                d.className = 'homework-response';
                d.innerHTML = `<label for="${esc(s.id)}-response">Мой ответ</label><textarea class="field homework-text" id="${esc(s.id)}-response" placeholder="Напиши ответ здесь. Он сохранится автоматически."></textarea><p class="help-text">Ответ сохраняется сам и приходит преподавателю. Когда закончишь, нажми «Отправить преподавателю».</p>`;
                s.appendChild(d);
            }
            const notes = document.createElement('details');
            notes.className = 'step-notes';
            notes.innerHTML = `<summary>Мои заметки к этапу</summary><textarea class="field lesson-note" id="${esc(s.id)}-notes" aria-label="Мои заметки" placeholder="Полезная фраза, правило или вопрос преподавателю…"></textarea>`;
            s.appendChild(notes);
        });
    }
    function lookupLocal(en) {
        const k = lookupKey(en), user = profile().words.find(w => lookupKey(w.en) === k);
        if (user)
            return { ru: user.ru, example: user.example, source: 'Твой словарь' };
        const keys = [k, k.replace(/^(a |an |to )/, ''), k.replace(/[.!?]$/, '')];
        for (const x of keys) {
            if (VOCAB[x])
                return Object.assign(Object.assign({}, (typeof VOCAB[x] === 'string' ? { ru: VOCAB[x] } : VOCAB[x])), { source: 'Словарь уроков · проверенный перевод' });
        }
        if (state.translations[k] && irisGoodTranslation(state.translations[k], 'ru'))
            return { ru: state.translations[k], source: 'Онлайн-перевод · сохранённая версия' };
        return null;
    }
    function speak(text) { if (window.irisSpeak) {
        window.irisSpeak(text);
        return;
    } if (!('speechSynthesis' in window)) {
        notify('Этот браузер не поддерживает озвучивание.');
        return;
    } window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = .88; window.speechSynthesis.speak(u); }
    function addWord(en, ru, example = '', source = '') {
        en = String(en).trim();
        ru = String(ru).trim();
        if (!en || !ru) {
            notify('Добавь слово и его перевод.');
            return false;
        }
        const p = profile(), k = lookupKey(en), existing = p.words.find(w => lookupKey(w.en) === k);
        if (existing) {
            existing.ru = ru;
            if (example)
                existing.example = example;
            existing.source = source || existing.source;
        }
        else
            p.words.unshift({ id: 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6), en: en.slice(0, 180), ru: ru.slice(0, 500), example: String(example).slice(0, 500), source: String(source).slice(0, 150), learned: false });
        const persisted = save();
        updateChrome();
        if (screen === 'lesson')
            refreshLessonStats();
        if (persisted)
            notify(existing ? 'Перевод обновлён.' : 'Слово добавлено в твой словарь.');
        return true;
    }
    function showLookup(en, rect = null, example = '', autoTranslate = true) {
        var _a, _b;
        hidePopup();
        const token = popupSerial, local = lookupLocal(en), source = currentLesson ? lessonMeta(currentLesson).title : '';
        popup.innerHTML = `<div class="translation-top"><strong>${esc(en)}</strong><button class="icon-btn" data-popup="close" aria-label="Закрыть перевод">${icon('close')}</button></div><p class="translation-meaning" id="translation-meaning">${local ? esc(local.ru) : 'Ищу перевод…'}</p><p class="translation-source" id="translation-source">${local ? esc(local.source) : 'Онлайн-перевод · MyMemory'}</p><form class="translation-form" id="translation-form"><label for="translation-edit">Перевод можно уточнить</label><input class="field" id="translation-edit" value="${esc((local === null || local === void 0 ? void 0 : local.ru) || '')}" placeholder="Введи перевод, если нужно" maxlength="500"><div class="translation-actions"><button class="ui-btn soft small" type="button" data-popup="speak">${icon('sound')} Слушать</button><button class="ui-btn small" type="submit">${icon('plus')} В словарь</button></div></form><details><summary>Другой перевод</summary><button class="ui-btn outline small online-translate" type="button" data-popup="online">Перевести онлайн</button><a class="external-translate" href="https://translate.google.com/?sl=en&amp;tl=ru&amp;text=${encodeURIComponent(en)}&amp;op=translate" target="_blank" rel="noopener noreferrer">Открыть в Google Translate ↗</a></details>`;
        popup.hidden = false;
        popup.style.left = Math.max(12, Math.min(((_a = rect === null || rect === void 0 ? void 0 : rect.left) !== null && _a !== void 0 ? _a : window.innerWidth / 2 - 165), window.innerWidth - 342)) + 'px';
        const h = popup.getBoundingClientRect().height || 310;
        popup.style.top = Math.max(12, Math.min(((_b = rect === null || rect === void 0 ? void 0 : rect.bottom) !== null && _b !== void 0 ? _b : 120) + 10, window.innerHeight - h - 16)) + 'px';
        $('[data-popup="close"]', popup).onclick = hidePopup;
        $('[data-popup="speak"]', popup).onclick = () => speak(en);
        $('#translation-form').onsubmit = e => { e.preventDefault(); const ru = $('#translation-edit').value.trim(); if (!ru) {
            $('#translation-edit').focus();
            return;
        } if (addWord(en, ru, example || (local === null || local === void 0 ? void 0 : local.example) || '', source))
            hidePopup(); };
        $('[data-popup="online"]', popup).onclick = () => onlineTranslate(en, token, true);
        if (!local && autoTranslate)
            onlineTranslate(en, token);
        else if (!local) {
            $('#translation-meaning').textContent = 'Добавь перевод вручную или используй онлайн-перевод.';
        }
    }
    async function onlineTranslate(en, token, force = false) {
        var _a;
        requestController === null || requestController === void 0 ? void 0 : requestController.abort();
        requestController = new AbortController();
        const ctl = requestController, tid = setTimeout(() => ctl.abort(), 6500);
        if (token !== popupSerial)
            return;
        $('#translation-source').textContent = 'Онлайн-перевод · MyMemory';
        if (force)
            $('#translation-meaning').textContent = 'Ищу перевод…';
        try {
            const url = 'https://api.mymemory.translated.net/get?' + new URLSearchParams({ q: en, langpair: 'en|ru' });
            const r = await fetch(url, { signal: ctl.signal, credentials: 'omit' });
            if (!r.ok)
                throw Error('network');
            const data = await r.json();
            if (Number(data.responseStatus) !== 200 || data.quotaFinished || typeof ((_a = data.responseData) === null || _a === void 0 ? void 0 : _a.translatedText) !== 'string')
                throw Error('quota');
            const result = irisPickTranslation(data, 'ru');
            if (!result)
                throw Error('invalid');
            if (token !== popupSerial)
                return;
            $('#translation-meaning').textContent = result;
            $('#translation-source').textContent = 'Онлайн-перевод · проверь значение в контексте';
            const input = $('#translation-edit');
            if (!input.value)
                input.value = result;
            state.translations[lookupKey(en)] = result;
            if (Object.keys(state.translations).length > 250)
                delete state.translations[Object.keys(state.translations)[0]];
            save();
        }
        catch (_) {
            if (token !== popupSerial)
                return;
            $('#translation-meaning').textContent = 'Онлайн-перевод сейчас не отвечает. Впишите перевод сами — слово всё равно сохранится в словаре.';
            $('#translation-source').textContent = 'Введи перевод вручную или открой внешний переводчик.';
        }
        finally {
            clearTimeout(tid);
            if (requestController === ctl)
                requestController = null;
        }
    }
    function selectedContext(sel, text) { var _a; const node = (_a = sel.anchorNode) === null || _a === void 0 ? void 0 : _a.parentElement; const paragraph = node === null || node === void 0 ? void 0 : node.closest('p,li,td'); if (!paragraph)
        return ''; const content = paragraph.textContent.replace(/\s+/g, ' ').trim(); return content.length <= 400 ? content : text; }
    function inspectSelection() {
        var _a, _b, _c, _d, _e;
        if (screen !== 'lesson')
            return;
        const s = window.getSelection();
        if (!s || s.isCollapsed || !s.rangeCount)
            return;
        const en = s.toString().trim().replace(/\s+/g, ' ');
        if (!en || en.length > 160 || !/[a-zA-Z]/.test(en) || /[А-Яа-яЁё]/.test(en))
            return;
        const a = ((_a = s.anchorNode) === null || _a === void 0 ? void 0 : _a.nodeType) === 1 ? s.anchorNode : (_b = s.anchorNode) === null || _b === void 0 ? void 0 : _b.parentElement, b = ((_c = s.focusNode) === null || _c === void 0 ? void 0 : _c.nodeType) === 1 ? s.focusNode : (_d = s.focusNode) === null || _d === void 0 ? void 0 : _d.parentElement;
        if (!(a === null || a === void 0 ? void 0 : a.closest('section.step')) || a.closest('section.step') !== (b === null || b === void 0 ? void 0 : b.closest('section.step')) || a.closest('input,textarea,select,.step-notes,.homework-response'))
            return;
        const step = a.closest('section.step');
        if (step.hidden || !step.closest('.pane') || step.closest('.pane').id !== currentLesson)
            return;
        if (!popup.hidden && ((_e = $('.translation-top strong', popup)) === null || _e === void 0 ? void 0 : _e.textContent) === en)
            return;
        showLookup(en, s.getRangeAt(0).getBoundingClientRect(), selectedContext(s, en));
    }
    function renderWords() {
        if (review) {
            renderReview();
            return;
        }
        const words = profile().words.filter(w => (w.en + ' ' + w.ru).toLowerCase().includes(wordQuery.toLowerCase()));
        $('#screen-words').innerHTML = `<div class="screen-heading"><div><div class="kicker">ЛИЧНЫЙ СЛОВАРЬ</div><h1>Слова, которые пригодятся.</h1><p>${profile().words.length} ${plural(profile().words.length, 'слово', 'слова', 'слов')} · с примерами из твоих уроков</p></div><button class="ui-btn" data-action="review-words" ${profile().words.length ? '' : 'disabled'}>${icon('words')} Повторить слова</button></div><div class="vocab-tools"><input class="field" id="word-search" aria-label="Поиск в словаре" placeholder="Найти слово или перевод…" value="${esc(wordQuery)}"><button class="ui-btn outline" data-action="export-words" ${profile().words.length ? '' : 'disabled'}>${icon('download')} Скачать</button></div><div class="vocab-layout"><div class="panel" id="word-list">${wordRows(words)}</div><aside class="panel"><h2>Добавить свою фразу</h2><form id="add-word-form"><label class="field-label" for="word-en">На английском</label><input class="field" id="word-en" required maxlength="180" placeholder="take it easy"><label class="field-label" for="word-ru">Перевод</label><input class="field" id="word-ru" required maxlength="500" placeholder="не спешить, расслабиться"><label class="field-label" for="word-example">Пример · по желанию</label><textarea class="field" id="word-example" maxlength="500" placeholder="It's Sunday. Take it easy." style="min-height:90px"></textarea><button class="ui-btn" style="margin-top:16px;width:100%">${icon('plus')} Добавить в словарь</button></form><div class="help-text" style="margin-top:17px">Словарь принадлежит выбранному профилю и хранится на этом устройстве.</div><div style="border-top:1px solid var(--line);margin-top:19px;padding-top:15px"><h2 style="font-size:13px">Быстрый перевод · EN ⇄ RU</h2><form id="lookup-word-form" class="lookup-form"><input class="field" id="lookup-en" required maxlength="160" aria-label="Слово для перевода" placeholder="English или по-русски"><button class="ui-btn soft" aria-label="Перевести">${icon('search')}</button></form></div></aside></div>`;
        $('#screen-words').hidden = false;
        $('#word-search').addEventListener('input', e => { wordQuery = e.target.value; $('#word-list').innerHTML = wordRows(profile().words.filter(w => (w.en + ' ' + w.ru).toLowerCase().includes(wordQuery.toLowerCase()))); });
        $('#add-word-form').onsubmit = e => { e.preventDefault(); if (addWord($('#word-en').value, $('#word-ru').value, $('#word-example').value, 'Вручную'))
            renderWords(); };
        $('#lookup-word-form').onsubmit = e => { e.preventDefault(); const en = $('#lookup-en').value.trim(); if (en)
            showLookup(en); };
    }
    function plural(n, one, few, many) { return n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many; }
    function wordRows(words) { return words.length ? words.map(w => `<article class="word-row ${w.learned ? 'learned' : ''}"><div><div class="word-en">${esc(w.en)}</div><div class="word-ru">${esc(w.ru)}</div>${w.example ? '<div class="word-example">' + esc(w.example) + '</div>' : ''}${w.source ? '<div class="word-source">' + esc(w.source) + '</div>' : ''}</div><div class="word-actions"><button class="icon-btn" data-word-speak="${esc(w.id)}" aria-label="Произнести ${esc(w.en)}">${icon('sound')}</button><button class="icon-btn" data-word-edit="${esc(w.id)}" aria-label="Изменить перевод ${esc(w.en)}">${icon('edit')}</button><button class="icon-btn" data-word-delete="${esc(w.id)}" aria-label="Удалить ${esc(w.en)}">${icon('trash')}</button></div></article>`).join('') : `<div class="empty-state" style="border:0"><h2>${wordQuery ? 'Ничего не найдено.' : 'Первое слово — из урока.'}</h2><p>${wordQuery ? 'Попробуй другой запрос.' : 'Выдели слово в тексте или добавь фразу вручную. Здесь появятся перевод и пример.'}</p><button class="ui-btn soft" data-open="${esc(profile().lastLesson || meta().id)}">Открыть мой урок ${icon('arrow')}</button></div>`; }
    function renderReview() {
        const words = review.ids.map(id => profile().words.find(w => w.id === id)).filter(Boolean);
        if (!words.length) {
            review = null;
            renderWords();
            return;
        }
        const w = words[review.index];
        if (!w) {
            $('#screen-words').innerHTML = `<div class="screen-heading"><div><div class="kicker">ПОВТОРЕНИЕ</div><h1>Все карточки пройдены.</h1><p>Удалось вспомнить перевод — уже маленькая практика.</p></div></div><div class="review-card"><h2>${review.known} / ${words.length}</h2><p class="review-caption">слов удалось вспомнить в этом круге</p><div class="review-actions"><button class="ui-btn" data-action="review-words">Ещё один круг</button><button class="ui-btn outline" data-action="close-review">В словарь</button></div></div>`;
            return;
        }
        $('#screen-words').innerHTML = `<div class="screen-heading"><div><div class="kicker">КОРОТКАЯ ПРАКТИКА</div><h1>Вспомни значение.</h1><p>Карточка ${review.index + 1} из ${words.length}</p></div><button class="ui-link" data-action="close-review">Закончить повторение</button></div><div class="review-card"><button class="pill review-dir" type="button" data-action="review-dir" aria-label="Сменить направление">${review.dir === 'ru' ? 'RU → EN' : 'EN → RU'} ⇄</button><h2>${esc(review.dir === 'ru' ? w.ru : w.en)}</h2>${review.dir === 'ru' && !review.revealed ? '' : '<button class="icon-btn" data-word-speak="' + esc(w.id) + '" aria-label="Произнести слово">' + icon('sound') + '</button>'}${review.revealed ? '<div class="review-answer">' + esc(review.dir === 'ru' ? w.en : w.ru) + '</div><p class="review-caption">' + esc(w.example || '') + '</p><div class="review-actions"><button class="ui-btn outline" data-action="review-again">Повторю ещё</button><button class="ui-btn" data-action="review-known">Вспомнила ' + icon('check') + '</button></div>' : '<p class="review-caption">Сначала попробуй вспомнить перевод самостоятельно.</p><div class="review-actions"><button class="ui-btn" data-action="reveal-review">Показать перевод</button></div>'}</div>`;
    }
    function renderBuilder() {
        $('#screen-builder').innerHTML = `<div class="screen-heading"><div><div class="kicker">ПРОСТОЙ КОНСТРУКТОР</div><h1>Добавь свой материал.</h1><p>Текст, вопрос и домашнее задание — первый шаг к интерактивному уроку.</p></div><button class="ui-btn outline" data-action="import-lesson">${icon('download')} Загрузить готовый урок</button></div><div class="builder-grid"><form class="panel" id="lesson-builder"><label class="field-label" for="builder-owner">Профиль ученика</label><select class="field" id="builder-owner">${DATA.map(m => `<option value="${esc(m.id)}" ${m.id === state.profile ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</select><label class="field-label" for="builder-title">Название урока</label><input class="field" id="builder-title" required maxlength="140" placeholder="English File · My daily routine"><label class="field-label" for="builder-description">Тема / учебная задача</label><input class="field" id="builder-description" maxlength="300" placeholder="Present Simple · routines · speaking"><label class="field-label" for="builder-level">Уровень</label><select class="field" id="builder-level"><option>A1</option><option selected>A2</option><option>B1</option><option>B2</option><option>C1</option></select><label class="field-label" for="builder-text">Текст для чтения</label><textarea class="field" id="builder-text" required maxlength="20000" placeholder="Вставь английский текст…" style="min-height:220px"></textarea><button type="button" class="ui-link" data-action="import-text">${icon('download')} Вставить из .txt</button><label class="field-label" for="builder-question">Вопрос к тексту</label><input class="field" id="builder-question" required maxlength="500" placeholder="What does the main character do every morning?"><label class="field-label">Три варианта ответа</label><div class="builder-answers"><input class="field" id="builder-option-0" aria-label="Первый вариант ответа" required maxlength="300" placeholder="Вариант 1"><input class="field" id="builder-option-1" aria-label="Второй вариант ответа" required maxlength="300" placeholder="Вариант 2"><input class="field" id="builder-option-2" aria-label="Третий вариант ответа" required maxlength="300" placeholder="Вариант 3"></div><label class="field-label" for="builder-correct">Правильный ответ</label><select class="field" id="builder-correct"><option value="0">Вариант 1</option><option value="1">Вариант 2</option><option value="2">Вариант 3</option></select><label class="field-label" for="builder-homework">Домашнее задание</label><textarea class="field" id="builder-homework" maxlength="3000" placeholder="Write 5 sentences about your daily routine." style="min-height:110px"></textarea><div class="builder-actions"><button class="ui-btn" type="submit">Создать и открыть урок ${icon('arrow')}</button></div><p class="builder-status" id="builder-status" aria-live="polite"></p></form><aside><div class="hint-panel"><strong>Как мы будем работать с учебниками</strong><p>Ты присылаешь нужный материал, мы готовим задания и добавляем их в библиотеку. Готовый урок можно загрузить сюда файлом.</p><p>Этот конструктор создаёт текстовый урок с одним вопросом. Перенос целого PDF и аудио появится в следующих версиях.</p></div><div class="panel" style="margin-top:18px"><h2>Добавленные уроки</h2>${state.materials.length ? state.materials.map(m => { var _a; return `<div style="margin:16px 0;font-size:13px"><strong>${esc(m.title)}</strong><div class="help-text">${esc((_a = DATA.find(d => d.id === m.owner)) === null || _a === void 0 ? void 0 : _a.name)}</div><button class="ui-link" data-material-export="${esc(m.id)}">Скачать урок</button> · <button class="ui-link" data-material-delete="${esc(m.id)}">Удалить</button></div>`; }).join('') : '<p>Здесь появятся твои новые материалы.</p>'}</div></aside></div><input type="file" id="import-material-file" accept=".json,application/json" hidden><input type="file" id="import-text-file" accept=".txt,text/plain" hidden>`;
        $('#screen-builder').hidden = false;
        $('#lesson-builder').onsubmit = e => {
            e.preventDefault();
            const val = id => $('#' + id).value.trim();
            const m = { format: 'iris-lesson', version: 1, id: 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6), owner: val('builder-owner'), title: val('builder-title'), description: val('builder-description'), level: val('builder-level'), text: val('builder-text'), question: val('builder-question'), options: [0, 1, 2].map(i => val('builder-option-' + i)), correct: Number(val('builder-correct')), homework: val('builder-homework') };
            if (!validMaterial(m)) {
                $('#builder-status').textContent = 'Заполни текст, вопрос и все варианты ответа.';
                return;
            }
            state.materials.push(m);
            createMaterialPane(m);
            save();
            openLesson(m.id);
        };
        $('#import-text-file').onchange = async (e) => { const f = e.target.files[0]; if (!f)
            return; if (f.size > 100000) {
            notify('Выбери текстовый файл до 100 КБ.');
            return;
        } try {
            const s = await f.text();
            if (s.length > 20000) {
                notify('Текст длиннее 20 000 символов. Раздели его на уроки.');
                return;
            }
            $('#builder-text').value = s;
            notify('Текст добавлен.');
        }
        catch (_) {
            notify('Не получилось прочитать файл.');
        } };
        $('#import-material-file').onchange = async (e) => { const f = e.target.files[0]; if (!f)
            return; if (f.size > 150000) {
            notify('Выбери файл урока до 150 КБ.');
            return;
        } try {
            const m = JSON.parse(await f.text());
            if (!validMaterial(m))
                throw Error();
            if (state.materials.some(x => x.id === m.id))
                m.id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
            state.materials.push(m);
            createMaterialPane(m);
            save();
            openLesson(m.id);
            notify('Урок появился в библиотеке.');
        }
        catch (_) {
            notify('Не удалось загрузить урок. Нужен файл урока Iris в формате .json.');
        } };
    }
    function download(filename, text, type = 'text/plain;charset=utf-8') { const u = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = u; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); }
    function exportAnswers() {
        const p = profile();
        const out = [`IRIS SCHOOL · Ответы и заметки`, `Профиль: ${meta().name}`, `Дата: ${new Date().toLocaleDateString('ru-RU')}`, ''];
        allLessons().filter(m => m.owner === state.profile).forEach(m => { out.push(m.title, '='.repeat(40)); sectionsFor(m.id).forEach(s => { const saved = $$('input.gap,select.gap,textarea.gap,textarea.lesson-note,textarea.homework-text', s).filter(f => { var _a; return (_a = p.fields[f.dataset.field]) === null || _a === void 0 ? void 0 : _a.value; }); const choices = $$('.mc', s).filter(mc => { var _a; return ((_a = p.choices[mc.dataset.choice]) === null || _a === void 0 ? void 0 : _a.selected) !== undefined; }); if (!saved.length && !choices.length)
            return; out.push(s.dataset.label); saved.forEach(f => { var _a, _b; const r = p.fields[f.dataset.field], label = ((_b = (_a = f.closest('li,tr')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, ' ').trim().slice(0, 200)) || (f.classList.contains('homework-text') ? 'Домашнее задание' : 'Заметка'); out.push(`${label}\n→ ${r.value}${r.status === 'ok' ? ' [верно]' : r.status === 'bad' ? ' [нужно проверить]' : r.status === 'shown' ? ' [ответ был показан]' : ''}`); }); choices.forEach(mc => { var _a; const c = p.choices[mc.dataset.choice]; out.push(`${$('.q', mc).textContent}\n→ ${((_a = $$('.opt', mc)[c.selected]) === null || _a === void 0 ? void 0 : _a.textContent) || ''} ${c.correct ? '[верно]' : '[нужно проверить]'}`); }); out.push(''); }); });
        download('iris-answers-' + state.profile + '.txt', out.join('\n'));
        notify('Файл ответов подготовлен.');
    }
    function modal(title, body, onConfirm, label = 'Подтвердить', isInput = false) {
        previousModalFocus = document.activeElement;
        const backdrop = $('#modal');
        backdrop.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${esc(title)}</h2>${isInput ? body : '<p>' + esc(body) + '</p>'}<div class="builder-actions"><button class="ui-btn outline" id="modal-cancel">Отмена</button><button class="ui-btn" id="modal-confirm">${esc(label)}</button></div></div>`;
        backdrop.hidden = false;
        $('#modal-cancel').onclick = closeModal;
        $('#modal-confirm').onclick = () => { var _a; const value = isInput ? (_a = $('#modal-value')) === null || _a === void 0 ? void 0 : _a.value : null; if (isInput && !(value === null || value === void 0 ? void 0 : value.trim())) {
            notify('Введи перевод.');
            return;
        } onConfirm(value); closeModal(); };
        ($('#modal-value') || $('#modal-cancel')).focus();
    }
    function closeModal() { var _a; $('#modal').hidden = true; (_a = previousModalFocus === null || previousModalFocus === void 0 ? void 0 : previousModalFocus.focus) === null || _a === void 0 ? void 0 : _a.call(previousModalFocus); }
    async function shareLesson() { const u = new URL(location.href); u.search = ''; u.hash = currentLesson || meta().id; try {
        await navigator.clipboard.writeText(u.href);
        notify('Ссылка на урок скопирована.');
    }
    catch (_) {
        modal('Ссылка на урок', `<p>Скопируй ссылку и отправь ученику.</p><input class="field" id="modal-value" value="${esc(u.href)}" readonly aria-label="Ссылка на урок">`, () => { }, 'Готово', true);
        $('#modal-value').select();
    } }
    function resetLesson() { modal('Начать урок заново?', 'Ответы, заметки и отметки этапов этого урока будут очищены. Слова в словаре сохранятся.', () => { const p = profile(), pane = paneFor(currentLesson); $$('[data-field]', pane).forEach(f => delete p.fields[f.dataset.field]); $$('[data-choice]', pane).forEach(mc => delete p.choices[mc.dataset.choice]); $$('[data-flip]', pane).forEach(f => delete p.flips[f.dataset.flip]); $$('[data-picker]', pane).forEach(f => delete p.pickers[f.dataset.picker]); sectionsFor(currentLesson).forEach(s => delete p.completed[s.id]); hydrate(); save(); currentSection = sectionsFor(currentLesson)[0].id; showSection(); }, 'Начать заново'); }
    document.addEventListener('click', e => {
        var _a;
        const b = e.target.closest('button,a');
        if (!b)
            return;
        if (b.dataset.screen) {
            e.preventDefault();
            review = null;
            route(b.dataset.screen);
            return;
        }
        if (b.dataset.open) {
            e.preventDefault();
            openLesson(b.dataset.open);
            return;
        }
        if (b.dataset.stage) {
            currentSection = b.dataset.stage;
            showSection();
            return;
        }
        if (b.dataset.flipSave) {
            const item = VOCAB[b.dataset.flipSave];
            if (item) {
                addWord(b.dataset.term, item.ru, item.example, ((_a = lessonMeta(currentLesson)) === null || _a === void 0 ? void 0 : _a.title) || '');
                b.textContent = '✓ В словаре';
            }
            return;
        }
        const p = profile();
        if (b.dataset.wordSpeak) {
            const w = p.words.find(w => w.id === b.dataset.wordSpeak);
            if (w)
                speak(w.en);
            return;
        }
        if (b.dataset.wordDelete) {
            const w = p.words.find(w => w.id === b.dataset.wordDelete);
            if (w)
                modal('Удалить слово?', w.en + ' — ' + w.ru, () => { p.words = p.words.filter(x => x.id !== w.id); save(); renderWords(); updateChrome(); }, 'Удалить');
            return;
        }
        if (b.dataset.wordEdit) {
            const w = p.words.find(w => w.id === b.dataset.wordEdit);
            if (w)
                modal('Уточнить перевод', `<p>${esc(w.en)}</p><label class="field-label" for="modal-value">Перевод</label><input class="field" id="modal-value" value="${esc(w.ru)}" maxlength="500">`, v => { w.ru = v.trim(); save(); renderWords(); }, 'Сохранить', true);
            return;
        }
        if (b.dataset.materialExport) {
            const m = state.materials.find(x => x.id === b.dataset.materialExport);
            if (m)
                download(m.id + '.json', JSON.stringify(m, null, 2), 'application/json');
            return;
        }
        if (b.dataset.materialDelete) {
            const id = b.dataset.materialDelete;
            modal('Удалить материал?', 'Урок будет удалён из библиотеки этого браузера.', () => { var _a; state.materials = state.materials.filter(x => x.id !== id); (_a = paneFor(id)) === null || _a === void 0 ? void 0 : _a.remove(); Object.values(state.profiles).forEach(p => { if (p.lastLesson === id)
                delete p.lastLesson; }); save(); renderBuilder(); }, 'Удалить');
            return;
        }
        const action = b.dataset.action;
        if (action === 'previous-stage')
            moveStage(-1);
        if (action === 'next-stage')
            moveStage(1);
        if (action === 'complete-stage') {
            p.completed[currentSection] = !p.completed[currentSection];
            save();
            showSection(false);
        }
        if (action === 'lookup')
            modal('Перевести слово', '<label class="field-label" for="modal-value">Слово или фраза — по-английски или по-русски</label><input class="field" id="modal-value" maxlength="160" placeholder="take it easy · отдыхать">', s => setTimeout(() => showLookup(s.trim()), 0), 'Перевести', true);
        if (action === 'share-lesson')
            shareLesson();
        if (action === 'reset-lesson')
            resetLesson();
        if (action === 'export-answers')
            exportAnswers();
        if (action === 'import-lesson')
            $('#import-material-file').click();
        if (action === 'import-text')
            $('#import-text-file').click();
        if (action === 'export-words')
            download('iris-vocabulary-' + state.profile + '.tsv', '\uFEFFEnglish\tПеревод\tПример\n' + p.words.map(w => [w.en, w.ru, w.example || ''].map(x => String(x).replace(/[\t\r\n]+/g, ' ')).join('\t')).join('\n'), 'text/tab-separated-values;charset=utf-8');
        if (action === 'review-words') {
            if (!p.words.length)
                return;
            review = { ids: p.words.map(w => w.id).sort(() => Math.random() - .5), index: 0, revealed: false, known: 0, dir: (() => { try {
                    return localStorage.getItem('iris-review-dir') || 'en';
                }
                catch (_) {
                    return 'en';
                } })() };
            renderWords();
        }
        if (action === 'close-review') {
            review = null;
            renderWords();
        }
        if (action === 'reveal-review') {
            review.revealed = true;
            renderReview();
        }
        if (action === 'review-again' || action === 'review-known') {
            const w = p.words.find(w => w.id === review.ids[review.index]);
            if (w)
                w.learned = action === 'review-known';
            if (action === 'review-known')
                review.known++;
            review.index++;
            review.revealed = false;
            save();
            renderReview();
        }
    });
    document.addEventListener('change', e => { if (e.target.id === 'stage-select') {
        currentSection = e.target.value;
        showSection();
    } });
    document.addEventListener('selectionchange', () => { clearTimeout(selectionTimer); selectionTimer = setTimeout(inspectSelection, 400); });
    document.addEventListener('pointerup', e => { if (e.target.closest('.translation-popover,input,textarea,select,button'))
        return; clearTimeout(selectionTimer); selectionTimer = setTimeout(inspectSelection, 160); });
    document.addEventListener('pointerdown', e => { if (!popup.hidden && !e.target.closest('.translation-popover'))
        hidePopup(); });
    new MutationObserver(() => { if (!popup.hidden)
        popup._shownAt = performance.now(); }).observe(popup, { attributes: true, attributeFilter: ['hidden'] });
    // a scroll right after the popup opens is the page settling (phone keyboard closing, layout update), not the user — keep the popup
    document.addEventListener('scroll', e => { if (!popup.hidden && !popup.contains(e.target) && performance.now() - (popup._shownAt || 0) > 900)
        hidePopup(); }, true);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            hidePopup();
            if (!$('#modal').hidden)
                closeModal();
        }
        if (e.key === 'Tab' && !$('#modal').hidden) {
            const list = $$('button,input,a,textarea,select', $('#modal')).filter(x => !x.disabled), first = list[0], last = list[list.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    $('#profile-select').addEventListener('change', e => selectProfile(e.target.value));
    $('#mode-toggle').addEventListener('click', () => { state.role = state.role === 'teacher' ? 'student' : 'teacher'; save(); route(state.role === 'teacher' ? 'teacher' : 'home'); });
    $('#modal').addEventListener('click', e => { if (e.target.id === 'modal')
        closeModal(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) {
        stopTimers();
        save();
    } });
    window.addEventListener('beforeunload', () => { stopTimers(); save(); });
    let accessInfo = null; // заполняется модулем личного входа
    /* ---------- Совместный урок: синхронизация ответов, этапов и указки в реальном времени ---------- */
    const live = (function () {
        // Несколько бесплатных серверов одновременно: если один недоступен, урок идёт через остальные. Сообщения зашифрованы ключом из ссылки.
        const DEFAULT_BROKERS = [
            { url: 'iris-box' }, /*iris-box*/
            { url: 'wss://broker.emqx.io:8084/mqtt' },
            { url: 'wss://broker.hivemq.com:8884/mqtt' },
            { url: 'wss://public.cloud.shiftr.io', username: 'public', password: 'public' },
            { url: 'wss://test.mosquitto.org:8081/mqtt' }
        ];
        const BROKERS = (() => { try {
            const q = new URLSearchParams(location.search).get('brokers');
            if (q)
                return q.split(',').filter(u => /^wss?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(u)).map(url => ({ url }));
        }
        catch (_) { } return DEFAULT_BROKERS; })();
        const PEER_TIMEOUT = 13000, PING_EVERY = 4000, SNAPSHOT_EVERY = 10000, MAX_AGE = 10 * 60 * 1000;
        const me = rid(10);
        let session = null, seq = 0, sendChain = Promise.resolve(), recvChain = Promise.resolve();
        let applying = false, pendingReset = false, snapshotDirty = false, lastPointerJson = '', lastPointerAt = 0, pointerTimer = null, lastAnchor = null;
        let lastHelloReply = 0, notifyGate = 0, repositionQueued = false, helloTimer = null;
        const custom = {};
        const around = new Map(); // ученики на платформе, но ещё не в уроке: имя → время сигнала
        let classRoom = null; // (lesson) → {room, keyStr}: личный класс ученика (задаёт модуль личного входа)
        const seen = new Map(), maxSeq = new Map(), applied = new Map(), localEdits = new Map(), fieldTimers = new Map(), cursors = new Map(), peers = new Map();
        const bar = document.createElement('div');
        bar.className = 'live-bar';
        bar.id = 'live-bar';
        bar.hidden = true;
        $('.app-header').insertAdjacentElement('afterend', bar);
        const origReplace = history.replaceState.bind(history);
        history.replaceState = function (s, t, url) { if (session && typeof url === 'string' && url.startsWith('#') && !url.startsWith('#live.'))
            url = liveHash(); return origReplace(s, t, url); };
        function rid(n = 12) { return b64e(crypto.getRandomValues(new Uint8Array(n))); }
        function b64e(bytes) { let s = ''; bytes.forEach(b => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
        function b64d(str) { const s = atob(String(str).replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((String(str).length + 3) % 4)); return Uint8Array.from(s, c => c.charCodeAt(0)); }
        const topic = () => 'iris-school/v1/' + session.room;
        const liveHash = () => '#live.' + session.lesson + '.' + session.room + '.' + session.keyStr + (session.role === 'teacher' ? '.t' : '');
        // Ссылки для других людей никогда не содержат личный код (?k=) того, кто их создал.
        const shareBase = () => { const u = new URL(location.href); u.hash = ''; u.searchParams.delete('k'); return u.toString(); };
        const studentLink = () => shareBase() + '#live.' + session.lesson + '.' + session.room + '.' + session.keyStr;
        const joinCode = () => session.lesson + '.' + session.room + '.' + session.keyStr;
        const ownPane = () => session && paneFor(session.lesson);
        const inSessionLesson = () => session && screen === 'lesson' && currentLesson === session.lesson;
        const otherRole = () => (session.role === 'teacher' ? 'student' : 'teacher');
        const peerOnline = () => Array.from(peers.values()).find(p => p.role === otherRole() && Date.now() - p.last < PEER_TIMEOUT);
        const indexIn = (el, sel) => $$(sel, ownPane()).indexOf(el);
        let guestName = ''; // a student who opened the shared link in a browser without his personal link picks his name
        const myName = () => (accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' ? accessInfo.entry.name : (session === null || session === void 0 ? void 0 : session.role) === 'teacher' ? 'Преподаватель' : (guestName || 'Ученик');
        const seats = lesson => { var _a; try {
            const owner = (_a = lessonMeta(lesson)) === null || _a === void 0 ? void 0 : _a.owner;
            return Math.max(1, JSON.parse($('#access-data').textContent).entries.filter(e => e.profile === owner).length);
        }
        catch (_) {
            return 1;
        } };
        const onlineStudents = () => Array.from(peers.values()).filter(p => p.role === 'student' && Date.now() - p.last < PEER_TIMEOUT);
        // Личный режим (группа): ученики не видят ответов друг друга, у каждого свой прогресс;
        // преподаватель хранит ответы каждого ученика отдельно и переключается между ними.
        const isPrivate = lesson => { var _a; return !!((_a = lessonMeta(lesson)) === null || _a === void 0 ? void 0 : _a.privateLive) || seats(lesson) > 2; };
        const STUDENT_WORK = ['fields', 'choice', 'flip', 'picker', 'timer', 'completed', 'pointer', 'tap', 'snapshot'];
        function workOf(name) {
            const w = session.work;
            if (!w.has(name))
                w.set(name, { fields: {}, choices: {}, completed: [], fresh: false });
            return w.get(name);
        }
        function showWork(name) {
            // показать в уроке ответы выбранного ученика (без отправки остальным)
            if (!session || !session.private || session.role !== 'teacher')
                return;
            session.viewing = name;
            const pane = ownPane();
            if (!pane)
                return;
            const p = profile(), w = workOf(name);
            w.fresh = false;
            $$('[data-field]', pane).forEach(e => { const k = e.dataset.field; if (w.fields[k])
                p.fields[k] = w.fields[k];
            else
                delete p.fields[k]; });
            $$('[data-choice]', pane).forEach(e => { const k = e.dataset.choice; if (w.choices[k])
                p.choices[k] = w.choices[k];
            else
                delete p.choices[k]; });
            sectionsFor(session.lesson).forEach(sec => { if (w.completed.includes(sec.id))
                p.completed[sec.id] = true;
            else
                delete p.completed[sec.id]; });
            applying = true;
            try {
                hydrate();
                refreshLessonStats();
            }
            finally {
                applying = false;
            }
            renderBar();
        }
        async function seal(obj, key) {
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj))));
            const out = new Uint8Array(12 + ct.length);
            out.set(iv);
            out.set(ct, 12);
            return b64e(out);
        }
        async function unseal(text, key) {
            const u = b64d(text);
            const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12));
            return JSON.parse(new TextDecoder().decode(pt));
        }
        function markSeen(id) { seen.set(id, Date.now()); if (seen.size > 6000) {
            const cut = Date.now() - MAX_AGE;
            seen.forEach((t, k) => { if (t < cut)
                seen.delete(k); });
        } }
        function send(type, data = {}) {
            if (!session)
                return;
            const s = session, msg = Object.assign({ v: 1, id: rid(9), from: me, role: s.role, name: myName(), seq: ++seq, ts: Date.now(), lesson: s.lesson, type }, data);
            markSeen(msg.id);
            sendChain = sendChain.then(async () => {
                const payload = await seal(msg, s.key), t = 'iris-school/v1/' + s.room;
                s.clients.forEach(c => { if (c.connected)
                    c.publish(t, payload, { qos: 0 }); });
            }).catch(() => { });
        }
        function receive(payload) {
            const s = session;
            if (!s)
                return;
            recvChain = recvChain.then(async () => {
                if (session !== s)
                    return;
                let m;
                try {
                    m = await unseal(String(payload), s.key);
                }
                catch (_) {
                    return;
                }
                if (m && m.v === 1 && m.type === 'here' && m.role === 'student' && s.role === 'teacher') {
                    if (typeof m.name === 'string' && Math.abs(Date.now() - m.ts) < 30000) {
                        around.set(m.name.slice(0, 40), Date.now());
                        renderBar();
                    }
                    return;
                }
                if (!m || m.v !== 1 || m.from === me || typeof m.id !== 'string' || seen.has(m.id) || m.lesson !== s.lesson)
                    return;
                // Защита от повторной отправки перехваченных сообщений: старые по времени или по номеру отбрасываются.
                if (typeof m.ts !== 'number' || Math.abs(Date.now() - m.ts) > MAX_AGE || !Number.isInteger(m.seq))
                    return;
                const top = maxSeq.get(m.from) || 0;
                if (m.seq <= top - 60)
                    return;
                if (m.seq > top)
                    maxSeq.set(m.from, m.seq);
                markSeen(m.id);
                applying = true;
                try {
                    handle(m);
                }
                finally {
                    applying = false;
                }
            }).catch(e => console.error('live', e));
        }
        // Ignore an older update of the same item from the same sender (messages can arrive via different servers).
        function fresh(m, key) { const prev = applied.get(key); if (prev && prev.from === m.from && prev.seq > m.seq)
            return false; applied.set(key, { from: m.from, seq: m.seq }); return true; }
        const editedLocally = k => Date.now() - (localEdits.get(k) || 0) < 2500;
        function connect() {
            const s = session;
            s.clients = BROKERS.map(b => {
                const c = mqtt.connect(b.url, { username: b.username, password: b.password, clientId: 'iris_' + me + '_' + rid(3), keepalive: 20, reconnectPeriod: 2500, connectTimeout: 9000, clean: true, protocolVersion: 4, queueQoSZero: false, resubscribe: true });
                c.on('connect', () => { if (session !== s)
                    return; c.subscribe(topic(), { qos: 0 }, () => { }); hello(); renderBar(); });
                c.on('close', () => { if (session === s)
                    renderBar(); });
                c.on('offline', () => { if (session === s)
                    renderBar(); });
                c.on('error', () => { });
                c.on('message', (t, payload) => { if (session === s && t === topic())
                    receive(payload); });
                return c;
            });
        }
        function hello() { clearTimeout(helloTimer); helloTimer = setTimeout(() => send('hello', { section: currentLesson === (session === null || session === void 0 ? void 0 : session.lesson) ? currentSection : null }), 250); }
        function handle(m) {
            var _a, _b;
            const known = peers.has(m.from), wasOnline = !!peerOnline();
            const prev = peers.get(m.from) || {};
            peers.set(m.from, Object.assign(Object.assign({}, prev), { role: m.role === 'teacher' ? 'teacher' : 'student', name: typeof m.name === 'string' ? m.name.slice(0, 40) : prev.name, last: Date.now(), section: typeof m.section === 'string' ? m.section : prev.section }));
            if (m.type === 'bye') {
                peers.delete(m.from);
                removeCursor(m.from);
                renderBar();
                return;
            }
            if (!known && m.role !== session.role)
                notify(session.role === 'teacher' ? (m.name && m.name !== 'Ученик' ? m.name : 'Ученик') + ' подключается к уроку.' : 'Преподаватель подключился к уроку.');
            if (!known || m.type === 'hello')
                renderBar();
            if (session.private && m.role === 'student' && STUDENT_WORK.includes(m.type)) {
                if (session.role === 'student')
                    return; // чужие ответы и курсоры ученице не показываем
                if (!['pointer', 'tap'].includes(m.type)) {
                    privateWork(m);
                    return;
                } // преподаватель: ответы — в «тетрадь» этого ученика
            }
            if (session.private && session.role === 'student' && m.role === 'teacher' && ['fields', 'choice', 'completed', 'snapshot'].includes(m.type))
                return;
            switch (m.type) {
                case 'hello':
                    replyHello();
                    break;
                case 'ping':
                    renderBar();
                    break;
                case 'snapshot':
                    applySnapshot(m);
                    break;
                case 'material':
                    applyMaterial(m);
                    break;
                case 'fields':
                    applyFields(m);
                    break;
                case 'choice':
                    applyChoice(m);
                    break;
                case 'flip':
                    applyFlip(m);
                    break;
                case 'picker':
                    applyPicker(m);
                    break;
                case 'timer':
                    applyTimer(m);
                    break;
                case 'completed':
                    applyCompleted(m);
                    break;
                case 'nav':
                    applyNav(m);
                    break;
                case 'pointer':
                    updateCursor(m.from, m.role, m.a, (_a = peers.get(m.from)) === null || _a === void 0 ? void 0 : _a.name);
                    break;
                case 'tap':
                    updateCursor(m.from, m.role, m.a, (_b = peers.get(m.from)) === null || _b === void 0 ? void 0 : _b.name);
                    ripple(m.a, m.role);
                    break;
                case 'summon':
                    summon(m.a);
                    break;
                case 'end':
                    if (session.role === 'student') {
                        leave(false);
                        notify('Преподаватель завершил совместный урок. Ответы сохранены на этом устройстве.');
                    }
                    break;
            }
            (custom[m.type] || []).forEach(f => { try {
                f(m);
            }
            catch (_) { } }); // дополнительные сообщения (например, совместное прослушивание)
        }
        function replyHello() {
            const now = Date.now();
            if (now - lastHelloReply < 600)
                return;
            lastHelloReply = now;
            send('ping', { section: currentLesson === session.lesson ? currentSection : null });
            if (session.role === 'teacher') {
                const mat = state.materials.find(x => x.id === session.lesson);
                if (mat)
                    send('material', { m: mat });
                if (currentLesson === session.lesson)
                    send('nav', { section: currentSection, follow: session.follow });
            }
            else
                sendSnapshot(false);
        }
        function privateWork(m) {
            const name = (typeof m.name === 'string' && m.name) ? m.name.slice(0, 40) : 'Ученик', w = workOf(name);
            if (!session.viewing)
                session.viewing = name;
            if (m.type === 'fields' && m.recs && typeof m.recs === 'object')
                Object.entries(m.recs).forEach(([k, r]) => { if (r && typeof r === 'object')
                    w.fields[k] = Object.assign(Object.assign({}, r), { value: typeof r.value === 'string' ? r.value.slice(0, 5000) : '' }); });
            if (m.type === 'choice' && m.rec && typeof m.rec === 'object')
                w.choices[m.k] = m.rec;
            if (m.type === 'completed') {
                w.completed = w.completed.filter(x => x !== m.k);
                if (m.on)
                    w.completed.push(m.k);
            }
            if (m.type === 'snapshot' && m.data && typeof m.data === 'object') {
                w.fields = Object.assign({}, (m.data.fields || {}));
                w.choices = Object.assign({}, (m.data.choices || {}));
                w.completed = Array.isArray(m.data.completed) ? m.data.completed.slice() : [];
            }
            if (!['fields', 'choice', 'completed', 'snapshot'].includes(m.type))
                return;
            if (session.viewing === name) {
                if (m.type === 'fields')
                    applyFields(m);
                else if (m.type === 'choice')
                    applyChoice(m);
                else
                    showWork(name);
            }
            else {
                w.fresh = true;
                renderBar();
            }
        }
        /* ----- снимок состояния урока ----- */
        function snapshotData() {
            const pane = ownPane();
            if (!pane)
                return null;
            const p = profile();
            const take = (sel, attr, src) => { const o = {}; $$(sel, pane).forEach(e => { const k = e.dataset[attr]; if (src[k] !== undefined)
                o[k] = src[k]; }); return o; };
            return { fields: take('[data-field]', 'field', p.fields), choices: take('[data-choice]', 'choice', p.choices), flips: take('[data-flip]', 'flip', p.flips), pickers: take('[data-picker]', 'picker', p.pickers), completed: sectionsFor(session.lesson).filter(s => p.completed[s.id]).map(s => s.id) };
        }
        function sendSnapshot(force) { const data = snapshotData(); if (data) {
            snapshotDirty = false;
            send('snapshot', { data, force: !!force, section: currentLesson === session.lesson ? currentSection : null });
        } }
        function applySnapshot(m) {
            if (session.role === 'student' && !(m.force && m.role === 'teacher'))
                return;
            if (session.role === 'teacher' && m.role !== 'student' && !m.force)
                return;
            const pane = ownPane(), d = m.data;
            if (!pane || !d || typeof d !== 'object')
                return;
            const p = profile();
            const sync = (sel, attr, target, src) => $$(sel, pane).forEach(e => { const k = e.dataset[attr]; if (!m.force && (editedLocally(k) || e === document.activeElement))
                return; if (src && src[k] !== undefined && src[k] !== null && typeof src[k] === 'object' || typeof (src === null || src === void 0 ? void 0 : src[k]) === 'boolean')
                target[k] = src[k];
            else
                delete target[k]; });
            sync('[data-field]', 'field', p.fields, d.fields);
            sync('[data-choice]', 'choice', p.choices, d.choices);
            sync('[data-flip]', 'flip', p.flips, d.flips);
            sync('[data-picker]', 'picker', p.pickers, d.pickers);
            const done = Array.isArray(d.completed) ? d.completed : [];
            sectionsFor(session.lesson).forEach(s => { if (done.includes(s.id))
                p.completed[s.id] = true;
            else
                delete p.completed[s.id]; });
            hydrate();
            save();
            refreshLessonStats();
        }
        function applyMaterial(m) {
            if (session.role !== 'student' || !validMaterial(m.m) || m.m.id !== session.lesson)
                return;
            if (!state.materials.some(x => x.id === m.m.id)) {
                state.materials.push(m.m);
                createMaterialPane(m.m);
                save();
            }
            if (!(screen === 'lesson' && currentLesson === session.lesson)) {
                openLesson(session.lesson);
                hydrate();
            }
            renderBar();
        }
        /* ----- ответы и действия ----- */
        function exResult(ex) { var _a; return ((_a = $('.result', ex)) === null || _a === void 0 ? void 0 : _a.textContent) || ''; }
        function sendFields(list, ex) {
            if (!session || applying || !ownPane())
                return;
            if (session.private && session.role === 'teacher')
                return;
            const p = profile(), recs = {};
            list.forEach(f => { if (!ownPane().contains(f))
                return; const k = f.dataset.field; localEdits.set(k, Date.now()); recs[k] = p.fields[k] || { value: f.value, status: '' }; });
            if (!Object.keys(recs).length)
                return;
            snapshotDirty = true;
            send('fields', { recs, ex: ex ? indexIn(ex, '.ex') : -1, result: ex ? exResult(ex) : null, section: currentSection });
        }
        function queueField(f) {
            const k = f.dataset.field;
            if (fieldTimers.has(k)) {
                fieldTimers.get(k).dirty = true;
                return;
            }
            sendFields([f]);
            const t = { dirty: false };
            t.id = setTimeout(() => { fieldTimers.delete(k); if (t.dirty)
                sendFields([f]); }, 140);
            fieldTimers.set(k, t);
        }
        function applyFields(m) {
            const pane = ownPane();
            if (!pane || !m.recs || typeof m.recs !== 'object')
                return;
            const p = profile();
            let changed = null;
            Object.entries(m.recs).forEach(([k, r]) => {
                if (!r || typeof r !== 'object' || !fresh(m, 'f:' + k))
                    return;
                const f = $$('[data-field]', pane).find(x => x.dataset.field === k);
                if (!f)
                    return;
                if (editedLocally(k) && f === document.activeElement)
                    return;
                const value = typeof r.value === 'string' ? r.value.slice(0, 5000) : '';
                p.fields[k] = Object.assign(Object.assign({}, r), { value });
                if (f.value !== value) {
                    const atEnd = f === document.activeElement && f.selectionStart === f.value.length;
                    f.value = value;
                    if (atEnd && f.setSelectionRange)
                        f.setSelectionRange(value.length, value.length);
                }
                paintField(f, p.fields[k]);
                flash(f);
                changed = f;
            });
            const ex = Number.isInteger(m.ex) && m.ex >= 0 ? $$('.ex', pane)[m.ex] : null;
            if (ex && typeof m.result === 'string' && $('.result', ex))
                $('.result', ex).textContent = m.result.slice(0, 300);
            save();
            scheduleStats();
            if (changed)
                tellTeacher(changed);
        }
        function applyChoice(m) {
            const pane = ownPane();
            if (!pane || !m.rec || typeof m.rec !== 'object' || !fresh(m, 'c:' + m.k))
                return;
            const mc = $$('.mc', pane).find(x => x.dataset.choice === m.k);
            if (!mc)
                return;
            const rec = { bads: Array.isArray(m.rec.bads) ? m.rec.bads.filter(Number.isInteger) : [], attempted: !!m.rec.attempted, correct: !!m.rec.correct, earned: !!m.rec.earned, selected: Number.isInteger(m.rec.selected) ? m.rec.selected : undefined };
            profile().choices[m.k] = rec;
            paintChoice(mc, rec);
            flash(mc);
            save();
            scheduleStats();
            tellTeacher(mc);
        }
        function applyFlip(m) {
            const pane = ownPane();
            if (!pane || !fresh(m, 'l:' + m.k))
                return;
            const f = $$('.flip', pane).find(x => x.dataset.flip === m.k);
            if (!f)
                return;
            profile().flips[m.k] = !!m.on;
            f.classList.toggle('flipped', !!m.on);
            f.setAttribute('aria-pressed', String(!!m.on));
            save();
        }
        function applyPicker(m) {
            const pane = ownPane();
            if (!pane || !m.saved || !fresh(m, 'p:' + m.k))
                return;
            const el = $$('.picker', pane).find(x => x.dataset.picker === m.k);
            if (!el)
                return;
            const saved = { pool: Array.isArray(m.saved.pool) ? m.saved.pool.filter(Number.isInteger) : [], current: Number.isInteger(m.saved.current) ? m.saved.current : null };
            profile().pickers[m.k] = saved;
            paintPicker(el, saved);
            flash(el);
            save();
        }
        function timerState(t) { const o = activeTimers.get(t); return o ? { running: !!o.interval, left: Math.max(0, Math.round(o.left)) } : null; }
        function applyTimer(m) {
            const pane = ownPane();
            if (!pane || !fresh(m, 't:' + m.i))
                return;
            const t = $$('.timer', pane)[m.i];
            const o = t && activeTimers.get(t);
            if (!o)
                return;
            const total = Number(t.dataset.sec), left = Math.max(0, Math.min(total, Number(m.left) || 0));
            clearInterval(o.interval);
            o.interval = null;
            o.left = left;
            if (m.running && left > 0) {
                o.deadline = Date.now() + left * 1000;
                o.interval = setInterval(() => { o.left = Math.max(0, Math.ceil((o.deadline - Date.now()) / 1000)); if (o.left === 0) {
                    clearInterval(o.interval);
                    o.interval = null;
                } o.draw(); }, 250);
            }
            o.draw();
        }
        function applyCompleted(m) {
            if (!sectionsFor(session.lesson).some(s => s.id === m.k) || !fresh(m, 's:' + m.k))
                return;
            if (m.on)
                profile().completed[m.k] = true;
            else
                delete profile().completed[m.k];
            save();
            if (inSessionLesson())
                showSection(false);
        }
        function applyNav(m) {
            const sections = sectionsFor(session.lesson);
            if (!sections.some(s => s.id === m.section))
                return;
            if (m.role === 'teacher' && session.role === 'student') {
                session.teacherSection = m.section;
                if (m.follow === false) {
                    renderBar();
                    return;
                }
                if (!(screen === 'lesson' && currentLesson === session.lesson))
                    openLesson(session.lesson, m.section);
                else if (currentSection !== m.section) {
                    currentSection = m.section;
                    showSection();
                }
            }
            renderBar();
            repositionCursors();
        }
        function tellTeacher(el) {
            if (session.role !== 'teacher')
                return;
            const sec = el.closest('section.step');
            if (!sec || !sec.hidden)
                return;
            if (Date.now() - notifyGate < 4000)
                return;
            notifyGate = Date.now();
            notify('Ученик ответил на этапе «' + (sec.dataset.label || '') + '».');
        }
        let statsQueued = false;
        function scheduleStats() { if (statsQueued)
            return; statsQueued = true; requestAnimationFrame(() => { statsQueued = false; refreshLessonStats(); }); }
        function flash(el) { el.classList.remove('live-flash'); void el.offsetWidth; el.classList.add('live-flash'); setTimeout(() => el.classList.remove('live-flash'), 1300); }
        /* ----- указка ----- */
        function pathOf(el, root) { const path = []; while (el && el !== root) {
            const parent = el.parentElement;
            if (!parent)
                return null;
            path.unshift(Array.prototype.indexOf.call(parent.children, el));
            el = parent;
        } return el === root ? path : null; }
        function resolve(path, root) { let el = root; for (const i of path) {
            const next = el.children[i];
            if (!next)
                return { el, exact: false };
            el = next;
        } return { el, exact: true }; }
        function charRect(n, off) {
            const len = n.length;
            if (!len)
                return null;
            const r = document.createRange();
            let right = false;
            if (off < len) {
                r.setStart(n, off);
                r.setEnd(n, off + 1);
            }
            else {
                r.setStart(n, len - 1);
                r.setEnd(n, len);
                right = true;
            }
            const rc = r.getClientRects()[0] || r.getBoundingClientRect();
            if (!rc || (!rc.width && !rc.height))
                return null;
            return { x: right ? rc.right : rc.left, top: rc.top, h: rc.height };
        }
        function caretAt(x, y) {
            try {
                if (document.caretPositionFromPoint) {
                    const c = document.caretPositionFromPoint(x, y);
                    return c && { node: c.offsetNode, off: c.offset };
                }
                if (document.caretRangeFromPoint) {
                    const c = document.caretRangeFromPoint(x, y);
                    return c && { node: c.startContainer, off: c.startOffset };
                }
            }
            catch (_) { }
            return null;
        }
        function anchorAt(x, y) {
            var _a;
            const el = document.elementFromPoint(x, y);
            if (!el || el.closest('.live-bar,.live-cursor,.translation-popover,.modal-backdrop'))
                return null;
            const sec = el.closest('section.step');
            if (!sec || sec.hidden || !((_a = ownPane()) === null || _a === void 0 ? void 0 : _a.contains(sec)))
                return null;
            const c = caretAt(x, y);
            if (c && c.node && c.node.nodeType === 3 && el.contains(c.node) && !el.closest('input,textarea,select')) {
                const rc = charRect(c.node, c.off);
                if (rc && Math.abs(y - (rc.top + rc.h / 2)) <= rc.h * 0.75 && Math.abs(x - rc.x) <= 28) {
                    const parent = c.node.parentElement, path = pathOf(parent, sec);
                    if (path)
                        return { s: sec.id, p: path, ti: Array.prototype.indexOf.call(parent.childNodes, c.node), o: c.off };
                }
            }
            const path = pathOf(el, sec);
            if (!path)
                return null;
            const b = el.getBoundingClientRect();
            return { s: sec.id, p: path, rx: b.width ? +((x - b.left) / b.width).toFixed(4) : 0.5, ry: b.height ? +((y - b.top) / b.height).toFixed(4) : 0.5 };
        }
        function pointFrom(a) {
            var _a;
            if (!a || typeof a.s !== 'string' || !Array.isArray(a.p) || !inSessionLesson())
                return null;
            const sec = document.getElementById(a.s);
            if (!sec || sec.hidden || !((_a = ownPane()) === null || _a === void 0 ? void 0 : _a.contains(sec)))
                return null;
            const { el, exact } = resolve(a.p.filter(Number.isInteger), sec);
            if (exact && Number.isInteger(a.ti)) {
                const n = el.childNodes[a.ti];
                if (n && n.nodeType === 3) {
                    const rc = charRect(n, Math.max(0, Math.min(Number(a.o) || 0, n.length)));
                    if (rc)
                        return { x: rc.x, y: rc.top + rc.h / 2 };
                }
            }
            const b = el.getBoundingClientRect();
            if (!b.width && !b.height)
                return null;
            const rx = exact && typeof a.rx === 'number' ? Math.max(0, Math.min(1, a.rx)) : 0.5, ry = exact && typeof a.ry === 'number' ? Math.max(0, Math.min(1, a.ry)) : 0.5;
            return { x: b.left + rx * b.width, y: b.top + ry * b.height };
        }
        function cursorFor(id, role, name) {
            let c = cursors.get(id);
            if (!c) {
                const el = document.createElement('div');
                el.className = 'live-cursor ' + (role === 'teacher' ? 'is-teacher' : 'is-student');
                el.hidden = true;
                el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2l7.5 19 2.6-7.9L21 10.5z"/></svg><span>' + (role === 'teacher' ? 'Преподаватель' : 'Ученик') + '</span>';
                if (name)
                    el.querySelector('span').textContent = name;
                const edge = document.createElement('button');
                edge.type = 'button';
                edge.className = 'live-edge ' + (role === 'teacher' ? 'is-teacher' : 'is-student');
                edge.hidden = true;
                edge.addEventListener('click', () => { const pt = pointFrom(c.a); if (pt)
                    window.scrollBy({ top: pt.y - window.innerHeight / 2, behavior: 'smooth' }); });
                document.body.append(el, edge);
                c = { el, edge, a: null, hideTimer: null };
                cursors.set(id, c);
            }
            return c;
        }
        function updateCursor(id, role, a, name) {
            const c = cursorFor(id, role, name);
            c.a = a && typeof a === 'object' ? a : null;
            clearTimeout(c.hideTimer);
            if (c.a)
                c.hideTimer = setTimeout(() => { c.a = null; placeCursor(c); }, 20000);
            placeCursor(c);
        }
        function placeCursor(c) {
            const pt = c.a && pointFrom(c.a);
            if (!pt) {
                c.el.hidden = true;
                c.edge.hidden = true;
                return;
            }
            const off = pt.y < 4 ? 'up' : pt.y > window.innerHeight - 4 ? 'down' : null;
            c.el.hidden = !!off;
            if (!off)
                c.el.style.transform = 'translate(' + Math.round(pt.x) + 'px,' + Math.round(pt.y) + 'px)';
            c.edge.hidden = !off;
            if (off) {
                c.edge.textContent = (c.el.classList.contains('is-teacher') ? 'Указка ' : 'Курсор ученика ') + (off === 'up' ? 'выше ↑' : 'ниже ↓');
                c.edge.classList.toggle('at-top', off === 'up');
            }
        }
        function repositionCursors() { if (repositionQueued)
            return; repositionQueued = true; requestAnimationFrame(() => { repositionQueued = false; cursors.forEach(placeCursor); }); }
        function removeCursor(id) { const c = cursors.get(id); if (!c)
            return; clearTimeout(c.hideTimer); c.el.remove(); c.edge.remove(); cursors.delete(id); }
        function ripple(a, role) {
            const pt = pointFrom(a);
            if (!pt)
                return;
            const r = document.createElement('div');
            r.className = 'live-ripple ' + (role === 'teacher' ? 'is-teacher' : 'is-student');
            r.style.left = pt.x + 'px';
            r.style.top = pt.y + 'px';
            document.body.appendChild(r);
            setTimeout(() => r.remove(), 900);
        }
        function summon(a) {
            if (session.role !== 'student' || !a)
                return;
            const sec = document.getElementById(a.s);
            if (sec && sec.hidden && sectionsFor(session.lesson).includes(sec)) {
                currentSection = sec.id;
                showSection(false);
            }
            requestAnimationFrame(() => { const pt = pointFrom(a); if (pt) {
                window.scrollBy({ top: pt.y - window.innerHeight / 2, behavior: 'smooth' });
                setTimeout(() => ripple(a, 'teacher'), 450);
            } });
        }
        function onPointerMove(e) {
            if (!session || !session.pointerOn || !inSessionLesson())
                return;
            const now = Date.now();
            if (now - lastPointerAt < 45) {
                clearTimeout(pointerTimer);
                pointerTimer = setTimeout(() => onPointerMove(e), 50);
                return;
            }
            lastPointerAt = now;
            const a = anchorAt(e.clientX, e.clientY);
            const json = JSON.stringify(a);
            if (json === lastPointerJson)
                return;
            lastPointerJson = json;
            if (a)
                lastAnchor = a;
            send('pointer', { a });
        }
        function onPointerDown(e) {
            if (!session || !session.pointerOn || !inSessionLesson())
                return;
            const a = anchorAt(e.clientX, e.clientY);
            if (!a)
                return;
            lastAnchor = a;
            lastPointerJson = JSON.stringify(a);
            send('tap', { a });
        }
        function hidePointer() { if (!session || !session.pointerOn || lastPointerJson === 'null')
            return; lastPointerJson = 'null'; send('pointer', { a: null }); }
        /* ----- панель совместного урока ----- */
        function connectionState() {
            if (!session)
                return 'off';
            const n = session.clients.filter(c => c.connected).length;
            return n ? 'on' : session.everConnected ? 'lost' : 'connecting';
        }
        let lastBar = '';
        function setBar(html) { if (html !== lastBar) {
            lastBar = html;
            bar.innerHTML = html;
        } }
        function renderBar() {
            var _a;
            $('#profile-select').disabled = !!session;
            if (!session) {
                const show = state.role === 'teacher' && screen === 'lesson' && !!currentLesson;
                bar.hidden = !show;
                bar.className = 'live-bar idle';
                if (show)
                    setBar('<div class="live-main"><span class="live-dot"></span><div><strong>Совместный урок</strong><span class="live-sub">Ученик видит вашу указку, вы видите его ответы в реальном времени.</span></div></div><div class="live-actions"><button class="ui-btn small" data-live="start">Начать совместный урок</button></div>');
                return;
            }
            if (session.clients.some(c => c.connected))
                session.everConnected = true;
            const conn = connectionState(), peer = peerOnline(), teacher = session.role === 'teacher';
            const connText = { on: 'Связь есть', connecting: 'Подключаемся…', lost: 'Связь пропала, переподключаемся…' }[conn];
            const sections = sectionsFor(session.lesson), label = id => { const i = sections.findIndex(s => s.id === id); return i < 0 ? '' : (i + 1) + '. ' + (sections[i].dataset.label || ''); };
            let who;
            const studs = onlineStudents(), extra = studs.length > seats(session.lesson);
            const names = studs.map(p => esc(p.name && p.name !== 'Ученик' ? p.name : 'Ученик')).join(', ');
            const near = [...around].filter(([n, t]) => Date.now() - t < 15000 && !studs.some(p => p.name === n)).map(([n]) => esc(n));
            if (teacher)
                who = (extra ? '<b class="live-warn">По ссылке ученика подключено устройств: ' + studs.length + '. Если это не ваши ученики, завершите урок и начните новый.</b> ' : '') + (studs.length ? 'На уроке: ' + names + (studs.length === 1 && peer.section ? ' · этап ' + esc(label(peer.section)) : '') : 'Ждём ученика. Отправьте ему ссылку.');
            else
                who = peer ? 'Преподаватель на уроке' : 'Ждём преподавателя…';
            if (teacher && !studs.length)
                who = near.length ? near.join(', ') + ' ' + (near.length > 1 ? 'на платформе — подключатся' : 'на платформе — подключится') + ' сами, как только откроют урок' : 'Ученик подключится сам, когда откроет свой урок — ссылку отправлять не нужно';
            const away = teacher && peer && peer.section && inSessionLesson() && peer.section !== currentSection;
            let switcher = '';
            if (teacher && session.private) {
                const total = sections.length, list = new Set([...studs.map(p => p.name || 'Ученик'), ...session.work.keys()]);
                switcher = list.size ? '<div class="live-work" role="group" aria-label="Чьи ответы показать"><span>Ответы:</span>' + [...list].map(n => {
                    const w = workOf(n);
                    const on = studs.some(p => (p.name || 'Ученик') === n);
                    return '<button type="button" class="work-tab' + (session.viewing === n ? ' active' : '') + (w.fresh ? ' fresh' : '') + (on ? '' : ' away') + '" data-live-view="' + esc(n) + '" aria-pressed="' + (session.viewing === n) + '">' + esc(n) + ' <small>' + w.completed.length + '/' + total + '</small></button>';
                }).join('') + '</div>' : '';
                if (!session.viewing && list.size)
                    session.viewing = [...list][0];
            }
            if (!teacher && session.private)
                who += ' · ваши ответы видите только вы и преподаватель';
            bar.hidden = false;
            bar.className = 'live-bar conn-' + conn + (peer ? ' peer-on' : '') + (switcher ? ' has-work' : '');
            setBar('<div class="live-main"><span class="live-dot" title="' + connText + '"></span><div><strong>' + (teacher ? 'Совместный урок' : 'Урок с преподавателем') + ' · ' + esc(((_a = lessonMeta(session.lesson)) === null || _a === void 0 ? void 0 : _a.title) || 'урок') + '</strong><span class="live-sub">' + who + ' · ' + connText + '</span></div></div><div class="live-actions">'
                + (teacher
                    ? '<button class="ui-btn small" data-live="link">Ссылка для ученика</button>'
                        + (away ? '<button class="ui-btn small soft" data-live="goto-student">К ученику</button>' : '')
                        + '<button class="ui-btn small ' + (session.pointerOn ? 'soft' : 'outline') + '" data-live="pointer" aria-pressed="' + session.pointerOn + '">Указка: ' + (session.pointerOn ? 'вкл' : 'выкл') + '</button>'
                        + '<button class="ui-btn small ' + (session.follow ? 'soft' : 'outline') + '" data-live="follow" aria-pressed="' + session.follow + '" title="Ученик переходит на тот же этап, что и вы">Веду ученика: ' + (session.follow ? 'да' : 'нет') + '</button>'
                        + '<button class="ui-btn small outline" data-live="summon" title="Прокрутить экран ученика к месту, где сейчас ваша указка">Показать ученику</button>'
                        + '<button class="ui-btn small outline" data-live="end">Завершить</button>'
                    : (session.teacherSection && inSessionLesson() && session.teacherSection !== currentSection ? '<button class="ui-btn small soft" data-live="goto-teacher">К преподавателю</button>' : '')
                        + '<button class="ui-btn small ' + (session.pointerOn ? 'soft' : 'outline') + '" data-live="pointer" aria-pressed="' + session.pointerOn + '">Мой курсор: ' + (session.pointerOn ? 'виден' : 'скрыт') + '</button>'
                        + '<button class="ui-btn small outline" data-live="leave">Выйти</button>')
                + '</div>' + switcher);
        }
        async function join(lesson, room, keyStr, role, quiet = false) {
            if (typeof mqtt === 'undefined') {
                notify('Модуль связи не загрузился. Обновите страницу.');
                return false;
            }
            if (!window.crypto || !crypto.subtle) {
                notify('Совместный урок работает только по защищённой ссылке (https).');
                return false;
            }
            if (!/^[A-Za-z0-9_-]{16,64}$/.test(room) || !/^[A-Za-z0-9_-]{43}$/.test(keyStr) || !/^[a-z0-9-]{1,90}$/.test(lesson)) {
                notify('Ссылка на совместный урок повреждена.');
                return false;
            }
            let key;
            try {
                key = await crypto.subtle.importKey('raw', b64d(keyStr), 'AES-GCM', false, ['encrypt', 'decrypt']);
            }
            catch (_) {
                notify('Ссылка на совместный урок повреждена.');
                return false;
            }
            if (role !== 'teacher' && typeof access !== 'undefined' && access.unlockLesson)
                access.unlockLesson(lesson, true);
            const exists = !!lessonMeta(lesson);
            if (!exists && !lesson.startsWith('custom-')) {
                notify('Этого урока нет в вашей версии платформы. Откройте ссылку от преподавателя ещё раз.');
                return false;
            }
            if (role !== 'teacher' && !accessInfo)
                guestName = await pickGuestName(lesson);
            leave(false);
            state.role = role === 'teacher' ? 'teacher' : 'student';
            save();
            session = { lesson, room, keyStr, key, role: state.role, clients: [], follow: true, pointerOn: true, everConnected: false, teacherSection: null, private: isPrivate(lesson), work: new Map(), viewing: null };
            peers.clear();
            applied.clear();
            localEdits.clear();
            maxSeq.clear();
            if (exists) {
                if (!(quiet && screen === 'lesson' && currentLesson === lesson))
                    openLesson(lesson);
            }
            else {
                route('home', false);
                notify('Получаем урок от преподавателя…');
            }
            origReplace(null, '', liveHash());
            connect();
            renderBar();
            // ученикам этого урока в кабинете появится кнопка «Войти на урок» — ссылку отправлять не нужно
            if (session.role === 'teacher' && typeof access !== 'undefined' && access.lobbyInvite)
                access.lobbyInvite(lesson, '#live.' + lesson + '.' + room + '.' + keyStr).catch(() => { });
            return true;
        }
        function leave(announce = true) {
            if (!session)
                return;
            const s = session;
            if (announce)
                send(s.role === 'teacher' ? 'end' : 'bye');
            if (s.role === 'teacher' && typeof access !== 'undefined' && access.lobbyStop) {
                access.lobbyStop();
                if (announce)
                    access.lobbyEnd(s.lesson).catch(() => { });
            }
            sendChain.then(() => setTimeout(() => s.clients.forEach(c => { try {
                c.end(true);
            }
            catch (_) { } }), 300));
            session = null;
            peers.clear();
            cursors.forEach((_, id) => removeCursor(id));
            fieldTimers.forEach(t => clearTimeout(t.id));
            fieldTimers.clear();
            origReplace(null, '', '#' + (screen === 'lesson' && currentSection ? currentSection : screen));
            renderBar();
        }
        async function start() {
            if (!currentLesson)
                return;
            const cls = classRoom ? await classRoom(currentLesson).catch(() => null) : null;
            if (cls) {
                if (await join(currentLesson, cls.room, cls.keyStr, 'teacher', true))
                    notify('Класс открыт. Ученик подключится сам, как только откроет свой урок — ссылку отправлять не нужно.');
                return;
            }
            const ok = await join(currentLesson, rid(16), b64e(crypto.getRandomValues(new Uint8Array(32))), 'teacher');
            if (ok)
                shareLink();
        }
        // «Кто вы?» — ученик открыл общую ссылку без личной: выбирает имя, чтобы преподаватель видел его ответы отдельно
        function pickGuestName(lesson) {
            var _a;
            let names = [];
            try {
                const owner = (_a = lessonMeta(lesson)) === null || _a === void 0 ? void 0 : _a.owner;
                names = JSON.parse($('#access-data').textContent).entries.filter(e => e.profile === owner).map(e => e.name);
            }
            catch (_) { }
            if (names.length <= 1)
                return Promise.resolve(names[0] || '');
            try {
                const saved = sessionStorage.getItem('iris-guest-' + lesson);
                if (saved && names.includes(saved))
                    return Promise.resolve(saved);
            }
            catch (_) { }
            return new Promise(resolve => {
                modal('Кто вы?', '<p>Выберите своё имя, чтобы преподаватель видел именно ваши ответы.</p><div class="guest-names">' + names.map(n => '<button type="button" class="ui-btn outline" data-guest-name="' + esc(n) + '">' + esc(n) + '</button>').join('') + '</div><input type="hidden" id="modal-value" value="-">', () => resolve(''), 'Продолжить без имени', true);
                $$('#modal [data-guest-name]').forEach(b => b.addEventListener('click', () => { const n = b.dataset.guestName; try {
                    sessionStorage.setItem('iris-guest-' + lesson, n);
                }
                catch (_) { } closeModal(); resolve(n); }));
                $('#modal-cancel').onclick = () => { closeModal(); resolve(''); };
            });
        }
        async function shareLink() {
            var _a;
            if (!session)
                return;
            const link = studentLink();
            // Личная ссылка на урок для каждого ученика: по ней платформа узнаёт его в любом браузере (в Telegram, Safari, на другом телефоне)
            let own = [];
            try {
                own = session.role === 'teacher' && typeof access !== 'undefined' && access.studentLinks ? await access.studentLinks((_a = lessonMeta(session.lesson)) === null || _a === void 0 ? void 0 : _a.owner) : [];
            }
            catch (_) { }
            if (own.length && location.protocol !== 'file:') {
                const hash = '#live.' + session.lesson + '.' + session.room + '.' + session.keyStr;
                modal('Урок начался', '<p class="lobby-note">✅ <b>Ссылку отправлять не нужно.</b> У ' + (own.length > 1 ? 'учеников' : 'ученика') + ' в кабинете (по личной ссылке, которую вы отправляли один раз) уже появилась кнопка <b>«Войти на урок»</b>. Как только ученик войдёт, вы увидите его в полосе урока.</p><details class="live-backup"><summary>Запасной вариант: ссылка на этот урок</summary><p class="help-text">Если ученик не видит кнопку (например, у него не открыта платформа), отправьте ему его ссылку.</p><div class="live-links">'
                    + own.map(o => '<div class="live-link-row"><strong>' + esc(o.name) + '</strong><input class="field" readonly value="' + esc(o.link + hash) + '" aria-label="Ссылка для ' + esc(o.name) + '"><button type="button" class="ui-btn small soft" data-copy-live="' + esc(o.link + hash) + '" data-copy-name="' + esc(o.name) + '">Копировать</button></div>').join('')
                    + '</div></details><details class="live-generic"><summary>Общая ссылка (если ученик откроет её, платформа спросит его имя)</summary><input class="field" id="modal-value" value="' + esc(link) + '" readonly aria-label="Общая ссылка"></details>', () => { }, 'Готово', true);
                $$('#modal [data-copy-live]').forEach(b => b.addEventListener('click', async () => { try {
                    await navigator.clipboard.writeText(b.dataset.copyLive);
                    notify('Ссылка для ' + b.dataset.copyName + ' скопирована.');
                }
                catch (_) {
                    b.previousElementSibling.select();
                    notify('Скопируйте ссылку вручную.');
                } }));
                return;
            }
            const fileNote = location.protocol === 'file:' ? '<p class="help-text">Платформа открыта как файл, поэтому ссылка у ученика не откроется. Отправьте ему этот же файл и код ниже: на главной странице есть кнопка «Подключиться к уроку».</p><label class="field-label" for="live-code">Код урока</label><input class="field" id="live-code" value="' + esc(joinCode()) + '" readonly>' : '';
            let copied = false;
            if (location.protocol !== 'file:') {
                try {
                    await navigator.clipboard.writeText(link);
                    copied = true;
                }
                catch (_) { }
            }
            modal('Ссылка для ученика', '<p>' + (copied ? 'Ссылка уже скопирована. ' : '') + 'Отправьте её ученику в мессенджер: он откроет урок и сразу подключится.</p><input class="field" id="modal-value" value="' + esc(link) + '" readonly aria-label="Ссылка для ученика">' + fileNote, () => { }, 'Готово', true);
            $('#modal-value').select();
        }
        function askCode() {
            modal('Подключиться к уроку', '<p>Вставьте ссылку или код, который прислал преподаватель.</p><label class="field-label" for="modal-value">Ссылка или код</label><input class="field" id="modal-value" placeholder="marina.AbC…">', v => {
                const raw = String(v).trim(), part = raw.includes('#live.') ? raw.split('#live.')[1] : raw.replace(/^live\./, '');
                const [lesson, room, key] = part.split('.');
                setTimeout(() => join(lesson || '', room || '', key || '', 'student'), 0);
            }, 'Подключиться', true);
        }
        /* ----- подключение к коду платформы ----- */
        const wrap = (fn, after) => function (...args) { const r = fn.apply(this, args); after(...args); return r; };
        // План урока перерисовывается, когда поле теряет фокус. Если это случается между нажатием и отпусканием кнопки,
        // браузер теряет клик. Поэтому пока кнопка мыши или палец нажаты, перерисовку откладываем.
        let pressed = false, statsPending = false;
        const baseStats = refreshLessonStats, statsHooks = [];
        const runStats = () => { baseStats(); statsHooks.forEach(f => f()); };
        refreshLessonStats = function () { if (pressed) {
            statsPending = true;
            return;
        } runStats(); };
        const release = () => setTimeout(() => { pressed = false; if (statsPending) {
            statsPending = false;
            runStats();
        } }, 0);
        document.addEventListener('pointerdown', () => { pressed = true; }, true);
        document.addEventListener('pointerup', release, true);
        document.addEventListener('pointercancel', release, true);
        checkEx = wrap(checkEx, ex => sendFields($$('.gap[data-a]', ex), ex));
        revealEx = wrap(revealEx, ex => sendFields($$('.gap[data-a]', ex), ex));
        showSection = wrap(showSection, () => { if (session && !applying && currentLesson === session.lesson)
            send('nav', { section: currentSection, follow: session.follow }); renderBar(); repositionCursors(); });
        route = wrap(route, () => { renderBar(); repositionCursors(); });
        renderHome = wrap(renderHome, () => {
            var _a;
            if (session)
                return;
            const box = document.createElement('div');
            box.className = 'live-join panel';
            box.innerHTML = '<div><h2>Урок с преподавателем</h2><p>Если преподаватель прислал ссылку или код, подключитесь к совместному уроку.</p></div><button class="ui-btn outline" data-live="join">Подключиться к уроку</button>';
            (_a = $('#screen-home .stat-row')) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement('afterend', box);
        });
        const baseOpenFromHash = openFromHash;
        openFromHash = function () {
            const h = decodeURIComponent(location.hash.slice(1));
            if (h.startsWith('live.')) {
                const [, lesson, room, key, t] = h.split('.');
                if (session && session.room === room)
                    return;
                join(lesson || '', room || '', key || '', t === 't' ? 'teacher' : 'student').then(ok => { if (!ok)
                    route('home'); });
                return;
            }
            if (session)
                return;
            baseOpenFromHash();
        };
        document.addEventListener('input', e => { var _a; const f = e.target; if (session && f.dataset && f.dataset.field && ((_a = ownPane()) === null || _a === void 0 ? void 0 : _a.contains(f)))
            queueField(f); });
        document.addEventListener('change', e => { var _a; const f = e.target; if (session && f.dataset && f.dataset.field && f.tagName === 'SELECT' && ((_a = ownPane()) === null || _a === void 0 ? void 0 : _a.contains(f)))
            queueField(f); });
        document.addEventListener('click', e => {
            const b = e.target.closest('button');
            if (!b)
                return;
            if (b.dataset.liveView !== undefined && session) {
                showWork(b.dataset.liveView);
                return;
            }
            const act = b.dataset.live;
            if (act) {
                if (act === 'start')
                    start();
                if (act === 'join')
                    askCode();
                if (!session)
                    return;
                if (act === 'link')
                    shareLink();
                if (act === 'pointer') {
                    session.pointerOn = !session.pointerOn;
                    if (!session.pointerOn) {
                        lastPointerJson = '';
                        send('pointer', { a: null });
                    }
                    renderBar();
                }
                if (act === 'follow') {
                    session.follow = !session.follow;
                    if (session.follow && currentLesson === session.lesson)
                        send('nav', { section: currentSection, follow: true });
                    renderBar();
                }
                if (act === 'summon') {
                    if (lastAnchor)
                        send('summon', { a: lastAnchor });
                    else
                        send('nav', { section: currentSection, follow: true });
                    notify('Экран ученика прокручен к вашей указке.');
                }
                if (act === 'goto-student') {
                    const p = peerOnline();
                    if (p === null || p === void 0 ? void 0 : p.section) {
                        currentSection = p.section;
                        showSection();
                    }
                }
                if (act === 'goto-teacher') {
                    currentSection = session.teacherSection;
                    showSection();
                }
                if (act === 'end')
                    modal('Завершить совместный урок?', 'Ученик останется на странице, его ответы сохранятся у него на устройстве.', () => leave(true), 'Завершить');
                if (act === 'leave')
                    leave(true);
                return;
            }
            if (!session || !ownPane())
                return;
            if (b.id === 'modal-confirm' && pendingReset) {
                pendingReset = false;
                if (!(session.private && session.role === 'teacher'))
                    sendSnapshot(true);
                return;
            }
            if (b.id === 'modal-cancel')
                pendingReset = false;
            if (b.dataset.action === 'reset-lesson') {
                pendingReset = true;
                return;
            }
            if (!ownPane().contains(b)) {
                if (b.dataset.action === 'complete-stage' && currentLesson === session.lesson && !(session.private && session.role === 'teacher'))
                    send('completed', { k: currentSection, on: !!profile().completed[currentSection] });
                return;
            }
            const mc = b.closest('.mc'), flip = b.closest('.flip'), picker = b.closest('.picker'), timer = b.closest('.timer');
            if (mc && b.classList.contains('opt') && mc.dataset.choice) {
                if (session.private && session.role === 'teacher')
                    return;
                const rec = profile().choices[mc.dataset.choice];
                if (rec) {
                    snapshotDirty = true;
                    send('choice', { k: mc.dataset.choice, rec });
                }
            }
            else if (flip && flip.dataset.flip) {
                snapshotDirty = true;
                send('flip', { k: flip.dataset.flip, on: !!profile().flips[flip.dataset.flip] });
            }
            else if (picker && picker.dataset.picker) {
                const saved = profile().pickers[picker.dataset.picker];
                if (saved)
                    send('picker', { k: picker.dataset.picker, saved });
            }
            else if (timer) {
                const st = timerState(timer);
                if (st)
                    send('timer', Object.assign({ i: indexIn(timer, '.timer') }, st));
            }
        });
        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerdown', onPointerDown, { passive: true });
        document.documentElement.addEventListener('pointerleave', hidePointer);
        window.addEventListener('blur', hidePointer);
        window.addEventListener('scroll', repositionCursors, { passive: true, capture: true });
        window.addEventListener('resize', repositionCursors);
        document.addEventListener('visibilitychange', () => { if (!document.hidden && session)
            hello(); });
        window.addEventListener('pagehide', () => { if (session)
            send(session.role === 'teacher' ? 'ping' : 'bye'); });
        setInterval(() => {
            if (!session)
                return;
            send('ping', { section: currentLesson === session.lesson ? currentSection : null });
            let dropped = false;
            peers.forEach((p, id) => { if (Date.now() - p.last > PEER_TIMEOUT) {
                peers.delete(id);
                removeCursor(id);
                dropped = true;
            } });
            if (dropped)
                notify(session.role === 'teacher' ? 'Ученик отключился. Он вернётся автоматически, когда появится связь.' : 'Нет связи с преподавателем. Переподключаемся…');
            renderBar();
        }, PING_EVERY);
        setInterval(() => { if (session && session.role === 'student' && snapshotDirty && peerOnline())
            sendSnapshot(false); }, SNAPSHOT_EVERY);
        return { renderBar, onStats: f => statsHooks.push(f), get active() { return !!session; }, get role() { return session ? session.role : null; }, get lesson() { return session ? session.lesson : null; },
            get room() { return session ? session.room : null; }, join, leave, seal, unseal, rid, set classRoom(f) { classRoom = f; },
            on: (type, f) => { (custom[type] = custom[type] || []).push(f); }, send: (type, data) => send(type, data), brokers: BROKERS };
    })();
    /* ---------- Личный вход: у каждого ученика своя ссылка, планы уроков открываются только преподавателю ---------- */
    const access = (function () {
        var _a, _b, _c;
        const CFG = JSON.parse($('#access-data').textContent);
        const STORE = 'iris-access-v1', enc = new TextEncoder();
        let ready = false, pendingOpen = false, vaultOpen = false, teacherSecret = null;
        const b64e = buf => { let s = ''; new Uint8Array(buf).forEach(b => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
        const b64d = str => Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4)), c => c.charCodeAt(0));
        const locked = () => !accessInfo || accessInfo.role === 'student';
        // Ссылки, которые уходят другим людям, без личного кода. Свой код остаётся в адресе (?k=), чтобы вход
        // сохранялся после перезагрузки, в закладках и при «Открыть в Safari», даже если браузер ничего не помнит.
        const pageUrl = () => { const u = new URL(location.href); u.hash = ''; u.searchParams.delete('k'); if (window.IRIS_LIGHT_PAGE)
            u.pathname = u.pathname.replace(/[^/]*$/, 'index.html'); return u.toString(); }; // links we give out always point to the main page (it sends everyone to the right place)
        const personalUrl = token => { const u = new URL(pageUrl()); u.searchParams.set('k', token); return u.toString(); };
        function keepInUrl(token, hash) { try {
            const u = new URL(location.href);
            let kept = false; /*iris-url-key*/
            try { kept = (JSON.parse(localStorage.getItem('iris-access-v1') || 'null') || {}).t === token; } catch (_) { }
            if (kept && !/(Telegram|FBAN|FBAV|Instagram|VKClient|VKAndroidApp|WhatsApp|Line\/|MicroMessenger|OKApp|; wv\))/i.test(navigator.userAgent)) u.searchParams.delete('k'); else u.searchParams.set('k', token);
            if (hash !== undefined)
                u.hash = hash;
            history.replaceState(null, '', u.toString());
        }
        catch (_) { } }
        function dropFromUrl() { try {
            const u = new URL(location.href);
            u.searchParams.delete('k');
            u.hash = '';
            history.replaceState(null, '', u.toString());
        }
        catch (_) { } }
        async function verifier(token) { return b64e(await crypto.subtle.digest('SHA-256', enc.encode('iris-entry:' + token))); }
        async function studentToken(secret, id) {
            const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            return b64e(await crypto.subtle.sign('HMAC', k, enc.encode('student:' + id))).slice(0, 22);
        }
        async function identify(token) {
            var _a;
            if (!/^[A-Za-z0-9_-]{16,64}$/.test(token || '') || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return null;
            const v = await verifier(token);
            if (v === CFG.teacher)
                return { role: 'teacher', token };
            const entry = CFG.entries.find(e => e.v === v);
            return entry && DATA.some(d => d.id === entry.profile) ? { role: 'student', token, entry } : null;
        }
        const readStored = () => { var _a; try {
            return ((_a = JSON.parse(localStorage.getItem(STORE) || 'null')) === null || _a === void 0 ? void 0 : _a.t) || null;
        }
        catch (_) {
            return null;
        } };
        const writeStored = t => { try {
            localStorage.setItem(STORE, JSON.stringify({ t }));
        }
        catch (_) { } };
        const BROWSER_HINT = 'Этот браузер не умеет открывать защищённый вход. Откройте ссылку в Chrome или Safari (не внутри мессенджера) и проверьте, что адрес начинается с https://. На старом планшете обновите браузер.';
        const tokenFrom = text => { const s = String(text || '').trim(); const m = /#k\.([A-Za-z0-9_-]+)/.exec(s); return m ? m[1] : s.replace(/^k\./, ''); };
        /* ----- экран входа ----- */
        const gate = document.createElement('div');
        gate.className = 'access-gate';
        gate.hidden = true;
        gate.innerHTML = '<div class="access-card" role="dialog" aria-labelledby="access-title"><div class="kicker">IRIS SCHOOL</div><h1 id="access-title">Вход в класс</h1><p>Откройте личную ссылку, которую прислал преподаватель, или вставьте её сюда.</p><form id="access-form"><label class="field-label" for="access-code">Личная ссылка или код</label><input class="field" id="access-code" autocomplete="off" placeholder="https://…/platform/?k=…"><button class="ui-btn" type="submit">Войти</button></form><p class="access-error" id="access-error" aria-live="polite"></p><p class="help-text">Ссылка открывает только ваш кабинет. Не пересылайте её другим.</p></div>';
        document.body.appendChild(gate);
        $('#access-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const raw = $('#access-code').value.trim();
            const liveCode = /#live\.([^\s]+)/.exec(raw);
            if (liveCode) {
                gate.hidden = true;
                location.hash = 'live.' + liveCode[1];
                return;
            }
            const info = await identify(tokenFrom(raw));
            if (!info) {
                $('#access-error').textContent = !window.crypto || !window.crypto.subtle ? BROWSER_HINT : 'Ссылка не подошла. Проверьте, что скопировали её целиком.';
                return;
            }
            writeStored(info.token);
            keepInUrl(info.token, 'home');
            gate.hidden = true;
            await apply(info);
            route('home');
            if (info.role === 'student') {
                paintFeedback();
                checkFeedback().catch(() => { });
            }
            if (pendingHw && info.role === 'teacher') {
                const code = pendingHw;
                pendingHw = null;
                state.role = 'teacher';
                save();
                route('teacher');
                receiveHw(code);
            }
        });
        function showGate(message = '') { resetScreens(); gate.hidden = false; $('#access-error').textContent = message; document.body.classList.add('locked'); setTimeout(() => $('#access-code').focus(), 0); }
        /* ----- интерфейс ученика и преподавателя ----- */
        const nameTag = document.createElement('div');
        nameTag.className = 'access-name';
        nameTag.id = 'access-name';
        (_a = $('.profile-control > div:not(.avatar)')) === null || _a === void 0 ? void 0 : _a.appendChild(nameTag);
        const logout = document.createElement('button');
        logout.type = 'button';
        logout.className = 'mode-button access-logout';
        logout.textContent = 'Выйти из кабинета';
        $('.sidebar-bottom').insertBefore(logout, $('.sidebar-bottom .prototype-note'));
        logout.addEventListener('click', () => modal('Выйти из кабинета?', 'Чтобы снова войти, понадобится личная ссылка. Ответы и словарь останутся на этом устройстве.', () => { try {
            localStorage.removeItem(STORE);
        }
        catch (_) { } accessInfo = null; dropFromUrl(); showGate(); }, 'Выйти'));
        document.addEventListener('click', e => { if (locked() && e.target.closest('#mode-toggle')) {
            e.preventDefault();
            e.stopPropagation();
        } }, true);
        async function apply(info) {
            accessInfo = info;
            document.body.classList.toggle('locked', info.role === 'student');
            document.body.classList.toggle('teacher-access', info.role === 'teacher');
            if (info.role === 'student') {
                const d = DATA.find(x => x.id === info.entry.profile);
                const short = info.entry.name.replace(/\s+[А-ЯЁA-Z]\.$/, '').replace(/\s*\(.*\)$/, ''); // «Оля (B1)» → «Привет, Оля»   // «Юля К.» → «Привет, Юля»
                d.greeting = short;
                d.initials = short.slice(0, 1).toUpperCase();
                const pair = CFG.entries.filter(e => e.profile === info.entry.profile);
                if (pair.length === 2)
                    document.body.classList.add(pair[0].id === info.entry.id ? 'pair-a' : 'pair-b'); // пара: каждый видит только свою карточку A / B
                state.role = 'student';
                hideDrafts();
                hideBook();
                selectProfile(info.entry.profile, false);
                lobbyListen().catch(() => { });
                wordsSync().catch(() => { });
                progressSync().catch(() => { });
                classWatch().catch(() => { });
                retryOutboxSoon(3000);
            }
            else {
                await openVault(info.token);
                classPresence().catch(() => { });
                bookSync().catch(() => { });
                wordsSync().catch(() => { });
            }
            updateChrome();
        }
        async function openVault(secret) {
            var _a;
            if (vaultOpen)
                return;
            teacherSecret = secret;
            try {
                const key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('iris-vault:' + secret)), 'AES-GCM', false, ['decrypt']);
                const html = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(CFG.vault.iv) }, key, b64d(CFG.vault.ct)));
                $('#teacher').innerHTML = html;
                vaultOpen = true;
                const privJwk = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(CFG.inbox.priv.iv) }, key, b64d(CFG.inbox.priv.ct))));
                inboxKey = await crypto.subtle.importKey('jwk', privJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey']);
                const personal = personalUrl;
                const rows = await Promise.all(CFG.entries.map(async (e) => ({ e, link: personal(await studentToken(secret, e.id)) })));
                const box = document.createElement('section');
                box.className = 'step';
                box.id = 'teacher-access';
                box.innerHTML = '<div class="step-head"><h2>Личные ссылки учеников</h2></div><p>У каждого ученика своя ссылка: по ней он попадает только в свой кабинет. Отправьте её один раз, дальше платформа помнит ученика на этом устройстве. Для совместного урока используйте кнопку «Начать совместный урок».</p><div class="access-links">'
                    + [[rows.filter(r => r.e.group !== 'school'), ''], [rows.filter(r => r.e.group === 'school'), 'Онлайн-школа · временно']].filter(([list]) => list.length).map(([list, title]) => (title ? '</div><h3 class="access-group">' + title + '</h3><div class="access-links">' : '')
                        + list.map(({ e, link }) => { const m = DATA.find(d => d.id === e.profile); const label = e.name + (m && m.name !== e.name && m.owner === e.profile && /Групп/.test(m.name) ? ' · ' + m.name : ''); return '<div class="access-row" data-group="' + esc(e.group || 'mine') + '"><strong>' + esc(label) + '</strong><input class="field" readonly value="' + esc(link) + '" aria-label="Ссылка для ' + esc(label) + '"><button class="ui-btn small soft" type="button" data-copy-link="' + esc(link) + '">Скопировать</button><button class="ui-btn small soft" type="button" data-qr-link="' + esc(link) + '" data-qr-name="' + esc(label) + '">QR</button></div>'; }).join('')).join('') + '</div>';
                (_a = $('#teacher main')) === null || _a === void 0 ? void 0 : _a.prepend(box);
                const nav = $('#teacher .lesson-nav');
                if (nav)
                    nav.insertAdjacentHTML('afterbegin', '<a href="#teacher-access">Ссылки учеников</a>');
                // Online school lessons: a separate block at the end of the plans and of the menu
                const school = $$('#teacher section.lesson-card[data-group="school"]');
                if (school.length) {
                    const head = document.createElement('section');
                    head.className = 'step school-head';
                    head.id = 'teacher-school';
                    head.innerHTML = '<div class="step-head"><h2>Онлайн-школа · временно</h2></div><p>Ученики онлайн-школы. Они видят только свои уроки, как и ваши ученики. Когда раздел станет не нужен, его можно убрать целиком.</p>';
                    const host = school[0].parentElement;
                    host.appendChild(head);
                    school.forEach(c => host.appendChild(c));
                    if (nav) {
                        const links = $$('a[data-group="school"]', nav);
                        nav.insertAdjacentHTML('beforeend', '<a href="#teacher-school" class="nav-group">Онлайн-школа:</a>');
                        links.forEach(l => nav.appendChild(l));
                    }
                }
                // уроки одного ученика — рядом: в меню планов и в самих планах («Ксения», «Ксения · 2», «Ксения · 3»)
                const ownerOf = id => (DATA.find(d => d.id === id) || {}).owner || (id === 'zm' ? 'zakhar-mikhail' : null);
                const groupByOwner = (els, idOf) => { const last = {}; els.forEach(el => { const o = ownerOf(idOf(el)); if (!o)
                    return; if (last[o] && last[o] !== el)
                    last[o].after(el); last[o] = el; }); };
                if (nav)
                    groupByOwner($$('a[href^="#teacher-"]', nav), a => a.getAttribute('href').slice(9));
                groupByOwner($$('#teacher section.lesson-card[id^="teacher-"]'), c => c.id.slice(8));
                renderInbox();
                refreshInboxNav();
                listenInbox().catch(() => { });
                paintDraftButtons();
                buildHub();
            }
            catch (_) {
                notify('Не удалось открыть планы уроков. Откройте ссылку преподавателя ещё раз.');
            }
        }
        document.addEventListener('click', async (e) => {
            const b = e.target.closest('[data-copy-link]');
            if (!b)
                return;
            try {
                await navigator.clipboard.writeText(b.dataset.copyLink);
                notify('Ссылка скопирована.');
            }
            catch (_) {
                b.previousElementSibling.select();
                notify('Выделите ссылку и скопируйте её.');
            }
        });
        // QR-код личной ссылки: ученик наводит камеру планшета или телефона — и сразу в своём кабинете, ничего не надо вводить
        document.addEventListener('click', e => {
            const b = e.target.closest('[data-qr-link]');
            if (!b || typeof qrcode !== 'function')
                return;
            const q = qrcode(0, 'M');
            q.addData(b.dataset.qrLink);
            q.make();
            modal('QR-код для входа · ' + b.dataset.qrName, '<div class="qr-box">' + q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }) + '</div><p class="help-text">Покажите код ученику (на экране или распечатайте): он наводит камеру планшета или телефона и открывает ссылку — сразу попадает в свой кабинет. Код личный — не публикуйте его.</p><input type="hidden" id="modal-value" value="qr">', () => { }, 'Готово', true);
        });
        /* ----- подсказка для встроенных браузеров мессенджеров: там ответы могут не сохраниться ----- */
        const inApp = !!window.TelegramWebviewProxy || /Telegram|WhatsApp|Instagram|FBAN|FBAV|VKClient|Line\//i.test(navigator.userAgent);
        let hintClosed = false;
        try {
            hintClosed = sessionStorage.getItem('iris-inapp-hint') === '1';
        }
        catch (_) { }
        if (inApp && !hintClosed) {
            const hint = document.createElement('div');
            hint.className = 'inapp-hint';
            hint.setAttribute('role', 'status');
            hint.innerHTML = '<span>Вы открыли платформу внутри мессенджера. Чтобы ответы не потерялись, откройте её в браузере: нажмите <b>⋯</b> → <b>«Открыть в Safari / в браузере»</b>.</span><button type="button" aria-label="Скрыть подсказку">✕</button>';
            hint.querySelector('button').addEventListener('click', () => { hint.remove(); try {
                sessionStorage.setItem('iris-inapp-hint', '1');
            }
            catch (_) { } });
            document.body.prepend(hint);
        }
        /* ----- ограничения для ученика ----- */
        selectProfile = (base => function (id, ...rest) { if (locked() && accessInfo && id !== accessInfo.entry.profile && !live.active)
            return; return base.call(this, id, ...rest); })(selectProfile);
        route = (base => function (next, ...rest) {
            if (locked() && ['teacher', 'builder'].includes(next))
                next = 'home';
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' && !live.active && state.profile !== accessInfo.entry.profile)
                selectProfile(accessInfo.entry.profile, false);
            return base.call(this, next, ...rest);
        })(route);
        updateChrome = (base => function (...a) { base.apply(this, a); if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student') {
            nameTag.textContent = accessInfo.entry.name;
            $('#profile-avatar').textContent = accessInfo.entry.name.slice(0, 1).toUpperCase();
        }
        else if (!accessInfo) {
            nameTag.textContent = 'Ученик';
        } })(updateChrome);
        const baseOpen = openFromHash;
        openFromHash = function () {
            if (!ready) {
                pendingOpen = true;
                return;
            }
            const h = decodeURIComponent(location.hash.slice(1));
            if (h.startsWith('live.')) {
                if (!accessInfo)
                    document.body.classList.add('locked');
                baseOpen();
                return;
            }
            if (h.startsWith('fb.')) {
                history.replaceState(null, '', '#home');
                if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student') {
                    if (!accessInfo)
                        showGate('Это разбор для ученика. Откройте его по ссылке, которую прислал преподаватель.');
                    else
                        route('home');
                    return;
                }
                route('home');
                fbKeys(accessInfo.token).then(({ key }) => receiveFeedback(key, h.slice(3), true)).then(fb => { if (fb)
                    showFeedback(fb);
                else
                    notify('Не удалось открыть разбор: ссылка повреждена.'); });
                return;
            }
            if (h.startsWith('hw.')) {
                history.replaceState(null, '', '#home');
                if (!accessInfo) {
                    pendingHw = h.slice(3);
                    showGate('Это ответы ученика. Чтобы их открыть, войдите по своей ссылке преподавателя.');
                    return;
                }
                if (accessInfo.role !== 'teacher') {
                    route('home');
                    notify('Эту ссылку с ответами может открыть только преподаватель.');
                    return;
                }
                state.role = 'teacher';
                save();
                route('teacher');
                receiveHw(h.slice(3));
                return;
            }
            if (!accessInfo) {
                showGate();
                return;
            }
            if (accessInfo.role === 'student') {
                if (h === 'teacher' || h === 'builder') {
                    route('home');
                    return;
                }
                const m = allLessons().find(x => x.id === h || sectionsFor(x.id).some(s => s.id === h));
                if (m && m.owner !== accessInfo.entry.profile && !live.active) {
                    route('home');
                    return;
                }
            }
            baseOpen();
        };
        /* ----- разбор от преподавателя ученику: приходит прямо на платформу ----- */
        // Разбор шифруется ключом из личной ссылки ученика и кладётся на сервер связи как «сохранённое сообщение»
        // (тема тоже выводится из личной ссылки). Ученик получает его при входе в кабинет. Запасной путь — ссылка #fb.
        const FB_TOPIC = 'iris-school/v1/fb/', FB_RE = /^[A-Za-z0-9_-]{40,12000}$/;
        async function fbKeys(token) {
            const t = b64e(await crypto.subtle.digest('SHA-256', enc.encode('iris-feedback-topic:' + token))).slice(0, 24);
            const key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('iris-feedback-key:' + token)), 'AES-GCM', false, ['encrypt', 'decrypt']);
            return { topic: FB_TOPIC + t, key };
        }
        async function fbSeal(key, obj) {
            const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj))));
            const out = new Uint8Array(12 + ct.length);
            out.set(iv);
            out.set(ct, 12);
            return b64e(out);
        }
        async function fbOpen(key, code) {
            if (!FB_RE.test(code))
                throw Error('format');
            const u = b64d(code);
            const fb = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12))));
            if (!fb || fb.v !== 1 || typeof fb.l !== 'string' || !lessonMeta(fb.l) || typeof fb.at !== 'number')
                throw Error('content');
            return { l: fb.l, t: Number(fb.t) || 0, at: fb.at, o: String(fb.o || '').slice(0, 3000), n: fb.n && typeof fb.n === 'object' ? Object.fromEntries(Object.entries(fb.n).filter(([k, v]) => /^[fc]:[A-Za-z0-9_-]{1,120}$/.test(k) && typeof v === 'string').map(([k, v]) => [k, v.slice(0, 600)])) : {}, s: Array.isArray(fb.s) ? fb.s.slice(0, 2).map(Number) : null };
        }
        const brokerList = () => (typeof live !== 'undefined' && live.brokers) || [];
        function publishRetained(topic, payload) {
            return new Promise(resolve => {
                const list = brokerList();
                if (typeof mqtt === 'undefined' || !list.length) {
                    resolve(false);
                    return;
                }
                let left = list.length, ok = false;
                const done = r => { if (r && !ok) {
                    ok = true;
                    resolve(true);
                } if (--left === 0 && !ok)
                    resolve(false); };
                list.forEach(b => {
                    let settled = false;
                    const c = mqtt.connect(b.url, { username: b.username, password: b.password, clientId: 'iris_fb_' + b64e(crypto.getRandomValues(new Uint8Array(6))), connectTimeout: 12000, reconnectPeriod: 0, clean: true, protocolVersion: 4 });
                    const settle = r => { if (settled)
                        return; settled = true; try {
                        c.end(false);
                    }
                    catch (_) { } done(r); };
                    c.on('connect', () => c.publish(topic, payload, { qos: 1, retain: true }, err => settle(!err)));
                    c.on('error', () => settle(false));
                    setTimeout(() => settle(false), 15000);
                });
            });
        }
        const fbStore = () => { const pr = profile(); if (!pr.feedback || typeof pr.feedback !== 'object')
            pr.feedback = {}; return pr.feedback; };
        async function receiveFeedback(key, code, quiet = false) {
            var _a;
            let fb;
            try {
                fb = await fbOpen(key, code);
            }
            catch (_) {
                return null;
            }
            const store = fbStore(), id = fb.l + ':' + fb.t, old = store[id];
            if (old && old.at >= fb.at)
                return old;
            store[id] = Object.assign(Object.assign({}, fb), { read: false });
            save();
            paintFeedback();
            if (!quiet)
                notify('Пришёл разбор от преподавателя: «' + (((_a = lessonMeta(fb.l)) === null || _a === void 0 ? void 0 : _a.title) || '') + '»');
            if (screen === 'home')
                renderHome();
            return store[id];
        }
        async function checkFeedback() {
            var _a;
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || typeof mqtt === 'undefined' || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return;
            const { topic, key } = await fbKeys(accessInfo.token);
            brokerList().forEach(b => {
                const c = mqtt.connect(b.url, { username: b.username, password: b.password, clientId: 'iris_in_' + b64e(crypto.getRandomValues(new Uint8Array(6))), connectTimeout: 8000, reconnectPeriod: 0, clean: true, protocolVersion: 4 });
                c.on('connect', () => c.subscribe(topic + '/+', { qos: 1 }, () => { }));
                c.on('message', (t, payload) => { if (t.startsWith(topic + '/'))
                    receiveFeedback(key, new TextDecoder().decode(payload)); });
                c.on('error', () => { });
                setTimeout(() => { try {
                    c.end(true);
                }
                catch (_) { } }, 25000);
            });
        }
        function fbTarget(lessonId, k) {
            const pane = paneFor(lessonId);
            if (!pane)
                return null;
            const [kind, id] = [k.slice(0, 1), k.slice(2)];
            return kind === 'f' ? $$('[data-field]', pane).find(x => x.dataset.field === id) : $$('[data-choice]', pane).find(x => x.dataset.choice === id);
        }
        function paintFeedback() {
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student')
                return;
            Object.values(fbStore()).sort((a, b) => a.at - b.at).forEach(fb => Object.entries(fb.n || {}).forEach(([k, text]) => {
                const el = fbTarget(fb.l, k);
                if (!el)
                    return;
                const host = el.closest('li') || el.parentElement;
                let box = $$('.fb-inline', host).find(x => x.dataset.k === k);
                if (!box) {
                    box = document.createElement('div');
                    box.className = 'fb-inline';
                    box.dataset.k = k;
                    host.appendChild(box);
                }
                box.innerHTML = '💬 <b>Преподаватель:</b> ' + esc(text);
            }));
        }
        function showFeedback(fb) {
            var _a;
            fb.read = true;
            save();
            const when = new Date(fb.at).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }), pr = profile();
            const notes = Object.entries(fb.n || {}).map(([k, text]) => {
                var _a, _b, _c, _d, _e, _f;
                const el = fbTarget(fb.l, k);
                if (!el)
                    return '';
                const mine = k.startsWith('f:') ? (_b = (_a = pr.fields) === null || _a === void 0 ? void 0 : _a[el.dataset.field]) === null || _b === void 0 ? void 0 : _b.value : (_e = $$('.opt', el)[(_d = (_c = pr.choices) === null || _c === void 0 ? void 0 : _c[el.dataset.choice]) === null || _d === void 0 ? void 0 : _d.selected]) === null || _e === void 0 ? void 0 : _e.textContent;
                const q = k.startsWith('f:') ? fieldLabel(el) : (((_f = $('.q', el)) === null || _f === void 0 ? void 0 : _f.textContent) || '');
                return '<li><div class="hw-q">' + esc(q) + '</div>' + (mine ? '<div class="hw-a">Ваш ответ: ' + esc(mine) + '</div>' : '') + '<div class="fb-inline">💬 ' + esc(text) + '</div></li>';
            }).join('');
            hwView.innerHTML = '<div class="hw-card" role="dialog" aria-labelledby="fb-title"><div class="hw-head"><div><div class="kicker">РАЗБОР ОТ ПРЕПОДАВАТЕЛЯ</div><h2 id="fb-title">' + esc(((_a = lessonMeta(fb.l)) === null || _a === void 0 ? void 0 : _a.title) || '') + '</h2><p>' + esc(when) + (fb.s && fb.s[1] ? ' · верно ' + fb.s[0] + ' из ' + fb.s[1] : '') + '</p></div><div class="hw-actions"><button class="ui-btn soft small" type="button" data-fb-lesson="' + esc(fb.l) + '">Открыть урок</button><button class="ui-btn outline small" type="button" data-hw-close>Закрыть</button></div></div>'
                + (fb.o ? '<div class="fb-overall">' + esc(fb.o).replace(/\n/g, '<br>') + '</div>' : '') + (notes ? '<h3>Комментарии к ответам</h3><ol class="hw-list">' + notes + '</ol>' : '') + '</div>';
            hwView.hidden = false;
            hwView.scrollTop = 0;
            if (screen === 'home')
                renderHome();
        }
        async function sendFeedback(btn) {
            var _a;
            const sub = shownHw, entry = sub && CFG.entries.find(e => e.id === sub.e);
            if (!entry || !teacherSecret)
                return;
            const notes = {};
            $$('.fb-note', hwView).forEach(i => { const v = i.value.trim(); if (v)
                notes[i.dataset.fbKey] = v.slice(0, 600); });
            const overall = (((_a = $('#fb-overall')) === null || _a === void 0 ? void 0 : _a.value) || '').trim().slice(0, 3000);
            if (!overall && !Object.keys(notes).length) {
                notify('Напишите комментарий — общий или к отдельным ответам.');
                return;
            }
            btn.disabled = true;
            btn.textContent = 'Отправляю…';
            try {
                const token = await studentToken(teacherSecret, entry.id), { topic, key } = await fbKeys(token);
                const code = await fbSeal(key, { v: 1, l: sub.l, t: sub.t, at: Date.now(), o: overall, n: notes, s: sub._score || null });
                const ok = await publishRetained(topic + '/' + sub.l, code), link = personalUrl(token) + '#fb.' + code;
                const list = inboxList(), row = list.find(x => x.id === sub.id);
                if (row) {
                    row.fb = row.ok = Date.now();
                    row.seen = true;
                    saveInbox(list);
                    renderInbox();
                    refreshInboxNav();
                }
                modal('Разбор отправлен', (ok ? '<p>✅ Разбор доставлен на платформу: ' + esc(entry.name) + ' увидит его, когда откроет свой кабинет.</p>' : '<p>Сервер связи сейчас недоступен, поэтому отправьте разбор ссылкой.</p>') + '<p class="help-text">' + (ok ? 'Можно также отправить ссылку в мессенджер — по ней разбор откроется сразу:' : 'Ссылка для ' + esc(entry.name) + ':') + '</p><input class="field" id="modal-value" readonly value="' + esc(link) + '" aria-label="Ссылка на разбор">', () => { }, 'Готово', true);
                $('#modal-value').select();
            }
            catch (_) {
                notify('Не получилось отправить разбор. Попробуйте ещё раз.');
            }
            finally {
                btn.disabled = false;
                btn.textContent = 'Отправить разбор ученику';
            }
        }
        /* ----- ответы ученика: отправка преподавателю и «Работы учеников» ----- */
        // Актуальная домашка урока: раздел hwSection (или последний «…-prep»); «сдана», только если отправлена после hwSince
        window.irisHw = {
            section: m => { const secs = sectionsFor(m.id); return secs.find(x => x.id === m.hwSection) || secs.filter(x => /-prep$/.test(x.id)).pop() || null; },
            sent: (m, sent) => { const t = sent && sent[m.id]; return !!t && (!m.hwSince || t >= Date.parse(m.hwSince)); }
        };
        /* Распаковка deflate / gzip без DecompressionStream — для старых браузеров (Safari на iPad до 16.4): иначе такой планшет
           не может прочитать ответы, синхронизированные с телефона или ноутбука. Небольшой распаковщик по мотивам tinf (J. Ibsen). */
        const irisInflate = (() => {
            function Tree() { this.table = new Uint16Array(16); this.trans = new Uint16Array(288); }
            const sltree = new Tree(), sdtree = new Tree(), lbits = new Uint8Array(30), lbase = new Uint16Array(30), dbits = new Uint8Array(30), dbase = new Uint16Array(30);
            const clcidx = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), codeTree = new Tree(), lengths = new Uint8Array(320), offs = new Uint16Array(16);
            function buildBits(bits, base, delta, first) { let i, sum; for (i = 0; i < delta; ++i)
                bits[i] = 0; for (i = 0; i < 30 - delta; ++i)
                bits[i + delta] = i / delta | 0; for (sum = first, i = 0; i < 30; ++i) {
                base[i] = sum;
                sum += 1 << bits[i];
            } }
            function buildTree(t, lens, off, num) {
                let i, sum;
                for (i = 0; i < 16; ++i)
                    t.table[i] = 0;
                for (i = 0; i < num; ++i)
                    t.table[lens[off + i]]++;
                t.table[0] = 0;
                for (sum = 0, i = 0; i < 16; ++i) {
                    offs[i] = sum;
                    sum += t.table[i];
                }
                for (i = 0; i < num; ++i)
                    if (lens[off + i])
                        t.trans[offs[lens[off + i]]++] = i;
            }
            (function fixed(lt, dt) {
                let i;
                for (i = 0; i < 7; ++i)
                    lt.table[i] = 0;
                lt.table[7] = 24;
                lt.table[8] = 152;
                lt.table[9] = 112;
                for (i = 0; i < 24; ++i)
                    lt.trans[i] = 256 + i;
                for (i = 0; i < 144; ++i)
                    lt.trans[24 + i] = i;
                for (i = 0; i < 8; ++i)
                    lt.trans[168 + i] = 280 + i;
                for (i = 0; i < 112; ++i)
                    lt.trans[176 + i] = 144 + i;
                for (i = 0; i < 5; ++i)
                    dt.table[i] = 0;
                dt.table[5] = 32;
                for (i = 0; i < 32; ++i)
                    dt.trans[i] = i;
            })(sltree, sdtree);
            buildBits(lbits, lbase, 4, 3);
            buildBits(dbits, dbase, 2, 1);
            lbits[28] = 0;
            lbase[28] = 258;
            const getbit = d => { if (!d.bitcount--) {
                d.tag = d.src[d.si++] | 0;
                d.bitcount = 7;
            } const bit = d.tag & 1; d.tag >>>= 1; return bit; };
            const fill = d => { while (d.bitcount < 24) {
                d.tag |= (d.src[d.si++] | 0) << d.bitcount;
                d.bitcount += 8;
            } };
            const readBits = (d, num, base) => { if (!num)
                return base; fill(d); const val = d.tag & (0xffff >>> (16 - num)); d.tag >>>= num; d.bitcount -= num; return val + base; };
            function decodeSym(d, t) {
                fill(d);
                let sum = 0, cur = 0, len = 0, tag = d.tag;
                do {
                    cur = 2 * cur + (tag & 1);
                    tag >>>= 1;
                    ++len;
                    sum += t.table[len];
                    cur -= t.table[len];
                } while (cur >= 0 && len < 16);
                d.tag = tag;
                d.bitcount -= len;
                return t.trans[sum + cur];
            }
            function decodeTrees(d, lt, dt) {
                let i, num, length;
                const hlit = readBits(d, 5, 257), hdist = readBits(d, 5, 1), hclen = readBits(d, 4, 4);
                for (i = 0; i < 19; ++i)
                    lengths[i] = 0;
                for (i = 0; i < hclen; ++i)
                    lengths[clcidx[i]] = readBits(d, 3, 0);
                buildTree(codeTree, lengths, 0, 19);
                for (num = 0; num < hlit + hdist;) {
                    const sym = decodeSym(d, codeTree);
                    if (sym === 16) {
                        const prev = lengths[num - 1];
                        for (length = readBits(d, 2, 3); length; --length)
                            lengths[num++] = prev;
                    }
                    else if (sym === 17) {
                        for (length = readBits(d, 3, 3); length; --length)
                            lengths[num++] = 0;
                    }
                    else if (sym === 18) {
                        for (length = readBits(d, 7, 11); length; --length)
                            lengths[num++] = 0;
                    }
                    else
                        lengths[num++] = sym;
                }
                buildTree(lt, lengths, 0, hlit);
                buildTree(dt, lengths, hlit, hdist);
            }
            function block(d, lt, dt) {
                for (;;) {
                    let sym = decodeSym(d, lt);
                    if (sym === 256)
                        return;
                    if (d.si > d.src.length + 8)
                        throw new Error('inflate: data ends');
                    if (sym < 256)
                        d.out.push(sym);
                    else {
                        sym -= 257;
                        const length = readBits(d, lbits[sym], lbase[sym]), dist = decodeSym(d, dt), from = d.out.length - readBits(d, dbits[dist], dbase[dist]);
                        if (from < 0)
                            throw new Error('inflate: bad distance');
                        for (let i = from; i < from + length; ++i)
                            d.out.push(d.out[i]);
                    }
                }
            }
            function stored(d) {
                while (d.bitcount > 8) {
                    d.si--;
                    d.bitcount -= 8;
                }
                const length = d.src[d.si] | d.src[d.si + 1] << 8;
                d.si += 4;
                for (let i = 0; i < length; ++i)
                    d.out.push(d.src[d.si++]);
                d.bitcount = 0;
            }
            function raw(src) {
                const d = { src, si: 0, tag: 0, bitcount: 0, out: [] };
                let last;
                do {
                    last = getbit(d);
                    const type = readBits(d, 2, 0);
                    if (type === 0)
                        stored(d);
                    else if (type === 1)
                        block(d, sltree, sdtree);
                    else if (type === 2) {
                        const lt = new Tree(), dt = new Tree();
                        decodeTrees(d, lt, dt);
                        block(d, lt, dt);
                    }
                    else
                        throw new Error('inflate: bad block');
                } while (!last);
                return Uint8Array.from(d.out);
            }
            function gunzip(b) {
                if (b[0] !== 0x1f || b[1] !== 0x8b || b[2] !== 8)
                    throw new Error('not gzip');
                const flg = b[3];
                let p = 10;
                if (flg & 4)
                    p += 2 + (b[p] | b[p + 1] << 8);
                if (flg & 8)
                    while (b[p++])
                        ;
                if (flg & 16)
                    while (b[p++])
                        ;
                if (flg & 2)
                    p += 2;
                return raw(b.subarray(p, b.length - 8));
            }
            return { raw, gunzip };
        })();
        window.irisInflate = irisInflate; // for the automatic check
        const INBOX = 'iris-inbox-v1', EC = { name: 'ECDH', namedCurve: 'P-256' };
        let inboxKey = null, pendingHw = null, shownHw = null;
        async function zip(bytes, back) {
            if (back && typeof DecompressionStream === 'undefined')
                return irisInflate.raw(bytes); // старый браузер: распаковываем сами
            if (typeof CompressionStream === 'undefined')
                return null;
            const st = new Blob([bytes]).stream().pipeThrough(back ? new DecompressionStream('deflate-raw') : new CompressionStream('deflate-raw'));
            return new Uint8Array(await new Response(st).arrayBuffer());
        }
        function collect(lessonId) {
            const pane = paneFor(lessonId), pr = profile(), f = {}, c = {};
            $$('[data-field]', pane).forEach(el => { const r = pr.fields[el.dataset.field]; if (r && String(r.value || '').trim())
                f[el.dataset.field] = [String(r.value).slice(0, 3000), r.status || '', r.earned ? 1 : 0, r.revealed ? 1 : 0]; });
            $$('[data-choice]', pane).forEach(mc => { const r = pr.choices[mc.dataset.choice]; if (r && Number.isInteger(r.selected))
                c[mc.dataset.choice] = [r.selected, r.correct ? 1 : 0, (r.bads || []).length]; });
            return { f, c };
        }
        // Работа шифруется открытым ключом преподавателя (прочитать может только он) и подписывается личным ключом ученика
        async function sealForTeacher(payload) {
            let bytes = enc.encode(JSON.stringify(payload)), packed = 0;
            try {
                const z = await zip(bytes, false);
                if (z && z.length < bytes.length) {
                    bytes = z;
                    packed = 1;
                }
            }
            catch (_) { }
            const pub = await crypto.subtle.importKey('jwk', CFG.inbox.pub, EC, false, []);
            const eph = await crypto.subtle.generateKey(EC, true, ['deriveKey']);
            const key = await crypto.subtle.deriveKey({ name: 'ECDH', public: pub }, eph.privateKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
            const raw = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes));
            const out = new Uint8Array(2 + raw.length + 12 + ct.length);
            out[0] = 1;
            out[1] = packed;
            out.set(raw, 2);
            out.set(iv, 2 + raw.length);
            out.set(ct, 2 + raw.length + 12);
            return b64e(out);
        }
        async function studentMac(token, text) {
            const k = await crypto.subtle.importKey('raw', enc.encode(token), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            return b64e(await crypto.subtle.sign('HMAC', k, enc.encode('iris-work:' + text))).slice(0, 22);
        }
        const inboxTopic = (() => { let p = null; return () => p || (p = crypto.subtle.digest('SHA-256', enc.encode('iris-inbox-topic:' + CFG.inbox.pub.x + '.' + CFG.inbox.pub.y)).then(d => 'iris-school/v1/inbox/' + b64e(d).slice(0, 24))); })();
        // Автосохранение: ответы ученика сами уходят преподавателю (последняя версия по каждому уроку)
        let syncTimer = null;
        const lastSync = {};
        async function syncLesson(lessonId, sent = false) {
            var _a, _b;
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || !lessonId || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return false;
            const m = lessonMeta(lessonId);
            if (!m || m.owner !== accessInfo.entry.profile)
                return false;
            const data = collect(lessonId);
            if (!Object.keys(data.f).length && !Object.keys(data.c).length)
                return false;
            const pr = profile(), sig = JSON.stringify(data) + (sent ? '|sent' : '');
            if (!sent && lastSync[lessonId] === sig)
                return true;
            const e = accessInfo.entry, t = Date.now();
            const payload = Object.assign(Object.assign({ v: 1, e: e.id, n: e.name, l: lessonId, t }, data), { s: sent ? 1 : (((_b = pr.sent) === null || _b === void 0 ? void 0 : _b[lessonId]) ? 2 : 0), m: await studentMac(accessInfo.token, e.id + '|' + lessonId + '|' + t) });
            const ok = await publishRetained((await inboxTopic()) + '/' + e.id + '/' + lessonId, await sealForTeacher(payload));
            if (ok)
                lastSync[lessonId] = sig;
            return ok;
        }
        window.__irisResync = () => { try { scheduleSync(); } catch (_) { } }; /*iris-resync*/
        function scheduleSync() {
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || live.active || screen !== 'lesson' || !currentLesson)
                return;
            const lesson = currentLesson;
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => { syncTimer = null; syncLesson(lesson).catch(() => { }); }, 4000);
        }
        ['input', 'change'].forEach(ev => document.addEventListener(ev, e => { var _a, _b; if ((_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '#lesson-panels'))
            scheduleSync(); }, true));
        document.addEventListener('click', e => { var _a, _b; if ((_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '#lesson-panels .check, #lesson-panels .opt, #lesson-panels .chip, #lesson-panels .reveal, #lesson-panels .order-words button, #lesson-panels [data-action="complete-stage"]'))
            scheduleSync(); }, true);
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && syncTimer) {
            clearTimeout(syncTimer);
            syncTimer = null;
            syncLesson(currentLesson).catch(() => { });
        } });
        async function sendAnswers() {
            var _a;
            const lessonId = currentLesson;
            if (!lessonId || !paneFor(lessonId))
                return;
            const data = collect(lessonId);
            if (!Object.keys(data.f).length && !Object.keys(data.c).length) {
                notify('Пока нечего отправлять: ответьте хотя бы на одно задание.');
                return;
            }
            const markSent = () => { const pr = profile(); pr.sent = pr.sent && typeof pr.sent === 'object' ? pr.sent : {}; pr.sent[lessonId] = Date.now(); save(); };
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student') {
                notify('Отправляю ответы преподавателю…');
                clearTimeout(syncTimer);
                syncTimer = null;
                if (await syncLesson(lessonId, true).catch(() => false)) {
                    markSent();
                    delete outbox()[lessonId];
                    save();
                    notify('Готово! Ответы уже у преподавателя ✓');
                    try {
                        refreshHomeworkNavSoon();
                    }
                    catch (_) { }
                    return;
                }
                // нет связи с сервером: работа ждёт на устройстве и уйдёт сама — в мессенджер ничего пересылать не нужно
                outbox()[lessonId] = Date.now();
                save();
                retryOutboxSoon(20000);
                try {
                    refreshHomeworkNavSoon();
                }
                catch (_) { }
                modal('Работа сохранена ⏳', '<p>Сейчас нет связи с сервером, но ваши ответы <b>сохранены</b> и уйдут преподавателю <b>автоматически</b>, как только появится интернет. Можно закрыть страницу — при следующем входе работа отправится сама.</p><p class="help-text">Если очень срочно, можно отправить ответы ссылкой: <button type="button" class="ui-link" data-send-link>отправить ссылкой в мессенджер</button></p><input type="hidden" id="modal-value" value="ok">', () => { }, 'Понятно', true);
                (_a = $('#modal [data-send-link]')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => { closeModal(); sendByLink(lessonId, data, markSent); });
                return;
            }
            sendByLink(lessonId, data, markSent);
        }
        // ответы, которые ещё не дошли до преподавателя (не было связи), — уходят сами при первой возможности
        const outbox = () => { const pr = profile(); if (!pr.outbox || typeof pr.outbox !== 'object')
            pr.outbox = {}; return pr.outbox; };
        let outboxTimer = null, outboxBusy = false;
        function retryOutboxSoon(ms) { clearTimeout(outboxTimer); outboxTimer = setTimeout(retryOutbox, ms); }
        async function retryOutbox() {
            var _a;
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || outboxBusy)
                return;
            const ids = Object.keys(outbox());
            if (!ids.length)
                return;
            outboxBusy = true;
            try {
                for (const id of ids) {
                    if (!lessonMeta(id)) {
                        delete outbox()[id];
                        continue;
                    }
                    if (await syncLesson(id, true).catch(() => false)) {
                        const pr = profile();
                        pr.sent = pr.sent && typeof pr.sent === 'object' ? pr.sent : {};
                        pr.sent[id] = Date.now();
                        delete outbox()[id];
                        save();
                        notify('✅ Работа «' + (((_a = lessonMeta(id)) === null || _a === void 0 ? void 0 : _a.title) || '') + '» доставлена преподавателю.');
                        try {
                            refreshHomeworkNavSoon();
                            if (screen === 'home')
                                renderHome();
                        }
                        catch (_) { }
                    }
                }
            }
            finally {
                outboxBusy = false;
            }
            if (Object.keys(outbox()).length)
                retryOutboxSoon(30000);
        }
        window.addEventListener('online', () => retryOutboxSoon(1500));
        async function sendByLink(lessonId, data, markSent) {
            var _a;
            // запасной путь: ссылка, которую ученик пересылает в мессенджер
            const who = (accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' ? accessInfo.entry : null, t = Date.now();
            const payload = Object.assign(Object.assign(Object.assign({ v: 1, e: (who === null || who === void 0 ? void 0 : who.id) || '', n: (who === null || who === void 0 ? void 0 : who.name) || meta().name, l: lessonId, t }, data), { s: 1 }), (who ? { m: await studentMac(accessInfo.token, who.id + '|' + lessonId + '|' + t) } : {}));
            const link = pageUrl() + '#hw.' + await sealForTeacher(payload), text = payload.n + ': ответы к уроку «' + (((_a = lessonMeta(lessonId)) === null || _a === void 0 ? void 0 : _a.title) || '') + '»';
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'Ответы для преподавателя', text, url: link });
                    markSent();
                    notify('Готово! Преподаватель увидит ваши ответы.');
                    return;
                }
                catch (e) {
                    if (e && e.name === 'AbortError')
                        return;
                }
            }
            markSent();
            modal('Отправить преподавателю', '<p>Сервер связи сейчас недоступен, поэтому скопируйте ссылку и отправьте её преподавателю в мессенджер. Открыть её может только преподаватель.</p><input class="field" id="modal-value" readonly value="' + esc(link) + '" aria-label="Ссылка с ответами">', () => { }, 'Готово', true);
            $('#modal-value').select();
            try {
                await navigator.clipboard.writeText(text + '\n' + link);
                notify('Ссылка скопирована. Вставьте её в чат с преподавателем.');
            }
            catch (_) { }
        }
        const refreshHomeworkNavSoon = () => setTimeout(() => { try {
            updateChrome();
        }
        catch (_) { } }, 300);
        async function readSubmission(code) {
            const u = b64d(code);
            if (u[0] !== 1 || u.length < 100)
                throw Error('format');
            const pub = await crypto.subtle.importKey('raw', u.slice(2, 67), EC, false, []);
            const key = await crypto.subtle.deriveKey({ name: 'ECDH', public: pub }, inboxKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
            let bytes = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(67, 79) }, key, u.slice(79)));
            if (u[1] === 1) {
                bytes = await zip(bytes, true);
                if (!bytes)
                    throw Error('unzip');
            }
            const sub = JSON.parse(new TextDecoder().decode(bytes));
            if (!sub || sub.v !== 1 || typeof sub.l !== 'string' || !lessonMeta(sub.l) || typeof sub.f !== 'object' || typeof sub.c !== 'object')
                throw Error('content');
            sub.n = String(sub.n || 'Ученик').slice(0, 40);
            sub.t = Number(sub.t) || Date.now();
            return sub;
        }
        const inboxList = () => { try {
            const a = JSON.parse(localStorage.getItem(INBOX) || '[]');
            return Array.isArray(a) ? a : [];
        }
        catch (_) {
            return [];
        } };
        // ✓ Проверка: работа «проверена», если отметка поставлена после последней версии (ученик дополнил — снова ждёт проверки)
        const isChecked = x => !!x.ok && x.ok >= x.t;
        const workState = x => isChecked(x) ? 'done' : (x.s === 1 || x.s === 2) ? 'todo' : 'progress';
        const saveInbox = list => { try {
            localStorage.setItem(INBOX, JSON.stringify(list));
        }
        catch (_) { } };
        function markChecked(id, on) {
            const list = inboxList(), row = list.find(x => x.id === id);
            if (!row)
                return;
            if (on) {
                row.ok = Date.now();
                row.seen = true;
            }
            else
                delete row.ok;
            saveInbox(list);
            renderInbox();
            refreshInboxNav();
            try {
                renderClassBar();
            }
            catch (_) { }
        }
        const scoreCache = new Map();
        function scoreOf(sub) {
            const key = sub.id + '|' + sub.t;
            if (scoreCache.has(key))
                return scoreCache.get(key);
            const sc = [0, 0, 0, 0], pane = paneFor(sub.l);
            if (!pane)
                return sc;
            $$('[data-field]', pane).forEach(el => {
                var _a;
                const r = (_a = sub.f) === null || _a === void 0 ? void 0 : _a[el.dataset.field];
                if (!Array.isArray(r) || !String(r[0] || '').trim())
                    return;
                if (!el.dataset.a) {
                    if (el.dataset.field !== 'iris-goal') /*iris-goal-score*/
                    sc[3]++;
                    return;
                }
                if (r[3])
                    return;
                sc[1]++;
                if (el.dataset.a.split('|').some(a => norm(a) === norm(r[0])))
                    sc[0]++;
                else
                    sc[2]++;
            });
            $$('[data-choice]', pane).forEach(mc => { var _a; const r = (_a = sub.c) === null || _a === void 0 ? void 0 : _a[mc.dataset.choice]; if (!Array.isArray(r))
                return; sc[1]++; if (r[1])
                sc[0]++;
            else
                sc[2]++; });
            scoreCache.set(key, sc);
            return sc;
        }
        // одна запись на ученика и урок: всегда последняя версия работы
        function keepSubmission(sub, remote = false) {
            const id = sub.e ? sub.l + ':' + sub.e : sub.l + ':' + sub.n + ':' + sub.t, list = inboxList(), old = list.find(x => x.id === id);
            if (old && old.t >= sub.t)
                return old.id;
            const rec = Object.assign(Object.assign({}, sub), { id, s: Number(sub.s) || 0, fb: old === null || old === void 0 ? void 0 : old.fb, ok: old === null || old === void 0 ? void 0 : old.ok, seen: false, got: Date.now() });
            delete rec.m;
            const next = [rec, ...list.filter(x => x.id !== id && !(x.l === sub.l && sub.e && x.e === sub.e))];
            try {
                localStorage.setItem(INBOX, JSON.stringify(next.slice(0, 300)));
            }
            catch (_) {
                notify('Браузер не сохранил работу, но вы можете посмотреть её сейчас.');
            }
            renderInbox();
            refreshInboxNav();
            if (remote && (!old || (rec.s === 1 && old.s !== 1)))
                announceWork(rec);
            if (classView && classView.l === rec.l && classView.e === rec.e && screen === 'lesson' && currentLesson === rec.l)
                putWorkInLesson(rec);
            try {
                renderClassBar();
            }
            catch (_) { }
            return id;
        }
        let announced = [], announceTimer = null;
        function announceWork(rec) { announced.push(rec); clearTimeout(announceTimer); announceTimer = setTimeout(() => { var _a; const n = announced.length, r = announced[0]; announced = []; notify(n === 1 ? 'Новая работа: ' + r.n + ' · ' + (((_a = lessonMeta(r.l)) === null || _a === void 0 ? void 0 : _a.title) || '') + (r.s === 1 ? ' — сдана ✓' : '') : 'Новых работ учеников: ' + n); }, 1500); }
        async function takeRemote(code) {
            let sub;
            try {
                sub = await readSubmission(code);
            }
            catch (_) {
                return;
            }
            const entry = CFG.entries.find(e => e.id === sub.e);
            if (!entry || !teacherSecret || typeof sub.m !== 'string')
                return;
            if (sub.m !== await studentMac(await studentToken(teacherSecret, entry.id), sub.e + '|' + sub.l + '|' + sub.t))
                return; // подделка от чужого имени
            sub.n = entry.name;
            keepSubmission(sub, true);
        }
        async function listenInbox() {
            if (!inboxKey || typeof mqtt === 'undefined' || listenInbox.on)
                return;
            listenInbox.on = true;
            const topic = await inboxTopic();
            brokerList().forEach(b => {
                const c = mqtt.connect(b.url, { username: b.username, password: b.password, clientId: 'iris_inbox_' + b64e(crypto.getRandomValues(new Uint8Array(6))), connectTimeout: 9000, reconnectPeriod: 6000, clean: true, protocolVersion: 4 });
                c.on('connect', () => c.subscribe(topic + '/#', { qos: 1 }, () => { }));
                c.on('message', (t, payload) => { if (t.startsWith(topic + '/'))
                    takeRemote(new TextDecoder().decode(payload)); });
                c.on('error', () => { });
            });
        }
        // «Работы учеников» в меню преподавателя: число новых работ
        const inboxBtn = document.createElement('button');
        inboxBtn.type = 'button';
        inboxBtn.className = 'hw-nav inbox-nav';
        inboxBtn.hidden = true;
        inboxBtn.setAttribute('data-inbox-nav', '');
        inboxBtn.innerHTML = '<span class="nav-inbox-ico" aria-hidden="true">📥</span><span>Работы учеников</span><b class="hw-badge" hidden></b>';
        (_b = $('.app-nav button[data-screen="words"]')) === null || _b === void 0 ? void 0 : _b.before(inboxBtn);
        function refreshInboxNav() {
            inboxBtn.hidden = !vaultOpen;
            if (!vaultOpen)
                return;
            const n = inboxList().filter(x => workState(x) === 'todo').length, badge = inboxBtn.querySelector('.hw-badge');
            badge.hidden = !n;
            badge.textContent = n;
            inboxBtn.setAttribute('aria-label', 'Работы учеников' + (n ? ': ждут проверки ' + n : ''));
            if (screen === 'home')
                try {
                    paintInboxHome();
                }
                catch (_) { }
        }
        inboxBtn.addEventListener('click', () => { state.role = 'teacher'; save(); route('teacher'); setTimeout(() => { var _a; renderInbox(); (_a = $('#teacher-inbox')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'start' }); }, 80); });
        // на главной у преподавателя — заметный блок со сданными работами
        function paintInboxHome() {
            var _a, _b;
            if (window.irisTeacherHome) {
                window.irisTeacherHome();
                return;
            } // у преподавателя на главной — кабинет преподавателя
            (_a = $('#screen-home .inbox-home')) === null || _a === void 0 ? void 0 : _a.remove();
            if (!vaultOpen)
                return;
            const list = inboxList(), fresh = list.filter(x => !x.seen), done = list.filter(x => x.s === 1);
            const box = document.createElement('section');
            box.className = 'panel inbox-home';
            box.innerHTML = '<div><div class="kicker">РАБОТЫ УЧЕНИКОВ</div><h2>📥 ' + (fresh.length ? 'Новых работ: ' + fresh.length : 'Новых работ нет') + '</h2><p>Домашки и ответы учеников приходят сюда сами — по ссылкам в мессенджер ничего пересылать не нужно. Сдано работ: ' + done.length + '.</p></div><button type="button" class="ui-btn" data-inbox-open>Открыть работы учеников</button>';
            (_b = ($('#screen-home .home-intro') || $('#screen-home .screen-heading'))) === null || _b === void 0 ? void 0 : _b.insertAdjacentElement('afterend', box);
        }
        document.addEventListener('click', e => { if (e.target.closest('[data-inbox-open]'))
            inboxBtn.click(); });
        renderHome = (base => function (...a) { const r = base.apply(this, a); try {
            paintInboxHome();
        }
        catch (_) { } return r; })(renderHome);
        async function receiveHw(code) {
            if (!inboxKey) {
                notify('Откройте ссылку с ответами после входа по ссылке преподавателя.');
                return;
            }
            try {
                const sub = await readSubmission(code);
                const entry = CFG.entries.find(e => e.id === sub.e);
                if (entry && typeof sub.m === 'string' && teacherSecret && sub.m !== await studentMac(await studentToken(teacherSecret, entry.id), sub.e + '|' + sub.l + '|' + sub.t))
                    throw Error('mac');
                if (entry)
                    sub.n = entry.name;
                sub.s = 1;
                const id = keepSubmission(sub);
                showSubmission(inboxList().find(x => x.id === id) || sub);
            }
            catch (_) {
                notify('Не удалось открыть ответы: ссылка повреждена или скопирована не полностью.');
            }
        }
        function fieldLabel(el) {
            if (el.classList.contains('homework-text'))
                return 'Письменное задание';
            if (el.classList.contains('lesson-note'))
                return 'Заметки к этапу';
            const host = el.closest('li,tr');
            if (!host)
                return el.getAttribute('placeholder') || el.getAttribute('aria-label') || 'Ответ';
            const c = host.cloneNode(true);
            c.querySelectorAll('.chips,.slot,.order-words,.mc-result,.result,.ex-actions,.fb-inline,.fb-note').forEach(x => x.remove());
            c.querySelectorAll('select,input,textarea').forEach(x => x.replaceWith(document.createTextNode(' ___ ')));
            return c.textContent.replace(/\s+/g, ' ').trim().slice(0, 240);
        }
        const fbInput = k => '<input class="field fb-note" data-fb-key="' + esc(k) + '" maxlength="600" placeholder="💬 Комментарий ученику (необязательно)" aria-label="Комментарий ученику">';
        function submissionHtml(sub) {
            let html = '';
            const score = sub._score = [0, 0];
            sectionsFor(sub.l).forEach(sec => {
                const rows = [];
                $$('[data-field]', sec).forEach(el => {
                    const r = sub.f[el.dataset.field];
                    if (!Array.isArray(r))
                        return;
                    const [value, status, earned, revealed] = r;
                    let mark = '';
                    if (el.dataset.a) {
                        const ok = el.dataset.a.split('|').some(a => norm(a) === norm(value));
                        mark = revealed ? '<span class="hw-tag shown">ответ был показан</span>' : ok ? '<span class="hw-tag ok">' + (earned ? 'верно с первой попытки' : status === 'ok' ? 'верно после исправления' : 'верно') + '</span>' : '<span class="hw-tag bad">ошибка · верно: ' + esc(el.dataset.a.split('|')[0]) + '</span>';
                    }
                    if (el.dataset.a && !revealed) {
                        score[1]++;
                        if (el.dataset.a.split('|').some(a => norm(a) === norm(value)))
                            score[0]++;
                    }
                    let shown = value, label = fieldLabel(el);
                    if (el.classList.contains('hunt-field')) { // «Найди ошибки»: какие слова ученик отметил
                        const ws = $$('.hunt-w', el.closest('.hunt')), word = i => { var _a; return ((_a = ws.find(w => w.dataset.i === i)) === null || _a === void 0 ? void 0 : _a.textContent) || i; }, want = el.dataset.a.split(' ');
                        const got = String(value).split(/\s+/).filter(Boolean);
                        label = 'Найди ошибки в тексте (ошибок: ' + want.length + ')';
                        shown = got.map(word).join(', ');
                        if (!revealed && !mark.includes('hw-tag ok'))
                            mark = '<span class="hw-tag bad">найдено ' + got.filter(i => want.includes(i)).length + ' из ' + want.length + (got.some(i => !want.includes(i)) ? ', лишние отметки' : '') + ' · ошибки: ' + esc(want.map(word).join(', ')) + '</span>';
                    }
                    const good = /hw-tag ok/.test(mark);
                    rows.push('<li class="' + (good ? 'ok-row' : el.dataset.a ? 'bad-row' : 'open-row') + '"><div class="hw-q">' + esc(label) + '</div><div class="hw-a">' + esc(shown) + ' ' + mark + (good ? ' <button type="button" class="ui-link fb-add" data-fb-add>💬</button>' : '') + '</div>' + fbInput('f:' + el.dataset.field) + '</li>');
                });
                $$('[data-choice]', sec).forEach(mc => {
                    var _a;
                    const r = sub.c[mc.dataset.choice];
                    if (!Array.isArray(r))
                        return;
                    const [pick, correct, bads] = r;
                    const opt = $$('.opt', mc)[pick];
                    score[1]++;
                    if (correct)
                        score[0]++;
                    rows.push('<li class="' + (correct ? 'ok-row' : 'bad-row') + '"><div class="hw-q">' + esc(((_a = $('.q', mc)) === null || _a === void 0 ? void 0 : _a.textContent) || '') + '</div><div class="hw-a">' + esc((opt === null || opt === void 0 ? void 0 : opt.textContent) || '') + ' ' + (correct ? '<span class="hw-tag ok">' + (bads ? 'верно после ошибок: ' + bads : 'верно с первой попытки') + '</span> <button type="button" class="ui-link fb-add" data-fb-add>💬</button>' : '<span class="hw-tag bad">ошибка</span>') + '</div>' + fbInput('c:' + mc.dataset.choice) + '</li>');
                });
                if (rows.length)
                    html += '<h3>' + esc(sec.dataset.label || '') + '</h3><ol class="hw-list">' + rows.join('') + '</ol>';
            });
            return html || '<p>В этой отправке нет ответов.</p>';
        }
        const hwView = document.createElement('div');
        hwView.className = 'hw-view';
        hwView.hidden = true;
        document.body.appendChild(hwView);
        let chkTab = null, chkWho = '', chkQueue = []; // «Проверка ДЗ»: вкладка, ученик, порядок работ для «Следующая →»
        const whenFull = t => new Date(t).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        const statePill = x => ({ done: '<span class="chk-pill done">✓ проверено</span>', todo: '<span class="chk-pill todo">ждёт проверки</span>', progress: '<span class="chk-pill progress">делает сейчас</span>' })[workState(x)];
        function showSubmission(sub) {
            var _a;
            {
                const list = inboxList(), row = list.find(x => x.id === sub.id);
                if (row && !row.seen) {
                    row.seen = true;
                    saveInbox(list);
                    renderInbox();
                    refreshInboxNav();
                }
            }
            shownHw = sub;
            const row = inboxList().find(x => x.id === sub.id) || sub;
            const entry = CFG.entries.find(e => e.id === sub.e), sentFb = row.fb, body = submissionHtml(sub), [right, total, bad, open] = scoreOf(sub), pct = total ? Math.round(right * 100 / total) : 0;
            const qi = chkQueue.indexOf(sub.id), prev = qi > 0 ? chkQueue[qi - 1] : null, next = qi >= 0 && qi < chkQueue.length - 1 ? chkQueue[qi + 1] : null, done = isChecked(row);
            hwView.innerHTML = '<div class="hw-card" role="dialog" aria-labelledby="hw-title"><div class="hw-head"><div><div class="kicker">ПРОВЕРКА РАБОТЫ ' + statePill(row) + '</div><h2 id="hw-title">' + esc(sub.n) + ' · ' + esc(((_a = lessonMeta(sub.l)) === null || _a === void 0 ? void 0 : _a.title) || '') + '</h2><p>' + (sub.s ? 'Сдано ' : 'Сохранено ') + esc(whenFull(sub.t)) + (done ? ' · проверено ' + esc(whenFull(row.ok)) : '') + '</p></div><div class="hw-actions"><button class="ui-btn soft small" type="button" data-hw-open>Показать в уроке</button><button class="ui-btn outline small" type="button" data-hw-close>Закрыть</button></div></div>'
                + '<div class="chk-score"><div class="chk-big"><b>' + right + '</b> из ' + total + ' верно<small>' + pct + '%</small></div><div class="chk-meter"><span style="width:' + pct + '%"></span></div><div class="chk-counts">ошибок: <b>' + bad + '</b> · открытых ответов: <b>' + open + '</b></div>'
                + '<div class="chk-filter" role="group"><button type="button" data-hw-filter="all" aria-pressed="true">Все ответы</button><button type="button" data-hw-filter="focus" aria-pressed="false">Только ошибки и открытые (' + (bad + open) + ')</button></div></div>'
                + body
                + '<div class="fb-form"><h3>Разбор для ученика</h3>' + (entry
                ? '<p class="help-text">Напишите общий отзыв и, если нужно, комментарии к ответам: поля «💬» есть под ошибками и открытыми ответами, у верных — кнопка 💬. Разбор придёт ' + esc(entry.name) + ' прямо на платформу, а работа отметится как проверенная.' + (sentFb ? ' Последний разбор отправлен ' + esc(whenFull(sentFb)) + '.' : '') + '</p><textarea class="field" id="fb-overall" rows="4" maxlength="3000" placeholder="Общий комментарий: что получилось, над чем поработать"></textarea><div class="fb-actions"><button class="ui-btn" type="button" data-fb-send>Отправить разбор ученику</button><span class="help-text">Верно: ' + sub._score[0] + ' из ' + sub._score[1] + '</span></div>'
                : '<p class="help-text">Эти ответы пришли без личной ссылки ученика, поэтому разбор на платформу отправить нельзя.</p>') + '</div>'
                + '<div class="chk-bar"><button type="button" class="ui-btn outline small" data-hw-go="' + esc(prev || '') + '"' + (prev ? '' : ' disabled') + ' aria-label="Предыдущая работа">←<span class="chk-t"> Предыдущая</span></button>'
                + (done ? '<button type="button" class="ui-btn small chk-done" data-hw-check="0" title="Снять отметку">✓ Проверено · снять</button>' : '<button type="button" class="ui-btn small chk-mark" data-hw-check="1">✓ Проверено' + (next ? ' → следующая' : '') + '</button>')
                + '<span class="chk-pos">' + (qi >= 0 ? (qi + 1) + ' из ' + chkQueue.length : '') + '</span><button type="button" class="ui-btn outline small" data-hw-go="' + esc(next || '') + '"' + (next ? '' : ' disabled') + ' aria-label="Следующая работа"><span class="chk-t">Следующая </span>→</button></div></div>';
            hwView.hidden = false;
            hwView.scrollTop = 0;
        }
        function goWork(id) { const sub = inboxList().find(x => x.id === id); if (sub)
            showSubmission(sub); }
        // «Ответы учеников» прямо в уроке у преподавателя: работы приходят сами, их можно показать в уроке и они обновляются
        let classView = null; // {l: урок, e: ученик}
        const recOwner = x => { var _a, _b; return ((_a = CFG.entries.find(e => e.id === (x === null || x === void 0 ? void 0 : x.e))) === null || _a === void 0 ? void 0 : _a.profile) || ((_b = lessonMeta(x === null || x === void 0 ? void 0 : x.l)) === null || _b === void 0 ? void 0 : _b.owner) || ''; };
        const classStudents = l => { var _a; const owner = (_a = lessonMeta(l)) === null || _a === void 0 ? void 0 : _a.owner; return owner ? CFG.entries.filter(e => e.profile === owner) : []; };
        function putWorkInLesson(rec) {
            const owner = recOwner(rec), pane = paneFor(rec.l);
            if (!owner || !pane)
                return;
            const pr = state.profiles[owner] = state.profiles[owner] || {};
            ['fields', 'choices'].forEach(k => { if (!pr[k] || typeof pr[k] !== 'object')
                pr[k] = {}; });
            $$('[data-field]', pane).forEach(el => { var _a; const k = el.dataset.field, r = (_a = rec.f) === null || _a === void 0 ? void 0 : _a[k]; if (Array.isArray(r))
                pr.fields[k] = { value: r[0], status: r[1], earned: !!r[2], revealed: !!r[3], attempted: !!r[1] };
            else
                delete pr.fields[k]; });
            $$('[data-choice]', pane).forEach(mc => { var _a; const k = mc.dataset.choice, r = (_a = rec.c) === null || _a === void 0 ? void 0 : _a[k]; if (Array.isArray(r))
                pr.choices[k] = { selected: r[0], correct: !!r[1], bads: r[1] ? [] : [r[0]], attempted: true };
            else
                delete pr.choices[k]; });
            save();
            hydrate();
            try {
                refreshLessonStats();
            }
            catch (_) { }
        }
        function clearClassView() {
            if (!classView)
                return;
            const pane = paneFor(classView.l), owner = recOwner(classView), pr = owner && state.profiles[owner];
            if (pane && pr) {
                $$('[data-field]', pane).forEach(el => { var _a; (_a = pr.fields) === null || _a === void 0 ? true : delete _a[el.dataset.field]; });
                $$('[data-choice]', pane).forEach(mc => { var _a; (_a = pr.choices) === null || _a === void 0 ? true : delete _a[mc.dataset.choice]; });
                save();
                hydrate();
            }
            classView = null;
        }
        function showClassWork(entryId) {
            const rec = inboxList().find(x => x.l === currentLesson && x.e === entryId);
            if (!rec)
                return;
            classView = { l: currentLesson, e: entryId };
            putWorkInLesson(rec);
            const list = inboxList(), row = list.find(x => x.id === rec.id);
            if (row && !row.seen) {
                row.seen = true;
                try {
                    localStorage.setItem(INBOX, JSON.stringify(list));
                }
                catch (_) { }
                renderInbox();
                refreshInboxNav();
            }
            renderClassBar();
        }
        function renderClassBar() {
            let bar = $('#class-bar');
            const studs = vaultOpen && screen === 'lesson' && currentLesson && !live.active ? classStudents(currentLesson) : [];
            if (classView && (classView.l !== currentLesson || screen !== 'lesson' || live.active))
                clearClassView(); // left the lesson: the student's answers don't stay in the teacher's copy
            if (!studs.length) {
                if (bar)
                    bar.hidden = true;
                return;
            }
            if (!bar) {
                bar = document.createElement('div');
                bar.id = 'class-bar';
                bar.className = 'live-bar class-bar';
                ($('#live-bar') || $('.app-header')).insertAdjacentElement('afterend', bar);
            }
            const list = inboxList(), when = t => new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            bar.hidden = false;
            bar.innerHTML = '<div class="live-work" role="group" aria-label="Ответы учеников в этом уроке"><span>Ответы учеников:</span>' + studs.map(e => {
                const r = list.find(x => x.l === currentLesson && x.e === e.id), on = (classView === null || classView === void 0 ? void 0 : classView.e) === e.id;
                return '<button type="button" class="work-tab' + (on ? ' active' : '') + (r && !r.seen && !on ? ' fresh' : '') + '" data-class-view="' + esc(e.id) + '"' + (r ? '' : ' disabled') + ' aria-pressed="' + on + '">' + esc(e.name) + ' <small>' + (r ? (isChecked(r) ? 'проверено ✓' : r.s === 1 ? 'сдано' : 'обновлено ' + when(r.t)) : 'пока нет ответов') + '</small></button>';
            }).join('') + (classView ? '<button type="button" class="ui-link" data-class-view="">Скрыть ответы</button>' : '') + '</div>';
        }
        document.addEventListener('click', e => { const b = e.target.closest('[data-class-view]'); if (!b)
            return; if (b.dataset.classView)
            showClassWork(b.dataset.classView);
        else {
            clearClassView();
            renderClassBar();
        } });
        updateChrome = (base => function (...a) { const r = base.apply(this, a); try {
            renderClassBar();
        }
        catch (_) { } return r; })(updateChrome);
        function openSubmissionInLesson(sub) {
            const owner = recOwner(sub);
            if (!owner)
                return;
            const pr = state.profiles[owner] = state.profiles[owner] || {};
            ['fields', 'choices'].forEach(k => { if (!pr[k] || typeof pr[k] !== 'object')
                pr[k] = {}; });
            $$('[data-field]', paneFor(sub.l)).forEach(el => { const r = sub.f[el.dataset.field]; if (Array.isArray(r))
                pr.fields[el.dataset.field] = { value: r[0], status: r[1], earned: !!r[2], revealed: !!r[3], attempted: !!r[1] }; });
            $$('[data-choice]', paneFor(sub.l)).forEach(mc => { const r = sub.c[mc.dataset.choice]; if (Array.isArray(r))
                pr.choices[mc.dataset.choice] = { selected: r[0], correct: !!r[1], bads: r[1] ? [] : [r[0]], attempted: true }; });
            save();
            hwView.hidden = true;
            const first = sectionsFor(sub.l).find(sec => $$('[data-field],[data-choice]', sec).some(el => sub.f[el.dataset.field] || sub.c[el.dataset.choice]));
            openLesson(sub.l, first === null || first === void 0 ? void 0 : first.id);
            hydrate();
        }
        function renderInbox() {
            const host = $('#teacher main');
            if (!host || !vaultOpen)
                return;
            let box = $('#teacher-inbox');
            if (!box) {
                box = document.createElement('section');
                box.className = 'step';
                box.id = 'teacher-inbox';
                const acc = $('#teacher-access');
                if (acc)
                    acc.insertAdjacentElement('beforebegin', box);
                else
                    host.prepend(box);
            }
            const all = inboxList().slice().sort((a, b) => (b.got || b.t) - (a.got || a.t));
            const ownerOf = recOwner, nameOf = o => window.irisStudentName ? window.irisStudentName(o) : o;
            const who = all.filter(x => !chkWho || ownerOf(x) === chkWho), count = k => who.filter(x => k === 'all' || workState(x) === k).length;
            if (!chkTab)
                chkTab = count('todo') ? 'todo' : 'all';
            const list = who.filter(x => chkTab === 'all' || workState(x) === chkTab);
            if (chkTab === 'todo')
                list.sort((a, b) => a.t - b.t); // очередь: сначала те, что сданы раньше
            chkQueue = list.map(x => x.id);
            const owners = [...new Set(all.map(ownerOf).filter(Boolean))];
            const row = x => {
                const m = lessonMeta(x.l), [right, total, bad, open] = scoreOf(x), pct = total ? Math.round(right * 100 / total) : 0;
                return '<div class="hw-row chk-row ' + workState(x) + (x.seen ? '' : ' fresh') + '"><div class="chk-av" aria-hidden="true">' + esc((x.n || '?').slice(0, 1)) + '</div><div class="chk-main"><strong>' + esc(x.n) + '</strong> · ' + esc((m === null || m === void 0 ? void 0 : m.title) || x.l) + ((m === null || m === void 0 ? void 0 : m.kind) === 'homework' ? ' <span class="chk-kind">ДЗ грамматика</span>' : '') + ' ' + statePill(x) + (x.seen ? '' : ' <span class="hw-new">новое</span>')
                    + '<div class="help-text">' + esc(whenFull(x.t)) + (x.fb ? ' · разбор отправлен ✓' : '') + (open ? ' · открытых ответов: ' + open : '') + '</div></div>'
                    + '<div class="chk-sc" title="Верно ' + right + ' из ' + total + '"><b>' + (total ? pct + '%' : '—') + '</b><small>' + right + ' / ' + total + (bad ? ' · ошибок ' + bad : '') + '</small><span class="chk-meter"><span style="width:' + pct + '%"></span></span></div>'
                    + '<button class="ui-btn small ' + (workState(x) === 'todo' ? '' : 'soft') + '" type="button" data-hw-show="' + esc(x.id) + '">' + (workState(x) === 'todo' ? 'Проверить' : 'Открыть') + '</button></div>';
            };
            box.innerHTML = '<div class="step-head"><h2>Проверка домашних заданий</h2></div>'
                + '<p class="help-text">Работы приходят сами. «Ждут проверки» — ученик нажал «Отправить преподавателю». Откройте работу, посмотрите ответы и нажмите <b>«✓ Проверено»</b> (или отправьте разбор — тогда отметка ставится сама). Если ученик потом дополнит работу, она снова попадёт в «Ждут проверки».</p>'
                + '<div class="chk-tabs" role="tablist">' + [['todo', 'Ждут проверки'], ['progress', 'Делают сейчас'], ['done', 'Проверено'], ['all', 'Все']].map(([k, t]) => '<button type="button" role="tab" data-chk-tab="' + k + '" aria-selected="' + (chkTab === k) + '">' + t + ' <span>' + count(k) + '</span></button>').join('') + '</div>'
                + (owners.length > 1 ? '<label class="chk-who">Ученик: <select data-chk-who><option value="">Все ученики</option>' + owners.map(o => '<option value="' + esc(o) + '"' + (o === chkWho ? ' selected' : '') + '>' + esc(nameOf(o)) + '</option>').join('') + '</select></label>' : '')
                + (list.length ? '<div class="hw-inbox chk-list">' + list.map(row).join('') + '</div>' : '<p class="chk-empty">' + (chkTab === 'todo' ? '🎉 Все сданные работы проверены.' : 'Здесь пока пусто.') + '</p>');
            const nav = $('#teacher .lesson-nav');
            if (nav && !nav.querySelector('[href="#teacher-inbox"]'))
                nav.insertAdjacentHTML('afterbegin', '<a href="#teacher-inbox">Работы учеников</a>');
        }
        document.addEventListener('click', e => {
            const t = e.target.closest('[data-chk-tab]');
            if (t) {
                chkTab = t.dataset.chkTab;
                renderInbox();
                return;
            }
            const f = e.target.closest('[data-hw-filter]');
            if (f) {
                const card = f.closest('.hw-card');
                card.classList.toggle('focus', f.dataset.hwFilter === 'focus');
                $$('[data-hw-filter]', card).forEach(x => x.setAttribute('aria-pressed', String(x === f)));
                return;
            }
            const a = e.target.closest('[data-fb-add]');
            if (a) {
                const n = a.closest('li').querySelector('.fb-note');
                n.classList.add('open');
                n.focus();
                a.remove();
                return;
            }
            const g = e.target.closest('[data-hw-go]');
            if (g && g.dataset.hwGo) {
                goWork(g.dataset.hwGo);
                return;
            }
            const c = e.target.closest('[data-hw-check]');
            if (c && shownHw) {
                const on = c.dataset.hwCheck === '1', qi = chkQueue.indexOf(shownHw.id), next = qi >= 0 ? chkQueue[qi + 1] : null;
                markChecked(shownHw.id, on);
                notify(on ? '✓ Работа отмечена как проверенная' : 'Отметка снята');
                if (on && next)
                    goWork(next);
                else
                    goWork(shownHw.id);
            }
        });
        document.addEventListener('change', e => { var _a, _b; const s = (_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '[data-chk-who]'); if (s) {
            chkWho = s.value;
            renderInbox();
        } });
        document.addEventListener('click', e => {
            var _a;
            const b = e.target.closest('button');
            if (!b)
                return;
            if (b.hasAttribute('data-send-answers')) {
                e.preventDefault();
                sendAnswers().catch(() => notify('Не получилось подготовить ответы. Попробуйте ещё раз.'));
            }
            else if (b.hasAttribute('data-hw-close'))
                hwView.hidden = true;
            else if (b.hasAttribute('data-fb-send'))
                sendFeedback(b);
            else if (b.dataset.fbShow) {
                const fb = fbStore()[b.dataset.fbShow];
                if (fb)
                    showFeedback(fb);
            }
            else if (b.dataset.fbLesson) {
                hwView.hidden = true;
                const fb = Object.values(fbStore()).filter(x => x.l === b.dataset.fbLesson).sort((x, y) => y.at - x.at)[0];
                const el = fb && Object.keys(fb.n || {}).map(k => fbTarget(fb.l, k)).find(Boolean);
                openLesson(b.dataset.fbLesson, (_a = el === null || el === void 0 ? void 0 : el.closest('section.step')) === null || _a === void 0 ? void 0 : _a.id);
            }
            else if (b.hasAttribute('data-hw-open') && shownHw)
                openSubmissionInLesson(shownHw);
            else if (b.dataset.hwShow) {
                const sub = inboxList().find(x => x.id === b.dataset.hwShow);
                if (sub)
                    showSubmission(sub);
            }
            else if (b.dataset.openPrep) {
                const m = lessonMeta(b.dataset.openPrep);
                const sec = m && irisHw.section(m);
                openLesson(b.dataset.openPrep, sec === null || sec === void 0 ? void 0 : sec.id);
            }
        });
        live.onStats(() => {
            var _a, _b;
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'teacher' || screen !== 'lesson')
                return;
            const btn = '<button class="ui-btn rail-action" type="button" data-send-answers>Отправить ответы преподавателю</button>';
            (_a = $('#lesson-rail')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', btn);
            (_b = $('#lesson-mobile-stats')) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML('beforeend', '<button class="ui-link" type="button" data-send-answers>Отправить</button>');
        });
        renderHome = (base => function (...a) {
            var _a;
            base.apply(this, a);
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'teacher')
                return;
            const pr = profile();
            const cards = availableLessons().filter(m => m.owner === state.profile).map(m => ({ m, sec: irisHw.section(m) })).filter(x => x.sec).sort((a, b) => (a.m.kind === 'homework') - (b.m.kind === 'homework') || (b.m.date || '').localeCompare(a.m.date || '')); // the current lesson first, grammar homework after the lessons
            const nLessons = cards.filter(x => x.m.kind !== 'homework').length;
            if (!cards.length)
                return;
            const html = cards.map(({ m, sec }, ci) => { const sent = irisHw.sent(m, pr.sent) && pr.sent[m.id]; return '<article class="prep-card' + (ci === 0 && nLessons > 1 ? ' current' : '') + (m.kind === 'homework' ? ' grammar-hw' : '') + '"><div><div class="kicker">' + (m.kind === 'homework' ? 'ДОМАШНЕЕ ЗАДАНИЕ · ' + (m.hwTag || 'ГРАММАТИКА') + (sent ? '' : ' · НОВОЕ') : (m.flipped ? 'ПЕРЕД УРОКОМ · САМОСТОЯТЕЛЬНО' : 'ДОМАШНЕЕ ЗАДАНИЕ К УРОКУ') + (nLessons > 1 ? (ci === 0 ? ' · ТЕКУЩИЙ УРОК' : ' · ПРОШЛЫЙ УРОК') : '')) + '</div><h2>' + esc(m.title) + '</h2><p>' + (pr.outbox && pr.outbox[m.id] ? '⏳ Ответы сохранены и уйдут преподавателю сами, как только появится связь.' : sent ? 'Ответы отправлены ' + esc(new Date(sent).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })) + '. Можно открыть и дополнить.' : (m.prepNote ? esc(m.prepNote) : (/-hw-prep$/.test(sec.id) ? 'Сделайте и отправьте ответы преподавателю — кнопка в конце задания.' : 'Сделайте до занятия (около 20 минут) и отправьте ответы преподавателю.'))) + '</p></div><button class="ui-btn" type="button" data-open-prep="' + esc(m.id) + '">' + (sent ? 'Открыть' : 'Начать') + '</button></article>'; }).join('');
            (_a = $('#screen-home .home-intro')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterend', html);
        })(renderHome);
        renderHome = (base => function (...a) {
            var _a;
            base.apply(this, a);
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student')
                return;
            const list = Object.entries(fbStore()).filter(([, f]) => lessonMeta(f.l)).sort((x, y) => y[1].at - x[1].at).slice(0, 3);
            if (!list.length)
                return;
            const html = list.map(([id, f]) => '<article class="prep-card fb-card' + (f.read ? '' : ' fresh') + '"><div><div class="kicker">РАЗБОР ОТ ПРЕПОДАВАТЕЛЯ' + (f.read ? '' : ' · НОВЫЙ') + '</div><h2>' + esc(lessonMeta(f.l).title) + '</h2><p>' + esc((f.o || 'Комментарии к вашим ответам').slice(0, 160)) + ((f.o || '').length > 160 ? '…' : '') + '</p></div><button class="ui-btn" type="button" data-fb-show="' + esc(id) + '">Открыть разбор</button></article>').join('');
            (_a = $('#screen-home .home-intro')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterend', html);
        })(renderHome);
        // пока проверяется личная ссылка (после обновления страницы), экран скрыт: иначе на миг виден профиль по умолчанию («Марина»)
        const checkingAccess = !!(readStored() || new URLSearchParams(location.search).get('k') || location.hash.startsWith('#k.'));
        const doneChecking = () => document.documentElement.classList.remove('iris-checking');
        if (checkingAccess) {
            document.documentElement.classList.add('iris-checking');
            setTimeout(doneChecking, 8000);
        }
        (async () => {
            const h = decodeURIComponent(location.hash.slice(1));
            let info = null, fromLink = false;
            const fromQuery = new URLSearchParams(location.search).get('k');
            if (h.startsWith('k.')) {
                fromLink = true;
                info = await identify(tokenFrom(h));
            }
            else if (fromQuery)
                info = await identify(fromQuery);
            if (!info)
                info = await identify(readStored());
            if (info) {
                writeStored(info.token);
                keepInUrl(info.token, h.startsWith('k.') ? 'home' : undefined);
                await apply(info);
                if (info.role === 'student') {
                    paintFeedback();
                    checkFeedback().catch(() => { });
                }
            }
            else if (h.startsWith('k.'))
                history.replaceState(null, '', '#home');
            ready = true;
            doneChecking();
            const weak = !window.crypto || !window.crypto.subtle; // старый браузер или страница открыта не по https
            if ((fromLink || fromQuery) && !info) {
                showGate(weak ? BROWSER_HINT : 'Ссылка не подошла. Попросите преподавателя прислать её ещё раз.');
                return;
            }
            if (pendingOpen || fromLink)
                openFromHash();
        })().catch(() => { ready = true; doneChecking(); showGate('Не удалось проверить ссылку. Обновите страницу.'); });
        /* ----- 🔔 Лобби: у каждого ученика свой постоянный защищённый канал. Преподаватель начинает живой урок —
           в кабинете ученика сама появляется кнопка «Войти на урок». Новую ссылку каждый раз отправлять не нужно.
           Там же — новые уроки: они скрыты от ученика (черновик), пока преподаватель их не откроет. ----- */
        const LOBBY = 'iris-school/v1/lobby/';
        async function lobbyKeys(token) {
            const t = b64e(await crypto.subtle.digest('SHA-256', enc.encode('iris-lobby-topic:' + token))).slice(0, 24);
            const key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('iris-lobby-key:' + token)), 'AES-GCM', false, ['encrypt', 'decrypt']);
            return { topic: LOBBY + t, key };
        }
        async function lobbyOpen(key, code) { const u = b64d(code); return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12)))); }
        function lobbyClients(onConnect, onMessage) {
            return brokerList().map(b => {
                const c = mqtt.connect(b.url, { username: b.username, password: b.password, clientId: 'iris_lb_' + b64e(crypto.getRandomValues(new Uint8Array(6))), connectTimeout: 10000, reconnectPeriod: 5000, keepalive: 30, clean: true, protocolVersion: 4 });
                c.on('connect', () => onConnect && onConnect(c));
                if (onMessage)
                    c.on('message', onMessage);
                c.on('error', () => { });
                return c;
            });
        }
        // черновики: новые уроки не видны ученику, пока преподаватель их не откроет
        const hiddenDrafts = [];
        const openedStore = () => { const pr = profile(); if (!Array.isArray(pr.opened))
            pr.opened = []; return pr.opened; };
        function hideDrafts() {
            const opened = openedStore();
            for (let i = DATA.length - 1; i >= 0; i--) {
                const d = DATA[i];
                if (d.draft && d.owner === accessInfo.entry.profile && !opened.includes(d.id)) {
                    hiddenDrafts.push(d);
                    DATA.splice(i, 1);
                }
            }
        }
        function unlockLesson(id, quiet) {
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student')
                return;
            const opened = openedStore();
            if (!opened.includes(id)) {
                opened.push(id);
                save();
            }
            const i = hiddenDrafts.findIndex(d => d.id === id);
            if (i < 0)
                return;
            const d = hiddenDrafts.splice(i, 1)[0];
            DATA.push(d);
            try {
                updateChrome();
                if (screen === 'home')
                    renderHome();
            }
            catch (_) { }
            if (!quiet)
                notify('📘 Преподаватель открыл новый урок: «' + d.title + '»');
        }
        // ученик: слушает свой канал
        let invite = null, inviteSeen = 0;
        const inviteBar = document.createElement('div');
        inviteBar.className = 'lobby-invite';
        inviteBar.hidden = true;
        inviteBar.setAttribute('role', 'status');
        (_c = $('#live-bar')) === null || _c === void 0 ? void 0 : _c.insertAdjacentElement('afterend', inviteBar);
        function paintInvite() {
            const on = !!invite && Date.now() - inviteSeen < 25000 && !live.active;
            inviteBar.hidden = !on;
            if (!on)
                return;
            inviteBar.innerHTML = '<span class="lobby-dot"></span><span><b>Преподаватель начал урок</b>' + (invite.title ? ' · «' + esc(invite.title) + '»' : '') + '</span><button type="button" class="ui-btn small" data-lobby-join>Войти на урок</button>';
        }
        inviteBar.addEventListener('click', e => { if (!e.target.closest('[data-lobby-join]') || !invite)
            return; const go = invite; invite = null; unlockLesson(go.lesson, true); inviteBar.hidden = true; location.hash = go.hash.replace(/^#/, ''); });
        if (live.on)
            live.on('end', m => { if (m.role === 'teacher') {
                invite = null;
                inviteSeen = 0;
                paintInvite();
            } }); // преподаватель завершил урок — приглашение убираем
        setInterval(paintInvite, 3000);
        async function lobbyListen() {
            var _a;
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || typeof mqtt === 'undefined' || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return;
            const { topic, key } = await lobbyKeys(accessInfo.token);
            lobbyClients(c => c.subscribe([topic, topic + '/open'], { qos: 0 }, () => { }), async (t, payload) => {
                let m;
                try {
                    m = await lobbyOpen(key, new TextDecoder().decode(payload));
                }
                catch (_) {
                    return;
                }
                if (t === topic + '/open') {
                    (Array.isArray(m.open) ? m.open : []).forEach(id => typeof id === 'string' && unlockLesson(id));
                    if (Array.isArray(m.book) && typeof m.bt === 'number')
                        takeBook({ ids: m.book.filter(id => typeof id === 'string'), at: m.bat && typeof m.bat === 'object' ? m.bat : {}, t: m.bt });
                    return;
                }
                if (t !== topic || !m || typeof m.t !== 'number' || Math.abs(Date.now() - m.t) > 10 * 60 * 1000)
                    return;
                if (m.end) {
                    invite = null;
                    paintInvite();
                    return;
                }
                if (typeof m.hash !== 'string' || !/^#live\.[a-z0-9-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(m.hash) || typeof m.lesson !== 'string')
                    return;
                const fresh = !invite || invite.hash !== m.hash;
                invite = { hash: m.hash, lesson: m.lesson, title: String(m.title || '').slice(0, 120) };
                inviteSeen = Date.now();
                if (fresh) {
                    unlockLesson(m.lesson, true);
                    paintInvite();
                    if (!live.active)
                        notify('🔴 Преподаватель начал урок — нажмите «Войти на урок» вверху.');
                }
            });
        }
        /* ----- 🏫 Личный класс: у каждого ученика (у пары — общий) постоянная «комната» для совместного урока.
           Преподаватель открыл урок ученика — класс открыт; ученик открыл свой урок — подключился сам. Ссылки не нужны. ----- */
        const classCache = new Map();
        async function classFor(profile) {
            var _a;
            if (!profile || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return null;
            if (classCache.has(profile))
                return classCache.get(profile);
            let raw = null;
            if (teacherSecret) {
                const k = await crypto.subtle.importKey('raw', enc.encode(teacherSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
                raw = new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode('iris-class:' + profile)));
            }
            else if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' && accessInfo.entry.profile === profile && accessInfo.entry.c) {
                const u = b64d(accessInfo.entry.c), wk = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('iris-class-wrap:' + accessInfo.token)), 'AES-GCM', false, ['decrypt']);
                raw = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, wk, u.slice(12)));
            }
            if (!raw)
                return null;
            const s = b64e(raw), room = b64e(await crypto.subtle.digest('SHA-256', enc.encode('iris-class-room:' + s))).slice(0, 22);
            const keyStr = b64e(await crypto.subtle.digest('SHA-256', enc.encode('iris-class-key:' + s)));
            const c = { room, keyStr, topic: 'iris-school/v1/' + room, key: await crypto.subtle.importKey('raw', b64d(keyStr), 'AES-GCM', false, ['encrypt', 'decrypt']) };
            classCache.set(profile, c);
            return c;
        }
        const hasClass = owner => CFG.entries.some(e => e.profile === owner);
        live.classRoom = async (lesson) => { var _a, _b; const owner = (_a = lessonMeta(lesson)) === null || _a === void 0 ? void 0 : _a.owner; return owner && hasClass(owner) && (vaultOpen || ((_b = accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.entry) === null || _b === void 0 ? void 0 : _b.profile) === owner) ? classFor(owner) : null; };
        // преподаватель: открыл урок ученика (который ученику уже виден) — класс открывается сам; «Завершить» — до следующего входа в урок
        let classPaused = null, classLesson = null, classJoining = false, classLastLesson = null;
        document.addEventListener('click', e => { if (e.target.closest('[data-live="start"]'))
            classPaused = null; }, true);
        setInterval(async () => {
            var _a;
            if (!vaultOpen || screen !== 'lesson' || !currentLesson || classJoining)
                return;
            const L = currentLesson, meta = lessonMeta(L), owner = meta === null || meta === void 0 ? void 0 : meta.owner;
            if (!owner || !hasClass(owner))
                return;
            if (L !== classLastLesson) {
                classLastLesson = L;
                if (classPaused !== L)
                    classPaused = null;
            }
            if (live.active && live.lesson === L) {
                classLesson = L;
                return;
            }
            if (!live.active && classLesson === L) {
                classPaused = L;
                classLesson = null;
                return;
            } // урок завершён кнопкой «Завершить»
            if (classPaused === L || (live.active && live.role !== 'teacher'))
                return;
            const sameClass = live.active && live.role === 'teacher' && ((_a = lessonMeta(live.lesson)) === null || _a === void 0 ? void 0 : _a.owner) === owner; // урок уже идёт с этим учеником
            if (meta.draft && !sameClass && !(JSON.parse(localStorage.getItem(OPENED) || '{}')[owner] || []).includes(L))
                return; // новый урок открыт просто для подготовки: класс — только по кнопке «Начать»
            const c = await classFor(owner).catch(() => null);
            if (!c || screen !== 'lesson' || currentLesson !== L)
                return;
            if (live.active && live.role === 'teacher' && !sameClass)
                live.leave(true); // перешли к другому ученику: прежний урок завершается
            classJoining = true;
            try {
                if (await live.join(L, c.room, c.keyStr, 'teacher', true))
                    classLesson = L;
            }
            finally {
                classJoining = false;
            }
        }, 1500);
        // ученик: слушает свой класс. Преподаватель в классе: ученик в «Моём уроке» — подключается сам, на других экранах — кнопка «Войти на урок»
        let classLeftAt = 0, classEndAt = 0, classTypedAt = 0;
        ['input', 'change'].forEach(ev => document.addEventListener(ev, e => { var _a, _b; if ((_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '#lesson-panels'))
            classTypedAt = Date.now(); }, true));
        async function classWatch() {
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student' || typeof mqtt === 'undefined')
                return;
            const owner = accessInfo.entry.profile, c = await classFor(owner).catch(() => null);
            if (!c)
                return;
            const myId = live.rid(10);
            let seq = 0;
            const clients = lobbyClients(cl => cl.subscribe(c.topic, { qos: 0 }, () => { }), async (t, payload) => {
                if (t !== c.topic)
                    return;
                let m;
                try {
                    m = await live.unseal(new TextDecoder().decode(payload), c.key);
                }
                catch (_) {
                    return;
                }
                if (!m || m.v !== 1 || m.role !== 'teacher' || typeof m.ts !== 'number' || Math.abs(Date.now() - m.ts) > 20000 || typeof m.lesson !== 'string')
                    return;
                if (m.type === 'end') {
                    classEndAt = Date.now();
                    invite = null;
                    paintInvite();
                    return;
                }
                if (m.ts < classEndAt)
                    return;
                const meta = lessonMeta(m.lesson) || hiddenDrafts.find(d => d.id === m.lesson);
                if (!meta || meta.owner !== owner)
                    return;
                if (live.active) {
                    if (live.room === c.room && live.role === 'student' && live.lesson !== m.lesson) {
                        unlockLesson(m.lesson, true);
                        live.join(m.lesson, c.room, c.keyStr, 'student');
                    }
                    return;
                } // преподаватель перешёл к другому уроку
                const hash = '#live.' + m.lesson + '.' + c.room + '.' + c.keyStr;
                const doingHw = /-(hw-[a-z0-9-]+|prep|homework)$/.test(currentSection || '') && Date.now() - classTypedAt < 90000; // прямо сейчас делает домашку — не выдёргиваем, а приглашаем
                if (screen === 'lesson' && !doingHw && Date.now() - classLeftAt > 10 * 60 * 1000) {
                    unlockLesson(m.lesson, true);
                    notify('🔴 Преподаватель в классе — вы подключены к уроку.');
                    live.join(m.lesson, c.room, c.keyStr, 'student');
                    return;
                }
                const fresh = !invite || invite.hash !== hash;
                invite = { hash, lesson: m.lesson, title: meta.title };
                inviteSeen = Date.now();
                if (fresh) {
                    unlockLesson(m.lesson, true);
                    paintInvite();
                    notify('🔴 Преподаватель начал урок — нажмите «Войти на урок» вверху.');
                }
            });
            // «я на платформе» — преподаватель видит у себя на главной, кто из учеников сейчас здесь
            setInterval(async () => {
                if (document.hidden || live.active)
                    return;
                const msg = await live.seal({ v: 1, id: live.rid(9), from: myId, role: 'student', name: accessInfo.entry.name, seq: ++seq, ts: Date.now(), lesson: '*', type: 'here', at: screen === 'lesson' ? 'lesson' : 'home' }, c.key);
                clients.forEach(cl => { if (cl.connected)
                    cl.publish(c.topic, msg, { qos: 0 }); });
            }, 5000);
            document.addEventListener('click', e => { if (e.target.closest('[data-live="leave"]'))
                classLeftAt = Date.now(); }, true);
        }
        // преподаватель: кто из учеников сейчас на платформе (сигналы из их классов)
        const classOnline = new Map();
        let onlineSig = '';
        async function classPresence() {
            if (!vaultOpen || typeof mqtt === 'undefined')
                return;
            const rooms = [];
            for (const o of [...new Set(CFG.entries.map(e => e.profile))]) {
                const c = await classFor(o).catch(() => null);
                if (c)
                    rooms.push(Object.assign({ o }, c));
            }
            lobbyClients(cl => cl.subscribe(rooms.map(r => r.topic), { qos: 0 }, () => { }), async (t, payload) => {
                const r = rooms.find(x => x.topic === t);
                if (!r)
                    return;
                let m;
                try {
                    m = await live.unseal(new TextDecoder().decode(payload), r.key);
                }
                catch (_) {
                    return;
                }
                if (!m || m.v !== 1 || m.role !== 'student' || typeof m.name !== 'string' || typeof m.ts !== 'number' || Math.abs(Date.now() - m.ts) > 30000)
                    return;
                const map = classOnline.get(r.o) || new Map();
                map.set(m.name.slice(0, 40), { t: Date.now(), at: m.type === 'here' ? (m.at === 'lesson' ? 'lesson' : 'home') : 'class' });
                classOnline.set(r.o, map);
                paintOnline();
            });
            setInterval(paintOnline, 5000);
        }
        const onlineIn = o => [...(classOnline.get(o) || new Map())].filter(([, x]) => Date.now() - x.t < 15000).map(([name, x]) => ({ name, at: x.at }));
        function paintOnline() {
            var _a;
            const sig = [...classOnline.keys()].map(o => o + ':' + onlineIn(o).map(x => x.name + x.at).join(',')).join('|');
            if (sig === onlineSig)
                return;
            onlineSig = sig;
            if (screen === 'home' && !document.querySelector('#screen-home [data-t-search]:focus'))
                try {
                    (_a = window.irisTeacherHome) === null || _a === void 0 ? void 0 : _a.call(window);
                }
                catch (_) { }
        }
        // преподаватель: приглашает учеников этого профиля, пока идёт урок
        let inviting = null;
        async function targetsFor(owner) { return !teacherSecret ? [] : Promise.all(CFG.entries.filter(e => e.profile === owner).map(async (e) => (Object.assign({ e }, (await lobbyKeys(await studentToken(teacherSecret, e.id))))))); }
        async function lobbyInvite(lesson, hash) {
            lobbyStop(true);
            if (!teacherSecret || typeof mqtt === 'undefined')
                return;
            const meta = lessonMeta(lesson);
            if (!meta)
                return;
            const targets = await targetsFor(meta.owner);
            if (!targets.length)
                return;
            const run = { stop: false, clients: lobbyClients() };
            inviting = run;
            const tick = async () => { if (run.stop)
                return; for (const x of targets) {
                const msg = await fbSeal(x.key, { t: Date.now(), hash, lesson, title: meta.title });
                run.clients.forEach(c => { if (c.connected)
                    c.publish(x.topic, msg, { qos: 0 }); });
            } };
            run.timer = setInterval(tick, 5000);
            setTimeout(tick, 1200);
            if (meta.draft)
                openForStudents(lesson).catch(() => { });
        }
        function lobbyStop(silent) {
            const run = inviting;
            if (!run)
                return;
            inviting = null;
            run.stop = true;
            clearInterval(run.timer);
            setTimeout(() => run.clients.forEach(c => { try {
                c.end(true);
            }
            catch (_) { } }), silent ? 0 : 1500);
        }
        async function lobbyEnd(lesson) {
            const meta = lessonMeta(lesson);
            if (!meta || !teacherSecret || typeof mqtt === 'undefined')
                return;
            const targets = await targetsFor(meta.owner);
            const cs = lobbyClients(async (c) => { for (const x of targets)
                c.publish(x.topic, await fbSeal(x.key, { t: Date.now(), end: true }), { qos: 0 }); });
            setTimeout(() => cs.forEach(c => { try {
                c.end(false);
            }
            catch (_) { } }), 4000);
        }
        // «Открыть ученику»: урок-черновик становится виден ученику (сохраняется на сервере связи, ученик получит его при входе)
        const OPENED = 'iris-opened-v1';
        async function openForStudents(lesson) {
            const meta = lessonMeta(lesson);
            if (!meta || !teacherSecret)
                return false;
            let all = {};
            try {
                all = JSON.parse(localStorage.getItem(OPENED) || '{}');
            }
            catch (_) { }
            const list = Array.from(new Set([...(all[meta.owner] || []), lesson]));
            all[meta.owner] = list;
            try {
                localStorage.setItem(OPENED, JSON.stringify(all));
            }
            catch (_) { }
            const ok = await publishOpen(meta.owner);
            paintDraftButtons();
            return ok;
        }
        function paintDraftButtons() {
            let all = {};
            try {
                all = JSON.parse(localStorage.getItem(OPENED) || '{}');
            }
            catch (_) { }
            DATA.filter(d => d.draft).forEach(d => {
                var _a;
                const card = document.getElementById('teacher-' + d.id);
                if (!card)
                    return;
                const opened = (all[d.owner] || []).includes(d.id);
                let box = card.querySelector('.draft-box');
                if (!box) {
                    box = document.createElement('div');
                    box.className = 'draft-box';
                    (_a = card.querySelector('.step-head')) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement('afterend', box);
                }
                box.innerHTML = opened ? '✅ <b>Урок открыт ученику.</b> Он видит его в своём кабинете.'
                    : '🔒 <b>Новый урок — ученик его пока не видит.</b> Он откроется сам, когда вы начнёте с ним живой урок, или нажмите: <button type="button" class="ui-btn small" data-open-draft="' + esc(d.id) + '">Открыть ученику</button>';
            });
        }
        // канал ученика «/open» (хранится на сервере связи): открытые черновики и прикреплённые уроки из учебника
        async function publishOpen(owner) {
            let all = {};
            try {
                all = JSON.parse(localStorage.getItem(OPENED) || '{}');
            }
            catch (_) { }
            const b = bookOf(owner), targets = await targetsFor(owner);
            let ok = false;
            for (const x of targets)
                ok = (await publishRetained(x.topic + '/open', await fbSeal(x.key, { t: Date.now(), open: all[owner] || [], book: b.ids, bat: b.at, bt: b.t }))) || ok;
            return ok;
        }
        /* ----- 📚 Учебник: уроки по учебнику лежат в библиотеке преподавателя. «Прикрепить ученику» — урок появляется
           в кабинете ученика (новых ссылок не нужно). Один урок можно дать нескольким ученикам; ответы у каждого свои. ----- */
        const BOOK = 'iris-book-v1', isBook = d => !!(d && d.book);
        const bookStore = () => { try {
            const v = JSON.parse(localStorage.getItem(BOOK) || '{}');
            return v && typeof v === 'object' ? v : {};
        }
        catch (_) {
            return {};
        } };
        const bookOf = o => { const r = bookStore()[o]; return r && Array.isArray(r.ids) ? { ids: r.ids, at: r.at && typeof r.at === 'object' ? r.at : {}, t: r.t || 0 } : { ids: [], at: {}, t: 0 }; };
        const bookChanged = () => { var _a; try {
            updateChrome();
            if (screen === 'home')
                renderHome();
            (_a = window.irisBookChanged) === null || _a === void 0 ? void 0 : _a.call(window);
        }
        catch (_) { } };
        // преподаватель: урок из учебника открыт «для» ученика — класс, ответы и разбор идут этому ученику
        const bookCtx = {};
        lessonMeta = (base => function (id) { const m = base(id); return m && isBook(m) && vaultOpen && bookCtx[id] ? Object.assign(Object.assign({}, m), { owner: bookCtx[id] }) : m; })(lessonMeta);
        function bookOpen(id, owner) {
            if (owner && CFG.entries.some(e => e.profile === owner))
                bookCtx[id] = owner;
            else
                delete bookCtx[id];
            state.role = 'teacher';
            save();
            openLesson(id);
        }
        async function bookAssign(id, profiles) {
            const all = bookStore(), now = Date.now(), changed = [];
            [...new Set([...Object.keys(all), ...profiles])].filter(o => CFG.entries.some(e => e.profile === o)).forEach(o => {
                const r = bookOf(o), has = r.ids.includes(id), want = profiles.includes(o);
                if (has === want)
                    return;
                r.ids = want ? [...r.ids, id] : r.ids.filter(x => x !== id);
                if (want)
                    r.at[id] = now;
                else
                    delete r.at[id];
                r.t = now;
                r.pub = false;
                all[o] = r;
                changed.push(o);
            });
            try {
                localStorage.setItem(BOOK, JSON.stringify(all));
            }
            catch (_) { }
            bookChanged();
            let ok = true;
            for (const o of changed) {
                const sent = await publishOpen(o).catch(() => false);
                ok = ok && sent;
                if (sent) {
                    const a = bookStore();
                    if (a[o]) {
                        a[o].pub = true;
                        try {
                            localStorage.setItem(BOOK, JSON.stringify(a));
                        }
                        catch (_) { }
                    }
                }
            }
            return { ok, changed };
        }
        // преподаватель: прикрепления хранятся и на сервере связи — на другом устройстве они те же; не отправленные — отправляем ещё раз
        async function bookSync() {
            if (!teacherSecret || typeof mqtt === 'undefined' || !DATA.some(isBook))
                return;
            const all = bookStore();
            for (const o of Object.keys(all))
                if (all[o] && all[o].pub === false && await publishOpen(o).catch(() => false)) {
                    const a = bookStore();
                    a[o].pub = true;
                    try {
                        localStorage.setItem(BOOK, JSON.stringify(a));
                    }
                    catch (_) { }
                }
            const ts = (await Promise.all([...new Set(CFG.entries.map(e => e.profile))].map(targetsFor))).flat();
            if (!ts.length)
                return;
            const cs = lobbyClients(c => c.subscribe(ts.map(x => x.topic + '/open'), { qos: 0 }, () => { }), async (t, payload) => {
                var _a;
                const x = ts.find(y => y.topic + '/open' === t);
                if (!x)
                    return;
                let m;
                try {
                    m = await lobbyOpen(x.key, new TextDecoder().decode(payload));
                }
                catch (_) {
                    return;
                }
                if (!m || !Array.isArray(m.book) || typeof m.bt !== 'number')
                    return;
                const a = bookStore(), o = x.e.profile;
                if ((((_a = a[o]) === null || _a === void 0 ? void 0 : _a.t) || 0) >= m.bt)
                    return;
                a[o] = { ids: m.book.filter(id => typeof id === 'string' && DATA.some(d => d.id === id && isBook(d))), at: m.bat && typeof m.bat === 'object' ? m.bat : {}, t: m.bt, pub: true };
                try {
                    localStorage.setItem(BOOK, JSON.stringify(a));
                }
                catch (_) { }
                bookChanged();
            });
            setTimeout(() => cs.forEach(c => { try {
                c.end(true);
            }
            catch (_) { } }), 20000);
        }
        /* ----- 📖 Общий словарь: слова ученика одинаковые у ученика и у преподавателя (канал «/words» на сервере связи,
           зашифрован ключом личной ссылки). Добавили, исправили, отметили «выучено» или удалили слово с любой стороны —
           через пару секунд это видно и на другой. У каждого слова своя метка времени: побеждает последнее изменение. ----- */
        const WMAX = 2000, wk = w => lookupKey(w.en), wsig = w => JSON.stringify([w.en, w.ru, w.example || '', w.learned ? 1 : 0]);
        const prOf = o => { if (!state.profiles[o] || typeof state.profiles[o] !== 'object')
            state.profiles[o] = {}; const p = state.profiles[o]; if (!Array.isArray(p.words))
            p.words = []; return p; };
        const wmeta = p => { if (!p.wsync || typeof p.wsync !== 'object')
            p.wsync = {}; const m = p.wsync; ['u', 'sig', 'del'].forEach(k => { if (!m[k] || typeof m[k] !== 'object')
            m[k] = {}; }); return m; };
        function wstamp(p) {
            const m = wmeta(p), now = Date.now(), cur = new Set();
            let changed = false;
            p.words.forEach(w => { const k = wk(w); if (!k)
                return; cur.add(k); const g = wsig(w); if (m.sig[k] !== g) {
                m.sig[k] = g;
                m.u[k] = Math.max(now, (m.u[k] || 0) + 1);
                delete m.del[k];
                changed = true;
            } });
            Object.keys(m.sig).forEach(k => { if (!cur.has(k)) {
                delete m.sig[k];
                delete m.u[k];
                m.del[k] = now;
                changed = true;
            } });
            return changed;
        }
        const wpack = p => { const m = wmeta(p); return { v: 1, t: Date.now(), w: p.words.slice(0, WMAX).map(w => ({ en: w.en, ru: w.ru, ex: w.example || '', src: w.source || '', l: w.learned ? 1 : 0, u: m.u[wk(w)] || 0 })), d: m.del }; };
        const wstr = (x, n) => typeof x === 'string' ? x.slice(0, n) : '';
        function wmerge(p, msg) {
            const m = wmeta(p);
            let changed = false, behind = false;
            if (!msg || msg.v !== 1 || !Array.isArray(msg.w))
                return { changed, behind };
            const byK = new Map(p.words.map(w => [wk(w), w])), seen = new Set();
            msg.w.slice(0, WMAX).forEach(x => {
                const en = wstr(x && x.en, 180).trim(), ru = wstr(x && x.ru, 500).trim(), u = Number(x && x.u) || 0, k = lookupKey(en);
                if (!en || !ru || !k)
                    return;
                seen.add(k);
                const mine = byK.get(k), mu = m.u[k] || 0, du = m.del[k] || 0;
                if (u > mu && u > du) {
                    const w = mine || { id: 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6), en, ru, example: '', source: '', learned: false };
                    Object.assign(w, { en, ru, example: wstr(x.ex, 500), source: wstr(x.src, 150) || w.source, learned: !!x.l });
                    if (!mine) {
                        p.words.unshift(w);
                        byK.set(k, w);
                    }
                    m.u[k] = u;
                    m.sig[k] = wsig(w);
                    delete m.del[k];
                    changed = true;
                }
                else if (u < mu)
                    behind = true;
            });
            Object.entries(msg.d && typeof msg.d === 'object' ? msg.d : {}).slice(0, 5000).forEach(([k, u]) => {
                u = Number(u) || 0;
                if (!k || u <= (m.del[k] || 0))
                    return;
                if (u > (m.u[k] || 0)) {
                    if (byK.has(k)) {
                        p.words = p.words.filter(w => wk(w) !== k);
                        byK.delete(k);
                        changed = true;
                    }
                    delete m.u[k];
                    delete m.sig[k];
                    m.del[k] = u;
                }
            });
            for (const k of byK.keys())
                if (!seen.has(k) && !(msg.d && msg.d[k])) {
                    behind = true;
                    break;
                }
            if (!behind)
                for (const k of Object.keys(m.del))
                    if (!(msg.d && (msg.d[k] || 0) >= m.del[k])) {
                        behind = true;
                        break;
                    }
            return { changed, behind };
        }
        const wordsUi = () => { try {
            updateChrome();
            if (screen === 'words' && !review)
                renderWords();
        }
        catch (_) { } };
        let wSaving = false;
        const wTargets = async (o) => (accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' ? (o === accessInfo.entry.profile ? [await lobbyKeys(accessInfo.token)] : []) : targetsFor(o);
        const wTimers = {};
        function wPublishSoon(o, ms = 1500) {
            clearTimeout(wTimers[o]);
            wTimers[o] = setTimeout(async () => { const p = prOf(o), ts = await wTargets(o).catch(() => []); for (const x of ts)
                await publishRetained(x.topic + '/words', await fbSeal(x.key, wpack(p))).catch(() => false); }, ms);
        }
        // каждое сохранение: если слова изменились — отправляем (ученик — свои, преподаватель — слова выбранного ученика)
        save = (base => function () {
            const r = base.apply(this, arguments);
            if (wSaving || !accessInfo)
                return r;
            const os = accessInfo.role === 'student' ? [accessInfo.entry.profile] : [...new Set(CFG.entries.map(e => e.profile))].filter(o => state.profiles[o]);
            const ch = os.filter(o => wstamp(prOf(o)));
            if (ch.length) {
                wSaving = true;
                try {
                    base();
                }
                finally {
                    wSaving = false;
                }
                ch.forEach(o => wPublishSoon(o));
            }
            return r;
        })(save);
        window.irisEditWords = (o, f) => { const p = prOf(o); p.words = f(p.words); save(); }; // for the automatic check
        async function wordsSync() {
            var _a;
            if (typeof mqtt === 'undefined' || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle) || !accessInfo)
                return;
            const owners = accessInfo.role === 'student' ? [accessInfo.entry.profile] : [...new Set(CFG.entries.map(e => e.profile))];
            const ts = [];
            for (const o of owners) {
                prOf(o);
                if (wstamp(prOf(o)))
                    save();
                (await wTargets(o).catch(() => [])).forEach(x => ts.push(Object.assign({ o }, x)));
            }
            if (!ts.length)
                return;
            const first = new Set();
            lobbyClients(c => c.subscribe(ts.map(x => x.topic + '/words'), { qos: 1 }, () => { }), async (t, payload) => {
                const x = ts.find(y => y.topic + '/words' === t);
                if (!x)
                    return;
                let msg;
                try {
                    msg = await lobbyOpen(x.key, new TextDecoder().decode(payload));
                }
                catch (_) {
                    return;
                }
                const p = prOf(x.o), r = wmerge(p, msg);
                first.add(x.topic);
                if (r.changed) {
                    wSaving = true;
                    try {
                        save();
                    }
                    finally {
                        wSaving = false;
                    }
                    wordsUi();
                }
                if (r.behind || (r.changed && accessInfo.role === 'teacher' && ts.filter(y => y.o === x.o).length > 1))
                    wPublishSoon(x.o, 2500);
            });
            // никто ещё не публиковал (первый запуск) — отправляем свой словарь
            setTimeout(() => ts.forEach(x => { if (!first.has(x.topic) && prOf(x.o).words.length)
                wPublishSoon(x.o, 0); }), 9000);
        }
        /* ----- 📲 Ответы и прогресс на всех устройствах ученика: телефон, ноутбук, планшет. Ученик сделал часть урока на
           телефоне — открывает ноутбук, и там уже те же ответы, пройденные этапы и место, где он остановился. Канал «/progress»
           (тот же ключ личной ссылки, данные сжаты и зашифрованы). У каждого ответа своя метка времени: побеждает последнее. ----- */
        const PBUCKETS = ['fields', 'choices', 'flips', 'pickers', 'completed', 'steps'];
        const pmeta = p => { if (!p.psync || typeof p.psync !== 'object')
            p.psync = {}; const m = p.psync; ['u', 'sig', 'del'].forEach(k => { if (!m[k] || typeof m[k] !== 'object')
            m[k] = {}; }); return m; };
        function pstamp(p) {
            const m = pmeta(p), now = Date.now(), cur = new Set();
            let changed = false;
            PBUCKETS.forEach(b => { const o = p[b]; if (!o || typeof o !== 'object')
                return; Object.keys(o).forEach(k => { const key = b + '|' + k; cur.add(key); const g = JSON.stringify(o[k]); if (m.sig[key] !== g) {
                m.sig[key] = g;
                m.u[key] = Math.max(now, (m.u[key] || 0) + 1);
                delete m.del[key];
                changed = true;
            } }); });
            (Array.isArray(p.opened) ? p.opened : []).forEach(id => { const key = 'opened|' + id; cur.add(key); if (!m.sig[key]) {
                m.sig[key] = '1';
                m.u[key] = now;
                changed = true;
            } });
            Object.keys(m.sig).forEach(key => { if (!cur.has(key)) {
                delete m.sig[key];
                delete m.u[key];
                m.del[key] = now;
                changed = true;
            } });
            if (p.lastLesson && m.sig['last'] !== p.lastLesson) {
                m.sig['last'] = p.lastLesson;
                m.u['last'] = now;
                changed = true;
            }
            return changed;
        }
        function ppack(p) {
            const m = pmeta(p), d = {};
            Object.keys(m.sig).forEach(key => {
                var _a;
                if (key === 'last')
                    return;
                const [b, k] = [key.slice(0, key.indexOf('|')), key.slice(key.indexOf('|') + 1)];
                d[key] = [b === 'opened' ? 1 : (_a = p[b]) === null || _a === void 0 ? void 0 : _a[k], m.u[key] || 0];
            });
            return { v: 1, t: Date.now(), d, x: m.del, last: p.lastLesson ? [p.lastLesson, m.u['last'] || 0] : null };
        }
        function pmerge(p, msg) {
            const m = pmeta(p);
            let changed = false, behind = false;
            if (!msg || msg.v !== 1 || !msg.d || typeof msg.d !== 'object')
                return { changed, behind };
            const seen = new Set();
            Object.entries(msg.d).forEach(([key, val]) => {
                const i = key.indexOf('|'), b = key.slice(0, i), k = key.slice(i + 1);
                if (!(PBUCKETS.includes(b) || b === 'opened') || !k || !Array.isArray(val))
                    return;
                seen.add(key);
                const [v, u] = [val[0], Number(val[1]) || 0];
                if (u > (m.u[key] || 0) && u > (m.del[key] || 0)) {
                    if (b === 'opened') {
                        if (!Array.isArray(p.opened))
                            p.opened = [];
                        if (!p.opened.includes(k))
                            p.opened.push(k);
                        m.sig[key] = '1';
                    }
                    else {
                        if (!p[b] || typeof p[b] !== 'object')
                            p[b] = {};
                        p[b][k] = v;
                        m.sig[key] = JSON.stringify(v);
                    }
                    m.u[key] = u;
                    delete m.del[key];
                    changed = true;
                }
                else if (u < (m.u[key] || 0))
                    behind = true;
            });
            Object.entries(msg.x && typeof msg.x === 'object' ? msg.x : {}).forEach(([key, u]) => {
                u = Number(u) || 0;
                if (u <= (m.del[key] || 0) || u <= (m.u[key] || 0))
                    return;
                const i = key.indexOf('|'), b = key.slice(0, i), k = key.slice(i + 1);
                if (b === 'opened') {
                    if (Array.isArray(p.opened))
                        p.opened = p.opened.filter(x => x !== k);
                }
                else if (PBUCKETS.includes(b) && p[b])
                    delete p[b][k];
                delete m.sig[key];
                delete m.u[key];
                m.del[key] = u;
                changed = true;
            });
            if (Array.isArray(msg.last) && typeof msg.last[0] === 'string' && (Number(msg.last[1]) || 0) > (m.u['last'] || 0)) {
                p.lastLesson = msg.last[0];
                m.sig['last'] = msg.last[0];
                m.u['last'] = Number(msg.last[1]);
                changed = true;
            }
            if (!behind)
                for (const key of Object.keys(m.sig))
                    if (key !== 'last' && !seen.has(key)) {
                        behind = true;
                        break;
                    }
            return { changed, behind };
        }
        // данные сжимаются (gzip) — так в одно сообщение помещаются ответы всех уроков
        async function packBytes(key, obj) {
            let bytes = enc.encode(JSON.stringify(obj)), z = 0;
            if (window.CompressionStream) {
                try {
                    bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
                    z = 1;
                }
                catch (_) { }
            }
            const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes));
            const out = new Uint8Array(12 + ct.length);
            out.set(iv);
            out.set(ct, 12);
            return (z ? 'z' : 'j') + b64e(out);
        }
        async function unpackBytes(key, str) {
            const z = str[0] === 'z', u = b64d(str.slice(1));
            let bytes = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12)));
            if (z)
                bytes = typeof DecompressionStream === 'undefined' ? irisInflate.gunzip(bytes) // старый iPad / Safari: распаковываем сами
                    : new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
            return JSON.parse(new TextDecoder().decode(bytes));
        }
        let pSaving = false, pTimer = null, pReady = false;
        const pOwner = () => (accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) === 'student' ? accessInfo.entry.profile : null;
        async function pPublish() {
            const o = pOwner();
            if (!o || typeof mqtt === 'undefined')
                return;
            const { topic, key } = await lobbyKeys(accessInfo.token);
            return publishRetained(topic + '/progress', await packBytes(key, ppack(prOf(o))));
        }
        const pPublishSoon = (ms = 2000) => { clearTimeout(pTimer); pTimer = setTimeout(() => pPublish().catch(() => { }), ms); };
        save = (base => function () {
            const r = base.apply(this, arguments);
            if (pSaving || !pReady)
                return r;
            const o = pOwner();
            if (o && pstamp(prOf(o))) {
                pSaving = true;
                try {
                    base();
                }
                finally {
                    pSaving = false;
                }
                pPublishSoon();
            }
            return r;
        })(save);
        // телефон убрали в карман или закрыли вкладку — отправляем сразу, чтобы на ноутбуке всё было
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pTimer) {
            clearTimeout(pTimer);
            pTimer = null;
            pPublish().catch(() => { });
        } });
        function progressUi() {
            var _a, _b;
            try {
                updateChrome();
                const typing = (_b = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.closest) === null || _b === void 0 ? void 0 : _b.call(_a, '#lesson-panels input, #lesson-panels textarea, #lesson-panels select');
                if (!typing)
                    hydrate(); // все уроки сразу: открытый и те, что откроют позже
                if (screen === 'lesson')
                    refreshLessonStats();
                else if (screen === 'home')
                    renderHome();
            }
            catch (_) { }
        }
        async function progressSync() {
            var _a;
            const o = pOwner();
            if (!o || typeof mqtt === 'undefined' || !((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle))
                return;
            const p = prOf(o), fresh = !p.psync;
            pReady = true;
            if (pstamp(p)) {
                if (fresh) {
                    const m = pmeta(p);
                    Object.keys(m.u).forEach(k => { m.u[k] = 1; });
                } // новое устройство: его пустые настройки не перебивают настоящие ответы
                pSaving = true;
                try {
                    save();
                }
                finally {
                    pSaving = false;
                }
            }
            const { topic, key } = await lobbyKeys(accessInfo.token);
            let heard = false;
            lobbyClients(c => c.subscribe(topic + '/progress', { qos: 1 }, () => { }), async (t, payload) => {
                if (t !== topic + '/progress')
                    return;
                let msg;
                try {
                    msg = await unpackBytes(key, new TextDecoder().decode(payload));
                }
                catch (_) {
                    return;
                }
                heard = true;
                const r = pmerge(prOf(o), msg);
                if (r.changed) {
                    pSaving = true;
                    try {
                        save();
                    }
                    finally {
                        pSaving = false;
                    }
                    progressUi();
                }
                if (r.behind)
                    pPublishSoon(2500);
            });
            setTimeout(() => { if (!heard)
                pPublishSoon(0); }, 9000);
        }
        window.irisProgressSync = () => pPublish(); // for the automatic check
        // ученик: видит только прикреплённые ему уроки из учебника — как свои
        const bookHidden = [];
        const myPr = () => { const o = accessInfo.entry.profile; return state.profiles[o] = state.profiles[o] && typeof state.profiles[o] === 'object' ? state.profiles[o] : {}; };
        function hideBook() { for (let i = DATA.length - 1; i >= 0; i--)
            if (isBook(DATA[i]))
                bookHidden.push(DATA.splice(i, 1)[0]); applyBook(true); }
        function takeBook(rec) {
            if ((accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) !== 'student')
                return;
            const pr = myPr();
            if (pr.book && (pr.book.t || 0) >= rec.t)
                return;
            pr.book = rec;
            save();
            applyBook(false);
        }
        function applyBook(quiet) {
            const rec = myPr().book;
            if (!rec || !Array.isArray(rec.ids))
                return;
            const me = accessInfo.entry, mine = DATA.find(d => d.id === me.profile) || {}, added = [];
            let removed = false;
            for (let i = DATA.length - 1; i >= 0; i--) {
                const d = DATA[i];
                if (isBook(d) && !rec.ids.includes(d.id)) {
                    bookHidden.push(DATA.splice(i, 1)[0]);
                    removed = true;
                    if (currentLesson === d.id && screen === 'lesson')
                        route('home');
                }
            }
            rec.ids.forEach(id => {
                var _a;
                const i = bookHidden.findIndex(d => d.id === id);
                if (i < 0)
                    return;
                const d = bookHidden.splice(i, 1)[0];
                Object.assign(d, { owner: me.profile, name: mine.name || me.name, greeting: mine.greeting, initials: mine.initials, date: new Date(Number((_a = rec.at) === null || _a === void 0 ? void 0 : _a[id]) || rec.t || Date.now()).toISOString().slice(0, 10) });
                DATA.push(d);
                added.push(d);
            });
            if (quiet)
                return;
            if (added.length || removed)
                bookChanged();
            if (added.length)
                notify('📘 Преподаватель добавил урок: «' + added[added.length - 1].title + '»' + (added.length > 1 ? ' и ещё ' + (added.length - 1) : '') + '. Он в «Моих уроках».');
        }
        /* ----- 🗂 Планы преподавателя по порядку: «Все ученики», ученик → его уроки (новые сверху, свёрнуты), работы, ссылки ----- */
        const HUB = 'iris-hub-v1';
        function buildHub() {
            var _a, _b;
            const root = $('#teacher');
            if (!root || root.querySelector('.plans-hub'))
                return;
            const cardOwner = id => id === 'zm' ? 'zakhar-mikhail' : (DATA.find(d => d.id === id) || {}).owner;
            const cards = $$('section.lesson-card[id^="teacher-"]', root).filter(c => cardOwner(c.id.slice(8)));
            const owners = [...new Set(DATA.map(d => d.owner))].filter(o => cards.some(c => cardOwner(c.id.slice(8)) === o));
            const lessonsOf = o => (window.irisLessonsOf ? window.irisLessonsOf(o) : DATA.filter(d => d.owner === o));
            const nameOf = o => window.irisStudentName ? window.irisStudentName(o) : ((lessonsOf(o)[0] || {}).name || o);
            const cardOf = d => document.getElementById('teacher-' + d.id) || (d.id === 'zakhar-mikhail' ? document.getElementById('teacher-zm') : null);
            let opened = {};
            try {
                opened = JSON.parse(localStorage.getItem(OPENED) || '{}');
            }
            catch (_) { }
            const status = d => !d.draft ? '' : (opened[d.owner] || []).includes(d.id) ? '<span class="hub-chip ok">открыт ученику</span>' : '<span class="hub-chip draft">🔒 ученик пока не видит</span>';
            const hub = document.createElement('div');
            hub.className = 'plans-hub';
            hub.innerHTML = '<div class="hub-tabs" role="tablist">'
                + [['overview', '🗂 Все ученики'], ['inbox', '📥 Работы учеников'], ['links', '🔗 Ссылки учеников'], ['how', '❓ Как пользоваться']].map(([k, t]) => '<button type="button" role="tab" data-hub="' + k + '">' + t + '</button>').join('')
                + '</div><div class="hub-students">' + owners.map(o => '<button type="button" data-hub="s:' + esc(o) + '">' + esc(nameOf(o)) + ' <span>' + lessonsOf(o).length + '</span></button>').join('') + '</div>'
                + '<section class="step hub-overview" id="hub-overview"><div class="step-head"><h2>Все ученики</h2></div><div class="hub-grid">'
                + owners.map(o => {
                    var _a;
                    return '<article class="hub-student"><header><b>' + esc(nameOf(o)) + '</b><small>' + esc(((_a = lessonsOf(o).slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.level) || '') + '</small></header><ol>'
                        + lessonsOf(o).map((d, i) => '<li><span class="hub-n">' + (i + 1) + '</span><span class="hub-title">' + esc(d.title) + ' ' + status(d) + '</span><span class="hub-acts"><button type="button" class="ui-link" data-hub-plan="' + esc(d.id) + '">План</button><button type="button" class="ui-link" data-hub-open="' + esc(d.id) + '">Открыть урок</button></span></li>').join('')
                        + '</ol><button type="button" class="ui-btn small soft" data-hub="s:' + esc(o) + '">Планы уроков ' + esc(nameOf(o)) + ' →</button></article>';
                }).join('') + '</div></section>';
            const main = root.querySelector('main') || root;
            main.prepend(hub);
            (_a = root.querySelector('.lesson-nav')) === null || _a === void 0 ? void 0 : _a.setAttribute('hidden', '');
            const lead = root.querySelector('.hero .lead');
            if (lead)
                lead.textContent = 'Планы, ключи и подсказки ко всем урокам. Выберите ученика — увидите только его уроки, новые сверху.';
            (_b = root.querySelector('.hero .tags')) === null || _b === void 0 ? void 0 : _b.remove();
            // планы: свёрнуты, кнопки «Развернуть» и «Открыть урок»
            cards.forEach(c => {
                c.classList.add('plan-card', 'collapsed');
                const head = c.querySelector('.step-head');
                if (!head || head.querySelector('.plan-acts'))
                    return;
                const lid = c.id === 'teacher-zm' ? 'zakhar-mikhail' : c.id.slice(8);
                head.insertAdjacentHTML('beforeend', '<span class="plan-acts"><button type="button" class="ui-link" data-plan-toggle>Развернуть план</button>' + (DATA.some(d => d.id === lid) ? '<button type="button" class="ui-link" data-hub-open="' + esc(lid) + '">Открыть урок →</button>' : '') + '</span>');
            });
            const others = () => [$('#teacher-inbox'), $('#teacher-access'), $('#teacher-how'), $('#teacher-school')].filter(Boolean);
            function show(view, focusId) {
                var _a;
                try {
                    localStorage.setItem(HUB, view);
                }
                catch (_) { }
                $$('[data-hub]', hub).forEach(b => b.setAttribute('aria-selected', String(b.dataset.hub === view)));
                $('#hub-overview').hidden = view !== 'overview';
                const studs = $('.hub-students', hub);
                if (studs)
                    studs.hidden = !(view === 'overview' || view.startsWith('s:')); // в «Работах» и «Ссылках» список учеников не нужен
                others().forEach(x => { x.hidden = !((view === 'inbox' && x.id === 'teacher-inbox') || (view === 'links' && x.id === 'teacher-access') || (view === 'how' && x.id === 'teacher-how')); });
                const owner = view.startsWith('s:') ? view.slice(2) : null;
                cards.forEach(c => { c.hidden = !owner || cardOwner(c.id.slice(8)) !== owner; });
                if (owner) { // уроки ученика: новые сверху, самый новый развёрнут
                    const mine = lessonsOf(owner).map(cardOf).filter(Boolean).reverse();
                    const host = (_a = mine[0]) === null || _a === void 0 ? void 0 : _a.parentElement;
                    mine.forEach(c => host.appendChild(c));
                    const first = focusId ? document.getElementById(focusId) : mine[0];
                    mine.forEach(c => c.classList.toggle('collapsed', c !== first));
                    paintToggles();
                    if (focusId && first)
                        setTimeout(() => first.scrollIntoView({ block: 'start' }), 30);
                }
            }
            const paintToggles = () => cards.forEach(c => { const b = c.querySelector('[data-plan-toggle]'); if (b)
                b.textContent = c.classList.contains('collapsed') ? 'Развернуть план' : 'Свернуть план'; });
            hub.addEventListener('click', e => { const b = e.target.closest('[data-hub]'); if (b) {
                show(b.dataset.hub);
                window.scrollTo(0, root.offsetTop);
            } });
            root.addEventListener('click', e => {
                const t = e.target.closest('[data-plan-toggle]');
                if (t) {
                    t.closest('.plan-card').classList.toggle('collapsed');
                    paintToggles();
                    return;
                }
                const p = e.target.closest('[data-hub-plan]');
                if (p) {
                    const d = DATA.find(x => x.id === p.dataset.hubPlan), c = d && cardOf(d);
                    if (c)
                        show('s:' + d.owner, c.id);
                    return;
                }
                const o = e.target.closest('[data-hub-open]');
                if (o) {
                    state.role = 'teacher';
                    save();
                    openLesson(o.dataset.hubOpen);
                }
            });
            document.addEventListener('click', e => { if (e.target.closest('[data-inbox-nav], [data-inbox-open]'))
                setTimeout(() => show('inbox'), 120); }, true);
            window.addEventListener('hashchange', () => { const h = location.hash.slice(1); const c = h.startsWith('teacher-') && document.getElementById(h); if (c && c.classList.contains('plan-card'))
                show('s:' + cardOwner(h.slice(8)), h); });
            let v = 'overview';
            try {
                v = localStorage.getItem(HUB) || 'overview';
            }
            catch (_) { }
            if (v.startsWith('s:') && !owners.includes(v.slice(2)))
                v = 'overview';
            show(v);
        }
        document.addEventListener('click', async (e) => {
            const b = e.target.closest('[data-open-draft]');
            if (!b)
                return;
            b.disabled = true;
            const ok = await openForStudents(b.dataset.openDraft);
            notify(ok ? '✅ Урок открыт ученику.' : 'Сервер связи не ответил — урок откроется ученику, когда вы начнёте с ним живой урок. Попробуйте ещё раз позже.');
            b.disabled = false;
        });
        return { get role() { return (accessInfo === null || accessInfo === void 0 ? void 0 : accessInfo.role) || null; }, get teacher() { return vaultOpen; },
            inbox: () => inboxList(), workState, scoreOf, showWork: goWork, onlineIn,
            openChecking: (who = '', tab = null) => { chkWho = who; chkTab = tab; inboxBtn.click(); },
            draftsOpened: owner => { try {
                return (JSON.parse(localStorage.getItem(OPENED) || '{}')[owner] || []);
            }
            catch (_) {
                return [];
            } },
            lobbyInvite, lobbyStop, lobbyEnd, unlockLesson, openForStudents, recOwner,
            // 📚 учебник: прикреплённые уроки ученика {id: когда прикреплён}, кому прикреплён урок, открыть урок для ученика, прикрепить
            bookAt: o => vaultOpen ? bookOf(o).at : {}, bookWho: id => Object.keys(bookStore()).filter(o => bookOf(o).ids.includes(id)), bookCtx: id => bookCtx[id] || '', bookOpen, bookAssign,
            // преподаватель: личные ссылки учеников этого профиля (для совместного урока)
            studentLinks: async (profile) => !teacherSecret ? [] : Promise.all(CFG.entries.filter(e => e.profile === profile).map(async (e) => ({ name: e.name, link: personalUrl(await studentToken(teacherSecret, e.id)) }))) };
    })();
    /* ---------- Полировка интерфейса ученика ---------- */
    (function () {
        var _a;
        const brandSvg = ((_a = $('.app-brand svg')) === null || _a === void 0 ? void 0 : _a.outerHTML) || '';
        // Иконка вкладки браузера в цвете Iris
        if (brandSvg && !document.querySelector('link[rel="icon"]')) {
            const icon = document.createElement('link');
            icon.rel = 'icon';
            icon.href = 'data:image/svg+xml,' + encodeURIComponent(brandSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#655387'));
            document.head.appendChild(icon);
        }
        // Логотип на экране входа
        const gateCard = $('.access-card');
        if (gateCard && brandSvg) {
            const kicker = gateCard.querySelector('.kicker');
            const brand = document.createElement('div');
            brand.className = 'gate-brand';
            brand.innerHTML = brandSvg + '<span>iris school</span>';
            kicker === null || kicker === void 0 ? void 0 : kicker.replaceWith(brand);
        }
        // Имя ученика в тонкой шапке на телефоне
        const me = document.createElement('div');
        me.className = 'mobile-me';
        me.innerHTML = '<div class="avatar" id="mobile-avatar"></div><span id="mobile-name"></span>';
        $('.app-sidebar').insertBefore(me, $('.sidebar-label'));
        updateChrome = (base => function (...a) { var _a; base.apply(this, a); $('#mobile-avatar').textContent = $('#profile-avatar').textContent; $('#mobile-name').textContent = ((_a = $('#access-name')) === null || _a === void 0 ? void 0 : _a.textContent) || meta().name; })(updateChrome);
        // Кабинет ученика: дата, статус домашки, «как заниматься», без повторов
        renderHome = (base => function (...a) {
            var _a, _b;
            base.apply(this, a);
            if (document.body.classList.contains('teacher-access'))
                return;
            const home = $('#screen-home');
            const kicker = $('.home-intro .kicker', home);
            if (kicker) {
                const d = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
                kicker.textContent = d.charAt(0).toUpperCase() + d.slice(1);
            }
            $$('.prep-card', home).forEach(card => { var _a; const sent = /отправлены/i.test(card.textContent); (_a = card.querySelector('.kicker')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', sent ? '<span class="status done">✓ Отправлено</span>' : '<span class="status todo">Нужно сделать</span>'); });
            const aside = $('.welcome-row > aside.panel', home);
            if (aside)
                aside.innerHTML = '<h2>Как заниматься</h2><ol class="howto"><li><div>Сделайте домашнее задание и нажмите «Отправить преподавателю».<small>Ответы зашифрованы, их видит только преподаватель.</small></div></li><li><div>На уроке откройте ссылку, которую пришлёт преподаватель.<small>Вы увидите указку, а преподаватель — ваши ответы.</small></div></li><li><div>Выделите незнакомое слово — появится перевод. Сохраняйте слова в словарь.<small>Открывайте платформу всегда в одном браузере, чтобы ничего не потерялось.</small></div></li></ol>';
            if (availableLessons().filter(m => m.owner === state.profile).length <= 1) {
                (_a = $('.section-title', home)) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = $('.lesson-grid', home)) === null || _b === void 0 ? void 0 : _b.remove();
            }
            const tools = $('.data-tools', home);
            if (tools && !tools.querySelector('.home-logout'))
                tools.insertAdjacentHTML('beforeend', '<button class="ui-link home-logout" type="button">Выйти из кабинета</button>');
        })(renderHome);
        document.addEventListener('click', e => { var _a; if (e.target.closest('.home-logout'))
            (_a = $('.access-logout')) === null || _a === void 0 ? void 0 : _a.click(); });
    })();
    /* ---------- Удобство для ученика: кнопки вместо списков, сборка предложений, праздник, прогресс ---------- */
    (function () {
        var _a, _b, _c, _d, _e, _f;
        const ART = JSON.parse(((_a = $('#art-data')) === null || _a === void 0 ? void 0 : _a.textContent) || '{"svg":{},"map":{}}');
        const artImg = (name, cls) => { var _a; return ((_a = ART.img) === null || _a === void 0 ? void 0 : _a[name]) ? '<img class="' + cls + ' art-3d" alt="" src="' + ART.img[name] + '" decoding="async">' : ART.svg[name] ? '<img class="' + cls + '" alt="" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ART.svg[name]) + '">' : ''; };
        // 1. Варианты ответа крупными кнопками вместо выпадающего списка (сам список остаётся для сохранения и проверки)
        function syncSelect(sel) {
            const c = sel._chips;
            if (!c)
                return;
            const v = sel.value;
            c.slot.textContent = v || '…';
            c.slot.className = 'slot' + (v ? ' filled' : '') + ['ok', 'bad', 'shown'].filter(x => sel.classList.contains(x)).map(x => ' ' + x).join('');
            c.row.querySelectorAll('.chip').forEach(b => { const on = b.dataset.value === v; b.classList.toggle('picked', on); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('ok', on && sel.classList.contains('ok')); b.classList.toggle('bad', on && sel.classList.contains('bad')); });
        }
        function enhanceSelect(sel) {
            if (sel._chips || !sel.closest('#lesson-panels'))
                return;
            const opts = Array.from(sel.options).filter(o => o.value !== '');
            if (!opts.length || opts.length > 5)
                return;
            const slot = document.createElement('span');
            slot.setAttribute('aria-hidden', 'true');
            const row = document.createElement('span');
            row.className = 'chips';
            row.setAttribute('role', 'group');
            opts.forEach(o => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'chip';
                b.textContent = o.text;
                b.dataset.value = o.value;
                b.addEventListener('click', () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); syncSelect(sel); });
                row.appendChild(b);
            });
            sel.classList.add('has-chips');
            sel.tabIndex = -1;
            sel.after(slot);
            if (sel.closest('.chat-lines') && sel.closest('li').querySelectorAll('select.gap').length > 1)
                slot.after(row); // a chat line with two gaps: buttons right after each gap
            else
                (sel.closest('li') || sel.parentElement).appendChild(row);
            sel._chips = { slot, row };
            sel.addEventListener('change', () => syncSelect(sel));
            sel.addEventListener('input', () => syncSelect(sel));
            syncSelect(sel);
        }
        // 2. «Собери предложение»: нажимайте на слова по порядку, ответ складывается в поле
        function syncOrder(inp) {
            const c = inp._order;
            if (!c)
                return;
            let rest = ' ' + inp.value.toLowerCase().replace(/\s+/g, ' ') + ' ';
            c.chips.forEach(b => { const t = ' ' + b.textContent.toLowerCase() + ' '; const used = rest.includes(t); if (used)
                rest = rest.replace(t, ' '); b.disabled = used; });
        }
        function enhanceOrder(box) {
            const li = box.closest('li'), inp = li && li.querySelector('input.gap');
            if (!inp || inp._order)
                return;
            const chips = box.dataset.words.split('|').map(w => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip word'; b.textContent = w; return b; });
            const reset = document.createElement('button');
            reset.type = 'button';
            reset.className = 'chip reset';
            reset.textContent = '↺ Заново';
            const fire = () => { inp.dispatchEvent(new Event('input', { bubbles: true })); syncOrder(inp); };
            chips.forEach(b => b.addEventListener('click', () => { inp.value = (inp.value + ' ' + b.textContent).trim(); fire(); }));
            reset.addEventListener('click', () => { inp.value = ''; fire(); });
            box.classList.add('chips');
            box.append(...chips, reset);
            inp._order = { chips };
            inp.setAttribute('autocomplete', 'off');
            inp.addEventListener('input', () => syncOrder(inp));
            syncOrder(inp);
        }
        // 🔊 Озвучка: лучший голос на устройстве (нейроголоса Edge «Natural», улучшенные голоса iOS, голоса Google),
        // два разных голоса для диалогов, режим «медленнее», длинный текст — по фразам (так озвучка не обрывается).
        const canSpeak = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
        // Записи британскими нейроголосами (Kokoro): текст → mp3. Если записи нет — голос устройства.
        let AUDIO = {};
        try {
            AUDIO = JSON.parse(((_b = document.getElementById('audio-data')) === null || _b === void 0 ? void 0 : _b.textContent) || '{}');
        }
        catch (_) { }
        const normT = t => String(t || '').replace(/\s+/g, ' ').trim();
        const clipFor = (text, who) => { const t = normT(text); return AUDIO[(who || 'f') + '|' + t] || ['f', 'm', 'f2', 'm2'].map(w => AUDIO[w + '|' + t]).find(Boolean) || null; };
        const player = typeof Audio !== 'undefined' ? new Audio() : null;
        if (player)
            player.preload = 'auto';
        if (!canSpeak && !Object.keys(AUDIO).length)
            document.body.classList.add('no-speech');
        const FEMALE = /(sonia|libby|maisie|aria|jenny|emma|ava|michelle|natasha|samantha|kate|serena|karen|moira|tessa|fiona|victoria|susan|hazel|martha|female|zira|catherine)/i;
        const MALE = /(ryan|thomas|guy|davis|andrew|brian|christopher|eric|william|daniel|arthur|oliver|george|alex|fred|tom|rishi|male|david|mark|james)/i;
        function voiceScore(v) {
            let s = 0;
            const n = v.name || '';
            if (/^en[-_]GB/i.test(v.lang))
                s += 3;
            else if (/^en[-_](US|AU|IE|CA|NZ)/i.test(v.lang))
                s += 2;
            else if (/^en/i.test(v.lang))
                s += 1;
            else
                return -99;
            if (/natural|neural|online/i.test(n))
                s += 8;
            if (/enhanced|premium|siri/i.test(n))
                s += 6;
            if (/google/i.test(n))
                s += 4;
            if (/(sonia|libby|ryan|thomas|aria|jenny|guy|daniel|kate|serena|arthur|martha|samantha|alex)/i.test(n))
                s += 2;
            if (/compact|espeak|robot|novelty|bad news|bells|whisper|zarvox|trinoids|cellos/i.test(n))
                s -= 10;
            return s;
        }
        let voiceCache = null;
        function voices() {
            if (!canSpeak)
                return { any: null, f: null, m: null };
            if (voiceCache)
                return voiceCache;
            const list = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
            if (!list.length)
                return { any: null, f: null, m: null };
            let pin = null; /*iris-voice-pin*/
            try { pin = localStorage.getItem('iris-voice-f'); } catch (_) { }
            const f = (pin && list.find(v => v.name === pin)) || list.find(v => FEMALE.test(v.name) && /^en[-_]GB/i.test(v.lang)) || list.find(v => FEMALE.test(v.name)) || list[0], m = list.find(v => MALE.test(v.name) && v !== f) || null;
            try { if (f && !pin && list.length > 1) localStorage.setItem('iris-voice-f', f.name); } catch (_) { }
            voiceCache = { any: list[0], f, m };
            return voiceCache;
        }
        if (canSpeak) {
            try {
                speechSynthesis.onvoiceschanged = () => { voiceCache = null; };
                speechSynthesis.getVoices();
            }
            catch (_) { }
        }
        let slow = false;
        try {
            slow = localStorage.getItem('iris-slow') === '1';
        }
        catch (_) { }
        const chunks = text => String(text).replace(/\s+/g, ' ').trim().match(/[^.!?…]+[.!?…]*["»”']?\s*/g) || [String(text)];
        let speakToken = 0, clipStop = null;
        function stopAll() {
            speakToken++;
            if (player) {
                try {
                    player.pause();
                }
                catch (_) { }
            }
            if (clipStop)
                clipStop();
            if (canSpeak) {
                try {
                    speechSynthesis.cancel();
                }
                catch (_) { }
            }
        }
        // проиграть запись; true — прозвучала (или её остановили), false — не получилось (тогда читает голос устройства)
        function playClip(src, token, offset = 0) {
            return new Promise(resolve => {
                if (!player || token !== speakToken)
                    return resolve(true);
                let done = false;
                const fin = ok => { if (done)
                    return; done = true; player.onended = player.onerror = null; clipStop = null; resolve(ok); };
                clipStop = () => fin(true);
                player.onended = () => fin(true);
                player.onerror = () => fin(false);
                // запись не начала звучать за 7 с (плохая связь, старая версия страницы) — читает голос устройства, а не тишина
                const watch = setTimeout(() => { if (!done && (player.paused || player.currentTime < 0.05)) {
                    try {
                        player.pause();
                    }
                    catch (_) { }
                    fin(false);
                } }, 7000);
                player.addEventListener('playing', () => clearTimeout(watch), { once: true });
                player.src = src;
                player.defaultPlaybackRate = player.playbackRate = slow ? 0.8 : 1;
                if (offset > 0.05) {
                    const jump = () => { try {
                        player.currentTime = Math.min(offset, (player.duration || offset + 1) - 0.2);
                    }
                    catch (_) { } };
                    if (player.readyState >= 1)
                        jump();
                    else
                        player.addEventListener('loadedmetadata', jump, { once: true });
                }
                try {
                    player.preservesPitch = true;
                }
                catch (_) { }
                const p = player.play();
                if (p && p.catch)
                    p.catch(() => fin(false));
            });
        }
        // каждое слово словаря платформы записано тем же британским голосом (bf_emma): файл audio/<sha1('bf_emma|слово')[:16]>.mp3
        let DICT_WORDS = null;
        async function dictClip(text) {
            var _a;
            const w = normT(text).toLowerCase().replace(/^to /, '').replace(/^[^a-z']+|[^a-z']+$/g, '');
            if (!w || !(window.crypto && crypto.subtle))
                return null;
            if (!DICT_WORDS) {
                try {
                    DICT_WORDS = new Set(Object.keys(JSON.parse(((_a = document.getElementById('core-dict')) === null || _a === void 0 ? void 0 : _a.textContent) || '{}')));
                }
                catch (_) {
                    DICT_WORDS = new Set();
                }
            }
            if (AUDIO['f|' + w])
                return AUDIO['f|' + w];
            // только точное слово: «bumped» не подменяем записью «bump» — такие формы читает голос устройства
            const head = DICT_WORDS.has(w) ? w : null;
            if (!head)
                return null;
            try {
                const h = await crypto.subtle.digest('SHA-1', new TextEncoder().encode('bf_emma|' + head));
                return 'audio/' + [...new Uint8Array(h)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('') + '.mp3';
            }
            catch (_) {
                return null;
            }
        }
        async function sayOne(text, who, token, offset = 0) {
            const src = clipFor(text, who) || (normT(text).split(' ').length <= 2 ? await dictClip(text) : null);
            if (token !== speakToken)
                return;
            if (src && await playClip(src, token, offset))
                return;
            if (token !== speakToken)
                return;
            if (!canSpeak) {
                notify('🔇 Запись не загрузилась. Проверьте интернет и обновите страницу.');
                return;
            }
            return speakQueue(chunks(text), { who }, token);
        }
        // speak(text, {who: 'f'|'m'}) → Promise, которое завершается, когда фраза прочитана
        function speak(text, opts = {}) {
            if (!text)
                return Promise.resolve();
            stopAll();
            return sayOne(text, opts.who, speakToken);
        }
        window.irisSpeak = text => speak(text);
        function speakQueue(parts, opts, token) {
            return parts.reduce((p, part) => p.then(() => new Promise(resolve => {
                if (token !== speakToken)
                    return resolve();
                try {
                    const vs = voices(), u = new SpeechSynthesisUtterance(part.trim());
                    const male = /^m/.test(opts.who || ''), v = male ? (vs.m || vs.f || vs.any) : (vs.f || vs.any); /*iris-voice-default*/
                    if (v) {
                        u.voice = v;
                        u.lang = v.lang;
                    }
                    else
                        u.lang = 'en-GB';
                    u.rate = slow ? 0.72 : 0.94;
                    u.pitch = male && !vs.m ? 0.8 : 1;
                    let done = false;
                    const fin = () => { if (!done) {
                        done = true;
                        resolve();
                    } };
                    u.onend = fin;
                    u.onerror = fin;
                    setTimeout(fin, 1500 + part.length * 160); // страховка: некоторые браузеры не присылают onend
                    speechSynthesis.speak(u);
                }
                catch (_) {
                    resolve();
                }
            })), Promise.resolve());
        }
        let sayingBtn = null;
        document.addEventListener('click', e => {
            const b = e.target.closest('.say[data-say]');
            if (!b)
                return;
            e.preventDefault();
            e.stopPropagation();
            if (sayingBtn === b && soundOn()) {
                stopAll();
                return;
            } // второе нажатие — стоп
            sayingBtn = b;
            b.classList.add('speaking');
            speak(b.dataset.say, { who: b.dataset.who }).then(() => { if (sayingBtn === b)
                sayingBtn = null; b.classList.remove('speaking'); });
        }, true);
        // ⏹ Стоп: пока звучит что угодно (аудирование, слово, фраза), внизу экрана есть кнопка, которая всё останавливает
        const soundOn = () => (player && !player.paused && !player.ended) || (canSpeak && (() => { try {
            return speechSynthesis.speaking;
        }
        catch (_) {
            return false;
        } })());
        const stopPill = document.createElement('button');
        stopPill.type = 'button';
        stopPill.className = 'sound-stop';
        stopPill.hidden = true;
        stopPill.innerHTML = '⏹ Стоп';
        stopPill.setAttribute('aria-label', 'Остановить звук');
        document.body.appendChild(stopPill);
        stopPill.addEventListener('click', () => { stopAll(); stopPill.hidden = true; $$('.say.speaking').forEach(x => x.classList.remove('speaking')); sayingBtn = null; });
        setInterval(() => { const on = soundOn(); if (stopPill.hidden === on) {
            stopPill.hidden = !on;
            if (on) {
                const nav = $('.app-nav'), fixed = nav && getComputedStyle(nav).position === 'fixed';
                stopPill.style.bottom = ((fixed ? nav.getBoundingClientRect().height : 0) + 14) + 'px';
            }
        } if (!on)
            $$('.say.speaking').forEach(x => x.classList.remove('speaking')); }, 300); // кнопка — над нижним меню телефона
        window.addEventListener('hashchange', () => { if (!(typeof live !== 'undefined' && live.active))
            stopAll(); }); // ушли на другой этап или экран — звук не играет дальше
        // 🎧 Аудирование: диалог читается двумя голосами; текст скрыт, пока ученик не нажмёт «Показать текст»
        function setSlow(on) { slow = on; try {
            localStorage.setItem('iris-slow', on ? '1' : '0');
        }
        catch (_) { } $$('.lis-slow').forEach(b => { b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on); }); }
        const AUDIO_DUR = (() => { var _a; try {
            return JSON.parse(((_a = $('#audio-dur')) === null || _a === void 0 ? void 0 : _a.textContent) || '{}');
        }
        catch (_) {
            return {};
        } })();
        if (player)
            player.addEventListener('timeupdate', () => $$('.listening').forEach(b => b._lisTick && b._lisTick()));
        function initListening(box) {
            var _a, _b;
            if (box._lis)
                return;
            box._lis = true;
            let lines = [];
            try {
                lines = JSON.parse(box.dataset.lines || '[]');
            }
            catch (_) { }
            const status = box.querySelector('.lis-status'), play = box.querySelector('.lis-play');
            let plays = 0, playing = false;
            const items = $$('.lis-transcript li', box);
            // ⏪ ⏩ перемотка: длительность каждой реплики известна заранее (записи готовые), шкала — по всей записи
            const durOf = i => { const src = clipFor(lines[i][1], lines[i][0]); return (src && AUDIO_DUR[src]) || Math.max(1.5, lines[i][1].split(/\s+/).length * 0.42); };
            const gapS = () => (slow ? 0.65 : 0.38), starts = [], total = (() => { let t = 0; lines.forEach((_, i) => { starts.push(t); t += durOf(i) + gapS(); }); return t; })();
            let pos = 0, curLine = 0;
            const fmt = t => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
            box.querySelector('.lis-controls').insertAdjacentHTML('afterend', '<div class="lis-seek"><button type="button" class="lis-back" aria-label="Назад на 5 секунд">⏪ 5 с</button><div class="lis-track" role="slider" tabindex="0" aria-label="Перемотка записи" aria-valuemin="0" aria-valuemax="' + Math.round(total) + '" aria-valuenow="0">' + lines.map((_, i) => '<span class="lis-tick" style="left:' + (starts[i] / total * 100).toFixed(2) + '%"></span>').join('') + '<span class="lis-fill"></span><span class="lis-knob"></span></div><button type="button" class="lis-fwd" aria-label="Вперёд на 5 секунд">5 с ⏩</button><span class="lis-time">0:00 / ' + fmt(total) + '</span></div>');
            const track = box.querySelector('.lis-track');
            function paintPos(t) { pos = Math.max(0, Math.min(total, t)); const pc = (pos / total * 100).toFixed(2) + '%'; box.querySelector('.lis-fill').style.width = pc; box.querySelector('.lis-knob').style.left = pc; box.querySelector('.lis-time').textContent = fmt(pos) + ' / ' + fmt(total); track.setAttribute('aria-valuenow', String(Math.round(pos))); }
            box._lisTick = () => { if (playing && player && !player.paused)
                paintPos(starts[curLine] + (player.currentTime || 0)); };
            const lineAt = t => { let i = 0; while (i + 1 < lines.length && starts[i + 1] <= t)
                i++; return i; };
            function seekTo(t, remote) {
                t = Math.max(0, Math.min(total - 0.5, t));
                const i = lineAt(t), off = Math.max(0, Math.min(durOf(i) - 0.3, t - starts[i]));
                if (!remote && lisFollow(box)) {
                    notify('Сейчас слушаем вместе — перематывает преподаватель.');
                    return;
                }
                if (!remote && lisLead(box))
                    live.send('lis', { box: box.id, act: 'play', from: i, offset: off, slow });
                paintPos(starts[i] + off);
                startAt(i, off);
            }
            track.addEventListener('click', e => { const r = track.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width * total); });
            track.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                seekTo(pos + (e.key === 'ArrowLeft' ? -5 : 5));
            } });
            box.querySelector('.lis-back').addEventListener('click', () => seekTo(pos - 5));
            box.querySelector('.lis-fwd').addEventListener('click', () => seekTo(pos + 5));
            let runSeq = 0;
            function stopHere() { stopAll(); runSeq++; playing = false; play.textContent = '▶ Слушать · Listen'; play.classList.remove('on'); items.forEach(li => li.classList.remove('now')); }
            async function run(from = 0, offset = 0) {
                if (!canSpeak && !lines.every(l => clipFor(l[1], l[0]))) {
                    notify('На этом устройстве нет голоса. Попросите преподавателя прочитать диалог или откройте текст.');
                    return;
                }
                if (playing) {
                    stopHere();
                    return;
                }
                stopAll();
                const my = ++runSeq;
                playing = true;
                play.textContent = '⏹ Стоп · Stop';
                play.classList.add('on');
                const token = speakToken;
                for (let i = from; i < lines.length; i++) {
                    if (token !== speakToken)
                        break;
                    curLine = i;
                    paintPos(starts[i] + (i === from ? offset : 0));
                    items.forEach((li, k) => li.classList.toggle('now', k === i));
                    await sayOne(lines[i][1], lines[i][0], token, i === from ? offset : 0);
                    if (token === speakToken)
                        paintPos(starts[i] + durOf(i));
                    await new Promise(r => setTimeout(r, slow ? 650 : 380));
                }
                if (my !== runSeq)
                    return; // эту запись уже сменила другая (перемотка) или её остановили
                if (token === speakToken) {
                    plays++;
                    status.textContent = 'Прослушано: ' + plays;
                    paintPos(0);
                }
                playing = false;
                play.textContent = '▶ Слушать ещё раз · Listen again';
                play.classList.remove('on');
                items.forEach(li => li.classList.remove('now'));
            }
            const startAt = (from, offset = 0) => { if (playing)
                stopHere(); return run(from, offset); };
            const stopNow = () => { if (playing)
                stopHere(); };
            box._lisRemote = m => { if (m.act === 'play') {
                if (typeof m.slow === 'boolean')
                    setSlow(m.slow);
                startAt(Number(m.from) || 0, Math.max(0, Number(m.offset) || 0));
            }
            else if (m.act === 'stop')
                stopNow();
            else if (m.act === 'line') {
                const i = Number(m.i) || 0;
                if (lines[i]) {
                    stopAll();
                    playing = false;
                    sayOne(lines[i][1], lines[i][0], speakToken);
                }
            } };
            play.addEventListener('click', () => {
                if (lisFollow(box)) {
                    notify('Сейчас слушаем вместе — запускает преподаватель.');
                    return;
                }
                if (lisLead(box))
                    live.send('lis', { box: box.id, act: playing ? 'stop' : 'play', from: 0, slow });
                run(0);
            });
            (_a = box.querySelector('.lis-slow')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => setSlow(!slow));
            (_b = box.querySelector('.lis-script')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', e => { const t = box.querySelector('.lis-transcript'); t.hidden = !t.hidden; e.currentTarget.textContent = t.hidden ? '📄 Показать текст · Transcript' : '📄 Скрыть текст'; });
            items.forEach((li, i) => {
                var _a;
                return (_a = li.querySelector('.lis-line')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    if (lisFollow(box)) {
                        notify('Сейчас слушаем вместе — запускает преподаватель.');
                        return;
                    }
                    if (lisLead(box))
                        live.send('lis', { box: box.id, act: 'line', i });
                    const was = li.classList.contains('now') && soundOn();
                    stopHere();
                    if (was)
                        return;
                    li.classList.add('now');
                    sayOne(lines[i][1], lines[i][0], speakToken).then(() => li.classList.remove('now'));
                });
            });
            box.querySelector('.lis-controls').insertAdjacentHTML('beforeend', '<span class="lis-mode" hidden><button type="button" data-lis-mode="solo" aria-pressed="true">🎧 Каждый сам</button><button type="button" data-lis-mode="together" aria-pressed="false">👥 Слушаем вместе</button></span>');
            box.querySelector('.lis-controls').insertAdjacentHTML('afterend', '<p class="lis-together" hidden>👥 <b>Слушаем вместе:</b> запись запускает преподаватель, у вас она зазвучит сама. Если не слышно — <button type="button" class="ui-btn small soft lis-unlock">🔈 Включить звук</button></p>');
            setSlow(slow);
        }
        $$('.listening').forEach(initListening);
        // 👥 Совместное и самостоятельное прослушивание на живом уроке. Преподаватель выбирает режим для каждой записи:
        // «Каждый сам» — каждый слушает в своём темпе; «Слушаем вместе» — запись запускает преподаватель, и она звучит у всех сразу.
        const lisMode = {};
        const inLive = box => { var _a; return live.active && ((_a = box.closest('.pane')) === null || _a === void 0 ? void 0 : _a.id) === live.lesson; };
        const lisLead = box => inLive(box) && live.role === 'teacher' && lisMode[box.id] === 'together';
        const lisFollow = box => inLive(box) && live.role === 'student' && lisMode[box.id] === 'together';
        function paintLis() {
            $$('.listening').forEach(box => {
                const mode = box.querySelector('.lis-mode'), note = box.querySelector('.lis-together'), on = lisMode[box.id] === 'together';
                if (mode) {
                    mode.hidden = !(inLive(box) && live.role === 'teacher');
                    $$('[data-lis-mode]', mode).forEach(b => b.setAttribute('aria-pressed', String((b.dataset.lisMode === 'together') === on)));
                }
                if (note)
                    note.hidden = !lisFollow(box);
                box.classList.toggle('lis-follow', lisFollow(box));
            });
        }
        document.addEventListener('click', e => {
            const b = e.target.closest('[data-lis-mode]');
            if (b) {
                const box = b.closest('.listening');
                lisMode[box.id] = b.dataset.lisMode;
                live.send('lis', { box: box.id, mode: lisMode[box.id] });
                paintLis();
                notify(lisMode[box.id] === 'together' ? '👥 Слушаем вместе: запускайте запись — она зазвучит у всех.' : '🎧 Каждый слушает сам, в своём темпе.');
                return;
            }
            if (e.target.closest('.lis-unlock') && player) { // iPhone / iPad: звук можно включить только касанием — один раз
                const box = e.target.closest('.listening');
                let src = null;
                try {
                    const l = JSON.parse(box.dataset.lines)[0];
                    src = clipFor(l[1], l[0]);
                }
                catch (_) { }
                if (src) {
                    player.muted = true;
                    player.src = src;
                    const p = player.play();
                    const done = () => { try {
                        player.pause();
                    }
                    catch (_) { } player.muted = false; notify('🔈 Звук включён.'); };
                    if (p && p.then)
                        p.then(done, done);
                    else
                        done();
                }
            }
        });
        if (typeof live !== 'undefined' && live.on) {
            live.on('lis', m => {
                if (m.role !== 'teacher' || live.role !== 'student')
                    return;
                const box = document.getElementById(String(m.box || ''));
                if (!box || !box.classList.contains('listening'))
                    return;
                if (m.mode) {
                    lisMode[box.id] = m.mode === 'together' ? 'together' : 'solo';
                    paintLis();
                    notify(lisMode[box.id] === 'together' ? '👥 Слушаем вместе: запись включит преподаватель.' : '🎧 Теперь слушаете сами, в своём темпе.');
                }
                if (m.act && lisMode[box.id] === 'together' && box._lisRemote)
                    box._lisRemote(m);
            });
            live.on('lis-modes', m => { if (m.role !== 'teacher' || live.role !== 'student' || !m.modes || typeof m.modes !== 'object')
                return; Object.entries(m.modes).forEach(([k, v]) => { lisMode[k] = v === 'together' ? 'together' : 'solo'; }); paintLis(); });
            live.on('hello', m => { if (live.role === 'teacher' && m.role === 'student' && Object.keys(lisMode).length)
                live.send('lis-modes', { modes: lisMode }); });
            setInterval(paintLis, 1500);
        }
        // 🎮 Игры со словами урока: «Найди пару», «60 секунд», «Услышь и напиши», «Мемори», «Собери слово», «Воздушные шарики», «Детектив». Лучший результат — в поле ответа
        // (сохраняется у ученика и уходит преподавателю вместе с работой).
        const gnorm = t => String(t || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"«»…]/g, ' ').replace(/\s+/g, ' ').trim();
        const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
        function initGames(box) {
            if (box._g)
                return;
            box._g = true;
            let words = [];
            try {
                words = JSON.parse(box.dataset.gameWords || '[]');
            }
            catch (_) { }
            const lid = box.dataset.lesson, hint = w => w.ru || w.d, meaning = w => w.d || w.ru;
            const bestKey = g => 'iris-game:' + state.profile + ':' + lid + ':' + g;
            const readBest = g => { try {
                return JSON.parse(localStorage.getItem(bestKey(g)) || 'null');
            }
            catch (_) {
                return null;
            } };
            function record(card, g, res, better, label) {
                if (g === 'match')
                    tourMark('match');
                const old = readBest(g), isBest = !old || better(res, old);
                if (isBest) {
                    try {
                        localStorage.setItem(bestKey(g), JSON.stringify(res));
                    }
                    catch (_) { }
                }
                const best = isBest ? res : old, f = card.querySelector('.game-score');
                card.querySelector('.game-best').textContent = '🏆 Лучший результат: ' + label(best);
                if (f && isBest) {
                    f.value = label(best) + ' (' + new Date().toLocaleDateString('ru-RU') + ')';
                    f.dispatchEvent(new Event('input', { bubbles: true }));
                }
                return isBest;
            }
            const showBest = (card, g, label) => { const b = readBest(g); if (b)
                card.querySelector('.game-best').textContent = '🏆 Лучший результат: ' + label(b); };
            const finish = (card, html, stars = 0) => { card.querySelector('.game-area').innerHTML = '<div class="game-done">' + (stars ? '<div class="game-stars" aria-label="' + stars + ' из 3 звёзд">' + [1, 2, 3].map(n => '<span class="' + (n <= stars ? 'on' : '') + '" style="--d:' + n * 0.15 + 's">★</span>').join('') + '</div>' : '') + html + '</div>'; if (stars >= 2)
                try {
                    celebrate(card);
                }
                catch (_) { } card.querySelector('.game-start').textContent = '↺ Ещё раз'; card.querySelector('.game-start').hidden = false; };
            // 1. Найди пару
            const matchLabel = r => r.sec + ' с · ошибок: ' + r.err;
            function playMatch(card) {
                const set = shuffle(words).slice(0, 6), area = card.querySelector('.game-area'), t0 = Date.now();
                let pick = null, err = 0, done = 0;
                area.innerHTML = '<div class="match-grid"><div class="match-col">' + shuffle(set).map(w => '<button type="button" class="match-btn" data-k="' + esc(w.w) + '" data-side="w">' + esc(w.w) + '</button>').join('') + '</div><div class="match-col">' + shuffle(set).map(w => '<button type="button" class="match-btn mean" data-k="' + esc(w.w) + '" data-side="m">' + esc(hint(w)) + '</button>').join('') + '</div></div><p class="game-status">Найдено: 0 / ' + set.length + '</p>';
                area.onclick = e => {
                    const b = e.target.closest('.match-btn');
                    if (!b || b.disabled)
                        return;
                    if (!pick || pick.dataset.side === b.dataset.side) {
                        $$('.match-btn.sel', area).forEach(x => x.classList.remove('sel'));
                        pick = b;
                        b.classList.add('sel');
                        return;
                    }
                    if (pick.dataset.k === b.dataset.k) {
                        [pick, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
                        done++;
                        if (pick.dataset.side === 'w' || b.dataset.side === 'w')
                            speak(pick.dataset.k);
                        area.querySelector('.game-status').textContent = 'Найдено: ' + done + ' / ' + set.length;
                        if (done === set.length) {
                            const r = { sec: Math.round((Date.now() - t0) / 1000), err };
                            const nb = record(card, 'match', r, (a, b) => a.sec + a.err * 5 < b.sec + b.err * 5, matchLabel);
                            finish(card, '🎉 Готово! Время: <b>' + r.sec + ' с</b>, ошибок: <b>' + err + '</b>' + (nb ? '<br>Это ваш лучший результат!' : ''), err === 0 ? 3 : err <= 2 ? 2 : 1);
                            area.onclick = null;
                        }
                    }
                    else {
                        err++;
                        [pick, b].forEach(x => { x.classList.add('bad'); setTimeout(() => x.classList.remove('bad', 'sel'), 450); });
                    }
                    pick = null;
                };
            }
            // 2. 60 секунд
            const quizLabel = r => r.score + ' за минуту';
            function playQuiz(card) {
                const area = card.querySelector('.game-area'), end = Date.now() + 60000;
                let score = 0, total = 0, timer = null, order = shuffle(words), i = 0;
                const next = () => {
                    if (Date.now() >= end)
                        return over();
                    if (i >= order.length) {
                        order = shuffle(words);
                        i = 0;
                    }
                    const w = order[i++], opts = shuffle([w, ...shuffle(words.filter(x => x !== w)).slice(0, 3)]);
                    area.innerHTML = '<div class="quiz-top"><span class="quiz-time">⏱ ' + Math.max(0, Math.ceil((end - Date.now()) / 1000)) + ' с</span><span>Счёт: <b>' + score + '</b></span></div><p class="quiz-q">' + esc(meaning(w)) + '</p><div class="quiz-opts">' + opts.map(o => '<button type="button" class="match-btn" data-ok="' + (o === w ? 1 : 0) + '">' + esc(o.w) + '</button>').join('') + '</div>';
                    area.onclick = e => {
                        const b = e.target.closest('.match-btn');
                        if (!b || area.dataset.lock)
                            return;
                        area.dataset.lock = '1';
                        total++;
                        if (b.dataset.ok === '1') {
                            score++;
                            b.classList.add('ok');
                            speak(w.w);
                        }
                        else {
                            b.classList.add('bad');
                            area.querySelector('[data-ok="1"]').classList.add('ok');
                        }
                        setTimeout(() => { delete area.dataset.lock; next(); }, b.dataset.ok === '1' ? 550 : 1100);
                    };
                };
                const over = () => { clearInterval(timer); area.onclick = null; const r = { score, total }; const nb = record(card, 'quiz', r, (a, b) => a.score > b.score, quizLabel); finish(card, '⏱ Время вышло! Правильно: <b>' + score + '</b> из ' + total + (nb ? '<br>Это ваш лучший результат!' : ''), score >= 12 ? 3 : score >= 7 ? 2 : 1); };
                timer = setInterval(() => { const t = area.querySelector('.quiz-time'); if (t)
                    t.textContent = '⏱ ' + Math.max(0, Math.ceil((end - Date.now()) / 1000)) + ' с'; if (Date.now() >= end && !area.dataset.lock)
                    over(); }, 250);
                next();
            }
            // 3. Услышь и напиши
            const spellLabel = r => r.score + ' из ' + r.total;
            function playSpell(card) {
                const set = shuffle(words).slice(0, Math.min(8, words.length)), area = card.querySelector('.game-area');
                let i = 0, score = 0;
                const ask = () => {
                    if (i >= set.length) {
                        const r = { score, total: set.length };
                        const nb = record(card, 'spell', r, (a, b) => a.score / a.total > b.score / b.total, spellLabel);
                        finish(card, '🎧 Правильно: <b>' + score + '</b> из ' + set.length + (nb ? '<br>Это ваш лучший результат!' : ''), score >= set.length * 0.9 ? 3 : score >= set.length * 0.6 ? 2 : 1);
                        return;
                    }
                    const w = set[i];
                    area.innerHTML = '<div class="quiz-top"><span>Слово ' + (i + 1) + ' из ' + set.length + '</span><span>Счёт: <b>' + score + '</b></span></div><p class="quiz-q"><button type="button" class="say spell-say" aria-label="Послушать ещё раз">🔊</button> ' + esc(hint(w)) + '</p><form class="spell-form"><input class="field spell-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Напишите слово…" aria-label="Слово"><button class="ui-btn" type="submit">OK</button></form><p class="game-status"></p>';
                    speak(w.w);
                    area.querySelector('.spell-say').onclick = e => { e.preventDefault(); e.stopPropagation(); speak(w.w); };
                    const inp = area.querySelector('.spell-input');
                    setTimeout(() => { try {
                        inp.focus({ preventScroll: true });
                    }
                    catch (_) { } }, 50);
                    area.querySelector('.spell-form').onsubmit = e => {
                        e.preventDefault();
                        if (inp.disabled)
                            return;
                        inp.disabled = true;
                        const ok = gnorm(inp.value) === gnorm(w.w) || gnorm(inp.value) === gnorm(w.w.replace(/^(to|a|an) /i, ''));
                        if (ok)
                            score++;
                        inp.classList.add(ok ? 'ok' : 'bad');
                        area.querySelector('.game-status').innerHTML = ok ? '✅ Верно!' : '❌ Правильно: <b>' + esc(w.w) + '</b>';
                        i++;
                        setTimeout(ask, ok ? 700 : 1600);
                    };
                };
                ask();
            }
            // 4. Детектив: дело, четыре подозреваемых, улики = задания по словам и грамматике урока
            let kase = { bad: [], ok: [] };
            try {
                kase = JSON.parse(box.dataset.gameCase || '{}');
            }
            catch (_) { }
            const detLabel = r => 'дело раскрыто за ' + r.sec + ' с · ошибок: ' + r.err;
            const CASES = [['🎂', 'Пропал торт из учительской!', 'The cake has disappeared from the staff room!'], ['🔑', 'Кто-то украл ключи от школы!', 'Someone has stolen the school keys!'],
                ['📕', 'Исчез словарь преподавателя!', "The teacher's dictionary has disappeared!"], ['🏺', 'Кто разбил вазу в музее?', 'Who broke the vase in the museum?'],
                ['🐈', 'Пропала кошка миссис Хадсон!', "Mrs Hudson's cat is missing!"], ['💎', 'Украден бриллиант из витрины!', 'A diamond has been stolen!']];
            const SUSPECTS = [['🧑‍🍳', 'Chef Tom'], ['👩‍🎨', 'Mia the artist'], ['🧔', 'Mr Black'], ['👵', 'Mrs White'], ['🤵', 'James the butler'], ['👩‍🔬', 'Dr Green'], ['🧑‍🎤', 'Rocky the singer'], ['👨‍🏫', 'Professor Plum']];
            function playDetective(card) {
                const area = card.querySelector('.game-area'), t0 = Date.now(), cs = shuffle(CASES)[0], sus = shuffle(SUSPECTS).slice(0, 4), guilty = Math.floor(Math.random() * 4);
                const innocents = shuffle([0, 1, 2, 3].filter(i => i !== guilty));
                let step = 0, err = 0;
                const bads = shuffle(kase.bad || []), w1 = shuffle(words)[0], w3 = shuffle(words.filter(x => x !== w1))[0];
                const lie = bads[0], confession = bads[1] || bads[0];
                const truths = shuffle((kase.ok || []).filter(t => t !== lie.r)).slice(0, 2);
                const four = w => shuffle([w, ...shuffle(words.filter(x => x !== w)).slice(0, 3)]).map(x => ({ t: x.w, ok: x === w }));
                const clues = [
                    { ico: '📝', title: 'Улика 1 · Записка', q: 'На месте преступления нашли записку. Какое слово в ней зашифровано?', note: meaning(w1), opts: four(w1), say: w1.w },
                    { ico: '🗣️', title: 'Улика 2 · Свидетели', q: 'Три свидетеля дали показания. Один лжёт — в его словах грамматическая ошибка. Кто?', opts: shuffle([{ t: lie.b, ok: true }, ...truths.map(t => ({ t, ok: false }))]) },
                    { ico: '🎧', title: 'Улика 3 · Запись с камеры', q: 'Послушайте запись. Какое слово сказал преступник?', audio: w3.w, opts: four(w3), say: w3.w },
                    { ico: '🔎', title: 'Улика 4 · Признание', q: 'Подозреваемый говорит с ошибкой. Как сказать правильно? Выберите — и дело раскрыто!', note: '«' + confession.b + '»', opts: shuffle([{ t: confession.r, ok: true }, { t: confession.b, ok: false }]) }
                ];
                const board = () => '<div class="det-case"><div class="det-title"><span class="det-ico">' + cs[0] + '</span><div><b>Дело: ' + esc(cs[1]) + '</b><small>' + esc(cs[2]) + '</small></div></div><div class="det-suspects">' + sus.map((p, i) => {
                    const cleared = innocents.slice(0, step).includes(i), caught = step >= 4 && i === guilty;
                    return '<div class="det-sus' + (cleared ? ' cleared' : '') + (caught ? ' caught' : '') + '"><span class="det-face">' + p[0] + '</span><small>' + esc(p[1]) + '</small><em>' + (caught ? '🔒 Виновен!' : cleared ? '✓ алиби' : '?') + '</em></div>';
                }).join('') + '</div></div>';
                const show = () => {
                    if (step >= 4) {
                        const r = { sec: Math.round((Date.now() - t0) / 1000), err };
                        area.onclick = null;
                        const nb = record(card, 'detective', r, (a, b) => a.err < b.err || (a.err === b.err && a.sec < b.sec), detLabel);
                        finish(card, board() + '<p>🎉 <b>Дело раскрыто!</b> Виновный — ' + sus[guilty][0] + ' <b>' + esc(sus[guilty][1]) + '</b>.<br>Время: <b>' + r.sec + ' с</b>, ошибок: <b>' + err + '</b>' + (nb ? '<br>Это ваш лучший результат!' : '') + '</p>', err === 0 ? 3 : err <= 2 ? 2 : 1);
                        return;
                    }
                    const c = clues[step];
                    area.innerHTML = board() + '<div class="det-clue"><p class="det-step">' + c.ico + ' <b>' + c.title + '</b> · ' + (step + 1) + ' из 4</p><p class="quiz-q">' + esc(c.q) + '</p>'
                        + (c.note ? '<p class="det-note">' + esc(c.note) + '</p>' : '') + (c.audio ? '<p><button type="button" class="ui-btn small soft det-play">🔊 Включить запись</button></p>' : '')
                        + '<div class="quiz-opts det-opts' + (step === 1 || step === 3 ? ' wide' : '') + '">' + c.opts.map(o => '<button type="button" class="match-btn" data-ok="' + (o.ok ? 1 : 0) + '">' + esc(o.t) + '</button>').join('') + '</div><p class="game-status"></p></div>';
                    if (c.audio) {
                        speak(c.audio);
                        area.querySelector('.det-play').onclick = e => { e.stopPropagation(); speak(c.audio); };
                    }
                    area.onclick = e => {
                        const b = e.target.closest('.det-opts .match-btn');
                        if (!b || b.disabled || area.dataset.lock)
                            return;
                        if (b.dataset.ok === '1') {
                            area.dataset.lock = '1';
                            b.classList.add('ok');
                            if (c.say)
                                speak(c.say);
                            area.querySelector('.game-status').textContent = step < 3 ? '✅ Верно! Один подозреваемый оправдан.' : '✅ Верно!';
                            setTimeout(() => { delete area.dataset.lock; step++; show(); }, 900);
                        }
                        else {
                            err++;
                            b.classList.add('bad');
                            b.disabled = true;
                            area.querySelector('.game-status').textContent = '❌ Неверно — подумайте ещё!';
                        }
                    };
                };
                show();
            }
            // 5. Мемори: карточки рубашкой вверх, пары «слово — значение»
            const memLabel = r => r.moves + ' ходов · ' + r.sec + ' с';
            function playMemory(card) {
                const set = shuffle(words).slice(0, 6), area = card.querySelector('.game-area'), t0 = Date.now();
                let open = [], moves = 0, done = 0;
                const deck = shuffle(set.flatMap((w, i) => [{ k: i, t: w.w, side: 'w' }, { k: i, t: hint(w), side: 'm' }]));
                area.innerHTML = '<div class="mem-grid">' + deck.map((c, i) => '<button type="button" class="mem-card" data-i="' + i + '" aria-label="Карточка ' + (i + 1) + '"><span class="mem-back" aria-hidden="true">?</span><span class="mem-face' + (c.side === 'm' ? ' mean' : '') + '">' + esc(c.t) + '</span></button>').join('') + '</div><p class="game-status">Ходов: 0 · пар: 0 / ' + set.length + '</p>';
                const status = () => { area.querySelector('.game-status').textContent = 'Ходов: ' + moves + ' · пар: ' + done + ' / ' + set.length; };
                area.onclick = e => {
                    const b = e.target.closest('.mem-card');
                    if (!b || b.classList.contains('up') || open.length >= 2)
                        return;
                    b.classList.add('up');
                    b.setAttribute('aria-label', b.textContent.slice(1));
                    open.push(b);
                    if (open.length < 2)
                        return;
                    moves++;
                    const [x, y] = open.map(o => deck[+o.dataset.i]);
                    if (x.k === y.k) {
                        open.forEach(o => { o.classList.add('ok'); o.disabled = true; });
                        open = [];
                        done++;
                        speak(set[x.k].w);
                        status();
                        if (done === set.length) {
                            const r = { moves, sec: Math.round((Date.now() - t0) / 1000) };
                            area.onclick = null;
                            const nb = record(card, 'memory', r, (a, b) => a.moves < b.moves || (a.moves === b.moves && a.sec < b.sec), memLabel);
                            setTimeout(() => finish(card, '🃏 Все пары найдены! Ходов: <b>' + moves + '</b>, время: <b>' + r.sec + ' с</b>' + (nb ? '<br>Это ваш лучший результат!' : ''), moves <= set.length + 3 ? 3 : moves <= set.length * 2 ? 2 : 1), 500);
                        }
                    }
                    else {
                        status();
                        setTimeout(() => { open.forEach(o => { o.classList.remove('up'); o.setAttribute('aria-label', 'Карточка'); }); open = []; }, 900);
                    }
                };
            }
            // слова и короткие фразы для буквенных игр: без a / an / to / the; пробелы и апострофы показаны сразу, угадываются буквы
            const single = w => {
                const t = String(w.w || '').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/^(a|an|to|the) /, ''), n = t.replace(/[^a-z]/g, '').length;
                return /^[a-z][a-z' -]*[a-z]$/.test(t) && n >= 3 && n <= 14 && t.split(/[ -]/).length <= 3 ? t : null;
            };
            const lettersOf = t => t.replace(/[^a-z]/g, '');
            const sepHtml = (word, cls) => word.split(' ').map(part => '<span class="w-grp">' + part.split('').map(c => /[a-z]/.test(c) ? '<span class="' + cls + '"></span>' : '<span class="w-sep">' + esc(c) + '</span>').join('') + '</span>').join('<span class="w-sep"></span>'); // слово не разрывается при переносе
            const letterWords = () => { const seen = new Set(); return shuffle(words).filter(w => { const t = single(w); if (!t || seen.has(t))
                return false; seen.add(t); return true; }); };
            // 6. Собери слово: буквы перемешаны, нажимайте по порядку
            const scrLabel = r => r.score + ' из ' + r.total;
            function playScramble(card) {
                const set = letterWords().slice(0, 6), area = card.querySelector('.game-area');
                let i = 0, score = 0;
                const ask = () => {
                    if (i >= set.length) {
                        const r = { score, total: set.length };
                        const nb = record(card, 'scramble', r, (a, b) => a.score / a.total > b.score / b.total, scrLabel);
                        finish(card, '🔤 Собрано слов: <b>' + score + '</b> из ' + set.length + (nb ? '<br>Это ваш лучший результат!' : ''), score === set.length ? 3 : score >= set.length / 2 ? 2 : 1);
                        return;
                    }
                    const w = set[i], word = single(w), target = lettersOf(word);
                    let letters = target.split('');
                    do {
                        letters = shuffle(letters);
                    } while (letters.join('') === target && new Set(letters).size > 1);
                    let got = '', tries = 0;
                    area.innerHTML = '<div class="quiz-top"><span>Слово ' + (i + 1) + ' из ' + set.length + '</span><span>Счёт: <b>' + score + '</b></span></div><p class="quiz-q">' + esc(hint(w)) + '</p>'
                        + '<div class="scr-slots">' + sepHtml(word, 'scr-slot') + '</div>'
                        + '<div class="scr-tiles">' + letters.map((c, k) => '<button type="button" class="scr-tile" data-k="' + k + '" style="--h:' + ((k * 47) % 360) + '">' + c + '</button>').join('') + '</div>'
                        + '<div class="scr-tools"><button type="button" class="ui-btn small soft scr-undo">⌫ Стереть</button><button type="button" class="ui-link scr-skip">Пропустить</button></div><p class="game-status"></p>';
                    const slots = $$('.scr-slot', area), used = [];
                    const paint = () => slots.forEach((s, k) => { s.textContent = got[k] || ''; s.classList.toggle('on', !!got[k]); });
                    const done = ok => { area.onclick = null; if (ok)
                        score++; area.querySelector('.scr-slots').classList.add(ok ? 'ok' : 'bad'); area.querySelector('.game-status').innerHTML = ok ? '✅ Верно! <b>' + esc(word) + '</b>' : '❌ Правильно: <b>' + esc(word) + '</b>'; speak(w.w); i++; setTimeout(ask, ok ? 900 : 1700); };
                    area.onclick = e => {
                        if (e.target.closest('.scr-skip')) {
                            done(false);
                            return;
                        }
                        if (e.target.closest('.scr-undo')) {
                            if (!used.length)
                                return;
                            used.pop().disabled = false;
                            got = got.slice(0, -1);
                            paint();
                            return;
                        }
                        const b = e.target.closest('.scr-tile');
                        if (!b || b.disabled)
                            return;
                        b.disabled = true;
                        used.push(b);
                        got += b.textContent;
                        paint();
                        if (got.length === target.length) {
                            if (got === target)
                                done(true);
                            else if (++tries >= 2)
                                done(false);
                            else {
                                area.querySelector('.scr-slots').classList.add('bad');
                                area.querySelector('.game-status').textContent = 'Почти! Попробуйте ещё раз.';
                                setTimeout(() => { var _a; (_a = area.querySelector('.scr-slots')) === null || _a === void 0 ? void 0 : _a.classList.remove('bad'); used.splice(0).forEach(x => { x.disabled = false; }); got = ''; paint(); }, 700);
                            }
                        }
                    };
                };
                ask();
            }
            // 7. Воздушные шарики: угадать слово по буквам, ошибка лопает шарик
            const balLabel = r => r.score + ' из ' + r.total + ' слов';
            const BALLOONS = ['#ff5c8a', '#ffb703', '#2ec4b6', '#7b61ff', '#3a86ff', '#fb5607'];
            function playBalloons(card) {
                const set = letterWords().slice(0, 5), area = card.querySelector('.game-area');
                let i = 0, score = 0;
                const ask = () => {
                    if (i >= set.length) {
                        const r = { score, total: set.length };
                        const nb = record(card, 'balloons', r, (a, b) => a.score / a.total > b.score / b.total, balLabel);
                        finish(card, '🎈 Угадано: <b>' + score + '</b> из ' + set.length + (nb ? '<br>Это ваш лучший результат!' : ''), score === set.length ? 3 : score >= set.length - 2 ? 2 : 1);
                        return;
                    }
                    const w = set[i], word = single(w), target = lettersOf(word), found = new Set();
                    let left = BALLOONS.length;
                    area.innerHTML = '<div class="quiz-top"><span>Слово ' + (i + 1) + ' из ' + set.length + '</span><span>Счёт: <b>' + score + '</b></span></div>'
                        + '<div class="bal-row" aria-label="Шарики">' + BALLOONS.map(c => '<span class="bal" style="--c:' + c + '"></span>').join('') + '</div>'
                        + '<p class="quiz-q">' + esc(hint(w)) + '</p><div class="bal-word">' + sepHtml(word, 'bal-l') + '</div>'
                        + '<div class="bal-keys">' + 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => '<button type="button" class="bal-key" data-c="' + c + '">' + c + '</button>').join('') + '</div><p class="game-status"></p>';
                    const paint = () => $$('.bal-l', area).forEach((s, k) => { s.textContent = found.has(target[k]) ? target[k] : ''; s.classList.toggle('on', found.has(target[k])); });
                    const end = ok => { area.onclick = null; if (ok)
                        score++; found.clear(); target.split('').forEach(c => found.add(c)); paint(); area.querySelector('.bal-word').classList.add(ok ? 'ok' : 'bad'); area.querySelector('.game-status').innerHTML = ok ? '✅ Угадали!' : '💥 Шарики кончились. Это слово <b>' + esc(word) + '</b>'; speak(w.w); i++; setTimeout(ask, ok ? 1000 : 1900); };
                    area.onclick = e => {
                        const b = e.target.closest('.bal-key');
                        if (!b || b.disabled)
                            return;
                        b.disabled = true;
                        const c = b.dataset.c;
                        if (target.includes(c)) {
                            b.classList.add('ok');
                            found.add(c);
                            paint();
                            if (target.split('').every(x => found.has(x)))
                                end(true);
                        }
                        else {
                            b.classList.add('bad');
                            left--;
                            const bl = $$('.bal:not(.pop)', area).pop();
                            if (bl)
                                bl.classList.add('pop');
                            if (!left)
                                end(false);
                        }
                    };
                };
                ask();
            }
            // 🎃 Spooky Games (Halloween lessons): «Тыквенная грядка», «Кладбище слов», «Котёл ведьмы»
            const stars3 = (n, t) => n >= t ? 3 : n >= Math.ceil(t * 0.6) ? 2 : 1;
            // 8. Тыквенная грядка: из тыкв выглядывают слова — успейте нажать нужное
            const pumLabel = r => r.score + ' из ' + r.total;
            function playPumpkins(card) {
                const set = shuffle(words).slice(0, 8), area = card.querySelector('.game-area');
                let i = 0, score = 0, timer = null;
                const ask = () => {
                    clearTimeout(timer);
                    if (!area.isConnected)
                        return;
                    if (i >= set.length) {
                        const r = { score, total: set.length };
                        const nb = record(card, 'pumpkins', r, (a, b) => a.score / a.total > b.score / b.total, pumLabel);
                        finish(card, '🎃 Тыкв собрано: <b>' + score + '</b> из ' + set.length + (nb ? '<br>Это ваш лучший результат!' : ''), stars3(score, set.length));
                        return;
                    }
                    const w = set[i], opts = shuffle([w, ...shuffle(words.filter(x => x !== w)).slice(0, 3)]), holes = shuffle([0, 1, 2, 3, 4, 5]).slice(0, opts.length), cells = Array(6).fill(null);
                    opts.forEach((o, k) => { cells[holes[k]] = o; });
                    area.innerHTML = '<div class="quiz-top"><span>Тыква ' + (i + 1) + ' из ' + set.length + '</span><span>Счёт: <b>' + score + '</b></span></div><p class="quiz-q">' + esc(meaning(w)) + '</p>'
                        + '<div class="pum-field">' + cells.map(o => '<div class="pum-hole">' + (o ? '<button type="button" class="pum" data-k="' + esc(o.w) + '" style="--d:' + (Math.random() * 0.6).toFixed(2) + 's"><span class="pum-body" aria-hidden="true"></span><span class="pum-word">' + esc(o.w) + '</span></button>' : '') + '</div>').join('') + '</div>'
                        + '<div class="pum-timer" aria-hidden="true"><span></span></div><p class="game-status"></p>';
                    let over = false;
                    const end = (ok, b) => {
                        if (over)
                            return;
                        over = true;
                        clearTimeout(timer);
                        if (ok)
                            score++;
                        $$('.pum', area).forEach(x => { x.disabled = true; if (x.dataset.k === w.w)
                            x.classList.add('ok'); });
                        if (b && !ok)
                            b.classList.add('bad');
                        area.querySelector('.game-status').innerHTML = ok ? '✅ Spooky good!' : '👻 Это: <b>' + esc(w.w) + '</b>';
                        speak(w.w);
                        i++;
                        setTimeout(ask, ok ? 900 : 1600);
                    };
                    area.onclick = e => { const b = e.target.closest('.pum'); if (!b || b.disabled)
                        return; end(b.dataset.k === w.w, b); };
                    timer = setTimeout(() => end(false), 8000);
                };
                ask();
            }
            // 9. Кладбище слов: слова на надгробиях — соберите предложение по порядку
            const grvLabel = r => r.score + ' из ' + r.total + ' предложений';
            const toks = t => String(t).replace(/([.?!])$/, '').split(/\s+/);
            function playGraves(card) {
                const set = shuffle(kase.ok || []).slice(0, 4), area = card.querySelector('.game-area');
                let i = 0, score = 0;
                const ask = () => {
                    var _a;
                    if (i >= set.length) {
                        const r = { score, total: set.length };
                        const nb = record(card, 'graves', r, (a, b) => a.score / a.total > b.score / b.total, grvLabel);
                        finish(card, '🪦 Собрано: <b>' + score + '</b> из ' + set.length + (nb ? '<br>Это ваш лучший результат!' : ''), stars3(score, set.length));
                        return;
                    }
                    const target = toks(set[i]), mark = ((_a = set[i].match(/[.?!]$/)) === null || _a === void 0 ? void 0 : _a[0]) || '.';
                    let tiles = target.map((t, k) => ({ t, k }));
                    do {
                        tiles = shuffle(tiles);
                    } while (tiles.length > 1 && tiles.every((x, k) => x.k === k));
                    let got = [], tries = 0;
                    area.innerHTML = '<div class="quiz-top"><span>Предложение ' + (i + 1) + ' из ' + set.length + '</span><span>Счёт: <b>' + score + '</b></span></div>'
                        + '<p class="quiz-q">Tap the tombstones in the right order · Нажимайте надгробия по порядку</p><div class="grv-line"></div>'
                        + '<div class="grv-yard">' + tiles.map((x, k) => '<button type="button" class="grv" data-k="' + k + '" style="--r:' + ((k * 37) % 9 - 4) + 'deg">' + esc(x.t) + '</button>').join('') + '</div>'
                        + '<div class="scr-tools"><button type="button" class="ui-btn small soft grv-undo">⌫ Стереть</button><button type="button" class="ui-link grv-skip">Пропустить</button></div><p class="game-status"></p>';
                    const line = area.querySelector('.grv-line'), used = [];
                    const paint = () => { line.textContent = got.join(' ') + (got.length === target.length ? mark : ''); };
                    const done = ok => {
                        area.onclick = null;
                        if (ok)
                            score++;
                        line.classList.add(ok ? 'ok' : 'bad');
                        line.textContent = target.join(' ') + mark;
                        area.querySelector('.game-status').innerHTML = ok ? '✅ Rest in peace, mistakes!' : '❌ Правильно: <b>' + esc(target.join(' ') + mark) + '</b>';
                        speak(target.join(' ') + mark);
                        i++;
                        setTimeout(ask, ok ? 1400 : 2600);
                    };
                    area.onclick = e => {
                        if (e.target.closest('.grv-skip')) {
                            done(false);
                            return;
                        }
                        if (e.target.closest('.grv-undo')) {
                            if (!used.length)
                                return;
                            used.pop().disabled = false;
                            got.pop();
                            paint();
                            return;
                        }
                        const b = e.target.closest('.grv');
                        if (!b || b.disabled)
                            return;
                        b.disabled = true;
                        used.push(b);
                        got.push(b.textContent);
                        paint();
                        if (got.length === target.length) {
                            if (gnorm(got.join(' ')) === gnorm(target.join(' ')))
                                done(true);
                            else if (++tries >= 2)
                                done(false);
                            else {
                                line.classList.add('bad');
                                area.querySelector('.game-status').textContent = 'Почти! Попробуйте ещё раз.';
                                setTimeout(() => { line.classList.remove('bad'); used.splice(0).forEach(x => { x.disabled = false; }); got = []; paint(); }, 900);
                            }
                        }
                    };
                };
                ask();
            }
            // 10. Котёл ведьмы: верное предложение — в зелье, с ошибкой — в болото
            const cauLabel = r => r.score + ' из ' + r.total;
            function playCauldron(card) {
                const items = shuffle([...shuffle(kase.ok || []).slice(0, 4).map(t => ({ t, ok: true })), ...shuffle(kase.bad || []).slice(0, 4).map(x => ({ t: x.b, ok: false, fix: x.r }))]), area = card.querySelector('.game-area');
                let i = 0, score = 0;
                const ask = () => {
                    if (i >= items.length) {
                        const r = { score, total: items.length };
                        const nb = record(card, 'cauldron', r, (a, b) => a.score / a.total > b.score / b.total, cauLabel);
                        finish(card, '🧪 Зелье сварено: <b>' + score + '</b> из ' + items.length + (nb ? '<br>Это ваш лучший результат!' : ''), stars3(score, items.length));
                        return;
                    }
                    const it = items[i];
                    area.innerHTML = '<div class="quiz-top"><span>Ингредиент ' + (i + 1) + ' из ' + items.length + '</span><span>Счёт: <b>' + score + '</b></span></div>'
                        + '<div class="cau-scene"><div class="cau-card">' + esc(it.t) + '</div><div class="cau-pot" aria-hidden="true"><i></i><i></i><i></i></div></div>'
                        + '<div class="cau-btns"><button type="button" class="ui-btn cau-yes" data-v="1">🧪 Correct → into the potion</button><button type="button" class="ui-btn outline cau-no" data-v="0">🐸 Wrong → into the swamp</button></div><p class="game-status"></p>';
                    area.onclick = e => {
                        const b = e.target.closest('[data-v]');
                        if (!b)
                            return;
                        area.onclick = null;
                        const ok = (b.dataset.v === '1') === it.ok;
                        if (ok)
                            score++;
                        area.querySelector('.cau-card').classList.add(b.dataset.v === '1' ? 'in' : 'out', ok ? 'ok' : 'bad');
                        area.querySelector('.game-status').innerHTML = (ok ? '✅ ' : '❌ ') + (it.ok ? 'Это предложение верное.' : 'Ошибка! Правильно: <b>' + esc(it.fix) + '</b>');
                        i++;
                        setTimeout(ask, ok && it.ok ? 1100 : 2400);
                    };
                };
                ask();
            }
            const PLAY = { match: playMatch, quiz: playQuiz, spell: playSpell, detective: playDetective, memory: playMemory, scramble: playScramble, balloons: playBalloons, pumpkins: playPumpkins, graves: playGraves, cauldron: playCauldron }, LABEL = { match: matchLabel, quiz: quizLabel, spell: spellLabel, detective: detLabel, memory: memLabel, scramble: scrLabel, balloons: balLabel, pumpkins: pumLabel, graves: grvLabel, cauldron: cauLabel };
            $$('.game-card', box).forEach(card => {
                const g = card.dataset.game;
                if (!PLAY[g])
                    return;
                showBest(card, g, LABEL[g]);
                card.querySelector('.game-start').addEventListener('click', e => {
                    e.currentTarget.hidden = true;
                    $$('.game-card.playing', box).forEach(c => { if (c !== card)
                        c.classList.remove('playing'); });
                    card.classList.add('playing');
                    PLAY[g](card);
                    if (card.getBoundingClientRect().top < 0)
                        card.scrollIntoView({ block: 'start', behavior: 'smooth' });
                });
            });
        }
        $$('.games').forEach(initGames);
        paintField = (base => function (f, r) { base(f, r); if (f._chips)
            syncSelect(f); if (f._order)
            syncOrder(f); })(paintField);
        // 3. Праздник, когда все ответы в упражнении верны
        function celebrate(ex) {
            if (matchMedia('(prefers-reduced-motion: reduce)').matches)
                return;
            try {
                window.irisBats && window.irisBats(3);
            }
            catch (_) { } // 🦇 Хеллоуин: пара летучих мышей в награду
            const box = document.createElement('div');
            box.className = 'celebrate';
            box.setAttribute('aria-hidden', 'true');
            box.innerHTML = artImg('party-popper', 'celebrate-img') + Array.from({ length: 14 }, (_, i) => '<i style="--a:' + (i * 26) + 'deg;--d:' + (60 + (i % 4) * 18) + 'px;--c:' + ['#e0457b', '#655387', '#f5b301', '#2f9b6f'][i % 4] + '"></i>').join('');
            (ex.querySelector('.ex-actions') || ex).appendChild(box);
            setTimeout(() => box.remove(), 1600);
        }
        checkEx = (base => function (ex) { base(ex); const f = $$('.gap[data-a]', ex); if (f.length && f.every(x => x.classList.contains('ok')))
            celebrate(ex); })(checkEx);
        // 4. «Далее» отмечает этап пройденным; на телефоне — полоска прогресса под переключателем этапов
        moveStage = (base => function (delta) { if (delta > 0 && currentSection && screen === 'lesson') {
            profile().completed[currentSection] = true;
            save();
        } return base(delta); })(moveStage);
        showSection = (base => function (...a) {
            const r = base.apply(this, a);
            const secs = sectionsFor(currentLesson), pos = secs.findIndex(s => s.id === currentSection);
            const nav = $('#lesson-mobile-nav');
            if (nav && pos >= 0)
                nav.insertAdjacentHTML('beforeend', '<div class="stage-progress" aria-hidden="true"><span style="width:' + Math.round((pos + 1) / secs.length * 100) + '%"></span></div>');
            return r;
        })(showSection);
        // «Домашка» в меню: одна кнопка, которая всегда ведёт к домашнему заданию ученика
        function homeworkList() {
            const pr = profile();
            const sent = pr.sent && typeof pr.sent === 'object' ? pr.sent : {};
            return DATA.filter(d => d.owner === state.profile).map(m => ({ m, sec: irisHw.section(m) })).filter(x => x.sec)
                .sort((a, b) => (a.m.kind === 'homework') - (b.m.kind === 'homework') || (b.m.date || '').localeCompare(a.m.date || '')).map(x => (Object.assign(Object.assign({}, x), { sent: irisHw.sent(x.m, sent) }))); // lesson homework first, then grammar homework
        }
        const hwBtn = document.createElement('button');
        hwBtn.type = 'button';
        hwBtn.className = 'hw-nav';
        hwBtn.setAttribute('data-hw-nav', '');
        hwBtn.innerHTML = artImg('memo', 'nav-hw-ico') + '<span>Домашка</span><b class="hw-badge" hidden></b>';
        (_c = $('.app-nav button[data-screen="lesson"]')) === null || _c === void 0 ? void 0 : _c.after(hwBtn);
        function refreshHomeworkNav() {
            const list = homeworkList();
            let todo = list.filter(x => !x.sent).length;
            try {
                if (window.irisHomeworkHub)
                    todo = window.irisHomeworkHub.now();
            }
            catch (_) { } // цифра = «Сделать сейчас», как на экране «Домашка»
            hwBtn.hidden = !list.length || state.role === 'teacher' || document.body.classList.contains('teacher-access');
            document.body.classList.toggle('has-hw', !hwBtn.hidden); // у преподавателя — «Работы учеников», а не ученическая «Домашка»
            const badge = hwBtn.querySelector('.hw-badge');
            badge.hidden = !todo;
            badge.textContent = todo;
            hwBtn.setAttribute('aria-label', 'Домашнее задание' + (todo ? ': не сделано ' + todo : ''));
            hwBtn.classList.toggle('active', screen === 'homework' || (screen === 'lesson' && (list.some(x => x.sec.id === currentSection) || /-hw-/.test(currentSection || ''))));
        }
        window.irisHomeworkList = homeworkList;
        hwBtn.addEventListener('click', () => {
            if (window.irisHomeworkHub) {
                window.irisHomeworkHub.open();
                refreshHomeworkNav();
                return;
            }
            const list = homeworkList();
            const pick = list.find(x => !x.sent) || list[0];
            if (pick)
                openLesson(pick.m.id, pick.sec.id);
            else
                notify('Пока нет домашнего задания.');
            refreshHomeworkNav();
        });
        updateChrome = (base => function (...a) { const r = base.apply(this, a); try {
            refreshHomeworkNav();
        }
        catch (_) { } return r; })(updateChrome);
        document.addEventListener('click', e => { if (e.target.closest('[data-send-answers], #modal-confirm'))
            setTimeout(() => { try {
                refreshHomeworkNav();
            }
            catch (_) { } }, 400); });
        // Библиотека преподавателя: вкладки «Мои ученики» и «Онлайн-школа»
        const groupOf = id => { var _a; return ((_a = DATA.find(d => { var _a; return d.id === (((_a = DATA.find(x => x.id === id)) === null || _a === void 0 ? void 0 : _a.owner) || id); })) === null || _a === void 0 ? void 0 : _a.group) || 'mine'; };
        renderLibrary = (base => function (...a) {
            const r = base.apply(this, a);
            try {
                if (state.role !== 'teacher' || !DATA.some(d => d.group === 'school'))
                    return r;
                const grid = $('#screen-library .lesson-grid');
                if (!grid)
                    return r;
                let tab = 'mine';
                try {
                    tab = localStorage.getItem('iris-lib-tab') || 'mine';
                }
                catch (_) { }
                const bar = document.createElement('div');
                bar.className = 'lib-tabs';
                bar.setAttribute('role', 'tablist');
                bar.innerHTML = [['mine', 'Мои ученики'], ['school', 'Онлайн-школа']].map(([k, t]) => '<button type="button" role="tab" data-lib-tab="' + k + '" aria-selected="' + (k === tab) + '">' + t + ' <span>' + $$('[data-open]', grid).filter(c => groupOf(c.dataset.open) === k).length + '</span></button>').join('');
                grid.before(bar);
                const apply = t => { $$('.material-card', grid).forEach(card => { const b = card.querySelector('[data-open]'); card.hidden = !!b && groupOf(b.dataset.open) !== t; }); $$('[data-lib-tab]', bar).forEach(b => b.setAttribute('aria-selected', String(b.dataset.libTab === t))); };
                bar.addEventListener('click', e => { const b = e.target.closest('[data-lib-tab]'); if (!b)
                    return; try {
                    localStorage.setItem('iris-lib-tab', b.dataset.libTab);
                }
                catch (_) { } apply(b.dataset.libTab); });
                apply(tab);
            }
            catch (_) { }
            return r;
        })(renderLibrary);
        // English File: номер урока (1A, 1B…), строка G · V · P, разделы с номером и навыком
        const SKILL = { 'Warm-up': 'SPEAKING', 'Before the lesson': 'BEFORE THE LESSON', 'Words': 'VOCABULARY', 'Vocabulary': 'VOCABULARY', 'Vocabulary & Speaking': 'VOCABULARY & SPEAKING', 'Helpful phrases': 'VOCABULARY',
            'Reading': 'READING', 'Чтение': 'READING', 'Video': 'LISTENING', 'Grammar': 'GRAMMAR', 'Practice': 'PRACTICE', 'Практика': 'PRACTICE', 'Pronunciation': 'PRONUNCIATION', 'Numbers': 'VOCABULARY',
            'Speaking': 'SPEAKING', 'Discussion': 'SPEAKING', 'Debate': 'SPEAKING', 'Your story': 'SPEAKING', 'This or that': 'SPEAKING', 'Create': 'SPEAKING', 'Quiz': 'READING', 'Verb race': 'GRAMMAR', 'Error Detective': 'GRAMMAR',
            'Communication': 'COMMUNICATION', 'Games': 'GAMES · REVIEW', 'Writing': 'WRITING', 'Feedback': 'CAN YOU…?', 'Feedback & Homework': 'CAN YOU…?', 'Homework': 'HOMEWORK', 'Домашнее задание': 'HOMEWORK', 'Grammar Bank': 'GRAMMAR BANK', 'More practice': 'GRAMMAR BANK', 'Homework: words': 'HOMEWORK · WORDS', 'Homework: platform & words': 'HOMEWORK · PLATFORM & WORDS', 'Homework: grammar': 'HOMEWORK · GRAMMAR' };
        const UNNUMBERED = /^(BEFORE THE LESSON|CAN YOU…\?|HOMEWORK.*|GRAMMAR BANK)$/;
        // Цвет этапа по типу (слова, грамматика, аудирование…) и части этапа (a, b, c / подзаголовки) в отдельных рамках
        function skillKind(skill) {
            if (/HOMEWORK|BEFORE THE LESSON/.test(skill))
                return 'hw';
            if (/CAN YOU/.test(skill))
                return 'check';
            if (/GAMES/.test(skill))
                return 'game';
            if (/VOCABULARY/.test(skill))
                return 'voc';
            if (/GRAMMAR|PRACTICE|ACCURACY/.test(skill))
                return 'gram';
            if (/LISTENING/.test(skill))
                return 'lis';
            if (/READING/.test(skill))
                return 'read';
            if (/PRONUNCIATION/.test(skill))
                return 'pron';
            if (/WRITING/.test(skill))
                return 'write';
            return 'speak';
        }
        function partition(sec) {
            if (sec.querySelector(':scope > .part'))
                return;
            const kids = [...sec.children].filter(el => !el.classList.contains('step-head'));
            const isMark = el => el.matches('.rubric, h3');
            if (kids.filter(isMark).length < 2)
                return; // one block — nothing to split
            let part = null, n = 0;
            kids.forEach(el => {
                if (isMark(el)) {
                    part = document.createElement('div');
                    part.className = 'part';
                    part.dataset.part = String(++n);
                    el.before(part);
                }
                if (part)
                    part.appendChild(el);
            });
        }
        function lessonCode(m) {
            if (m.code)
                return m.code;
            const own = DATA.filter(d => d.owner === m.owner).slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
            const i = Math.max(0, own.findIndex(d => d.id === m.id));
            return (Math.floor(i / 3) + 1) + 'ABC'[i % 3];
        }
        $$('#lesson-panels > .pane').forEach(pane => {
            var _a;
            const m = DATA.find(d => d.id === pane.id);
            const hero = pane.querySelector(':scope > .hero .hero-inner');
            if (m && hero && !hero.querySelector('.ef-code')) {
                const h1 = hero.querySelector('h1');
                if (h1)
                    h1.insertAdjacentHTML('afterbegin', '<span class="ef-code">' + esc(lessonCode(m)) + '</span>');
                const g = m.gvp || { g: m.grammar, v: m.category };
                const strip = [['G', g.g], ['V', g.v], ['P', g.p]].filter(x => x[1]).map(([k, v]) => '<span class="ef-' + k.toLowerCase() + '"><b>' + k + '</b>' + esc(v) + '</span>').join('');
                if (strip)
                    (_a = (hero.querySelector('.lead') || h1)) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforebegin', '<div class="ef-gvp">' + strip + '</div>');
            }
            let n = 0;
            $$('section.step', pane).forEach(sec => {
                const h = sec.querySelector('.step-head h2');
                if (!h || h.querySelector('.ef-skill'))
                    return;
                const skill = SKILL[sec.dataset.label] || (sec.dataset.label || '').toUpperCase();
                const numbered = !UNNUMBERED.test(skill);
                const ico = h.querySelector('.stage-ico');
                if (ico)
                    ico.remove();
                let focus = h.textContent.trim();
                const pre = focus.match(/^([^:]{2,30}):\s*(.+)$/);
                if (pre)
                    focus = pre[2];
                if (focus.toUpperCase() === skill)
                    focus = '';
                h.innerHTML = (numbered ? '<span class="ef-num">' + (++n) + '</span>' : '') + '<span class="ef-skill">' + esc(skill) + '</span>' + (focus ? '<span class="ef-focus">' + esc(focus) + '</span>' : '');
                if (ico)
                    sec.querySelector('.step-head').insertAdjacentElement('afterbegin', ico);
                sec.dataset.skill = skillKind(skill);
                partition(sec);
            });
        });
        // 5. Картинки: обложка урока, иконки этапов, картинки на карточках слов
        $$('#lesson-panels > .pane').forEach(pane => {
            var _a;
            const hero = pane.querySelector(':scope > .hero .hero-inner');
            const pics = (_a = ART.map.heroes) === null || _a === void 0 ? void 0 : _a[pane.id];
            if (hero && pics)
                hero.insertAdjacentHTML('afterbegin', '<div class="hero-art" aria-hidden="true">' + pics.map((n, i) => artImg(n, 'hero-img h' + i)).join('') + '</div>');
            $$('section.step', pane).forEach(sec => { var _a; const n = (_a = ART.map.stages) === null || _a === void 0 ? void 0 : _a[sec.dataset.label]; const head = sec.querySelector('.step-head'); if (n && head && !sec.querySelector('.stage-ico')) {
                const mins = head.querySelector('.mins');
                mins ? mins.insertAdjacentHTML('beforebegin', artImg(n, 'stage-ico')) : head.insertAdjacentHTML('beforeend', artImg(n, 'stage-ico'));
            } });
            $$('.talk > b', pane).forEach(b => { if (!b.querySelector('.talk-ico'))
                b.insertAdjacentHTML('afterbegin', artImg('speech-balloon', 'talk-ico')); });
            $$('.aims > b', pane).forEach(b => { if (!b.querySelector('.talk-ico'))
                b.insertAdjacentHTML('afterbegin', artImg('bullseye', 'talk-ico')); });
            $$('.flip-front', pane).forEach(f => { var _a; const n = (_a = ART.map.cards) === null || _a === void 0 ? void 0 : _a[f.textContent.trim()]; if (n && !f.querySelector('.card-img'))
                f.insertAdjacentHTML('afterbegin', artImg(n, 'card-img')); });
            $$('select.gap', pane).forEach(enhanceSelect);
            $$('.order-words', pane).forEach(enhanceOrder);
        });
        // Новый урок (с самой свежей датой) один раз становится «текущим» в кабинете
        renderHome = (base => function (...a) {
            try {
                const newest = DATA.filter(d => d.owner === state.profile && d.date && d.kind !== 'homework').sort((x, y) => y.date.localeCompare(x.date))[0];
                const p = profile();
                if (newest) {
                    p.seen = p.seen && typeof p.seen === 'object' ? p.seen : {};
                    if (!p.seen[newest.id]) {
                        p.seen[newest.id] = 1;
                        p.lastLesson = newest.id;
                        save();
                    }
                }
            }
            catch (_) { }
            return base.apply(this, a);
        })(renderHome);
        // 📘 Таблица неправильных глаголов — для всех: поиск, группы, «Проверь себя», 🔊
        const verbs = document.getElementById('irregular-verbs');
        if (verbs) {
            const vrows = $$('tbody tr', verbs);
            let vkind = 'all', vback = null;
            const vapply = () => {
                const q = ($('#verbs-search').value || '').trim().toLowerCase();
                let n = 0;
                vrows.forEach(r => { const ok = (!q || r.dataset.text.includes(q)) && (vkind === 'all' || r.dataset.kind === vkind); r.hidden = !ok; if (ok)
                    n++; });
                $('#verbs-count').textContent = n;
            };
            const vopen = () => { vback = document.activeElement; verbs.hidden = false; document.body.classList.add('verbs-open'); $('.verbs-close', verbs).focus({ preventScroll: true }); };
            const vclose = () => { var _a; verbs.hidden = true; document.body.classList.remove('verbs-open'); (_a = vback === null || vback === void 0 ? void 0 : vback.focus) === null || _a === void 0 ? void 0 : _a.call(vback, { preventScroll: true }); };
            $('#verbs-search').addEventListener('input', vapply);
            document.addEventListener('click', e => {
                if (e.target.closest('[data-open-verbs]')) {
                    e.preventDefault();
                    vopen();
                    return;
                }
                if (verbs.hidden)
                    return;
                if (e.target.closest('[data-close-verbs]') || e.target === verbs) {
                    vclose();
                    return;
                }
                const chip = e.target.closest('[data-verbs-kind]');
                if (chip) {
                    vkind = chip.dataset.verbsKind;
                    $$('[data-verbs-kind]', verbs).forEach(b => b.classList.toggle('on', b === chip));
                    vapply();
                    return;
                }
                const cell = e.target.closest('.verbs-quiz td.vq');
                if (cell)
                    cell.classList.toggle('shown');
            });
            $('[data-verbs-quiz]', verbs).addEventListener('change', e => { verbs.classList.toggle('verbs-quiz', e.target.checked); $$('td.vq.shown', verbs).forEach(c => c.classList.remove('shown')); });
            document.addEventListener('keydown', e => { if (e.key === 'Escape' && !verbs.hidden)
                vclose(); });
            renderWords = (base => function (...a) { const r = base.apply(this, a); const t = $('#screen-words .vocab-tools'); if (t && !t.querySelector('[data-open-verbs]'))
                t.insertAdjacentHTML('beforeend', '<button class="ui-btn outline" type="button" data-open-verbs>📘 Неправильные глаголы</button>'); return r; })(renderWords);
            renderHome = (base => function (...a) { const r = base.apply(this, a); const h = $('#screen-home .home-intro'); if (h && !h.querySelector('[data-open-verbs]'))
                h.insertAdjacentHTML('beforeend', '<button class="ui-btn soft verbs-home-btn" type="button" data-open-verbs>📘 Таблица неправильных глаголов</button>'); return r; })(renderHome);
        }
        // 📱 На телефоне и планшете слово выделяется от случайного долгого касания — и сразу всплывал перевод, мешая отвечать.
        // Теперь при касании появляется маленькая кнопка «🔍 Перевести»: перевод открывается, только если её нажать.
        let lastPointer = 'mouse', chip = null;
        document.addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; if (chip && !e.target.closest('.lookup-chip'))
            hideChip(); }, true);
        function hideChip() { if (chip) {
            chip.remove();
            chip = null;
        } }
        window.addEventListener('scroll', hideChip, true);
        document.addEventListener('selectionchange', () => { const sel = window.getSelection(); if (chip && (!sel || sel.isCollapsed))
            setTimeout(() => { const s2 = window.getSelection(); if (!s2 || s2.isCollapsed)
                hideChip(); }, 300); });
        inspectSelection = (base => function (...a) {
            if (lastPointer === 'mouse')
                return base.apply(this, a);
            const real = showLookup;
            let args = null;
            showLookup = (...x) => { args = x; };
            try {
                base.apply(this, a);
            }
            finally {
                showLookup = real;
            }
            if (!args)
                return;
            hideChip();
            const rect = args[1] || { left: window.innerWidth / 2, bottom: 120 };
            chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'lookup-chip';
            chip.textContent = '🔍 Перевести';
            chip.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 140)) + 'px';
            chip.style.top = Math.min(rect.bottom + 8, window.innerHeight - 56) + 'px';
            chip.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const x = args; hideChip(); showLookup(...x); });
            document.body.appendChild(chip);
        })(inspectSelection);
        // 👩‍🏫 Преподаватель наводит мышку на поле — видит правильный ответ (ученикам подсказка не показывается)
        const tip = document.createElement('div');
        tip.className = 'answer-tip';
        tip.hidden = true;
        tip.setAttribute('role', 'tooltip');
        document.body.appendChild(tip);
        const isTeacher = () => document.body.classList.contains('teacher-access');
        function answerOf(el) {
            const f = el.closest('.gap[data-a]');
            if (f)
                return f.dataset.a.split('|').filter(Boolean);
            const mc = el.closest('.mc');
            if (mc) {
                const ok = mc.querySelector('.opt[data-ok]');
                return ok ? [ok.textContent.trim()] : null;
            }
            const ow = el.closest('.order-words');
            if (ow) {
                const inp = ow.nextElementSibling;
                return inp && inp.dataset.a ? inp.dataset.a.split('|') : null;
            }
            return null;
        }
        let tipQueued = null;
        document.addEventListener('mousemove', e => { if (tipQueued)
            return; tipQueued = requestAnimationFrame(() => { tipQueued = null; showTip(e); }); });
        function showTip(e) {
            if (!isTeacher() || !e.target.closest || !e.target.closest('.pane')) {
                tip.hidden = true;
                return;
            }
            const a = answerOf(e.target);
            if (!a || !a.length) {
                tip.hidden = true;
                return;
            }
            tip.innerHTML = '<b>✓ Ответ:</b> ' + a.slice(0, 4).map(esc).join(' <span>·</span> ');
            tip.hidden = false;
            const r = (e.target.closest('.gap, .mc, .order-words') || e.target).getBoundingClientRect();
            tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - tip.offsetWidth - 8)) + 'px';
            tip.style.top = (r.top > tip.offsetHeight + 12 ? r.top - tip.offsetHeight - 6 : r.bottom + 6) + 'px';
        }
        document.addEventListener('mouseover', showTip);
        window.addEventListener('scroll', () => { tip.hidden = true; }, true);
        // ❓ Помощь: кнопка в шапке с понятной инструкцией + короткие подсказки при первом открытии урока, домашки и словаря
        const HELP = [
            ['📖', 'Как проходить урок', 'Урок разбит на этапы — они идут по порядку и выделены цветом. Переход: стрелки <b>←</b> <b>→</b> вверху или список этапов. Выполните задание и нажмите <b>«Проверить»</b>: верные ответы станут зелёными, неверные — красными. Не получается — <b>«Показать ответ»</b>.'],
            ['💾', 'Ответы сохраняются сами', 'Всё, что вы пишете и выбираете, сохраняется автоматически и приходит преподавателю. Ничего скачивать не нужно. Можно закрыть страницу и вернуться позже — ответы останутся.'],
            ['📝', 'Домашнее задание', 'Нажмите <b>«Домашка»</b> внизу (на компьютере — слева). Выполните части по порядку, в конце нажмите <b>«Отправить преподавателю»</b>. Преподаватель пришлёт разбор — он появится у вас в кабинете.'],
            ['🔍', 'Перевод слов', 'Выделите слово в тексте (на телефоне — подержите палец на слове и нажмите появившуюся кнопку <b>«🔍 Перевести»</b>). Можно сохранить слово в <b>«Мой словарь»</b>. Русское слово тоже можно выделить или вписать — платформа подскажет английское.'],
            ['📚', 'Мой словарь и повторение', 'В «Моём словаре» — сохранённые слова. Кнопка <b>«Повторить слова»</b> показывает карточки: вспомните перевод, потом проверьте себя. Там же — таблица неправильных глаголов 📘.'],
            ['🎧', 'Аудио', '<b>▶ Слушать</b> — включить запись, <b>🐢</b> — медленнее, <b>📄</b> — показать текст (лучше после первого прослушивания). На уроке с преподавателем может быть режим <b>«Слушаем вместе»</b> — тогда запись включает преподаватель.'],
            ['🎮', 'Игры', 'В конце урока — игры со словами: «Найди пару», «60 секунд», «Услышь и напиши» и «Детектив». Лучший результат сохраняется и виден преподавателю.'],
            ['👥', 'Урок с преподавателем онлайн', 'Откройте ссылку на урок, которую прислал преподаватель. Вверху появится полоска «Преподаватель на уроке» — вы видите одно и то же, а ваши ответы видит только преподаватель.'],
            ['🔑', 'Не получается войти', 'Откройте свою личную ссылку из сообщения преподавателя — в <b>Chrome</b> или <b>Safari</b>, а не внутри мессенджера. На планшете можно навести камеру на QR-код от преподавателя. Если пишет, что браузер устарел, — обновите его.']
        ];
        const helpBtn = document.createElement('button');
        helpBtn.type = 'button';
        helpBtn.className = 'help-btn';
        helpBtn.setAttribute('aria-label', 'Помощь');
        helpBtn.innerHTML = '❓ <span>Помощь</span>';
        (_d = $('.app-header .profile-control')) === null || _d === void 0 ? void 0 : _d.before(helpBtn);
        const helpBtnM = helpBtn.cloneNode(true);
        helpBtnM.classList.add('help-btn-mobile');
        (_e = $('.app-sidebar .mobile-me')) === null || _e === void 0 ? void 0 : _e.before(helpBtnM); // шапка на телефоне
        const helpBox = document.createElement('div');
        helpBox.className = 'help-sheet';
        helpBox.hidden = true;
        helpBox.setAttribute('role', 'dialog');
        helpBox.setAttribute('aria-label', 'Помощь');
        helpBox.innerHTML = '<div class="help-card"><div class="help-top"><b>❓ Помощь · как пользоваться платформой</b><button type="button" class="icon-btn help-close" aria-label="Закрыть">✕</button></div>'
            + HELP.map(([i, t, b], k) => '<details' + (k === 0 ? ' open' : '') + '><summary>' + i + ' ' + t + '</summary><p>' + b + '</p></details>').join('')
            + '<p class="help-foot">Остался вопрос? Напишите преподавателю — или задайте его в поле «Можно по-русски» в конце урока.</p></div>';
        document.body.appendChild(helpBox);
        const openHelp = () => { helpBox.hidden = false; helpBox.querySelector('.help-close').focus({ preventScroll: true }); };
        helpBtn.addEventListener('click', openHelp);
        helpBtnM.addEventListener('click', openHelp);
        helpBox.addEventListener('click', e => { if (e.target === helpBox || e.target.closest('.help-close'))
            helpBox.hidden = true; if (e.target.closest('[data-help-open]'))
            openHelp(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !helpBox.hidden)
            helpBox.hidden = true; });
        document.addEventListener('click', e => { if (e.target.closest('[data-help-open]')) {
            e.preventDefault();
            openHelp();
        } });
        // короткие подсказки — один раз на устройстве
        const seenHints = (() => { try {
            return JSON.parse(localStorage.getItem('iris-hints') || '{}');
        }
        catch (_) {
            return {};
        } })();
        const HINTS = {
            lesson: '💡 <b>Как работать:</b> выполняйте задания по порядку и нажимайте «Проверить». Ответы сохраняются сами и приходят преподавателю. Незнакомое слово — выделите его, чтобы перевести.',
            hw: '💡 <b>Домашка:</b> части задания — кнопки вверху (или «Далее» внизу), «← Вся домашка» — список всех заданий. В конце нажмите «Отправить преподавателю».',
            words: '💡 <b>Мой словарь:</b> здесь ваши сохранённые слова. Нажмите «Повторить слова», чтобы потренироваться.'
        };
        // подсказка — полоса в начале экрана урока или словаря, вне этапов: разметка этапов у ученика и преподавателя должна совпадать (указка на живом уроке)
        function hintFor(kind, host) {
            if (!host || seenHints[kind] || state.role === 'teacher')
                return;
            const cur = host.querySelector(':scope > .first-hint');
            if (cur && cur.dataset.hint === kind)
                return;
            cur === null || cur === void 0 ? void 0 : cur.remove();
            host.insertAdjacentHTML('afterbegin', '<div class="first-hint" role="status" data-hint="' + kind + '"><span>' + HINTS[kind] + ' <a href="#" data-help-open>Подробнее</a></span><button type="button" aria-label="Понятно">Понятно</button></div>');
        }
        document.addEventListener('click', e => { const b = e.target.closest('.first-hint button'); if (!b)
            return; const h = b.closest('.first-hint'); seenHints[h.dataset.hint] = 1; try {
            localStorage.setItem('iris-hints', JSON.stringify(seenHints));
        }
        catch (_) { } $$('.first-hint[data-hint="' + h.dataset.hint + '"]').forEach(x => x.remove()); });
        function placeHints() {
            var _a;
            if (state.role === 'teacher' || !document.body.classList.contains('locked'))
                return;
            if (typeof live !== 'undefined' && live.active) {
                $$('.first-hint').forEach(h => h.remove());
                return;
            } // на живом уроке ведёт преподаватель — подсказки не нужны
            const lessonOn = !((_a = $('#screen-lesson')) === null || _a === void 0 ? void 0 : _a.hidden), sec = lessonOn && $$('.pane:not([hidden]) section.step').find(x => !x.hidden);
            const ws = $('#screen-words'), wordsOn = ws && !ws.hidden;
            if (sec)
                hintFor(/-hw-/.test(sec.id) ? 'hw' : 'lesson', $('#screen-lesson'));
            if (wordsOn)
                hintFor('words', ws);
        }
        window.addEventListener('hashchange', () => setTimeout(placeHints, 120));
        document.addEventListener('click', () => setTimeout(placeHints, 150));
        setTimeout(placeHints, 800);
        // 📚 Быстрый переход между уроками прямо из урока: «Ученик → урок» (у ученика — только его уроки)
        // у преподавателя уроки из учебника, прикреплённые ученику, стоят в его списке по дате, когда их прикрепили
        const lessonsOf = owner => {
            const at = typeof access !== 'undefined' && access.bookAt ? access.bookAt(owner) : {}, day = d => at[d.id] ? new Date(at[d.id]).toISOString().slice(0, 10) : (d.date || '0');
            return DATA.filter(d => d.owner === owner || (d.book && at[d.id])).map((d, i) => [d, i]).sort((a, b) => (day(a[0]) + a[1]).localeCompare(day(b[0]) + b[1])).map(x => x[0]);
        };
        window.irisLessonsOf = lessonsOf;
        // имя ученика для меню; одинаковые имена различаем: «Саша» и «Саша (B1)»
        function studentName(owner) {
            if (owner === 'book')
                return '📚 Учебник';
            const base = (lessonsOf(owner)[0] || {}).name || owner;
            const twins = [...new Set(DATA.map(d => d.owner))].filter(o => o !== owner && ((lessonsOf(o)[0] || {}).name || o) === base);
            return twins.length && owner.includes('-') ? base + ' (' + owner.split('-').slice(1).join(' ').toUpperCase() + ')' : base;
        }
        window.irisStudentName = studentName;
        // 📚 Библиотека преподавателя: уроки сгруппированы по ученикам, сверху — выбор ученика
        renderLibrary = (base => function (...a) {
            const r = base.apply(this, a);
            try {
                if (state.role !== 'teacher' && !document.body.classList.contains('teacher-access'))
                    return r;
                const grid = $('#screen-library .lesson-grid');
                if (!grid)
                    return r;
                const cardsBy = {};
                $$('.material-card', grid).forEach(c => { var _a; const id = (_a = c.querySelector('[data-open]')) === null || _a === void 0 ? void 0 : _a.dataset.open, d = DATA.find(x => x.id === id); const o = d ? d.owner : '_'; (cardsBy[o] = cardsBy[o] || []).push([c, id]); });
                const owners = [...new Set(DATA.map(d => d.owner))].filter(o => cardsBy[o]).sort((a, b) => (b === 'book') - (a === 'book')); // 📚 учебник — первым
                owners.concat(cardsBy._ ? ['_'] : []).forEach(o => {
                    const order = o === '_' ? [] : lessonsOf(o).map(d => d.id);
                    grid.insertAdjacentHTML('beforeend', '<h3 class="lib-owner" data-lib-owner="' + esc(o) + '">' + (o === '_' ? 'Мои материалы' : esc(studentName(o))) + ' <span>' + cardsBy[o].length + '</span></h3>');
                    cardsBy[o].sort((x, y) => order.indexOf(x[1]) - order.indexOf(y[1])).forEach(([c]) => { c.dataset.libOwner = o; grid.appendChild(c); });
                });
                const bar = document.createElement('div');
                bar.className = 'lib-filter';
                bar.innerHTML = '<button type="button" data-lib-pick="" aria-pressed="true">Все ученики</button>' + owners.map(o => '<button type="button" data-lib-pick="' + esc(o) + '" aria-pressed="false">' + esc(studentName(o)) + '</button>').join('');
                grid.before(bar);
                const pick = o => { $$('[data-lib-owner]', grid).forEach(x => { x.hidden = !!o && x.dataset.libOwner !== o; }); $$('[data-lib-pick]', bar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.libPick === o))); try {
                    localStorage.setItem('iris-lib-pick', o);
                }
                catch (_) { } };
                bar.addEventListener('click', e => { const b = e.target.closest('[data-lib-pick]'); if (b)
                    pick(b.dataset.libPick); });
                let saved = '';
                try {
                    saved = localStorage.getItem('iris-lib-pick') || '';
                }
                catch (_) { }
                pick(owners.includes(saved) ? saved : '');
            }
            catch (_) { }
            return r;
        })(renderLibrary);
        function lessonSwitch() {
            var _a;
            const host = $('#screen-lesson');
            if (!host || !currentLesson)
                return;
            const teacher = state.role === 'teacher' || document.body.classList.contains('teacher-access'), owners = [...new Set(DATA.filter(d => teacher || d.owner === state.profile).map(d => d.owner))];
            const total = owners.reduce((n, o) => n + lessonsOf(o).length, 0);
            let box = $('#lesson-switch-box');
            if (!box) {
                box = document.createElement('div');
                box.id = 'lesson-switch-box';
                box.className = 'lesson-switch';
                host.prepend(box);
            }
            box.hidden = total < 2;
            if (total < 2)
                return;
            const sig = teacher + '|' + owners.join() + '|' + total;
            if (box.dataset.sig !== sig) {
                box.dataset.sig = sig;
                const opt = (d, i, ls) => '<option value="' + esc(d.id) + '">' + (d.kind === 'homework' ? 'Домашка · ' : 'Урок ' + (ls.filter(x => x.kind !== 'homework').indexOf(d) + 1) + ' · ') + esc(d.title) + (d.draft ? ' · новый' : '') + '</option>';
                box.innerHTML = '<label for="lesson-switch">' + (teacher ? '📚 Ученик и урок' : '📚 Мои уроки') + '</label><select id="lesson-switch" aria-label="Перейти к другому уроку">'
                    + owners.map(o => { const ls = lessonsOf(o); return teacher ? '<optgroup label="' + esc(studentName(o)) + '">' + ls.map(opt).join('') + '</optgroup>' : ls.map(opt).join(''); }).join('') + '</select>';
                box.querySelector('select').addEventListener('change', e => { const id = e.target.value; if (id && id !== currentLesson)
                    openLesson(id); });
                if (teacher && window.irisLessonPicker) { // преподаватель: вместо длинного списка — окно выбора «ученик → урок» с поиском
                    box.classList.add('picker-mode');
                    box.querySelector('label').hidden = true;
                    box.querySelector('select').hidden = true;
                    box.insertAdjacentHTML('afterbegin', '<button type="button" class="lesson-pick-btn" data-lesson-pick><span class="lp-ico">📚</span><span class="lp-now"></span><span class="lp-change">Сменить урок ▾</span></button>');
                }
            }
            box.querySelector('select').value = currentLesson;
            const now = box.querySelector('.lp-now');
            if (now) {
                const d = DATA.find(x => x.id === currentLesson), o = d && (((_a = lessonMeta(d.id)) === null || _a === void 0 ? void 0 : _a.owner) || d.owner), ls = d ? lessonsOf(o).filter(x => x.kind !== 'homework') : [];
                now.innerHTML = d ? '<b>' + esc(studentName(o)) + '</b> · ' + (d.kind === 'homework' ? 'домашка' : 'урок ' + (ls.indexOf(d) + 1)) + ' · ' + esc(d.title) : '';
            }
        }
        showSection = (base => function (...a) { const r = base.apply(this, a); try {
            lessonSwitch();
        }
        catch (_) { } return r; })(showSection);
        // 🧭 «Знакомство с платформой»: шаги отмечаются сами, когда ученик действительно что-то сделал
        const TOUR = [['say', 3, '🔊 Послушать 3 слова', 'В уроке нажмите 🔊 рядом с тремя словами или фразами.'],
            ['add', 3, '➕ Добавить 3 слова в «Мой словарь»', 'На карточке слова нажмите «+ В мой словарь» — или выделите любое слово в тексте и сохраните его.'],
            ['review', 1, '🔁 Повторить слова', 'Откройте «Мой словарь» и нажмите «Повторить» — пройдите хотя бы одну карточку.'],
            ['ru', 1, '🇷🇺→🇬🇧 Найти английское слово по-русски', 'Напишите русское слово в поле ниже (или выделите русское слово в тексте) — платформа подскажет английское.'],
            ['verbs', 1, '📘 Открыть таблицу неправильных глаголов', 'Кнопка на главной и в «Моём словаре». Найдите в ней <i>go</i> и <i>meet</i>.'],
            ['match', 1, '🎮 Сыграть в «Найди пару»', 'Последний раздел урока — «Games». Соберите все пары.']];
        function tourData() { try {
            const p = profile();
            p.tour = p.tour && typeof p.tour === 'object' ? p.tour : {};
            return p.tour;
        }
        catch (_) {
            return {};
        } }
        function tourMark(step) {
            if (state.role === 'teacher')
                return;
            const t = tourData(), need = (TOUR.find(x => x[0] === step) || [])[1] || 1;
            if ((t[step] || 0) >= need)
                return;
            t[step] = (t[step] || 0) + 1;
            save();
            paintTours();
            if (t[step] === need)
                notify('🧭 Шаг выполнен: ' + TOUR.find(x => x[0] === step)[2].replace(/^\S+\s/, ''));
        }
        function paintTours() {
            const t = tourData();
            let done = 0;
            TOUR.forEach(([k, n]) => { if ((t[k] || 0) >= n)
                done++; });
            $$('.tour').forEach(box => {
                TOUR.forEach(([k, n]) => { const li = box.querySelector('[data-tour-step="' + k + '"]'); if (!li)
                    return; const c = Math.min(t[k] || 0, n), ok = c >= n; li.classList.toggle('done', ok); const m = li.querySelector('.tour-count'); if (m)
                    m.textContent = ok ? '✓' : (n > 1 ? c + ' / ' + n : ''); });
                box.querySelector('.tour-progress b').textContent = done;
                box.querySelector('.tour-bar span').style.width = Math.round(done / TOUR.length * 100) + '%';
                box.classList.toggle('complete', done === TOUR.length);
                const f = box.querySelector('.tour-field'), v = 'Знакомство с платформой: ' + done + ' из ' + TOUR.length + ' шагов' + (done ? ' (' + TOUR.filter(([k, n]) => (t[k] || 0) >= n).map(x => x[2].replace(/^\S+\s/, '')).join('; ') + ')' : '');
                if (f && done && f.value !== v && state.role !== 'teacher') {
                    f.value = v;
                    f.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
        document.addEventListener('click', e => {
            var _a;
            if (e.target.closest('.say, .lis-line'))
                tourMark('say');
            if (e.target.closest('[data-open-verbs]'))
                tourMark('verbs');
            const go = e.target.closest('[data-tour-go]');
            if (go) {
                e.preventDefault();
                (_a = $('.app-nav button[data-screen="' + go.dataset.tourGo + '"]')) === null || _a === void 0 ? void 0 : _a.click();
                if (go.dataset.tourGo === 'words')
                    window.scrollTo(0, 0);
            }
        }, true);
        document.addEventListener('submit', e => {
            const f = e.target.closest('.tour-ru');
            if (!f)
                return;
            e.preventDefault();
            const ru = (f.querySelector('input').value || '').trim();
            if (!/[А-Яа-яЁё]/.test(ru)) {
                notify('Напишите слово по-русски, например «выходной».');
                return;
            }
            showLookup(ru, f.getBoundingClientRect());
        });
        addWord = (base => function (...a) { const r = base.apply(this, a); if (r)
            tourMark('add'); return r; })(addWord);
        renderReview = (base => function (...a) { if (review && profile().words.length)
            tourMark('review'); return base.apply(this, a); })(renderReview);
        window.addEventListener('hashchange', () => setTimeout(paintTours, 50));
        setTimeout(paintTours, 300);
        // Онлайн-перевод (MyMemory) иногда отдаёт мусор: латиницу вместо русского, символы, чужой язык. Берём только нормальный перевод.
        function irisGoodTranslation(t, to) {
            t = String(t || '').trim();
            if (!t || t.length > 300 || /MYMEMORY|QUOTA|INVALID|PLEASE SELECT|https?:|www\.|[<>{}\[\]\\|@#$%^*_=~`]/i.test(t))
                return false;
            if (/[\u0000-\u001f\u007f-\u009f�]/.test(t) || /(.)\1{4,}/.test(t))
                return false;
            const letters = (t.match(/\p{L}/gu) || []).length;
            if (letters < Math.max(1, t.replace(/\s/g, '').length * 0.6))
                return false;
            if (to === 'ru')
                return /[а-яё]/i.test(t) && (t.match(/[a-z]/gi) || []).length <= (t.match(/[а-яё]/gi) || []).length / 3 && !/[^\s\p{Script=Cyrillic}a-z0-9.,;:!?()«»"'’\-–—\/]/iu.test(t);
            return /[a-z]/i.test(t) && !/[а-яё]/i.test(t) && !/[^\sa-z0-9.,;:!?()"'’\-–—\/]/i.test(t);
        }
        function irisPickTranslation(data, to) {
            var _a;
            const dec = s => { const d = document.createElement('textarea'); d.innerHTML = String(s || ''); return d.value.trim(); };
            const mt = (Array.isArray(data === null || data === void 0 ? void 0 : data.matches) ? data.matches : []).find(m => /MT!/.test(String(m['created-by'] || '')) && irisGoodTranslation(dec(m.translation), to));
            if (mt)
                return dec(mt.translation); // машинный перевод надёжнее «памяти переводов», где бывает мусор
            const main = dec((_a = data === null || data === void 0 ? void 0 : data.responseData) === null || _a === void 0 ? void 0 : _a.translatedText);
            if (irisGoodTranslation(main, to))
                return main;
            const alt = (Array.isArray(data === null || data === void 0 ? void 0 : data.matches) ? data.matches : []).map(m => ({ t: dec(m.translation), q: Number(m.quality) || 0, m: Number(m.match) || 0 })).filter(x => irisGoodTranslation(x.t, to)).sort((a, b) => (b.m - a.m) || (b.q - a.q))[0];
            return alt ? alt.t : '';
        }
        window.irisGoodTranslation = irisGoodTranslation;
        window.irisPickTranslation = irisPickTranslation;
        window.irisLookup = text => showLookup(text);
        // старые сохранённые онлайн-переводы могли быть мусором («guess» → «Марколин») — забываем их один раз
        try {
            if (!state.trV3) {
                state.translations = {};
                state.trV2 = state.trV3 = 1;
                save();
            }
        }
        catch (_) { } // переводы, сохранённые до нового переводчика, — забываем один раз
        // 📖 Словарь платформы: 3000+ частых слов с проверенным переводом — раньше онлайн-перевода; формы слов приводятся к начальной
        let CORE = {};
        try {
            CORE = JSON.parse(((_f = document.getElementById('core-dict')) === null || _f === void 0 ? void 0 : _f.textContent) || '{}');
        }
        catch (_) { }
        function coreLookup(en) {
            const k = lookupKey(en).replace(/[.!?,;:]+$/, '').replace(/^(a |an |the |to )/, '');
            if (!k)
                return null;
            const tries = [k];
            if (/ies$/.test(k))
                tries.push(k.slice(0, -3) + 'y');
            if (/ied$/.test(k))
                tries.push(k.slice(0, -3) + 'y');
            if (/es$/.test(k))
                tries.push(k.slice(0, -2));
            if (/s$/.test(k))
                tries.push(k.slice(0, -1));
            if (/ed$/.test(k))
                tries.push(k.slice(0, -2), k.slice(0, -1), k.slice(0, -3));
            if (/ing$/.test(k))
                tries.push(k.slice(0, -3), k.slice(0, -3) + 'e', k.slice(0, -4));
            if (/(er|est)$/.test(k))
                tries.push(k.replace(/(er|est)$/, ''), k.replace(/(er|est)$/, 'e'), k.replace(/i(er|est)$/, 'y'));
            if (/ly$/.test(k))
                tries.push(k.slice(0, -2), k.replace(/ily$/, 'y'));
            const hit = tries.find(t => t && CORE[t]);
            if (!hit)
                return null;
            return { ru: CORE[hit] + (hit !== k ? ' (' + hit + ')' : ''), source: 'Словарь платформы · проверенный перевод' };
        }
        lookupLocal = (base => function (en) {
            const r = base(en);
            if (r && !/^Онлайн/.test(r.source || ''))
                return r;
            const k = lookupKey(en).replace(/[.!?,;:]+$/, '').replace(/^(a |an |the |to )/, '');
            const v = vocabEntry(en);
            if (v)
                return { ru: v.ru, example: v.example, source: 'Словарь уроков · проверенный перевод' };
            if (CORE[k])
                return { ru: CORE[k], source: 'Словарь платформы · проверенный перевод' };
            return r; // форма слова (tickets, cooked…) → сначала онлайн-перевод целиком; начальная форма — запасной вариант
        })(lookupLocal);
        window.irisCoreLookup = coreLookup;
        // 📒 Добавление в «Мой словарь». Перевод слова из урока: словарь уроков (строка или {ru, example}; с a / an / the / to и без),
        // обратная сторона карточки, словарь платформы. Раньше кнопка на карточке сохраняла перевод «undefined» или молча ничего не делала.
        const stripTerm = t => String(t || '').toLowerCase().replace(/[.!?]+$/, '').replace(/^(a|an|the|to)\s+/, '').trim();
        function vocabEntry(term) {
            const t = String(term || '').trim(), keys = [t, t.toLowerCase(), stripTerm(t), stripTerm(t).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()];
            const ws = stripTerm(t).split(' '); // «to have a sweet tooth» → «a sweet tooth» → «sweet tooth»
            for (let i = 1; i < ws.length - 1; i++)
                keys.push(ws.slice(i).join(' '), stripTerm(ws.slice(i).join(' ')));
            for (const k of keys) {
                const v = VOCAB[k];
                if (v) {
                    const ru = typeof v === 'string' ? v : v.ru;
                    if (ru)
                        return { ru, example: typeof v === 'string' ? '' : (v.example || '') };
                }
            }
            return null;
        }
        function cardBack(term) {
            var _a, _b, _c;
            const k = lookupKey(term);
            const b = [...document.querySelectorAll('[data-flip-save]')].find(x => lookupKey(x.dataset.term || x.dataset.flipSave) === k);
            const back = (_a = b === null || b === void 0 ? void 0 : b.closest('.flip-wrap')) === null || _a === void 0 ? void 0 : _a.querySelector('.flip-back');
            const ru = (_b = back === null || back === void 0 ? void 0 : back.querySelector('.ru-line')) === null || _b === void 0 ? void 0 : _b.textContent.trim(), example = ((_c = back === null || back === void 0 ? void 0 : back.querySelector('i')) === null || _c === void 0 ? void 0 : _c.textContent.trim()) || '';
            return ru ? { ru, example } : null;
        }
        function knownTranslation(term) {
            const v = vocabEntry(term) || cardBack(term);
            if (v)
                return v;
            const c = coreLookup(term) || coreLookup(stripTerm(term));
            return c ? { ru: c.ru, example: '' } : null;
        }
        window.irisKnownTranslation = knownTranslation;
        const badRu = ru => !ru || /^(undefined|null)$/i.test(String(ru).trim());
        document.addEventListener('click', e => {
            var _a;
            const b = e.target.closest && e.target.closest('[data-flip-save]');
            if (!b)
                return;
            e.preventDefault();
            e.stopPropagation();
            const term = b.dataset.term || b.dataset.flipSave, t = knownTranslation(term);
            if (!t) {
                showLookup(term, b.getBoundingClientRect());
                return;
            } // перевода нет нигде — откроется окно перевода
            let title = '';
            try {
                title = ((_a = lessonMeta(currentLesson)) === null || _a === void 0 ? void 0 : _a.title) || '';
            }
            catch (_) { }
            if (addWord(term, t.ru, t.example, title))
                b.textContent = '✓ В словаре';
        }, true);
        // «Мой словарь» → «Добавить слово»: если перевод не вписали — подставим известный или откроем онлайн-перевод
        document.addEventListener('submit', e => {
            var _a;
            if (e.target.id !== 'add-word-form')
                return;
            const en = (((_a = document.getElementById('word-en')) === null || _a === void 0 ? void 0 : _a.value) || '').trim(), ruField = document.getElementById('word-ru');
            if (!en || !ruField || ruField.value.trim())
                return;
            const t = knownTranslation(en);
            if (t) {
                ruField.value = t.ru;
                const ex = document.getElementById('word-example');
                if (ex && !ex.value && t.example)
                    ex.value = t.example;
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            showLookup(en, ruField.getBoundingClientRect());
        }, true);
        // уже сохранённые слова с переводом «undefined» (старая ошибка карточек) — чиним
        function repairWords() {
            try {
                let fixed = 0;
                Object.values(state.profiles || {}).forEach(pr => (pr.words || []).forEach(w => {
                    if (!badRu(w.ru))
                        return;
                    const t = knownTranslation(w.en);
                    if (t) {
                        w.ru = t.ru;
                        if (!w.example && t.example)
                            w.example = t.example;
                        fixed++;
                    }
                }));
                if (fixed)
                    save();
            }
            catch (_) { }
        }
        repairWords();
        renderWords = (base => function (...a) {
            repairWords(); // и слова, пришедшие с другого устройства
            const r = base.apply(this, a);
            // перевод можно не вписывать: браузер больше не блокирует форму, перевод подставится или откроется переводчик
            const ru = document.getElementById('word-ru');
            if (ru) {
                ru.removeAttribute('required');
                ru.placeholder = 'перевод — можно оставить пустым';
            }
            return r;
        })(renderWords);
        async function gtxTranslate(q, sl, tl, signal) {
            const u = 'https://translate.googleapis.com/translate_a/single?' + new URLSearchParams({ client: 'gtx', sl, tl, dt: 't', q }) + '&dt=bd';
            const r = await fetch(u, { signal, credentials: 'omit' });
            if (!r.ok)
                throw Error('network');
            const d = await r.json(), main = (Array.isArray(d === null || d === void 0 ? void 0 : d[0]) ? d[0] : []).map(x => (Array.isArray(x) && typeof x[0] === 'string') ? x[0] : '').join('').trim();
            if (!irisGoodTranslation(main, tl))
                throw Error('invalid');
            const alts = [];
            (Array.isArray(d === null || d === void 0 ? void 0 : d[1]) ? d[1] : []).forEach(g => (Array.isArray(g === null || g === void 0 ? void 0 : g[1]) ? g[1] : []).slice(0, 3).forEach(t => { if (typeof t === 'string' && alts.length < 4 && t.toLowerCase() !== main.toLowerCase() && !alts.includes(t) && irisGoodTranslation(t, tl))
                alts.push(t); }));
            return { main, alts, by: 'Google' };
        }
        async function memTranslate(q, sl, tl, signal) {
            var _a;
            const r = await fetch('https://api.mymemory.translated.net/get?' + new URLSearchParams({ q, langpair: sl + '|' + tl }), { signal, credentials: 'omit' });
            if (!r.ok)
                throw Error('network');
            const data = await r.json();
            if (Number(data.responseStatus) !== 200 || data.quotaFinished || typeof ((_a = data.responseData) === null || _a === void 0 ? void 0 : _a.translatedText) !== 'string')
                throw Error('quota');
            const main = irisPickTranslation(data, tl);
            if (!main)
                throw Error('invalid');
            return { main, alts: [], by: 'MyMemory' };
        }
        async function translateOnline(q, sl, tl, signal) {
            try {
                return await gtxTranslate(q, sl, tl, signal);
            }
            catch (e) {
                if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                    throw e;
                return memTranslate(q, sl, tl, signal);
            }
        }
        window.irisTranslateOnline = translateOnline;
        const oneWord = t => !/\s/.test(String(t).trim());
        onlineTranslate = async function (en, token, force = false) {
            requestController === null || requestController === void 0 ? void 0 : requestController.abort();
            requestController = new AbortController();
            const ctl = requestController, tid = setTimeout(() => ctl.abort(), 7000);
            if (token !== popupSerial)
                return;
            $('#translation-source').textContent = 'Онлайн-перевод…';
            if (force)
                $('#translation-meaning').textContent = 'Ищу перевод…';
            try {
                const t = await translateOnline(en, 'en', 'ru', ctl.signal);
                if (token !== popupSerial)
                    return;
                const text = t.main + (t.alts.length && oneWord(en) ? '; ' + t.alts.join(', ') : '');
                $('#translation-meaning').textContent = text;
                $('#translation-source').textContent = 'Онлайн-перевод (' + t.by + ') · проверь значение в контексте';
                const input = $('#translation-edit');
                if (input && !input.value)
                    input.value = t.main;
                state.translations[lookupKey(en)] = text;
                if (Object.keys(state.translations).length > 300)
                    delete state.translations[Object.keys(state.translations)[0]];
                save();
            }
            catch (_) {
                if (token !== popupSerial)
                    return;
                const c = coreLookup(en); // переводчик недоступен — хотя бы начальная форма из словаря платформы
                if (c) {
                    $('#translation-meaning').textContent = c.ru;
                    $('#translation-source').textContent = 'Словарь платформы · начальная форма слова';
                    const input = $('#translation-edit');
                    if (input && !input.value)
                        input.value = c.ru.replace(/\s*\([^)]*\)\s*$/, '');
                }
                else {
                    $('#translation-meaning').textContent = 'Онлайн-перевод сейчас не отвечает. Впишите перевод сами — слово всё равно сохранится в словаре.';
                    $('#translation-source').textContent = 'Введи перевод вручную или открой внешний переводчик.';
                }
            }
            finally {
                clearTimeout(tid);
                if (requestController === ctl)
                    requestController = null;
            }
        };
        // убрать сохранённые «мусорные» переводы
        try {
            let n = 0;
            Object.keys(state.translations || {}).forEach(k => { const v = state.translations[k]; if (!irisGoodTranslation(v, k.startsWith('ru|') ? 'en' : 'ru')) {
                delete state.translations[k];
                n++;
            } });
            if (n)
                save();
        }
        catch (_) { }
        // 🔁 Словарь в обе стороны: русское слово → английский перевод; карточки EN → RU и RU → EN
        const normRu = t => String(t || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
        function findEnglish(ru) {
            const k = normRu(ru), hits = [], seen = new Set();
            const match = v => normRu(v).split(/[,;/()]|\sили\s/).map(x => x.trim()).filter(Boolean).some(x => x === k);
            const push = (en, source) => { const key = lookupKey(en); if (!seen.has(key)) {
                seen.add(key);
                hits.push({ en, source });
            } };
            profile().words.forEach(w => { if (match(w.ru))
                push(w.en, 'Твой словарь'); });
            Object.entries(VOCAB).forEach(([en, v]) => { if (match(typeof v === 'string' ? v : v === null || v === void 0 ? void 0 : v.ru))
                push(en, 'Словарь уроков · проверенный перевод'); });
            if (hits.length < 4)
                Object.entries(CORE).forEach(([en, v]) => { if (hits.length < 4 && match(v))
                    push(en, 'Словарь платформы · проверенный перевод'); });
            if (!hits.length && state.translations['ru|' + k])
                push(state.translations['ru|' + k], 'Онлайн-перевод · сохранённая версия');
            return hits.slice(0, 4);
        }
        async function onlineRu(ru, token, force = false) {
            requestController === null || requestController === void 0 ? void 0 : requestController.abort();
            requestController = new AbortController();
            const ctl = requestController, tid = setTimeout(() => ctl.abort(), 7000);
            if (token !== popupSerial)
                return;
            $('#translation-source').textContent = 'Онлайн-перевод · RU → EN';
            if (force)
                $('#translation-meaning').textContent = 'Ищу перевод…';
            try {
                const t = await translateOnline(ru, 'ru', 'en', ctl.signal);
                if (token !== popupSerial)
                    return;
                const text = t.main + (t.alts.length && oneWord(ru) ? ' · ' + t.alts.join(' · ') : '');
                $('#translation-meaning').textContent = text;
                $('#translation-source').textContent = 'Онлайн-перевод (' + t.by + ') · проверь значение в контексте';
                const input = $('#translation-edit');
                if (!input.value)
                    input.value = t.main;
                state.translations['ru|' + normRu(ru)] = t.main;
                save();
            }
            catch (_) {
                if (token !== popupSerial)
                    return;
                $('#translation-meaning').textContent = 'Онлайн-перевод сейчас не отвечает. Впишите перевод сами — слово всё равно сохранится в словаре.';
                $('#translation-source').textContent = 'Введи английское слово вручную или открой внешний переводчик.';
            }
            finally {
                clearTimeout(tid);
                if (requestController === ctl)
                    requestController = null;
            }
        }
        function showLookupRu(ru, rect = null) {
            var _a, _b;
            tourMark('ru');
            hidePopup();
            const token = popupSerial, hits = findEnglish(ru), best = hits[0];
            popup.innerHTML = `<div class="translation-top"><strong>${esc(ru)}</strong><button class="icon-btn" data-popup="close" aria-label="Закрыть перевод">${icon('close')}</button></div><p class="translation-meaning" id="translation-meaning">${best ? hits.map(h => esc(h.en)).join(' · ') : 'Ищу перевод…'}</p><p class="translation-source" id="translation-source">${best ? esc(best.source) + ' · RU → EN' : 'Онлайн-перевод · MyMemory · RU → EN'}</p><form class="translation-form" id="translation-form"><label for="translation-edit">По-английски (можно уточнить)</label><input class="field" id="translation-edit" value="${esc((best === null || best === void 0 ? void 0 : best.en) || '')}" placeholder="English word or phrase" maxlength="180" autocapitalize="off" autocomplete="off"><div class="translation-actions"><button class="ui-btn soft small" type="button" data-popup="speak">${icon('sound')} Слушать</button><button class="ui-btn small" type="submit">${icon('plus')} В словарь</button></div></form><details><summary>Другой перевод</summary><button class="ui-btn outline small online-translate" type="button" data-popup="online">Перевести онлайн</button><a class="external-translate" href="https://translate.google.com/?sl=ru&amp;tl=en&amp;text=${encodeURIComponent(ru)}&amp;op=translate" target="_blank" rel="noopener noreferrer">Открыть в Google Translate ↗</a></details>`;
            popup.hidden = false;
            popup.style.left = Math.max(12, Math.min(((_a = rect === null || rect === void 0 ? void 0 : rect.left) !== null && _a !== void 0 ? _a : window.innerWidth / 2 - 165), window.innerWidth - 342)) + 'px';
            const h = popup.getBoundingClientRect().height || 310;
            popup.style.top = Math.max(12, Math.min(((_b = rect === null || rect === void 0 ? void 0 : rect.bottom) !== null && _b !== void 0 ? _b : 120) + 10, window.innerHeight - h - 16)) + 'px';
            $('[data-popup="close"]', popup).onclick = hidePopup;
            $('[data-popup="speak"]', popup).onclick = () => { const en = $('#translation-edit').value.trim(); if (en)
                speak(en); };
            $('#translation-form').onsubmit = e => { e.preventDefault(); const en = $('#translation-edit').value.trim(); if (!en) {
                $('#translation-edit').focus();
                return;
            } if (addWord(en, ru, '', 'Перевод с русского')) {
                hidePopup();
                if (screen === 'words' && !review)
                    renderWords();
            } };
            $('[data-popup="online"]', popup).onclick = () => onlineRu(ru, token, true);
            if (!best)
                onlineRu(ru, token);
        }
        showLookup = (base => function (text, ...a) { return /[А-Яа-яЁё]/.test(text) && !/[A-Za-z]/.test(text) ? showLookupRu(String(text).trim(), a[0]) : base.call(this, text, ...a); })(showLookup);
        document.addEventListener('click', e => {
            if (!e.target.closest('[data-action="review-dir"]') || !review)
                return;
            review.dir = review.dir === 'ru' ? 'en' : 'ru';
            review.revealed = false;
            try {
                localStorage.setItem('iris-review-dir', review.dir);
            }
            catch (_) { }
            renderReview();
        });
        // «Мои уроки»: текущий и пройденные уроки ученика — открыть, повторить в играх
        renderHome = (base => function (...a) {
            var _a, _b;
            const r = base.apply(this, a);
            if (state.role === 'teacher')
                return r;
            const mine = DATA.filter(d => d.owner === state.profile && d.kind !== 'homework').slice().sort((x, y) => (y.date || '').localeCompare(x.date || ''));
            if (!mine.length)
                return r;
            const p = profile();
            const prog = m => { const secs = sectionsFor(m.id); const done = secs.filter(s => { var _a; return (_a = p.completed) === null || _a === void 0 ? void 0 : _a[s.id]; }).length; return [done, secs.length]; };
            const html = '<section class="panel my-lessons"><div class="kicker">МОИ УРОКИ</div><h2>Все ваши уроки — можно вернуться и повторить</h2><div class="my-lessons-list">' + mine.map((m, i) => {
                const [done, total] = prog(m), games = sectionsFor(m.id).some(s => s.id === m.id + '-games');
                return '<article class="my-lesson"><div class="ml-main"><span class="ml-tag ' + (i === 0 ? 'new' : 'past') + '">' + (i === 0 ? 'Текущий урок' : 'Пройден') + '</span><b>' + esc(m.title) + '</b><small>' + esc(m.level || '') + (m.grammar ? ' · ' + esc(m.grammar) : '') + '</small><div class="ml-bar"><span style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></span></div><small>Этапов пройдено: ' + done + ' из ' + total + '</small></div>'
                    + '<div class="ml-actions"><button class="ui-btn small" type="button" data-ml-open="' + esc(m.id) + '">Открыть</button>' + (games ? '<button class="ui-btn small soft" type="button" data-ml-games="' + esc(m.id) + '">🎮 Повторить в играх</button>' : '') + '</div></article>';
            }).join('') + '</div></section>';
            (_a = $('#screen-home .my-lessons')) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = ($('#screen-home .live-join') || $('#screen-home .stat-row') || $('#screen-home .home-intro'))) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML('afterend', html);
            return r;
        })(renderHome);
        document.addEventListener('click', e => { const b = e.target.closest('[data-ml-open], [data-ml-games]'); if (!b)
            return; if (b.dataset.mlOpen)
            openLesson(b.dataset.mlOpen);
        else
            openLesson(b.dataset.mlGames, b.dataset.mlGames + '-games'); });
        renderHome = (base => function (...a) { base.apply(this, a); const h = $('#screen-home .home-intro h1'); if (h && !h.querySelector('.wave'))
            h.insertAdjacentHTML('beforeend', ' ' + artImg('waving-hand', 'wave')); $$('#screen-home .prep-card').forEach(c => { if (!c.querySelector('.prep-img'))
            c.insertAdjacentHTML('afterbegin', artImg('memo', 'prep-img')); }); })(renderHome);
        // 🏋️ Грамматические тренажёры: «Карточки» (по одному вопросу), «Найди ошибки», «Разложи по группам», подсказки на «почти верные» ответы.
        // Всё построено на обычных полях и вопросах урока — ответы сохраняются, проверяются и уходят преподавателю как всегда.
        function paintDeck(d, go) {
            const qs = $$(':scope > .mc', d);
            if (!qs.length || !qs[0].dataset.choice)
                return; // the pane is not opened yet
            const p = profile(), st = qs.map(mc => p.choices[mc.dataset.choice] || {});
            if (go != null)
                d._i = Math.max(0, Math.min(qs.length, go));
            if (d._i == null) {
                const f = st.findIndex(c => !c.correct);
                d._i = f < 0 ? qs.length : f;
            }
            let bar = d.querySelector(':scope > .deck-bar');
            if (!bar) {
                bar = document.createElement('div');
                bar.className = 'deck-bar';
                d.prepend(bar);
                const end = document.createElement('div');
                end.className = 'deck-done';
                d.append(end);
            }
            const done = d._i >= qs.length, right = st.filter(c => c.correct).length, first = st.filter(c => c.correct && c.earned).length;
            bar.innerHTML = '<b>' + esc(d.dataset.title || 'Quiz cards') + '</b><span class="deck-dots">' + st.map((c, n) => '<button type="button" data-deck-go="' + n + '" class="' + (c.correct ? (c.earned ? 'ok' : 'fixed') : c.attempted ? 'bad' : '') + (n === d._i ? ' on' : '') + '" aria-label="Вопрос ' + (n + 1) + '"></button>').join('') + '</span><span class="deck-n">' + (done ? 'Итог' : (d._i + 1) + ' / ' + qs.length) + '</span>'
                + '<span class="deck-nav"><button type="button" class="ui-link" data-deck-go="' + (d._i - 1) + '"' + (d._i ? '' : ' disabled') + '>← Назад</button><button type="button" class="ui-link" data-deck-go="' + (d._i + 1) + '"' + (done ? ' disabled' : '') + '>Дальше →</button></span>';
            qs.forEach((mc, n) => { mc.hidden = n !== d._i; });
            const end = d.querySelector(':scope > .deck-done');
            end.hidden = !done;
            if (done)
                end.innerHTML = right === qs.length ? '🎉 <b>Готово!</b> С первой попытки: <b>' + first + ' из ' + qs.length + '</b>. Нажмите на точку, чтобы посмотреть любой вопрос.' : 'Отвечено: <b>' + right + ' из ' + qs.length + '</b>. Вернитесь к пропущенным вопросам — точки без цвета.';
        }
        function huntSync(h) {
            const f = $('.hunt-field', h);
            if (!f)
                return;
            const picked = new Set(String(f.value || '').split(/\s+/).filter(Boolean)), want = new Set(f.dataset.a.split(/\s+/));
            const st = ['ok', 'bad', 'shown'].find(x => f.classList.contains(x)) || '';
            $$('.hunt-w', h).forEach(b => {
                const on = picked.has(b.dataset.i), err = want.has(b.dataset.i);
                b.classList.toggle('picked', on);
                b.setAttribute('aria-pressed', String(on));
                b.classList.toggle('hit', !!st && on && err);
                b.classList.toggle('miss', !!st && on && !err);
                if (st && on && err && b.dataset.fix)
                    b.dataset.show = b.dataset.fix;
                else
                    delete b.dataset.show;
            });
            const r = $('.result', h);
            if (!r || !st)
                return;
            const hits = [...picked].filter(i => want.has(i)).length, extra = picked.size - hits;
            r.textContent = st === 'shown' ? 'Показаны все ошибки и исправления.' : hits === want.size && !extra ? 'Все ошибки найдены! 🎉' : 'Найдено ошибок: ' + hits + ' из ' + want.size + (extra ? ' · лишних: ' + extra + ' (они отмечены)' : '') + '. Ищите ещё!';
        }
        function paintTrainers(root) {
            $$('.deck', root).forEach(d => paintDeck(d));
            $$('.ex.hunt', root).forEach(huntSync);
            $$('.sort-item', root).forEach(li => { const b = $('.blank', li), s = $('select.gap', li); if (b && s)
                b.textContent = s.value || ''; });
        }
        document.addEventListener('click', e => {
            const go = e.target.closest('[data-deck-go]');
            if (go) {
                const d = go.closest('.deck');
                paintDeck(d, Number(go.dataset.deckGo));
                return;
            }
            const opt = e.target.closest('.deck > .mc .opt');
            if (opt) {
                const d = opt.closest('.deck'), mc = opt.closest('.mc');
                setTimeout(() => { var _a; paintDeck(d); if ((_a = profile().choices[mc.dataset.choice]) === null || _a === void 0 ? void 0 : _a.correct)
                    setTimeout(() => { if (!mc.hidden)
                        paintDeck(d, d._i + 1); }, 650); }, 0);
                return;
            }
            const w = e.target.closest('.hunt-w');
            if (w) {
                const h = w.closest('.ex.hunt'), f = $('.hunt-field', h);
                const set = new Set(String(f.value || '').split(/\s+/).filter(Boolean));
                set.has(w.dataset.i) ? set.delete(w.dataset.i) : set.add(w.dataset.i);
                f.value = [...set].sort((a, b) => a - b).join(' ');
                f.dispatchEvent(new Event('input', { bubbles: true }));
                huntSync(h);
                return;
            }
            const btn = e.target.closest('.ex .check, .ex .reveal');
            if (!btn)
                return;
            const ex = btn.closest('.ex');
            setTimeout(() => {
                if (ex.classList.contains('hunt'))
                    huntSync(ex);
                $$('input.gap[data-near]', ex).forEach(inp => {
                    var _a;
                    ((_a = inp.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains('near-note')) && inp.nextElementSibling.remove();
                    if (!inp.classList.contains('bad'))
                        return;
                    const v = norm(inp.value);
                    if (inp.dataset.near.split('|').some(x => norm(x) === v))
                        inp.insertAdjacentHTML('afterend', '<span class="near-note">💡 ' + esc(inp.dataset.nearMsg || '') + '</span>');
                });
                $$('.sort-item', ex).forEach(li => { const b = $('.blank', li), s = $('select.gap', li); if (b && s)
                    b.textContent = s.value || ''; });
            }, 0);
        });
        document.addEventListener('change', e => { var _a, _b; const li = (_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '.sort-item'); if (li) {
            const b = $('.blank', li);
            if (b)
                b.textContent = e.target.value || '';
        } }, true);
        document.addEventListener('input', e => { var _a, _b; const n = e.target.nextElementSibling; if (((_b = (_a = e.target).matches) === null || _b === void 0 ? void 0 : _b.call(_a, 'input.gap[data-near]')) && (n === null || n === void 0 ? void 0 : n.classList.contains('near-note')))
            n.remove(); }, true);
        window.addEventListener('hashchange', () => setTimeout(() => paintTrainers(document), 150));
        setTimeout(() => paintTrainers(document), 700);
        window.irisPaintTrainers = () => paintTrainers(document);
    })();
    window.__irisReady = true;
    // 🎃 Сезонное оформление на Хеллоуин (≈20 октября – 2 ноября; для проверки — ?halloween=1): полосатая оранжево-фиолетовая рамка,
    // паутинки по углам, тыква у логотипа, «Happy Halloween!» на главной и летучие мыши, которые иногда перелетают экран.
    // Мыши не мешают нажимать (pointer-events: none), не летают при «уменьшить движение», выключаются кнопкой 🦇 (запоминается).
    (function halloweenSeason() {
        const d = new Date(), m = d.getMonth(), day = d.getDate();
        const on = /[?&]halloween=1/.test(location.search) || (m === 9 && day >= 20) || (m === 10 && day <= 2);
        if (!on || /[?&]halloween=0/.test(location.search))
            return;
        const b = document.body;
        b.classList.add('season-halloween');
        let off = false;
        try {
            off = localStorage.getItem('iris-bats-off') === '1';
        }
        catch (_) { }
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const webs = document.createElement('div');
        webs.className = 'hw-webs';
        webs.setAttribute('aria-hidden', 'true');
        webs.innerHTML = '<i></i><i></i>';
        b.appendChild(webs);
        const sky = document.createElement('div');
        sky.className = 'hw-bats';
        sky.setAttribute('aria-hidden', 'true');
        b.appendChild(sky);
        const brand = document.querySelector('.app-brand');
        if (brand && !brand.querySelector('.hw-pumpkin'))
            brand.insertAdjacentHTML('beforeend', '<span class="hw-pumpkin" aria-hidden="true">🎃</span>');
        const BAT = '<svg viewBox="0 0 64 32"><path d="M32 11c1.6-3.4 3.6-5.6 5.6-6 .2 2.8 1.2 4.6 3 5.8 3.4-3.8 8.6-5.6 15-4.8-3 2-4.8 5-4.8 8.8 3-.2 5.8.8 8 2.8-5.2-.2-9.4 1.2-12.4 4-1.8-1.8-4.2-2.6-7-2.4-1.8 2.2-3.8 4-5.4 5.8-1.6-1.8-3.6-3.6-5.4-5.8-2.8-.2-5.2.6-7 2.4-3-2.8-7.2-4.2-12.4-4 2.2-2 5-3 8-2.8 0-3.8-1.8-6.8-4.8-8.8 6.4-.8 11.6 1 15 4.8 1.8-1.2 2.8-3 3-5.8 2 .4 4 2.6 5.6 6z"/></svg>';
        function launch(n) {
            if (off || still || document.hidden)
                return;
            for (let k = 0; k < n; k++) {
                const bat = document.createElement('span'), dur = 7 + Math.random() * 5, size = 26 + Math.random() * 22, rtl = Math.random() < .5;
                bat.className = 'hw-bat' + (rtl ? ' rtl' : '');
                bat.style.cssText = '--top:' + (6 + Math.random() * 34).toFixed(1) + 'vh;--dur:' + dur.toFixed(1) + 's;--delay:' + (k * (0.5 + Math.random() * 0.9)).toFixed(2) + 's;--size:' + size.toFixed(0) + 'px;--dip:' + (20 + Math.random() * 60).toFixed(0) + 'px';
                bat.innerHTML = '<span class="hw-wing">' + BAT + '</span>';
                bat.addEventListener('animationend', e => { if (e.target === bat)
                    bat.remove(); });
                sky.appendChild(bat);
            }
        }
        window.irisBats = launch;
        // переключатель 🦇: в шапке (компьютер) и рядом с «?» в верхней панели (телефон)
        const tbtn = '<button type="button" class="hw-toggle" title="Летучие мыши: вкл / выкл" aria-label="Летучие мыши: вкл / выкл"></button>';
        const header = document.querySelector('.app-header');
        if (header && !header.querySelector('.hw-toggle'))
            header.insertAdjacentHTML('beforeend', tbtn);
        const mhelp = document.querySelector('.help-btn-mobile');
        if (mhelp && !mhelp.parentElement.querySelector('.hw-toggle'))
            mhelp.insertAdjacentHTML('beforebegin', tbtn.replace('hw-toggle', 'hw-toggle hw-toggle-mobile'));
        const paint = () => { document.querySelectorAll('.hw-toggle').forEach(t => { t.textContent = off ? '🦇✕' : '🦇'; t.setAttribute('aria-pressed', String(!off)); }); b.classList.toggle('bats-off', off); };
        paint();
        document.addEventListener('click', e => { var _a, _b; if (!((_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '.hw-toggle')))
            return; off = !off; try {
            localStorage.setItem('iris-bats-off', off ? '1' : '0');
        }
        catch (_) { } paint(); if (!off)
            launch(3);
        else
            sky.innerHTML = ''; });
        const greet = () => { const h = document.querySelector('#screen-home h1'); if (h && !h.querySelector('.hw-greet'))
            h.insertAdjacentHTML('beforeend', ' <span class="hw-greet">🎃 Happy Halloween!</span>'); };
        try {
            renderHome = (base => function (...a) { const r = base.apply(this, a); greet(); return r; })(renderHome);
        }
        catch (_) { }
        greet();
        setTimeout(() => launch(4), 1200);
        (function loop() { setTimeout(() => { launch(1 + (Math.random() < .4 ? 1 : 0)); loop(); }, 35000 + Math.random() * 35000); })();
    })();
    // 📅 Челлендж «4 Days, 4 Skills» (meta.challenge): каждый день открывается у ученика в полночь своей даты (по его часам);
    // до этого вместо заданий — карточка «🔒 откроется …» с обратным отсчётом. Преподаватель видит всё и пометку, когда день откроется у ученика.
    // Окно-напоминание: ученику, у которого есть челлендж, с даты урока до конца последнего дня — раз в день (не в автотестах: navigator.webdriver; для проверки ?challengepop=1).
    (function challenge() {
        const b = document.body;
        const isStudent = () => b.classList.contains('locked') && !b.classList.contains('teacher-access') && state.role !== 'teacher';
        const midnight = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
        const left = ms => {
            const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.max(1, Math.ceil(ms % 36e5 / 6e4));
            return d ? d + ' д ' + h + ' ч' : h ? h + ' ч ' + m + ' мин' : m + ' мин';
        };
        function paintLocks() {
            const now = Date.now(), stu = isStudent();
            document.querySelectorAll('.day-lock').forEach(g => {
                const at = midnight(g.dataset.unlock), shut = stu && now < at, [en, ru] = (g.dataset.when || '').split(' · ');
                g.classList.toggle('is-locked', shut);
                g.classList.toggle('teacher-preview', !stu && now < at);
                let card = g.querySelector(':scope > .day-lock-card');
                if (!shut) {
                    card === null || card === void 0 ? void 0 : card.remove();
                    return;
                }
                if (!card) {
                    card = document.createElement('div');
                    card.className = 'day-lock-card';
                    card.setAttribute('role', 'status');
                    g.prepend(card);
                }
                const html = '<span class="dl-ico" aria-hidden="true">🔒</span><b>Day ' + g.dataset.day + ' opens on ' + en + '</b><span>День ' + g.dataset.day + ' откроется: ' + ru + ', в 00:00</span>'
                    + '<em>Осталось: ' + left(at - now) + '</em><small>А пока — повторите слова и задания прошлых дней 💪</small>';
                if (card.innerHTML !== html)
                    card.innerHTML = html;
            });
        }
        window.irisPaintLocks = paintLocks;
        try {
            showSection = (base => function (...a) { const r = base.apply(this, a); try {
                paintLocks();
            }
            catch (_) { } return r; })(showSection);
        }
        catch (_) { }
        window.addEventListener('hashchange', () => setTimeout(paintLocks, 60));
        setInterval(paintLocks, 30000);
        setTimeout(paintLocks, 300);
        setTimeout(paintLocks, 1500);
        // окно-напоминание
        const KEY = 'iris-challenge-pop', today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
        const forced = /[?&]challengepop=1/.test(location.search);
        function mine() {
            const now = Date.now();
            return DATA.find(d => d.challenge && d.owner === state.profile && now >= midnight(d.date || d.challenge.days[0]) && now < midnight(d.challenge.until) + 864e5);
        }
        function pop() {
            if (document.querySelector('.ch-pop') || !isStudent() || (navigator.webdriver && !forced) || (typeof live !== 'undefined' && live.active))
                return false;
            const m = mine();
            if (!m)
                return false;
            let seen = '';
            try {
                seen = localStorage.getItem(KEY) || '';
            }
            catch (_) { }
            if (seen === today())
                return true;
            const pre = String(m.hwSection || '').replace(/-hw-prep$/, ''), days = m.challenge.days, now = Date.now();
            const open = days.filter(d => now >= midnight(d)).length;
            const target = open ? pre + '-hw-day' + open : m.hwSection;
            const RU = ['четверг, 5 ноября', 'пятница, 6 ноября', 'суббота, 7 ноября', 'воскресенье, 8 ноября'];
            const fmt = d => { try {
                return new Date(midnight(d)).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
            }
            catch (_) {
                return d;
            } };
            const status = open ? (open >= days.length ? '🏁 Сегодня открыт последний, четвёртый день — финиш и сертификат!' : '🔓 Сегодня открыт <b>день ' + open + '</b> из ' + days.length + '. Не пропускайте — завтра откроется следующий!')
                : '⏳ Первый день откроется: <b>' + fmt(days[0]) + '</b>. А раздел «Start here» и слова первого дня — уже сейчас.';
            const w = document.createElement('div');
            w.className = 'ch-pop';
            w.innerHTML = '<div class="ch-card" role="dialog" aria-modal="true" aria-labelledby="ch-pop-title">'
                + '<div class="ch-top"><span class="ch-badge">📅 4 дня — 4 навыка</span><button type="button" class="ch-x" aria-label="Закрыть">×</button></div>'
                + '<h2 id="ch-pop-title">' + (m.greeting ? m.greeting + ', для вас ' : 'Для вас ') + 'челлендж!</h2>'
                + '<p>С <b>четверга по воскресенье</b> (' + fmt(days[0]).replace(/^[^,]+, /, '') + ' – ' + fmt(days[days.length - 1]).replace(/^[^,]+, /, '') + ') занятий не будет — но английский не отдыхает! Для вас готов мини-курс <b>«4 Days, 4 Skills»</b>.</p>'
                + '<ul class="ch-days">' + ['🎧 Слова и аудирование', '📖 Чтение', '🏋️ Грамматика', '✍️ Ошибки, письмо и сертификат'].map((t, i) => '<li class="' + (i < open ? 'on' : '') + '"><b>День ' + (i + 1) + '</b><span>' + t + '</span><small>' + (i < open ? 'открыт' : RU[i] || fmt(days[i])) + '</small></li>').join('') + '</ul>'
                + '<p>Каждый день в полночь открывается новое задание на <b>20–25 минут</b>. Курс нужно пройти: после каждого дня нажимайте <b>«Отправить преподавателю»</b> — я всё проверю.</p>'
                + '<p class="ch-status">' + status + '</p>'
                + '<div class="ch-actions"><button type="button" class="ui-btn ch-go">Открыть челлендж</button><button type="button" class="ui-btn ghost ch-later">Позже</button></div></div>';
            const close = () => { try {
                localStorage.setItem(KEY, today());
            }
            catch (_) { } w.remove(); document.removeEventListener('keydown', esc); };
            const esc = e => { if (e.key === 'Escape')
                close(); };
            w.addEventListener('click', e => {
                if (e.target === w || e.target.closest('.ch-x, .ch-later')) {
                    close();
                    return;
                }
                if (e.target.closest('.ch-go')) {
                    close();
                    try {
                        openLesson(m.id, target); // today's day — or the first unfinished one (homework opens in order)
                        const bl = window.irisHwOrder && window.irisHwOrder.blockers(m.id).get(target);
                        if (bl)
                            openLesson(m.id, bl.sec.id);
                    }
                    catch (_) {
                        openLesson(m.id);
                    }
                    setTimeout(paintLocks, 100);
                }
            });
            document.addEventListener('keydown', esc);
            b.appendChild(w);
            setTimeout(() => { var _a; return (_a = w.querySelector('.ch-go')) === null || _a === void 0 ? void 0 : _a.focus(); }, 50);
            return true;
        }
        window.irisChallengePop = pop;
        let tries = 0;
        (function wait() { if (pop() || ++tries > 20)
            return; setTimeout(wait, 1000); })();
    })();
    // 🔢 Домашка по порядку (только новая — см. inOrder): у ученика часть домашки (этап с «-hw-» в id) открывается, только когда во всех предыдущих частях
    // этого урока даны ответы на все задания с проверкой (поля с ключом, выбор вариантов, карточки). Свободное письмо не обязательно.
    // Ответы могут быть и неверными — преподаватель всё увидит. Преподаватель и живой урок — без ограничений.
    (function hwInOrder() {
        const b = document.body;
        const isStudent = () => b.classList.contains('locked') && !b.classList.contains('teacher-access') && state.role !== 'teacher';
        // по порядку — только НОВАЯ домашка: домашка внутри урока и дни челленджа; домашки на повторение (Grammar / Words / Halloween Gym, мини-ДЗ) открыты целиком
        // по порядку — только НОВОЕ: домашка к уроку, который ещё не прошёл (дата урока сегодня или позже), и идущий челлендж.
        // У прошедших уроков и закончившегося челленджа все части открыты сразу (их делают как повторение, в любом порядке).
        const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
        const inOrder = lid => {
            const m = DATA.find(d => d.id === lid);
            if (!m)
                return false;
            if (m.challenge)
                return !(m.challenge.until && todayISO() > m.challenge.until);
            return m.kind !== 'homework' && !!m.date && m.date >= todayISO();
        };
        const hwSecs = lid => { const pane = lid && document.getElementById(lid); return pane && inOrder(lid) ? [...pane.querySelectorAll('section.step')].filter(s => /-hw-/.test(s.id)) : []; };
        function left(sec) {
            const p = profile();
            let n = 0;
            sec.querySelectorAll('.gap[data-a]').forEach(f => { const r = p.fields[f.dataset.field || f.id]; if (!String(f.value || (r === null || r === void 0 ? void 0 : r.value) || '').trim())
                n++; });
            sec.querySelectorAll('.mc').forEach(mc => { const c = p.choices[mc.dataset.choice]; if (!(c && (c.attempted || c.correct || Number.isInteger(c.selected))))
                n++; });
            return n;
        }
        const label = s => (s.dataset.label || s.id).replace(/^Homework:\s*/i, 'Homework: ');
        // для каждой части: null — открыта, иначе {sec: первая незаконченная предыдущая часть, n: сколько там осталось}
        function blockers(lid) {
            const secs = hwSecs(lid), out = new Map();
            let first = null;
            secs.forEach(s => { out.set(s.id, first); if (!first) {
                const n = left(s);
                if (n)
                    first = { sec: s, n, pos: secs.indexOf(s) + 1 };
            } });
            return out;
        }
        function paint() {
            const lid = typeof currentLesson !== 'undefined' ? currentLesson : null;
            const on = isStudent() && !(typeof live !== 'undefined' && live.active);
            const map = on ? blockers(lid) : new Map();
            hwSecs(lid).forEach(s => {
                var _a;
                const bl = map.get(s.id), card = s.querySelector(':scope > .seq-lock-card');
                s.classList.toggle('seq-locked', !!bl);
                if (!bl) {
                    card === null || card === void 0 ? void 0 : card.remove();
                    return;
                }
                const html = '<span class="dl-ico" aria-hidden="true">🔒</span><b>First finish part ' + bl.pos + ': «' + esc(label(bl.sec)) + '»</b>'
                    + '<span>Домашка открывается по порядку. Сначала закончите часть ' + bl.pos + ' — осталось ответить: <b>' + bl.n + '</b>.</span>'
                    + '<button type="button" class="ui-btn" data-seq-go="' + bl.sec.id + '">← К части ' + bl.pos + '</button>';
                if (!card)
                    (_a = s.querySelector(':scope > .step-head')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterend', '<div class="seq-lock-card" role="status">' + html + '</div>');
                else if (card.innerHTML !== html)
                    card.innerHTML = html;
            });
            // 🔒 в плане урока и в выпадающем списке этапов
            $$('#lesson-rail [data-stage]').forEach(btn => btn.classList.toggle('seq-off', !!map.get(btn.dataset.stage)));
            $$('#stage-select option').forEach(o => { const lock = !!map.get(o.value); o.textContent = o.textContent.replace(/^🔒 /, ''); if (lock)
                o.textContent = '🔒 ' + o.textContent; });
        }
        window.irisHwOrder = { paint, blockers, left };
        document.addEventListener('click', e => { const g = e.target.closest('[data-seq-go]'); if (!g)
            return; e.preventDefault(); openLesson(currentLesson, g.dataset.seqGo); setTimeout(paint, 60); });
        try {
            showSection = (base => function (...a) { const r = base.apply(this, a); try {
                paint();
            }
            catch (_) { } return r; })(showSection);
        }
        catch (_) { }
        try {
            refreshLessonStats = (base => function (...a) { const r = base.apply(this, a); clearTimeout(paint.t); paint.t = setTimeout(() => { try {
                paint();
            }
            catch (_) { } }, 120); return r; })(refreshLessonStats);
        }
        catch (_) { }
        document.addEventListener('click', e => { if (e.target.closest('.mc, .chip, .hunt-w, .order-words, .check, .reveal, .deck')) {
            clearTimeout(paint.t);
            paint.t = setTimeout(() => { try {
                paint();
            }
            catch (_) { } }, 250);
        } });
        window.addEventListener('hashchange', () => setTimeout(paint, 80));
        setTimeout(paint, 600);
    })();
    // 📚 Домашка — один понятный экран для ученика: «Сделать сейчас» (домашка к урокам и челлендж), «На повторение» (тренажёры),
    // «Отправлено» (свёрнуто). У каждого задания — прогресс «Ответов: N из M» и кнопки частей. Наверху — «▶ Следующее задание».
    // Внутри домашки — полоса «← Вся домашка» с вкладками частей. На главной карточки домашки собраны в один блок с теми же группами.
    (function homeworkHub() {
        const b = document.body;
        const student = () => b.classList.contains('locked') && !b.classList.contains('teacher-access') && state.role !== 'teacher';
        const sentMap = () => { const pr = profile(); return pr.sent && typeof pr.sent === 'object' ? pr.sent : {}; };
        const fmt = t => { try {
            return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        }
        catch (_) {
            return '';
        } };
        const partName = s => (s.dataset.label || s.id).replace(/^Homework:\s*/i, '').replace(/^Day (\d) · /, 'День $1 · ').replace(/^Start here$/i, 'Start here');
        const groupOf = m => m.kind === 'homework' && !m.challenge && !m.hwNow ? 'review' : 'now';
        function parts(m, hwSec) {
            const pane = document.getElementById(m.id);
            if (!pane)
                return [];
            try {
                initializePane(pane);
            }
            catch (_) { }
            const ps = [...pane.querySelectorAll('section.step')].filter(s => /-hw-/.test(s.id));
            if (ps.length)
                return ps;
            const el = hwSec && document.getElementById(hwSec.id);
            return el ? [el] : [];
        }
        function count(sec) {
            const p = profile();
            let total = 0, done = 0;
            sec.querySelectorAll('.gap[data-a]').forEach(f => { var _a; total++; const r = p.fields[f.dataset.field || f.id]; if (String((_a = r === null || r === void 0 ? void 0 : r.value) !== null && _a !== void 0 ? _a : '').trim())
                done++; });
            sec.querySelectorAll('.mc').forEach(mc => { total++; const c = p.choices[mc.dataset.choice]; if (c && (c.attempted || c.correct || Number.isInteger(c.selected)))
                done++; });
            return { total, done };
        }
        const locked = (m, s) => !!((window.irisHwOrder && window.irisHwOrder.blockers(m.id).get(s.id)) || s.querySelector('.day-lock.is-locked'));
        function items() {
            const list = window.irisHomeworkList ? window.irisHomeworkList() : [];
            return list.map(x => {
                const ps = parts(x.m, x.sec), counts = ps.map(count);
                const total = counts.reduce((a, c) => a + c.total, 0), done = counts.reduce((a, c) => a + c.done, 0);
                const next = ps.find((s, i) => counts[i].done < counts[i].total && !locked(x.m, s)) || ps.find(s => !locked(x.m, s)) || ps[0];
                return Object.assign(Object.assign({}, x), { ps, counts, total, done, next, sentAt: x.sent ? sentMap()[x.m.id] : 0, group: x.sent ? 'done' : groupOf(x.m) });
            });
        }
        const kickerOf = m => m.challenge ? '📅 ЧЕЛЛЕНДЖ · 4 ДНЯ' : m.hwNow ? '📘 ' + esc(m.hwTag || 'К УРОКУ') : m.kind === 'homework' ? '🔁 ПОВТОРЕНИЕ' + (m.hwTag ? ' · ' + esc(m.hwTag) : '') : '📘 К УРОКУ' + (m.code && m.code !== 'HW' ? ' ' + esc(m.code) : '');
        function card(x) {
            var _a;
            const m = x.m, pct = x.total ? Math.round(x.done / x.total * 100) : 0;
            const st = x.sent ? '✅ Отправлено ' + fmt(x.sentAt) : x.done ? '✏️ Начато' : '🆕 Новое';
            const chips = x.ps.map((s, i) => {
                const c = x.counts[i], lk = locked(m, s), full = c.total > 0 && c.done >= c.total;
                return '<button type="button" class="hwh-part' + (full ? ' ok' : '') + (lk ? ' off' : '') + '" data-hwh-open="' + esc(m.id) + '" data-hwh-sec="' + esc(s.id) + '">'
                    + (lk ? '🔒 ' : full ? '✓ ' : '') + (i + 1) + ' · ' + esc(partName(s)) + '</button>';
            }).join('');
            const go = x.sent ? 'Открыть' : x.done ? 'Продолжить' : 'Начать';
            return '<article class="hwh-card hwh-' + x.group + '" data-hwh-card="' + esc(m.id) + '"><div class="hwh-top"><span class="hwh-kicker">' + kickerOf(m) + '</span><span class="hwh-state">' + st + '</span></div>'
                + '<h3>' + esc(m.title) + '</h3>'
                + (x.total ? '<div class="hwh-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div><small class="hwh-count">Ответов: ' + x.done + ' из ' + x.total + '</small>' : '')
                + (x.ps.length > 1 ? '<div class="hwh-parts" aria-label="Части задания">' + chips + '</div>' : '')
                + '<button type="button" class="ui-btn hwh-go" data-hwh-open="' + esc(m.id) + '" data-hwh-sec="' + esc(((_a = x.next) === null || _a === void 0 ? void 0 : _a.id) || x.sec.id) + '">' + go + ' →</button></article>';
        }
        const host = () => {
            let el = document.getElementById('screen-homework');
            if (!el) {
                el = document.createElement('section');
                el.className = 'app-screen';
                el.id = 'screen-homework';
                el.setAttribute('aria-label', 'Домашка');
                el.hidden = true;
                const words = document.getElementById('screen-words');
                (words || document.querySelector('.app-screen')).after(el);
            }
            return el;
        };
        function render() {
            var _a;
            const all = items(), now = all.filter(x => x.group === 'now'), rev = all.filter(x => x.group === 'review'), done = all.filter(x => x.group === 'done');
            const pick = now[0] || rev[0];
            host().innerHTML = '<div class="screen-heading hwh-head"><div><div class="kicker">ДОМАШНЕЕ ЗАДАНИЕ</div><h1>Домашка</h1><p>Вся домашка в одном месте. Начните с «Сделать сейчас», в конце каждого задания — «Отправить преподавателю».</p></div></div>'
                + '<div class="hwh-sum"><span><b>' + now.length + '</b> сделать сейчас</span><span><b>' + rev.length + '</b> на повторение</span><span><b>' + done.length + '</b> отправлено</span></div>'
                + (pick ? '<div class="hwh-next"><div><span>▶ Следующее задание</span><b>' + esc(pick.m.title) + '</b>' + (pick.next && pick.ps.length > 1 ? '<small>часть ' + (pick.ps.indexOf(pick.next) + 1) + ' из ' + pick.ps.length + ': ' + esc(partName(pick.next)) + '</small>' : '') + '</div>'
                    + '<button type="button" class="ui-btn" id="hwh-next" data-hwh-open="' + esc(pick.m.id) + '" data-hwh-sec="' + esc(((_a = pick.next) === null || _a === void 0 ? void 0 : _a.id) || pick.sec.id) + '">' + (pick.done ? 'Продолжить' : 'Начать') + '</button></div>'
                    : '<div class="hwh-next hwh-alldone"><div><span>🎉 Всё сделано!</span><b>Новой домашки пока нет.</b><small>Можно открыть отправленные задания и дополнить ответы.</small></div></div>')
                + '<section class="hwh-group"><h2>🔥 Сделать сейчас</h2><p class="hwh-hint">Домашка к урокам и челлендж — начните отсюда.</p>'
                + (now.length ? '<div class="hwh-list">' + now.map(card).join('') + '</div>' : '<p class="hwh-empty">Здесь пусто — новая домашка появится после урока.</p>') + '</section>'
                + (rev.length ? '<section class="hwh-group"><h2>🔁 На повторение</h2><p class="hwh-hint">Тренажёры по пройденным темам — в любом порядке, когда есть время.</p><div class="hwh-list">' + rev.map(card).join('') + '</div></section>' : '')
                + (done.length ? '<details class="hwh-group hwh-donebox"><summary>✅ Отправлено · ' + done.length + '</summary><div class="hwh-list">' + done.map(card).join('') + '</div></details>' : '');
        }
        function open() {
            if (typeof live !== 'undefined' && live.active) {
                notify('Сейчас идёт урок — домашка откроется после него.');
                return;
            }
            resetScreens();
            screen = 'homework';
            currentLesson = currentSection = null;
            render();
            host().hidden = false;
            updateChrome();
            try {
                history.replaceState(null, '', '#homework');
            }
            catch (_) { }
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
        window.irisHomeworkHub = { open, items, render, now: () => (window.irisHomeworkList ? window.irisHomeworkList() : []).filter(x => !x.sent && groupOf(x.m) === 'now').length };
        try {
            updateChrome = (base => function (...a) { const r = base.apply(this, a); if (screen === 'homework') {
                const bc = document.getElementById('breadcrumb');
                if (bc)
                    bc.textContent = 'Домашка';
            } return r; })(updateChrome);
        }
        catch (_) { }
        try {
            route = (base => function (next, ...a) { if (next === 'homework') {
                open();
                return;
            } return base.call(this, next, ...a); })(route);
        }
        catch (_) { }
        try {
            openFromHash = (base => function (...a) { if (decodeURIComponent(location.hash.slice(1)) === 'homework' && student()) {
                open();
                return;
            } return base.apply(this, a); })(openFromHash);
        }
        catch (_) { }
        document.addEventListener('click', e => {
            const o = e.target.closest('[data-hwh-open]');
            if (o) {
                e.preventDefault();
                openLesson(o.dataset.hwhOpen, o.dataset.hwhSec || undefined);
                return;
            }
            if (e.target.closest('[data-hw-hub]')) {
                e.preventDefault();
                open();
            }
        });
        // полоса домашки внутри задания: «← Вся домашка» + части
        function bar() {
            var _a;
            const scr = document.getElementById('screen-lesson');
            if (!scr)
                return;
            let el = scr.querySelector(':scope > .hw-bar');
            const sec = screen === 'lesson' && currentSection && document.getElementById(currentSection);
            const m = sec && DATA.find(d => d.id === currentLesson);
            const on = student() && m && !(typeof live !== 'undefined' && live.active) && (/-hw-/.test(sec.id) || (window.irisHomeworkList && window.irisHomeworkList().some(x => x.m.id === m.id && x.sec.id === sec.id)));
            document.body.classList.toggle('hw-mode', !!on); // внутри домашки — без шапки урока и лишних переключателей
            if (!on) {
                el === null || el === void 0 ? void 0 : el.remove();
                return;
            }
            (_a = document.querySelector('.app-nav button[data-screen="lesson"]')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
            const ps = parts(m, irisHw.section(m));
            const toLesson = m.kind !== 'homework' && window.irisLessonStart ? window.irisLessonStart(m.id) : null;
            const html = '<button type="button" class="hw-bar-back" data-hw-hub>← Вся домашка</button>' + (toLesson ? '<button type="button" class="hw-bar-back hw-bar-lesson" data-hwh-open="' + esc(m.id) + '" data-hwh-sec="' + esc(toLesson) + '">📘 К уроку</button>' : '') + '<span class="hw-bar-title">' + esc(m.title) + '</span>'
                + (ps.length > 1 ? '<span class="hw-bar-parts">' + ps.map((s, i) => {
                    const c = count(s), lk = locked(m, s), full = c.total > 0 && c.done >= c.total;
                    return '<button type="button" class="hw-bar-part' + (s.id === sec.id ? ' on' : '') + (full ? ' ok' : '') + (lk ? ' off' : '') + '" data-hwh-open="' + esc(m.id) + '" data-hwh-sec="' + esc(s.id) + '"' + (s.id === sec.id ? ' aria-current="step"' : '') + '>'
                        + (lk ? '🔒 ' : full ? '✓ ' : '') + (i + 1) + ' · ' + esc(partName(s)) + '</button>';
                }).join('') + '</span>' : '');
            if (!el) {
                el = document.createElement('nav');
                el.className = 'hw-bar';
                el.setAttribute('aria-label', 'Части домашки');
                scr.prepend(el);
            }
            if (el.innerHTML !== html)
                el.innerHTML = html;
        }
        window.irisHwBar = bar;
        try {
            showSection = (base => function (...a) { const r = base.apply(this, a); try {
                bar();
            }
            catch (_) { } return r; })(showSection);
        }
        catch (_) { }
        try {
            refreshLessonStats = (base => function (...a) { const r = base.apply(this, a); clearTimeout(bar.t); bar.t = setTimeout(() => { try {
                bar();
            }
            catch (_) { } }, 300); return r; })(refreshLessonStats);
        }
        catch (_) { }
        try {
            route = (base => function (...a) { const r = base.apply(this, a); try {
                bar();
            }
            catch (_) { } return r; })(route);
        }
        catch (_) { }
        // главная: карточки домашки — одним блоком с группами
        try {
            renderHome = (base => function (...a) {
                const r = base.apply(this, a);
                try {
                    if (!student())
                        return r;
                    const home = document.getElementById('screen-home'), cards = [...home.querySelectorAll('.prep-card:not(.fb-card)')].filter(c => c.querySelector('[data-open-prep]'));
                    if (!cards.length)
                        return r;
                    const info = Object.fromEntries(items().map(x => [x.m.id, x]));
                    const box = document.createElement('section');
                    box.className = 'hw-home';
                    box.setAttribute('aria-label', 'Домашка');
                    const groups = { now: [], review: [], done: [] };
                    cards.forEach(c => {
                        var _a;
                        const id = c.querySelector('[data-open-prep]').dataset.openPrep, x = info[id];
                        const g = x ? x.group : 'now';
                        groups[g].push(c);
                        if (x && x.total && !c.querySelector('.hwh-meter')) {
                            const pct = Math.round(x.done / x.total * 100);
                            (_a = c.querySelector(':scope > div')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', '<div class="hwh-meter"><span style="width:' + pct + '%"></span></div><small class="hwh-count">Ответов: ' + x.done + ' из ' + x.total + '</small>');
                        }
                    });
                    cards[0].before(box);
                    box.innerHTML = '<div class="hw-home-head"><h2>📚 Домашка</h2><button type="button" class="ui-btn soft" data-hw-hub>Вся домашка →</button></div>';
                    if (groups.now.length) {
                        const g = document.createElement('div');
                        g.className = 'hw-home-now';
                        groups.now.forEach(c => g.append(c));
                        box.append(g);
                    }
                    else
                        box.insertAdjacentHTML('beforeend', '<p class="hwh-empty">🎉 Новой домашки нет — всё отправлено.</p>');
                    [['review', '🔁 На повторение'], ['done', '✅ Отправлено']].forEach(([k, t]) => {
                        if (!groups[k].length)
                            return;
                        const d = document.createElement('details');
                        d.className = 'hw-home-more hw-home-' + k;
                        d.innerHTML = '<summary>' + t + ' · ' + groups[k].length + '</summary>';
                        groups[k].forEach(c => d.append(c));
                        box.append(d);
                    });
                    // «Мои материалы» повторяли уроки и домашку, которые уже есть выше, — оставляем только то, чего больше нигде нет
                    const seen = new Set(items().map(x => x.m.id));
                    DATA.forEach(d => { if (d.owner === state.profile && d.kind !== 'homework')
                        seen.add(d.id); });
                    const grid = home.querySelector('.lesson-grid');
                    if (grid) {
                        grid.querySelectorAll('.material-card').forEach(c => { var _a; const id = (_a = c.querySelector('[data-open]')) === null || _a === void 0 ? void 0 : _a.dataset.open; if (id && seen.has(id))
                            c.remove(); });
                        if (!grid.querySelector('.material-card')) {
                            const t = grid.previousElementSibling;
                            if (t && t.classList.contains('section-title'))
                                t.remove();
                            grid.remove();
                        }
                    }
                }
                catch (_) { }
                return r;
            })(renderHome);
        }
        catch (_) { }
        // урок и домашка урока — разные места: «Мой урок» / «Начать урок» ведут в урок (последний этап урока), а не в домашку,
        // даже если ученик только что делал домашку. Внутри домашки урока — кнопка «📘 К уроку».
        const isHwPart = (m, id) => { try {
            const hs = irisHw.section(m);
            return /-hw-/.test(id) || (!!hs && parts(m, hs).some(x => x.id === id));
        }
        catch (_) {
            return /-hw-/.test(id);
        } };
        const lessonSteps = () => { const p = profile(); if (!p.lessonSteps || typeof p.lessonSteps !== 'object')
            p.lessonSteps = {}; return p.lessonSteps; };
        function lessonStart(m) { var _a; const secs = sectionsFor(m.id), saved = lessonSteps()[m.id]; return (_a = (secs.find(x => x.id === saved && !isHwPart(m, x.id)) || secs.find(x => !isHwPart(m, x.id)) || secs[0])) === null || _a === void 0 ? void 0 : _a.id; }
        window.irisLessonStart = id => { const m = DATA.find(d => d.id === id); return m ? lessonStart(m) : undefined; };
        try {
            openLesson = (base => function (id, sectionId, ...a) {
                var _a;
                try {
                    const m = DATA.find(d => d.id === id);
                    if (!sectionId && student() && m && m.kind !== 'homework' && isHwPart(m, ((_a = profile().steps) === null || _a === void 0 ? void 0 : _a[id]) || ''))
                        sectionId = lessonStart(m);
                }
                catch (_) { }
                return base.call(this, id, sectionId, ...a);
            })(openLesson);
        }
        catch (_) { }
        try {
            showSection = (base => function (...a) {
                const r = base.apply(this, a);
                try {
                    const m = DATA.find(d => d.id === currentLesson);
                    if (m && m.kind !== 'homework' && currentSection && !isHwPart(m, currentSection))
                        lessonSteps()[m.id] = currentSection;
                }
                catch (_) { }
                return r;
            })(showSection);
        }
        catch (_) { }
        // ответы изменились — экран домашки обновляется сам
        document.addEventListener('click', e => { if (screen === 'homework' && e.target.closest('[data-send-answers], #modal-confirm'))
            setTimeout(() => { try {
                render();
            }
            catch (_) { } }, 600); });
    })();
    // 🎯 Карта миссий: для пакетов самостоятельной работы (meta.missions) — на главной плитки миссий с ✓, «▶ Следующая миссия» и «🎮 Играть».
    // Для новичка, которому трудно усидеть: видно, сколько уже пройдено, и одна большая кнопка — что делать дальше.
    (function missionMap() {
        const b = document.body;
        const student = () => b.classList.contains('locked') && !b.classList.contains('teacher-access') && state.role !== 'teacher';
        function done(id) {
            var _a;
            const p = profile();
            if ((_a = p.completed) === null || _a === void 0 ? void 0 : _a[id])
                return true;
            const sec = document.getElementById(id);
            if (!sec)
                return false;
            let total = 0, n = 0;
            sec.querySelectorAll('.gap[data-a]').forEach(f => { var _a, _b; total++; if (String((_b = (_a = p.fields[f.dataset.field || f.id]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '').trim())
                n++; });
            sec.querySelectorAll('.mc').forEach(mc => { total++; const c = p.choices[mc.dataset.choice]; if (c && (c.attempted || c.correct || Number.isInteger(c.selected)))
                n++; });
            return total > 0 && n >= total;
        }
        function html(m) {
            const list = m.missions, next = list.find(([id]) => !done(id)) || list[0], count = list.filter(([id]) => done(id)).length, games = m.id + '-games';
            return '<section class="mission-map" aria-label="Миссии"><div class="mm-head"><div><div class="kicker">ТВОИ МИССИИ · ' + esc(m.title) + '</div><h2>' + count + ' из ' + list.length + ' пройдено ' + (count === list.length ? '🏆' : '⭐') + '</h2>'
                + '<p>Одна миссия — 3–5 минут. Каждый день по одной — и слова запомнятся!</p></div></div>'
                + '<div class="mm-bar"><span style="width:' + Math.round(count / list.length * 100) + '%"></span></div>'
                + '<div class="mm-actions"><button type="button" class="ui-btn" data-mm-open="' + esc(m.id) + '" data-mm-sec="' + esc(next[0]) + '">▶ ' + (count ? 'Следующая миссия' : 'Начать первую миссию') + ': ' + esc(next[2]) + '</button>'
                + (document.getElementById(games) ? '<button type="button" class="ui-btn soft" data-mm-open="' + esc(m.id) + '" data-mm-sec="' + esc(games) + '">🎮 Играть</button>' : '') + '</div>'
                + '<div class="mm-grid">' + list.map(([id, emo, title], i) => '<button type="button" class="mm-tile' + (done(id) ? ' done' : '') + (id === next[0] && count < list.length ? ' next' : '') + '" data-mm-open="' + esc(m.id) + '" data-mm-sec="' + esc(id) + '">'
                + '<span class="mm-emo">' + emo + '</span><b>' + esc(title) + '</b><small>' + (done(id) ? '✓ пройдено' : i === list.length - 1 && /boss/i.test(id) ? 'Финал' : 'Миссия ' + (i + 1)) + '</small></button>').join('') + '</div></section>';
        }
        try {
            renderHome = (base => function (...a) {
                var _a, _b, _c;
                const r = base.apply(this, a);
                try {
                    if (!student())
                        return r;
                    const m = DATA.find(d => d.owner === state.profile && Array.isArray(d.missions));
                    if (!m)
                        return r;
                    const home = document.getElementById('screen-home');
                    (_a = home.querySelector('.mission-map')) === null || _a === void 0 ? void 0 : _a.remove();
                    (_b = home.querySelector('.verbs-home-btn')) === null || _b === void 0 ? void 0 : _b.remove();
                    (_c = home.querySelector('.home-intro')) === null || _c === void 0 ? void 0 : _c.insertAdjacentHTML('afterend', html(m));
                }
                catch (_) { }
                return r;
            })(renderHome);
        }
        catch (_) { }
        document.addEventListener('click', e => { const t = e.target.closest('[data-mm-open]'); if (!t)
            return; e.preventDefault(); openLesson(t.dataset.mmOpen, t.dataset.mmSec); });
    })();
    // 🔍 Перевод по нажатию на слово. Раньше слово нужно было выделить — а текст на кнопках, в вариантах ответа, на карточках
    // выделить нельзя, и казалось, что «не всё кликается». Теперь: нажмите на слово → «🔍 слово» → перевод.
    // На кнопках и карточках (там нажатие уже занято) — долгое нажатие на телефоне или правая кнопка мыши на компьютере.
    (function tapWord() {
        let chip = null, suppressClick = false, press = null;
        const hide = () => { if (chip) {
            chip.remove();
            chip = null;
        } };
        window.addEventListener('scroll', hide, true);
        const INTERACTIVE = 'button,a,input,select,textarea,label,summary,[data-say],.hunt,.order-words,.lookup-chip,.translation-popover,.live-bar,[contenteditable]';
        function caret(x, y) {
            try {
                if (document.caretPositionFromPoint) {
                    const c = document.caretPositionFromPoint(x, y);
                    return c && { node: c.offsetNode, off: c.offset };
                }
                if (document.caretRangeFromPoint) {
                    const c = document.caretRangeFromPoint(x, y);
                    return c && { node: c.startContainer, off: c.startOffset };
                }
            }
            catch (_) { }
            return null;
        }
        function wordAt(x, y) {
            var _a;
            const c = caret(x, y);
            if (!c || !c.node || c.node.nodeType !== 3)
                return null;
            const t = c.node.textContent, isW = ch => /[A-Za-z'’\-]/.test(ch || '');
            let a = Math.min(c.off, t.length), b = a;
            if (!isW(t[a]) && isW(t[a - 1]))
                a--, b--;
            if (!isW(t[a]))
                return null;
            while (a > 0 && isW(t[a - 1]))
                a--;
            while (b < t.length && isW(t[b]))
                b++;
            const word = t.slice(a, b).replace(/^['’\-]+|['’\-]+$/g, '');
            if (!/[A-Za-z]{2,}/.test(word))
                return null;
            const r = document.createRange();
            r.setStart(c.node, a);
            r.setEnd(c.node, b);
            const rect = r.getBoundingClientRect();
            if (Math.abs(y - (rect.top + rect.height / 2)) > rect.height || x < rect.left - 6 || x > rect.right + 6)
                return null; // нажали мимо слова
            const para = (_a = c.node.parentElement) === null || _a === void 0 ? void 0 : _a.closest('p,li,td,.flip-back,.flip-front,.opt,.q,.chat-msg,.sort-text');
            const ctx = para ? para.textContent.replace(/\s+/g, ' ').trim() : word;
            return { word, rect, ctx: ctx.length <= 400 ? ctx : word, el: c.node.parentElement };
        }
        function inLesson(el) { const step = el === null || el === void 0 ? void 0 : el.closest('section.step'); return !!step && !step.hidden && screen === 'lesson' && !el.closest('input,select,textarea,.step-notes,.homework-response'); }
        function offer(w, direct) {
            hide();
            if (direct) {
                showLookup(w.word, w.rect, w.ctx);
                return;
            }
            chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'lookup-chip';
            chip.textContent = '🔍 ' + w.word;
            chip.style.left = Math.max(8, Math.min(w.rect.left, window.innerWidth - 170)) + 'px';
            chip.style.top = Math.min(w.rect.bottom + 6, window.innerHeight - 56) + 'px';
            chip.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); hide(); showLookup(w.word, w.rect, w.ctx); });
            document.body.appendChild(chip);
        }
        // обычное нажатие на слово в тексте урока
        document.addEventListener('click', e => {
            if (suppressClick) {
                suppressClick = false;
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.target.closest('.lookup-chip'))
                return;
            const sel = window.getSelection();
            if (sel && !sel.isCollapsed)
                return; // выделение — работает как раньше
            if (!inLesson(e.target) || e.target.closest(INTERACTIVE)) {
                hide();
                return;
            }
            const w = wordAt(e.clientX, e.clientY);
            if (!w) {
                hide();
                return;
            }
            offer(w, false);
        }, true);
        // долгое нажатие (телефон, планшет) — и на кнопках, и на карточках
        document.addEventListener('pointerdown', e => {
            if (e.pointerType === 'mouse' || !inLesson(e.target) || e.target.closest('.lookup-chip'))
                return;
            const x = e.clientX, y = e.clientY;
            press = { x, y, t: setTimeout(() => { const w = wordAt(x, y); if (w) {
                    suppressClick = true;
                    setTimeout(() => { suppressClick = false; }, 800);
                    offer(w, false);
                } press = null; }, 520) };
        }, true);
        const cancel = e => { if (press && (!e || e.type !== 'pointermove' || Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10)) {
            clearTimeout(press.t);
            press = null;
        } };
        document.addEventListener('pointermove', cancel, true);
        document.addEventListener('pointerup', () => { if (press) {
            clearTimeout(press.t);
            press = null;
        } }, true);
        document.addEventListener('pointercancel', cancel, true);
        // компьютер: правая кнопка мыши на слове (на кнопке, карточке или в тексте) — сразу перевод
        document.addEventListener('contextmenu', e => {
            if (!inLesson(e.target))
                return;
            const w = wordAt(e.clientX, e.clientY);
            if (!w)
                return;
            e.preventDefault();
            offer(w, true);
        }, true);
    })();
    // 🗣️ «Скажи вслух» (speak-deck): тренажёр речи. Карточка: фраза по-русски → ученик говорит по-английски вслух →
    // «Показать ответ» (правильный вариант + 🔊) → «✅ Получилось» / «🔁 Ещё раз» (такие карточки возвращаются в конец).
    // 🎙 можно записать себя и сравнить с образцом. В конце — итог: сколько с первого раза.
    (function speakDeck() {
        const rec = { stream: null, mr: null };
        const canRec = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
        function stopRec() { try {
            rec.mr && rec.mr.state !== 'inactive' && rec.mr.stop();
        }
        catch (_) { } }
        function setup(deck) {
            if (deck.dataset.ready)
                return;
            deck.dataset.ready = '1';
            const cards = [...deck.querySelectorAll('.sd-card')];
            if (!cards.length)
                return;
            let queue = cards.map((_, i) => i), firstTry = new Set(), seen = new Set(), done = 0;
            const ui = document.createElement('div');
            ui.className = 'sd-ui';
            ui.innerHTML = '<div class="sd-top"><b class="sd-count"></b><span class="sd-bar"><span></span></span></div><div class="sd-stage"></div>'
                + '<div class="sd-actions"><button type="button" class="ui-btn sd-show">👀 Показать ответ</button>'
                + (canRec() ? '<button type="button" class="ui-btn soft sd-rec">🎙 Записать себя</button>' : '') + '</div>'
                + '<div class="sd-judge" hidden><button type="button" class="ui-btn sd-ok">✅ Получилось</button><button type="button" class="ui-btn soft sd-again">🔁 Ещё раз</button></div>'
                + '<audio class="sd-audio" controls hidden></audio><div class="sd-end" hidden></div>';
            deck.append(ui);
            cards.forEach(c => { c.hidden = true; });
            const $q = s => ui.querySelector(s), stage = $q('.sd-stage');
            function show() {
                cards.forEach(c => { c.hidden = true; c.querySelector('.sd-en').hidden = true; });
                stopRec();
                $q('.sd-audio').hidden = true;
                if (!queue.length) {
                    stage.innerHTML = '';
                    $q('.sd-actions').hidden = true;
                    $q('.sd-judge').hidden = true;
                    const end = $q('.sd-end');
                    end.hidden = false;
                    end.innerHTML = '🎉 <b>Готово!</b> С первого раза: <b>' + firstTry.size + ' из ' + cards.length + '</b>. ' + (firstTry.size === cards.length ? 'Отлично!' : 'Повторите ещё раз завтра — станет легче.') + ' <button type="button" class="ui-btn soft sd-restart">🔁 Пройти ещё раз</button>';
                    const out = deck.querySelector('input.sd-result');
                    if (out) {
                        out.value = firstTry.size + ' / ' + cards.length + ' с первого раза';
                        out.dispatchEvent(new Event('input', { bubbles: true }));
                        out.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    return;
                }
                const c = cards[queue[0]];
                stage.innerHTML = '';
                stage.append(c);
                c.hidden = false;
                $q('.sd-actions').hidden = false;
                $q('.sd-judge').hidden = true;
                $q('.sd-end').hidden = true;
                $q('.sd-count').textContent = 'Карточка ' + (done + 1) + ' · осталось ' + queue.length;
                $q('.sd-bar span').style.width = Math.round(firstTry.size / cards.length * 100) + '%';
            }
            ui.addEventListener('click', async (e) => {
                var _a;
                const t = e.target.closest('button');
                if (!t)
                    return;
                const i = queue[0], c = cards[i];
                if (t.classList.contains('sd-show')) {
                    c.querySelector('.sd-en').hidden = false;
                    $q('.sd-judge').hidden = false;
                    (_a = c.querySelector('.sd-en [data-say]')) === null || _a === void 0 ? void 0 : _a.click();
                }
                else if (t.classList.contains('sd-ok')) {
                    if (!seen.has(i))
                        firstTry.add(i);
                    seen.add(i);
                    queue.shift();
                    done++;
                    show();
                }
                else if (t.classList.contains('sd-again')) {
                    seen.add(i);
                    queue.push(queue.shift());
                    done++;
                    show();
                }
                else if (t.classList.contains('sd-restart')) {
                    queue = cards.map((_, k) => k);
                    firstTry = new Set();
                    seen = new Set();
                    done = 0;
                    show();
                }
                else if (t.classList.contains('sd-rec')) {
                    if (rec.mr && rec.mr.state === 'recording') {
                        stopRec();
                        return;
                    }
                    try {
                        rec.stream = rec.stream || await navigator.mediaDevices.getUserMedia({ audio: true });
                        const chunks = [];
                        rec.mr = new MediaRecorder(rec.stream);
                        rec.mr.ondataavailable = ev => chunks.push(ev.data);
                        rec.mr.onstop = () => { t.textContent = '🎙 Записать себя'; t.classList.remove('on'); const a = $q('.sd-audio'); a.src = URL.createObjectURL(new Blob(chunks, { type: rec.mr.mimeType || 'audio/webm' })); a.hidden = false; };
                        rec.mr.start();
                        t.textContent = '⏹ Стоп';
                        t.classList.add('on');
                        setTimeout(stopRec, 15000);
                    }
                    catch (_) {
                        t.disabled = true;
                        t.textContent = '🎙 Микрофон недоступен';
                    }
                }
            });
            show();
        }
        const run = () => document.querySelectorAll('.speak-deck').forEach(setup);
        try {
            showSection = (base => function (...a) { const r = base.apply(this, a); try {
                run();
            }
            catch (_) { } return r; })(showSection);
        }
        catch (_) { }
        run();
    })();
    // ⏱️ Вопросы на скорость: у «picker» с data-timer — таймер на ответ (говорить, пока идёт время)
    (function pickerTimer() {
        document.addEventListener('click', e => {
            const b = e.target.closest('.picker[data-timer] > .btn');
            if (!b)
                return;
            const p = b.closest('.picker'), sec = +p.dataset.timer || 30;
            let t = p.querySelector('.pk-timer');
            if (!t) {
                t = document.createElement('span');
                t.className = 'pk-timer';
                b.after(t);
            }
            clearInterval(p._tm);
            let left = sec;
            t.textContent = '⏱️ ' + left;
            t.classList.remove('over');
            p._tm = setInterval(() => { left--; t.textContent = left > 0 ? '⏱️ ' + left : '⏰ Время!'; if (left <= 0) {
                clearInterval(p._tm);
                t.classList.add('over');
            } }, 1000);
        });
    })();
    /* ---------- 👩‍🏫 Кабинет преподавателя: ученики и их уроки на главной, быстрый выбор урока, домашки на проверку ---------- */
    (function () {
        if (typeof access === 'undefined')
            return;
        const ENTRIES = (() => { try {
            return JSON.parse($('#access-data').textContent).entries || [];
        }
        catch (_) {
            return [];
        } })();
        const lessonsOf = o => (window.irisLessonsOf ? window.irisLessonsOf(o) : DATA.filter(d => d.owner === o));
        const nameOf = o => (window.irisStudentName ? window.irisStudentName(o) : o);
        const owners = () => [...new Set(DATA.map(d => d.owner))].filter(o => ENTRIES.some(e => e.profile === o));
        const ownerOfWork = x => { var _a; return access.recOwner ? access.recOwner(x) : (((_a = lessonMeta(x.l)) === null || _a === void 0 ? void 0 : _a.owner) || ''); }; // по ученику, а не по уроку: урок из учебника бывает у нескольких
        // уроки ученика: номер урока, отдельно — грамматические домашки
        function plan(o) {
            const all = lessonsOf(o), lessons = all.filter(d => d.kind !== 'homework'), hws = all.filter(d => d.kind === 'homework'), opened = access.draftsOpened(o);
            const visible = d => !d.draft || opened.includes(d.id);
            const current = lessons.filter(visible).slice(-1)[0] || lessons[0], next = lessons.find(d => d.draft && !opened.includes(d.id));
            return { lessons, hws, current, next, num: d => lessons.indexOf(d) + 1, visible };
        }
        const works = () => access.inbox();
        function openLessonAsTeacher(id) { state.role = 'teacher'; save(); closePicker(); openLesson(id); }
        // урок из учебника: открываем «для» ученика (класс и ответы — его), с полки — просто посмотреть
        function openFor(id, owner) { const d = DATA.find(x => x.id === id); if (!(d === null || d === void 0 ? void 0 : d.book) || !access.bookOpen) {
            openLessonAsTeacher(id);
            return;
        } closePicker(); closeAssign(); access.bookOpen(id, owner && owner !== 'book' ? owner : ''); }
        const bookLessons = () => DATA.filter(d => d.book);
        const bookWhoText = id => { const w = access.bookWho ? access.bookWho(id) : []; return w.length ? 'у ' + w.map(nameOf).join(', ') : 'пока ни у кого'; };
        const bookTag = d => d.book ? '<i class="bk-tag">📚 ' + esc(d.book.u || 'учебник') + '</i> ' : '';
        function openPlan(id) {
            state.role = 'teacher';
            save();
            route('teacher');
            setTimeout(() => { const root = $('#teacher'); if (!root)
                return; const b = document.createElement('button'); b.type = 'button'; b.hidden = true; b.dataset.hubPlan = id; root.appendChild(b); b.click(); b.remove(); }, 60);
        }
        // главная преподавателя
        function cockpit() {
            var _a;
            const home = $('#screen-home');
            if (!home || !access.teacher)
                return false;
            const ws = works(), cnt = k => ws.filter(x => access.workState(x) === k).length;
            const q = (((_a = home.querySelector('[data-t-search]')) === null || _a === void 0 ? void 0 : _a.value) || '').trim();
            const card = o => {
                const p = plan(o), mine = ws.filter(x => ownerOfWork(x) === o), todo = mine.filter(x => access.workState(x) === 'todo').length, done = mine.filter(x => access.workState(x) === 'done').length, prog = mine.filter(x => access.workState(x) === 'progress').length;
                const here = access.onlineIn ? access.onlineIn(o) : [], dot = here.length ? '<span class="t-online" title="Сейчас на платформе">🟢 ' + here.map(x => esc(x.name) + (x.at === 'class' ? ' на уроке' : x.at === 'lesson' ? ' в уроке' : ' на платформе')).join(', ') + '</span>' : '';
                const level = (p.current || p.lessons.slice(-1)[0] || {}).level || '', text = (nameOf(o) + ' ' + lessonsOf(o).map(d => d.title).join(' ')).toLowerCase();
                const li = d => '<li><button type="button" class="t-l' + (d === p.current ? ' current' : '') + (p.visible(d) ? '' : ' draft') + '" data-t-open="' + esc(d.id) + '"><span class="t-n">' + p.num(d) + '</span><span class="t-title">' + bookTag(d) + esc(d.title) + (p.visible(d) ? '' : ' <i>🔒 ученик пока не видит</i>') + '<small>' + esc(d.grammar || '') + '</small></span></button><button type="button" class="ui-link t-plan" data-t-plan="' + esc(d.id) + '">План</button></li>';
                return '<article class="t-card' + (todo ? ' has-todo' : '') + (here.length ? ' is-online' : '') + '" data-t-owner="' + esc(o) + '" data-t-text="' + esc(text) + '">'
                    + '<header><span class="t-av" aria-hidden="true">' + esc(nameOf(o).slice(0, 1)) + '</span><div><b>' + esc(nameOf(o)) + '</b><small>' + esc(level) + ' · уроков: ' + p.lessons.length + '</small>' + dot + '</div>'
                    + (todo ? '<button type="button" class="t-todo" data-t-check="todo" data-t-who="' + esc(o) + '">📥 ' + todo + ' на проверку</button>' : '') + '</header>'
                    + (p.current ? '<div class="t-now"><div><small>СЕЙЧАС · УРОК ' + p.num(p.current) + '</small><b>' + esc(p.current.title) + '</b></div><button type="button" class="ui-btn small" data-t-open="' + esc(p.current.id) + '">' + (here.length ? '▶ Начать урок' : '▶ Открыть урок') + '</button></div>' : '')
                    + (p.next ? '<div class="t-next">🔒 Следующий урок: <b>' + esc(p.next.title) + '</b><span><button type="button" class="ui-link" data-t-open="' + esc(p.next.id) + '">Посмотреть</button><button type="button" class="ui-link" data-t-unlock="' + esc(p.next.id) + '">Открыть ученику</button></span></div>' : '')
                    + '<details class="t-all"><summary>Все уроки (' + p.lessons.length + ')' + (p.hws.length ? ' и домашки' : '') + '</summary><ol class="t-lessons">' + p.lessons.slice().reverse().map(li).join('') + '</ol>'
                    + (p.hws.length ? '<ul class="t-hws">' + p.hws.map(d => '<li><button type="button" class="t-l" data-t-open="' + esc(d.id) + '">📝 <span class="t-title">' + esc(d.title) + '</span></button><button type="button" class="ui-link t-plan" data-t-plan="' + esc(d.id) + '">План</button></li>').join('') + '</ul>' : '') + '</details>'
                    + '<footer><span>' + (mine.length ? ['📥 ждут: ' + todo, '✍️ делают: ' + prog, '✓ проверено: ' + done].join(' · ') : 'Работ пока нет') + '</span>' + (mine.length ? '<button type="button" class="ui-link" data-t-check="all" data-t-who="' + esc(o) + '">Работы ученика →</button>' : '') + '</footer></article>';
            };
            home.innerHTML = '<div class="t-cockpit"><div class="home-intro t-intro"><div class="kicker">IRIS SCHOOL · КАБИНЕТ ПРЕПОДАВАТЕЛЯ</div><h1>Мои ученики</h1><p>Откройте урок ученика — класс откроется сам, и ученик подключится, как только откроет свой урок. Ссылки отправлять не нужно.</p></div>'
                + '<div class="t-stats">'
                + '<button type="button" class="t-stat todo" data-t-check="todo"><b>' + cnt('todo') + '</b><span>ждут проверки</span></button>'
                + '<button type="button" class="t-stat" data-t-check="progress"><b>' + cnt('progress') + '</b><span>делают сейчас</span></button>'
                + '<button type="button" class="t-stat" data-t-check="done"><b>' + cnt('done') + '</b><span>проверено</span></button>'
                + '<button type="button" class="t-stat" data-t-plans><b>' + owners().length + '</b><span>учеников · планы уроков</span></button></div>'
                + '<div class="t-search"><input type="search" class="field" data-t-search placeholder="🔎 Найти ученика или урок…" aria-label="Найти ученика или урок" value="' + esc(q) + '"></div>'
                + bookShelf() + '<div class="t-grid">' + owners().sort((a, b) => { const on = o => (access.onlineIn ? access.onlineIn(o).length : 0) ? 2 : 0, td = o => works().some(x => ownerOfWork(x) === o && access.workState(x) === 'todo') ? 1 : 0; return (on(b) + td(b)) - (on(a) + td(a)); }).map(card).join('') + '</div></div>';
            filter(q);
            return true;
        }
        // 📚 полка «Учебник» на главной: уроки по учебнику, у кого они, «Прикрепить ученику»
        function bookShelf() {
            const ls = bookLessons();
            if (!ls.length)
                return '';
            const books = [...new Set(ls.map(d => d.book.t).filter(Boolean))];
            let open = false;
            try {
                open = localStorage.getItem('iris-t-book') === '1';
            }
            catch (_) { }
            return '<details class="t-book" data-t-owner="book"' + (open ? ' open' : '') + '><summary><span class="t-av" aria-hidden="true">📚</span><span class="t-book-name"><b>Учебник</b><small>' + esc(books.join(' · ') || 'уроки по учебнику') + ' · уроков: ' + ls.length + '</small></span><span class="t-book-hint">Прикрепите урок ученику — он появится у него в кабинете</span></summary><ol class="t-lessons">'
                + ls.map(d => '<li><button type="button" class="t-l" data-t-open="' + esc(d.id) + '"><span class="t-n">' + esc(d.code || '📚') + '</span><span class="t-title">' + esc(d.title) + '<small>' + esc([d.book.u, d.grammar].filter(Boolean).join(' · ')) + ' · <b class="bk-who">' + esc(bookWhoText(d.id)) + '</b></small></span></button><button type="button" class="ui-btn small soft" data-book-assign="' + esc(d.id) + '">Прикрепить ученику</button></li>').join('')
                + '</ol></details>';
        }
        document.addEventListener('toggle', e => { var _a, _b; if ((_b = (_a = e.target).matches) === null || _b === void 0 ? void 0 : _b.call(_a, '.t-book'))
            try {
                localStorage.setItem('iris-t-book', e.target.open ? '1' : '0');
            }
            catch (_) { } }, true);
        // окно «Прикрепить ученику»: отмеченные ученики получат урок у себя в кабинете
        const assign = document.createElement('div');
        assign.className = 'book-assign';
        assign.hidden = true;
        assign.setAttribute('role', 'dialog');
        assign.setAttribute('aria-label', 'Прикрепить урок ученику');
        document.body.appendChild(assign);
        function openAssign(id) {
            var _a;
            const d = DATA.find(x => x.id === id);
            if (!d)
                return;
            const who = access.bookWho ? access.bookWho(id) : [];
            assign.dataset.id = id;
            assign.innerHTML = '<div class="lp-card"><div class="lp-head"><h2>Прикрепить урок</h2><button type="button" class="ui-btn outline small" data-ba-close>Закрыть</button></div>'
                + '<p class="ba-lesson">📚 <b>' + esc(d.title) + '</b>' + (((_a = d.book) === null || _a === void 0 ? void 0 : _a.u) ? ' · ' + esc(d.book.u) : '') + '</p><p class="ba-note">Отметьте учеников — урок появится у них в «Моих уроках». Новую ссылку отправлять не нужно. Снимете галочку — урок у ученика пропадёт (его ответы сохранятся).</p>'
                + '<div class="ba-list">' + owners().map(o => '<label class="ba-row"><input type="checkbox" value="' + esc(o) + '"' + (who.includes(o) ? ' checked' : '') + '><span class="t-av">' + esc(nameOf(o).slice(0, 1)) + '</span><span>' + esc(nameOf(o)) + '<small>' + esc((lessonsOf(o).filter(x => !x.book).slice(-1)[0] || {}).level || '') + '</small></span></label>').join('') + '</div>'
                + '<div class="ba-actions"><button type="button" class="ui-btn" data-ba-save>Сохранить</button></div></div>';
            assign.hidden = false;
            document.body.classList.add('lp-open');
        }
        function closeAssign() { assign.hidden = true; if (picker.hidden)
            document.body.classList.remove('lp-open'); }
        assign.addEventListener('click', async (e) => {
            if (e.target === assign || e.target.closest('[data-ba-close]')) {
                closeAssign();
                return;
            }
            const b = e.target.closest('[data-ba-save]');
            if (!b)
                return;
            const id = assign.dataset.id, d = DATA.find(x => x.id === id), was = access.bookWho(id), want = $$('input[type=checkbox]', assign).filter(c => c.checked).map(c => c.value);
            b.disabled = true;
            b.textContent = 'Сохраняю…';
            const { ok, changed } = await access.bookAssign(id, want);
            closeAssign();
            const added = want.filter(o => !was.includes(o)), gone = was.filter(o => !want.includes(o));
            notify(!changed.length ? 'Ничего не изменилось.' : !ok ? 'Сохранено. Сервер связи сейчас не ответил — отправлю ещё раз, когда вы снова откроете платформу.'
                : [added.length ? '✅ «' + d.title + '» теперь у: ' + added.map(nameOf).join(', ') + '. Урок уже в их кабинете.' : '', gone.length ? 'Убран у: ' + gone.map(nameOf).join(', ') + '.' : ''].filter(Boolean).join(' '));
            refreshBook();
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !assign.hidden)
            closeAssign(); });
        document.addEventListener('click', e => { const b = e.target.closest('[data-book-assign]'); if (b) {
            e.preventDefault();
            openAssign(b.dataset.bookAssign);
        } });
        function refreshBook() { try {
            if (screen === 'home')
                cockpit();
            else if (screen === 'library')
                renderLibrary();
            bookBar();
        }
        catch (_) { } }
        window.irisBookChanged = refreshBook;
        // библиотека: с полки «Учебник» урок открывается просто посмотреть (не для ученика)
        document.addEventListener('click', e => { var _a; const b = e.target.closest('#screen-library [data-open]'); if (!b || !access.teacher || !((_a = DATA.find(x => x.id === b.dataset.open)) === null || _a === void 0 ? void 0 : _a.book))
            return; e.preventDefault(); e.stopPropagation(); openFor(b.dataset.open, ''); }, true);
        renderLibrary = (base => function (...a) {
            const r = base.apply(this, a);
            try {
                if (!access.teacher)
                    return r;
                $$('#screen-library .material-card').forEach(c => {
                    var _a, _b;
                    const id = (_a = c.querySelector('[data-open]')) === null || _a === void 0 ? void 0 : _a.dataset.open, d = DATA.find(x => x.id === id);
                    if (!(d === null || d === void 0 ? void 0 : d.book))
                        return;
                    c.classList.add('book-card');
                    const who = c.querySelector('.card-top span:last-child');
                    if (who)
                        who.textContent = '📚 ' + (d.book.t || 'Учебник') + (d.book.u ? ' · ' + d.book.u : '');
                    (_b = c.querySelector('.card-bottom')) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML('beforebegin', '<div class="bk-row"><small class="bk-who">' + esc(bookWhoText(id)) + '</small><button type="button" class="ui-btn small soft" data-book-assign="' + esc(id) + '">Прикрепить ученику</button></div>');
                });
                const hint = $('#screen-library .hint-panel');
                if (hint && bookLessons().length)
                    hint.innerHTML = '<strong>📚 Учебник</strong><br>Уроки по учебнику лежат здесь, в вашей библиотеке. Нажмите «Прикрепить ученику» — урок появится у него в кабинете.';
            }
            catch (_) { }
            return r;
        })(renderLibrary);
        // в уроке из учебника: у кого он, с кем вы его сейчас ведёте, «Прикрепить ученику»
        function bookBar() {
            let bar = $('#book-bar');
            const d = screen === 'lesson' && access.teacher && currentLesson ? DATA.find(x => x.id === currentLesson && x.book) : null;
            if (!d) {
                if (bar)
                    bar.hidden = true;
                return;
            }
            if (!bar) {
                bar = document.createElement('div');
                bar.id = 'book-bar';
                bar.className = 'book-bar';
            }
            const host = $('#screen-lesson'), sw = $('#lesson-switch-box');
            if (sw && sw.parentElement === host) {
                if (sw.nextElementSibling !== bar)
                    sw.after(bar);
            }
            else if (bar.parentElement !== host)
                host === null || host === void 0 ? void 0 : host.prepend(bar);
            const who = access.bookWho(d.id), ctx = access.bookCtx(d.id);
            const sig = d.id + '|' + who.join() + '|' + ctx;
            bar.hidden = false;
            if (bar.dataset.sig === sig)
                return;
            bar.dataset.sig = sig;
            bar.innerHTML = '<span class="bk-ico" aria-hidden="true">📚</span><span class="bk-text"><span><b>Урок из учебника</b>' + (d.book.t ? ' · ' + esc(d.book.t) + (d.book.u ? ', ' + esc(d.book.u) : '') : '') + '</span><small>' + (who.length ? 'Прикреплён: ' + esc(who.map(nameOf).join(', ')) : 'Ещё ни у кого из учеников') + '</small></span>'
                + (who.length ? '<label class="bk-ctx">Урок с: <select data-book-ctx><option value="">— просто посмотреть —</option>' + who.map(o => '<option value="' + esc(o) + '"' + (o === ctx ? ' selected' : '') + '>' + esc(nameOf(o)) + '</option>').join('') + '</select></label>' : '')
                + '<button type="button" class="ui-btn small" data-book-assign="' + esc(d.id) + '">Прикрепить ученику</button>';
        }
        document.addEventListener('change', e => { var _a, _b; const s = (_b = (_a = e.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '[data-book-ctx]'); if (s && currentLesson)
            openFor(currentLesson, s.value); });
        updateChrome = (base => function (...a) { const r = base.apply(this, a); try {
            bookBar();
        }
        catch (_) { } return r; })(updateChrome);
        function filter(q) { q = q.toLowerCase(); $$('#screen-home .t-card').forEach(c => { c.hidden = !!q && !c.dataset.tText.includes(q); }); }
        window.irisTeacherHome = () => { if (screen === 'home')
            cockpit(); };
        renderHome = (base => function (...a) { const r = base.apply(this, a); try {
            if (access.teacher)
                cockpit();
        }
        catch (_) { } return r; })(renderHome);
        document.addEventListener('input', e => { var _a, _b; if ((_b = (_a = e.target).matches) === null || _b === void 0 ? void 0 : _b.call(_a, '[data-t-search]'))
            filter(e.target.value.trim()); });
        document.addEventListener('click', async (e) => {
            var _a;
            const o = e.target.closest('[data-t-open]');
            if (o) {
                openFor(o.dataset.tOpen, (_a = o.closest('[data-t-owner]')) === null || _a === void 0 ? void 0 : _a.dataset.tOwner);
                return;
            }
            const p = e.target.closest('[data-t-plan]');
            if (p) {
                openPlan(p.dataset.tPlan);
                return;
            }
            const c = e.target.closest('[data-t-check]');
            if (c) {
                access.openChecking(c.dataset.tWho || '', c.dataset.tCheck);
                return;
            }
            if (e.target.closest('[data-t-plans]')) {
                state.role = 'teacher';
                save();
                route('teacher');
                return;
            }
            const u = e.target.closest('[data-t-unlock]');
            if (u) {
                u.disabled = true;
                const ok = await access.openForStudents(u.dataset.tUnlock);
                notify(ok ? '✅ Урок открыт ученику.' : 'Сервер связи не ответил — урок откроется ученику, когда вы начнёте с ним живой урок.');
                cockpit();
            }
        });
        // 📚 Выбор урока: окно с поиском — ученики и их уроки, текущий урок отмечен
        const picker = document.createElement('div');
        picker.className = 'lesson-picker';
        picker.hidden = true;
        picker.setAttribute('role', 'dialog');
        picker.setAttribute('aria-label', 'Выбор урока');
        document.body.appendChild(picker);
        function openPicker() {
            const cur = currentLesson;
            picker.innerHTML = '<div class="lp-card"><div class="lp-head"><h2>Выберите урок</h2><button type="button" class="ui-btn outline small" data-lp-close>Закрыть</button></div><input type="search" class="field" data-lp-search placeholder="🔎 Ученик или урок…" aria-label="Найти ученика или урок"><div class="lp-list">'
                + owners().map(o => {
                    const p = plan(o);
                    return '<section class="lp-student" data-t-owner="' + esc(o) + '" data-lp-text="' + esc((nameOf(o) + ' ' + lessonsOf(o).map(d => d.title).join(' ')).toLowerCase()) + '"><h3><span class="t-av">' + esc(nameOf(o).slice(0, 1)) + '</span>' + esc(nameOf(o)) + '</h3><div class="lp-lessons">'
                        + p.lessons.slice().reverse().map(d => '<button type="button" class="lp-l' + (d.id === cur ? ' on' : '') + (p.visible(d) ? '' : ' draft') + '" data-t-open="' + esc(d.id) + '"><span class="t-n">' + p.num(d) + '</span><span><b>' + bookTag(d) + esc(d.title) + '</b><small>' + esc(d.grammar || '') + (p.visible(d) ? '' : ' · 🔒 новый') + '</small></span></button>').join('')
                        + p.hws.map(d => '<button type="button" class="lp-l hw' + (d.id === cur ? ' on' : '') + '" data-t-open="' + esc(d.id) + '"><span class="t-n">📝</span><span><b>' + esc(d.title) + '</b><small>домашнее задание</small></span></button>').join('') + '</div></section>';
                }).join('')
                + (bookLessons().length ? '<section class="lp-student lp-book" data-t-owner="book" data-lp-text="' + esc(('учебник ' + bookLessons().map(d => d.title + ' ' + (d.book.u || '')).join(' ')).toLowerCase()) + '"><h3><span class="t-av">📚</span>Учебник</h3><div class="lp-lessons">'
                    + bookLessons().map(d => '<button type="button" class="lp-l' + (d.id === cur ? ' on' : '') + '" data-t-open="' + esc(d.id) + '"><span class="t-n">' + esc(d.code || '📚') + '</span><span><b>' + esc(d.title) + '</b><small>' + esc(bookWhoText(d.id)) + '</small></span></button>').join('') + '</div></section>' : '') + '</div></div>';
            picker.hidden = false;
            document.body.classList.add('lp-open');
            const on = picker.querySelector('.lp-l.on');
            if (on)
                on.closest('.lp-student').scrollIntoView({ block: 'start' });
            setTimeout(() => { var _a; return (_a = picker.querySelector('[data-lp-search]')) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true }); }, 30);
        }
        function closePicker() { picker.hidden = true; document.body.classList.remove('lp-open'); }
        window.irisLessonPicker = openPicker;
        picker.addEventListener('click', e => { if (e.target === picker || e.target.closest('[data-lp-close]'))
            closePicker(); });
        picker.addEventListener('input', e => { if (!e.target.matches('[data-lp-search]'))
            return; const q = e.target.value.trim().toLowerCase(); $$('.lp-student', picker).forEach(s => { const hit = !q || s.dataset.lpText.includes(q); s.hidden = !hit; }); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !picker.hidden)
            closePicker(); });
        document.addEventListener('click', e => { if (e.target.closest('[data-lesson-pick]'))
            openPicker(); });
    })();
    $$('#lesson-panels > .pane').forEach(pane => { decorateNotes(pane); initializePane(pane); });
    state.materials.forEach(createMaterialPane);
    profile();
    hydrate();
    function openFromHash() {
        const h = decodeURIComponent(location.hash.slice(1));
        if (h === 'teacher') {
            state.role = 'teacher';
            route('teacher', false);
            return;
        }
        if (['home', 'library', 'words', 'builder'].includes(h)) {
            route(h, false);
            return;
        }
        const m = allLessons().find(m => m.id === h || sectionsFor(m.id).some(s => s.id === h));
        if (m) {
            state.role = 'student';
            openLesson(m.id, h);
            return;
        }
        route('home', false);
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
})();
