<?php
// «Почтовый ящик» Iris School: хранит последние зашифрованные сообщения платформы (ответы ученика, прогресс,
// комментарии преподавателя) — та же схема, что «retained» у серверов связи, но на своём хостинге.
// Ящик не умеет читать сообщения: они зашифрованы ещё в браузере (ключ есть только у ученика и преподавателя).
//   GET  box.php?ping=1                     → {"ok":1}
//   GET  box.php?t=<тема>[&t=…][&since=мс]  → [{"t":тема,"p":текст,"u":мс}, …]  (тема может кончаться на /+ или /#)
//   POST box.php  {"t":тема,"p":текст}       → {"ok":1}   (пустой p — удалить)
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_PAYLOAD = 400000;   // одно сообщение
const MAX_FILES = 20000;      // всего тем
const TOPIC = '#^iris-school(-test)?/v1/[A-Za-z0-9_\-./]{1,300}$#';

$dir = __DIR__ . '/data';
if (!is_dir($dir)) { @mkdir($dir, 0700, true); @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n"); @file_put_contents($dir . '/index.html', ''); }
// файлы — .php с «exit» в начале: даже если сервер отдаёт папку напрямую, открыть их по адресу нельзя
const GUARD = "<?php exit; ?>\n";
function load($f) { $raw = @file_get_contents($f); if ($raw === false) return null; if (strpos($raw, GUARD) === 0) $raw = substr($raw, strlen(GUARD)); return json_decode($raw, true); }

function fail($code, $msg) { http_response_code($code); echo json_encode(['error' => $msg]); exit; }
function path_for($dir, $t) { return $dir . '/' . sha1($t) . '.php'; }
function matches($pattern, $t) {
    if (substr($pattern, -2) === '/#') return strpos($t, substr($pattern, 0, -1)) === 0;
    if (substr($pattern, -2) === '/+') { $p = substr($pattern, 0, -1); return strpos($t, $p) === 0 && strpos(substr($t, strlen($p)), '/') === false && strlen($t) > strlen($p); }
    return $pattern === $t;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input', false, null, 0, MAX_PAYLOAD + 2000);
    $m = json_decode($raw, true);
    if (!is_array($m) || !isset($m['t']) || !is_string($m['t']) || !preg_match(TOPIC, $m['t'])) fail(400, 'topic');
    $p = isset($m['p']) && is_string($m['p']) ? $m['p'] : '';
    if (strlen($p) > MAX_PAYLOAD) fail(413, 'too large');
    $f = path_for($dir, $m['t']);
    if ($p === '') { @unlink($f); echo '{"ok":1}'; exit; }
    if (!file_exists($f) && count(glob($dir . '/*.php')) >= MAX_FILES) fail(507, 'full');
    $tmp = $f . '.' . bin2hex(random_bytes(4));
    file_put_contents($tmp, GUARD . json_encode(['t' => $m['t'], 'p' => $p, 'u' => (int) round(microtime(true) * 1000)]));
    rename($tmp, $f);
    echo '{"ok":1}';
    exit;
}

if (isset($_GET['ping'])) { echo '{"ok":1}'; exit; }
$topics = isset($_GET['t']) ? (array) $_GET['t'] : [];
$since = isset($_GET['since']) ? (int) $_GET['since'] : 0;
$pats = [];
foreach ($topics as $t) {
    if (!is_string($t)) continue;
    $base = preg_replace('#/[+\#]$#', '', $t);
    if (preg_match(TOPIC, $base)) $pats[] = $t;
}
if (!$pats || count($pats) > 60) fail(400, 'topic');
$out = [];
$exact = array_filter($pats, function ($t) { return !preg_match('#/[+\#]$#', $t); });
if (count($exact) === count($pats)) {
    foreach ($exact as $t) {
        $f = path_for($dir, $t);
        if (is_file($f) && filemtime($f) * 1000 >= $since - 2000) { $m = load($f); if ($m && $m['u'] > $since) $out[] = $m; }
    }
} else {
    foreach (glob($dir . '/*.php') as $f) {
        if ($since && filemtime($f) * 1000 < $since - 2000) continue;
        $m = load($f);
        if (!$m || $m['u'] <= $since) continue;
        foreach ($pats as $pt) if (matches($pt, $m['t'])) { $out[] = $m; break; }
    }
}
echo json_encode($out);
