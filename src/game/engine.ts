import {
  ARENA_H,
  ARENA_W,
  BEAST_HP,
  BEAST_SPEED,
  BOSS_ATTACK_INTERVAL,
  BOSS_HP,
  BOSS_PROJECTILE_SPEED,
  enemiesForWave,
  Enemy,
  GameState,
  GOBLIN_HP,
  GOBLIN_SPEED,
  HERO_ATTACK_COOLDOWN,
  HERO_ATTACK_RANGE,
  HERO_INVINCIBLE_TIME,
  HERO_SPEED,
  POLLUTION_PER_ENEMY_PER_SEC,
  Projectile,
  WAVE_COUNT,
} from "./types";

export interface InputState {
  moveX: number; // -1..1
  moveY: number; // -1..1
  attackPressed: boolean;
  specialPressed: boolean;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function spawnEnemy(state: GameState, kind: Enemy["kind"]) {
  // spawn from edges
  const side = Math.floor(Math.random() * 4);
  let x = 0,
    y = 0;
  if (side === 0) {
    x = Math.random() * ARENA_W;
    y = -10;
  } else if (side === 1) {
    x = ARENA_W + 10;
    y = Math.random() * ARENA_H;
  } else if (side === 2) {
    x = Math.random() * ARENA_W;
    y = ARENA_H + 10;
  } else {
    x = -10;
    y = Math.random() * ARENA_H;
  }
  state.enemies.push({
    id: state.nextEntityId++,
    kind,
    pos: { x, y },
    hp: kind === "goblin" ? GOBLIN_HP : BEAST_HP,
    maxHp: kind === "goblin" ? GOBLIN_HP : BEAST_HP,
    speed: kind === "goblin" ? GOBLIN_SPEED : BEAST_SPEED,
    facing: x < ARENA_W / 2 ? 1 : -1,
    hurtTimer: 0,
    size: kind === "goblin" ? 10 : 14,
  });
}

function emitParticles(state: GameState, x: number, y: number, color: string, count = 6) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 30 + Math.random() * 50;
    state.particles.push({
      pos: { x, y },
      vel: { x: Math.cos(a) * sp, y: Math.sin(a) * sp },
      life: 0.5 + Math.random() * 0.3,
      maxLife: 0.8,
      color,
      size: 2 + Math.random() * 2,
    });
  }
}

export function updateGame(state: GameState, input: InputState, dt: number) {
  if (state.ended) return;
  state.events.length = 0;
  state.time += dt;

  // Hero movement
  const h = state.hero;
  let mx = input.moveX;
  let my = input.moveY;
  const mag = Math.hypot(mx, my);
  if (mag > 1) {
    mx /= mag;
    my /= mag;
  }
  if (mx !== 0 || my !== 0) {
    h.pos.x = clamp(h.pos.x + mx * HERO_SPEED * dt, 12, ARENA_W - 12);
    h.pos.y = clamp(h.pos.y + my * HERO_SPEED * dt, 30, ARENA_H - 18);
    h.walkAnim += dt * 8;
    if (mx !== 0) h.facing = mx > 0 ? 1 : -1;
  } else {
    h.walkAnim = 0;
  }
  h.invincible = Math.max(0, h.invincible - dt);
  h.attackTimer = Math.max(0, h.attackTimer - dt);

  // Hero attack
  if (input.attackPressed && h.attackTimer === 0) {
    h.attackTimer = HERO_ATTACK_COOLDOWN;
    state.events.push("attack");
    const ax = h.pos.x + h.facing * 18;
    const ay = h.pos.y - 4;
    // hit enemies in range
    for (const e of state.enemies) {
      if (dist(ax, ay, e.pos.x, e.pos.y) < HERO_ATTACK_RANGE) {
        e.hp -= 1;
        e.hurtTimer = 0.15;
        state.events.push("hit");
        // knockback
        const dx = e.pos.x - h.pos.x;
        const dy = e.pos.y - h.pos.y;
        const d = Math.hypot(dx, dy) || 1;
        e.pos.x += (dx / d) * 8;
        e.pos.y += (dy / d) * 8;
      }
    }
    // hit boss
    if (state.boss.active && !state.boss.defeated) {
      if (dist(ax, ay, state.boss.pos.x, state.boss.pos.y) < 50) {
        state.boss.hp -= 1;
        state.boss.hurtTimer = 0.2;
        state.shake = Math.max(state.shake, 0.15);
        state.events.push("hit");
        emitParticles(state, state.boss.pos.x, state.boss.pos.y + 10, "#7adfff", 4);
      }
    }
  }



  // Special attack
  if (input.specialPressed && state.special >= 100) {
    state.special = 0;
    state.shake = 0.4;
    // damage all enemies
    for (const e of state.enemies) {
      e.hp -= 2;
      e.hurtTimer = 0.2;
      emitParticles(state, e.pos.x, e.pos.y, "#7adfff", 8);
    }
    if (state.boss.active && !state.boss.defeated) {
      state.boss.hp -= 3;
      state.boss.hurtTimer = 0.3;
      emitParticles(state, state.boss.pos.x, state.boss.pos.y, "#7adfff", 16);
    }
    // pollution down
    state.pollution = Math.max(0, state.pollution - 25);
    emitParticles(state, h.pos.x, h.pos.y, "#7adfff", 20);
  }

  // Enemy AI: chase hero
  for (const e of state.enemies) {
    e.hurtTimer = Math.max(0, e.hurtTimer - dt);
    const dx = h.pos.x - e.pos.x;
    const dy = h.pos.y - e.pos.y;
    const d = Math.hypot(dx, dy) || 1;
    e.pos.x += (dx / d) * e.speed * dt;
    e.pos.y += (dy / d) * e.speed * dt;
    e.facing = dx > 0 ? 1 : -1;

    // touch damage
    if (d < e.size + 10 && h.invincible === 0) {
      h.hp -= 1;
      h.invincible = HERO_INVINCIBLE_TIME;
      state.shake = 0.25;
      emitParticles(state, h.pos.x, h.pos.y, "#ff5577", 8);
      // knockback hero
      h.pos.x = clamp(h.pos.x - (dx / d) * 12, 12, ARENA_W - 12);
      h.pos.y = clamp(h.pos.y - (dy / d) * 12, 30, ARENA_H - 18);
    }
  }

  // Remove dead enemies
  const alive: Enemy[] = [];
  for (const e of state.enemies) {
    if (e.hp <= 0) {
      emitParticles(state, e.pos.x, e.pos.y, "#b96bff", 10);
      state.special = Math.min(100, state.special + 18);
      state.pollution = Math.max(0, state.pollution - 3);
    } else {
      alive.push(e);
    }
  }
  state.enemies = alive;

  // Pollution rises while enemies are alive
  state.pollution = clamp(
    state.pollution + state.enemies.length * POLLUTION_PER_ENEMY_PER_SEC * dt,
    0,
    100,
  );

  // Wave management
  if (!state.boss.active && !state.boss.defeated) {
    state.waveTimer += dt;
    const target = enemiesForWave(state.wave);
    state.enemiesNeededThisWave = target;
    // spawn at intervals
    if (state.spawnedThisWave < target && state.waveTimer > 0.6) {
      state.waveTimer = 0;
      const kind: Enemy["kind"] =
        Math.random() < (state.wave === 1 ? 0.85 : state.wave === 2 ? 0.6 : 0.45)
          ? "goblin"
          : "beast";
      spawnEnemy(state, kind);
      state.spawnedThisWave++;
    }
    // wave clear?
    if (state.spawnedThisWave >= target && state.enemies.length === 0) {
      if (state.wave < WAVE_COUNT) {
        state.wave++;
        state.spawnedThisWave = 0;
        state.waveTimer = -1; // small breather
      } else {
        // Spawn boss
        state.boss.active = true;
        state.boss.introTimer = 1.2;
        state.shake = 0.6;
      }
    }
  }

  // Boss behaviour
  if (state.boss.active && !state.boss.defeated) {
    if (state.boss.introTimer > 0) {
      state.boss.introTimer -= dt;
    } else {
      state.boss.attackCooldown -= dt;
      if (state.boss.attackCooldown <= 0) {
        state.boss.attackCooldown = 1.6;
        // shoot 3 projectiles toward hero
        for (let i = -1; i <= 1; i++) {
          const dx = h.pos.x - state.boss.pos.x;
          const dy = h.pos.y - state.boss.pos.y;
          const ang = Math.atan2(dy, dx) + i * 0.25;
          state.projectiles.push({
            id: state.nextEntityId++,
            pos: { x: state.boss.pos.x, y: state.boss.pos.y + 20 },
            vel: {
              x: Math.cos(ang) * BOSS_PROJECTILE_SPEED,
              y: Math.sin(ang) * BOSS_PROJECTILE_SPEED,
            },
            life: 4,
          });
        }
      }
    }
    state.boss.hurtTimer = Math.max(0, state.boss.hurtTimer - dt);

    // Boss also slowly raises pollution
    state.pollution = clamp(state.pollution + 3 * dt, 0, 100);

    if (state.boss.hp <= 0) {
      state.boss.defeated = true;
      state.shake = 1.0;
      emitParticles(state, state.boss.pos.x, state.boss.pos.y, "#7adfff", 40);
      // small delay handled by scene transition
      setTimeout(() => {
        state.ended = "win";
      }, 800);
    }
  }

  // Projectiles
  const liveProj: Projectile[] = [];
  for (const p of state.projectiles) {
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;
    p.life -= dt;
    // hit hero?
    if (h.invincible === 0 && dist(p.pos.x, p.pos.y, h.pos.x, h.pos.y) < 12) {
      h.hp -= 1;
      h.invincible = HERO_INVINCIBLE_TIME;
      state.shake = 0.3;
      emitParticles(state, h.pos.x, h.pos.y, "#ff5577", 10);
      continue;
    }
    if (
      p.life > 0 &&
      p.pos.x > -20 &&
      p.pos.x < ARENA_W + 20 &&
      p.pos.y > -20 &&
      p.pos.y < ARENA_H + 20
    ) {
      liveProj.push(p);
    }
  }
  state.projectiles = liveProj;

  // Particles
  for (const pt of state.particles) {
    pt.pos.x += pt.vel.x * dt;
    pt.pos.y += pt.vel.y * dt;
    pt.vel.x *= 0.9;
    pt.vel.y *= 0.9;
    pt.life -= dt;
  }
  state.particles = state.particles.filter((pt) => pt.life > 0);

  // Shake decay
  state.shake = Math.max(0, state.shake - dt);

  // Lose conditions
  if (h.hp <= 0) {
    state.ended = "lose";
  }
  if (state.pollution >= 100) {
    state.ended = "lose";
  }
}
