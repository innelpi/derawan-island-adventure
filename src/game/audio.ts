// Lightweight Web Audio SFX engine — no assets, generated on the fly.
// Anak-friendly chiptune-style blips.

let ctx: AudioContext | null = null;
let muted = false;
let masterGain: GainNode | null = null;
let sfxVol = 0.6; // user-controlled 0..1

function applyMaster() {
  if (masterGain) masterGain.gain.value = muted ? 0 : 0.35 * sfxVol * 2; // baseline 0.35*sfx
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      applyMaster();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume().catch(() => {});
}

export function setMuted(m: boolean) {
  muted = m;
  applyMaster();
}

export function setSfxVolume(v: number) {
  sfxVol = Math.max(0, Math.min(1, v));
  applyMaster();
}

export function isMuted() {
  return muted;
}

interface ToneOpts {
  freq: number;
  freqEnd?: number;
  dur: number;
  type?: OscillatorType;
  vol?: number;
  delay?: number;
}

function tone({ freq, freqEnd, dur, type = "square", vol = 0.3, delay = 0 }: ToneOpts) {
  const c = getCtx();
  if (!c || muted || !masterGain) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), t0 + dur);
  }
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur: number, vol = 0.25) {
  const c = getCtx();
  if (!c || muted || !masterGain) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = vol;
  const filt = c.createBiquadFilter();
  filt.type = "highpass";
  filt.frequency.value = 800;
  src.connect(filt).connect(g).connect(masterGain);
  src.start();
}

export const SFX = {
  attack() {
    tone({ freq: 520, freqEnd: 220, dur: 0.08, type: "square", vol: 0.18 });
  },
  hit() {
    noise(0.1, 0.15);
    tone({ freq: 180, freqEnd: 80, dur: 0.1, type: "sawtooth", vol: 0.18 });
  },
  enemyDie() {
    tone({ freq: 400, freqEnd: 120, dur: 0.18, type: "triangle", vol: 0.22 });
    tone({ freq: 600, freqEnd: 200, dur: 0.2, type: "square", vol: 0.12, delay: 0.04 });
  },
  heroHurt() {
    tone({ freq: 320, freqEnd: 90, dur: 0.25, type: "sawtooth", vol: 0.28 });
  },
  special() {
    tone({ freq: 300, freqEnd: 900, dur: 0.25, type: "square", vol: 0.22 });
    tone({ freq: 500, freqEnd: 1200, dur: 0.3, type: "triangle", vol: 0.18, delay: 0.08 });
  },
  bossIntro() {
    tone({ freq: 110, freqEnd: 60, dur: 0.6, type: "sawtooth", vol: 0.3 });
    tone({ freq: 80, freqEnd: 50, dur: 0.7, type: "square", vol: 0.25, delay: 0.15 });
  },
  bossShoot() {
    tone({ freq: 220, freqEnd: 120, dur: 0.12, type: "square", vol: 0.18 });
  },
  waveClear() {
    [523, 659, 784].forEach((f, i) =>
      tone({ freq: f, dur: 0.15, type: "square", vol: 0.22, delay: i * 0.08 }),
    );
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) =>
      tone({ freq: f, dur: 0.2, type: "triangle", vol: 0.3, delay: i * 0.12 }),
    );
  },
  lose() {
    [392, 311, 247, 196].forEach((f, i) =>
      tone({ freq: f, dur: 0.25, type: "sawtooth", vol: 0.25, delay: i * 0.15 }),
    );
  },
  click() {
    tone({ freq: 800, dur: 0.05, type: "square", vol: 0.15 });
  },
  pickup() {
    tone({ freq: 800, freqEnd: 1400, dur: 0.1, type: "triangle", vol: 0.2 });
  },
  correct() {
    [659, 784, 1046, 1318].forEach((f, i) =>
      tone({ freq: f, dur: 0.12, type: "triangle", vol: 0.28, delay: i * 0.07 }),
    );
  },
  wrong() {
    tone({ freq: 220, freqEnd: 110, dur: 0.3, type: "sawtooth", vol: 0.25 });
    tone({ freq: 180, freqEnd: 90, dur: 0.35, type: "square", vol: 0.18, delay: 0.1 });
  },
  hpUp() {
    [523, 659, 880, 1175].forEach((f, i) =>
      tone({ freq: f, dur: 0.1, type: "triangle", vol: 0.3, delay: i * 0.06 }),
    );
  },
};
