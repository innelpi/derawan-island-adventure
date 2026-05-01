// Procedural background music — loops chiptune notes via Web Audio.
// Three moods: "menu" (gentle), "beach" (cheerful tropical), "ocean" (mysterious underwater).
// Volume controlled by settings (music slider) + global mute.

type Mood = "menu" | "beach" | "ocean" | "off";

interface NoteStep {
  freq: number;       // Hz, 0 = rest
  dur: number;        // beats
  type?: OscillatorType;
  vol?: number;
}

// Pentatonic / major patterns — friendly, cartoony.
const MELODIES: Record<Exclude<Mood, "off">, NoteStep[]> = {
  // Soft dreamy menu — slow major triad arpeggio
  menu: [
    { freq: 523, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 659, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 784, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 988, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 784, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 659, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 587, dur: 1, type: "triangle", vol: 0.55 },
    { freq: 0,   dur: 1 },
  ],
  // Bouncy ukulele-like loop for the beach
  beach: [
    { freq: 523, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 659, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 784, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 880, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 784, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 698, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 659, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 587, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 523, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 659, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 587, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 523, dur: 0.5, type: "square", vol: 0.5 },
    { freq: 0,   dur: 1 },
  ],
  // Ambient underwater — slow sine arpeggio in minor
  ocean: [
    { freq: 392, dur: 1.5, type: "sine", vol: 0.6 },
    { freq: 466, dur: 1.5, type: "sine", vol: 0.6 },
    { freq: 587, dur: 1.5, type: "sine", vol: 0.6 },
    { freq: 698, dur: 1.5, type: "sine", vol: 0.5 },
    { freq: 587, dur: 1.5, type: "sine", vol: 0.6 },
    { freq: 466, dur: 1.5, type: "sine", vol: 0.6 },
    { freq: 0,   dur: 1.5 },
  ],
};

const BPM: Record<Exclude<Mood, "off">, number> = {
  menu: 70,
  beach: 132,
  ocean: 56,
};

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let mood: Mood = "off";
let muted = false;
let musicVol = 0.5; // 0..1
let timerId: number | null = null;
let currentMelodyTimers: number[] = [];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      applyGain();
    } catch {
      return null;
    }
  }
  return ctx;
}

function applyGain() {
  if (!masterGain) return;
  // Music sits beneath SFX — keep multiplier modest
  masterGain.gain.value = muted ? 0 : 0.18 * musicVol;
}

function clearTimers() {
  if (timerId !== null) {
    window.clearTimeout(timerId);
    timerId = null;
  }
  for (const id of currentMelodyTimers) window.clearTimeout(id);
  currentMelodyTimers = [];
}

function playNote(step: NoteStep, secPerBeat: number) {
  if (!ctx || !masterGain || step.freq === 0) return;
  const t0 = ctx.currentTime;
  const dur = step.dur * secPerBeat * 0.95;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = step.type ?? "triangle";
  osc.frequency.value = step.freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(step.vol ?? 0.4, t0 + 0.04);
  g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function scheduleLoop(currentMood: Exclude<Mood, "off">) {
  const c = getCtx();
  if (!c) return;
  const melody = MELODIES[currentMood];
  const bpm = BPM[currentMood];
  const secPerBeat = 60 / bpm;

  let elapsedMs = 0;
  for (const step of melody) {
    const ms = elapsedMs;
    const id = window.setTimeout(() => {
      if (mood !== currentMood) return;
      playNote(step, secPerBeat);
    }, ms);
    currentMelodyTimers.push(id);
    elapsedMs += step.dur * secPerBeat * 1000;
  }
  // Schedule next loop
  timerId = window.setTimeout(() => {
    if (mood === currentMood) scheduleLoop(currentMood);
  }, elapsedMs);
}

export function playMusic(next: Mood) {
  if (next === mood) return;
  mood = next;
  clearTimers();
  if (next === "off") return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  scheduleLoop(next);
}

export function stopMusic() {
  playMusic("off");
}

export function setMusicMuted(m: boolean) {
  muted = m;
  applyGain();
}

export function setMusicVolume(v: number) {
  musicVol = Math.max(0, Math.min(1, v));
  applyGain();
}
