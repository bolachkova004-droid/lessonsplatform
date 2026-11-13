#!/usr/bin/env python3
"""Слой доработок поверх собранных страниц платформы.

Запуск из корня репозитория:  python3 tools/apply.py [--tts DIR] [--no-audio]
  --tts DIR   папка с kokoro-v1.0.onnx, voices-v1.0.bin и venv/ (python с kokoro-onnx) — дозаписать недостающие фразы
Что делает (повторный запуск ничего не ломает — всё заменяется по меткам):
  1. небольшие «крючки» в основном скрипте (доступ к профилю, один и тот же голос устройства);
  2. данные: транскрипция (ipa-data) и наборы слов для целей (iris-packs);
  3. озвучка: всё, что могут произнести игры и кнопки 🔊, получает запись голосом платформы (без робота);
  4. скрипты и стили из tools/patches/ — в конец каждой страницы.
Страницы: platform/index.html и все лёгкие страницы учеников platform/s-*.html.
Секретов здесь нет и не нужно: ключ преподавателя и ссылки учеников хранятся вне репозитория."""
import argparse, glob, hashlib, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'voice'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'data'))
import harvest, packs as packdata  # noqa: E402

PATCH_ORDER = ['explain.js', 'review.js', 'goal.js', 'ipa.js', 'offline.js']
EARLY_ORDER = ['early/box-client.js']          # сразу после библиотеки MQTT, до основного скрипта
EARLY_START, EARLY_END = '<!--iris-early:start-->', '<!--iris-early:end-->'
IN_APP = r"/(Telegram|FBAN|FBAV|Instagram|VKClient|VKAndroidApp|WhatsApp|Line\/|MicroMessenger|OKApp|; wv\))/i"
START, END = '<!--iris-patch:start-->', '<!--iris-patch:end-->'
VOICE = 'bf_emma'

HOOKS = [
    # доступ к профилю и сохранению для слоя доработок (функции объявлены в том же замыкании)
    ('iris-core-hook', '    function profile() {',
     "    window.__irisCore = { profile: function () { return profile(); }, save: function () { return save(); }, notify: function (m) { return notify(m); }, norm: function (x) { return norm(x); }, state: function () { return state; }, addWord: function (a, b, c, d) { return addWord(a, b, c, d); } }; /*iris-core-hook*/\n    function profile() {"),
    # голос устройства (когда записи нет): всегда один и тот же женский британский голос, как у записей — без скачков «робот ↔ женский»
    ('iris-voice-pin', "            const f = list.find(v => FEMALE.test(v.name)) || list[0], m = list.find(v => MALE.test(v.name) && v !== f) || null;",
     "            let pin = null; /*iris-voice-pin*/\n            try { pin = localStorage.getItem('iris-voice-f'); } catch (_) { }\n            const f = (pin && list.find(v => v.name === pin)) || list.find(v => FEMALE.test(v.name) && /^en[-_]GB/i.test(v.lang)) || list.find(v => FEMALE.test(v.name)) || list[0], m = list.find(v => MALE.test(v.name) && v !== f) || null;\n            try { if (f && !pin && list.length > 1) localStorage.setItem('iris-voice-f', f.name); } catch (_) { }"),
    ('iris-voice-default', "                    const male = /^m/.test(opts.who || ''), v = male ? (vs.m || vs.any) : /^f/.test(opts.who || '') ? (vs.f || vs.any) : vs.any;",
     "                    const male = /^m/.test(opts.who || ''), v = male ? (vs.m || vs.f || vs.any) : (vs.f || vs.any); /*iris-voice-default*/"),
    # цель ученика (скрытое поле iris-goal) не считается письменным ответом в сводке преподавателя
    ('iris-goal-score', "                if (!el.dataset.a) {\n                    sc[3]++;",
     "                if (!el.dataset.a) {\n                    if (el.dataset.field !== 'iris-goal') /*iris-goal-score*/\n                    sc[3]++;"),
    # свой «почтовый ящик» (platform/api/box.php) — первым в списке серверов связи; без ящика на хостинге он просто молчит
    ('iris-box', "        const DEFAULT_BROKERS = [\n",
     "        const DEFAULT_BROKERS = [\n            { url: 'iris-box' }, /*iris-box*/\n"),
    # разрешить странице обращаться к своему сайту (ящик) и запускать офлайн-режим (sw.js)
    ("connect-src 'self'", 'connect-src wss://', "connect-src 'self' wss://"),
    ("worker-src blob: 'self'", 'worker-src blob:;', "worker-src blob: 'self';"),
    # личный код не остаётся в адресной строке (история, скриншоты, пересылка), если вход сохранился в браузере.
    # Во встроенных браузерах мессенджеров код остаётся: оттуда открывают «в Safari», а память у них разная.
    ('iris-url-key', "        function keepInUrl(token, hash) { try {\n            const u = new URL(location.href);\n            u.searchParams.set('k', token);",
     "        function keepInUrl(token, hash) { try {\n            const u = new URL(location.href);\n            let kept = false; /*iris-url-key*/\n            try { kept = (JSON.parse(localStorage.getItem('iris-access-v1') || 'null') || {}).t === token; } catch (_) { }\n            if (kept && !" + IN_APP + ".test(navigator.userAgent)) u.searchParams.delete('k'); else u.searchParams.set('k', token);"),
    # после обрыва связи — дослать ответы открытого урока
    ('iris-resync', "        function scheduleSync() {",
     "        window.__irisResync = () => { try { scheduleSync(); } catch (_) { } }; /*iris-resync*/\n        function scheduleSync() {"),
    ('Онлайн-перевод сейчас не отвечает', "'Перевод онлайн сейчас недоступен.'",
     "'Онлайн-перевод сейчас не отвечает. Впишите перевод сами — слово всё равно сохранится в словаре.'", 3),
]


def apply_hooks(s, path):
    for h in HOOKS:
        mark, old, new = h[:3]
        want = h[3] if len(h) > 3 else 1
        if mark in s:
            continue
        n = s.count(old)
        if n != want:
            raise SystemExit('%s: крючок %s — найдено %d вхождений вместо %d' % (path, mark, n, want))
        s = s.replace(old, new)
    return s


def light_privacy(s):
    """Личная страница ученика: только его запись доступа и его имя в меню (аудит, п. 5)."""
    owners = {d.get('owner') for d in read_json(s, 'platform-data')}
    m = json_block(s, 'access-data')
    a = json.loads(m.group(2))
    a['entries'] = [e for e in a['entries'] if e.get('profile') in owners]
    s = s[:m.start(2)] + json.dumps(a, ensure_ascii=False).replace('</', '<\\/') + s[m.end(2):]
    def opts(mm):
        keep = ''.join(o for o in re.findall(r'<option value="[^"]*">[^<]*</option>', mm.group(2)) if re.search(r'value="([^"]*)"', o).group(1) in owners)
        return mm.group(1) + keep + mm.group(3)
    s = re.sub(r'(<select id="profile-select"[^>]*>)(.*?)(</select>)', opts, s, count=1, flags=re.S)
    return s


def light_audio(s):
    """Личная страница: в списке записей — только фразы, которые есть на этой странице (аудит, п. 4)."""
    import html as H
    hay = H.unescape(re.sub(r'<script type="application/json" id="audio-(data|dur)">.*?</script>', '', s, flags=re.S))
    hay2 = hay.replace('\\u2019', '’').replace('\\"', '"')
    audio, dur = read_json(s, 'audio-data'), read_json(s, 'audio-dur')
    keep, said = {}, {t for _, t in harvest.harvest(s)}
    for k, v in audio.items():
        t = k.split('|', 1)[1]
        if t in said or t in hay2 or json.dumps(t, ensure_ascii=False)[1:-1] in hay:
            keep[k] = v
    files = set(keep.values())
    s = write_manifest(s, 'audio-data', keep)
    if json_block(s, 'audio-dur'):
        s = write_manifest(s, 'audio-dur', {k: v for k, v in dur.items() if k in files})
    return s, len(audio) - len(keep)


def json_block(s, tag):
    m = re.search(r'(<script type="application/json" id="%s">)(.*?)(</script>)' % tag, s, re.S)
    return m


def set_json(s, tag, obj):
    text = json.dumps(obj, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    m = json_block(s, tag)
    block = '<script type="application/json" id="%s">%s</script>' % (tag, text)
    if m:
        return s[:m.start()] + block + s[m.end():]
    i = s.rfind('</body>')
    return s[:i] + block + '\n' + s[i:]


def read_json(s, tag):
    m = json_block(s, tag)
    return json.loads(m.group(2)) if m else {}


def write_manifest(s, tag, obj):
    # манифест записей пишем в том же виде, что и сборка
    m = json_block(s, tag)
    text = json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')
    return s[:m.start(2)] + text + s[m.end(2):]


def pack_payload():
    P = packdata.parse()
    return {'goals': packdata.GOALS, 'areas': {k: list(v) for k, v in packdata.AREAS.items()}, 'packs': P}


def ipa_words(pages, payload):
    words = set()
    add = lambda t: words.update(w for w in re.findall(r"[a-z][a-z'-]*", t.lower().replace('’', "'")))
    for s in pages.values():
        for k in read_json(s, 'core-dict'):
            add(k)
        for m in re.finditer(r'<div class="flip-front">([^<]{1,80})</div>', s):
            add(m.group(1))
        try:
            voc = read_json(s, 'vocabulary-data')
            for k in (voc if isinstance(voc, dict) else {}):
                add(k)
        except Exception:
            pass
    for rows in payload['packs'].values():
        for w in rows:
            add(w['en'])
    return words


def build_ipa(words, cache, path):
    import ipa
    have = {}
    if os.path.exists(path):
        have = json.load(open(path, encoding='utf8'))
    todo = {w for w in words if w not in have and len(w) > 0}
    if todo:
        try:
            have.update(ipa.build(sorted(todo | set(have)), cache))
            for w in todo:
                have.setdefault(w, '')
        except Exception as e:  # нет сети — оставляем то, что есть
            print('  транскрипция: не обновлена (%s)' % e)
    have = {k: v for k, v in sorted(have.items())}
    json.dump(have, open(path, 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
    return {k: v for k, v in have.items() if v}


def slim(js):
    # без комментариев в начале строк и отступов — страница легче (многострочных шаблонных строк в доработках нет)
    js = re.sub(r'^\s*/\*.*?\*/\s*', '', js, count=1, flags=re.S)
    out = []
    for line in js.split('\n'):
        t = line.strip()
        if not t or t.startswith('//'):
            continue
        out.append(t)
    return '\n'.join(out)


def clip_name(text):
    return 'audio/' + hashlib.sha1((VOICE + '|' + text).encode()).hexdigest()[:16] + '.mp3'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--tts', help='папка Kokoro (модель и venv) для дозаписи фраз')
    ap.add_argument('--no-audio', action='store_true')
    ap.add_argument('--cache', default=os.path.join(ROOT, '.cache'))
    args = ap.parse_args()
    paths = [os.path.join(ROOT, 'platform', 'index.html')] + sorted(glob.glob(os.path.join(ROOT, 'platform', 's-*.html')))
    pages = {p: open(p, encoding='utf8').read() for p in paths}
    payload = pack_payload()
    pack_texts = sorted({norm for rows in payload['packs'].values() for w in rows for norm in (harvest.norm(w['en']), harvest.norm(w['ex']))})

    # --- озвучка ---
    need = {}
    for p, s in pages.items():
        audio, dw = read_json(s, 'audio-data'), set(read_json(s, 'core-dict'))
        items = harvest.harvest(s) + [('f', t) for t in pack_texts]
        miss = sorted({t for w, t in items if not harvest.covered(t, w, audio, dw)})
        need[p] = miss
    union = sorted({t for v in need.values() for t in v})
    audio_dir = os.path.join(ROOT, 'platform', 'audio')
    todo = [t for t in union if not os.path.exists(os.path.join(ROOT, 'platform', clip_name(t)))]
    durs = {}
    if todo and args.tts and not args.no_audio:
        py = os.path.join(args.tts, 'venv', 'bin', 'python')
        print('озвучка: записываю %d фраз…' % len(todo))
        r = subprocess.run([py, os.path.join(ROOT, 'tools', 'voice', 'render.py'), args.tts, audio_dir], input=json.dumps([[VOICE, t] for t in todo]), capture_output=True, text=True)
        if r.returncode:
            sys.stderr.write(r.stderr)
            raise SystemExit('озвучка: ошибка')
        durs.update(json.loads(r.stdout or '{}'))
    elif todo:
        print('озвучка: нет записей для %d фраз (запустите с --tts, чтобы дозаписать)' % len(todo))

    words = ipa_words(pages, payload)
    ipa_table = build_ipa(words, args.cache, os.path.join(ROOT, 'tools', 'data', 'ipa.json'))

    js = '\n'.join(slim(open(os.path.join(ROOT, 'tools', 'patches', f), encoding='utf8').read()) for f in PATCH_ORDER)
    css = open(os.path.join(ROOT, 'tools', 'patches', 'patch.css'), encoding='utf8').read()
    if '</script' in js.lower() or '</style' in css.lower():
        raise SystemExit('в доработках не должно быть </script> и </style>')

    early = '\n'.join(slim(open(os.path.join(ROOT, 'tools', 'patches', f), encoding='utf8').read()) for f in EARLY_ORDER)
    for p, s in pages.items():
        s = apply_hooks(s, p)
        # ранние доработки — сразу после библиотеки MQTT
        a, b = s.find(EARLY_START), s.find(EARLY_END)
        if a >= 0 and b > a:
            s = s[:a] + s[b + len(EARLY_END):]
        i = s.find('<script>/* MQTT.js')
        j = s.find('</script>', i) + len('</script>')
        if i < 0:
            raise SystemExit(p + ': нет библиотеки MQTT')
        s = s[:j] + '\n' + EARLY_START + '<script>' + early + '</script>' + EARLY_END + s[j:]
        # манифест записей
        audio, dur = read_json(s, 'audio-data'), read_json(s, 'audio-dur')
        added = 0
        for t in need[p]:
            name = clip_name(t)
            if os.path.exists(os.path.join(ROOT, 'platform', name)):
                audio['f|' + t] = name
                if name in durs:
                    dur[name] = durs[name]
                elif name not in dur:
                    try:
                        out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'platform', name)], capture_output=True, text=True).stdout.strip()
                        dur[name] = round(float(out), 2)
                    except Exception:
                        pass
                added += 1
        s = write_manifest(s, 'audio-data', audio)
        if json_block(s, 'audio-dur'):
            s = write_manifest(s, 'audio-dur', dur)
        # данные и доработки
        a, b = s.find(START), s.find(END)
        if a >= 0 and b > a:
            s = s[:a] + s[b + len(END):]
        for tag in ('ipa-data', 'iris-packs'):
            m = json_block(s, tag)
            if m:
                s = s[:m.start()] + s[m.end():]
        block = (START + '\n<script type="application/json" id="ipa-data">' + json.dumps(ipa_table, ensure_ascii=False, separators=(',', ':')) + '</script>\n'
                 + '<script type="application/json" id="iris-packs">' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>\n'
                 + '<style id="iris-patch-css">' + css + '</style>\n<script id="iris-patch-js">' + js + '</script>\n' + END + '\n')
        i = s.rfind('</body>')
        if i < 0:
            raise SystemExit(p + ': нет </body>')
        s = s[:i] + block + s[i:]
        trimmed = 0
        if os.path.basename(p).startswith('s-'):
            s = light_privacy(s)
            s, trimmed = light_audio(s)
        open(p, 'w', encoding='utf8').write(s)
        print('%-40s записей добавлено: %3d  без записи: %d  лишних убрано: %d  размер: %d КБ' % (os.path.relpath(p, ROOT), added, len(need[p]) - added, trimmed, len(s.encode()) // 1024))


if __name__ == '__main__':
    main()
