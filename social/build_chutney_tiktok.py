"""Chutney vs chutney bhajan. Same motion as the library promo.

A phone shows each song the way the site does: shelf, title, player, words.
No narration. Each song fades out. Phoolabasiya plays on the chorus.
Dropati plays the opening refrain and fades as that refrain ends.
"""

import math
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(OUT))
from build_promo import (  # noqa: E402
    IVORY,
    LINE,
    MUTED,
    NAVY,
    SAFFRON,
    SAND,
    WHITE,
    app_bar,
    build_phone,
    circle_reveal,
    cream_bg,
    ease_in_out,
    ease_out,
    mark,
    place_phone,
    prog,
    sans,
    sans_b,
    sans_sb,
    serif,
    serif_b,
    text,
)

W, H, FPS = 1080, 1920, 30
SR = 44100
SW, SH = 560, 1190

# start is a fixed offset into the file. None means pick a strong window.
SONGS = [
    {
        "crumb": "Traditional Chutney",
        "kicker": "TRADITIONAL CHUTNEY",
        "headline": "The folk song.",
        "title": "Kaise Bani",
        "artist": "Sundar Popo",
        "cue": "Classic chutney · Pholourie bina chutney",
        "image": "public/images/chutney/kaise-bani-sundar-popo.jpg",
        "audio": "public/audio/chutney/kaise-bani-sundar-popo.mp3",
        "start": None,
        "hold": 7.8,
        "lines": [
            ("Kaise bani, kaise bani?", "How is it made, how is it made?"),
            ("Pholourie bina chutney kaise bani?", "How do you make pholourie without chutney?"),
        ],
    },
    {
        "crumb": "Traditional Chutney",
        "kicker": "TRADITIONAL CHUTNEY",
        "headline": "Same shelf.",
        "title": "Phoolabasiya",
        "artist": "Sundar Popo",
        "cue": "Classic chutney · Sundar Soca",
        "image": "public/images/chutney/phoolabasiya-sundar-popo-player.jpg",
        "audio": "public/audio/chutney/phoolabasiya-sundar-popo.mp3",
        "start": 45.0,
        "hold": 15.0,
        "fade": 0.6,
        "lines": [
            ("He Phoolabasiya, bahare bhare angna", "O Phoolabasiya — the courtyard is full of spring flowers"),
            ("Hum tum chalenge, baja pasana", "You and I will go play the drums"),
            ("He Phoolabasiya, bahare bhare angna", "O Phoolabasiya — the courtyard is full of spring flowers"),
            ("Hum tum chalenge, baja pasana", "You and I will go play the drums"),
        ],
    },
    {
        "crumb": "Chutney Bhajan",
        "kicker": "CHUTNEY BHAJAN",
        "headline": "The prayer.",
        "title": "Ho Dja Ram Nam",
        "artist": "Ramdew Chaitoe",
        "cue": "The Star Melodies",
        "image": "public/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
        "audio": "public/audio/folders/chutney-style-bhajan/ho-dja-ram-nam-ramdew-chaitoe.mp3",
        "start": None,
        "hold": 7.8,
        "lines": [
            ("Ho dja Ram nam ka pakka lobhi", "Become firmly devoted to Ram's name"),
            ("Kya maya me rakha", "What is there in illusion?"),
        ],
    },
    {
        "crumb": "Chutney Bhajan",
        "kicker": "CHUTNEY BHAJAN",
        "headline": "Same shelf.",
        "title": "Radha Kanhaiya",
        "artist": "Babla & Kanchan",
        "cue": "Chutney bhajan",
        "image": "public/images/radha-kanhaiya-babla-kanchan-player.png",
        "audio": "public/audio/folders/chutney-style-bhajan/radha-kanhaiya-babla-kanchan.mp3",
        "start": None,
        "hold": 7.8,
        "lines": [
            ("Bansi sajai ke kaha chupayo?", "Where have you hidden your flute after decorating it?"),
            ("Karti hai tumse pyar Radha Kanhaiya", "Radha loves you, Krishna"),
        ],
    },
    {
        "crumb": "Wedding Songs",
        "kicker": "TRADITIONAL WEDDING BHAJAN",
        "headline": "Chutney bhajan.",
        "title": "Moray Gari Suno Maharaj",
        "artist": "Dropati",
        "cue": "Sehra · Let's Sing & Dance with Dropati",
        "image": "public/images/albums/lets-sing-and-dance-with-dropati.png",
        "audio": "public/audio/chutney/lets-sing-and-dance-with-dropati/03-moray-gari-suno.mp3",
        # Vocal refrain starts just after 7s and the two lines finish near 24s.
        "start": 7.6,
        "hold": 16.4,
        "lines": [
            ("Dulahe Ram lalla, dulahe Ram lalla", "O Shri Ram–like groom, O Shri Ram–like groom"),
            ("Moray gari suno maharaj, ai dulahe Ram lalla", "Sir, listen to my teasing words, O Shri Ram–like groom"),
        ],
    },
]

HOOK = 4.2
END_HOLD = 5.4
FADE_OUT = 1.7

_IMG = {}


def fit(path, bw, bh):
    im = _IMG.get(path)
    if im is None:
        im = Image.open(ROOT / path).convert("RGB")
        _IMG[path] = im
    scale = min(bw / im.width, bh / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    return im.resize((nw, nh), Image.LANCZOS)


def song_screen(spec, u):
    img = Image.new("RGBA", (SW, SH), IVORY)
    d = ImageDraw.Draw(img)
    app_bar(img, d)
    text(d, (32, 150), spec["crumb"], sans(18), MUTED)
    text(d, (32, 196), spec["title"], serif_b(34), NAVY)
    text(d, (32, 248), spec["artist"], sans_sb(22), SAFFRON)
    text(d, (32, 286), spec["cue"], sans(16), MUTED)
    d.rounded_rectangle((32, 320, 528, 470), 24, fill=WHITE)
    art = fit(spec["image"], 118, 118)
    img.paste(art, (48 + (118 - art.width) // 2, 336 + (118 - art.height) // 2))
    text(d, (184, 356), spec["title"], sans_sb(18), NAVY)
    text(d, (184, 386), spec["artist"], sans(15), MUTED)
    d.rounded_rectangle((184, 424, 500, 434), 5, fill=SAND)
    played = int(184 + 316 * ease_out(min(1.0, u * 1.05)))
    d.rounded_rectangle((184, 424, played, 434), 5, fill=SAFFRON)
    y = 492
    step = 0.12 if len(spec["lines"]) > 2 else 0.18
    for i, (roman, eng) in enumerate(spec["lines"]):
        a = ease_out(prog(u, 0.05 + i * step, 0.28))
        if a <= 0:
            continue
        eng_face = sans(15)
        words = eng.split()
        rows, cur = [], ""
        for word in words:
            trial = (cur + " " + word).strip()
            if eng_face.getlength(trial) <= 450:
                cur = trial
            else:
                if cur:
                    rows.append(cur)
                cur = word
        if cur:
            rows.append(cur)
        box_h = 78 + 22 * len(rows)
        d.rounded_rectangle((32, y, 528, y + box_h), 18, fill=(255, 255, 255, int(255 * a)))
        text(d, (48, y + 34), roman, serif(20), NAVY, a)
        for r, row in enumerate(rows):
            text(d, (48, y + 64 + r * 22), row, eng_face, MUTED, a)
        y += box_h + 12
    return img.convert("RGB")


def hook(t):
    frame = cream_bg(W, H).copy()
    d = ImageDraw.Draw(frame)
    pop = ease_out(prog(t, 0.1, 0.45))
    lg = mark(max(8, int(92 * pop)))
    frame.paste(lg, (W // 2 - lg.width // 2, int(520 + (1 - pop) * 24)), lg)
    a = ease_out(prog(t, 0.45, 0.4))
    text(d, (W / 2, 700), "Chutney", serif_b(84), NAVY, a, anchor="ma")
    a2 = ease_out(prog(t, 0.9, 0.4))
    text(d, (W / 2, 810), "or chutney bhajan?", serif(40), NAVY, a2, anchor="ma")
    a3 = ease_out(prog(t, 1.45, 0.35))
    text(d, (W / 2, 890), "Look at the song.", sans(30), SAFFRON, a3, anchor="ma")
    return frame


def app_frame(t, spec):
    frame = cream_bg(W, H).copy()
    d = ImageDraw.Draw(frame)
    a = ease_out(prog(t, 0.05, 0.35))
    text(d, (W / 2, 128), spec["kicker"], sans_b(24), SAFFRON, a, anchor="ma", spacing=2)
    text(d, (W / 2, 200), spec["headline"], serif_b(72), NAVY, a, anchor="ma")
    u = min(1.0, t / max(2.4, spec["hold"] * 0.55))
    screen = song_screen(spec, u)
    pw, ph = 620, 1240
    y = 520 + (1 - ease_out(prog(t, 0.0, 0.55))) * 80
    place_phone(frame, screen, (W - pw) / 2, y, pw, ph)
    return frame


def end(t):
    frame = cream_bg(W, H).copy()
    d = ImageDraw.Draw(frame)
    pop = ease_out(prog(t, 0.1, 0.4))
    lg = mark(max(8, int(120 * pop)))
    frame.paste(lg, (W // 2 - lg.width // 2, int(560 + (1 - pop) * 30)), lg)
    text(d, (W / 2, 780), "Follow for more", serif(40), NAVY, ease_out(prog(t, 0.35, 0.3)), anchor="ma")
    text(d, (W / 2, 860), "Bhajan Lyrics", serif_b(72), NAVY, ease_out(prog(t, 0.55, 0.35)), anchor="ma")
    text(d, (W / 2, 970), "www.bhajanlibrary.com", sans_sb(30), SAFFRON, ease_out(prog(t, 0.85, 0.3)), anchor="ma")
    text(d, (W / 2, 1040), "TikTok  @thebhajanlibrary", sans(26), NAVY, ease_out(prog(t, 1.05, 0.3)), anchor="ma")
    text(d, (W / 2, 1088), "Instagram  @bhajanlibrary", sans(26), NAVY, ease_out(prog(t, 1.2, 0.3)), anchor="ma")
    text(d, (W / 2, 1136), "Facebook  Bhajan Library", sans(26), NAVY, ease_out(prog(t, 1.35, 0.3)), anchor="ma")
    return frame


def timeline():
    items = []
    cursor = HOOK
    for spec in SONGS:
        item = dict(spec)
        item["at"] = cursor
        item["end"] = cursor + spec["hold"]
        items.append(item)
        cursor += spec["hold"]
    return items, cursor, cursor + END_HOLD


def frame_at(t, items, end_at):
    if t < HOOK - 0.35:
        return hook(t)
    if t < HOOK + 0.2:
        p = ease_in_out(prog(t, HOOK - 0.35, 0.55))
        return circle_reveal(hook(min(t, HOOK)), app_frame(0.2, items[0]), (540, 1100), p)
    if t >= end_at - 0.3:
        p = ease_in_out(prog(t, end_at - 0.3, 0.6))
        last = items[-1]
        return circle_reveal(app_frame(t - last["at"], last), end(t - end_at), (540, 900), p)
    for i, spec in enumerate(items):
        if spec["at"] <= t < spec["end"]:
            this = app_frame(t - spec["at"], spec)
            if i and t < spec["at"] + 0.4:
                prev = items[i - 1]
                old = app_frame(t - prev["at"], prev)
                p = ease_in_out(prog(t, spec["at"], 0.4))
                return circle_reveal(old, this, (540, 1100), p)
            return this
    return end(t - end_at)


def loud_start(path, length, skip=8.0):
    raw = subprocess.check_output(
        [
            "ffmpeg", "-v", "error", "-ss", str(skip), "-i", str(ROOT / path),
            "-t", "80", "-ac", "1", "-ar", "8000", "-f", "f32le", "-",
        ]
    )
    samples = np.frombuffer(raw, dtype=np.float32)
    win = int(min(length, 5.0) * 8000)
    step = int(0.5 * 8000)
    best_i, best_e = 0, -1.0
    for i in range(0, max(1, len(samples) - win), step):
        energy = float(np.mean(samples[i : i + win] ** 2))
        if energy > best_e:
            best_e, best_i = energy, i
    return skip + best_i / 8000


def load_clip(path, start, dur):
    raw = subprocess.check_output(
        [
            "ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-i", str(ROOT / path),
            "-t", f"{dur + 0.05:.3f}", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-",
        ]
    )
    clip = np.frombuffer(raw, dtype=np.float32)
    if len(clip) % 2:
        clip = clip[:-1]
    return clip.reshape(-1, 2).copy()


def mix_audio(items, duration, dest):
    n = int(duration * SR)
    mix = np.zeros((n, 2), dtype=np.float64)
    for spec in items:
        dur = spec["hold"]
        start = spec["start"] if spec["start"] is not None else loud_start(spec["audio"], dur)
        print(f"clip {Path(spec['audio']).name} @ {start:.1f}s for {dur:.1f}s", flush=True)
        song = load_clip(ROOT / spec["audio"], start, dur)
        env = np.ones((len(song), 1))
        inn = int(0.28 * SR)
        out_n = int(spec.get("fade", FADE_OUT) * SR)
        env[:inn, 0] = np.linspace(0, 1, inn)
        if out_n < len(song):
            env[-out_n:, 0] = np.linspace(1, 0, out_n)
        i0 = int(spec["at"] * SR)
        i1 = min(n, i0 + len(song))
        mix[i0:i1] += song[: i1 - i0] * env[: i1 - i0]
    tail = int(1.2 * SR)
    if tail < n:
        mix[-tail:] *= np.linspace(1, 0, tail)[:, None]
    peak = np.max(np.abs(mix)) or 1
    mix = mix / peak * 0.9
    with wave.open(str(dest), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())


def main():
    items, end_at, duration = timeline()
    frames = int(math.ceil(duration * FPS))
    print(f"duration {duration:.2f}s", flush=True)
    bed = OUT / "_chutney-bed.wav"
    mix_audio(items, duration, bed)
    dest = OUT / "bhajan-library-chutney-tiktok.mp4"
    proc = subprocess.Popen(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
            "-r", str(FPS), "-i", "pipe:0",
            "-i", str(bed),
            "-t", f"{duration:.3f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            str(dest),
        ],
        stdin=subprocess.PIPE,
    )
    assert proc.stdin is not None
    for i in range(frames):
        proc.stdin.write(frame_at(i / FPS, items, end_at).convert("RGB").tobytes())
        if i % 120 == 0:
            print(f"frame {i}/{frames}", flush=True)
    proc.stdin.close()
    code = proc.wait()
    bed.unlink(missing_ok=True)
    if code != 0:
        raise SystemExit(code)
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
