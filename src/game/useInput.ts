import { useEffect, useRef } from "react";
import { InputState } from "@/game/engine";

export function useInput() {
  const ref = useRef<InputState>({
    moveX: 0,
    moveY: 0,
    attackPressed: false,
    specialPressed: false,
  });
  // Keys held
  const keys = useRef<Record<string, boolean>>({});
  // Edge-triggered: attack/special are consumed each frame
  const attackQueued = useRef(false);
  const specialQueued = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;
      if (k === " " || k === "spacebar" || k === "j") {
        attackQueued.current = true;
        e.preventDefault();
      }
      if (k === "e" || k === "k") {
        specialQueued.current = true;
        e.preventDefault();
      }
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Read input — call once per frame from game loop
  function read(touch: { mx: number; my: number; attack: boolean; special: boolean }): InputState {
    let mx = 0,
      my = 0;
    if (keys.current["a"] || keys.current["arrowleft"]) mx -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) mx += 1;
    if (keys.current["w"] || keys.current["arrowup"]) my -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) my += 1;
    mx += touch.mx;
    my += touch.my;
    const attack = attackQueued.current || touch.attack;
    const special = specialQueued.current || touch.special;
    attackQueued.current = false;
    specialQueued.current = false;
    ref.current = { moveX: mx, moveY: my, attackPressed: attack, specialPressed: special };
    return ref.current;
  }

  return { read };
}
