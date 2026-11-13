"""Chutney vs chutney bhajan, for TikTok and Instagram Reels.

1080x1920. Every cover is shown whole, on a soft fill.
The songs playing are the ones already in the library.
"""

import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(OUT))
from build_promo import mark  # noqa: E402

W, H, FPS = 1080, 1920, 30
SR = 44100

NAVY = (18, 22, 36)
SAFFRON = (197, 138, 54)
WHITE = (255, 255, 255)
GOLD = (244, 214, 160)
IVORY = (248, 245, 239)

GEORGIA = r"C:\Windows\Fonts\georgiab.ttf"
SANS = r"C:\Windows\Fonts\segoeuib.ttf"
SANS_R = r"C:\Windows\Fonts\segoeui.ttf"

# image, title, singer, kicker, audio (library file)
SONGS = [
    (
        "public/images/chutney/kaise-bani-sundar-popo.jpg",
        "Kaise Bani",
        "Sundar Popo",
        "TRADITIONAL CHUTNEY",
        "public/audio/chutney/kaise-bani-sundar-popo.mp3",
    ),
    (
        "public/images/chutney/phoolabasiya-sundar-popo.jpg",
        "Phoolabasiya",
        "Sundar Popo",
        "TRADITIONAL CHUTNEY",
        "public/audio/chutney/phoolabasiya-sundar-popo.mp3",
    ),
    (
        "public/images/albums/star-melodies-ramdew-chaitoe.jpg",
        "Ho Dja Ram Nam",
        "Ramdew Chaitoe",
        "CHUTNEY BHAJAN",
        "public/audio/folders/chutney-style-bhajan/ho-dja-ram-nam-ramdew-chaitoe.mp3",
    ),
    (
        "public/images/radha-kanhaiya-babla-kanchan.png",
        "Radha Kanhaiya",
        "Babla & Kanchan",
        "CHUTNEY BHAJAN",
        "public/audio/folders/chutney-style-bhajan/radha-kanhaiya-babla-kanchan.mp3",
    ),
]

HOOK_END = 6.5
SPLIT_END = 15.0
CARD = 8.5
SONG_START = SPLIT_END
END_START = SONG_START + CARD * len(SONGS)
DURATION = END_START + 6.0
FRAMES = int(DURATION * FPS)

_OPEN = {}


def font(path, size):
    return ImageFont.truetype(path, size)


def clamp(x):
    return max(0.0, min(1.0, x))


def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def prog(t, start, dur):
    return clamp((t - start) / dur) if dur else 1.0


def text(d, xy, value, face, color, alpha=1.0, anchor="ma"):
    if alpha <= 0.01:
        return
    d.text(xy, value, font=face, fill=color + (int(255 * alpha),), anchor=anchor)


def opened(path):
    im = _OPEN.get(path)
    if im is None:
        src = Image.open(ROOT / path).convert("RGB")
        gray = src.convert("L")
        mask = gray.point(lambda p: 255 if p > 18 else 0)
        box = mask.getbbox()
        if box:
            bw, bh = box[2] - box[0], box[3] - box[1]
            if bw > src.width * 0.45 and bh > src.height * 0.35:
                src = src.crop(box)
        _OPEN[path] = src
        im = src
    return im


def fit(path, w, h, pad=36):
    """Whole picture, nothing cropped. Blurred fill behind it."""
    im = opened(path)
    scale = max(w / im.width, h / im.height)
    bw = max(w, math.ceil(im.width * scale))
    bh = max(h, math.ceil(im.height * scale))
    bg = im.resize((bw, bh), Image.LANCZOS)
    left = max(0, (bw - w) // 2)
    top = max(0, (bh - h) // 2)
    bg = bg.crop((left, top, left + w, top + h)).filter(ImageFilter.GaussianBlur(26))
    bg = Image.blend(bg, Image.new("RGB", (w, h), NAVY), 0.38)
    inner_w, inner_h = w - pad * 2, h - pad * 2
    contain = min(inner_w / im.width, inner_h / im.height)
    nw, nh = max(1, int(im.width * contain)), max(1, int(im.height * contain))
    fg = im.resize((nw, nh), Image.LANCZOS)
    canvas = bg.convert("RGBA")
    canvas.paste(fg, ((w - nw) // 2, (h - nh) // 2))
    return canvas


def navy():
    return Image.new("RGBA", (W, H), NAVY + (255,))


def hook(t):
    img = navy()
    panel = fit("public/images/albums/lets-sing-and-dance-with-dropati.png", W, 1240, pad=28)
    img.paste(panel, (0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    a = ease(prog(t, 0.3, 0.4))
    lg = mark(64)
    img.paste(lg, (W // 2 - 32, 1288), lg)
    text(d, (W / 2, 1400), "Chutney", font(GEORGIA, 78), WHITE, ease(prog(t, 0.6, 0.35)))
    text(d, (W / 2, 1490), "or chutney bhajan?", font(GEORGIA, 48), WHITE, ease(prog(t, 1.1, 0.35)))
    text(d, (W / 2, 1570), "Look at the song.", font(SANS_R, 32), GOLD, ease(prog(t, 1.8, 0.35)))
    return img


def split(t):
    local = t - HOOK_END
    img = navy()
    top = fit(SONGS[1][0], W, 760, pad=24)
    bot = fit(SONGS[3][0], W, 760, pad=24)
    img.paste(top, (0, 0))
    img.paste(bot, (0, 1160))
    d = ImageDraw.Draw(img, "RGBA")
    a = ease(prog(local, 0.2, 0.4))
    text(d, (W / 2, 820), "CHUTNEY  ·  the folk song", font(SANS, 28), GOLD, a)
    text(d, (W / 2, 880), "CHUTNEY BHAJAN  ·  the prayer", font(SANS, 28), WHITE, ease(prog(local, 0.5, 0.35)))
    text(d, (W / 2, 960), "Same singers. Different songs.", font(SANS_R, 30), GOLD, ease(prog(local, 1.0, 0.35)))
    return img


def card(t, start, path, title, who, kicker):
    local = t - start
    img = navy()
    panel = fit(path, W, 1280, pad=40)
    img.paste(panel, (0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    a = ease(prog(local, 0.1, 0.3))
    text(d, (W / 2, 1360), kicker, font(SANS, 24), GOLD, a)
    text(d, (W / 2, 1450), title, font(GEORGIA, 60), WHITE, ease(prog(local, 0.2, 0.3)))
    text(d, (W / 2, 1540), who, font(SANS_R, 32), (232, 224, 210), ease(prog(local, 0.3, 0.3)))
    return img


def end(t):
    u = t - END_START
    img = navy()
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((180, 420, 900, 1180), fill=80)
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    tint = Image.new("RGB", (W, H), SAFFRON)
    img = Image.composite(tint, img.convert("RGB"), glow).convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")
    a = ease(prog(u, 0.15, 0.35))
    lg = mark(int(140 * max(a, 0.05)))
    img.paste(lg, ((W - lg.width) // 2, 560), lg)
    text(d, (W / 2, 820), "Both shelves.", font(SANS_R, 36), GOLD, ease(prog(u, 0.3, 0.3)))
    text(d, (W / 2, 920), "Bhajan Library", font(GEORGIA, 68), WHITE, ease(prog(u, 0.4, 0.3)))
    text(d, (W / 2, 1080), "Lyrics beside the recording.", font(SANS_R, 28), (232, 224, 210), ease(prog(u, 0.55, 0.3)))
    text(d, (W / 2, 1160), "www.bhajanlibrary.com", font(SANS, 32), SAFFRON, ease(prog(u, 0.7, 0.3)))
    return img


def fade(a, b, p):
    if p <= 0:
        return a
    if p >= 1:
        return b
    return Image.blend(a.convert("RGB"), b.convert("RGB"), p).convert("RGBA")


def frame_at(t):
    if t < HOOK_END - 0.4:
        return hook(t)
    if t < HOOK_END:
        return fade(hook(HOOK_END - 0.45), split(HOOK_END), ease(prog(t, HOOK_END - 0.4, 0.4)))
    if t < SPLIT_END - 0.4:
        return split(t)
    if t < END_START:
        i = min(len(SONGS) - 1, int((t - SONG_START) / CARD))
        start = SONG_START + i * CARD
        path, title, who, kicker, _audio = SONGS[i]
        this = card(max(t, start), start, path, title, who, kicker)
        if t < start + 0.4:
            if i == 0:
                old = split(SPLIT_END - 0.2)
            else:
                prev = SONGS[i - 1]
                old = card(start - 0.05, start - CARD, prev[0], prev[1], prev[2], prev[3])
            return fade(old, this, ease(prog(t, start, 0.4)))
        return this
    if t < END_START + 0.4:
        last = SONGS[-1]
        old = card(END_START - 0.05, END_START - CARD, last[0], last[1], last[2], last[3])
        return fade(old, end(t), ease(prog(t, END_START, 0.4)))
    return end(t)


def loud_start(path, length, skip=12.0, scan=100.0):
    raw = subprocess.check_output(
        [
            "ffmpeg", "-v", "error", "-ss", str(skip), "-i", str(ROOT / path),
            "-t", str(scan), "-ac", "1", "-ar", "8000", "-f", "f32le", "-",
        ]
    )
    samples = np.frombuffer(raw, dtype=np.float32)
    win = int(length * 8000)
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
            "-t", f"{dur:.3f}", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-",
        ]
    )
    clip = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    fade_n = int(0.35 * SR)
    if len(clip) > fade_n * 2:
        ramp = np.linspace(0, 1, fade_n)[:, None]
        clip[:fade_n] *= ramp
        clip[-fade_n:] *= ramp[::-1]
    return clip


def mix_songs(dest):
    n = int(DURATION * SR)
    mix = np.zeros((n, 2), dtype=np.float64)
    # The folk song under the open, then each song with its picture.
    beds = [(SONGS[0][4], 0.4, 0.55)]
    beds += [(song[4], SONG_START + i * CARD, 1.0) for i, song in enumerate(SONGS)]
    for path, at, gain in beds:
        length = CARD if at >= SONG_START else SPLIT_END
        start = loud_start(path, length)
        print(f"clip {Path(path).name} @ {start:.1f}s", flush=True)
        clip = load_clip(path, start, length) * gain
        i0 = int(at * SR)
        i1 = min(n, i0 + len(clip))
        mix[i0:i1] += clip[: i1 - i0]
    fade = np.ones(n)
    fade[: int(0.4 * SR)] = np.linspace(0, 1, int(0.4 * SR))
    fade[-int(1.4 * SR) :] = np.linspace(1, 0, int(1.4 * SR))
    mix *= fade[:, None]
    peak = np.max(np.abs(mix)) or 1
    mix = mix / peak * 0.9
    import wave

    with wave.open(str(dest), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((mix * 32767).astype(np.int16).tobytes())


def main():
    bed = OUT / "_chutney-bed.wav"
    mix_songs(bed)
    dest = OUT / "bhajan-library-chutney-tiktok.mp4"
    proc = subprocess.Popen(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
            "-r", str(FPS), "-i", "pipe:0",
            "-i", str(bed),
            "-t", f"{DURATION:.3f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            str(dest),
        ],
        stdin=subprocess.PIPE,
    )
    assert proc.stdin is not None
    for i in range(FRAMES):
        proc.stdin.write(frame_at(i / FPS).convert("RGB").tobytes())
        if i % 120 == 0:
            print(f"frame {i}/{FRAMES}", flush=True)
    proc.stdin.close()
    code = proc.wait()
    bed.unlink(missing_ok=True)
    if code != 0:
        raise SystemExit(code)
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
