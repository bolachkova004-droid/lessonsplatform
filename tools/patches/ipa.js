/* 🔤 Транскрипция в словаре, переводчике и на карточках слов (британский вариант, как у голоса платформы). */
(function () {
    'use strict';
    var T = null;
    function table() {
        if (T) return T;
        try { T = JSON.parse((document.getElementById('ipa-data') || {}).textContent || '{}'); } catch (_) { T = {}; }
        return T;
    }
    function one(w) {
        var t = table();
        w = w.toLowerCase().replace(/[’‘`]/g, "'");
        if (t[w]) return t[w];
        var b = w.replace(/'s$/, '');
        if (b !== w && t[b]) return t[b] + 'z';
        return '';
    }
    // фраза → /…/; если хоть одного слова нет в таблице — без транскрипции (лучше ничего, чем неточно)
    function ipa(text) {
        var s = String(text || '').trim();
        if (!s || s.length > 60 || /[а-яё]/i.test(s)) return '';
        var t = table(), k = s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?,;:"«»()]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (!k) return '';
        if (t[k]) return '/' + t[k] + '/';
        var words = k.split(' ');
        if (words.length > 6) return '';
        var out = [];
        for (var i = 0; i < words.length; i++) {
            var w = words[i];
            if (/^(sb|sth|smb|smth|\.\.\.|…|-|—)$/.test(w)) continue;
            var p = one(w);
            if (!p) return '';
            if (words.length > 1 && /^(a|an|the|to|of|for|and|or|at|in|on)$/.test(w)) p = { a: 'ə', an: 'ən', the: 'ðə', to: 'tə', of: 'əv', for: 'fə', and: 'ənd', or: 'ɔː', at: 'ət', 'in': 'ɪn', on: 'ɒn' }[w];
            out.push(p);
        }
        return out.length ? '/' + out.join(' ') + '/' : '';
    }
    window.irisIpa = ipa;
    function tag(el, text, cls) {
        if (!el || el.getAttribute('data-ipa') != null) return;
        el.setAttribute('data-ipa', '');
        var p = ipa(text);
        if (!p) return;
        var span = document.createElement('span');
        span.className = 'ipa' + (cls ? ' ' + cls : '');
        span.textContent = p;
        span.setAttribute('aria-label', 'Транскрипция ' + p);
        el.insertAdjacentElement('afterend', span);
    }
    function scan() {
        queued = false;
        Array.prototype.forEach.call(document.querySelectorAll('.word-en:not([data-ipa])'), function (el) { tag(el, el.textContent); });
        Array.prototype.forEach.call(document.querySelectorAll('#translation-popup .translation-top strong:not([data-ipa])'), function (el) { tag(el, el.textContent); });
        Array.prototype.forEach.call(document.querySelectorAll('.flip-front:not([data-ipa])'), function (el) {
            if (el.getAttribute('data-ipa') != null) return;
            el.setAttribute('data-ipa', '');
            var p = ipa(el.textContent);
            if (p) el.insertAdjacentHTML('beforeend', '<span class="ipa ipa-card">' + p.replace(/[<&]/g, '') + '</span>');
        });
    }
    var queued = false;
    var obs = new MutationObserver(function () { if (!queued) { queued = true; (window.requestAnimationFrame || setTimeout)(scan); } });
    function boot() { obs.observe(document.body, { childList: true, subtree: true }); scan(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
