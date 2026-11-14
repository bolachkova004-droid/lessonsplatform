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
function explainPair(u, a, before, after, sentence) {
var pw = prevWord(before), p2 = prev2(before), nx = toks(after)[0] || '', rule;
if (MODALS.test(pw) && /^(have|be)$/.test(a) && /^(has|had|is|are|was|were|am|been|having|being)$/.test(u))
return 'После <b>' + esc(pw) + '</b> глагол всегда в начальной форме: <b>' + esc(pw) + ' ' + esc(a) + '</b> (не ' + esc(pw) + ' ' + esc(u) + ').';
if (/^mustn't$/.test(u) && /^(can't|couldn't)$/.test(a))
return '<b>mustn\'t</b> — это запрет («нельзя»), а не догадка. Если уверены, что чего-то не было или быть не может, — <b>can\'t (have)</b>.';
if ((rule = confuseRule(u, a))) return rule;
if (ARTS.indexOf(a) >= 0 && (ARTS.indexOf(u) >= 0 || !u)) {
if (a === 'an' && u === 'a') return '<b>an</b> — перед гласным звуком: an apple, an hour, an honest man.' + (nx ? ' Здесь дальше <i>' + esc(nx) + '</i>.' : '');
if (a === 'a' && u === 'an') return '<b>a</b> — перед согласным звуком: a car, a university, a one-way ticket.' + (nx ? ' Здесь дальше <i>' + esc(nx) + '</i>.' : '');
if (a === 'the') return '<b>the</b> — когда понятно, о каком именно предмете речь: его уже упоминали, он единственный (the sun, the best) или уточнён (the book on the table).';
return '<b>a / an</b> — один из многих, упоминаем впервые или говорим о профессии: I have a dog, She is a doctor.';
}
if (ARTS.indexOf(u) >= 0 && !a) return 'Артикль здесь не нужен: перед именами, городами, странами, множественным числом и неисчисляемыми в общем смысле (I like music, Dogs are clever).';
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
if (/^to /.test(a) && /ing$/.test(u) && INF_V.test(pw)) return 'После <b>' + esc(pw) + '</b> идёт <b>to + глагол</b>: ' + esc(pw) + ' ' + esc(a) + '.';
if (/ing$/.test(a) && /^to /.test(u) && GERUND_V.test(pw)) return 'После <b>' + esc(pw) + '</b> глагол ставится в форму <b>-ing</b>: ' + esc(pw) + ' ' + esc(a) + '.';
if (/^(more|most) /.test(a) && /(er|est)$/.test(u)) return 'Длинные прилагательные (2+ слога, кроме -y) сравниваем через <b>more / most</b>: more interesting, the most expensive.';
if (/(er|est)$/.test(a) && /^(more|most) /.test(u)) return 'Короткие прилагательные (1 слог и 2 слога на -y) получают <b>-er / -est</b>: big → bigger, easy → easier, the cheapest.';
if (/^(better|best|worse|worst|further|farther|more|less|least)$/.test(a)) return 'Особые формы сравнения: <b>good → better → the best, bad → worse → the worst, far → further → the furthest, much/many → more → the most</b>.';
if (/^the /.test(a) && /(est|^most )/.test(a.replace(/^the /, '')) && !/^the /.test(u)) return 'С превосходной степенью нужен <b>the</b>: the biggest, the most beautiful.';
var ra = ru(a), rus = ru(u);
if (ra && rus && clean(ra) !== clean(rus)) return '<b>' + esc(u) + '</b> — «' + esc(rus) + '», а по смыслу здесь нужно <b>' + esc(a) + '</b> — «' + esc(ra) + '».';
if (ra && !rus && toks(a).length <= 3) return 'По смыслу здесь подходит <b>' + esc(a) + '</b> — «' + esc(ra) + '».';
if (u && a && lev(u, a) <= Math.max(1, Math.floor(a.length / 4))) return 'Почти! Проверьте написание: ' + spell(u, a) + '.';
return '';
}
function spell(u, a) {
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
(function () {
'use strict';
var C = window.__irisCore;
if (!C) return;
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var DAY = 864e5, STEPS = [0, 1, 3, 7];
var isTeacher = function () { var st = C.state(); return st.role === 'teacher' || document.body.classList.contains('teacher-access'); };
function store() {
var f = C.profile().fields, r = f['iris-rv'];
if (!r || typeof r !== 'object') r = f['iris-rv'] = { value: '', status: '', earned: false };
if (!r.items || typeof r.items !== 'object') r.items = {};
if (typeof r.mastered !== 'number') r.mastered = 0;
return r;
}
var LESSONS = null;
function lessonTitle(id) {
if (!LESSONS) { try { LESSONS = JSON.parse(($('#platform-data') || {}).textContent || '[]'); } catch (_) { LESSONS = []; } }
var list = Array.isArray(LESSONS) ? LESSONS : (LESSONS.lessons || []);
for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i].title || '';
return '';
}
function paneOf(el) { var st = el.closest('section.step'); return st && st.parentElement && st.parentElement.parentElement; }
function stepTitle(el) {
var st = el.closest('section.step'); if (!st) return '';
var ex = el.closest('.ex, .mc'), h = null, n = ex;
while (n && n !== st) { var p = n.previousElementSibling; while (p) { if (/^H[2-4]$/.test(p.tagName)) { h = p; break; } p = p.previousElementSibling; } if (h) break; n = n.parentElement; }
return (h ? h.textContent : st.getAttribute('data-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120);
}
function context(f) {
var host = f.closest('li, tr, p, td') || f.parentElement;
var before = '', after = '', seen = false, sentence = '';
var walk = function (node) {
if (node === f) { seen = true; sentence += ' ___ '; return; }
if (node.nodeType === 3) { if (seen) after += node.nodeValue; else before += node.nodeValue; sentence += node.nodeValue; return; }
if (node.nodeType !== 1) return;
if (node.matches('.why-note, .near-note, .chips, .order-words, .result, .ex-actions, .irv-added, button, .fb-inline')) return;
if (node.matches('input, select, textarea')) { sentence += ' … '; if (seen) after += ' … '; else before += ' … '; return; }
for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
};
walk(host);
var clean = function (s) { return s.replace(/\s+/g, ' ').trim(); };
var b = clean(before), a = clean(after);
var cut = Math.max(b.lastIndexOf('. '), b.lastIndexOf('? '), b.lastIndexOf('! '));
if (cut > 0) b = b.slice(cut + 2);
var hint = (a.match(/^\(([^)]{1,40})\)/) || [])[1] || '';
if (hint) a = a.replace(/^\([^)]*\)\s*/, '');
return { before: b.replace(/^\d+[.)]\s*/, ''), after: a, sentence: clean(sentence).replace(/^\d+[.)]\s*/, ''), hint: hint, placeholder: f.getAttribute('placeholder') || '' };
}
function answersOf(f) { return String(f.dataset.a || '').split('|').filter(Boolean); }
function noteHtml(r, opts) {
opts = opts || {};
return '<div class="why-note" role="note"><div class="why-head">💡 Почему не так</div>' + r.html +
'<details class="why-ans"><summary>Показать правильный ответ</summary><p>✅ ' + (r.diff || esc(r.answer)) + '</p></details>' +
(opts.review === false ? '' : '<p class="why-rev">🔁 Задание добавлено в «Работу над ошибками» — повторим сегодня и через несколько дней.</p>') + '</div>';
}
function addItem(item) {
var R = store(), old = R.items[item.k];
item.added = old ? old.added : Date.now();
item.box = 0; item.due = Date.now(); item.miss = (old ? old.miss || 0 : 0) + 1;
R.items[item.k] = item;
C.save();
paintBadges();
}
function explainField(f) {
var ctx = context(f), r = window.irisExplain(f.value, answersOf(f), ctx);
return { r: r, ctx: ctx };
}
function onChecked(ex) {
if (isTeacher()) return;
$$('.why-note', ex).forEach(function (n) { n.remove(); });
var added = 0;
$$('.gap[data-a].bad', ex).forEach(function (f) {
if (f.closest('.hunt')) return;
var x = explainField(f);
if (!x.r) return;
var note = f.nextElementSibling && f.nextElementSibling.classList.contains('near-note');
var host = f.closest('li, td') || f.parentElement;
var div = document.createElement('div');
div.innerHTML = noteHtml(note ? { html: '', answer: x.r.answer, diff: x.r.diff } : x.r);
var node = div.firstChild;
if (note) node.querySelector('.why-head').remove();
node.dataset.for = f.dataset.field || f.id;
host.appendChild(node);
var pane = paneOf(f);
addItem({
k: 'f:' + (f.dataset.field || f.id), kind: f.tagName === 'SELECT' ? 'select' : 'gap', lid: pane ? pane.id : '',
q: x.ctx.sentence, hint: x.ctx.hint || (f.tagName === 'SELECT' ? '' : x.ctx.placeholder), task: stepTitle(f),
a: answersOf(f), wrong: f.value,
opts: f.tagName === 'SELECT' ? $$('option', f).map(function (o) { return o.value || o.textContent; }).filter(Boolean) : null,
words: (function () { var ow = (f.closest('li') || f.parentElement).querySelector('.order-words'); return ow ? String(ow.dataset.words || '').split('|') : null; })()
});
added++;
});
paintAdded(ex, added);
}
function paintAdded(ex, n) {
var bar = $('.ex-actions', ex) || ex, old = $('.irv-added', ex);
if (old) old.remove();
if (!n) return;
bar.insertAdjacentHTML('afterend', '<div class="irv-added">🔁 В «Работу над ошибками» добавлено: <b>' + n + '</b>. <button type="button" class="ui-btn small soft irv-now">Повторить сейчас</button></div>');
}
function onChoice(mc) {
if (isTeacher()) return;
setTimeout(function () {
var bads = $$('.opt.bad', mc);
var old = $('.why-note', mc);
if (!bads.length) { if (old && $('.opt.ok', mc)) old.remove(); return; }
if (old) return;
var okBtn = $('.opt[data-ok]', mc), chosen = bads[bads.length - 1];
if (!okBtn) return;
var q = ($('.q', mc) || {}).textContent || '', opts = $$('.opt', mc).map(function (b) { return b.textContent.trim(); });
var okText = okBtn.textContent.trim(), bad = chosen.textContent.trim(), html = '';
if (/^(true|false|верно|неверно|yes|no|t|f|not given)$/i.test(okText)) {
var step = mc.closest('section.step'), ev = window.irisExplainEvidence(q.replace(/^\d+\.\s*/, ''), step);
html = ev ? '<p>📖 Найдите это место в тексте: <i>«' + esc(ev) + '»</i></p>' : '<p>Перечитайте текст ещё раз — ответ там есть.</p>';
} else {
var qq = q.replace(/^\d+\.\s*/, ''), parts = qq.split(/_{2,}|…{1,}|\.{3,}/);
var r = window.irisExplain(bad, [okText], { before: parts[0] || '', after: parts[1] || '', sentence: qq });
html = r ? r.html : '';
}
var r2 = { html: html, answer: okText, diff: esc(okText) };
mc.insertAdjacentHTML('beforeend', noteHtml(r2));
var pane = paneOf(mc);
addItem({ k: 'c:' + (mc.dataset.choice || ''), kind: 'mc', lid: pane ? pane.id : '', q: q.replace(/^\d+\.\s*/, ''), task: stepTitle(mc), a: [okText], opts: opts, wrong: bad, ctxText: html });
}, 30);
}
document.addEventListener('click', function (e) {
var t = e.target;
if (!t || !t.closest) return;
if (t.closest('.irv-now')) { openReview(); return; }
var btn = t.closest('.ex .check');
if (btn) { var ex = btn.closest('.ex'); setTimeout(function () { onChecked(ex); }, 40); return; }
var opt = t.closest('.mc .opt');
if (opt && opt.closest('.mc').dataset.choice) onChoice(opt.closest('.mc'));
});
document.addEventListener('input', function (e) {
var f = e.target;
if (!f || !f.matches || !f.matches('.gap[data-a]')) return;
var host = f.closest('li, td') || f.parentElement;
$$('.why-note', host).forEach(function (n) { if (n.dataset.for === (f.dataset.field || f.id)) n.remove(); });
}, true);
function dueList() {
var R = store(), now = Date.now();
return Object.keys(R.items).map(function (k) { return R.items[k]; }).filter(function (x) { return x && x.due <= now; }).sort(function (a, b) { return a.due - b.due; });
}
var session = null;
function openReview(keys) {
var list = dueList();
if (keys) list = list.filter(function (x) { return keys.indexOf(x.k) >= 0; });
list = list.slice(0, 12);
session = { list: list, i: 0, ok: 0, retried: {} };
var box = $('#iris-review');
if (box) box.dataset.done = '';
if (!box) {
box = document.createElement('div');
box.id = 'iris-review';
box.className = 'irv';
box.setAttribute('role', 'dialog');
box.setAttribute('aria-modal', 'true');
box.setAttribute('aria-label', 'Работа над ошибками');
document.body.appendChild(box);
box.addEventListener('click', onReviewClick);
box.addEventListener('submit', function (e) { e.preventDefault(); if (box.dataset.done === '1') { box.dataset.done = ''; session.i++; paintCard(); } else checkCurrent(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeReview(); });
}
box.hidden = false;
document.body.classList.add('irv-open');
paintCard();
}
function closeReview() { var b = $('#iris-review'); if (b) b.hidden = true; document.body.classList.remove('irv-open'); paintBadges(); }
function shell(inner) {
var s = session, n = s.list.length;
return '<div class="irv-card"><div class="irv-top"><div><div class="kicker">ПОВТОРЕНИЕ</div><h2>🔁 Работа над ошибками</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>' +
(n ? '<div class="irv-bar"><span style="width:' + Math.round(Math.min(s.i, n) / n * 100) + '%"></span></div>' : '') + inner + '</div>';
}
function promptHtml(it) {
var q = esc(it.q || ''), opts = function (list) { return '<div class="irv-opts">' + list.map(function (o) { return '<button type="button" class="opt irv-opt">' + esc(o) + '</button>'; }).join('') + '</div>'; };
var words = it.words ? '<p class="irv-hint">Слова: ' + it.words.map(function (w) { return '<span class="irv-chip">' + esc(w) + '</span>'; }).join(' ') + '</p>' : '';
if (it.kind === 'gap') {
var input = '<input class="field irv-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ваш ответ" placeholder="' + esc(it.hint || 'Ваш ответ') + '">';
var inline = (it.a[0] || '').split(' ').length <= 3 && (q.match(/___/g) || []).length === 1 && !/^\s*___\s*$/.test(q);
var body = inline ? '<p class="irv-q">' + q.replace('___', input) + '</p>' : '<p class="irv-q">' + q.replace(/\s*___\s*$/, '').replace(/^\s*___\s*/, '') + '</p>' + input;
return '<form class="irv-form">' + body + words + '</form>';
}
if (it.kind === 'select') return '<p class="irv-q">' + q.replace('___', '<span class="irv-blank">____</span>') + '</p>' + opts(shuffle(it.opts || []));
return '<p class="irv-q">' + q + '</p>' + opts(it.opts || []);
}
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function paintCard() {
var box = $('#iris-review'), s = session;
if (!s.list.length) {
var R = store(), all = Object.keys(R.items).length;
var next = Object.keys(R.items).map(function (k) { return R.items[k].due; }).sort()[0];
box.innerHTML = shell('<div class="irv-empty"><div class="irv-big">🌿</div><h3>На сегодня всё повторено</h3><p>' + (all ? 'В очереди: ' + all + '. Следующее повторение — ' + when(next) + '.' : 'Ошибок пока нет. Когда в задании что-то не получится, оно появится здесь.') + '</p>' + (R.mastered ? '<p>Усвоено заданий: <b>' + R.mastered + '</b> 🎉</p>' : '') + '<button type="button" class="ui-btn irv-close">Готово</button></div>');
return;
}
if (s.i >= s.list.length) {
box.innerHTML = shell('<div class="irv-empty"><div class="irv-big">' + (s.ok === s.list.length ? '🏆' : '💪') + '</div><h3>Верно: ' + s.ok + ' из ' + s.list.length + '</h3><p>Задания вернутся через 1, 3 и 7 дней — так правило запомнится надолго. После трёх верных ответов подряд задание уходит из списка.</p><button type="button" class="ui-btn irv-close">Готово</button></div>');
try { C.save(); } catch (_) { }
paintBadges();
return;
}
var it = s.list[s.i];
var title = lessonTitle(it.lid);
box.innerHTML = shell('<div class="irv-meta">' + (s.i + 1) + ' из ' + s.list.length + (title ? ' · ' + esc(title) : '') + '</div>' + (it.task ? '<div class="irv-task">' + esc(it.task) + '</div>' : '') +
'<div class="irv-body">' + promptHtml(it) + '</div><div class="irv-fb" aria-live="polite"></div>' +
'<div class="irv-actions">' + (it.kind === 'gap' ? '<button type="button" class="ui-btn irv-check">Проверить</button>' : '') + '<button type="button" class="ui-link irv-skip">Пропустить</button></div>' +
(it.wrong ? '<p class="irv-was">В прошлый раз: <s>' + esc(it.wrong) + '</s></p>' : ''));
var inp = $('.irv-in', box);
if (inp) setTimeout(function () { try { inp.focus(); } catch (_) { } }, 50);
}
function when(t) {
if (!t) return 'позже';
var d = Math.round((t - Date.now()) / DAY);
return d <= 0 ? 'сегодня' : d === 1 ? 'завтра' : 'через ' + d + ' ' + (d < 5 ? 'дня' : 'дней');
}
function grade(it, value, okFlag) {
var R = store(), cur = R.items[it.k];
if (!cur) return;
if (okFlag) {
cur.box = (cur.box || 0) + 1;
if (cur.box >= STEPS.length) { delete R.items[it.k]; R.mastered++; }
else cur.due = Date.now() + STEPS[cur.box] * DAY - 36e5;
} else {
cur.box = 0; cur.wrong = value; cur.miss = (cur.miss || 0) + 1;
cur.due = Date.now() + (session.retried[it.k] ? DAY - 36e5 : 0);
if (!session.retried[it.k]) { session.retried[it.k] = 1; session.list.push(cur); }
}
C.save();
}
function checkCurrent(choice) {
var box = $('#iris-review'), it = session.list[session.i];
if (!it || box.dataset.done === '1') return;
var value = choice != null ? choice : (($('.irv-in', box) || {}).value || '');
if (!String(value).trim()) { var i0 = $('.irv-in', box); if (i0) i0.focus(); return; }
var n = C.norm, ok = it.a.some(function (a) { return n(a) === n(value); });
box.dataset.done = '1';
grade(it, value, ok);
if (ok) session.ok++;
var fb = $('.irv-fb', box), html;
if (ok) html = '<div class="irv-ok">✅ Верно!' + (store().items[it.k] ? ' Повторим ' + when(store().items[it.k].due) + '.' : ' Задание усвоено 🎉') + '</div>';
else {
var r = it.kind === 'mc' && it.ctxText ? { html: it.ctxText, diff: esc(it.a[0]) } : window.irisExplain(value, it.a, { sentence: it.q, before: (it.q || '').split('___')[0] || '', after: (it.q || '').split('___')[1] || '' });
html = '<div class="why-note"><div class="why-head">💡 Почему не так</div>' + (r ? r.html : '') + '<p>✅ Правильно: ' + (r && r.diff ? r.diff : esc(it.a[0])) + '</p>' + (session.retried[it.k] === 1 && session.list.indexOf(it, session.i + 1) > 0 ? '<p class="why-rev">Вернёмся к этому заданию в конце.</p>' : '') + '</div>';
}
fb.innerHTML = html;
$$('.irv-opt', box).forEach(function (b) { b.disabled = true; if (it.a.some(function (a) { return n(a) === n(b.textContent); })) b.classList.add('ok'); else if (n(b.textContent) === n(value)) b.classList.add('bad'); });
var inp = $('.irv-in', box); if (inp) { inp.readOnly = true; inp.classList.add(ok ? 'ok' : 'bad'); }
var acts = $('.irv-actions', box);
acts.innerHTML = '<button type="button" class="ui-btn irv-next">' + (session.i + 1 < session.list.length ? 'Дальше →' : 'Завершить') + '</button>';
setTimeout(function () { var b = $('.irv-next', box); if (b) b.focus(); }, 30);
}
function onReviewClick(e) {
var t = e.target, box = $('#iris-review');
if (t === box || t.closest('.irv-close')) { closeReview(); return; }
if (t.closest('.irv-check')) { checkCurrent(); return; }
var o = t.closest('.irv-opt');
if (o && !o.disabled) { checkCurrent(o.textContent.trim()); return; }
if (t.closest('.irv-skip') || t.closest('.irv-next')) { box.dataset.done = ''; session.i++; paintCard(); return; }
}
function dueCount() { return dueList().length; }
function totalCount() { return Object.keys(store().items).length; }
function paintBadges() {
var n = dueCount();
$$('.irv-count').forEach(function (el) { el.textContent = String(n); });
$$('.irv-home').forEach(function (el) { el.classList.toggle('has-due', n > 0); });
if (window.irisPaintMe) try { window.irisPaintMe(); } catch (_) { }
}
window.irisReview = { open: openReview, due: dueCount, total: totalCount, paint: paintBadges };
})();
(function () {
'use strict';
var C = window.__irisCore;
if (!C) return;
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var P = {};
try { P = JSON.parse(($('#iris-packs') || {}).textContent || '{}'); } catch (_) { }
if (!P.areas) return;
var GOALS = P.goals, AREAS = P.areas, PACKS = P.packs;
var goalById = function (id) { for (var i = 0; i < GOALS.length; i++) if (GOALS[i][0] === id) return GOALS[i]; return null; };
var isTeacher = function () { var st = C.state(); return st.role === 'teacher' || document.body.classList.contains('teacher-access'); };
var isStudent = function () { var st = C.state(); return !isTeacher() && st.profile && st.profile !== 'teacher'; };
var speak = function (t) { if (window.irisSpeak) window.irisSpeak(t); };
var ipa = function (t) { return window.irisIpa ? window.irisIpa(t) : ''; };
function goal() { var f = C.profile().fields['iris-goal']; return f && f.goal && typeof f.goal === 'object' ? f.goal : null; }
function areaFor(g) {
if (!g) return '';
if (g.area && AREAS[g.area]) return g.area;
var t = String(g.text || '').toLowerCase();
var best = '';
Object.keys(AREAS).forEach(function (k) {
var a = AREAS[k];
if (best || !a[3] || (g.g && a[0] !== g.g && !(g.g === 'study' || g.g === 'work'))) return;
if (new RegExp(a[3]).test(t) && (!g.g || a[0] === g.g)) best = k;
});
if (!best) Object.keys(AREAS).forEach(function (k) { if (!best && AREAS[k][3] && new RegExp(AREAS[k][3]).test(t)) best = k; });
return best || ({ study: 'school', work: 'office', travel: 'travel', exam: 'exam', move: 'move', talk: 'talk' }[g.g] || 'talk');
}
function goalLabel(g) {
if (!g) return '';
var G = goalById(g.g), a = AREAS[areaFor(g)];
var s = (G ? G[1] + ' ' + G[2] : '') + (a && (g.g === 'study' || g.g === 'work') ? ' · ' + a[2] : '');
return s;
}
function goalText(g) { return g ? goalLabel(g) + (g.text ? ' — «' + g.text + '»' : '') : ''; }
function injectFields() {
$$('main > section.step:last-of-type').forEach(function (sec) {
if ($('.iris-goal-in', sec)) return;
var inp = document.createElement('input');
inp.type = 'hidden';
inp.className = 'iris-goal-in';
inp.setAttribute('data-field', 'iris-goal');
inp.setAttribute('aria-label', '🎯 Цель ученика');
inp.setAttribute('placeholder', '🎯 Цель ученика');
sec.appendChild(inp);
});
}
function saveGoal(g) {
var p = C.profile();
g.at = Date.now();
p.fields['iris-goal'] = { value: goalText(g), status: '', attempted: false, revealed: false, earned: false, goal: g };
C.save();
paintMe();
}
function modal(id, html) {
var m = $('#' + id);
if (!m) {
m = document.createElement('div');
m.id = id;
m.className = 'irv iris-modal';
m.setAttribute('role', 'dialog');
m.setAttribute('aria-modal', 'true');
document.body.appendChild(m);
m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.irv-close')) close(id); });
}
m.innerHTML = '<div class="irv-card">' + html + '</div>';
m.hidden = false;
document.body.classList.add('irv-open');
return m;
}
function close(id) { var m = $('#' + id); if (m) m.hidden = true; if (!$$('.irv').some(function (x) { return !x.hidden; })) document.body.classList.remove('irv-open'); }
var draft = {};
function openGoal(step) {
var g = goal() || {};
if (!step) draft = { g: g.g || '', area: g.area || '', text: g.text || '' };
step = step || 1;
var top = '<div class="irv-top"><div><div class="kicker">МОЯ ЦЕЛЬ · ШАГ ' + step + ' ИЗ ' + (draft.g === 'study' || draft.g === 'work' ? 3 : 2) + '</div><h2>🎯 ' + (step === 1 ? 'Для чего вам английский?' : step === 2 ? (draft.g === 'study' ? 'Что вы изучаете?' : 'Чем вы занимаетесь?') : 'Пара слов о вашей цели') + '</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>';
var body = '';
if (step === 1) {
body = '<p class="irv-sub">Подберу слова и примеры под вашу цель. Поменять можно в любой момент.</p><div class="goal-grid">' + GOALS.map(function (x) {
return '<button type="button" class="goal-btn' + (draft.g === x[0] ? ' on' : '') + '" data-goal="' + x[0] + '"><span class="goal-emo">' + x[1] + '</span><b>' + esc(x[2]) + '</b><small>' + esc(x[3]) + '</small></button>';
}).join('') + '</div>';
} else if (step === 2) {
body = '<div class="goal-grid areas">' + Object.keys(AREAS).filter(function (k) { return AREAS[k][0] === draft.g; }).map(function (k) {
var a = AREAS[k];
return '<button type="button" class="goal-btn small' + (draft.area === k ? ' on' : '') + '" data-area="' + k + '"><span class="goal-emo">' + a[1] + '</span><b>' + esc(a[2]) + '</b></button>';
}).join('') + '<button type="button" class="goal-btn small' + (draft.area === 'other' ? ' on' : '') + '" data-area="other"><span class="goal-emo">✍️</span><b>Другое</b></button></div>';
} else {
body = '<p class="irv-sub">Напишите своими словами — преподаватель увидит и подберёт материалы.</p><textarea class="field goal-text" maxlength="300" rows="3" placeholder="' + esc(draft.g === 'work' ? 'Например: провожу конные туры, хочу общаться с иностранными гостями' : draft.g === 'study' ? 'Например: учусь на химика, читаю статьи на английском' : 'Например: хочу свободно говорить в поездках') + '">' + esc(draft.text || '') + '</textarea>' +
'<div class="irv-actions"><button type="button" class="ui-btn goal-save">Сохранить и открыть мои слова</button></div>';
}
var back = step > 1 ? '<button type="button" class="ui-link goal-back">← Назад</button>' : '<button type="button" class="ui-link goal-later">Позже</button>';
var m = modal('iris-goal', top + body + '<div class="goal-foot">' + back + '</div>');
m.dataset.step = String(step);
if (!m._wired) {
m._wired = true;
m.addEventListener('click', function (e) {
var t = e.target, st = Number(m.dataset.step);
var gb = t.closest('[data-goal]'), ab = t.closest('[data-area]');
if (gb) { draft.g = gb.dataset.goal; if (AREAS[draft.area] && AREAS[draft.area][0] !== draft.g) draft.area = ''; openGoal(draft.g === 'study' || draft.g === 'work' ? 2 : 3); return; }
if (ab) { draft.area = ab.dataset.area; openGoal(3); return; }
if (t.closest('.goal-back')) { openGoal(st === 3 && (draft.g === 'study' || draft.g === 'work') ? 2 : 1); return; }
if (t.closest('.goal-later')) { try { localStorage.setItem('iris-goal-later:' + C.state().profile, String(Date.now())); } catch (_) { } close('iris-goal'); return; }
if (t.closest('.goal-save')) {
var txt = (($('.goal-text', m) || {}).value || '').trim().slice(0, 300);
var g = { g: draft.g, area: draft.area && draft.area !== 'other' ? draft.area : '', text: txt };
g.area = areaFor(g);
saveGoal(g);
close('iris-goal');
openPack(g.area);
}
});
}
}
function packProgress(area) {
var f = C.profile().fields, rec = f['iris-packs'];
if (!rec || typeof rec !== 'object' || !rec.p) rec = f['iris-packs'] = { value: '', status: '', earned: false, p: {} };
if (!rec.p[area]) rec.p[area] = {};
return rec.p[area];
}
function known(area) { var pr = packProgress(area); return (PACKS[area] || []).filter(function (w) { return (pr[w.en] || 0) >= 2; }).length; }
function inDict(en) { return (C.profile().words || []).some(function (w) { return String(w.en).toLowerCase() === en.toLowerCase(); }); }
var packArea = '';
function openPack(area, tab) {
area = area || areaFor(goal()) || 'talk';
packArea = area;
var a = AREAS[area], list = PACKS[area] || [], pr = packProgress(area);
var others = '<select class="field pack-switch" aria-label="Другая сфера">' + GOALS.map(function (G) {
var ks = Object.keys(AREAS).filter(function (k) { return AREAS[k][0] === G[0]; });
return '<optgroup label="' + esc(G[2]) + '">' + ks.map(function (k) { return '<option value="' + k + '"' + (k === area ? ' selected' : '') + '>' + AREAS[k][1] + ' ' + esc(AREAS[k][2]) + '</option>'; }).join('') + '</optgroup>';
}).join('') + '</select>';
var top = '<div class="irv-top"><div><div class="kicker">СЛОВА ДЛЯ МОЕЙ ЦЕЛИ</div><h2>' + a[1] + ' ' + esc(a[2]) + '</h2></div><button type="button" class="icon-btn irv-close" aria-label="Закрыть">✕</button></div>' +
'<div class="pack-tools">' + others + '<span class="pack-known">Выучено: <b>' + known(area) + '</b> из ' + list.length + '</span></div>' +
'<div class="pack-tabs" role="tablist"><button type="button" role="tab" class="pack-tab' + (tab !== 'train' ? ' on' : '') + '" data-tab="list">📖 Слова</button><button type="button" role="tab" class="pack-tab' + (tab === 'train' ? ' on' : '') + '" data-tab="train">🎯 Тренировка</button></div>';
var body;
if (tab === 'train') body = '<div class="pack-train"></div>';
else body = '<ul class="pack-list">' + list.map(function (w, i) {
var lvl = pr[w.en] || 0, tr = ipa(w.en);
return '<li class="pack-row' + (lvl >= 2 ? ' known' : '') + '"><button type="button" class="icon-btn pack-say" data-i="' + i + '" aria-label="Послушать ' + esc(w.en) + '">🔊</button>' +
'<div class="pack-main"><div><b class="pack-en">' + esc(w.en) + '</b>' + (tr ? ' <span class="ipa">' + esc(tr) + '</span>' : '') + ' — <span class="pack-ru">' + esc(w.ru) + '</span></div>' +
'<div class="pack-ex"><button type="button" class="ui-link pack-say-ex" data-i="' + i + '" aria-label="Послушать пример">▶</button> ' + esc(w.ex) + '</div></div>' +
'<button type="button" class="ui-btn small soft pack-add" data-i="' + i + '"' + (inDict(w.en) ? ' disabled' : '') + '>' + (inDict(w.en) ? '✓ В словаре' : '+ В словарь') + '</button></li>';
}).join('') + '</ul>';
var m = modal('iris-pack', top + body);
if (!m._wired) {
m._wired = true;
m.addEventListener('click', function (e) {
var t = e.target, L = PACKS[packArea] || [];
var b;
if ((b = t.closest('.pack-say'))) { speak(L[b.dataset.i].en); return; }
if ((b = t.closest('.pack-say-ex'))) { speak(L[b.dataset.i].ex); return; }
if ((b = t.closest('.pack-add'))) {
var w = L[b.dataset.i];
try { C.addWord(w.en, w.ru, w.ex, 'Мои слова · ' + AREAS[packArea][2]); } catch (_) { }
b.disabled = true; b.textContent = '✓ В словаре';
return;
}
if ((b = t.closest('.pack-tab'))) { openPack(packArea, b.dataset.tab); return; }
if ((b = t.closest('.pt-opt'))) { answer(b); return; }
if (t.closest('.pt-next')) { trainStep(); return; }
if (t.closest('.pt-replay')) { speak(train.cur.en); return; }
if (t.closest('.pt-again')) { openPack(packArea, 'train'); return; }
});
m.addEventListener('change', function (e) { if (e.target.closest('.pack-switch')) openPack(e.target.value); });
}
if (tab === 'train') startTrain();
}
var train = null;
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function startTrain() {
var L = PACKS[packArea] || [], pr = packProgress(packArea);
var order = L.slice().sort(function (x, y) { return (pr[x.en] || 0) - (pr[y.en] || 0) + (Math.random() - 0.5); }).slice(0, 10);
train = { list: shuffle(order), i: 0, ok: 0 };
trainStep();
}
function trainStep() {
var box = $('#iris-pack .pack-train'), L = PACKS[packArea] || [];
if (!box) return;
if (train.i >= train.list.length) {
box.innerHTML = '<div class="irv-empty"><div class="irv-big">' + (train.ok >= 8 ? '🏆' : '💪') + '</div><h3>Верно: ' + train.ok + ' из ' + train.list.length + '</h3><p>Слово считается выученным после двух верных ответов.</p><button type="button" class="ui-btn pt-again">Ещё раз</button></div>';
var k = $('#iris-pack .pack-known b'); if (k) k.textContent = String(known(packArea));
paintMe();
return;
}
var w = train.list[train.i], listen = train.i % 2 === 1;
train.cur = w; train.listen = listen;
var wrong = shuffle(L.filter(function (x) { return x.en !== w.en; })).slice(0, 3);
var opts = shuffle([w].concat(wrong));
box.innerHTML = '<div class="irv-meta">' + (train.i + 1) + ' из ' + train.list.length + '</div>' +
(listen ? '<p class="irv-q">🎧 Что прозвучало? <button type="button" class="ui-btn small soft pt-replay">🔊 Ещё раз</button></p>' : '<p class="irv-q">Что значит <b>' + esc(w.en) + '</b>' + (ipa(w.en) ? ' <span class="ipa">' + esc(ipa(w.en)) + '</span>' : '') + '?</p>') +
'<div class="irv-opts">' + opts.map(function (o) { return '<button type="button" class="opt pt-opt" data-en="' + esc(o.en) + '">' + esc(listen ? o.en : o.ru) + '</button>'; }).join('') + '</div><div class="irv-fb" aria-live="polite"></div>';
if (listen) speak(w.en);
}
function answer(b) {
var box = $('#iris-pack .pack-train'), w = train.cur;
if (!box || box.dataset.lock === String(train.i)) return;
box.dataset.lock = String(train.i);
var ok = b.dataset.en === w.en, pr = packProgress(packArea);
pr[w.en] = Math.max(0, (pr[w.en] || 0) + (ok ? 1 : -1));
if (ok) train.ok++;
C.save();
$$('.pt-opt', box).forEach(function (x) { x.disabled = true; if (x.dataset.en === w.en) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
$('.irv-fb', box).innerHTML = (ok ? '<div class="irv-ok">✅ Верно!</div>' : '<div class="why-note"><p>✅ <b>' + esc(w.en) + '</b> — ' + esc(w.ru) + '</p></div>') +
'<p class="pack-ex">' + esc(w.ex) + '</p><div class="irv-actions"><button type="button" class="ui-btn pt-next">Дальше →</button></div>';
if (!train.listen || !ok) speak(w.en);
train.i++;
}
function todayISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function dailyTiles() {
var data = [];
try { data = JSON.parse(($('#platform-data') || {}).textContent || '[]'); } catch (_) { }
var me = C.state().profile, today = todayISO(), out = [];
data.forEach(function (d) {
if (d.owner !== me || !d.daily || !Array.isArray(d.daily.days)) return;
var days = d.daily.days, n = days.filter(function (x) { return x <= today; }).length, pre = String(d.hwSection || '').replace(/-hw-prep$/, '');
if (today > days[days.length - 1]) return;
var sid = n ? pre + '-hw-day' + n : d.hwSection, sec = (d.sections || []).filter(function (x) { return x.id === sid; })[0];
out.push('<button type="button" class="me-tile me-daily has-due" data-go="' + esc(sid) + '"><span class="me-emo">📅</span><span><b>' +
(n ? 'Сегодня: день ' + n + ' из ' + days.length : 'Скоро старт: ' + esc(d.title)) + '</b><small>' + esc(n ? (sec ? sec.label.replace(/^Day \d+ · /, '') : d.title) + ' · ' + d.title : 'первый день откроется ' + days[0].split('-').reverse().slice(0, 2).join('.')) + '</small></span></button>');
});
return out.join('');
}
function paintMe() {
var home = $('#screen-home');
if (!home || !isStudent()) { var o = $('#iris-me'); if (o) o.remove(); return; }
var intro = $('.home-intro', home);
if (!intro) return;
var box = $('#iris-me', home), anchor = $('.hw-home', home) || intro;
if (!box) { box = document.createElement('section'); box.id = 'iris-me'; box.className = 'panel iris-me'; }
if (anchor.nextElementSibling !== box) anchor.insertAdjacentElement('afterend', box); // после домашки: она важнее
var g = goal(), area = g ? areaFor(g) : '', a = AREAS[area];
var rv = window.irisReview, due = rv ? rv.due() : 0, total = rv ? rv.total() : 0;
box.innerHTML = '<div class="me-row"><div><div class="kicker">МОЯ ЦЕЛЬ</div><b>' + (g ? esc(goalLabel(g)) : 'Расскажите, для чего вам английский') + '</b>' + (g && g.text ? '<div class="me-sub">' + esc(g.text) + '</div>' : '') + '</div><button type="button" class="ui-btn small ' + (g ? 'soft' : '') + ' me-goal">' + (g ? 'Изменить' : '🎯 Выбрать цель') + '</button></div>' +
'<div class="me-tiles">' + dailyTiles() +
(a ? '<button type="button" class="me-tile me-pack"><span class="me-emo">' + a[1] + '</span><span><b>Слова: ' + esc(a[2]) + '</b><small>выучено ' + known(area) + ' из ' + (PACKS[area] || []).length + ' · с транскрипцией и озвучкой</small></span></button>' : '') +
'<button type="button" class="me-tile irv-home' + (due ? ' has-due' : '') + '"><span class="me-emo">🔁</span><span><b>Работа над ошибками' + (due ? ' · <span class="irv-count">' + due + '</span>' : '') + '</b><small>' + (due ? 'задания на сегодня — 3–5 минут' : total ? 'на сегодня всё, в очереди ' + total : 'ошибки из домашки появятся здесь') + '</small></span></button>' +
'</div>';
}
window.irisPaintMe = paintMe;
document.addEventListener('click', function (e) {
var t = e.target;
if (!t || !t.closest) return;
var go = t.closest('.me-daily');
if (go) { location.hash = go.getAttribute('data-go'); return; }
if (t.closest('.me-goal')) openGoal();
else if (t.closest('.me-pack')) openPack();
else if (t.closest('.irv-home') && window.irisReview) window.irisReview.open();
});
function maybeAsk() {
if (!isStudent() || goal()) return;
var home = $('#screen-home');
if (!home || home.hidden) return;
var later = 0;
try { later = Number(localStorage.getItem('iris-goal-later:' + C.state().profile)) || 0; } catch (_) { }
if (Date.now() - later < 3 * 864e5) return;
if ($$('.irv').some(function (x) { return !x.hidden; })) return;
openGoal();
}
function tick() {
try { injectFields(); } catch (_) { }
try { paintMe(); } catch (_) { }
}
var obs = new MutationObserver(function () {
var h = $('#screen-home'), me = h && $('#iris-me', h), hw = h && $('.hw-home', h);
if (h && $('.home-intro', h) && (!me || (hw && hw.nextElementSibling !== me))) tick();
});
function boot() {
var h = $('#screen-home');
if (h) obs.observe(h, { childList: true });
tick();
setTimeout(maybeAsk, 1800);
window.addEventListener('hashchange', function () { setTimeout(tick, 60); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
window.irisGoal = { open: openGoal, pack: openPack, label: function () { return goalText(goal()); } };
})();
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
(function () {
'use strict';
try {
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
var reg = function () { navigator.serviceWorker.register('sw.js').catch(function () { }); };
if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg); // код может загрузиться уже после load
}
} catch (_) { }
var bar = null;
function show(on) {
if (!bar) {
bar = document.createElement('div');
bar.className = 'iris-offline';
bar.setAttribute('role', 'status');
document.body.appendChild(bar);
}
bar.textContent = on ? '📶 Нет связи — можно заниматься дальше, ответы сохраняются и уйдут сами' : '✅ Связь вернулась — отправляем ответы';
bar.hidden = false;
clearTimeout(bar._t);
if (!on) bar._t = setTimeout(function () { bar.hidden = true; }, 3500);
}
window.addEventListener('offline', function () { show(true); });
window.addEventListener('online', function () {
show(false);
setTimeout(function () {
try { if (window.__irisResync) window.__irisResync(); } catch (_) { }
try { if (window.irisProgressSync) window.irisProgressSync(); } catch (_) { }
}, 1500);
});
if (navigator.onLine === false) show(true);
})();