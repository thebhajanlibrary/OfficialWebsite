"""Bhajan Library promo, in the same shape as the kitchen films.

9:16 and 16:9. A still opens the film, then a phone shows the library,
then a navy end card. Run: python social/build_promo.py
"""

import math
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
FPS = 30

IVORY = (248, 245, 239)
CREAM = (255, 253, 249)
NAVY = (21, 34, 56)
INK = (21, 34, 56)
SAFFRON = (197, 138, 54)
SAND = (231, 222, 208)
MUTED = (92, 86, 76)
LINE = (224, 214, 200)
WHITE = (255, 255, 255)
SOFT = (246, 237, 217)

# Vertical timings
V_DUR = 24.0
V_HOOK = 5.4
V_SCENES = [5.4, 10.0, 14.2, 18.0]
V_END = 21.4

# Wide timings
W_DUR = 22.0
W_HOOK = 5.0
W_SCENES = [5.0, 9.2, 13.0, 16.6]
W_END = 19.4

FEATURES = [
    ("Play and read", "The recording and the words, one page."),
    ("By deity", "Hanuman, Shiva, Durga, Krishna."),
    ("Every singer", "One prayer, many voices."),
    ("Three scripts", "Roman, Hindi, and English."),
]


def font(name, size):
    return ImageFont.truetype(f"C:/Windows/Fonts/{name}", size)


def deva(size):
    return ImageFont.truetype("C:/Windows/Fonts/Nirmala.ttc", size, index=0)


def serif(size):
    return font("georgia.ttf", size)


def serif_b(size):
    return font("georgiab.ttf", size)


def sans(size):
    return font("segoeui.ttf", size)


def sans_b(size):
    return font("segoeuib.ttf", size)


def sans_sb(size):
    return font("seguisb.ttf", size)


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def prog(t, start, dur):
    return clamp((t - start) / dur) if dur else 1.0


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = clamp(x)
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def back_out(x):
    x = clamp(x)
    c1 = 1.70158
    return 1 + (c1 + 1) * (x - 1) ** 3 + c1 * (x - 1) ** 2


def rgba(color, alpha):
    return color + (int(255 * clamp(alpha)),)


def text(d, xy, value, fnt, color, alpha=1.0, anchor="la", spacing=0):
    if alpha <= 0.01 or not value:
        return
    fill = rgba(color, alpha) if len(color) == 3 else color
    if spacing:
        x, y = xy
        total = sum(fnt.getlength(c) + spacing for c in value) - spacing
        if anchor[0] == "m":
            x -= total / 2
        elif anchor[0] == "r":
            x -= total
        for ch in value:
            d.text((x, y), ch, font=fnt, fill=fill, anchor="l" + anchor[1])
            x += fnt.getlength(ch) + spacing
        return
    d.text(xy, value, font=fnt, fill=fill, anchor=anchor)


def cover(img, size):
    scale = max(size[0] / img.width, size[1] / img.height)
    resized = img.resize(
        (math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.LANCZOS
    )
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def load_mark():
    im = Image.open(OUT / "mark.png").convert("RGBA")
    arr = np.array(im)
    dark = (arr[:, :, 2] > arr[:, :, 0] + 15) & (arr[:, :, 2] > 40)
    ys, xs = np.where(dark)
    pad = 2
    box = (
        max(0, xs.min() - pad),
        max(0, ys.min() - pad),
        min(im.width, xs.max() + pad),
        min(im.height, ys.max() + pad),
    )
    im = im.crop(box)
    side = max(im.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    return canvas


MARK = load_mark()


@lru_cache(maxsize=32)
def mark(size):
    img = MARK.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    img.putalpha(mask)
    return img


def open_rgb(path):
    return Image.open(ROOT / path).convert("RGB")


HOOK_SRC = open_rgb("public/images/folders/garba/cover.jpg")
# The title sits in the lower half. Keep the lamps, the arch, and the figure.
HOOK_STILL = HOOK_SRC.crop((0, 0, HOOK_SRC.width, int(HOOK_SRC.height * 0.52)))

CARD_SRCS = [
    (open_rgb("public/images/hanuman-chalisa-lata-mangeshkar.png"), "Hanuman"),
    (None, "Shiva"),
    (open_rgb("public/images/jai-ambe-maa-bolo-lata-mangeshkar.jpg"), "Durga"),
    (open_rgb("public/images/jai-radha-madhav-jagjit-singh-thumb.jpg"), "Krishna"),
]
SINGER_SRCS = [
    (open_rgb("public/images/krishna-das.jpg"), "Krishna Das"),
    (open_rgb("public/images/jagjit-singh.jpg"), "Jagjit Singh"),
    (open_rgb("public/images/falguni-pathak.jpg"), "Falguni Pathak"),
    (open_rgb("public/images/sonu-nigam.jpg"), "Sonu Nigam"),
]
CHALISA_COVER = open_rgb("public/images/hanuman-chalisa-lata-mangeshkar.png")


def circle_photo(img, size):
    shot = cover(img, (size, size)).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, size - 2, size - 2), fill=255)
    shot.putalpha(mask)
    return shot


SINGERS = [(circle_photo(im, 120), name) for im, name in SINGER_SRCS]
def shiva_tile():
    img = Image.new("RGB", (440, 300), (46, 34, 72))
    d = ImageDraw.Draw(img)
    gold = (236, 198, 122)
    d.rectangle((208, 118, 232, 250), fill=gold)
    d.rectangle((120, 108, 320, 128), fill=gold)
    d.polygon([(132, 108), (156, 42), (180, 108)], fill=gold)
    d.polygon([(196, 108), (220, 28), (244, 108)], fill=gold)
    d.polygon([(260, 108), (284, 42), (308, 108)], fill=gold)
    return img


DEITY_THUMBS = [
    (cover(shiva_tile() if im is None else im, (220, 150)), name) for im, name in CARD_SRCS
]
PLAYER_COVER = cover(CHALISA_COVER, (168, 168))


def vertical_gradient(top, bottom, size):
    t = np.linspace(0, 1, size[1], dtype=np.float32)[:, None, None]
    arr = np.array(top, dtype=np.float32) * (1 - t) + np.array(bottom, dtype=np.float32) * t
    return Image.fromarray(np.repeat(arr, size[0], axis=1).astype(np.uint8))


def make_blob(radius, color, alpha):
    size = radius * 4
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(img).ellipse((radius, radius, radius * 3, radius * 3), fill=color + (alpha,))
    return img.filter(ImageFilter.GaussianBlur(radius * 0.55))


# ---------- phone screens, 560 x 1190 ----------
SW, SH = 560, 1190


def app_bar(img, d):
    d.rectangle((0, 0, SW, 118), fill=IVORY)
    lg = mark(40)
    img.paste(lg, (28, 58), lg)
    text(d, (80, 78), "Bhajan Library", sans_sb(22), INK, anchor="lm")
    d.rounded_rectangle((500, 66, 532, 92), 8, outline=LINE, width=2)
    d.line((0, 118, SW, 118), fill=LINE, width=2)


def screen_play(u):
    img = Image.new("RGBA", (SW, SH), IVORY)
    d = ImageDraw.Draw(img)
    app_bar(img, d)
    text(d, (32, 156), "NOW PLAYING", sans_b(16), SAFFRON, spacing=1.4)
    text(d, (32, 196), "Hanuman Chalisa", serif_b(40), NAVY)
    text(d, (32, 250), "Lata Mangeshkar", sans(22), MUTED)
    d.rounded_rectangle((32, 300, 528, 500), 28, fill=WHITE)
    img.paste(PLAYER_COVER, (48, 316))
    text(d, (236, 348), "Hanuman Chalisa", sans_sb(22), NAVY)
    text(d, (236, 382), "Lata Mangeshkar", sans(18), MUTED)
    d.rounded_rectangle((236, 440, 500, 450), 5, fill=SAND)
    played = int(236 + 264 * clamp(u * 1.1))
    d.rounded_rectangle((236, 440, played, 450), 5, fill=SAFFRON)
    text(d, (236, 468), "2:14", sans(16), MUTED)
    text(d, (500, 468), "8:01", sans(16), MUTED, anchor="rm")
    lines = [
        ("Shri Guru Charan Saroj Raj", "I bow to the lotus feet of the Guru"),
        ("Nij manu mukuru sudhari", "and polish the mirror of my mind"),
        ("Baranau Raghubar Bimal Jasu", "I sing the pure glory of Ram"),
    ]
    y = 540
    for i, (roman, eng) in enumerate(lines):
        a = ease_out(prog(u, 0.12 + i * 0.16, 0.28))
        if a <= 0:
            continue
        d.rounded_rectangle((32, y, 528, y + 118), 22, fill=rgba(WHITE, a))
        text(d, (52, y + 36), roman, serif(24), NAVY, a)
        text(d, (52, y + 74), eng, sans(18), MUTED, a)
        y += 132
    return img.convert("RGB")


def screen_deity(u):
    img = Image.new("RGBA", (SW, SH), IVORY)
    d = ImageDraw.Draw(img)
    app_bar(img, d)
    text(d, (32, 160), "By Bhagwan", serif_b(40), NAVY)
    d.rounded_rectangle((32, 230, 528, 304), 18, fill=WHITE, outline=LINE, width=2)
    typed = "Hanuman"[: int(ease_out(prog(u, 0.05, 0.45)) * 7 + 0.001)]
    text(d, (52, 267), typed or "Search a deity", sans(22), NAVY if typed else MUTED, anchor="lm")
    if typed and len(typed) < 7:
        cx = 52 + sans(22).getlength(typed)
        d.line((cx + 2, 250, cx + 2, 284), fill=SAFFRON, width=2)
    names = ["Hanuman", "Shiva", "Durga", "Krishna"]
    for i, ((thumb, _name), label) in enumerate(zip(DEITY_THUMBS, names)):
        a = ease_out(prog(u, 0.28 + i * 0.08, 0.3))
        if a <= 0:
            continue
        col, row = i % 2, i // 2
        x, y = 32 + col * 256, 340 + row * 250
        card = Image.new("RGBA", (240, 230), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle((0, 0, 239, 229), 22, fill=rgba(WHITE, a))
        shot = thumb.convert("RGBA")
        shot.putalpha(Image.eval(rounded_mask((220, 150), 16), lambda p: int(p * a)))
        card.paste(shot, (10, 10), shot)
        text(cd, (16, 190), label, sans_sb(22), NAVY, a)
        img.alpha_composite(card, (x, y))
    return img.convert("RGB")


def screen_singers(u):
    img = Image.new("RGBA", (SW, SH), IVORY)
    d = ImageDraw.Draw(img)
    app_bar(img, d)
    text(d, (32, 160), "Hanuman Chalisa", serif_b(36), NAVY)
    text(d, (32, 214), "Every voice in the library", sans(20), MUTED)
    for i, (photo, name) in enumerate(SINGERS):
        a = ease_out(prog(u, 0.08 + i * 0.08, 0.28))
        if a <= 0:
            continue
        x = 36 + i * 130
        ph = photo.copy()
        r, g, b, al = ph.split()
        al = al.point(lambda p: int(p * a))
        ph = Image.merge("RGBA", (r, g, b, al))
        img.paste(ph, (x, 270), ph)
        text(d, (x + 60, 408), name.split()[0], sans(16), NAVY, a, anchor="ma")
    versions = [
        ("Lata Mangeshkar", "The classic recording"),
        ("Hari Om Sharan", "Satsang aarti voice"),
        ("Krishna Das", "Kirtan"),
        ("Priyesh Dhoolab", "Indo-Caribbean"),
    ]
    y = 470
    for i, (who, note) in enumerate(versions):
        a = ease_out(prog(u, 0.35 + i * 0.1, 0.28))
        if a <= 0:
            continue
        d.rounded_rectangle((32, y, 528, y + 96), 20, fill=rgba(WHITE, a))
        text(d, (56, y + 32), who, sans_sb(22), NAVY, a)
        text(d, (56, y + 64), note, sans(18), MUTED, a)
        y += 110
    return img.convert("RGB")


def screen_scripts(u):
    img = Image.new("RGBA", (SW, SH), IVORY)
    d = ImageDraw.Draw(img)
    app_bar(img, d)
    text(d, (32, 160), "The same line", serif_b(40), NAVY)
    chips = [("Roman", 1.0), ("Hindi", ease_out(prog(u, 0.2, 0.25))), ("English", ease_out(prog(u, 0.42, 0.25)))]
    x = 32
    for label, a in chips:
        if a <= 0:
            continue
        w = sans_sb(18).getlength(label) + 36
        fill = SAFFRON if a > 0.8 else SAND
        color = WHITE if a > 0.8 else NAVY
        d.rounded_rectangle((x, 230, x + w, 274), 22, fill=rgba(fill, max(a, 0.35)))
        text(d, (x + 18, 252), label, sans_sb(18), color, max(a, 0.35), anchor="lm")
        x += w + 12
    rows = [
        ("श्रीगुरु चरन सरोज रज", prog(u, 0.2, 0.3)),
        ("Shri Guru Charan Saroj Raj", 1),
        ("I bow to the lotus feet of the Guru", prog(u, 0.42, 0.3)),
    ]
    y = 320
    for i, (line, a) in enumerate(rows):
        a = ease_out(a) if a <= 1 else 1
        if a <= 0:
            continue
        d.rounded_rectangle((32, y, 528, y + 150), 24, fill=rgba(WHITE, a))
        kicker = ["Hindi", "Roman", "English"][i]
        text(d, (56, y + 40), kicker.upper(), sans_b(14), SAFFRON, a, spacing=1.2)
        face = deva(32) if i == 0 else serif(28)
        text(d, (56, y + 92), line, face, NAVY, a, anchor="lm")
        y += 170
    return img.convert("RGB")


SCREENS = [screen_play, screen_deity, screen_singers, screen_scripts]


def build_phone(screen, pw, ph):
    frame = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle((0, 0, pw - 1, ph - 1), int(ph * 0.07), fill=(22, 22, 24, 255))
    inset = int(pw * 0.045)
    sw, sh = pw - inset * 2, ph - inset * 2
    shot = screen.resize((sw, sh), Image.LANCZOS)
    mask = rounded_mask((sw, sh), int(ph * 0.055))
    frame.paste(shot, (inset, inset), mask)
    d.rounded_rectangle(
        (inset, inset, inset + sw - 1, inset + sh - 1),
        int(ph * 0.055),
        outline=(70, 70, 74, 255),
        width=2,
    )
    d.rounded_rectangle((pw // 2 - 28, 10, pw // 2 + 28, 22), 6, fill=(48, 48, 54, 255))
    return frame


@lru_cache(maxsize=4)
def phone_shadow(pw, ph):
    pad = 160
    img = Image.new("RGBA", (pw + pad, ph + pad), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle(
        (70, 90, pw + 70, ph + 80), int(ph * 0.07), fill=(21, 34, 56, 70)
    )
    return img.filter(ImageFilter.GaussianBlur(36))


def scene_index(t, starts, end):
    if t >= end:
        return len(starts) - 1
    idx = 0
    for i, s in enumerate(starts):
        if t >= s:
            idx = i
    return idx


@lru_cache(maxsize=4)
def cream_bg(w, h):
    img = Image.new("RGB", (w, h), IVORY)
    blobs = [
        (make_blob(280, (246, 220, 170), 90), -40, 80),
        (make_blob(240, (197, 138, 54), 40), w - 360, h // 2),
    ]
    base = img.convert("RGBA")
    for blob, x, y in blobs:
        base.alpha_composite(blob, (int(x), int(y)))
    return base


def hook_frame(t, w, h, hook_end):
    zoom = 1.08 + 0.08 * clamp(t / hook_end)
    cw, ch = int(w * zoom), int(h * zoom)
    still = cover(HOOK_STILL, (cw, ch))
    left = int((cw - w) * (0.45 + 0.1 * t / hook_end))
    top = int((ch - h) * 0.35)
    frame = still.crop((left, top, left + w, top + h)).convert("RGBA")
    column = np.clip((np.linspace(0, 1, h) - 0.35) / 0.65, 0, 1) * 190
    shade = Image.fromarray(np.repeat(column.astype(np.uint8)[:, None], w, axis=1), "L")
    black = Image.new("RGBA", (w, h), (12, 10, 8, 255))
    frame = Image.composite(black, frame, shade)
    d = ImageDraw.Draw(frame)
    pill_a = ease_out(prog(t, 0.25, 0.45))
    if pill_a > 0:
        lg = mark(46)
        label = "Bhajan Library"
        tw = sans_sb(24).getlength(label)
        px, py, pw, ph = 48, 56, 46 + 28 + tw + 22, 68
        d.rounded_rectangle((px, py, px + pw, py + ph), 22, fill=rgba((255, 253, 249), 0.94 * pill_a))
        frame.paste(lg, (px + 12, py + 11), lg)
        text(d, (px + 68, py + ph / 2), label, sans_sb(24), NAVY, pill_a, anchor="lm")

    question = prog(t, 0.7, 0.45) * (1 - prog(t, 2.7, 0.4))
    answer = ease_out(prog(t, 3.05, 0.45))
    if h > w:
        qx, qy = w / 2, h * 0.72
        lines_q = ["Which bhajan", "for satsang?"]
        lines_a = ["The words sit", "beside it."]
        size = 92
    else:
        qx, qy = 140, h * 0.62
        lines_q = ["Which bhajan", "for satsang?"]
        lines_a = ["The words sit", "beside it."]
        size = 84
    face = serif_b(size)
    anchor = "ma" if h > w else "la"
    if question > 0:
        for i, line in enumerate(lines_q):
            text(d, (qx, qy + i * (size + 8)), line, face, WHITE, question, anchor=anchor)
    if answer > 0:
        for i, line in enumerate(lines_a):
            color = WHITE if i == 0 else (244, 214, 160)
            text(d, (qx, qy + i * (size + 8)), line, face, color, answer, anchor=anchor)
        underline = ease_out(prog(t, 3.4, 0.35))
        if underline > 0:
            if h > w:
                uw = face.getlength(lines_a[-1]) * 0.55
                d.line(
                    (qx - uw / 2, qy + size * 2 + 28, qx - uw / 2 + uw * underline, qy + size * 2 + 28),
                    fill=rgba(SAFFRON, underline),
                    width=6,
                )
            else:
                d.line(
                    (qx, qy + size * 2 + 24, qx + 180 * underline, qy + size * 2 + 24),
                    fill=rgba(SAFFRON, underline),
                    width=6,
                )
    return frame


def place_phone(base, screen, x, y, pw, ph):
    shadow = phone_shadow(pw, ph)
    base.alpha_composite(shadow, (int(x) - 70, int(y) - 50))
    device = build_phone(screen, pw, ph)
    base.alpha_composite(device, (int(x), int(y)))


def vertical_app(t):
    w, h = 1080, 1920
    frame = cream_bg(w, h).copy()
    d = ImageDraw.Draw(frame)
    idx = scene_index(t, V_SCENES, V_END)
    local = t - V_SCENES[idx]
    nxt = V_SCENES[idx + 1] if idx + 1 < len(V_SCENES) else V_END
    fade_in = ease_out(prog(local, 0.0, 0.4))
    fade_out = 1 - prog(t, nxt - 0.35, 0.35)
    alpha = fade_in * fade_out
    kickers = ["THE RECORDING", "BY DEITY", "EVERY SINGER", "THREE SCRIPTS"]
    headlines = [
        ["Play it.", "Read it beside it."],
        ["Find the deity", "first."],
        ["One prayer.", "Many voices."],
        ["Roman, Hindi,", "and English."],
    ]
    text(d, (w / 2, 150), kickers[idx], sans_b(26), SAFFRON, alpha, anchor="ma", spacing=3)
    for i, line in enumerate(headlines[idx]):
        text(d, (w / 2, 230 + i * 92), line, serif_b(78), NAVY, alpha, anchor="ma")
    u = clamp(local / 2.2)
    screen = SCREENS[idx](u)
    pw, ph = 640, 1280
    entrance = ease_out(prog(t, V_HOOK, 0.65))
    y = 860 - 300 * entrance
    place_phone(frame, screen, (w - pw) / 2, y, pw, ph)
    return frame


def wide_app(t):
    w, h = 1920, 1080
    frame = cream_bg(w, h).copy()
    d = ImageDraw.Draw(frame)
    idx = scene_index(t, W_SCENES, W_END)
    head_a = ease_out(prog(t, W_HOOK, 0.4))
    text(d, (120, 150), "EVERYTHING IN ONE LIBRARY", sans_b(22), SAFFRON, head_a, spacing=2.2)
    text(d, (120, 210), "Your satsang,", serif_b(78), NAVY, head_a)
    text(d, (120, 300), "sorted.", serif_b(78), (120, 72, 28), head_a)
    y = 460
    for i, (title, note) in enumerate(FEATURES):
        active = i == idx
        row_a = ease_out(prog(t, W_HOOK + 0.1 + i * 0.08, 0.3))
        if active:
            d.rounded_rectangle((100, y - 18, 860, y + 96), 28, fill=rgba(WHITE, row_a))
            d.ellipse((128, y + 8, 176, y + 56), fill=rgba(NAVY, row_a))
            text(d, (152, y + 32), str(i + 1), sans_b(22), WHITE, row_a, anchor="mm")
            text(d, (200, y + 18), title, sans_sb(28), NAVY, row_a)
            text(d, (200, y + 56), note, sans(20), MUTED, row_a)
            d.line((200, y + 92, 200 + 120 * row_a, y + 92), fill=rgba(SAFFRON, row_a), width=4)
            y += 130
        else:
            d.ellipse((128, y + 4, 168, y + 44), outline=rgba(SAND, row_a), width=2)
            text(d, (148, y + 24), str(i + 1), sans(18), MUTED, row_a, anchor="mm")
            text(d, (190, y + 24), title, sans(26), MUTED, row_a, anchor="lm")
            y += 72
    u = clamp((t - W_SCENES[idx]) / 2.0)
    screen = SCREENS[idx](u)
    pw, ph = 460, 940
    x = 1920 - pw - 120
    y = (1080 - ph) / 2 + 20
    y += (1 - ease_out(prog(t, W_HOOK, 0.6))) * 80
    place_phone(frame, screen, x, y, pw, ph)
    return frame


def end_card(t, w, h, end_start):
    u = t - end_start
    frame = vertical_gradient((32, 48, 74), (14, 22, 38), (w, h)).convert("RGBA")
    glow = Image.new("L", (w, h), 0)
    ImageDraw.Draw(glow).ellipse((w * 0.25, h * 0.18, w * 0.75, h * 0.62), fill=46)
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    tint = Image.new("RGBA", (w, h), (197, 138, 54, 255))
    frame = Image.composite(tint, frame, glow)
    d = ImageDraw.Draw(frame)
    pop = back_out(prog(u, 0.05, 0.55))
    size = int((150 if h > w else 120) * pop)
    if size > 4:
        lg = mark(size)
        frame.paste(lg, ((w - size) // 2, int((h * 0.22 if h > w else h * 0.16) + (1 - pop) * 40)), lg)
    name_y = int(h * 0.42 if h > w else h * 0.40)
    text(d, (w / 2, name_y), "Bhajan Library", serif_b(72 if h > w else 64), WHITE, ease_out(prog(u, 0.25, 0.35)), anchor="ma")
    lines = [("Play the recording.", WHITE), ("Read the words.", WHITE), ("Find the singer.", (244, 214, 160))]
    for i, (line, color) in enumerate(lines):
        yy = name_y + (110 if h > w else 80) + i * (64 if h > w else 0)
        if h > w:
            text(d, (w / 2, yy), line, sans(40), color, ease_out(prog(u, 0.45 + i * 0.12, 0.3)), anchor="ma")
        else:
            # one row on the wide card
            pass
    if h <= w:
        text(
            d,
            (w / 2, name_y + 90),
            "Play the recording.   Read the words.   Find the singer.",
            sans(32),
            (236, 228, 214),
            ease_out(prog(u, 0.45, 0.35)),
            anchor="ma",
        )
    btn_a = ease_out(prog(u, 0.9, 0.35))
    if btn_a > 0:
        bw, bh = (560, 84) if h > w else (420, 72)
        bx, by = w / 2, (h * 0.72 if h > w else h * 0.66)
        d.rounded_rectangle(
            (bx - bw / 2, by - bh / 2, bx + bw / 2, by + bh / 2), bh / 2, fill=rgba(WHITE, btn_a)
        )
        text(d, (bx, by), "Open the library", sans_b(32 if h > w else 26), NAVY, btn_a, anchor="mm")
    url_y = int(h * 0.84 if h > w else h * 0.80)
    text(d, (w / 2, url_y), "www.bhajanlibrary.com", sans_sb(36 if h > w else 30), WHITE, ease_out(prog(u, 1.15, 0.35)), anchor="ma")
    return frame


def circle_reveal(base, top, center, p):
    if p <= 0:
        return base
    if p >= 1:
        return top
    r = p * math.hypot(base.width, base.height)
    mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(mask).ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), fill=255)
    out = base.copy()
    out.paste(top, (0, 0), mask)
    return out


def render_vertical(t):
    if t < V_HOOK - 0.4:
        return hook_frame(t, 1080, 1920, V_HOOK)
    if t < V_HOOK + 0.25:
        p = ease_in_out(prog(t, V_HOOK - 0.4, 0.65))
        return circle_reveal(
            hook_frame(min(t, V_HOOK), 1080, 1920, V_HOOK),
            vertical_app(t),
            (540, 1200),
            p,
        )
    if t < V_END - 0.35:
        return vertical_app(t)
    if t < V_END + 0.35:
        p = ease_in_out(prog(t, V_END - 0.35, 0.7))
        return circle_reveal(vertical_app(min(t, V_END)), end_card(t, 1080, 1920, V_END), (540, 900), p)
    return end_card(t, 1080, 1920, V_END)


def render_wide(t):
    if t < W_HOOK - 0.4:
        return hook_frame(t, 1920, 1080, W_HOOK)
    if t < W_HOOK + 0.25:
        p = ease_in_out(prog(t, W_HOOK - 0.4, 0.65))
        return circle_reveal(
            hook_frame(min(t, W_HOOK), 1920, 1080, W_HOOK),
            wide_app(t),
            (1400, 540),
            p,
        )
    if t < W_END - 0.35:
        return wide_app(t)
    if t < W_END + 0.35:
        p = ease_in_out(prog(t, W_END - 0.35, 0.7))
        return circle_reveal(wide_app(min(t, W_END)), end_card(t, 1920, 1080, W_END), (960, 540), p)
    return end_card(t, 1920, 1080, W_END)


def soundtrack(path, duration, hook_end, hits, end_start):
    sr = 44100
    n = int(duration * sr)
    out = np.zeros((n, 2))
    bpm = 96
    beat = 60 / bpm
    bar = beat * 4

    def add(sig, start, gain=1.0, pan=0.0):
        i0 = int(start * sr)
        if i0 >= n or i0 < 0:
            return
        sig = np.asarray(sig[: n - i0], dtype=np.float64) * gain
        out[i0 : i0 + len(sig), 0] += sig * (1 - pan)
        out[i0 : i0 + len(sig), 1] += sig * (1 + pan)

    def note(freq, dur, attack=0.02, release=0.4, shape="pad"):
        tt = np.arange(int(dur * sr)) / sr
        if shape == "pluck":
            wave = np.sin(2 * np.pi * freq * tt) + 0.25 * np.sin(4 * np.pi * freq * tt)
            env = np.exp(-tt * 6.5)
        else:
            wave = sum(
                np.sin(2 * np.pi * freq * k * tt) / k for k in (1, 2, 3)
            )
            env = np.minimum(1, tt / attack) * np.clip((dur - tt) / release, 0, 1)
        return wave * env

    midi = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]
    roots = [48, 45, 41, 43]
    time, ci = 0.0, 0
    while time < duration:
        dur = bar * 2
        for m in chords[ci % 4]:
            add(note(midi(m), dur + 0.5, attack=0.45, release=0.8), time, 0.05, pan=(m % 5 - 2) * 0.12)
        ci += 1
        time += dur

    kick_t = np.arange(int(0.32 * sr)) / sr
    kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kick_t * 18)) * kick_t) * np.exp(-kick_t * 8)
    rng = np.random.default_rng(4)
    hat = np.diff(rng.standard_normal(int(0.05 * sr) + 1), prepend=0)
    hat = hat * np.exp(-np.arange(len(hat)) / sr * 55)

    b = hook_end - 0.15
    step = 0
    while b < end_start + 1.6:
        add(kick, b, 0.42)
        add(hat, b + beat / 2, 0.045, pan=0.25)
        chord = chords[int((b // (bar * 2)) % 4)]
        add(note(midi(chord[step % 4] + 12), 0.4, shape="pluck"), b, 0.06, pan=0.2 if step % 2 else -0.2)
        add(note(midi(roots[int((b // (bar * 2)) % 4)]), beat * 0.8, attack=0.01, release=0.18), b, 0.08)
        b += beat
        step += 1

    for at in hits:
        length = int(0.5 * sr)
        noise = np.convolve(rng.standard_normal(length), np.ones(16) / 16, mode="same")
        add(noise * np.sin(np.linspace(0, np.pi, length)) ** 2, at, 0.22)

    tt = np.arange(int(2.2 * sr)) / sr
    ding = (np.sin(2 * np.pi * 880 * tt) + 0.4 * np.sin(2 * np.pi * 1318 * tt)) * np.exp(-tt * 2.4)
    add(ding, end_start + 0.15, 0.1)

    fade = np.ones(n)
    fade[: int(0.35 * sr)] = np.linspace(0, 1, int(0.35 * sr))
    fade[-int(1.2 * sr) :] = np.linspace(1, 0, int(1.2 * sr))
    out *= fade[:, None]
    peak = np.max(np.abs(out)) or 1
    out = out / peak * 0.85
    import wave

    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes((out * 32767).astype(np.int16).tobytes())


def encode(frames_dir, audio, dest, duration):
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y",
            "-framerate", str(FPS), "-i", str(frames_dir / "%04d.jpg"),
            "-i", str(audio),
            "-t", str(duration),
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            str(dest),
        ],
        check=True,
    )


def render_film(name, duration, draw, audio_args):
    frames = OUT / f"_frames-{name}"
    frames.mkdir(exist_ok=True)
    total = int(duration * FPS)
    for f in range(total):
        path = frames / f"{f:04d}.jpg"
        draw(f / FPS).convert("RGB").save(path, quality=90)
        if f % 60 == 0:
            print(f"{name} {f}/{total}", flush=True)
    audio = OUT / f"_audio-{name}.wav"
    soundtrack(audio, *audio_args)
    dest = OUT / ("bhajan-library-tiktok.mp4" if name == "9x16" else "bhajan-library-wide.mp4")
    encode(frames, audio, dest, duration)
    print("wrote", dest, dest.stat().st_size)


def preview():
    shots = OUT / "_preview"
    shots.mkdir(exist_ok=True)
    for t in (1.2, 3.6, 6.5, 8.2, 11.2, 15.2, 19.0, 23.2):
        render_vertical(t).convert("RGB").save(shots / f"v-{t}.jpg", quality=85)
        print("v", t, flush=True)
    for t in (1.2, 3.4, 6.4, 11.0, 15.0, 21.2):
        render_wide(t).convert("RGB").save(shots / f"w-{t}.jpg", quality=85)
        print("w", t, flush=True)


if __name__ == "__main__":
    if "--preview" in sys.argv:
        preview()
    else:
        render_film(
            "9x16",
            V_DUR,
            render_vertical,
            (V_DUR, V_HOOK, [V_HOOK - 0.3, 10.0 - 0.25, 14.2 - 0.25, 18.0 - 0.25, V_END - 0.3], V_END),
        )
        render_film(
            "wide",
            W_DUR,
            render_wide,
            (W_DUR, W_HOOK, [W_HOOK - 0.3, 9.2 - 0.25, 13.0 - 0.25, 16.6 - 0.25, W_END - 0.3], W_END),
        )
