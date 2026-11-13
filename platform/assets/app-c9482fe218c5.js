(function () {
'use strict';
if (typeof window.mqtt === 'undefined' || !window.fetch) return;
var BOX = 'api/box.php';
var real = window.mqtt.connect.bind(window.mqtt);
var dec = window.TextDecoder ? new TextDecoder() : null;
var bytes = function (text) {
var b = new TextEncoder().encode(text);
b.toString = function () { return text; };
return b;
};
var boxUp = null; // null — ещё не знаем; false — ящика нет (не выложен на хостинг)
function ping() {
if (boxUp !== null) return Promise.resolve(boxUp);
return fetch(BOX + '?ping=1', { cache: 'no-store', credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.json() : null; })
.then(function (j) { boxUp = !!(j && j.ok); return boxUp; }, function () { boxUp = null; return false; });
}
function Client(opts) {
var self = this;
this.connected = false;
this.handlers = {};
this.topics = [];
this.since = 0;
this.ended = false;
this.poll = opts && opts.reconnectPeriod === 0 ? 0 : 20000;
setTimeout(function () {
ping().then(function (up) {
if (self.ended) return;
if (!up) { self.emit('error', new Error('box')); self.emit('close'); return; }
self.connected = true;
self.emit('connect', { sessionPresent: false });
});
}, 0);
}
Client.prototype.on = function (ev, fn) { (this.handlers[ev] = this.handlers[ev] || []).push(fn); return this; };
Client.prototype.once = function (ev, fn) { var self = this, w = function () { self.off(ev, w); fn.apply(null, arguments); }; return this.on(ev, w); };
Client.prototype.off = Client.prototype.removeListener = function (ev, fn) { this.handlers[ev] = (this.handlers[ev] || []).filter(function (f) { return f !== fn; }); return this; };
Client.prototype.emit = function (ev) {
var args = Array.prototype.slice.call(arguments, 1);
(this.handlers[ev] || []).slice().forEach(function (f) { try { f.apply(null, args); } catch (_) { } });
};
Client.prototype.fetchNow = function () {
var self = this;
if (self.ended || !self.topics.length) return;
var q = self.topics.map(function (t) { return 't%5B%5D=' + encodeURIComponent(t); }).join('&') + '&since=' + self.since;
fetch(BOX + '?' + q, { cache: 'no-store', credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.json() : []; })
.then(function (list) {
if (self.ended || !Array.isArray(list)) return;
list.sort(function (a, b) { return a.u - b.u; }).forEach(function (m) {
if (m.u > self.since) self.since = m.u;
self.emit('message', m.t, bytes(m.p), { retain: true, topic: m.t });
});
}, function () { });
};
Client.prototype.subscribe = function (topics, opts, cb) {
if (typeof opts === 'function') { cb = opts; opts = {}; }
var self = this, list = Array.isArray(topics) ? topics : typeof topics === 'string' ? [topics] : Object.keys(topics || {});
list.forEach(function (t) { if (self.topics.indexOf(t) < 0) self.topics.push(t); });
if (cb) setTimeout(function () { cb(null, list.map(function (t) { return { topic: t, qos: 1 }; })); }, 0);
var since = self.since;
self.since = 0;
self.fetchNow();
self.since = since;
if (self.poll && !self.timer) self.timer = setInterval(function () { if (!document.hidden) self.fetchNow(); }, self.poll);
return this;
};
Client.prototype.unsubscribe = function (topics, opts, cb) {
if (typeof opts === 'function') cb = opts;
var list = Array.isArray(topics) ? topics : [topics];
this.topics = this.topics.filter(function (t) { return list.indexOf(t) < 0; });
if (cb) setTimeout(cb, 0);
return this;
};
Client.prototype.publish = function (topic, payload, opts, cb) {
if (typeof opts === 'function') { cb = opts; opts = {}; }
if (!opts || !opts.retain) { if (cb) setTimeout(function () { cb(null); }, 0); return this; } // живые сообщения — только через серверы связи
var text = typeof payload === 'string' ? payload : dec ? dec.decode(payload) : String(payload);
fetch(BOX, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: topic, p: text }) })
.then(function (r) { if (cb) cb(r.ok ? null : new Error('box ' + r.status)); }, function (e) { if (cb) cb(e || new Error('box')); });
return this;
};
Client.prototype.end = function (force, opts, cb) {
cb = [force, opts, cb].filter(function (x) { return typeof x === 'function'; })[0];
this.ended = true;
this.connected = false;
clearInterval(this.timer);
this.emit('end');
if (cb) setTimeout(cb, 0);
return this;
};
function Idle() { Client.call(this, { reconnectPeriod: 0 }); this.ended = true; }
Idle.prototype = Object.create(Client.prototype);
var connect = function (url, opts) {
if (url !== 'iris-box') return real(url, opts);
var id = (opts && opts.clientId) || '';
return /^iris_(fb|in|inbox|lb)_/.test(id) ? new Client(opts) : new Idle();
};
var orig = window.mqtt, wrap = {};
Object.keys(orig).forEach(function (k) { try { wrap[k] = orig[k]; } catch (_) { } });
wrap.connect = connect;
try { window.mqtt = wrap; } catch (_) { }
if (window.mqtt !== wrap) try { Object.defineProperty(window, 'mqtt', { value: wrap, writable: true, configurable: true }); } catch (_) { }
window.irisBoxStatus = function () { return boxUp; };
})();