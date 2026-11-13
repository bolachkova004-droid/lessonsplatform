// Пункты аудита: свой «почтовый ящик» (ответ ученика доходит до преподавателя без серверов связи),
// личный код не остаётся в адресе, на личной странице нет чужих имён, офлайн-режим.
// Запуск: php -S localhost:8767 -t <корень репозитория>  и
//   IRIS_TOKEN=<код ученика> IRIS_TEACHER=<код преподавателя> node tools/tests/test-audit.js
// Серверы связи (emqx, hivemq…) заблокированы: всё идёт только через api/box.php.
const { chromium } = require('playwright');
const BASE = process.env.IRIS_BASE || 'http://localhost:8767/platform/index.html';
const TOKEN = process.env.IRIS_TOKEN, TEACHER = process.env.IRIS_TEACHER;
if (!TOKEN || !TEACHER) { console.error('нужны IRIS_TOKEN и IRIS_TEACHER'); process.exit(2); }
let fails = 0;
const ok = (c, msg) => { console.log((c ? '  ✓ ' : '  ✗ ') + msg); if (!c) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const mk = async () => { const ctx = await b.newContext({ viewport: { width: 390, height: 800 } }); await ctx.routeWebSocket(/emqx|hivemq|shiftr|mosquitto/, ws => ws.close()); return ctx; };
  // 1. ученик
  const sc = await mk(), p = await sc.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + '?k=' + TOKEN);
  await sleep(3000);
  const u = new URL(p.url());
  ok(!u.searchParams.get('k'), 'личный код убран из адреса: ' + u.pathname + u.search + u.hash);
  ok(/\/s-[0-9a-f]{20}\.html$/.test(u.pathname), 'ученик на своей лёгкой странице');
  const priv = await p.evaluate(() => ({ entries: JSON.parse(document.getElementById('access-data').textContent).entries.map(e => e.name), opts: Array.from(document.querySelectorAll('#profile-select option')).map(o => o.textContent) }));
  ok(priv.entries.length === 1 && priv.opts.length === 1, 'на странице только своё имя: ' + JSON.stringify(priv));
  await p.goto(u.origin + u.pathname + '#home');
  await sleep(2500);
  ok(await p.evaluate(() => /Владимир|Привет/.test(document.body.innerText)), 'после перезагрузки без кода вход сохранился');
  const f = await p.evaluate(() => { const x = document.querySelector('section.step .ex input.gap[data-a]:not(.line)'); return { sec: x.closest('section.step').id, id: x.id, a: x.dataset.a.split('|')[0] }; });
  await p.goto(u.origin + u.pathname + '#' + f.sec);
  await sleep(1500);
  await p.fill('#' + f.id, f.a);
  await p.evaluate(id => document.getElementById(id).closest('.ex').querySelector('.check').click(), f.id);
  await sleep(7500); // автосохранение через 4 с
  const boxUp = await p.evaluate(() => window.irisBoxStatus && window.irisBoxStatus());
  ok(boxUp === true, 'ящик на хостинге отвечает');
  // 2. офлайн-режим
  const sw = await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!r; });
  ok(sw, 'офлайн-режим (sw.js) включился');
  await p.reload(); await sleep(2000);
  await sc.setOffline(true);
  await p.reload().catch(() => {}); await sleep(2500);
  ok(await p.evaluate(() => !!document.querySelector('section.step')), 'без связи страница открылась из памяти');
  await sc.setOffline(false);
  ok(errs.length === 0, 'у ученика нет ошибок JS ' + JSON.stringify(errs));
  // 3. преподаватель получает работу только через ящик
  const tc = await mk(), t = await tc.newPage(), terrs = [];
  t.on('pageerror', e => terrs.push(e.message));
  await t.goto(BASE + '?k=' + TEACHER);
  await sleep(9000);
  const inbox = await t.evaluate(() => { const b = document.querySelector('.inbox-nav .hw-badge'); return { badge: b && !b.hidden ? b.textContent : '', text: (document.querySelector('.inbox-home') || {}).innerText || '', toast: (document.getElementById('toast') || {}).textContent || '' }; });
  ok(/Владимир/.test(inbox.text + inbox.toast) || Number(inbox.badge) > 0, 'преподаватель получил работу ученика через ящик: ' + JSON.stringify(inbox).slice(0, 200));
  ok(terrs.length === 0, 'у преподавателя нет ошибок JS ' + JSON.stringify(terrs));
  await b.close();
  console.log(fails ? 'ПРОВАЛЕНО: ' + fails : 'ВСЁ ХОРОШО');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
