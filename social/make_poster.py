"""The navy Bhajan Library poster, as a 1080 square image."""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_promo import mark  # noqa: E402

OUT = Path(__file__).resolve().parent / "bhajan-library-poster.jpg"
SIZE = 1080
S = SIZE / 1000

NAVY = (19, 32, 51)
NAVY_MID = (28, 44, 68)
NAVY_DEEP = (36, 52, 76)
SAFFRON = (196, 120, 26)
IVORY = (247, 249, 252)
CREAM = (243, 230, 207)
MUTED = (213, 222, 234)
LINE = (61, 79, 104)


def font(name, size):
    return ImageFont.truetype(f"C:/Windows/Fonts/{name}", int(size * S))


def xy(x, y):
    return x * S, y * S


def main():
    img = Image.new("RGB", (SIZE, SIZE), NAVY)
    d = ImageDraw.Draw(img)

    def circle(cx, cy, r, fill=None, outline=None, width=3):
        box = ((cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S)
        d.ellipse(box, fill=fill, outline=outline, width=max(1, int(width * S)))

    circle(820, 170, 210, NAVY_MID)
    circle(820, 170, 150, NAVY_MID)
    for r in (188, 128, 72):
        circle(820, 170, r, outline=SAFFRON)
    logo = mark(int(112 * S))
    img.paste(logo, (int((820 - 56) * S), int((170 - 56) * S)), logo)
    for cx, cy, r in (
        (820, -18, 8),
        (1008, 170, 8),
        (820, 358, 8),
        (632, 170, 8),
        (953, 37, 6),
        (953, 303, 6),
        (687, 37, 6),
        (687, 303, 6),
    ):
        circle(cx, cy, r, SAFFRON)
    circle(80, 880, 180, NAVY_DEEP)
    circle(0, 1000, 120, NAVY_DEEP)

    serif = "georgia.ttf"
    sans = "segoeui.ttf"
    d.text(xy(48, 240), "Bhajan", font=font(serif, 84), fill=IVORY, anchor="ls")
    d.text(xy(48, 332), "Library", font=font(serif, 84), fill=IVORY, anchor="ls")
    d.rounded_rectangle((52 * S, 364 * S, 124 * S, 370 * S), int(3 * S), fill=SAFFRON)
    d.text(xy(48, 430), "Find bhajans for satsang", font=font(serif, 32), fill=CREAM, anchor="ls")
    d.text(xy(48, 476), "by deity, occasion, or lyric.", font=font(serif, 32), fill=CREAM, anchor="ls")
    d.line((*xy(48, 550), *xy(480, 550)), fill=LINE, width=max(1, int(2 * S)))
    d.text(xy(48, 640), "Play", font=font(serif, 40), fill=IVORY, anchor="ls")
    d.text(xy(48, 684), "the recording", font=font(sans, 24), fill=MUTED, anchor="ls")
    d.text(xy(380, 640), "Read", font=font(serif, 40), fill=IVORY, anchor="ls")
    d.text(xy(380, 684), "Roman, Hindi, English", font=font(sans, 24), fill=MUTED, anchor="ls")
    d.text(xy(48, 800), "Browse", font=font(serif, 40), fill=IVORY, anchor="ls")
    d.text(xy(48, 848), "deity, occasion, artist, or folder", font=font(sans, 24), fill=MUTED, anchor="ls")
    d.text(xy(48, 928), "New songs join the same shelves.", font=font(serif, 28), fill=CREAM, anchor="ls")

    img.save(OUT, quality=95)
    print(OUT)


if __name__ == "__main__":
    main()
