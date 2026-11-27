"""Конструктор уроков: те же блоки и та же разметка, что у уроков платформы.
Урок = запись для списка уроков (DATA) + панель HTML. Всё текстовое экранируется здесь."""
import html, json, os, re, datetime, random

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMG = os.path.join(ROOT, 'platform', 'img')
GAMES = open(os.path.join(os.path.dirname(__file__), 'games.html'), encoding='utf8').read()
e = lambda s: html.escape(str(s), quote=True)
RU_DAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']
RU_MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
EN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


def img(emoji, cls='pic'):
    if not emoji:
        return ''
    name = '-'.join('%x' % ord(c) for c in emoji)
    if not os.path.exists(os.path.join(IMG, name + '.webp')):
        name = '-'.join('%x' % ord(c) for c in emoji if ord(c) != 0xfe0f)
        if not os.path.exists(os.path.join(IMG, name + '.webp')):
            return ''
    return '<img class="%s" src="img/%s.webp" alt="" loading="lazy" decoding="async">' % (cls, name)


def ru(text):
    return '<span class="ru-line">%s</span>' % text if text else ''


def say(text):
    return '<button class="say" type="button" data-say="%s" aria-label="Послушать: %s">🔊</button>' % (e(text), e(text))


class Ids:
    """Уникальные id полей урока: <префикс>-<имя>-<n>."""
    def __init__(self, prefix):
        self.p, self.n = prefix, {}

    def __call__(self, name):
        self.n[name] = self.n.get(name, 0) + 1
        return '%s-%s-%d' % (self.p, name, self.n[name])


def rubric(letter, en, ruline=''):
    return '<p class="rubric"><b class="rl">%s</b> %s%s</p>' % (letter, en, ru(ruline))


def task(items):
    return '<div class="task"><b>What to do · Что делать</b><ol>%s</ol></div>' % ''.join('<li>%s%s</li>' % (a, ru(b)) for a, b in items)


def intro(emoji, bold, rest='', ruline=''):
    return '<div class="box hw-intro">%s <b>%s</b>%s%s</div>' % (img(emoji, 'pic-inline'), bold, (' · ' + rest) if rest else '', ru(ruline))


def box(inner, emoji=''):
    return '<div class="box">%s %s</div>' % (img(emoji, 'pic-inline'), inner)


def phrases(items):
    return '<div class="phrases">%s</div>' % ''.join('<span>%s</span>' % e(x) for x in items)


def bank(code, theme, cards):
    """cards: (word, definition, перевод, пример, emoji)"""
    out = []
    for w, d, r, ex, em in cards:
        back = (e(d) + '<br>' if d else '') + ru(e(r)) + ('<i>%s</i>' % e(ex) if ex else '')
        out.append('<div class="flip-wrap"><button class="flip"><div class="flip-inner"><div class="flip-front">%s%s</div><div class="flip-back">%s</div></div></button>\n'
                   '        <div class="flip-tools">%s<button class="flip-save" type="button" data-flip-save="%s" data-term="%s" aria-label="Добавить %s в словарь">+ В мой словарь</button></div></div>'
                   % (img(em, 'card-img card-3d'), e(w), back, say(w), e(w), e(w), e(w)))
    return '<div class="bank bank-vocabulary"><div class="bank-head"><span>Vocabulary Bank</span><b>%s</b><em>%s</em></div><div class="flip-grid">\n        %s</div></div>' % (e(code), e(theme), ''.join(out))


def listening(lid, lines, title, small='Listen twice · Use 🐢 if it\'s fast · Text at the end', emoji='🎧', names=None):
    """lines: [(who, text)], who: f / m / f2 / m2; names: {who: 'Sam'}"""
    names = names or {}
    data = json.dumps([[w, t] for w, t in lines], ensure_ascii=False)
    tr = ''.join('<li><button class="lis-line" type="button" aria-label="Послушать строку">🔊</button><span class="who">%s:</span>%s</li>' % (e(names.get(w, w)), e(t)) for w, t in lines)
    return ('<div class="listening" id="%s" data-lines="%s"><div class="lis-head">%s<div><b>%s</b><small>%s</small></div></div>'
            '<div class="lis-controls"><button type="button" class="lis-play">▶ Слушать · Listen</button><button type="button" class="lis-slow" aria-pressed="false">🐢 Медленнее · Slower</button>'
            '<button type="button" class="lis-script">📄 Показать текст · Transcript</button><span class="lis-status"></span></div><ol class="lis-transcript" hidden>%s</ol></div>'
            % (lid, e(data), img(emoji), e(title), e(small), tr))


def mc(mid, q, opts, ok=0):
    order = list(range(len(opts)))
    if set(opts) not in KEEP_ORDER:  # правильный ответ не всегда первым (перемешано одинаково при каждой сборке)
        random.Random('iris-mc:' + mid).shuffle(order)
    return '<div class="mc" id="%s"><p class="q">%s</p><div class="opts">%s</div></div>' % (
        mid, q, ''.join('<button class="opt"%s>%s</button>' % (' data-ok' if i == ok else '', e(opts[i])) for i in order))


def deck(title, mcs):
    return '<div class="deck" data-title="%s">%s</div>' % (e(title), ''.join(mcs))


def _ex(items):
    return ('<div class="ex">\n        <ol class="items">\n%s        </ol>\n'
            '        <div class="ex-actions"><button class="btn check">Проверить</button><button class="btn ghost reveal">Показать ответы</button><span class="result" aria-live="polite"></span></div>\n    </div>'
            % ''.join('            <li>%s</li>\n' % x for x in items))


KEEP_ORDER = ({'True', 'False'}, {'Yes', 'No'}, {'True', 'False', 'Not given'}, {'Right', 'Wrong'})


def select(fid, answer, options):
    if set(options) not in KEEP_ORDER:  # правильный вариант не всегда первым: перемешано, одинаково при каждой сборке
        options = random.Random('iris-select:' + fid).sample(list(options), len(options))
    return '<select class="gap" id="%s" data-a="%s"><option value="">…</option>%s</select>' % (fid, e(answer), ''.join('<option>%s</option>' % e(o) for o in options))


def gap(fid, answers, size=12, near=None, near_msg=''):
    a = answers if isinstance(answers, str) else '|'.join(answers)
    extra = ' data-near="%s" data-near-msg="%s"' % (e('|'.join(near)), e(near_msg)) if near else ''
    return '<input class="gap" id="%s" data-a="%s"%s autocomplete="off" autocapitalize="off" size="%d">' % (fid, e(a), extra, size)


def ex_select(ids, items):
    """items: (before_html, answer, options, after_html)"""
    return _ex(['%s %s%s' % (b, select(ids('s'), a, o), (' ' + af) if af else '') for b, a, o, af in items])


def ex_gaps(ids, items, size=12):
    """items: (before, answers, after[, hint]) — hint показывается курсивом (go)"""
    out = []
    for it in items:
        b, a, af = it[:3]
        hint = ' <i>(%s)</i>' % e(it[3]) if len(it) > 3 and it[3] else ''
        out.append('%s %s%s %s' % (e(b), gap(ids('g'), a, size), hint, e(af)))
    return _ex(out)


def ex_lines(ids, items, placeholder='Write the correct sentence…'):
    """Целое предложение: items: (prompt_html, answers)"""
    return _ex(['%s<input class="gap line" id="%s" data-a="%s" placeholder="%s">' % (p, ids('l'), e('|'.join(a) if not isinstance(a, str) else a), e(placeholder)) for p, a in items])


def ex_order(ids, items):
    """items: (chunks, answer) — chunks перемешаны как есть"""
    return _ex(['<span class="order-words" data-words="%s"></span><input class="gap line" id="%s" data-a="%s" placeholder="Tap the words in the right order…">' % (e('|'.join(c)), ids('o'), e(a)) for c, a in items])


def ex_listen_pick(ids, items):
    """🔊 → выбрать: items: (text_to_say, answer, options)"""
    return _ex(['%s → %s' % (say(t), select(ids('h'), a, o)) for t, a, o in items])


def ex_pic(ids, items):
    """картинка → слово: items: (emoji, answer, options)"""
    return _ex(['%s → %s' % (img(em, 'pic-inline'), select(ids('p'), a, o)) for em, a, o in items])


def reading(title, small, paragraphs):
    return '<div class="reading"><h3>%s</h3><p class="small">%s</p>%s</div>' % (e(title), e(small), ''.join('<p>%s</p>' % e(p) for p in paragraphs))


def easy(title, idea, rows, examples, traps, note='', choose=None):
    """Grammar Easy: idea (html), rows: [[(text, blk-a..d)]], examples: [(emoji, sentence)], traps: [(wrong, right, why)],
    choose: [(ситуация по-русски, форма / пример)] — шаг «Как выбрать», когда форм несколько"""
    def row(r):
        return '<div class="eg-row">%s</div>' % '<span class="eg-plus">+</span>'.join('<span class="blk blk-%s">%s</span>' % (c, e(t)) for t, c in r)
    ex = ''.join('<li>%s<span>%s</span>%s</li>' % (img(em), e(s), say(s)) for em, s in examples)
    tr = ''.join('<div>❌ <s>%s</s> → <span class="ok">✅ %s</span><br><small>%s</small></div>' % (e(w), e(r), why) for w, r, why in traps)
    steps = [('Одна мысль', '<p>%s</p>' % idea)]
    if choose:
        steps.append(('Как выбрать? Спросите себя', '<div class="eg-choose">%s</div>' % ''.join(
            '<div><span>%s</span><b>→</b><span class="eg-form">%s</span></div>' % (q, a) for q, a in choose)))
    steps += [('Формула-конструктор', ''.join(row(r) for r in rows) + ('<p class="eg-note">%s</p>' % note if note else '')),
              ('Смотри, как это работает · нажми 🔊', '<ul class="eg-ex">%s</ul>' % ex),
              ('Осторожно!', '<div class="eg-traps">%s</div>' % tr)]
    return ('<div class="easy-g"><div class="eg-head"><span>Grammar Easy · Грамматика без страха</span><b>%s</b></div>%s</div>'
            % (title, ''.join('<div class="eg-step"><span class="eg-n">%d</span><div><b>%s</b>%s</div></div>' % (i, h, b)
                              for i, (h, b) in enumerate(steps, 1))))


def say_list(items):
    return '<ul class="say-list stress">%s</ul>' % ''.join('<li>%s<span>%s</span></li>' % (say(t), label) for t, label in items)


def picker(questions):
    return ('<div class="picker">\n        <div class="shown-q">Press the button · Нажмите кнопку</div>\n        <button class="btn" type="button">Next question</button>\n        <span class="count"></span>\n        <ul>\n%s        </ul>\n    </div>'
            % ''.join('            <li>%s</li>\n' % e(q) for q in questions))


def lines(ids, placeholders):
    return '<ol class="items">%s</ol>' % ''.join('<li><input class="gap line" id="%s" placeholder="%s"></li>' % (ids('w'), e(p)) for p in placeholders)


def send_box():
    return ('<div class="send-box"><div><strong>Готово? Отправьте ответы преподавателю</strong><p>Ответы сразу придут преподавателю на платформу — пересылать в Telegram ничего не нужно. '
            'Нет интернета? Ответы сохранятся и отправятся сами. Открыть их может только преподаватель.</p></div><button class="ui-btn" type="button" data-send-answers>Отправить преподавателю</button></div>')


def selfcheck(ids, cans):
    items = ''.join('\n        <li>%s%s<select class="gap" id="%s"><option value="">…</option><option>😃</option><option>🙂</option><option>🤔</option></select></li>' % (en, ru(r), ids('can')) for en, r in cans)
    return ('<p class="rubric"><b class="rl">a</b> Listen to your teacher. Repeat the corrected sentences.<span class="ru-line">Послушайте преподавателя и повторите исправленные фразы.</span></p>'
            '<div class="two-col"><div class="box"><strong>Great!</strong><input class="gap line" id="%s" placeholder="1."><input class="gap line" id="%s" placeholder="2."></div>'
            '<div class="box"><strong>Let\'s fix</strong><input class="gap line" id="%s" placeholder="1."><input class="gap line" id="%s" placeholder="2."></div></div>'
            '<p class="rubric"><b class="rl">b</b> Can you do these things?<span class="ru-line">Вы можете это сделать?</span></p><ol class="items selfcheck">%s\n    </ol>'
            % (ids('good'), ids('good'), ids('fix'), ids('fix'), items))


def games_block(lid, words, case, title='Play and review', mins='10 min'):
    """words: (word, перевод); case: {'bad': [(wrong, right)], 'ok': [sentences]}"""
    gw = [{'w': w, 'd': '', 'ru': r} for w, r in words]
    gc = {'bad': [{'b': b, 'r': r} for b, r in case['bad']], 'ok': case['ok']}
    says = '<div hidden>%s</div>' % ''.join('<button class="say game-say" type="button" data-say="%s" hidden aria-hidden="true">🔊</button>' % e(w) for w, _ in words)
    cards = GAMES.replace('{LID}', lid).replace('{SAYS}', says)
    return ('<div class="games-hero">%s<div><b>Game time!</b><span>Слова урока в играх: пары, скорость, буквы и даже детектив. Выбирайте любую.</span></div></div>\n'
            '    <div class="task"><b>What to do · Что делать</b><ol><li>Play with the words from this lesson — great for review before the next lesson!<span class="ru-line">Играйте со словами урока — это лучший способ повторить их.</span></li>'
            '<li>Your best results are saved and your teacher can see them.<span class="ru-line">Лучшие результаты сохраняются, преподаватель их видит.</span></li></ol></div>\n'
            '    <div class="games" data-lesson="%s" data-game-words="%s" data-game-case="%s">%s</div>'
            % (img('🎮', 'games-hero-pic'), lid, e(json.dumps(gw, ensure_ascii=False)), e(json.dumps(gc, ensure_ascii=False)), cards))


def section(sid, label, title, mins, body, lock=None):
    """lock: (iso_date, day_no) — открывается в этот день в полночь"""
    if lock:
        d = datetime.date.fromisoformat(lock[0])
        when = '%s %d %s · %s, %d %s' % (EN_DAYS[d.weekday()], d.day, EN_MONTHS[d.month - 1], RU_DAYS[d.weekday()], d.day, RU_MONTHS[d.month - 1])
        body = '<div class="day-lock" data-unlock="%s" data-day="%d" data-when="%s">%s</div>' % (lock[0], lock[1], e(when), body)
    return '<section class="step" id="%s" data-label="%s">\n    <div class="step-head"><h2>%s</h2><span class="mins">%s</span></div>\n    %s\n</section>' % (sid, e(label), title, e(mins), body)


def pane(lid, eyebrow, title, lead, tags, sections, quote=None):
    nav = ''.join('<a href="#%s">%s</a>' % (s[0], e(s[1])) for s in sections if not s[0].endswith('-games'))
    q = '<div class="ef-quote">“%s”<small>%s</small></div>' % (e(quote[0]), e(quote[1])) if quote else ''
    return ('<div class="pane" id="%s" hidden>\n<header class="hero"><div class="hero-inner">\n    <div class="eyebrow">%s</div>\n    <h1>%s</h1>\n    <p class="lead">%s</p>\n    %s\n'
            '    <div class="tags">%s</div>\n</div></header>\n\n<nav class="lesson-nav">\n    %s\n</nav>\n\n<main>\n%s\n</main>\n</div>'
            % (lid, e(eyebrow), e(title), lead, q, ''.join('<span class="tag">%s</span>' % e(t) for t in tags), nav, '\n\n'.join(s[2] for s in sections)))


def lesson(meta, owner_meta, sections_html, eyebrow, lead, tags, quote=None):
    """meta — поля DATA; sections_html: [(id, label, html)]"""
    d = dict(owner_meta)
    d.update(meta)
    import practice  # 📚 «Grammar practice» после грамматики урока (темы — practice.LESSONS)
    sections_html = practice.inject(d['id'], sections_html)
    d['sections'] = [{'id': sid, 'label': lab} for sid, lab, _ in sections_html]
    return d, pane(d['id'], eyebrow, d['title'], lead, tags, sections_html, quote)


def vocab_of(cards):
    """(word, перевод) для словаря подсказок"""
    return {w: {'ru': r, 'example': ex} for w, d, r, ex, em in cards}


EMOJI = {'Lead-in': '🧠', 'Listening': '🎧', 'Vocabulary': '🧰', 'Grammar': '📘', 'Grammar practice': '🏋️', 'Reading': '📖', 'Accuracy': '🎯',
         'Pronunciation': '🗣️', 'Speaking': '💬', 'Writing': '✍️', 'Reflection': '📓'}


def auto_auction(S):
    """Аукцион ошибок, если урок не задал свой: ошибки и верные фразы из case урока."""
    bad, ok = S['case']['bad'], S['case']['ok']
    items = []
    for i in range(max(len(bad), len(ok))):
        if i < len(bad):
            items.append((bad[i][0], False, bad[i][1]))
        if i < len(ok):
            items.append((ok[i], True, ''))
    return items[:8]


def std(S):
    """Полный урок (75–90 мин) по образцу урока Дарьи: вход с «временем подумать», аудирование, слова, грамматика
    (сначала замечаем, потом правило), практика, чтение, аукцион ошибок, задание «подготовка → рассказ», произношение,
    письмо, рефлексия, домашка. Необязательные ключи S: think, notice, extra, auction, task, reflect (см. tools/README.md)."""
    import flex
    import extras  # «время подумать» и задание для уроков, собранных раньше
    S = dict(extras.X.get(S['id'], {}), **S)
    P, LID = S['prefix'], S['id']
    ids = Ids(P)
    secs = []

    def add(key, label, title, mins, body):
        sid = '%s-%s' % (P, key)
        secs.append((sid, label, section(sid, label, title, mins, body)))

    L, V, G, R, Sp, W = S['listen'], S['vocab'], S['grammar'], S['part2'], S['speaking'], S['writing']
    # 1 · вход в урок
    T = S.get('think') or ('Before we start: %s' % Sp['questions'][0], 'Прежде чем начать — подумайте и запишите 2–3 мысли, потом расскажите.',
                           ['I think…', 'For example, …', 'One question I have: …'])
    aims = '<div class="aims"><b>In this lesson you will…</b><ul>%s</ul></div>' % ''.join('<li>%s</li>' % a for a in S['aims'])
    lead_body = '@ROUTE@' + aims + flex.think(ids, T[0], T[1], T[2])
    if S.get('warm'):
        Wm = S['warm']
        lead_body += rubric('b', Wm[0], Wm[1]) + deck('Warm-up · Разминка', [mc('%s-w%d' % (P, i + 1), q, o, k) for i, (q, o, k) in enumerate(Wm[2])])
    add('lead', 'Lead-in', S.get('lead_title', 'think first'), '7 min', lead_body)

    def extras(pos):  # особые этапы урока: (key, label, title, mins, body[, 'start' | 'grammar' | 'reading'])
        for x in S.get('extra', []):
            if (x[5] if len(x) > 5 else 'reading') == pos:
                add(x[0], x[1], x[2], x[3], x[4](ids) if callable(x[4]) else x[4])
    extras('start')
    # 2 · аудирование
    add('listen1', 'Listening', L['title'], '12 min',
        rubric('a', L['task'], L.get('task_ru', '')) + listening(P + '-lis1', L['lines'], L['head'], emoji=L.get('emoji', '🎧'), names=L['names'])
        + mc(P + '-q1', L['gist'][0], L['gist'][1], L['gist'][2])
        + rubric('b', 'Listen again. Answer the cards.', 'Послушайте ещё раз и ответьте на карточки.')
        + deck('Details · Детали', [mc('%s-q%d' % (P, i + 2), q, o, k) for i, (q, o, k) in enumerate(L['details'])])
        + (rubric('c', 'Listen once more and complete the notes. One to three words or a number.', 'Послушайте ещё раз и заполните заметки: 1–3 слова или число.')
           + ex_gaps(ids, L['notes'], size=16) if L.get('notes') else ''))
    # 3 · слова
    add('vocab', 'Vocabulary', V['title'], '10 min',
        rubric('a', 'Tap each card, press 🔊 and repeat.', 'Нажимайте на карточки, слушайте и повторяйте.') + bank(S['code'], V['theme'], V['cards'])
        + rubric('b', 'Which word is it?', 'Какое это слово?') + ex_select(ids, V['match'])
        + rubric('c', 'Complete the sentences.', 'Вставьте слово.') + ex_gaps(ids, V['gaps'])
        + (rubric('d', V['more'][0], V['more'][1]) + ex_gaps(ids, V['more'][2]) if V.get('more') else ''))
    # 4 · грамматика: заметить → правило → тренировка
    rule = easy(G['head'], G['idea'], G['rows'], G['examples'], G['traps'], G.get('note', ''), choose=G.get('choose'))
    N = S.get('notice')
    if N:
        gbody = (rubric('a', N[0], N[1]) + flex.examples(N[2])
                 + deck('Discover · Догадайтесь', [mc('%s-n%d' % (P, i + 1), q, o, k) for i, (q, o, k) in enumerate(N[3])])
                 + rubric('b', 'Now check the rule. Press 🔊 and repeat the examples.', 'Теперь сверьтесь с правилом.') + flex.reveal('📘 The rule · Правило', rule))
        nl = 'cd'
    else:
        gbody = rubric('a', 'Read the steps. Press 🔊 and repeat.', 'Прочитайте шаги, слушайте и повторяйте.') + rule
        nl = 'bc'
    gbody += (rubric(nl[0], '<b>Step 1.</b> ' + G['ex1'][0], G['ex1'][1]) + ex_gaps(ids, G['ex1'][2])
              + rubric(nl[1], '<b>Step 2.</b> ' + G['ex2'][0], G['ex2'][1]) + ex_order(ids, G['ex2'][2]))
    add('grammar', 'Grammar', G['title'], '15 min', gbody)
    extras('grammar')
    # 5 · чтение
    if R.get('lines'):
        body2 = rubric('a', R['task'], R.get('task_ru', '')) + listening(P + '-lis2', R['lines'], R['head'], emoji=R.get('emoji', '🎧'), names=R['names'])
    else:
        body2 = rubric('a', R['task'], R.get('task_ru', '')) + reading(R['head'], R['small'], R['text'])
    body2 += rubric('b', 'True or false?', 'Верно или нет?') + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate(R['tf'])])
    if R.get('gaps'):
        body2 += rubric('c', R['gaps'][0], R['gaps'][1]) + ex_gaps(ids, R['gaps'][2])
    add(R['key'], R['label'], R['title'], '12 min', body2)
    if S.get('grammar2'):
        G2 = S['grammar2']
        add('grammar-2', 'Grammar', G2['title'], '8 min',
            rubric('a', G2['rule'], G2.get('rule_ru', '')) + G2.get('box', '') + rubric('b', G2['ex'][0], G2['ex'][1]) + ex_gaps(ids, G2['ex'][2])
            + (rubric('c', G2['ex2'][0], G2['ex2'][1]) + ex_select(ids, G2['ex2'][2]) if G2.get('ex2') else ''))
    # 6 · особые этапы урока (игра, квест, дебаты…)
    extras('reading')
    # 7 · аукцион ошибок + исправить
    A = S.get('auction') or auto_auction(S)
    M = S['mix']
    fixes = ''.join('<li><s>%s</s> → <b>%s</b>%s</li>' % (e(t), e(r), (' <small>%s</small>' % e(w)) if w else '') for t, ok, r, *w in
                    [(a[0], a[1], a[2], *(a[3:] or [''])) for a in A] if not ok)
    add('mix', 'Accuracy', M['title'], '10 min',
        rubric('a', 'Error auction! Right or wrong? Bet 1–3 coins: the surer you are, the more you bet.', 'Аукцион ошибок: верно или нет? Ставка 1–3 монеты — чем увереннее, тем больше.')
        + flex.auction(ids, [(a[0], a[1]) for a in A])
        + flex.reveal('✅ Answers · Ответы', '<ul>%s</ul>' % fixes)
        + rubric('b', M['task'], M.get('task_ru', '')) + ex_lines(ids, M['items']))
    if S.get('pron'):
        Pn = S['pron']
        add('pron', 'Pronunciation', Pn['title'], '5 min', rubric('a', Pn['task'], Pn.get('task_ru', '')) + say_list(Pn['list'])
            + (rubric('b', 'Press 🔊. Choose. Only listen!', 'Нажмите 🔊 и выберите — только на слух!') + ex_listen_pick(ids, Pn['pick']) if Pn.get('pick') else ''))
    # 8 · говорение: вопросы + задание «подготовка → рассказ»
    Tk = S.get('task') or {'task': Sp['task'][0], 'task_ru': Sp['task'][1],
                           'plan': ['Idea 1: …', 'Idea 2: …', 'Idea 3: …', 'A useful phrase: …'], 'report': Sp.get('phrases2', [])}
    add('speaking', 'Speaking', Sp['title'], '15 min',
        rubric('a', '<b>Step 1.</b> Answer your teacher. Short answer + one more sentence.', 'Шаг 1. Короткий ответ + ещё одно предложение.') + picker(Sp['questions']) + phrases(Sp['phrases'])
        + rubric('b', '<b>Step 2.</b> The task: plan first, then speak.', 'Шаг 2. Задание: сначала подготовьтесь письменно, потом расскажите.')
        + flex.cycle('<p>%s%s</p>' % (Tk['task'], ru(Tk.get('task_ru', ''))),
                     '<p>Take your time. Write short notes.</p>' + lines(ids, Tk['plan']),
                     '<p>Now tell your teacher. Then listen to the feedback: two stars ⭐ and one wish 🙏.</p>' + phrases(Tk['report'])))
    add('writing', 'Writing', W['title'], '10 min', rubric('a', W['task'], W.get('task_ru', '')) + box('<b>Example:</b> ' + W['example'], '📝')
        + lines(ids, W['placeholders']) + rubric('b', 'Press «Отправить преподавателю».', 'Нажмите «Отправить преподавателю».') + send_box())
    Rf = S.get('reflect') or ['Today I learned…', 'One thing that was difficult: …', 'Next time I will…']
    add('check', 'Reflection', 'what did you learn?', '5 min', selfcheck(ids, S['cans'])
        + rubric('c', 'Your learning journal: three sentences about today.', 'Дневник: три предложения о сегодняшнем уроке.') + lines(ids, Rf) + send_box())
    H = S['hw']
    add('hw-prep', 'Homework: words', 'words', '10 min', intro('📚', 'Homework, part 1 of 2: words.', '10 minutes', 'Домашнее задание, часть 1: слова. Потом — «Далее».')
        + rubric('a', 'Which word is it?', 'Какое это слово?') + ex_select(ids, H['words_select'])
        + rubric('b', 'Press 🔊. Choose what you hear.', 'Нажмите 🔊 и выберите, что прозвучало.') + ex_listen_pick(ids, H['listen'])
        + rubric('c', 'Complete the sentences.', 'Вставьте слово.') + ex_gaps(ids, H['words_gaps']))
    add('hw-grammar', 'Homework: grammar', 'grammar', '10 min', intro('🏋️', 'Homework, part 2 of 2: grammar.', '10 minutes', 'Часть 2: грамматика. В конце — «Отправить преподавателю».')
        + rubric('a', H['gaps'][0], H['gaps'][1]) + ex_gaps(ids, H['gaps'][2])
        + rubric('b', 'Correct the mistakes. Write the sentence.', 'Исправьте ошибку и напишите предложение целиком.') + ex_lines(ids, H['fix'])
        + rubric('c', 'Put the words in order.', 'Соберите предложения.') + ex_order(ids, H['order'])
        + rubric('d', 'Done? Send your homework.', 'Готово? Отправьте домашку.') + send_box())
    gid = LID + '-games'
    words = [(w, r) for w, _, r, _, _ in V['cards']]
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, words, S['case']))))
    # карта урока — по фактическим этапам (без домашки)
    route = flex.route([(EMOJI.get(lab, '⭐'), re.sub('<[^>]+>', '', html_title)) for sid, lab, html_title in
                        [(x[0], x[1], re.search(r'<h2>(.*?)</h2>', x[2]).group(1)) for x in secs] if not lab.startswith('Homework') and lab != 'Games'])
    secs[0] = (secs[0][0], secs[0][1], secs[0][2].replace('@ROUTE@', route))
    meta = {k: S[k] for k in ('id', 'owner', 'title', 'level', 'category', 'minutes', 'grammar', 'date', 'code', 'gvp')}
    meta['minutes'] = S.get('minutes_full', '75–90 min')
    if not isinstance(meta['grammar'], str):  # в описании урока ключ grammar занят разделом грамматики — строка для карточки берётся из gvp
        meta['grammar'] = S.get('grammar_line') or S['gvp']['g']
    meta.update({'hwSection': P + '-hw-prep', 'hwSince': S['date'] + 'T06:00:00Z', 'draft': S.get('draft', True)})
    meta.update(S.get('meta', {}))
    d, h = lesson(meta, {}, secs, S['eyebrow'], S['lead'], S['tags'], S.get('quote'))
    return d, h, vocab_of(V['cards'])
