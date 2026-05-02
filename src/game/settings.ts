// User settings persisted to localStorage
export interface UserSettings {
  playerName: string;
  musicVolume: number; // 0..1
  sfxVolume: number; // 0..1
  muted: boolean;
  stage2Unlocked: boolean;
  stage3Unlocked: boolean;
}

const KEY = "derawan-hero:settings";

const DEFAULTS: UserSettings = {
  playerName: "Pahlawan",
  musicVolume: 0.5,
  sfxVolume: 0.6,
  muted: false,
  stage2Unlocked: false,
  stage3Unlocked: false,
};

let cache: UserSettings | null = null;

export function loadSettings(): UserSettings {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      cache = { ...DEFAULTS, ...JSON.parse(raw) };
      return cache!;
    }
  } catch {}
  cache = { ...DEFAULTS };
  return cache;
}

export function saveSettings(patch: Partial<UserSettings>) {
  const next = { ...loadSettings(), ...patch };
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function unlockStage2() {
  saveSettings({ stage2Unlocked: true });
}

export function unlockStage3() {
  saveSettings({ stage3Unlocked: true });
}
