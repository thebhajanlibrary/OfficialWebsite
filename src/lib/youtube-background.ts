import { prepareUnlockableMedia } from "@/lib/ios-playback";

/**
 * Same-origin looping audio + AudioContext, started on the play tap.
 * That is what lets iOS keep Safari alive after lock / leaving the app,
 * so the YouTube iframe can be told to keep playing.
 */
let audio: HTMLAudioElement | null = null;
let blobUrl: string | null = null;
let ctx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let gain: GainNode | null = null;
let armed = false;

function quietLoopUrl(): string {
  if (blobUrl) return blobUrl;
  const sampleRate = 44100;
  const seconds = 2;
  const samples = sampleRate * seconds;
  const bytes = 44 + samples * 2;
  const buffer = new ArrayBuffer(bytes);
  const view = new DataView(buffer);
  const write = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, bytes - 8, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples * 2, true);
  // Sub-audible 18 Hz tone so iOS does not treat it as digital silence
  for (let i = 0; i < samples; i++) {
    const n = Math.sin((2 * Math.PI * 18 * i) / sampleRate) * 40;
    view.setInt16(44 + i * 2, n, true);
  }
  blobUrl = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  return blobUrl;
}

function ensureAudio(): HTMLAudioElement {
  if (audio) return audio;
  const el = new Audio();
  prepareUnlockableMedia(el);
  el.loop = true;
  el.preload = "auto";
  el.volume = 1;
  el.src = quietLoopUrl();
  el.setAttribute("aria-hidden", "true");
  audio = el;
  return el;
}

function ensureContext() {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  if (!osc && ctx) {
    gain = ctx.createGain();
    gain.gain.value = 0.0008;
    osc = ctx.createOscillator();
    osc.frequency.value = 18;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
  }
}

/** Call from the same tap that starts YouTube. */
export function armYoutubeBackground(): void {
  if (typeof window === "undefined") return;
  armed = true;
  const el = ensureAudio();
  void el.play().catch(() => undefined);
  try {
    ensureContext();
  } catch {
    // ignore
  }
}

export function resumeYoutubeBackground(): void {
  if (!armed) return;
  const el = ensureAudio();
  if (el.paused) void el.play().catch(() => undefined);
  if (ctx?.state === "suspended") void ctx.resume().catch(() => undefined);
}

export function pauseYoutubeBackground(): void {
  audio?.pause();
  void ctx?.suspend().catch(() => undefined);
}

export function releaseYoutubeBackground(): void {
  armed = false;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  try {
    osc?.stop();
  } catch {
    // already stopped
  }
  osc = null;
  gain?.disconnect();
  gain = null;
  void ctx?.suspend().catch(() => undefined);
}

export function youtubeBackgroundArmed(): boolean {
  return armed;
}
