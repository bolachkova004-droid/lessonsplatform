"""🔒 Материалы уроков — только по личной ссылке, общий код — отдельными файлами (кэш на год).

seal(page)   — панели уроков каждого ученика сжимаются и шифруются (AES-GCM) его собственным ключом;
               ключ доступен только по его личной ссылке (и по ссылке преподавателя). Без ссылки страница
               показывает только вход — уроки прочитать нельзя, даже открыв код страницы.
               Большие скрипты и стили выносятся в platform/assets/app-<хэш>.js|css: телефон скачивает их один раз.
unseal(page) — обратная операция (нужна, чтобы слой доработок можно было наложить заново).

Ключ шифрования содержимого (CK) случайный для каждой части; он «завёрнут» ключом KEK = SHA-256('iris-content:' + код)
для кода каждого ученика этой части и для кода преподавателя. Коды учеников вычисляются из кода преподавателя
(HMAC, как в самой платформе), поэтому нужен только он: передаётся через переменную IRIS_SECRET или --secret-file
и в репозиторий не попадает."""
import base64, hashlib, hmac, json, os, re, zlib

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'platform', 'assets')
SLOT = '<template data-iris-part="%d"></template>'  # место каждой части — порядок панелей не меняется
SHARED_JSON = ('core-dict', 'vocabulary-data', 'ipa-data', 'iris-packs')
LOADER_START, LOADER_END = '<!--iris-loader:start-->', '<!--iris-loader:end-->'
PRE_START, PRE_END = '<!--iris-preload:start-->', '<!--iris-preload:end-->'


def b64e(b):
    return base64.urlsafe_b64encode(b).decode().rstrip('=')


def b64d(s):
    return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))


def student_token(secret, sid):
    return b64e(hmac.new(secret.encode(), ('student:' + sid).encode(), hashlib.sha256).digest())[:22]


def kek(token):
    return hashlib.sha256(('iris-content:' + token).encode()).digest()


def kid(token):
    return b64e(hashlib.sha256(('iris-kid:' + token).encode()).digest())[:16]


def _json(s, tag):
    m = re.search(r'<script type="application/json" id="%s">(.*?)</script>' % tag, s, re.S)
    return json.loads(m.group(1)) if m else None


def _panes(s, ids):
    """Позиции панелей <div class="pane" id="…"> для уроков из DATA (по глубине вложенности div)."""
    out = []
    for m in re.finditer(r'<div class="pane" id="([^"]+)"[^>]*>', s):
        if m.group(1) not in ids:
            continue
        depth, i = 0, m.start()
        for t in re.finditer(r'<div\b|</div>', s[m.start():]):
            depth += 1 if t.group(0) == '<div' else -1
            if depth == 0:
                out.append((m.group(1), m.start(), m.start() + t.end()))
                break
        else:
            raise SystemExit('панель %s не закрыта' % m.group(1))
    return out


def _deflate(text):
    c = zlib.compressobj(9, zlib.DEFLATED, -15)
    return c.compress(text.encode()) + c.flush()


def seal(s, secret, loader_js):
    if 'id="iris-sealed"' in s:
        raise SystemExit('страница уже запечатана')
    data = _json(s, 'platform-data')
    access = _json(s, 'access-data')
    owner = {d['id']: d['owner'] for d in data if not d.get('book')}
    panes = _panes(s, set(owner))
    if not panes:
        return s
    tokens_of = {}
    for e in access['entries']:
        tokens_of.setdefault(e['profile'], []).append(student_token(secret, e['id']))
    # части — подряд идущие панели одного ученика
    runs = []
    for pid, a, b in panes:
        o = owner[pid]
        if runs and runs[-1]['o'] == o and not s[runs[-1]['end']:a].strip():
            runs[-1]['html'] += s[runs[-1]['end']:b]
            runs[-1]['end'] = b
            runs[-1]['ids'].append(pid)
        else:
            runs.append({'o': o, 'start': a, 'end': b, 'html': s[a:b], 'ids': [pid]})
    cks, parts, keys = {}, [], []
    for n, r in enumerate(runs):
        ck = cks.setdefault(r['o'], AESGCM.generate_key(bit_length=256))
        iv = os.urandom(12)
        parts.append({'iv': b64e(iv), 'ct': b64e(AESGCM(ck).encrypt(iv, _deflate(r['html']), None)), 'ids': r['ids']})
    for o, ck in cks.items():
        idx = [n for n, r in enumerate(runs) if r['o'] == o]
        for t in tokens_of.get(o, []) + [secret]:
            iv = os.urandom(12)
            keys.append({'kid': kid(t), 'iv': b64e(iv), 'k': b64e(AESGCM(kek(t)).encrypt(iv, ck, None)), 'p': idx})
    keys.sort(key=lambda k: k['kid'])
    sealed = {'v': 1, 'parts': parts, 'keys': keys}
    # вырезаем панели (с конца), на месте первой — слот
    out = s
    for r in reversed(runs):
        out = out[:r['start']] + SLOT % runs.index(r) + out[r['end']:]
    i = out.rfind('</body>')
    out = out[:i] + '<script type="application/json" id="iris-sealed">' + json.dumps(sealed, separators=(',', ':')) + '</script>\n' + out[i:]
    return externalize(out, loader_js)


def externalize(s, loader_js):
    os.makedirs(ASSETS, exist_ok=True)
    body = s.find('<body')

    def put(content, ext):
        name = 'app-' + hashlib.sha256(content.encode()).hexdigest()[:12] + '.' + ext
        path = os.path.join(ASSETS, name)
        if not os.path.exists(path):
            open(path, 'w', encoding='utf8').write(content)
        return 'assets/' + name

    def scr(m):
        if m.start() < body or 'type=' in m.group(1) or 'data-iris-src' in m.group(1) or len(m.group(2)) < 2000:
            return m.group(0)
        return '<script%s data-iris-src="%s"></script>' % (m.group(1), put(m.group(2), 'js'))
    s = re.sub(r'<script([^>]*)>(.*?)</script>', scr, s, flags=re.S)

    def dat(m):
        # одинаковые на всех страницах словари — тоже отдельными файлами (кэш)
        if m.group(1) not in SHARED_JSON or len(m.group(2)) < 20000:
            return m.group(0)
        return '<script type="application/json" id="%s" data-iris-json="%s"></script>' % (m.group(1), put(m.group(2), 'json'))
    s = re.sub(r'<script type="application/json" id="([^"]+)">(.*?)</script>', dat, s, flags=re.S)

    def sty(m):
        if len(m.group(1)) < 20000:
            return m.group(0)
        return '<link rel="stylesheet" href="%s" data-iris-style>' % put(m.group(1), 'css')
    s = re.sub(r'<style>(.*?)</style>', sty, s, flags=re.S)
    # пусть браузер качает общий код сразу, пока читает страницу
    pre = ''.join('<link rel="preload" as="script" href="%s">' % h for h in re.findall(r'data-iris-src="([^"]+)"', s))
    pre += ''.join('<link rel="preload" as="fetch" href="%s" crossorigin>' % h for h in re.findall(r'data-iris-json="([^"]+)"', s))
    h = s.find('</head>')
    s = s[:h] + PRE_START + pre + PRE_END + s[h:]
    i = s.rfind('</body>')
    return s[:i] + LOADER_START + '<script>' + loader_js + '</script>' + LOADER_END + '\n' + s[i:]


def unseal(s, secret):
    """Вернуть страницу в исходный вид: панели на месте, скрипты и стили — внутри."""
    a, b = s.find(LOADER_START), s.find(LOADER_END)
    if a >= 0:
        s = s[:a] + s[b + len(LOADER_END):]
    a, b = s.find(PRE_START), s.find(PRE_END)
    if a >= 0:
        s = s[:a] + s[b + len(PRE_END):]

    s = re.sub(r'<script[^>]* data-iris-src="[^"]+"[^>]*></script>', _unscr, s)
    s = re.sub(r'<script type="application/json" id="([^"]+)" data-iris-json="([^"]+)"></script>',
               lambda m: '<script type="application/json" id="%s">%s</script>' % (m.group(1), open(os.path.join(ROOT, 'platform', m.group(2)), encoding='utf8').read()), s)
    s = re.sub(r'<link rel="stylesheet" href="([^"]+)" data-iris-style>', lambda m: '<style>' + open(os.path.join(ROOT, 'platform', m.group(1)), encoding='utf8').read() + '</style>', s)
    m = re.search(r'<script type="application/json" id="iris-sealed">(.*?)</script>\n?', s, re.S)
    if not m:
        return s
    sealed = json.loads(m.group(1))
    my = kid(secret)
    html = [None] * len(sealed['parts'])
    for k in sealed['keys']:
        if k['kid'] != my:
            continue
        ck = AESGCM(kek(secret)).decrypt(b64d(k['iv']), b64d(k['k']), None)
        for p in k['p']:
            part = sealed['parts'][p]
            html[p] = zlib.decompress(AESGCM(ck).decrypt(b64d(part['iv']), b64d(part['ct']), None), -15).decode()
    if any(h is None for h in html):
        raise SystemExit('не все части открываются кодом преподавателя')
    s = s[:m.start()] + s[m.end():]
    for n, h in enumerate(html):
        s = s.replace(SLOT % n, h, 1)
    return s


def _unscr(m):
    tag = m.group(0)
    src = re.search(r' data-iris-src="([^"]+)"', tag).group(1)
    attrs = re.match(r'<script([^>]*)>', tag).group(1).replace(' data-iris-src="%s"' % src, '')
    return '<script%s>%s</script>' % (attrs, open(os.path.join(ROOT, 'platform', src), encoding='utf8').read())
