// Game logic types & constants for Stage 1: Pantai Derawan, Stage 2: Karang Derawan

export type GameScene =
  | "title"
  | "stageSelect"
  | "settings"
  | "cutscene"
  | "playing"
  | "win"
  | "gameover";

export type StageId = 1 | 2 | 3;

export type EnemyKind = "goblin" | "beast" | "ghostnet" | "oilslick" | "microplastic" | "darkjelly";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Enemy {
  id: number;
  kind: EnemyKind;
  pos: Vec2;
  hp: number;
  maxHp: number;
  speed: number;
  facing: 1 | -1;
  hurtTimer: number;
  size: number;
}

export interface Projectile {
  id: number;
  pos: Vec2;
  vel: Vec2;
  life: number;
}

export interface Boss {
  pos: Vec2;
  hp: number;
  maxHp: number;
  hurtTimer: number;
  attackCooldown: number;
  active: boolean;
  defeated: boolean;
  introTimer: number;
}

export interface Hero {
  pos: Vec2;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  invincible: number;
  attackTimer: number;
  walkAnim: number;
}

export interface GameState {
  stage: StageId;
  hero: Hero;
  enemies: Enemy[];
  projectiles: Projectile[];
  boss: Boss;
  pollution: number;
  wave: number;
  waveTimer: number;
  spawnedThisWave: number;
  enemiesNeededThisWave: number;
  special: number;
  shake: number;
  ended: "win" | "lose" | null;
  particles: Particle[];
  nextEntityId: number;
  time: number;
  events: GameEvent[];
  lastClearedWave: number;
  bossIntroShown: boolean;
}

export type GameEvent =
  | "attack"
  | "hit"
  | "enemyDie"
  | "heroHurt"
  | "special"
  | "bossIntro"
  | "bossShoot"
  | "waveClear"
  | "win"
  | "lose";

export interface Particle {
  pos: Vec2;
  vel: Vec2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const ARENA_W = 480;
export const ARENA_H = 270;

export const HERO_SPEED = 90;
export const HERO_ATTACK_RANGE = 36;
export const HERO_ATTACK_COOLDOWN = 0.35;
export const HERO_INVINCIBLE_TIME = 1.0;

export const HERO_MAX_HP_CAP = 6; // batas kenaikan HP via kuis

export const GOBLIN_HP = 1;
export const GOBLIN_SPEED = 28;
export const BEAST_HP = 2;
export const BEAST_SPEED = 22;

// Stage 2 enemies
export const GHOSTNET_HP = 1;
export const GHOSTNET_SPEED = 32;
export const OILSLICK_HP = 2;
export const OILSLICK_SPEED = 18;

export const BOSS_HP = 8;
export const BOSS_PROJECTILE_SPEED = 55;
export const BOSS_ATTACK_INTERVAL = 2.6;

// Stage 2 boss (Net Master) — sedikit lebih kuat tapi tetap ramah anak
export const BOSS2_HP = 10;
export const BOSS2_PROJECTILE_SPEED = 65;
export const BOSS2_ATTACK_INTERVAL = 2.4;

// Stage 3 boss (Plastic Tyrant) — final boss, lebih sulit
export const BOSS3_HP = 14;
export const BOSS3_PROJECTILE_SPEED = 75;
export const BOSS3_ATTACK_INTERVAL = 2.0;

// Stage 3 enemies
export const MICROPLASTIC_HP = 1;
export const MICROPLASTIC_SPEED = 38;
export const DARKJELLY_HP = 3;
export const DARKJELLY_SPEED = 20;

export const POLLUTION_PER_ENEMY_PER_SEC = 1.6;
export const WAVE_COUNT = 3;

export interface StageConfig {
  bossHp: number;
  bossInterval: number;
  bossProjectileSpeed: number;
  bossName: string;
  enemyKinds: { wave: number; pool: { kind: EnemyKind; weight: number }[] }[];
}

export const STAGE_CONFIGS: Record<StageId, StageConfig> = {
  1: {
    bossHp: BOSS_HP,
    bossInterval: BOSS_ATTACK_INTERVAL,
    bossProjectileSpeed: BOSS_PROJECTILE_SPEED,
    bossName: "LITTER KING",
    enemyKinds: [
      { wave: 1, pool: [{ kind: "goblin", weight: 0.85 }, { kind: "beast", weight: 0.15 }] },
      { wave: 2, pool: [{ kind: "goblin", weight: 0.6 }, { kind: "beast", weight: 0.4 }] },
      { wave: 3, pool: [{ kind: "goblin", weight: 0.45 }, { kind: "beast", weight: 0.55 }] },
    ],
  },
  2: {
    bossHp: BOSS2_HP,
    bossInterval: BOSS2_ATTACK_INTERVAL,
    bossProjectileSpeed: BOSS2_PROJECTILE_SPEED,
    bossName: "NET MASTER",
    enemyKinds: [
      { wave: 1, pool: [{ kind: "ghostnet", weight: 0.8 }, { kind: "oilslick", weight: 0.2 }] },
      { wave: 2, pool: [{ kind: "ghostnet", weight: 0.55 }, { kind: "oilslick", weight: 0.45 }] },
      { wave: 3, pool: [{ kind: "ghostnet", weight: 0.4 }, { kind: "oilslick", weight: 0.6 }] },
    ],
  },
  3: {
    bossHp: BOSS3_HP,
    bossInterval: BOSS3_ATTACK_INTERVAL,
    bossProjectileSpeed: BOSS3_PROJECTILE_SPEED,
    bossName: "PLASTIC TYRANT",
    enemyKinds: [
      { wave: 1, pool: [{ kind: "microplastic", weight: 0.8 }, { kind: "darkjelly", weight: 0.2 }] },
      { wave: 2, pool: [{ kind: "microplastic", weight: 0.55 }, { kind: "darkjelly", weight: 0.45 }] },
      { wave: 3, pool: [{ kind: "microplastic", weight: 0.4 }, { kind: "darkjelly", weight: 0.6 }] },
    ],
  },
};

export function makeInitialState(stage: StageId = 1): GameState {
  const cfg = STAGE_CONFIGS[stage];
  return {
    stage,
    hero: {
      pos: { x: ARENA_W / 2, y: ARENA_H / 2 + 40 },
      hp: 3,
      maxHp: 3,
      facing: 1,
      invincible: 0,
      attackTimer: 0,
      walkAnim: 0,
    },
    enemies: [],
    projectiles: [],
    boss: {
      pos: { x: ARENA_W / 2, y: 90 },
      hp: cfg.bossHp,
      maxHp: cfg.bossHp,
      hurtTimer: 0,
      attackCooldown: 2,
      active: false,
      defeated: false,
      introTimer: 0,
    },
    pollution: 0,
    wave: 1,
    waveTimer: 0,
    spawnedThisWave: 0,
    enemiesNeededThisWave: 4,
    special: 0,
    shake: 0,
    ended: null,
    particles: [],
    nextEntityId: 1,
    time: 0,
    events: [],
    lastClearedWave: 0,
    bossIntroShown: false,
  };
}

export function enemiesForWave(wave: number): number {
  return [0, 4, 6, 8][wave] ?? 8;
}

export function pickEnemyKind(stage: StageId, wave: number): EnemyKind {
  const cfg = STAGE_CONFIGS[stage];
  const entry = cfg.enemyKinds.find((e) => e.wave === wave) ?? cfg.enemyKinds[cfg.enemyKinds.length - 1];
  const total = entry.pool.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of entry.pool) {
    r -= p.weight;
    if (r <= 0) return p.kind;
  }
  return entry.pool[0].kind;
}

export function enemyStats(kind: EnemyKind): { hp: number; speed: number; size: number } {
  switch (kind) {
    case "goblin": return { hp: GOBLIN_HP, speed: GOBLIN_SPEED, size: 10 };
    case "beast": return { hp: BEAST_HP, speed: BEAST_SPEED, size: 14 };
    case "ghostnet": return { hp: GHOSTNET_HP, speed: GHOSTNET_SPEED, size: 12 };
    case "oilslick": return { hp: OILSLICK_HP, speed: OILSLICK_SPEED, size: 14 };
  }
}
