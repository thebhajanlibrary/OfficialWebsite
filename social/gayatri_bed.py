"""Original Gayatri-style instrumental: one flute line over a tanpura drone."""

import math
import subprocess
from pathlib import Path

import numpy as np

SR = 44100
SECONDS = 16
SA = 293.66  # D4

OUT_WAV = Path(__file__).with_name("gayatri-instrumental.wav")
VIDEO = Path(__file__).with_name("bhajan-library-tiktok.mp4")
TMP = Path(__file__).with_name("_with-gayatri.mp4")


def ratio(steps: int) -> float:
    return 2 ** (steps / 12)


# Four phrases, one breath each. Pitches are intervals above Sa.
PHRASES = [
    [(0.70, 0, 0.62), (1.40, 4, 0.50), (1.98, 7, 0.85), (2.95, 5, 0.42), (3.45, 4, 0.42), (3.95, 0, 0.85)],
    [(5.15, 4, 0.42), (5.65, 7, 0.48), (6.22, 12, 0.95), (7.30, 11, 0.48), (7.86, 7, 0.55), (8.50, 5, 0.70)],
    [(9.55, 7, 0.40), (10.05, 9, 0.40), (10.52, 12, 1.05), (11.70, 7, 0.50), (12.28, 4, 0.70)],
    [(13.35, 5, 0.38), (13.80, 4, 0.36), (14.22, 2, 0.40), (14.70, 0, 1.15)],
]


def lowpass(x: np.ndarray, coeff: float) -> np.ndarray:
    y = np.empty_like(x)
    state = 0.0
    for i, sample in enumerate(x):
        state += coeff * (sample - state)
        y[i] = state
    return y


def flute(n: int) -> np.ndarray:
    freq = np.full(n, SA, dtype=np.float64)
    amp = np.zeros(n, dtype=np.float64)
    glide = int(0.07 * SR)
    for phrase in PHRASES:
        for start_s, steps, dur in phrase:
            start = int(start_s * SR)
            length = int(dur * SR)
            end = min(n, start + length)
            if start >= n:
                continue
            target = SA * ratio(steps)
            glide_n = min(glide, end - start)
            freq[start : start + glide_n] = np.linspace(freq[start - 1] if start else target, target, glide_n)
            freq[start + glide_n : end] = target
            env = np.ones(end - start)
            attack = min(int(0.06 * SR), len(env) // 3)
            release = min(int(0.14 * SR), len(env) // 3)
            env[:attack] = np.linspace(0, 1, attack)
            env[-release:] = np.linspace(env[-release], 0, release)
            amp[start:end] = np.maximum(amp[start:end], env)

    t = np.arange(n) / SR
    vibrato = np.sin(2 * math.pi * 5.1 * t) * (0.006 * freq) * np.minimum(t / 0.25, 1.0)
    phase = 2 * math.pi * np.cumsum(freq + vibrato) / SR
    tone = np.sin(phase) + 0.22 * np.sin(2 * phase) + 0.06 * np.sin(3 * phase)
    rng = np.random.default_rng(11)
    breath = lowpass(rng.standard_normal(n), 0.08)
    return (tone + breath * 0.035) * amp


def tanpura(n: int) -> np.ndarray:
    t = np.arange(n) / SR
    # Sa, Pa, high Sa, Sa — slightly detuned, plucked in a slow cycle.
    strings = [SA / 2, SA / 2 * ratio(7), SA, SA / 2 * 1.003]
    out = np.zeros(n)
    cycle = int(0.85 * SR)
    for s, base in enumerate(strings):
        offset = int(s * 0.21 * SR)
        pos = offset
        while pos < n:
            length = min(int(1.6 * SR), n - pos)
            tt = np.arange(length) / SR
            body = np.zeros(length)
            for h in range(1, 7):
                body += (1 / h) * np.sin(2 * math.pi * base * h * tt * (1 + 0.0004 * h))
            body *= np.exp(-tt / 0.55)
            out[pos : pos + length] += body * 0.22
            pos += cycle
    return out


def reverb(x: np.ndarray) -> np.ndarray:
    y = np.zeros(len(x) + SR)
    y[: len(x)] += x
    for delay_s, gain in ((0.037, 0.28), (0.061, 0.2), (0.089, 0.14), (0.13, 0.08)):
        d = int(delay_s * SR)
        y[d : d + len(x)] += x * gain
    return y[: len(x)]


def render() -> np.ndarray:
    n = int(SECONDS * SR)
    bed = tanpura(n) * 0.55
    lead = flute(n) * 0.85
    mix = reverb(bed * 0.42 + lead)
    fade = int(0.35 * SR)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-int(0.8 * SR) :] *= np.linspace(1, 0, int(0.8 * SR))
    peak = np.max(np.abs(mix)) or 1
    return mix / peak * 0.9


def write_wav(path: Path, audio: np.ndarray) -> None:
    import wave

    pcm = np.clip(audio * 32767, -32767, 32767).astype(np.int16)
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(pcm.tobytes())


def mux(wav: Path) -> None:
    subprocess.check_call(
        [
            "ffmpeg", "-y",
            "-i", str(VIDEO),
            "-i", str(wav),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart", "-shortest",
            str(TMP),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    TMP.replace(VIDEO)


if __name__ == "__main__":
    wav = OUT_WAV
    write_wav(wav, render())
    mux(wav)
    print("wrote", VIDEO, VIDEO.stat().st_size)
