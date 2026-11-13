"""Транскрипция (британский вариант) для словаря: ipa-dict en_UK (MIT) + espeak-ng для пропусков.
Знаки приводятся к привычной словарной записи: /ˈkemɪstri/, /həˈləʊ/."""
import re, subprocess, os, urllib.request

SRC = 'https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data/en_UK.txt'
VOW = set('aeiouæɑɒɔəɛɜɪʊʌɐ')
ONSETS2 = {'st', 'sp', 'sk', 'pr', 'tr', 'kr', 'br', 'dr', 'ɡr', 'fr', 'θr', 'ʃr', 'pl', 'bl', 'kl', 'ɡl', 'fl', 'sl',
           'sm', 'sn', 'sw', 'tw', 'kw', 'dw', 'pj', 'bj', 'kj', 'fj', 'mj', 'nj', 'hj', 'vj', 'tj', 'dj', 'lj', 'ɡw'}

def _segments(s):
    out, i = [], 0
    while i < len(s):
        if s[i:i + 2] in ('tʃ', 'dʒ'):
            out.append(s[i:i + 2]); i += 2
        else:
            out.append(s[i]); i += 1
    return out

def _move_stress(word):
    seg = _segments(word)
    res = []
    for ch in seg:
        if ch in 'ˈˌ':
            # отодвигаем знак ударения перед начальными согласными слога
            k = len(res)
            cons = []
            while k > 0 and res[k - 1] not in VOW and res[k - 1] not in 'ːˈˌ' and res[k - 1] not in 'ʊɪə' :
                cons.insert(0, res[k - 1]); k -= 1
            if not cons:
                res.append(ch); continue
            if k == 0:
                take = len(cons)
            elif len(cons) >= 2 and (''.join(cons[-2:]) in ONSETS2):
                take = 2
                if len(cons) >= 3 and cons[-3] == 's' and ''.join(cons[-2:]) in ('tr', 'pr', 'kr', 'pl', 'kl', 'kw', 'tj'):
                    take = 3
            else:
                take = 1
            res.insert(len(res) - take, ch)
        else:
            res.append(ch)
    return ''.join(res)

def tidy(ipa):
    s = ipa.strip().strip('/').split(',')[0].strip().strip('/')
    s = s.replace('ɹ', 'r').replace('ɛː', 'eə').replace('ɛə', 'eə').replace('ɛ', 'e').replace('ɐ', 'ə').replace('ɚ', 'ə').replace('ᵻ', 'ɪ')
    s = re.sub(r'a(?![ɪʊː])', 'æ', s).replace('ɑːɹ', 'ɑː')
    s = s.replace('ʔ', '').replace('ɾ', 't').replace('ɫ', 'l').replace('ɡ', 'ɡ')
    words = []
    for w in s.split():
        w = _move_stress(w)
        if 'ˈ' in w:                                            # побочное ударение после главного — артефакт espeak
            k = w.index('ˈ')
            w = w[:k] + w[k:].replace('ˌ', '')
        if len(re.findall(r'[aeiouæɑɒɔəɜɪʊʌ]+', w)) <= 1 and 'ˌ' not in w:
            w = w.replace('ˈ', '')                              # односложные слова — без знака ударения
        w = re.sub(r'(?<=[ptkbdɡfvszθ])əl$', 'l', w)          # bottle → ˈbɒtl
        words.append(w)
    return ' '.join(words)

def load_dict(cache):
    path = os.path.join(cache, 'en_UK.txt')
    if not os.path.exists(path):
        os.makedirs(cache, exist_ok=True)
        urllib.request.urlretrieve(SRC, path)
    d = {}
    for line in open(path, encoding='utf8'):
        if '\t' in line:
            w, p = line.rstrip('\n').split('\t', 1)
            d.setdefault(w.lower(), p)
    return d

def espeak(words):
    if not words:
        return {}
    try:
        out = subprocess.run(['espeak-ng', '-v', 'en-gb', '-q', '--ipa'], input='\n'.join(words), capture_output=True, text=True, timeout=120).stdout
    except Exception:
        return {}
    lines = [l.strip() for l in out.strip().split('\n')]
    return dict(zip(words, lines)) if len(lines) == len(words) else {}

FIXED = {'a': 'ə', 'an': 'æn', 'the': 'ðə', 'of': 'ɒv', 'to': 'tuː', 'for': 'fɔː', 'and': 'ænd', 'i': 'aɪ', "i'm": 'aɪm'}

def build(words, cache):
    d = load_dict(cache)
    d.update({k: v for k, v in FIXED.items()})
    res, miss = {}, []
    for w in sorted(set(words)):
        if w in d:
            res[w] = tidy(d[w])
        elif re.fullmatch(r"[a-z][a-z'-]*", w):
            miss.append(w)
    for w, p in espeak(miss).items():
        if p:
            res[w] = tidy(p)
    return res
