// Pixel sprite renderer. Sprites are tiny 2D arrays of color codes.
// Each cell becomes one "pixel" drawn at scale on canvas.

export type Palette = Record<string, string>;
export type Sprite = string[]; // each string = one row, each char = one pixel

// Shared palette keyed by single-char codes
export const PAL: Palette = {
  ".": "transparent",
  // skin / hero
  s: "#f4c89a",
  S: "#d99a6c",
  r: "#e8423a", // shirt red
  R: "#a82820",
  b: "#3a4a8a", // shorts blue
  k: "#1a1a2a", // outline
  w: "#ffffff",
  e: "#222233", // eyes
  y: "#ffd84d", // hat / sun
  Y: "#e6a82a",
  n: "#5a3a1a", // hair brown
  // sea & sand
  c: "#f6e3b0",
  C: "#d9b56a",
  o: "#3fb8e6",
  O: "#1c6fa8",
  g: "#3fbf6a", // green coconut
  G: "#1f7a3a",
  T: "#6b4a22", // trunk
  // trash monsters
  t: "#3a3550",
  T2: "#5b507a",
  p: "#7d2db5", // dark energy purple
  P: "#b96bff",
  m: "#86bf3a", // slime green
  M: "#3a8a1f",
  a: "#9a9a9a", // can grey
  A: "#5a5a5a",
  // boss
  L: "#241830",
  l: "#3d2a4a",
  // misc
  h: "#ff5577", // heart
  H: "#cc2244",
  q: "#7adfff", // clean wave
  Q: "#3a8fcc",
  f: "#fff2a8", // sparkle
};

// Multi-char support: we'll parse strings using single chars, with fallback for "T2" not used
// Keep it simple: only single-char codes above.

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  scale = 4,
  flipX = false,
) {
  ctx.save();
  if (flipX) {
    ctx.translate(x + sprite[0].length * scale, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  } else {
    ctx.translate(x, y);
    x = 0;
    y = 0;
  }
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const color = PAL[ch];
      if (!color || color === "transparent") continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }
  ctx.restore();
}

// =================== HERO SPRITES (16x18) ===================
// Anak chibi pakai topi pantai kuning, kaos merah
export const HERO_IDLE: Sprite = [
  "....yyyyyyyy....",
  "...yYYYYYYYYy...",
  "..yYYyyyyyyYYy..",
  "...nnnnnnnnnn...",
  "..nssssssssssn..",
  "..nseessessen...",
  "..nssssssssss...",
  "..nsswwwwwwss...",
  "...sssssssss....",
  "..rrrrrrrrrrrr..",
  ".rRrrrrrrrrrrRr.",
  ".rRrrrrrrrrrrRr.",
  ".rrrrrrrrrrrrrr.",
  "..ssrr....rrss..",
  "..bbbb....bbbb..",
  "..bbbb....bbbb..",
  "..bbbb....bbbb..",
  "..kkk......kkk..",
];

export const HERO_WALK: Sprite = [
  "....yyyyyyyy....",
  "...yYYYYYYYYy...",
  "..yYYyyyyyyYYy..",
  "...nnnnnnnnnn...",
  "..nssssssssssn..",
  "..nseessessen...",
  "..nssssssssss...",
  "..nsswwwwwwss...",
  "...sssssssss....",
  "..rrrrrrrrrrrr..",
  ".rRrrrrrrrrrrRr.",
  "..rrrrrrrrrrrr..",
  "..rrrrrrrrrrrr..",
  "..ssrr....rrss..",
  ".bbbb......bbbb.",
  ".bbbb......bbbb.",
  ".bbb........bbb.",
  ".kk..........kk.",
];

export const HERO_ATTACK: Sprite = [
  "....yyyyyyyy....",
  "...yYYYYYYYYy...",
  "..yYYyyyyyyYYy..",
  "...nnnnnnnnnn...",
  "..nssssssssssn..",
  "..nseessessen...",
  "..nssssssssss...",
  "..nsswwwwwwss...",
  "...sssssssss....",
  "..rrrrrrrrrrrrqq",
  ".rRrrrrrrrrrrRqq",
  ".rRrrrrrrrrrrqqq",
  ".rrrrrrrrrrrrqq.",
  "..ssrr....rrss..",
  "..bbbb....bbbb..",
  "..bbbb....bbbb..",
  "..bbbb....bbbb..",
  "..kkk......kkk..",
];

// =================== TRASH MONSTERS ===================
// Trash Goblin (12x12) - dari botol & sampah
export const TRASH_GOBLIN: Sprite = [
  "....pppp....",
  "...pPPPPp...",
  "..pPeewwePp.",
  "..pPwwwwwwP.",
  "..pPmmmmmmP.",
  ".ttttttttttp",
  ".ta..aa..tap",
  ".tttaattttp.",
  ".ttttttttt..",
  "..tt....tt..",
  "..kk....kk..",
  "..k......k..",
];

// Bottle Beast (14x14) - lebih besar, dari kaleng
export const BOTTLE_BEAST: Sprite = [
  "....aaaaaa....",
  "...aAAAAAAa...",
  "..aAAeewweAAa.",
  "..aAwwwwwwwwA.",
  "..aAmwwwwwwmA.",
  ".aattttttttaaA",
  ".aatttaattttaA",
  ".aaattttttttaa",
  ".aaaaaaaaaaaa.",
  "..aaaattaaaa..",
  "..aaa....aaa..",
  "..aa......aa..",
  "..kk......kk..",
  "..k........k..",
];

// =================== BOSS — LITTER KING (28x32) ===================
export const LITTER_KING: Sprite = [
  ".......pppppppppppppp.......",
  "......pPPPPPPPPPPPPPPp......",
  ".....pPLLLLLLLLLLLLLLPp.....",
  "....pPLLwwwwLLLLwwwwLLPp....",
  "....pLLwwwweLLLLewwwwLLp....",
  "....pLLwwwwLLLLLLwwwwLLp....",
  "....pLLLLLLLLLLLLLLLLLLp....",
  "....pLLLLLLLLkkkkLLLLLLp....",
  "....pLLLLLkkkmmmmkkkLLLp....",
  "....pPLLLLkmmmmmmmkLLLPp....",
  ".....pPPPLLLLLLLLLLLPPp.....",
  "...tttttttttttttttttttttt...",
  "..ttaattmmttaattmmttaattmmt.",
  ".ttAttttttttaattttttmmttaatt",
  ".ttttaattmmttttaattmmttttaat",
  ".ttmmttaattmmttttaattmmttttt",
  ".tttaattmmttttaattmmttttaatt",
  ".ttttttaattmmttttaattmmttttt",
  ".ttmmttttaattmmttttaattmmtt.",
  "..tttaattmmttttaattmmtttttt.",
  "...ttttaattmmttttaattmmttt..",
  "....tttttttttttttttttttt....",
  "....tt..tttttttttttt..tt....",
  "....tt...tttttttttt...tt....",
  "....tt....tttttttt....tt....",
  "....kk....tttttttt....kk....",
  "....kk....tt....tt....kk....",
  "....k.....kk....kk.....k....",
  "..........kk....kk..........",
  "..........k......k..........",
  "............................",
  "............................",
];

// =================== ENVIRONMENT ===================
// Coconut tree (14x20)
export const COCONUT_TREE: Sprite = [
  "...gggggGGgg..",
  "..gGGgggGGGGg.",
  ".gGGGgggggGGGg",
  "gGggggGGGgggGG",
  "gGGggggGGggggG",
  ".ggggGGggggGg.",
  "..gggggGGggg..",
  "...gGGgggGg...",
  "....gGGgGg....",
  ".....TTTT.....",
  ".....TTTT.....",
  ".....TtTT.....",
  ".....TTtT.....",
  ".....TTTT.....",
  ".....TTtT.....",
  ".....tTTT.....",
  ".....TTTT.....",
  ".....TTtT.....",
  ".....TTTT.....",
  "....CCCCCC....",
];

// Heart (8x7)
export const HEART_FULL: Sprite = [
  ".hh..hh.",
  "hHHhhHHh",
  "hHHHHHHh",
  "hHHHHHHh",
  ".hHHHHh.",
  "..hHHh..",
  "...hh...",
];

export const HEART_EMPTY: Sprite = [
  ".kk..kk.",
  "k..kk..k",
  "k......k",
  "k......k",
  ".k....k.",
  "..k..k..",
  "...kk...",
];

// Trash projectile (6x6)
export const TRASH_PROJ: Sprite = [
  "..ppp.",
  ".pPPPp",
  "ptmmtP",
  "ptmmtP",
  ".pPPp.",
  "..pp..",
];

// Sparkle (5x5)
export const SPARKLE: Sprite = [
  "..f..",
  ".fff.",
  "ffwff",
  ".fff.",
  "..f..",
];
