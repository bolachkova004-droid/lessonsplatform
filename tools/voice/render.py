"""Записывает недостающие фразы голосом bf_emma (Kokoro, Apache-2.0) — тем же, что и все записи платформы.
Запуск: <python с kokoro-onnx> render.py MODEL_DIR AUDIO_DIR < список.json   (список: [[voice, text], ...])
Файл: audio/<sha1(voice|text)[:16]>.mp3 — та же схема имён, что у сборки."""
import sys, json, hashlib, os, subprocess, tempfile
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

model_dir, audio_dir = sys.argv[1], sys.argv[2]
items = json.load(sys.stdin)
k = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))
SPEED = {'bf_emma': 0.9, 'bm_george': 0.9, 'bf_isabella': 0.9, 'bm_fable': 0.9}
durs = {}
for n, (voice, text) in enumerate(items):
    name = hashlib.sha1((voice + '|' + text).encode()).hexdigest()[:16] + '.mp3'
    out = os.path.join(audio_dir, name)
    if not os.path.exists(out):
        samples, sr = k.create(text, voice=voice, speed=SPEED.get(voice, 0.9), lang='en-gb')
        pad = np.zeros(int(sr * 0.12), dtype=samples.dtype)
        with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
            sf.write(tmp.name, np.concatenate([pad, samples, pad]), sr)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-ac', '1', '-ar', '24000', '-b:a', '64k', out], check=True)
    dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip()
    durs['audio/' + name] = round(float(dur or 0), 2)
    if n % 50 == 0:
        print('  записано', n, 'из', len(items), file=sys.stderr, flush=True)
json.dump(durs, sys.stdout)
