/* 💡 Почему ответ неверный: правила английской грамматики для типичных ошибок.
   window.irisExplain(user, answers, ctx) → { html, rule } — короткое объяснение по-русски.
   ctx: { before: текст до пропуска, after: текст после, sentence: всё предложение с ___ } */
(function () {
    'use strict';
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var low = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim(); };
    var clean = function (s) { return low(s).replace(/^[\s"«“]+|[\s.!?,;:"»”]+$/g, ''); };
    var toks = function (s) { return clean(s).replace(/[,;:!?."«»“”()]/g, ' ').split(/\s+/).filter(Boolean); };

    var IRREG = ('be was/were been|become became become|begin began begun|break broke broken|bring brought brought|build built built|buy bought bought|catch caught caught|choose chose chosen|come came come|cost cost cost|cut cut cut|do did done|draw drew drawn|drink drank drunk|drive drove driven|eat ate eaten|fall fell fallen|feel felt felt|fight fought fought|find found found|fly flew flown|forget forgot forgotten|forgive forgave forgiven|freeze froze frozen|get got got|give gave given|go went gone|grow grew grown|hang hung hung|have had had|hear heard heard|hide hid hidden|hit hit hit|hold held held|hurt hurt hurt|keep kept kept|know knew known|lay laid laid|lead led led|learn learnt/learned learnt/learned|leave left left|lend lent lent|let let let|lie lay lain|lose lost lost|make made made|mean meant meant|meet met met|pay paid paid|put put put|read read read|ride rode ridden|ring rang rung|rise rose risen|run ran run|say said said|see saw seen|sell sold sold|send sent sent|set set set|shake shook shaken|shine shone shone|shoot shot shot|show showed shown|shut shut shut|sing sang sung|sink sank sunk|sit sat sat|sleep slept slept|speak spoke spoken|spend spent spent|stand stood stood|steal stole stolen|stick stuck stuck|swim swam swum|take took taken|teach taught taught|tear tore torn|tell told told|think thought thought|throw threw thrown|understand understood understood|wake woke woken|wear wore worn|win won won|write wrote written|bite bit bitten|blow blew blown|burn burnt/burned burnt/burned|dig dug dug|dream dreamt/dreamed dreamt/dreamed|feed fed fed|light lit lit|quit quit quit|seek sought sought|split split split|spread spread spread|bet bet bet|bend bent bent|bleed bled bled|breed bred bred|deal dealt dealt|flee fled fled|forbid forbade forbidden|grind ground ground|kneel knelt knelt|lean leant/leaned leant/leaned|leap leapt/leaped leapt/leaped|overcome overcame overcome|prove proved proven/proved|sew sewed sewn|shrink shrank shrunk|smell smelt/smelled smelt/smelled|spell spelt/spelled spelt/spelled|spill spilt/spilled spilt/spilled|spin spun spun|strike struck struck|swear swore sworn|sweep swept swept|swing swung swung|undo undid undone|upset upset upset|withdraw withdrew withdrawn').split('|');
    var IR = {}, IR_PAST = {}, IR_PP = {};
    IRREG.forEach(function (row) {
        var p = row.split(' '), base = p[0];
        IR[base] = { past: p[1].split('/'), pp: p[2].split('/') };
        p[1].split('/').forEach(function (x) { (IR_PAST[x] = IR_PAST[x] || []).push(base); });
        p[2].split('/').forEach(function (x) { (IR_PP[x] = IR_PP[x] || []).push(base); });
    });
    var VOW = /[aeiou]/;
    // все возможные «основы» слова и вид формы: base / s / past / pp / ing
    function analyse(w) {
        w = low(w);
        var out = [];
        var add = function (b, k) { if (b && b.length > 1) out.push({ base: b, kind: k }); };
        if (IR[w]) add(w, 'base');
        if (IR_PAST[w]) IR_PAST[w].forEach(function (b) { add(b, 'past'); });
        if (IR_PP[w]) IR_PP[w].forEach(function (b) { add(b, 'pp'); });
        if (w === 'is' || w === 'am' || w === 'are') add('be', w === 'is' ? 's' : 'base');
        if (w === 'has') add('have', 's');
        if (w === 'does') add('do', 's');
        if (w === 'goes') add('go', 's');
        if (/ing$/.test(w) && w.length > 4) {
            var st = w.slice(0, -3);
            add(st, 'ing'); add(st + 'e', 'ing');
            if (/(.)\1$/.test(st)) add(st.slice(0, -1), 'ing');
            if (/y$/.test(st)) add(st.slice(0, -1) + 'ie', 'ing');
        }
        if (/ied$/.test(w)) add(w.slice(0, -3) + 'y', 'past');
        else if (/ed$/.test(w) && w.length > 3) {
            var s2 = w.slice(0, -2);
            add(s2, 'past'); add(w.slice(0, -1), 'past');
            if (/(.)\1$/.test(s2)) add(s2.slice(0, -1), 'past');
        }
        if (/ies$/.test(w)) add(w.slice(0, -3) + 'y', 's');
        else if (/(sh|ch|ss|x|o|z)es$/.test(w)) add(w.slice(0, -2), 's');
        else if (/[^s]s$/.test(w) && w.length > 2) add(w.slice(0, -1), 's');
        add(w, 'base');
        return out;
    }
    function verbRelation(u, a) {
        var A = analyse(a), U = analyse(u);
        for (var i = 0; i < A.length; i++)
            for (var j = 0; j < U.length; j++)
                if (A[i].base === U[j].base && A[i].kind !== 'base' || A[i].base === U[j].base && U[j].kind !== 'base')
                    return { base: A[i].base, want: kindOf(a, A[i].base), got: kindOf(u, U[j].base) };
        return null;
    }
    function kindOf(w, base) {
        w = low(w);
        if (w === base) return 'base';
        var ir = IR[base];
        if (ir) {
            var past = ir.past.indexOf(w) >= 0, pp = ir.pp.indexOf(w) >= 0;
            if (past && pp) return 'pastpp';
            if (past) return 'past';
            if (pp) return 'pp';
        }
        if (/ing$/.test(w)) return 'ing';
        if (/ed$/.test(w)) return 'pastpp';
        if (/s$/.test(w)) return 's';
        return 'other';
    }
    var KIND = { base: 'начальная форма (V1)', s: 'форма с -s', past: 'вторая форма (V2, прошедшее)', pp: 'третья форма (V3)', pastpp: 'форма на -ed (V2/V3)', ing: 'форма на -ing', other: 'другая форма' };
    function forms(base) {
        var ir = IR[base];
        return ir ? '<b>' + esc(base) + ' → ' + esc(ir.past.join('/')) + ' → ' + esc(ir.pp.join('/')) + '</b> (неправильный глагол)' : '';
    }
    var MODALS = /^(can|could|must|might|may|should|will|would|shall|'ll|'d|mustn't|can't|couldn't|shouldn't|won't|wouldn't|cannot|needn't|had better|ought to)$/;
    var DOAUX = /^(do|does|did|don't|doesn't|didn't)$/;
    var HAVE = /^(have|has|had|'ve|'d|haven't|hasn't|hadn't)$/;
    var BE = /^(am|is|are|was|were|be|been|being|'m|'re|'s|isn't|aren't|wasn't|weren't)$/;
    var GERUND_V = /^(enjoy|enjoys|enjoyed|mind|finish|finished|avoid|suggest|suggested|admit|admitted|deny|denied|keep|kept|practise|practice|consider|miss|imagine|risk|stop|stopped|like|love|hate|prefer|start|began|begin|go on|carry on|give up|look forward to|be used to|get used to|can't stand|it's worth|spend|recommend)$/;
    var INF_V = /^(want|wants|wanted|decide|decided|hope|hoped|plan|planned|agree|agreed|refuse|refused|promise|promised|need|needed|would like|'d like|learn|learnt|manage|managed|offer|offered|afford|seem|seems|choose|chose|expect|expected|forget|forgot|try|tried|arrange|arranged|intend|threaten|pretend|attempt|fail|failed|tend|deserve|ask|asked|tell|told|warn|warned|advise|advised|allow|allowed|encourage|invite)$/;
    var SUBJ3 = /^(he|she|it|this|that|everyone|everybody|nobody|somebody|someone|my \w+|his \w+|her \w+|the \w+)$/;
    var PREPS = ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into', 'onto', 'since', 'during', 'until', 'till', 'over', 'under', 'after', 'before', 'through', 'across', 'along', 'among', 'between', 'off', 'out', 'up', 'down', 'towards', 'without', 'within', 'per', 'like', 'as', 'than'];
    var ARTS = ['a', 'an', 'the'];
    var DAYS = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekdays|the weekend|weekends|my birthday|christmas day|new year's day)/;
    var MONTHS = /^(january|february|march|april|may|june|july|august|september|october|november|december|spring|summer|autumn|winter|the morning|the afternoon|the evening|\d{4}|the \d+(st|nd|rd|th) century|the past|the future)/;
    var CLOCK = /^(\d+(:\d+)?\s*(o'clock|am|pm|a\.m\.|p\.m\.)?|night|noon|midnight|the weekend|the moment|the end|the same time|lunchtime|weekends|christmas)\b/;

    var TENSES = {
        'Present Simple': ['V1, с he/she/it — V+s', 'привычки, факты, расписания (usually, every day, often)'],
        'Present Continuous': ['am/is/are + V-ing', 'действие происходит сейчас или временно (now, at the moment, look!)'],
        'Past Simple': ['V2 / V-ed', 'законченное действие в прошлом, время известно (yesterday, ago, last…, in 2015)'],
        'Past Continuous': ['was/were + V-ing', 'процесс в определённый момент прошлого (at 8 pm yesterday, while…, when…)'],
        'Present Perfect': ['have/has + V3', 'результат к настоящему моменту или опыт, время не важно (already, yet, ever, never, just, since, for)'],
        'Present Perfect Continuous': ['have/has been + V-ing', 'действие длится с прошлого до сейчас (for two hours, since morning)'],
        'Past Perfect': ['had + V3', 'действие случилось раньше другого действия в прошлом (before, by the time, already)'],
        'Future Simple': ['will + V1', 'решение в момент речи, прогноз, обещание (I think…, probably, tomorrow)'],
        'be going to': ['am/is/are going to + V1', 'план или намерение; прогноз по тому, что видим'],
        'Future Continuous': ['will be + V-ing', 'процесс в определённый момент будущего'],
        'Passive': ['be + V3', 'важно действие, а не тот, кто его сделал'],
        'Conditional (would)': ['would + V1', 'нереальная ситуация: If I were…, I would…'],
        'Modal Perfect': ['must/might/can\'t + have + V3', 'догадка о прошлом: must have — почти уверены, might have — возможно, can\'t have — точно нет']
    };
    function isPP(w) { w = low(w); return !!IR_PP[w] || /ed$/.test(w); }
    function tenseOf(s) {
        var t = ' ' + low(s).replace(/[.!?,]/g, '') + ' ', m;
        if (/ (must|mustn't|might|may|could|can't|couldn't|should|shouldn't) (have|has) (been )?\w+/.test(t)) return 'Modal Perfect';
        if (/ (have|has|'ve|'s|haven't|hasn't) been \w+ing /.test(t)) return 'Present Perfect Continuous';
        if (/ (will|'ll|won't) be \w+ing /.test(t)) return 'Future Continuous';
        if (/ (am|is|are|'m|'re|'s|isn't|aren't) going to /.test(t)) return 'be going to';
        if ((m = t.match(/ (had|'d|hadn't) (\w+) /)) && isPP(m[2]) && m[2] !== 'better') return 'Past Perfect';
        if ((m = t.match(/ (am|is|are|was|were|be|been|being|'m|'re|isn't|aren't|wasn't|weren't) (\w+) /)) && isPP(m[2]) && !/ing$/.test(m[2])) return 'Passive';
        if ((m = t.match(/ (have|has|'ve|haven't|hasn't) (\w+) /)) && isPP(m[2])) return 'Present Perfect';
        if (/ (will|'ll|won't) /.test(t)) return 'Future Simple';
        if (/ (would|'d|wouldn't) /.test(t)) return 'Conditional (would)';
        if (/ (am|is|are|'m|'re|isn't|aren't) \w+ing /.test(t)) return 'Present Continuous';
        if (/ (was|were|wasn't|weren't) \w+ing /.test(t)) return 'Past Continuous';
        if (/ (did|didn't) /.test(t)) return 'Past Simple';
        if (/ (do|does|don't|doesn't) /.test(t)) return 'Present Simple';
        var w = toks(s);
        if (w.length <= 3) {
            for (var i = 0; i < w.length; i++) {
                if (IR_PAST[w[i]] && !IR[w[i]] || /^(was|were)$/.test(w[i])) return 'Past Simple';
                if (/^[a-z]+ed$/.test(w[i]) && w[i].length > 4) return 'Past Simple';
            }
        }
        return '';
    }
    var MARKERS = [
        [/\b(yesterday|ago|last (night|week|month|year|summer|winter|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday|time)|in (19|20)\d\d|when i was)\b/, ['Past Simple', 'Past Continuous', 'Passive']],
        [/\b(already|yet|ever|never|just|so far|recently|lately)\b/, ['Present Perfect', 'Past Perfect']],
        [/\b(since|for (two|three|four|five|six|ten|\d+|a|many|several|ages|years|hours|weeks|months))\b/, ['Present Perfect', 'Present Perfect Continuous', 'Past Perfect']],
        [/\b(now|right now|at the moment|currently|look!|listen!|these days|today)\b/, ['Present Continuous']],
        [/\b(usually|always|often|every (day|morning|week|year|evening|weekend|summer)|sometimes|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/, ['Present Simple']],
        [/\b(tomorrow|next (week|month|year|summer|monday|time)|soon|in the future|tonight)\b/, ['Future Simple', 'be going to', 'Future Continuous', 'Present Continuous']],
        [/\b(while|at (\d+|that moment|this time) .*yesterday)\b/, ['Past Continuous']],
        [/\b(by the time|before|after)\b/, ['Past Perfect']],
        [/\bif\b/, ['Conditional (would)', 'Present Simple', 'Future Simple', 'Past Simple']]
    ];
    function marker(sentence, tense) {
        var s = low(sentence);
        for (var i = 0; i < MARKERS.length; i++) {
            var m = s.match(MARKERS[i][0]);
            if (m && MARKERS[i][1].indexOf(tense) >= 0) return m[0];
        }
        return '';
    }
    var CONFUSE = [
        [['its', "it's"], "<b>its</b> — «его/её» (принадлежность), <b>it's</b> = it is / it has."],
        [['your', "you're"], "<b>your</b> — «твой, ваш», <b>you're</b> = you are."],
        [['their', 'there', "they're"], "<b>their</b> — «их», <b>there</b> — «там» и <i>there is/are</i>, <b>they're</b> = they are."],
        [['whose', "who's"], "<b>whose</b> — «чей», <b>who's</b> = who is / who has."],
        [['then', 'than'], "<b>than</b> — «чем» в сравнениях (bigger than), <b>then</b> — «потом, тогда»."],
        [['much', 'many'], "<b>many</b> — с исчисляемыми (many books), <b>much</b> — с неисчисляемыми (much time, much money)."],
        [['few', 'little', 'a few', 'a little'], "<b>(a) few</b> — с исчисляемыми (a few friends), <b>(a) little</b> — с неисчисляемыми (a little water)."],
        [['say', 'tell', 'said', 'told', 'says', 'tells', 'saying', 'telling'], "<b>tell</b> + кому (tell me, told her), <b>say</b> + что (say hello, said that…)."],
        [['make', 'do', 'made', 'did', 'does', 'makes', 'making', 'doing', 'done'], "<b>make</b> — создавать, производить (make a cake, make a mistake, make money); <b>do</b> — выполнять работу и действия (do homework, do sport, do the shopping)."],
        [['who', 'which', 'that', 'whose', 'where', 'when'], "<b>who</b> — о людях, <b>which</b> — о предметах и животных, <b>that</b> — о тех и других, <b>whose</b> — «чей», <b>where</b> — о месте, <b>when</b> — о времени."],
        [['some', 'any', 'no'], "<b>some</b> — в утверждениях и просьбах, <b>any</b> — в вопросах и отрицаниях, <b>no</b> = not any."],
        [['since', 'for', 'ago'], "<b>since</b> — с какого момента (since 2020), <b>for</b> — как долго (for two years), <b>ago</b> — сколько времени назад (two years ago, с Past Simple)."],
        [['already', 'yet', 'still', 'just'], "<b>already</b> — «уже» в утверждениях, <b>yet</b> — «уже/ещё» в вопросах и отрицаниях (в конце), <b>still</b> — «всё ещё», <b>just</b> — «только что»."],
        [['this', 'these', 'that', 'those'], "<b>this/that</b> — один предмет, <b>these/those</b> — несколько; <b>this/these</b> — рядом, <b>that/those</b> — дальше."],
        [['was', 'were'], "<b>was</b> — с I / he / she / it, <b>were</b> — с you / we / they (и в «If I were you»)."],
        [['is', 'are', 'am'], "<b>am</b> — с I, <b>is</b> — с he / she / it и единственным числом, <b>are</b> — с you / we / they и множественным."],
        [['has', 'have'], "<b>has</b> — с he / she / it, <b>have</b> — с I / you / we / they."],
        [['does', 'do', "doesn't", "don't"], "<b>does / doesn't</b> — с he / she / it, <b>do / don't</b> — с I / you / we / they."],
        [["mustn't", "don't have to", "doesn't have to", "needn't"], "<b>mustn't</b> — нельзя (запрет), <b>don't have to</b> — не обязательно, можно не делать."],
        [['must', "can't", 'might', 'may', 'could'], "Степень уверенности: <b>must</b> — почти уверены, что да; <b>might / may / could</b> — возможно; <b>can't</b> — уверены, что нет."],
        [['good', 'well'], "<b>good</b> — прилагательное (a good player), <b>well</b> — наречие (he plays well)."],
        [['bored', 'boring', 'interested', 'interesting', 'tired', 'tiring', 'excited', 'exciting', 'surprised', 'surprising', 'annoyed', 'annoying'], "<b>-ed</b> — что чувствует человек (I'm bored), <b>-ing</b> — какой предмет или ситуация (the film is boring)."],
        [['lend', 'borrow', 'lent', 'borrowed'], "<b>lend</b> — давать взаймы, <b>borrow</b> — брать взаймы."],
        [['other', 'another', 'others'], "<b>another</b> — ещё один (единственное число), <b>other</b> — другие (+ существительное), <b>others</b> — другие (без существительного)."],
        [['each', 'every', 'all'], "<b>every / each</b> + единственное число (every day), <b>all</b> + множественное (all days)."],
        [['used to', 'use to', 'be used to', 'get used to'], "<b>used to + V1</b> — привычка в прошлом; после did — <b>use to</b>; <b>be / get used to + V-ing</b> — привыкнуть к чему-то."]
    ];
    var MAKE = /^(make|makes|made|making)$/, DO = /^(do|does|did|done|doing)$/;
    function confuseRule(u, a) {
        u = clean(u); a = clean(a);
        if ((MAKE.test(u) || MAKE.test(a)) !== (DO.test(u) || DO.test(a)) || DO.test(u) && DO.test(a)) {
            if (DO.test(u) && DO.test(a)) {
                if (/^(does|do)$/.test(a) && /^did$/.test(u)) return '<b>did</b> — для прошлого, а здесь настоящее время: <b>do</b> — с I / you / we / they, <b>does</b> — с he / she / it.';
                if (a === 'did') return 'Здесь прошедшее время — вспомогательный глагол <b>did</b> (для всех лиц).';
                if (/^(does|do)$/.test(a)) return '<b>does</b> — с he / she / it, <b>do</b> — с I / you / we / they.';
            }
        }
        for (var i = 0; i < CONFUSE.length; i++)
            if (CONFUSE[i][0].indexOf(u) >= 0 && CONFUSE[i][0].indexOf(a) >= 0) return CONFUSE[i][1];
        return '';
    }
    function lev(a, b) {
        var m = a.length, n = b.length, d = [], i, j;
        for (i = 0; i <= m; i++) { d[i] = [i]; }
        for (j = 0; j <= n; j++) d[0][j] = j;
        for (i = 1; i <= m; i++)
            for (j = 1; j <= n; j++)
            {
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        return d[m][n];
    }
    // слова, которые отличаются (LCS по словам)
    function wordDiff(u, a) {
        var U = toks(u), A = toks(a), m = U.length, n = A.length, L = [], i, j;
        for (i = 0; i <= m; i++) { L[i] = []; for (j = 0; j <= n; j++) L[i][j] = 0; }
        for (i = m - 1; i >= 0; i--) for (j = n - 1; j >= 0; j--) L[i][j] = U[i] === A[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
        var ops = [], extra = [], miss = [], prevA = '';
        i = 0; j = 0;
        var flush = function () {
            if (extra.length || miss.length) ops.push({ u: extra.join(' '), a: miss.join(' '), prev: prevA, next: A[j] || '' });
            extra = []; miss = [];
        };
        while (i < m || j < n) {
            if (i < m && j < n && U[i] === A[j]) { flush(); prevA = A[j]; i++; j++; }
            else if (j < n && (i >= m || L[i][j + 1] >= L[i + 1][j])) { miss.push(A[j]); j++; }
            else { extra.push(U[i]); i++; }
        }
        flush();
        return { ops: ops, U: U, A: A };
    }
    var DICT = null;
    function dict() {
        if (DICT) return DICT;
        try { DICT = JSON.parse((document.getElementById('core-dict') || {}).textContent || '{}'); } catch (_) { DICT = {}; }
        return DICT;
    }
    function ru(w) {
        w = clean(w);
        var d = dict();
        if (d[w]) return d[w];
        var b = w.replace(/^(to|a|an|the) /, '');
        if (d[b]) return d[b];
        if (d['to ' + b]) return d['to ' + b];
        var A = analyse(b);
        for (var i = 0; i < A.length; i++) { if (d[A[i].base]) return d[A[i].base]; if (d['to ' + A[i].base]) return d['to ' + A[i].base]; }
        return '';
    }
    function subjectOf(before) {
        var t = toks(before);
        for (var i = t.length - 1; i >= 0; i--) {
            if (/^(i|you|he|she|it|we|they|everyone|everybody|nobody|somebody|someone)$/.test(t[i])) return t[i];
            if (i > 0 && /^(the|my|his|her|our|your|their|this|that|a|an)$/.test(t[i - 1])) return t[i - 1] + ' ' + t[i];
        }
        var raw = String(before || '').trim().split(/\s+/);
        for (var j = raw.length - 1; j >= 0; j--) if (/^[A-Z][a-z]+$/.test(raw[j])) return raw[j];
        return '';
    }
    var prevWord = function (s) { var t = toks(s); return t.length ? t[t.length - 1] : ''; };
    var prev2 = function (s) { var t = toks(s); return t.slice(-2).join(' '); };

    // объяснение одной замены «u → a» в окружении
    function explainPair(u, a, before, after, sentence) {
        var pw = prevWord(before), p2 = prev2(before), nx = toks(after)[0] || '', rule;
        if (MODALS.test(pw) && /^(have|be)$/.test(a) && /^(has|had|is|are|was|were|am|been|having|being)$/.test(u))
            return 'После <b>' + esc(pw) + '</b> глагол всегда в начальной форме: <b>' + esc(pw) + ' ' + esc(a) + '</b> (не ' + esc(pw) + ' ' + esc(u) + ').';
        if (/^mustn't$/.test(u) && /^(can't|couldn't)$/.test(a))
            return '<b>mustn\'t</b> — это запрет («нельзя»), а не догадка. Если уверены, что чего-то не было или быть не может, — <b>can\'t (have)</b>.';
        // перепутаны похожие слова
        if ((rule = confuseRule(u, a))) return rule;
        // артикли
        if (ARTS.indexOf(a) >= 0 && (ARTS.indexOf(u) >= 0 || !u)) {
            if (a === 'an' && u === 'a') return '<b>an</b> — перед гласным звуком: an apple, an hour, an honest man.' + (nx ? ' Здесь дальше <i>' + esc(nx) + '</i>.' : '');
            if (a === 'a' && u === 'an') return '<b>a</b> — перед согласным звуком: a car, a university, a one-way ticket.' + (nx ? ' Здесь дальше <i>' + esc(nx) + '</i>.' : '');
            if (a === 'the') return '<b>the</b> — когда понятно, о каком именно предмете речь: его уже упоминали, он единственный (the sun, the best) или уточнён (the book on the table).';
            return '<b>a / an</b> — один из многих, упоминаем впервые или говорим о профессии: I have a dog, She is a doctor.';
        }
        if (ARTS.indexOf(u) >= 0 && !a) return 'Артикль здесь не нужен: перед именами, городами, странами, множественным числом и неисчисляемыми в общем смысле (I like music, Dogs are clever).';
        // предлоги
        if (PREPS.indexOf(a) >= 0 && (PREPS.indexOf(u) >= 0 || !u)) {
            var rest = low(after);
            if (/^(in|on|at)$/.test(a)) {
                if (DAYS.test(rest)) return '<b>on</b> — с днями и датами: on Monday, on 5 May, on my birthday.';
                if (MONTHS.test(rest)) return '<b>in</b> — с месяцами, годами, сезонами и частями дня: in May, in 2020, in summer, in the morning.';
                if (CLOCK.test(rest)) return '<b>at</b> — с точным временем и в выражениях at night, at the weekend, at the moment.';
            }
            var w = pw || '';
            return 'Предлог тут устойчивый — его запоминают вместе со словом: <b>' + esc((w ? w + ' ' : '') + a + (nx && !w ? ' ' + nx : '')) + '</b>.';
        }
        if (PREPS.indexOf(u) >= 0 && !a) return 'Предлог <b>' + esc(u) + '</b> здесь лишний' + (pw ? ': после <i>' + esc(pw) + '</i> сразу идёт дополнение' : '') + '.';
        // формы одного глагола
        var rel = verbRelation(u, a);
        if (rel) {
            var f = forms(rel.base), wk = rel.want, gk = rel.got;
            if (MODALS.test(pw) && wk === 'base') return 'После <b>' + esc(pw) + '</b> глагол стоит в начальной форме — без to, -s и -ed: ' + esc(pw) + ' ' + esc(a) + '.';
            if (DOAUX.test(pw) && wk === 'base') return 'После <b>' + esc(pw) + '</b> глагол стоит в начальной форме: время уже показывает ' + esc(pw) + ' (didn\'t go, не didn\'t went; does she like, не does she likes).';
            if (pw === 'to' && wk === 'base') return 'После <b>to</b> — начальная форма глагола: to ' + esc(a) + '.';
            if (HAVE.test(pw) && (wk === 'pp' || wk === 'pastpp')) return 'После <b>' + esc(pw) + '</b> нужна третья форма (V3)' + (f ? ': ' + f : ': ' + esc(rel.base) + ' → ' + esc(a)) + '.';
            if (BE.test(pw) && wk === 'ing') return 'Длительное время: <b>be + глагол-ing</b> (' + esc(pw) + ' ' + esc(a) + ').';
            if (BE.test(pw) && (wk === 'pp' || wk === 'pastpp')) return 'Пассив: <b>be + V3</b> — действие совершают над подлежащим' + (f ? '. ' + f : '') + '.';
            if (wk === 'ing' && GERUND_V.test(pw)) return 'После <b>' + esc(pw) + '</b> глагол ставится в форму <b>-ing</b>: ' + esc(pw) + ' ' + esc(a) + '.';
            if (wk === 'ing' && PREPS.indexOf(pw) >= 0) return 'После предлога (<b>' + esc(pw) + '</b>) глагол всегда с <b>-ing</b>: ' + esc(pw) + ' ' + esc(a) + '.';
            if (wk === 's') {
                var subj = subjectOf(before);
                return 'Present Simple: с <b>he / she / it</b> (и одним человеком/предметом) глагол получает <b>-s / -es</b>' + (subj ? ' — здесь подлежащее <i>' + esc(subj) + '</i>' : '') + '.';
            }
            if (gk === 's' && wk === 'base') return 'Окончание <b>-s</b> нужно только с he / she / it в Present Simple. С I / you / we / they, после do / does / did и модальных глаголов — без -s.';
            if (wk === 'past' || wk === 'pastpp' && !HAVE.test(pw) && !BE.test(pw)) {
                var mk = marker(sentence, 'Past Simple');
                return 'Здесь прошедшее время (Past Simple)' + (mk ? ' — подсказка в предложении: <i>' + esc(mk) + '</i>' : '') + '. ' + (f || 'Правильный глагол: + <b>-ed</b>.');
            }
            if (wk === 'pp') return 'Нужна третья форма (V3). ' + f;
            if (wk === 'base' && gk === 'ing') return 'Здесь нужна начальная форма, а не -ing.';
            return 'Нужна другая форма глагола: <b>' + KIND[wk] + '</b>, а у вас — ' + KIND[gk] + '. ' + f;
        }
        // to + V / -ing после глаголов
        if (/^to /.test(a) && /ing$/.test(u) && INF_V.test(pw)) return 'После <b>' + esc(pw) + '</b> идёт <b>to + глагол</b>: ' + esc(pw) + ' ' + esc(a) + '.';
        if (/ing$/.test(a) && /^to /.test(u) && GERUND_V.test(pw)) return 'После <b>' + esc(pw) + '</b> глагол ставится в форму <b>-ing</b>: ' + esc(pw) + ' ' + esc(a) + '.';
        // степени сравнения
        if (/^(more|most) /.test(a) && /(er|est)$/.test(u)) return 'Длинные прилагательные (2+ слога, кроме -y) сравниваем через <b>more / most</b>: more interesting, the most expensive.';
        if (/(er|est)$/.test(a) && /^(more|most) /.test(u)) return 'Короткие прилагательные (1 слог и 2 слога на -y) получают <b>-er / -est</b>: big → bigger, easy → easier, the cheapest.';
        if (/^(better|best|worse|worst|further|farther|more|less|least)$/.test(a)) return 'Особые формы сравнения: <b>good → better → the best, bad → worse → the worst, far → further → the furthest, much/many → more → the most</b>.';
        if (/^the /.test(a) && /(est|^most )/.test(a.replace(/^the /, '')) && !/^the /.test(u)) return 'С превосходной степенью нужен <b>the</b>: the biggest, the most beautiful.';
        // лексика: два разных слова
        var ra = ru(a), rus = ru(u);
        if (ra && rus && clean(ra) !== clean(rus)) return '<b>' + esc(u) + '</b> — «' + esc(rus) + '», а по смыслу здесь нужно <b>' + esc(a) + '</b> — «' + esc(ra) + '».';
        if (ra && !rus && toks(a).length <= 3) return 'По смыслу здесь подходит <b>' + esc(a) + '</b> — «' + esc(ra) + '».';
        // опечатка
        if (u && a && lev(u, a) <= Math.max(1, Math.floor(a.length / 4))) return 'Почти! Проверьте написание: ' + spell(u, a) + '.';
        return '';
    }
    function spell(u, a) {
        // выделяем отличающиеся буквы в правильном слове
        var i = 0, j = 0, out = '';
        var pre = 0; while (pre < u.length && pre < a.length && u[pre] === a[pre]) pre++;
        var suf = 0; while (suf < u.length - pre && suf < a.length - pre && u[u.length - 1 - suf] === a[a.length - 1 - suf]) suf++;
        out = esc(a.slice(0, pre)) + '<mark>' + esc(a.slice(pre, a.length - suf) || '·') + '</mark>' + esc(a.slice(a.length - suf));
        return '<s>' + esc(u) + '</s> → <b>' + out + '</b>';
    }
    function missingRule(w, prev, sentence) {
        if (/^(do|does|did)$/.test(w)) return 'Не хватает <b>' + w + '</b>: в вопросах и отрицаниях Present / Past Simple нужен вспомогательный глагол (Do you…? Did she…? I don\'t…).';
        if (/^(have|has|had)$/.test(w)) return 'Не хватает <b>' + w + '</b>: перфектные времена строятся как have/has/had + V3.';
        if (/^(am|is|are|was|were|be|been)$/.test(w)) return 'Не хватает глагола <b>' + w + '</b>. В английском предложении всегда есть глагол: «Я студент» — I <b>am</b> a student; длительные времена и пассив тоже строятся с be.';
        if (/^(will|would)$/.test(w)) return 'Не хватает <b>' + w + '</b>: ' + (w === 'will' ? 'будущее время — will + V1.' : 'условное — would + V1.');
        if (w === 'to') return 'Не хватает <b>to</b>' + (prev ? ' после <i>' + esc(prev) + '</i>' : '') + ': ' + (INF_V.test(prev) ? 'после этого глагола идёт to + глагол.' : 'здесь нужен инфинитив с to.');
        if (ARTS.indexOf(w) >= 0) return 'Не хватает артикля <b>' + w + '</b>. ' + (w === 'the' ? 'The — когда понятно, о каком именно предмете речь.' : 'A/an — перед исчисляемым существительным в единственном числе, когда упоминаем впервые.');
        if (PREPS.indexOf(w) >= 0) return 'Не хватает предлога <b>' + w + '</b>' + (prev ? ': <i>' + esc(prev) + ' ' + w + '</i>' : '') + '.';
        if (w === 'not' || w === "n't") return 'Не хватает отрицания <b>not</b>.';
        if (/^(it|there)$/.test(w)) return 'Не хватает <b>' + w + '</b>: в английском у предложения всегда есть подлежащее (It is cold. There is a cat.).';
        return 'Не хватает слова <b>' + esc(w) + '</b>.';
    }
    function extraRule(w, prev) {
        if (w === 'to' && MODALS.test(prev)) return 'После <b>' + esc(prev) + '</b> частица to не нужна: ' + esc(prev) + ' + глагол.';
        if (w === 'to') return 'Лишнее <b>to</b>' + (prev ? ' после <i>' + esc(prev) + '</i>' : '') + '.';
        if (ARTS.indexOf(w) >= 0) return 'Артикль <b>' + w + '</b> здесь лишний: не ставим его перед именами, множественным числом и неисчисляемыми в общем смысле, а также если уже есть my / this / some.';
        if (/^(do|does|did)$/.test(w)) return 'Лишнее <b>' + w + '</b>: в утвердительных предложениях вспомогательный do/does/did не нужен (She lives…, не She does live…).';
        if (/^(am|is|are|was|were)$/.test(w)) return 'Лишний глагол <b>' + w + '</b>: в Present / Past Simple be не ставят перед другим глаголом (I live, не I am live).';
        if (PREPS.indexOf(w) >= 0) return 'Предлог <b>' + w + '</b> здесь лишний' + (prev ? ': <i>' + esc(prev) + '</i> + дополнение без предлога' : '') + '.';
        return 'Лишнее слово <b>' + esc(w) + '</b>.';
    }
    function bestAnswer(user, answers) {
        var u = clean(user), best = answers[0], bd = 1e9;
        answers.forEach(function (a) { var d = lev(u, clean(a)); if (d < bd) { bd = d; best = a; } });
        return best;
    }
    function explain(user, answers, ctx) {
        ctx = ctx || {};
        answers = (answers || []).filter(Boolean);
        if (!answers.length) return null;
        var a0 = bestAnswer(user, answers), a = clean(a0), u = clean(user);
        var before = ctx.before || '', after = ctx.after || '', sentence = ctx.sentence || (before + ' ' + a + ' ' + after);
        var parts = [];
        var push = function (s) { if (s && parts.indexOf(s) < 0) parts.push(s); };
        var D = wordDiff(u, a), sameBag = D.U.slice().sort().join(' ') === D.A.slice().sort().join(' ');
        if (sameBag && D.U.length > 1) {
            push('Все слова верные, но <b>порядок</b> другой.');
            if (/^(do|does|did|is|are|am|was|were|have|has|had|can|could|will|would|should|must|may|might|what|where|when|why|who|how|which)\b/.test(a))
                push('В вопросе вспомогательный глагол стоит <b>перед подлежащим</b>: <i>Where do you live? Have you ever been…? Can she swim?</i>');
            else if (/\b(always|usually|often|sometimes|never|rarely|seldom|ever|just|already|still)\b/.test(a))
                push('Наречия частоты (always, usually, often, never…) ставим <b>перед смысловым глаголом</b>, но <b>после be</b> и вспомогательных: <i>She always walks. She is always late. I have never been.</i>');
            else push('Базовый порядок: <b>кто → что делает → что / кого → где → когда</b>: <i>I met my friend in the park yesterday.</i>');
        } else {
            var miss = [], extra = [];
            D.ops.forEach(function (op) { if (op.a) miss = miss.concat(op.a.split(' ')); if (op.u) extra = extra.concat(op.u.split(' ')); });
            var moved = miss.filter(function (w) { return extra.indexOf(w) >= 0; });
            if (moved.length) {
                push('Слово <b>' + esc(moved[0]) + '</b> стоит не на своём месте.');
                if (/^(what|where|when|why|who|how|which|do|does|did|is|are|am|was|were|have|has|can|will|would|should)$/.test(moved[0]) || /^(what|where|when|why|who|how|which)\b/.test(a))
                    push('В английском вопросе вопросительное слово стоит <b>в начале</b>, а за ним — вспомогательный глагол и подлежащее: <i>Where do you live? What are you doing?</i>');
                miss.filter(function (w) { return moved.indexOf(w) < 0; }).slice(0, 1).forEach(function (w) { push(missingRule(w, '', sentence)); });
            }
            var ops = moved.length ? [] : D.ops.slice(0, 2);
            ops.forEach(function (op) {
                var ou = op.u, oa = op.a;
                var beforeTxt = D.A.length > 1 && D.U.length > 1 ? (op.prev || '') : before;
                var r = '';
                if (ou && oa) r = explainPair(ou, oa, D.A.length > 1 ? (beforeTxt ? before + ' ' + beforeTxt : before) : before, D.A.length > 1 ? (op.next || after) : after, sentence);
                else if (oa && !ou) r = missingRule(oa.split(' ')[0], op.prev || prevWord(before), sentence);
                else if (ou && !oa) r = extraRule(ou.split(' ')[0], op.prev || prevWord(before));
                push(r);
            });
        }
        // время глагола
        var tA = tenseOf(a), tU = tenseOf(u), full = sentence.replace(/_{2,}/g, a);
        var said = parts.join(' ');
        if (tA && tA !== tU && TENSES[tA] && (!parts.length || tU) && said.indexOf(tA) < 0 && !/третья форма|Длительное время|Пассив|начальной форме|настоящее время|прошедшее время/.test(said)) {
            var mk = marker(full, tA);
            push('Время: <b>' + tA + '</b> (' + esc(TENSES[tA][0]) + ') — ' + TENSES[tA][1] + '.' + (mk ? ' Подсказка в предложении: <i>' + esc(mk) + '</i>.' : '') + (tU && TENSES[tU] ? ' У вас — ' + tU + '.' : ''));
        }
        if (!parts.length) {
            var ra = ru(a);
            push(ra ? 'Правильный ответ <b>' + esc(a0) + '</b> — «' + esc(ra) + '». Перечитайте предложение целиком: какое слово подходит по смыслу и по грамматике?' : 'Сравните с правильным вариантом — отличия выделены ниже.');
        }
        var diffHtml = D.A.map(function (w) { return D.U.indexOf(w) >= 0 ? esc(w) : '<mark>' + esc(w) + '</mark>'; }).join(' ');
        return { html: parts.slice(0, 3).map(function (p) { return '<p>' + p + '</p>'; }).join(''), answer: a0, diff: diffHtml };
    }
    // для «Верно / Неверно»: какое место текста подтверждает ответ
    function evidence(question, scope) {
        if (!scope) return '';
        var qs = toks(question).filter(function (w) { return w.length > 3; });
        if (qs.length < 2) return '';
        var best = '', score = 0;
        Array.prototype.forEach.call(scope.querySelectorAll('p, li, td, .dlg-line, blockquote'), function (el) {
            if (el.closest('.mc, .ex, .why-note, .irv')) return;
            ((el.textContent || '').match(/[^.!?]+[.!?]*/g) || []).forEach(function (sn) {
                var t = toks(sn), sc = 0;
                qs.forEach(function (w) { if (t.indexOf(w) >= 0 || t.some(function (x) { return x.length > 4 && w.length > 4 && x.slice(0, 5) === w.slice(0, 5); })) sc++; });
                if (sc > score && sn.length < 400) { score = sc; best = sn.trim(); }
            });
        });
        return score >= 2 ? best : '';
    }
    window.irisExplain = explain;
    window.irisExplainEvidence = evidence;
    window.irisExplainTense = tenseOf;
})();
