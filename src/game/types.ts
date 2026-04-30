// Game logic types & constants for Stage 1: Pantai Derawan

export type GameScene =
  | "title"
  | "cutscene"
  | "playing"
  | "win"
  | "gameover";

export type EnemyKind = "goblin" | "beast";

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
  hurtTimer: number; // flash white when hit
  size: number; // hitbox radius
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
  introTimer: number; // shake intro
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
  hero: Hero;
  enemies: Enemy[];
  projectiles: Projectile[];
  boss: Boss;
  pollution: number; // 0..100
  wave: number; // 0..3 then boss
  waveTimer: number;
  spawnedThisWave: number;
  enemiesNeededThisWave: number;
  special: number; // 0..100
  shake: number;
  ended: "win" | "lose" | null;
  particles: Particle[];
  nextEntityId: number;
  time: number;
}

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

export const HERO_SPEED = 90; // px/s
export const HERO_ATTACK_RANGE = 36;
export const HERO_ATTACK_COOLDOWN = 0.35;
export const HERO_INVINCIBLE_TIME = 1.0;

export const GOBLIN_HP = 1;
export const GOBLIN_SPEED = 28;
export const BEAST_HP = 2;
export const BEAST_SPEED = 22;

export const BOSS_HP = 14;
export const BOSS_PROJECTILE_SPEED = 70;

export const POLLUTION_PER_ENEMY_PER_SEC = 1.6; // each living enemy adds this/sec
export const WAVE_COUNT = 3;

export function makeInitialState(): GameState {
  return {
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
      hp: BOSS_HP,
      maxHp: BOSS_HP,
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
  };
}

export function enemiesForWave(wave: number): number {
  return [0, 4, 6, 8][wave] ?? 8;
}
