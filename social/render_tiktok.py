"""Vertical promo for Bhajan Library: real covers, singers, and an original bed."""

import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 1080, 1920
FPS = 24
SECONDS = 16
SR = 44100

NAVY = (19, 32, 51)
SAFFRON = (196, 120, 26)
IVORY = (247, 249, 252)
CREAM = (243, 230, 207)
MUTED = (196, 206, 216)
PAGE = (228, 235, 243)
PAGE_SHADE = (183, 195, 209)

GEORGIA = r"C:\Windows\Fonts\georgia.ttf"
GEORGIA_BOLD = r"C:\Windows\Fonts\georgiab.ttf"
SEGOE = r"C:\Windows\Fonts\segoeui.ttf"
SEGOE_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"

OUT = Path(__file__).with_name("bhajan-library-tiktok.mp4")
SILENT = Path(__file__).with_name("_silent.mp4")
WAV = Path(__file__).with_name("_bed.wav")

SHELVES = [
    (ROOT / "public/images/hanuman-chalisa-lata-mangeshkar.png", "Hanuman Chalisa"),
    (ROOT / "public/images/folders/garba/cover.jpg", "Garba"),
    (ROOT / "public/images/folders/chutney-style-bhajan/cover.jpg", "Chutney Bhajan"),
    (ROOT / "public/images/folders/birthday-songs/cover.jpg", "Birthday"),
]
SINGERS = [
    (ROOT / "public/images/krishna-das.jpg", "Krishna Das"),
    (ROOT / "public/images/jagjit-singh.jpg", "Jagjit Singh"),
    (ROOT / "public/images/sonu-nigam.jpg", "Sonu Nigam"),
    (ROOT / "public/images/falguni-pathak.jpg", "Falguni Pathak"),
    (ROOT / "public/images/mukesh.jpg", "Mukesh"),
    (ROOT / "public/images/diljit-dosanjh.jpg", "Diljit Dosanjh"),
]


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def ease(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def fade(t: float, start: float, end: float) -> float:
    if end <= start:
        return 1.0 if t >= end else 0.0
    return ease((t - start) / (end - start))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def square_crop(path: Path, size: int) -> Image.Image:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 5)
    if top + side > h:
        top = h - side
    im = im.crop((left, top, left + side, top + side))
    return im.resize((size, size), Image.Resampling.LANCZOS)


def rounded(im: Image.Image, radius: int) -> Image.Image:
    out = im.convert("RGBA")
    mask = Image.new("L", out.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, out.width - 1, out.height - 1), radius=radius, fill=255
    )
    out.putalpha(mask)
    return out


def circled(im: Image.Image) -> Image.Image:
    out = im.convert("RGBA")
    mask = Image.new("L", out.size, 0)
    ImageDraw.Draw(mask).ellipse((1, 1, out.width - 2, out.height - 2), fill=255)
    out.putalpha(mask)
    return out


def load_assets() -> dict:
    shelves = []
    for path, title in SHELVES:
        card = rounded(square_crop(path, 460), 36)
        shelves.append((card, title))
    singers = []
    for path, name in SINGERS:
        singers.append((circled(square_crop(path, 250)), name))
    return {"shelves": shelves, "singers": singers}


def text_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont) -> int:
    box = draw.textbbox((0, 0), text, font=face)
    return box[2] - box[0]


def blit_text(
    base: Image.Image,
    text: str,
    x: float,
    y: float,
    face: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    alpha: float,
    anchor: str = "mm",
) -> None:
    if alpha <= 0.01:
        return
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.text((x, y), text, font=face, fill=(*fill, int(255 * alpha)), anchor=anchor)
    base.alpha_composite(layer)


def draw_mark(base: Image.Image, cx: float, cy: float, scale: float, alpha: float) -> None:
    if alpha <= 0.01:
        return
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    a = int(255 * alpha)

    def p(x: float, y: float) -> tuple[float, float]:
        return (cx + (x - 64) * scale, cy + (y - 64) * scale)

    r = 64 * scale
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(247, 245, 239, a))
    inner = 58 * scale
    draw.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill=(*NAVY, a))
    sw = max(2, int(2.6 * scale))
    draw.arc((*p(18, 18), *p(64, 50)), 200, 340, fill=(*SAFFRON, a), width=sw)
    draw.arc((*p(64, 18), *p(110, 50)), 200, 340, fill=(*SAFFRON, a), width=sw)
    draw.polygon([p(62, 100), p(24, 86), p(24, 56), p(62, 68)], fill=(*IVORY, a))
    draw.polygon([p(66, 100), p(104, 86), p(104, 56), p(66, 68)], fill=(*PAGE, a))
    line_w = max(1, int(1.6 * scale))
    draw.line([p(34, 64.5), p(54, 71)], fill=(*PAGE_SHADE, a), width=line_w)
    draw.line([p(32, 71.5), p(52, 78)], fill=(*PAGE_SHADE, a), width=line_w)
    draw.line([p(74, 71), p(94, 64.5)], fill=(*PAGE_SHADE, a), width=line_w)
    draw.line([p(76, 78), p(96, 71.5)], fill=(*PAGE_SHADE, a), width=line_w)
    draw.line([p(64, 68), p(64, 100)], fill=(*SAFFRON, a), width=max(2, int(2.8 * scale)))
    draw.polygon(
        [p(64, 18), p(52, 40), p(51, 48), p(57, 57), p(64, 61), p(71, 57), p(77, 48), p(76, 40)],
        fill=(*SAFFRON, a),
    )
    draw.polygon(
        [p(64, 32), p(58, 44), p(58, 48), p(64, 53), p(70, 48), p(70, 44)],
        fill=(245, 237, 217, a),
    )
    base.alpha_composite(layer)


def paint_background(t: float) -> Image.Image:
    img = Image.new("RGBA", (W, H), (*NAVY, 255))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = 900, 260 + 18 * math.sin(t * 0.35)
    for radius in (340, 250, 160):
        draw.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            outline=(*SAFFRON, 55),
            width=3,
        )
    for i in range(10):
        ang = math.radians(i * 36 + t * 10)
        dx = cx + math.cos(ang) * 250
        dy = cy + math.sin(ang) * 250
        rr = 6 if i % 2 == 0 else 4
        draw.ellipse((dx - rr, dy - rr, dx + rr, dy + rr), fill=(*SAFFRON, 110))
    img.alpha_composite(layer)
    return img


def paste(base: Image.Image, sprite: Image.Image, x: float, y: float, alpha: float) -> None:
    if alpha <= 0.01:
        return
    sprite = sprite.copy()
    if alpha < 0.999:
        r, g, b, a = sprite.split()
        a = a.point(lambda p: int(p * alpha))
        sprite = Image.merge("RGBA", (r, g, b, a))
    base.alpha_composite(sprite, (int(x), int(y)))


def frame_at(t: float, assets: dict, faces: dict) -> Image.Image:
    img = paint_background(t)
    title_face = faces["title"]
    head_face = faces["head"]
    body_face = faces["body"]
    label_face = faces["label"]
    url_face = faces["url"]

    intro = fade(t, 0.2, 1.0)
    rise = fade(t, 2.4, 3.3)
    header = intro * (1 - fade(t, 13.4, 14.0))
    mark_y = lerp(640, 250, rise)
    mark_s = lerp(2.7, 1.05, rise)
    title_y = mark_y + 64 * mark_s + lerp(78, 48, rise)
    draw_mark(img, W / 2, mark_y, mark_s, header)
    blit_text(
        img,
        "Bhajan Library",
        W / 2,
        title_y,
        title_face if rise < 0.55 else faces["title_sm"],
        IVORY,
        fade(t, 0.7, 1.35) * (1 - fade(t, 13.4, 14.0)),
    )

    purpose = fade(t, 2.6, 3.2) * (1 - fade(t, 5.3, 5.9))
    blit_text(img, "A library for satsang", W / 2, 430, head_face, CREAM, purpose)
    beats = [
        (3.0, "Play the recording"),
        (3.45, "Read Roman, Hindi, and English"),
        (3.9, "Browse by deity, occasion, and singer"),
    ]
    for i, (start, line) in enumerate(beats):
        blit_text(
            img,
            line,
            W / 2,
            560 + i * 78,
            body_face,
            IVORY if i == 0 else MUTED,
            fade(t, start, start + 0.35) * (1 - fade(t, 5.3, 5.9)),
        )

    # Sliding shelves
    shelf_a = fade(t, 5.5, 6.1) * (1 - fade(t, 10.6, 11.3))
    if shelf_a > 0.01:
        cards = assets["shelves"]
        card_w = 460
        gap = 36
        travel = (card_w + gap) * len(cards)
        offset = (t - 5.5) * 70
        base_x = 80 - (offset % (card_w + gap))
        y = 560
        for k in range(-1, 4):
            for i, (card, title) in enumerate(cards):
                x = base_x + (i + k * len(cards)) * (card_w + gap)
                if x < -card_w or x > W:
                    continue
                paste(img, card, x, y, shelf_a)
                blit_text(
                    img,
                    title,
                    x + card_w / 2,
                    y + card_w + 36,
                    label_face,
                    CREAM,
                    shelf_a,
                )
        blit_text(img, "Shelves", 90, 500, faces["kicker"], SAFFRON, shelf_a, "lm")

    singer_a = fade(t, 10.4, 11.1) * (1 - fade(t, 13.6, 14.2))
    if singer_a > 0.01:
        people = assets["singers"]
        size = 250
        gap = 48
        offset = max(0.0, (t - 11.6) * 55)
        stride = size + gap
        base_x = 80 - offset
        y = 620
        blit_text(img, "Singers in the library", W / 2, 500, head_face, CREAM, singer_a)
        for k in range(-1, 3):
            for i, (photo, name) in enumerate(people):
                x = base_x + (i + k * len(people)) * stride
                if x < -size or x > W:
                    continue
                bob = 8 * math.sin(t * 1.6 + i)
                paste(img, photo, x, y + bob, singer_a)
                if 12 <= x <= W - size - 12:
                    blit_text(
                        img,
                        name,
                        x + size / 2,
                        y + size + 48 + bob,
                        label_face,
                        IVORY,
                        singer_a,
                    )

    end = fade(t, 13.8, 14.4)
    if end > 0.01:
        draw_mark(img, W / 2, 690, 2.15, end)
        blit_text(img, "Bhajan Library", W / 2, 900, title_face, IVORY, end)
        blit_text(img, "Lyrics beside the recording.", W / 2, 1020, body_face, CREAM, end)
        blit_text(img, "www.bhajanlibrary.com", W / 2, 1140, url_face, SAFFRON, end)

    return img.convert("RGB")


def hit(buf: np.ndarray, start: int, wave: np.ndarray, gain: float) -> None:
    end = min(len(buf), start + len(wave))
    if start >= len(buf) or end <= start:
        return
    buf[start:end] += wave[: end - start] * gain


def synth_bed() -> np.ndarray:
    n = int(SECONDS * SR)
    t = np.arange(n) / SR
    audio = np.zeros(n, dtype=np.float64)
    # Tanpura-like drone on Sa and Pa.
    audio += 0.09 * np.sin(2 * math.pi * 130.81 * t)
    audio += 0.07 * np.sin(2 * math.pi * 196.00 * t)
    audio += 0.035 * np.sin(2 * math.pi * 261.63 * t)
    audio *= 0.82 + 0.18 * np.sin(2 * math.pi * 0.12 * t)

    low_n = int(0.22 * SR)
    lt = np.arange(low_n) / SR
    low = np.sin(2 * math.pi * 78 * lt) * np.exp(-lt / 0.07)
    low += np.random.default_rng(3).standard_normal(low_n) * np.exp(-lt / 0.025) * 0.45

    high_n = int(0.12 * SR)
    ht = np.arange(high_n) / SR
    rng = np.random.default_rng(7)
    high = np.sin(2 * math.pi * 210 * ht) * np.exp(-ht / 0.04)
    high += rng.standard_normal(high_n) * np.exp(-ht / 0.015) * 0.55

    beat = 0.48
    i = 0
    while i * beat < SECONDS - 0.2:
        at = int(i * beat * SR)
        if i % 2 == 0:
            hit(audio, at, low, 0.55)
        else:
            hit(audio, at, high, 0.38)
        i += 1

    # A short original phrase on a pentatonic, not a borrowed tune.
    phrase = [220.0, 277.2, 329.6, 370.0, 329.6, 277.2, 246.9, 220.0]
    for k, freq in enumerate(phrase):
        start_s = 3.2 + k * 1.35
        nn = int(0.9 * SR)
        nt = np.arange(nn) / SR
        tone = (
            np.sin(2 * math.pi * freq * nt)
            + 0.35 * np.sin(2 * math.pi * freq * 2 * nt)
            + 0.12 * np.sin(2 * math.pi * freq * 3 * nt)
        )
        tone *= np.minimum(nt / 0.04, 1) * np.exp(-nt / 0.42)
        hit(audio, int(start_s * SR), tone, 0.16)

    fade_n = int(0.4 * SR)
    audio[:fade_n] *= np.linspace(0, 1, fade_n)
    audio[-int(1.1 * SR) :] *= np.linspace(1, 0, int(1.1 * SR))
    peak = np.max(np.abs(audio)) or 1
    audio = audio / peak * 0.9
    return audio


def write_wav(path: Path, audio: np.ndarray) -> None:
    import wave

    pcm = (audio * 32767).astype(np.int16)
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(pcm.tobytes())


def render_video(assets: dict) -> None:
    faces = {
        "title": font(GEORGIA_BOLD, 72),
        "title_sm": font(GEORGIA_BOLD, 54),
        "head": font(GEORGIA, 48),
        "body": font(GEORGIA, 36),
        "label": font(SEGOE_BOLD, 28),
        "kicker": font(SEGOE_BOLD, 26),
        "url": font(GEORGIA, 42),
    }
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-preset", "veryfast", "-crf", "20", str(SILENT),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    assert proc.stdin is not None
    total = FPS * SECONDS
    for i in range(total):
        proc.stdin.write(frame_at(i / FPS, assets, faces).tobytes())
        if i % FPS == 0:
            print(f"frame {i}/{total}", flush=True)
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg video failed")


def mux() -> None:
    cmd = [
        "ffmpeg", "-y", "-i", str(SILENT), "-i", str(WAV),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart", "-shortest", str(OUT),
    ]
    subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main() -> None:
    assets = load_assets()
    if "--preview" in sys.argv:
        folder = Path(__file__).with_name("preview")
        folder.mkdir(exist_ok=True)
        faces = {
            "title": font(GEORGIA_BOLD, 72),
            "title_sm": font(GEORGIA_BOLD, 54),
            "head": font(GEORGIA, 48),
            "body": font(GEORGIA, 36),
            "label": font(SEGOE_BOLD, 28),
            "kicker": font(SEGOE_BOLD, 26),
            "url": font(GEORGIA, 42),
        }
        for t in (1.6, 4.2, 8.0, 12.2, 15.2):
            frame_at(t, assets, faces).save(folder / f"t-{t:.1f}.jpg", quality=88)
            print("preview", t)
        return
    print("music")
    write_wav(WAV, synth_bed())
    render_video(assets)
    mux()
    SILENT.unlink(missing_ok=True)
    WAV.unlink(missing_ok=True)
    print("wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
