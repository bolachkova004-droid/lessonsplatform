"""🔁 Revision в каждом уроке: первым этапом урока — повторение пройденного материала самого ученика.

Собирается при сборке (apply.py) из его прошлых уроков, ничего не нужно писать вручную:
  a) слова — из карточек Vocabulary Bank прошлых уроков (перевод → английское слово);
  b) грамматика — настоящие упражнения прошлых уроков (с проверкой и объяснением ошибок);
  c) устно — вопросы по прошлым темам.
Берутся 2 последних прошлых урока и один более ранний; выбор детерминированный (одинаковый на всех страницах).
Повторный запуск заменяет раздел (метка: id «<урок>-revision»). Первый урок ученика и домашки не трогаются."""
import html, json, random, re

from kit import _ex, rubric, select, picker, phrases

LABEL = 'Revision'
GRAMMAR_LABELS = {'Grammar', 'Grammar Bank', 'Homework: grammar', 'Practice', 'Accuracy', 'Language focus', 'Teach', 'Test again', 'Homework: rule'}


def _read(s, tag):
    m = re.search(r'(<script type="application/json" id="%s">)(.*?)(</script>)' % tag, s, re.S)
    return m, (json.loads(m.group(2)) if m else None)


def _pane(s, lid):
    import seal
    p = seal._panes(s, {lid})
    return (p[0][1], p[0][2]) if p else None


def _sections(pane_html):
    return re.findall(r'<section class="step" id="([^"]+)" data-label="([^"]*)">(.*?)</section>', pane_html, re.S)


def _words(pane_html):
    out = []
    for front, back in re.findall(r'<div class="flip-front">(?:<img[^>]*>)?\s*([^<]+?)\s*</div><div class="flip-back">(.*?)</div>', pane_html, re.S):
        m = re.search(r'<span class="ru-line">([^<]+)</span>', back)
        if m:
            w, r = html.unescape(front.strip()), html.unescape(m.group(1).strip())
            if 1 <= len(w) <= 40 and r:
                out.append((w, r))
    return out


def _items(pane_html):
    """Пункты упражнений из грамматических разделов: ровно один пропуск с ответом, без «собери из слов»."""
    pref, other = [], []
    for sid, label, body in _sections(pane_html):
        if sid.endswith('-revision'):
            continue
        for ex in re.findall(r'<div class="ex">\s*<ol class="items">(.*?)</ol>', body, re.S):
            for li in re.findall(r'<li>(.*?)</li>', ex, re.S):
                gaps = re.findall(r'class="gap[^"]*"[^>]*data-a="', li)
                if len(gaps) != 1 or 'order-words' in li or 'gap line' in li or '<li' in li or len(li) > 900:
                    continue
                (pref if (label in GRAMMAR_LABELS or 'grammar' in sid) else other).append(li.strip())
    return pref, other


def _renumber(li, prefix, n):
    def sub(m):
        n[0] += 1
        return 'id="%s-%d"' % (prefix, n[0])
    return re.sub(r'id="[^"]+"', sub, li)


def _short(g):
    g = re.sub(r'\s*\(Grammar Easy\)', '', str(g or ''))
    g = re.split(r' · |; ', g)[0].strip()
    return g if len(g) <= 80 else g[:80].rsplit(' ', 1)[0] + '…'


def strip(s):
    """Убрать прежние разделы повторения (страница, список уроков)."""
    s = re.sub(r'<section class="step" id="[^"]+-revision" data-label="%s">.*?</section>\s*' % LABEL, '', s, flags=re.S)
    s = re.sub(r'<a href="#[^"]+-revision">%s</a>' % LABEL, '', s)
    m, data = _read(s, 'platform-data')
    if data:
        for d in data:
            if d.get('sections'):
                d['sections'] = [x for x in d['sections'] if not (x.get('label') == LABEL and x.get('id', '').endswith('-revision'))]
        s = s[:m.start(2)] + json.dumps(data, ensure_ascii=False).replace('</', '<\\/') + s[m.end(2):]
    return s


def add(s):
    s = strip(s)
    m, data = _read(s, 'platform-data')
    if not data:
        return s, 0
    lessons = [d for d in data if d.get('kind') != 'homework' and not d.get('daily')]
    by_owner = {}
    for i, d in enumerate(lessons):
        by_owner.setdefault(d['owner'], []).append((d.get('date') or '0000', i, d))
    added = 0
    for owner, rows in by_owner.items():
        rows.sort(key=lambda x: (x[0], x[1]))
        cache = {}
        for k, (_, _, d) in enumerate(rows):
            prev = [r[2] for r in rows[:k]]
            if not prev:
                continue
            rnd = random.Random('iris-revision:' + d['id'])
            src = prev[-2:][::-1] + ([rnd.choice(prev[:-2])] if len(prev) > 2 else [])
            words, items, titles = [], [], []
            for j, p in enumerate(src):
                if p['id'] not in cache:
                    pos = _pane(s, p['id'])
                    cache[p['id']] = (_words(s[pos[0]:pos[1]]), _items(s[pos[0]:pos[1]])) if pos else ([], ([], []))
                w, (pref, other) = cache[p['id']]
                titles.append(p.get('title', ''))
                words += rnd.sample(w, min(len(w), 2 if j < 2 else 1))
                pool = pref or other
                items += rnd.sample(pool, min(len(pool), 2 if j == 0 else 1))
            if not words and not items:
                continue
            lid, sid = d['id'], d['id'] + '-revision'
            n = [0]
            body = ('<div class="box hw-intro">🔁 <b>Revision · Повторяем пройденное.</b> Before the new topic — a quick review of «%s».'
                    '<span class="ru-line">Перед новой темой — быстро повторим прошлые уроки. Если что-то забылось, это нормально: для этого и повторяем!</span></div>'
                    % '», «'.join(html.escape(t) for t in titles if t))
            letter = iter('abcd')
            if len(words) >= 2:
                pool_en = [w for w, _ in words]
                its = []
                for w, r in words[:5]:
                    opts = [w] + rnd.sample([x for x in pool_en if x != w], min(2, len(pool_en) - 1))
                    rnd.shuffle(opts)
                    n[0] += 1
                    its.append('%s → %s' % (html.escape(r), select('rv-%s-%d' % (lid, n[0]), w, opts)))
                body += rubric(next(letter), 'Words from past lessons: choose the English word.', 'Слова прошлых уроков: выберите английское слово.') + _ex(its)
            if items:
                body += rubric(next(letter), 'Grammar from past lessons: do you still remember?', 'Грамматика прошлых уроков: помните?') + _ex([_renumber(li, 'rv-' + lid, n) for li in items[:4]])
            prompts = ['Name three words from «%s».' % titles[0], 'What happened in «%s»? Tell me in two sentences.' % titles[0]]
            for p in src[:2]:
                g = _short(p.get('grammar'))
                if g:
                    prompts.append('Make your own sentence: %s.' % g)
            body += rubric(next(letter), 'Say it! Answer your teacher.', 'Скажите вслух: ответьте преподавателю.') + picker(prompts) + phrases(['I remember…', "I've forgotten…", 'Last time we learned…'])
            sec = ('<section class="step" id="%s" data-label="%s">\n    <div class="step-head"><h2>revision: last lessons</h2><span class="mins">7 min</span></div>\n    %s\n</section>\n'
                   % (sid, LABEL, body))
            pos = _pane(s, lid)
            if not pos:
                continue
            pane = s[pos[0]:pos[1]]
            i = pane.find('<main>')
            if i < 0:
                continue
            pane = pane[:i + 6] + '\n' + sec + pane[i + 6:]
            pane = re.sub(r'(<nav class="lesson-nav">\s*)', lambda x: x.group(1) + '<a href="#%s">%s</a>' % (sid, LABEL), pane, count=1)
            s = s[:pos[0]] + pane + s[pos[1]:]
            d['sections'] = [{'id': sid, 'label': LABEL}] + [x for x in d.get('sections', []) if x.get('id') != sid]
            added += 1
    m, _ = _read(s, 'platform-data')
    s = s[:m.start(2)] + json.dumps(data, ensure_ascii=False).replace('</', '<\\/') + s[m.end(2):]
    return s, added
