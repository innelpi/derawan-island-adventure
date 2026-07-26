import heroIdle from "@/assets/hero-idle.png";
import heroWalk from "@/assets/hero-walk.png";
import heroAttack from "@/assets/hero-attack.png";
import enemyGoblin from "@/assets/enemy-goblin.png";
import enemyBeast from "@/assets/enemy-beast.png";
import enemyGhostnet from "@/assets/enemy-ghostnet.png";
import enemyOilslick from "@/assets/enemy-oilslick.png";
import enemyMicroplastic from "@/assets/enemy-microplastic.png";
import bossLitterKing from "@/assets/boss-litterking.png";
import bossNetMaster from "@/assets/boss-netmaster.png";
import bossPlasticTyrant from "@/assets/boss-plastictyrant.png";
import coconutTree from "@/assets/coconut-tree.png";
import bgStage1 from "@/assets/bg-stage1.jpg";
import bgStage2 from "@/assets/bg-stage2.jpg";
import bgStage3 from "@/assets/bg-stage3.jpg";
import { EnemyKind } from "./types";

// ============================================================
// Hand-drawn image asset manager
// Replaces the old pixel sprite arrays with PNG illustrations.
// ============================================================

export interface SpriteAsset {
  src: string;
  width: number; // native image width
  height: number; // native image height
  drawHeight: number; // desired height in arena pixels
}

const assets: Record<string, SpriteAsset> = {
  heroIdle: { src: heroIdle, width: 0, height: 0, drawHeight: 42 },
  heroWalk: { src: heroWalk, width: 0, height: 0, drawHeight: 42 },
  heroAttack: { src: heroAttack, width: 0, height: 0, drawHeight: 46 },
  enemyGoblin: { src: enemyGoblin, width: 0, height: 0, drawHeight: 28 },
  enemyBeast: { src: enemyBeast, width: 0, height: 0, drawHeight: 36 },
  enemyGhostnet: { src: enemyGhostnet, width: 0, height: 0, drawHeight: 30 },
  enemyOilslick: { src: enemyOilslick, width: 0, height: 0, drawHeight: 32 },
  enemyMicroplastic: { src: enemyMicroplastic, width: 0, height: 0, drawHeight: 24 },
  bossLitterKing: { src: bossLitterKing, width: 0, height: 0, drawHeight: 90 },
  bossNetMaster: { src: bossNetMaster, width: 0, height: 0, drawHeight: 90 },
  bossPlasticTyrant: { src: bossPlasticTyrant, width: 0, height: 0, drawHeight: 95 },
  coconutTree: { src: coconutTree, width: 0, height: 0, drawHeight: 75 },
  bgStage1: { src: bgStage1, width: 0, height: 0, drawHeight: 0 },
  bgStage2: { src: bgStage2, width: 0, height: 0, drawHeight: 0 },
  bgStage3: { src: bgStage3, width: 0, height: 0, drawHeight: 0 },
};

const imageCache: Record<string, HTMLImageElement> = {};
let allLoaded = false;

function loadImage(key: string, src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache[key] = img;
      assets[key].width = img.width;
      assets[key].height = img.height;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function preloadSprites(): Promise<void> {
  if (allLoaded) return;
  await Promise.all(
    Object.keys(assets).map((key) => loadImage(key, assets[key].src))
  );
  allLoaded = true;
}

export function isSpritesLoaded(): boolean {
  return allLoaded;
}

export function getSprite(key: keyof typeof assets): SpriteAsset & { image: HTMLImageElement | null } {
  return {
    ...assets[key],
    image: imageCache[key] || null,
  };
}

const ENEMY_ASSET: Record<EnemyKind, keyof typeof assets> = {
  goblin: "enemyGoblin",
  beast: "enemyBeast",
  ghostnet: "enemyGhostnet",
  oilslick: "enemyOilslick",
  microplastic: "enemyMicroplastic",
  darkjelly: "enemyGhostnet",
};

const BOSS_ASSET: Record<1 | 2 | 3, keyof typeof assets> = {
  1: "bossLitterKing",
  2: "bossNetMaster",
  3: "bossPlasticTyrant",
};

export function getEnemyAsset(kind: EnemyKind) {
  return getSprite(ENEMY_ASSET[kind]);
}

export function getBossAsset(stage: 1 | 2 | 3) {
  return getSprite(BOSS_ASSET[stage]);
}

export function getHeroAsset(pose: "idle" | "walk" | "attack") {
  return getSprite(pose === "idle" ? "heroIdle" : pose === "walk" ? "heroWalk" : "heroAttack");
}

export function getBackgroundAsset(stage: 1 | 2 | 3) {
  return getSprite(stage === 1 ? "bgStage1" : stage === 2 ? "bgStage2" : "bgStage3");
}

export function getTreeAsset() {
  return getSprite("coconutTree");
}

export function drawImageCentered(
  ctx: CanvasRenderingContext2D,
  asset: SpriteAsset & { image: HTMLImageElement | null },
  x: number,
  y: number,
  flipX = false,
  options: {
    opacity?: number;
    tint?: string;
    scale?: number;
    rotation?: number;
  } = {},
) {
  if (!asset.image) return;

  const ratio = asset.width / asset.height;
  const h = asset.drawHeight * (options.scale ?? 1);
  const w = h * ratio;

  ctx.save();
  ctx.translate(x, y);
  if (options.rotation) ctx.rotate(options.rotation);
  if (flipX) ctx.scale(-1, 1);
  if (options.opacity !== undefined) ctx.globalAlpha = options.opacity;
  if (options.tint) {
    ctx.filter = `brightness(1.6) saturate(0.4) drop-shadow(0 0 6px ${options.tint})`;
  }

  ctx.drawImage(
    asset.image,
    flipX ? -w / 2 : -w / 2,
    -h + 4,
    w,
    h
  );

  ctx.restore();
}

// Keep legacy pixel types for any remaining references (none expected).
export type Palette = Record<string, string>;
export type Sprite = string[];
