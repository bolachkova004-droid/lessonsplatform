// Проверка слоя доработок: объяснение ошибки, «Работа над ошибками», цель и слова, транскрипция, единый голос.
// Запуск: IRIS_TOKEN=<код ученика> node tools/tests/test-patches.js  (страница — http://localhost:8765/platform/)
// Настоящие серверы синхронизации заблокированы: тест ничего не отправляет преподавателю.
const { chromium } = require('playwright');
const BASE = process.env.IRIS_BASE || 'http://localhost:8765/platform/index.html';
const TOKEN = process.env.IRIS_TOKEN;
if (!TOKEN) { console.error('нужен IRIS_TOKEN'); process.exit(2); }
let fails = 0;
const ok = (c, msg) => { console.log((c ? '  ✓ ' : '  ✗ ') + msg); if (!c) fails++; };
const url = hash => BASE + '?k=' + TOKEN + '&brokers=ws://localhost:1' + hash;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 } });
  await ctx.routeWebSocket(/emqx|hivemq|shiftr|mosquitto/, ws => ws.close());
  await ctx.addInitScript(() => {
    window.__synth = [];
    try { speechSynthesis.speak = u => { window.__synth.push(u.text); }; } catch (_) {}
    window.__played = [];
    HTMLMediaElement.prototype.play = function () { window.__played.push(this.src); const el = this; setTimeout(() => el.dispatchEvent(new Event('ended')), 30); return Promise.resolve(); };
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(url('#home'));
  await p.waitForTimeout(2800);
  // 1. цель и слова
  ok(await p.isVisible('#iris-goal'), 'окно «Для чего вам английский?» появилось');
  await p.click('#iris-goal [data-goal="work"]');
  await p.click('#iris-goal [data-area="it"]');
  await p.fill('#iris-goal .goal-text', 'Работаю бэкенд-разработчиком, читаю документацию');
  await p.click('#iris-goal .goal-save');
  await p.waitForTimeout(300);
  ok(await p.isVisible('#iris-pack'), 'после сохранения открылись слова для цели');
  ok((await p.$$('#iris-pack .pack-row')).length === 20, '20 слов в наборе IT');
  ok((await p.$$('#iris-pack .pack-row .ipa')).length >= 18, 'у слов есть транскрипция');
  await p.click('#iris-pack .pack-say');
  await p.waitForTimeout(200);
  await p.click('#iris-pack .pack-say-ex');
  await p.waitForTimeout(400);
  const s1 = await p.evaluate(() => ({ synth: window.__synth.slice(), played: window.__played.slice() }));
  ok(s1.synth.length === 0 && s1.played.length >= 2, 'слово и пример звучат записью, не голосом устройства ' + JSON.stringify(s1));
  await p.click('#iris-pack .pack-add');
  ok(await p.evaluate(() => window.__irisCore.profile().words.some(w => w.en === 'release')), '«+ В словарь» добавляет слово');
  await p.click('#iris-pack [data-tab="train"]');
  for (let i = 0; i < 10; i++) { await p.click('#iris-pack .pt-opt >> nth=0'); await p.click('#iris-pack .pt-next'); }
  ok(/Верно: \d+ из 10/.test(await p.textContent('#iris-pack .pack-train')), 'тренировка из 10 вопросов проходит до конца');
  await p.click('#iris-pack .irv-close');
  ok(/IT и разработка/.test(await p.textContent('#iris-me')), 'в кабинете видна цель');
  const goalField = await p.evaluate(() => window.__irisCore.profile().fields['iris-goal']);
  ok(goalField && /IT и разработка/.test(goalField.value) && /бэкенд/.test(goalField.value), 'цель сохранена в поле для преподавателя');
  ok(await p.evaluate(() => document.querySelectorAll('[data-field="iris-goal"]').length > 0), 'поле цели есть в уроках (уходит с ответами)');
  // 2. ошибка → объяснение → повторение
  const sec = await p.evaluate(() => {
    const f = Array.from(document.querySelectorAll('section.step .ex input.gap[data-a]:not(.line)')).find(x => !x.closest('.hunt'));
    return f && { sec: f.closest('section.step').id, id: f.id, a: f.dataset.a.split('|')[0] };
  });
  ok(!!sec, 'нашли упражнение с пропуском: ' + JSON.stringify(sec));
  await p.goto(url('#' + sec.sec));
  await p.waitForTimeout(1500);
  await p.fill('#' + sec.id, 'zzz wrong');
  await p.evaluate(id => document.getElementById(id).closest('.ex').querySelector('.check').click(), sec.id);
  await p.waitForTimeout(300);
  const note = await p.evaluate(id => { const f = document.getElementById(id), h = f.closest('li,td') || f.parentElement; const n = h.querySelector('.why-note'); return n && n.textContent; }, sec.id);
  ok(!!note && /Почему не так/.test(note), 'под ошибкой появилось объяснение: ' + (note || '').slice(0, 160));
  ok(await p.isVisible('.irv-added'), 'сообщение «добавлено в Работу над ошибками»');
  await p.click('.irv-added .irv-now');
  await p.waitForTimeout(200);
  ok(await p.isVisible('#iris-review .irv-in'), 'окно повторения открылось с заданием');
  await p.fill('#iris-review .irv-in', sec.a);
  await p.click('#iris-review .irv-check');
  ok(/Верно/.test(await p.textContent('#iris-review .irv-fb')), 'верный ответ в повторении засчитан');
  const item = await p.evaluate(() => Object.values(window.__irisCore.profile().fields['iris-rv'].items)[0]);
  ok(item && item.box === 1 && item.due > Date.now() + 20 * 3600e3, 'следующее повторение — примерно через день');
  await p.click('#iris-review .irv-next');
  await p.click('#iris-review .irv-close');
  // 3. словарь и переводчик: транскрипция
  await p.goto(url('#words'));
  await p.waitForTimeout(1200);
  ok(await p.evaluate(() => !!document.querySelector('.word-row .ipa')), 'в «Моём словаре» у слова есть транскрипция');
  await p.fill('#lookup-en', 'algorithm');
  await p.press('#lookup-en', 'Enter');
  await p.waitForTimeout(400);
  const t = await p.evaluate(() => (document.querySelector('#translation-popup .ipa') || {}).textContent);
  ok(/ˈæl/.test(t || ''), 'в переводчике есть транскрипция: ' + t);
  ok(errors.length === 0, 'ошибок JS нет ' + JSON.stringify(errors));
  await b.close();
  console.log(fails ? 'ПРОВАЛЕНО: ' + fails : 'ВСЁ ХОРОШО');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
