"""Собирает все английские фразы, которые страница может произнести, и показывает, для каких нет записи."""
import re, json, html, sys, hashlib, os

def norm(t): return re.sub(r'\s+', ' ', str(t or '')).strip()

def manifest(s, tag='audio-data'):
    m = re.search(r'<script type="application/json" id="%s">(.*?)</script>' % tag, s, re.S)
    return json.loads(m.group(1)) if m else {}

def attr_values(s, name):
    for m in re.finditer(r'\s%s="([^"]*)"' % re.escape(name), s):
        yield html.unescape(m.group(1))
    for m in re.finditer(r"\s%s='([^']*)'" % re.escape(name), s):
        yield html.unescape(m.group(1))

def harvest(s):
    """[(who, text)] — всё, что могут произнести игры, кнопки 🔊 и колоды."""
    out = []
    for v in attr_values(s, 'data-game-words'):
        try: words = json.loads(v)
        except Exception: continue
        for w in words:
            if isinstance(w, dict) and w.get('w'): out.append(('f', w['w']))
    for v in attr_values(s, 'data-game-case'):
        try: c = json.loads(v)
        except Exception: continue
        for k in ('audio', 'say'):
            if isinstance(c.get(k), str): out.append(('f', c[k]))
        for k in ('ok',):
            for t in c.get(k) or []:
                if isinstance(t, str):
                    mark = re.search(r'[.?!]$', t)
                    out.append(('f', ' '.join(re.sub(r'([.?!])$', '', t).split()) + (mark.group(0) if mark else '.')))
        for k, v2 in c.items():
            if isinstance(v2, list):
                for it in v2:
                    if isinstance(it, dict):
                        for kk in ('audio', 'say'):
                            if isinstance(it.get(kk), str): out.append(('f', it[kk]))
    for m in re.finditer(r'<[^>]*\sdata-say="([^"]*)"[^>]*>', s):
        tag = m.group(0)
        who = re.search(r'data-who="([^"]*)"', tag)
        out.append((who.group(1) if who else 'f', html.unescape(m.group(1))))
    return [(w, norm(t)) for w, t in out if norm(t)]

def covered(text, who, audio, dict_words):
    if audio.get((who or 'f') + '|' + text) or any(audio.get(w + '|' + text) for w in ('f', 'm', 'f2', 'm2')):
        return True
    w = text.lower()
    w = re.sub(r'^to ', '', w); w = re.sub(r"^[^a-z']+|[^a-z']+$", '', w)
    if len(text.split(' ')) <= 2 and (audio.get('f|' + w) or w in dict_words):
        return True
    return False

if __name__ == '__main__':
    for path in sys.argv[1:]:
        s = open(path, encoding='utf8').read()
        audio, dw = manifest(s), set(manifest(s, 'core-dict'))
        items = harvest(s)
        miss = sorted({t for w, t in items if not covered(t, w, audio, dw)})
        print(path, 'фраз:', len(set(items)), 'без записи:', len(miss))
        for t in miss[:15]: print('   ', t)
