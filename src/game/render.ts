import litterKingImg from "@/assets/litter-king.png";
import {
  BOTTLE_BEAST,
  COCONUT_TREE,
  GHOST_NET,
  HERO_ATTACK,
  HERO_IDLE,
  HERO_WALK,
  LITTER_KING,
  NET_MASTER,
  OIL_SLICK,
  PAL,
  TRASH_GOBLIN,
  TRASH_PROJ,
  drawSprite,
} from "./sprites";
import { ARENA_H, ARENA_W, GameState, STAGE_CONFIGS } from "./types";

const SCALE = 2; // pixel sprite scale within arena

// Preload Litter King artwork (Stage 1 boss).
const litterKingHTMLImg: HTMLImageElement = new Image();
litterKingHTMLImg.src = litterKingImg;
let litterKingReady = false;
litterKingHTMLImg.onload = () => { litterKingReady = true; };

// Pre-computed coconut tree positions for parallax background
const TREES = [
  { x: 30, y: 60 },
  { x: ARENA_W - 50, y: 50 },
  { x: 80, y: 30 },
  { x: ARENA_W - 110, y: 35 },
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

  if (state.stage === 3) drawBackgroundDeepSea(ctx, state);
  else if (state.stage === 2) drawBackgroundUnderwater(ctx, state);
  else drawBackground(ctx, state);
  drawEntities(ctx, state);
  drawForegroundEffects(ctx, state);

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, state: GameState) {
  // Sky gradient — darkens as pollution rises
  const pol = state.pollution / 100;
  const skyTop = state.boss.active ? "#3a2a4a" : interp("#87d8ff", "#5a4a7a", pol);
  const skyBot = state.boss.active ? "#5a4a7a" : interp("#bde8ff", "#a0a0b8", pol);
  const grad = ctx.createLinearGradient(0, 0, 0, 110);
  grad.addColorStop(0, skyTop);
  grad.addColorStop(1, skyBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ARENA_W, 110);

  // Sea
  ctx.fillStyle = interp("#3fb8e6", "#5a6a7a", pol);
  ctx.fillRect(0, 100, ARENA_W, 30);
  // sea wave stripes (animated)
  const t = state.time;
  ctx.fillStyle = interp("#7adfff", "#8a9aaa", pol);
  for (let i = 0; i < 8; i++) {
    const yy = 105 + Math.sin(t * 2 + i) * 1.5;
    ctx.fillRect(20 + i * 60, yy, 24, 2);
  }

  // Sand
  const sandGrad = ctx.createLinearGradient(0, 130, 0, ARENA_H);
  sandGrad.addColorStop(0, interp("#f6e3b0", "#a89a7a", pol));
  sandGrad.addColorStop(1, interp("#d9b56a", "#7a6a4a", pol));
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, 130, ARENA_W, ARENA_H - 130);

  // Pollution bercak hitam pas pollution > 40
  if (pol > 0.4) {
    ctx.fillStyle = `rgba(40, 20, 50, ${(pol - 0.4) * 0.7})`;
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 89 + Math.floor(t * 5)) % ARENA_W);
      const cy = 160 + (i * 23) % 80;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Trees
  for (const tr of TREES) {
    drawSprite(ctx, COCONUT_TREE, tr.x, tr.y, 1.5);
  }

  // Pier (left side decoration)
  ctx.fillStyle = "#6b4a22";
  ctx.fillRect(0, 118, 40, 4);
  ctx.fillRect(4, 122, 4, 10);
  ctx.fillRect(20, 122, 4, 10);
  ctx.fillRect(34, 122, 4, 10);
}

function drawEntities(ctx: CanvasRenderingContext2D, state: GameState) {
  // sort by y for fake depth
  type Drawable = { y: number; draw: () => void };
  const items: Drawable[] = [];

  // Boss
  if (state.boss.active && !state.boss.defeated) {
    const b = state.boss;
    const intro = b.introTimer > 0;
    const useImage = state.stage === 1 && litterKingReady;
    const bossSprite = state.stage === 2 ? NET_MASTER : LITTER_KING;
    const auraColor = state.stage === 2 ? "rgba(122,223,255,0.4)" : "rgba(184, 107, 255, 0.4)";
    items.push({
      y: b.pos.y - 100,
      draw: () => {
        const wob = Math.sin(state.time * 3) * 2;
        if (useImage) {
          // Render Litter King PNG (artwork pixel-art kustom)
          const targetH = 96; // tinggi tampil di arena
          const ratio = litterKingHTMLImg.width / litterKingHTMLImg.height;
          const targetW = targetH * ratio;
          const sx = b.pos.x - targetW / 2;
          const sy = b.pos.y - targetH + 8 + wob;
          ctx.save();
          (ctx as unknown as { imageSmoothingEnabled: boolean }).imageSmoothingEnabled = false;
          if (b.hurtTimer > 0) {
            ctx.filter = "brightness(2.4) saturate(0.4)";
          }
          ctx.drawImage(litterKingHTMLImg, sx, sy, targetW, targetH);
          ctx.restore();
        } else {
          const sx = b.pos.x - (bossSprite[0].length * SCALE) / 2;
          const sy = b.pos.y - bossSprite.length * SCALE + 8 + wob;
          if (b.hurtTimer > 0) {
            ctx.globalCompositeOperation = "source-over";
            drawSpriteTinted(ctx, bossSprite, sx, sy, SCALE, "#ffffff");
          } else {
            drawSprite(ctx, bossSprite, sx, sy, SCALE);
          }
        }
        if (intro) {
          ctx.fillStyle = auraColor;
          ctx.beginPath();
          ctx.arc(b.pos.x, b.pos.y, 50 + Math.sin(state.time * 10) * 10, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    });
  }

  // Enemies
  for (const e of state.enemies) {
    items.push({
      y: e.pos.y,
      draw: () => {
        const sprite =
          e.kind === "goblin" ? TRASH_GOBLIN
          : e.kind === "beast" ? BOTTLE_BEAST
          : e.kind === "ghostnet" ? GHOST_NET
          : OIL_SLICK;
        const sx = e.pos.x - (sprite[0].length * SCALE) / 2;
        const sy = e.pos.y - sprite.length * SCALE + 4;
        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(e.pos.x, e.pos.y + 2, e.size * 0.9, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        if (e.hurtTimer > 0) {
          drawSpriteTinted(ctx, sprite, sx, sy, SCALE, "#ffffff");
        } else {
          drawSprite(ctx, sprite, sx, sy, SCALE, e.facing < 0);
        }
      },
    });
  }

  // Hero
  const h = state.hero;
  items.push({
    y: h.pos.y,
    draw: () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(h.pos.x, h.pos.y + 2, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let sprite = HERO_IDLE;
      if (h.attackTimer > 0.15) sprite = HERO_ATTACK;
      else if (h.walkAnim > 0 && Math.floor(h.walkAnim) % 2 === 0) sprite = HERO_WALK;

      const sx = h.pos.x - (sprite[0].length * SCALE) / 2;
      const sy = h.pos.y - sprite.length * SCALE + 4;
      const flash = h.invincible > 0 && Math.floor(state.time * 20) % 2 === 0;
      if (flash) {
        ctx.globalAlpha = 0.5;
      }
      drawSprite(ctx, sprite, sx, sy, SCALE, h.facing < 0);
      ctx.globalAlpha = 1;
    },
  });

  // Projectiles
  for (const p of state.projectiles) {
    items.push({
      y: p.pos.y,
      draw: () => {
        const sx = p.pos.x - (TRASH_PROJ[0].length * SCALE) / 2;
        const sy = p.pos.y - (TRASH_PROJ.length * SCALE) / 2;
        drawSprite(ctx, TRASH_PROJ, sx, sy, SCALE);
      },
    });
  }

  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw();
}

function drawForegroundEffects(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const pt of state.particles) {
    const a = Math.max(0, pt.life / pt.maxLife);
    ctx.globalAlpha = a;
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.pos.x - pt.size / 2, pt.pos.y - pt.size / 2, pt.size, pt.size);
  }
  ctx.globalAlpha = 1;

  // Boss intro text
  if (state.boss.active && !state.boss.defeated && state.boss.introTimer > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, ARENA_H / 2 - 18, ARENA_W, 36);
    ctx.fillStyle = state.stage === 2 ? "#7adfff" : "#ff5577";
    ctx.font = "bold 14px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(STAGE_CONFIGS[state.stage].bossName + "!", ARENA_W / 2, ARENA_H / 2 + 4);
  }
}

function drawBackgroundUnderwater(ctx: CanvasRenderingContext2D, state: GameState) {
  const pol = state.pollution / 100;
  // Deep ocean gradient — gets darker / muddier with pollution
  const top = state.boss.active ? "#0a3a5a" : interp("#1c6fa8", "#1a3a5a", pol);
  const bot = state.boss.active ? "#031426" : interp("#0a4a78", "#08203a", pol);
  const grad = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Light shafts from surface
  const t = state.time;
  ctx.fillStyle = `rgba(190, 240, 255, ${0.08 - pol * 0.06})`;
  for (let i = 0; i < 4; i++) {
    const x = (i * 130 + Math.sin(t * 0.5 + i) * 10) % ARENA_W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 30, 0);
    ctx.lineTo(x + 60, ARENA_H);
    ctx.lineTo(x + 10, ARENA_H);
    ctx.closePath();
    ctx.fill();
  }

  // Bubbles
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < 14; i++) {
    const bx = (i * 53 + Math.sin(t + i) * 12) % ARENA_W;
    const by = (ARENA_H - ((t * 18 + i * 31) % ARENA_H));
    const r = (i % 3) + 1;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Coral reef silhouettes at bottom
  const coralColors = ["#ff7aa8", "#ffb86b", "#a86bff", "#6bd9ff"];
  for (let i = 0; i < 8; i++) {
    const cx = i * 65 + 20;
    const cy = ARENA_H - 12;
    ctx.fillStyle = coralColors[i % coralColors.length];
    ctx.globalAlpha = 0.7 - pol * 0.4;
    // simple coral blob
    for (let j = 0; j < 5; j++) {
      const r = 6 - j;
      ctx.fillRect(cx - r, cy - j * 3, r * 2, 3);
    }
  }
  ctx.globalAlpha = 1;

  // Sea floor
  ctx.fillStyle = interp("#3a2a18", "#1a1208", pol);
  ctx.fillRect(0, ARENA_H - 6, ARENA_W, 6);

  // Pollution oil patches floating
  if (pol > 0.3) {
    ctx.fillStyle = `rgba(20, 5, 30, ${(pol - 0.3) * 0.7})`;
    for (let i = 0; i < 5; i++) {
      const cx = ((i * 97 + Math.floor(t * 6)) % ARENA_W);
      const cy = 30 + (i * 19) % 60;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSpriteTinted(
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  scale: number,
  tint: string,
) {
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const c = PAL[ch];
      if (!c || c === "transparent") continue;
      ctx.fillStyle = tint;
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
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
