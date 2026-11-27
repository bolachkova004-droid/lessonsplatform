"""Гибкий урок: этапы идут в любом порядке и бывают разными (не один шаблон std).
Каждый урок сам собирает свои разделы из «кирпичиков» ниже: карта урока, догадайся о правиле (guided discovery),
задание до правила (test–teach–test), цикл задания (task → plan → report), ролевые карточки, jigsaw-чтение,
диктоглосс, квест-комната, дебаты, опрос, аукцион ошибок, «время подумать» для спокойных учеников и т. д.
Разметка — те же классы платформы, поэтому проверка ответов, озвучка и отправка преподавателю работают как обычно."""
from kit import *
from kit import _ex


def route(items, title="Today's route · Маршрут урока"):
    """Карта урока: [(emoji, этап)] — ученик видит, что сегодня урок устроен по-другому."""
    return '<div class="route"><b>%s</b><ol>%s</ol></div>' % (e(title), ''.join('<li><span>%s</span>%s</li>' % (em, t) for em, t in items))


def think(ids, prompt, ru_line, placeholders, mins='1–2 min'):
    """Время подумать и записать — потом говорить (удобно тихим и вдумчивым ученикам)."""
    return ('<div class="box think"><b>⏳ Think time · %s</b><p>%s%s</p></div>' % (e(mins), prompt, ru(ru_line))) + lines(ids, placeholders)


def reveal(summary, html):
    """Спрятанное: правило после догадки, текст аудио, образец ответа."""
    return '<details class="reveal"><summary>%s</summary><div class="reveal-body">%s</div></details>' % (summary, html)


def examples(items, title='Look at these sentences · Посмотрите на примеры'):
    return '<div class="box examples"><b>%s</b><ol>%s</ol></div>' % (e(title), ''.join('<li>%s</li>' % x for x in items))


def roleplay(a, b):
    """a, b: (заголовок, [пункты]) — две ролевые карточки."""
    def card(t, pts, cls):
        return '<div class="box role-card %s"><b>%s</b><ul>%s</ul></div>' % (cls, t, ''.join('<li>%s</li>' % p for p in pts))
    return '<div class="two-col">%s%s</div>' % (card(a[0], a[1], 'role-a'), card(b[0], b[1], 'role-b'))


def jigsaw(a, b):
    """Два текста: ученик читает A, преподаватель — B, потом обмениваются информацией. a, b: (заголовок, [абзацы])."""
    def part(tag, t, ps):
        return '<div class="reading jig"><span class="jig-tag">%s</span><h3>%s</h3>%s</div>' % (tag, e(t), ''.join('<p>%s</p>' % e(p) for p in ps))
    return '<div class="two-col">%s%s</div>' % (part('Text A · you', a[0], a[1]), part('Text B · your teacher', b[0], b[1]))


def cycle(task_html, plan_html, report_html):
    """Цикл задания (TBL): сначала делаем, потом готовим отчёт, потом рассказываем."""
    return ('<div class="cycle"><div class="cyc"><span>1</span><b>Task · Задание</b>%s</div><div class="cyc"><span>2</span><b>Plan · Подготовка</b>%s</div>'
            '<div class="cyc"><span>3</span><b>Report · Рассказ</b>%s</div></div>') % (task_html, plan_html, report_html)


def dictogloss(lid, lines_, names, ids, n, emoji='✍️'):
    """Слушаем 2 раза, записываем ключевые слова, восстанавливаем текст, сверяемся."""
    return (listening(lid, lines_, 'Dictogloss: listen, note, rebuild', 'Listen twice · Write key words · Rebuild the text · Не открывайте текст сразу!', emoji, names)
            + lines(ids, ['Key words · ключевые слова'] + ['Sentence %d' % (i + 1) for i in range(n)])
            + reveal('✅ Check · Сверьтесь с оригиналом', '<ol>%s</ol>' % ''.join('<li>%s</li>' % e(t) for _, t in lines_)))


def escape(ids, rooms):
    """Квест-комната: rooms = [(emoji, название, задание_html, ответы)] — каждый ответ открывает следующую «дверь»."""
    return _ex(['<span class="room">%s <b>%s</b></span> %s %s' % (em, e(t), q, gap(ids('room'), a, 14)) for em, t, q, a in rooms])


def opinion(ids, items, options):
    """Выбор без «правильного» ответа: мнение, рейтинг, согласен / не согласен."""
    return '<ol class="items opinion">%s</ol>' % ''.join(
        '<li>%s <select class="gap" id="%s"><option value="">…</option>%s</select></li>' % (t, ids('op'), ''.join('<option>%s</option>' % e(o) for o in options)) for t in items)


def survey(ids, questions):
    """Опрос: вопрос → ответ преподавателя / собеседника."""
    return '<ol class="items survey">%s</ol>' % ''.join('<li><b>%s</b><input class="gap line" id="%s" placeholder="Answer · ответ"></li>' % (e(q), ids('sv')) for q in questions)


def debate(motion, pros, cons, useful):
    return ('<div class="box debate"><b>🎙️ Motion: %s</b><div class="two-col"><div><b>For 👍</b><ul>%s</ul></div><div><b>Against 👎</b><ul>%s</ul></div></div></div>'
            % (e(motion), ''.join('<li>%s</li>' % e(p) for p in pros), ''.join('<li>%s</li>' % e(c) for c in cons))) + phrases(useful)


def auction(ids, items):
    """Аукцион ошибок: верно / неверно + ставка (1–3 монеты)."""
    return _ex(['%s → %s <span class="bet">bet: <select class="gap" id="%s"><option value="">…</option><option>🪙</option><option>🪙🪙</option><option>🪙🪙🪙</option></select></span>'
                % (e(s), select(ids('au'), 'Right' if ok else 'Wrong', ['Right', 'Wrong']), ids('bet')) for s, ok in items])


def timeline(items):
    return '<ol class="timeline">%s</ol>' % ''.join('<li><b>%s</b><span>%s</span></li>' % (e(a), b) for a, b in items)


def flex(S):
    """S: id, prefix, owner, code, title, level, category, minutes, grammar, date, gvp, eyebrow, tags, lead, cards, case,
    sections: [(key, label, title, mins, body)], hw: [(key, label, title, mins, body)] — первый ключ hw — 'hw-prep'."""
    P, LID = S['prefix'], S['id']
    secs = []
    for key, label, title, mins, body in S['sections'] + S['hw']:
        sid = '%s-%s' % (P, key)
        secs.append((sid, label, section(sid, label, title, mins, body)))
    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, [(w, r) for w, _, r, _, _ in S['cards']], S['case']))))
    meta = {k: S[k] for k in ('id', 'owner', 'title', 'level', 'category', 'minutes', 'grammar', 'date', 'code', 'gvp')}
    meta.update({'hwSection': '%s-%s' % (P, S['hw'][0][0]), 'hwSince': S['date'] + 'T06:00:00Z', 'draft': S.get('draft', True)})
    meta.update(S.get('meta', {}))
    d, h = lesson(meta, {}, secs, S['eyebrow'], S['lead'], S['tags'], S.get('quote'))
    return d, h, vocab_of(S['cards'])


def vocab_section(ids, code, theme, cards, match, gaps_, intro_en='Tap each card, press 🔊 and repeat.', intro_ru='Нажимайте на карточки, слушайте и повторяйте.'):
    return (rubric('a', intro_en, intro_ru) + bank(code, theme, cards) + rubric('b', 'Which word is it?', 'Какое это слово?') + ex_select(ids, match)
            + (rubric('c', 'Complete the sentences.', 'Вставьте слово.') + ex_gaps(ids, gaps_) if gaps_ else ''))


def hw_pair(ids, words_select, listen_pick, words_gaps, gram_title, gram_ru, gram_items, fix, order=None):
    """Стандартная домашка из двух частей (уроки разные — домашка привычная)."""
    p1 = (intro('📚', 'Homework, part 1 of 2: words.', '10 minutes', 'Домашнее задание, часть 1: слова.') + rubric('a', 'Which word is it?', 'Какое это слово?') + ex_select(ids, words_select)
          + rubric('b', 'Press 🔊. Choose what you hear.', 'Нажмите 🔊 и выберите, что прозвучало.') + ex_listen_pick(ids, listen_pick)
          + rubric('c', 'Complete the sentences.', 'Вставьте слово.') + ex_gaps(ids, words_gaps))
    p2 = (intro('🏋️', 'Homework, part 2 of 2: grammar.', '10 minutes', 'Часть 2: грамматика. В конце — «Отправить преподавателю».') + rubric('a', gram_title, gram_ru) + ex_gaps(ids, gram_items)
          + rubric('b', 'Correct the mistakes. Write the sentence.', 'Исправьте ошибку и напишите предложение целиком.') + ex_lines(ids, fix)
          + (rubric('c', 'Put the words in order.', 'Соберите предложения.') + ex_order(ids, order) if order else '')
          + rubric('d', 'Done? Send your homework.', 'Готово? Отправьте домашку.') + send_box())
    return [('hw-prep', 'Homework: words', 'words', '10 min', p1), ('hw-grammar', 'Homework: grammar', 'grammar', '10 min', p2)]


def discussion(ids, tiers, statements=None, phrases_=None, scale=('strongly agree', 'agree', 'not sure', 'disagree', 'strongly disagree')):
    """Обсуждение по схеме ESL discussion lesson: фразы для дискуссии → вопросы по уровням (личные → мнение → спорные)
    с уточняющими вопросами (follow-up) → шкала согласия → заметки и обратная связь по языку.
    tiers: [(название, по-русски, [(вопрос, follow-up), …])]."""
    out = ''
    if phrases_:
        out += '<div class="box"><b>🗣️ Discussion language · Фразы для обсуждения</b>%s</div>' % ''.join(
            '<p><b>%s</b> %s</p>' % (e(k), ' · '.join(e(p) for p in v)) for k, v in phrases_)
    for n, (title, ru_t, qs) in enumerate(tiers, 1):
        out += ('<div class="box think"><b>%s</b>%s<ol>%s</ol></div>' % (e(title), ru(ru_t), ''.join(
            '<li>%s%s</li>' % (e(q), ('<br><small>↳ Follow-up: %s</small>' % e(f)) if f else '') for q, f in qs)))
    if statements:
        out += rubric('', '<b>Agree or disagree?</b> Choose, then defend your opinion with a reason and an example.', 'Согласны или нет? Выберите и аргументируйте: причина + пример.')
        out += opinion(ids, statements, list(scale))
    out += rubric('', '<b>Feedback.</b> Write your strongest argument and two new phrases you used (your teacher will add the corrections).',
                  'Обратная связь: ваш самый сильный аргумент и две новые фразы; преподаватель добавит исправления.')
    out += lines(ids, ['My strongest argument: …', 'New phrase 1: …', 'New phrase 2: …', 'Correction from my teacher: …'])
    return out


DISCUSS_PHRASES = [('Giving opinions:', ['In my view…', 'I strongly believe that…', "To be honest, I'm not sure that…"]),
                   ('Agreeing / disagreeing:', ["That's a fair point, but…", 'I see what you mean, however…', "I couldn't agree more.", "I'm afraid I disagree because…"]),
                   ('Asking for more:', ['What makes you say that?', 'Could you give an example?', 'So are you saying that…?']),
                   ('Buying time:', ["That's a tricky question…", 'Let me think about that for a second…', 'It depends on…'])]
