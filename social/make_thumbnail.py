"""Posters that say what Bhajan Library is.

Vertical is the TikTok cover. Wide is the landscape thumbnail.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_promo import NAVY, SAFFRON, WHITE, mark, sans, sans_b, sans_sb, serif_b  # noqa: E402

OUT = Path(__file__).resolve().parent
IVORY = (248, 245, 239)
CREAM = (255, 253, 249)
MUTED = (92, 86, 76)
SAND = (231, 222, 208)

POINTS = [
    ("01", "Play the recording"),
    ("02", "Read Roman, Hindi, and English"),
    ("03", "Browse by deity, occasion, or singer"),
]


def poster(w, h, vertical):
    img = Image.new("RGB", (w, h), IVORY)
    d = ImageDraw.Draw(img, "RGBA")
    d.rectangle((0, 0, w, 18 if vertical else 12), fill=SAFFRON)
    if vertical:
        cx = w / 2
        lg = mark(156)
        img.paste(lg, (int(cx - 78), 250), lg)
        title = serif_b(72)
        d.text((cx, 470), "Bhajan Library", font=title, fill=NAVY, anchor="ma")
        title_box = d.textbbox((cx, 470), "Bhajan Library", font=title, anchor="ma")
        kicker = sans_b(26)
        kicker_y = title_box[3] + 36
        d.text((cx, kicker_y), "A LIBRARY FOR SATSANG", font=kicker, fill=SAFFRON, anchor="ma")
        kicker_box = d.textbbox((cx, kicker_y), "A LIBRARY FOR SATSANG", font=kicker, anchor="ma")
        rule = kicker_box[3] + 28
        d.line((cx - 72, rule, cx + 72, rule), fill=SAFFRON, width=4)
        d.text((cx, rule + 90), "Lyrics beside", font=serif_b(84), fill=NAVY, anchor="ma")
        d.text((cx, rule + 190), "the recording.", font=serif_b(84), fill=NAVY, anchor="ma")
        y = 1020
        for num, line in POINTS:
            d.rounded_rectangle((120, y, w - 120, y + 130), 28, fill=CREAM, outline=SAND, width=2)
            d.text((168, y + 65), num, font=serif_b(36), fill=SAFFRON, anchor="lm")
            d.text((260, y + 65), line, font=sans_sb(32), fill=NAVY, anchor="lm")
            y += 154
        d.text((cx, 1620), "www.bhajanlibrary.com", font=sans_b(32), fill=MUTED, anchor="ma")
    else:
        lg = mark(104)
        img.paste(lg, (64, 48), lg)
        title = serif_b(48)
        d.text((196, 78), "Bhajan Library", font=title, fill=NAVY, anchor="lm")
        title_box = d.textbbox((196, 78), "Bhajan Library", font=title, anchor="lm")
        kicker = sans_b(20)
        kicker_y = max(title_box[3] + 20, 48 + 104 + 18)
        d.text((196, kicker_y), "A LIBRARY FOR SATSANG", font=kicker, fill=SAFFRON, anchor="lt")
        d.text((72, 300), "Lyrics beside", font=serif_b(68), fill=NAVY, anchor="lm")
        d.text((72, 384), "the recording.", font=serif_b(68), fill=NAVY, anchor="lm")
        d.text((72, 470), "Play it, read the words, and find the singer.", font=sans(26), fill=MUTED, anchor="lm")
        wide_points = [
            ("01", "Play the recording"),
            ("02", "Roman, Hindi, English"),
            ("03", "Deity, occasion, singer"),
        ]
        y = 210
        for num, line in wide_points:
            d.rounded_rectangle((700, y, w - 48, y + 120), 24, fill=CREAM, outline=SAND, width=2)
            d.text((736, y + 60), num, font=serif_b(32), fill=SAFFRON, anchor="lm")
            d.text((820, y + 60), line, font=sans_sb(28), fill=NAVY, anchor="lm")
            y += 140
        d.text((72, h - 48), "www.bhajanlibrary.com", font=sans_b(24), fill=NAVY, anchor="lm")
    return img.convert("RGB")


def square():
    w = h = 1080
    img = Image.new("RGB", (w, h), IVORY)
    d = ImageDraw.Draw(img, "RGBA")
    d.rectangle((0, 0, w, 14), fill=SAFFRON)
    cx = w / 2
    lg = mark(120)
    img.paste(lg, (int(cx - 60), 48), lg)
    title = serif_b(60)
    d.text((cx, 210), "Bhajan Library", font=title, fill=NAVY, anchor="ma")
    title_box = d.textbbox((cx, 210), "Bhajan Library", font=title, anchor="ma")
    kicker = sans_b(22)
    kicker_y = title_box[3] + 28
    d.text((cx, kicker_y), "A LIBRARY FOR SATSANG", font=kicker, fill=SAFFRON, anchor="ma")
    kicker_box = d.textbbox((cx, kicker_y), "A LIBRARY FOR SATSANG", font=kicker, anchor="ma")
    rule = kicker_box[3] + 22
    d.line((cx - 64, rule, cx + 64, rule), fill=SAFFRON, width=4)
    head = serif_b(64)
    d.text((cx, rule + 56), "Lyrics beside", font=head, fill=NAVY, anchor="ma")
    first = d.textbbox((cx, rule + 56), "Lyrics beside", font=head, anchor="ma")
    d.text((cx, first[3] + 18), "the recording.", font=head, fill=NAVY, anchor="ma")
    second = d.textbbox((cx, first[3] + 18), "the recording.", font=head, anchor="ma")
    y = second[3] + 36
    for num, line in POINTS:
        d.rounded_rectangle((72, y, w - 72, y + 100), 24, fill=CREAM, outline=SAND, width=2)
        d.text((108, y + 50), num, font=serif_b(30), fill=SAFFRON, anchor="lm")
        d.text((188, y + 50), line, font=sans_sb(28), fill=NAVY, anchor="lm")
        y += 116
    d.text((cx, h - 46), "www.bhajanlibrary.com", font=sans_b(26), fill=NAVY, anchor="mm")
    return img.convert("RGB")


def main():
    vertical = OUT / "bhajan-library-tiktok-cover.jpg"
    wide = OUT / "bhajan-library-thumbnail.jpg"
    post = OUT / "bhajan-library-poster.jpg"
    poster(1080, 1920, True).save(vertical, quality=95)
    poster(1280, 720, False).save(wide, quality=95)
    square().save(post, quality=95)
    print(post)


if __name__ == "__main__":
    main()
