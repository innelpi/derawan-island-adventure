import {
  ARENA_H,
  ARENA_W,
  GameState,
  STAGE_CONFIGS,
} from "./types";
import {
  drawImageCentered,
  getBackgroundAsset,
  getBossAsset,
  getEnemyAsset,
  getHeroAsset,
  getTreeAsset,
  preloadSprites,
} from "./sprites";

// Start preloading assets as soon as the module is loaded.
preloadSprites().catch(() => {});

// Pre-computed coconut tree positions for parallax background
const TREES = [
  { x: 40, y: 70 },
  { x: ARENA_W - 40, y: 60 },
  { x: 95, y: 45 },
  { x: ARENA_W - 100, y: 40 },
];

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
) {
  // letterbox-fit ARENA into canvas keeping aspect
  const scale = Math.min(width / ARENA_W, height / ARENA_H);
  const ox = (width - ARENA_W * scale) / 2;
  const oy = (height - ARENA_H * scale) / 2;

  ctx.fillStyle = "#0a1628";
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);

  // shake
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * state.shake * 8, (Math.random() - 0.5) * state.shake * 8);
  }

  drawBackground(ctx, state);
  drawEntities(ctx, state);
  drawForegroundEffects(ctx, state);

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, state: GameState) {
  const bg = getBackgroundAsset(state.stage);

  if (bg.image) {
    // Draw full-arena background image
    ctx.drawImage(bg.image, 0, 0, ARENA_W, ARENA_H);
  } else {
    // Fallback while loading
    ctx.fillStyle = state.stage === 3 ? "#1a0628" : state.stage === 2 ? "#1c6fa8" : "#87d8ff";
    ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  }

  // Pollution overlay: darkens & tints the scene
  const pol = state.pollution / 100;
  if (pol > 0) {
    const tint =
      state.stage === 3 ? "rgba(80, 0, 60, "
      : state.stage === 2 ? "rgba(30, 20, 50, "
      : "rgba(40, 30, 50, ";
    ctx.fillStyle = `${tint}${pol * 0.55})`;
    ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  }

  // Stage 1 trees
  if (state.stage === 1) {
    const tree = getTreeAsset();
    for (const tr of TREES) {
      drawImageCentered(ctx, tree, tr.x, tr.y, false, { scale: 0.9 });
    }
  }
}

function drawEntities(ctx: CanvasRenderingContext2D, state: GameState) {
  type Drawable = { y: number; draw: () => void };
  const items: Drawable[] = [];

  // Boss
  if (state.boss.active && !state.boss.defeated) {
    const b = state.boss;
    const intro = b.introTimer > 0;
    const bossAsset = getBossAsset(state.stage);
    const auraColor =
      state.stage === 1 ? "rgba(184, 107, 255, 0.35)"
      : state.stage === 2 ? "rgba(122, 223, 255, 0.35)"
      : "rgba(255, 80, 220, 0.4)";

    items.push({
      y: b.pos.y - 100,
      draw: () => {
        const wob = Math.sin(state.time * 3) * 2;
        const x = b.pos.x;
        const y = b.pos.y + wob;

        // aura / glow
        ctx.save();
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(x, y - 10, 42 + Math.sin(state.time * 4) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const tint = b.hurtTimer > 0 ? "#a5f3fc" : undefined;
        drawImageCentered(ctx, bossAsset, x, y, false, { tint });

        if (intro) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, ARENA_H / 2 - 18, ARENA_W, 36);
          ctx.fillStyle = state.stage === 2 ? "#7adfff" : state.stage === 3 ? "#ff5cdc" : "#ff5577";
          ctx.font = "bold 12px 'Fredoka', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(STAGE_CONFIGS[state.stage].bossName + "!", ARENA_W / 2, ARENA_H / 2 + 4);
        }
      },
    });
  }

  // Enemies
  for (const e of state.enemies) {
    items.push({
      y: e.pos.y,
      draw: () => {
        const asset = getEnemyAsset(e.kind);
        const x = e.pos.x;
        const y = e.pos.y;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(x, y + 2, e.size * 0.9, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const scale = e.kind === "microplastic" ? 0.85 : 1;
        const tint = e.hurtTimer > 0 ? "#ffffff" : undefined;
        drawImageCentered(ctx, asset, x, y, e.facing < 0, { tint, scale });
      },
    });
  }

  // Hero
  const h = state.hero;
  items.push({
    y: h.pos.y,
    draw: () => {
      const x = h.pos.x;
      const y = h.pos.y;

      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(x, y + 2, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let pose: "idle" | "walk" | "attack" = "idle";
      if (h.attackTimer > 0.15) pose = "attack";
      else if (h.walkAnim > 0 && Math.floor(h.walkAnim) % 2 === 0) pose = "walk";

      const heroAsset = getHeroAsset(pose);
      const flash = h.invincible > 0 && Math.floor(state.time * 20) % 2 === 0;
      const opacity = flash ? 0.5 : 1;
      drawImageCentered(ctx, heroAsset, x, y, h.facing < 0, { opacity });
    },
  });

  // Projectiles
  for (const p of state.projectiles) {
    items.push({
      y: p.pos.y,
      draw: () => {
        ctx.save();
        ctx.translate(p.pos.x, p.pos.y);
        // trash ball with purple glow
        ctx.fillStyle = "#3a3550";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#b96bff";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    });
  }

  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw();
}

function drawForegroundEffects(ctx: CanvasRenderingContext2D, state: GameState) {
  // Particles
  for (const pt of state.particles) {
    const a = Math.max(0, pt.life / pt.maxLife);
    ctx.globalAlpha = a;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.pos.x - pt.size / 2, pt.pos.y - pt.size / 2, pt.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function interp(a: string, b: string, t: number) {
  const ah = hex(a);
  const bh = hex(b);
  const r = Math.round(ah[0] + (bh[0] - ah[0]) * t);
  const g = Math.round(ah[1] + (bh[1] - ah[1]) * t);
  const bb = Math.round(ah[2] + (bh[2] - ah[2]) * t);
  return `rgb(${r}, ${g}, ${bb})`;
}

function hex(s: string): [number, number, number] {
  const m = s.replace("#", "");
  return [
    parseInt(m.substring(0, 2), 16),
    parseInt(m.substring(2, 4), 16),
    parseInt(m.substring(4, 6), 16),
  ];
}
