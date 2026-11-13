// Конфиденциальность уроков: без личной ссылки уроков не видно (ни на экране, ни в коде страницы),
// чужая ссылка не открывает чужие уроки, преподаватель видит всё.
// Запуск: IRIS_BASE=http://localhost:8766/platform/ IRIS_TOKEN=<код ученика> IRIS_OTHER=<код другого ученика>
//         IRIS_TEACHER=<код преподавателя> node tools/tests/test-privacy.js
const { chromium } = require('playwright');
const BASE = process.env.IRIS_BASE || 'http://localhost:8766/platform/';
const { IRIS_TOKEN: ME, IRIS_OTHER: OTHER, IRIS_TEACHER: T } = process.env;
if (!ME || !OTHER || !T) { console.error('нужны IRIS_TOKEN, IRIS_OTHER, IRIS_TEACHER'); process.exit(2); }
let fails = 0;
const ok = (c, msg) => { console.log((c ? '  ✓ ' : '  ✗ ') + msg); if (!c) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const ctx = async () => { const c = await b.newContext(); await c.routeWebSocket(/emqx|hivemq|shiftr|mosquitto/, ws => ws.close()); return c; };
  const open = async (url, wait = 3500) => { const c = await ctx(), p = await c.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(url); await sleep(wait); return { c, p, errs }; };
  // ученик: свои уроки открываются, запоминаем фразу из урока
  let r = await open(BASE + 'index.html?k=' + ME + '&brokers=ws://localhost:1');
  const mine = await r.p.evaluate(() => { const st = document.querySelector('section.step p'); return { page: location.pathname, steps: document.querySelectorAll('section.step').length, phrase: st ? st.textContent.trim().slice(0, 40) : '' }; });
  ok(mine.steps > 3 && mine.phrase, 'ученик видит свои уроки (' + mine.steps + ' этапов)');
  ok(r.errs.length === 0, 'ошибок JS нет ' + JSON.stringify(r.errs));
  await r.c.close();
  // без ссылки: только вход, в коде страницы текста урока нет
  r = await open(BASE + mine.page.split('/').pop());
  ok(await r.p.isVisible('.iris-login'), 'личная страница без ссылки — только вход');
  ok(await r.p.evaluate(() => document.querySelectorAll('section.step').length === 0), 'на экране нет ни одного этапа урока');
  const src = await r.p.evaluate(u => fetch(u).then(x => x.text()), BASE + mine.page.split('/').pop());
  ok(!src.includes(mine.phrase), 'в коде страницы текста урока нет («' + mine.phrase + '»)');
  await r.c.close();
  r = await open(BASE + 'index.html');
  ok(await r.p.isVisible('.iris-login'), 'главная без ссылки — только вход');
  ok(await r.p.evaluate(() => document.querySelectorAll('section.step').length === 0), 'на главной без ссылки уроков нет');
  await r.c.close();
  // чужой код на этой странице: уводит на свою страницу, чужих уроков не видно
  r = await open(BASE + mine.page.split('/').pop() + '?k=' + OTHER + '&brokers=ws://localhost:1');
  const other = await r.p.evaluate(p => ({ page: location.pathname, sameText: document.body.innerText.includes(p) }), mine.phrase);
  ok(other.page !== mine.page && !other.sameText, 'другой ученик не видит эти уроки (его страница: ' + other.page + ')');
  await r.c.close();
  // главная с ?full=1 у ученика: открываются только его уроки, без ошибок
  r = await open(BASE + 'index.html?full=1&k=' + ME + '&brokers=ws://localhost:1', 5000);
  const full = await r.p.evaluate(() => ({ steps: document.querySelectorAll('section.step').length, panes: document.querySelectorAll('#lesson-panels .pane').length, data: JSON.parse(document.getElementById('platform-data').textContent).length }));
  ok(full.data === full.panes - 1 || full.data === full.panes, 'на главной ученику открыты только его уроки: ' + JSON.stringify(full));
  ok(r.errs.length === 0, 'ошибок JS нет ' + JSON.stringify(r.errs));
  await r.c.close();
  // преподаватель: все уроки
  r = await open(BASE + 'index.html?k=' + T + '&brokers=ws://localhost:1', 6000);
  const t = await r.p.evaluate(() => ({ panes: document.querySelectorAll('#lesson-panels .pane').length, data: JSON.parse(document.getElementById('platform-data').textContent).length, ready: !!window.__irisReady }));
  ok(t.ready && t.panes >= t.data, 'преподаватель видит все уроки: ' + JSON.stringify(t));
  ok(r.errs.length === 0, 'ошибок JS нет ' + JSON.stringify(r.errs));
  await r.c.close();
  await b.close();
  console.log(fails ? 'ПРОВАЛЕНО: ' + fails : 'ВСЁ ХОРОШО');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
