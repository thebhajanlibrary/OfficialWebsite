"""TikTok explainer: Traditional Chutney vs Chutney Bhajan.

The shelf follows the song, not the singer. 1080x1920, 28s.
"""

import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(OUT))
from build_promo import mark, soundtrack  # noqa: E402

W, H, FPS = 1080, 1920, 30
DURATION = 28.0
FRAMES = int(DURATION * FPS)

NAVY = (21, 34, 56)
IVORY = (248, 245, 239)
SAFFRON = (197, 138, 54)
WHITE = (255, 255, 255)
MUTED = (92, 86, 76)
GOLD = (244, 214, 160)
SAND = (224, 214, 200)

GEORGIA = r"C:\Windows\Fonts\georgiab.ttf"
SANS = r"C:\Windows\Fonts\segoeuib.ttf"
SANS_R = r"C:\Windows\Fonts\segoeui.ttf"

# Classic chutney songs from the Traditional Chutney section.
CHUTNEY_ROWS = [
    ("Kaise Bani", "Sundar Popo"),
    ("Lotela", "Sonny Mann"),
    ("Leggo Me Na Raja", "Babla & Kanchan"),
    ("Jing Ah Ling", "Rasika Dindial"),
    ("Tassa", "Dropati"),
    ("Royee Royee Akhiya", "Rakesh Yankaran"),
]

# Devotionals on the Chutney Style Bhajan shelf.
BHAJAN_ROWS = [
    ("Ho Dja Ram Nam", "Ramdew Chaitoe"),
    ("Gauri Puja", "Dropati"),
    ("Radha Kanhaiya", "Babla & Kanchan"),
    ("Jai Jai Bajrangi", "Rakesh Yankaran"),
    ("Nanda Baba", "Anand Yankaran"),
    ("Chalo Re Sabhi Ram Se Mile", "Babla & Kanchan"),
]


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


def navy_bg():
    img = Image.new("RGB", (W, H), (18, 28, 46))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((140, 280, 940, 1100), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    tint = Image.new("RGB", (W, H), SAFFRON)
    return Image.composite(tint, img, glow).convert("RGBA")


def cream_bg():
    return Image.new("RGBA", (W, H), IVORY)


def hook(t):
    img = navy_bg()
    d = ImageDraw.Draw(img, "RGBA")
    a = ease(prog(t, 0.15, 0.35))
    lg = mark(72)
    img.paste(lg, (W // 2 - 36, 250), lg)
    text(d, (W / 2, 370), "BHAJAN LIBRARY", font(SANS, 22), GOLD, a)
    text(d, (W / 2, 560), "Chutney", font(GEORGIA, 96), WHITE, ease(prog(t, 0.4, 0.35)))
    text(d, (W / 2, 680), "or", font(SANS_R, 36), GOLD, ease(prog(t, 0.75, 0.25)))
    text(d, (W / 2, 800), "chutney bhajan?", font(GEORGIA, 72), WHITE, ease(prog(t, 1.0, 0.35)))
    text(d, (W / 2, 980), "Not one singer.", font(SANS_R, 40), (232, 224, 210), ease(prog(t, 1.7, 0.35)))
    text(d, (W / 2, 1044), "Two kinds of song.", font(SANS_R, 40), (232, 224, 210), ease(prog(t, 2.05, 0.35)))
    return img


def difference(t, start):
    img = cream_bg()
    d = ImageDraw.Draw(img, "RGBA")
    local = t - start
    text(d, (W / 2, 280), "THE DIFFERENCE", font(SANS, 26), SAFFRON, ease(prog(local, 0.05, 0.3)))
    lines = [
        (400, "Chutney is the folk song.", font(GEORGIA, 54), NAVY),
        (500, "Its own section.", font(SANS_R, 36), MUTED),
        (556, "Not under All Bhajans.", font(SANS_R, 36), MUTED),
        (700, "Chutney bhajan is a prayer", font(GEORGIA, 48), NAVY),
        (770, "sung in that style.", font(GEORGIA, 48), NAVY),
        (880, "Ram, Krishna, Durga, Hanuman.", font(SANS_R, 34), MUTED),
        (936, "Those sit with the bhajans.", font(SANS_R, 34), MUTED),
        (1100, "The same singers do both.", font(SANS, 36), SAFFRON),
    ]
    for i, (y, value, face, color) in enumerate(lines):
        text(d, (W / 2, y), value, face, color, ease(prog(local, 0.15 + i * 0.12, 0.28)))
    return img


def song_list(t, start, kicker, title, subtitle, rows, more):
    img = cream_bg()
    d = ImageDraw.Draw(img, "RGBA")
    local = t - start
    a = ease(prog(local, 0.05, 0.3))
    text(d, (W / 2, 150), kicker, font(SANS, 26), SAFFRON, a)
    text(d, (W / 2, 240), title, font(GEORGIA, 64), NAVY, ease(prog(local, 0.1, 0.3)))
    text(d, (W / 2, 330), subtitle, font(SANS_R, 32), MUTED, ease(prog(local, 0.22, 0.3)))
    y = 430
    song_f = font(SANS, 38)
    who_f = font(SANS_R, 28)
    for i, (song, who) in enumerate(rows):
        ra = ease(prog(local, 0.3 + i * 0.08, 0.25))
        d.line((100, y - 16, 980, y - 16), fill=SAND + (int(180 * ra),), width=2)
        text(d, (110, y), song, song_f, NAVY, ra, "lt")
        text(d, (110, y + 48), who, who_f, MUTED, ra, "lt")
        y += 130
    text(d, (W / 2, y + 36), more, font(SANS_R, 28), MUTED, ease(prog(local, 0.9, 0.3)))
    return img


def end(t, start):
    img = navy_bg()
    d = ImageDraw.Draw(img, "RGBA")
    u = t - start
    a = ease(prog(u, 0.1, 0.35))
    lg = mark(int(140 * a)) if a > 0.05 else None
    if lg:
        img.paste(lg, ((W - lg.width) // 2, 420), lg)
    text(d, (W / 2, 680), "Both shelves.", font(SANS_R, 36), GOLD, ease(prog(u, 0.25, 0.3)))
    text(d, (W / 2, 780), "Bhajan Library", font(GEORGIA, 72), WHITE, ease(prog(u, 0.35, 0.3)))
    text(d, (W / 2, 900), "Lyrics beside the recording.", font(SANS_R, 32), (232, 224, 210), ease(prog(u, 0.55, 0.3)))
    text(d, (W / 2, 1060), "www.bhajanlibrary.com", font(SANS, 34), SAFFRON, ease(prog(u, 0.75, 0.3)))
    return img


def circle_reveal(base, top, p):
    if p <= 0:
        return base
    if p >= 1:
        return top
    r = p * math.hypot(W, H)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse((W / 2 - r, 980 - r, W / 2 + r, 980 + r), fill=255)
    out = base.copy()
    out.paste(top, (0, 0), mask)
    return out


def frame_at(t):
    trad = lambda tt: song_list(
        tt, 9.4,
        "TRADITIONAL CHUTNEY",
        "The folk songs.",
        "Own section. Not under All Bhajans.",
        CHUTNEY_ROWS,
        "Also Boodram Holass, Anand Yankaran, and more.",
    )
    bhaj = lambda tt: song_list(
        tt, 17.2,
        "CHUTNEY BHAJAN",
        "The prayers.",
        "On the bhajan shelves.",
        BHAJAN_ROWS,
        "Also Kanha Moerlie Bedja, Mai Ramta Jogi, and more.",
    )
    if t < 3.8:
        return hook(t)
    if t < 4.4:
        return circle_reveal(hook(3.7), difference(t, 4.2), ease(prog(t, 3.8, 0.6)))
    if t < 8.8:
        return difference(t, 4.2)
    if t < 9.4:
        return circle_reveal(difference(8.7, 4.2), trad(t), ease(prog(t, 8.8, 0.6)))
    if t < 16.6:
        return trad(t)
    if t < 17.2:
        return circle_reveal(trad(16.5), bhaj(t), ease(prog(t, 16.6, 0.6)))
    if t < 23.8:
        return bhaj(t)
    if t < 24.4:
        return circle_reveal(bhaj(23.7), end(t, 24.2), ease(prog(t, 23.8, 0.6)))
    return end(t, 24.2)


def main():
    frames = OUT / "_frames-chutney"
    frames.mkdir(exist_ok=True)
    for i in range(FRAMES):
        frame_at(i / FPS).convert("RGB").save(frames / f"{i:04d}.jpg", quality=90)
        if i % 90 == 0:
            print(f"frame {i}/{FRAMES}", flush=True)
    bed = OUT / "_chutney-bed.wav"
    soundtrack(bed, DURATION, hook_end=3.8, hits=[3.8, 9.0, 16.8, 24.0], end_start=24.2)
    dest = OUT / "bhajan-library-chutney-tiktok.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-framerate", str(FPS), "-i", str(frames / "%04d.jpg"),
            "-i", str(bed),
            "-t", str(DURATION),
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            str(dest),
        ],
        check=True,
    )
    bed.unlink(missing_ok=True)
    for frame in frames.glob("*.jpg"):
        frame.unlink()
    frames.rmdir()
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
