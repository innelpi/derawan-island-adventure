import { useEffect, useRef, useState } from "react";

interface JoystickProps {
  onChange: (x: number, y: number) => void;
}

export function VirtualJoystick({ onChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const touchId = useRef<number | null>(null);
  const center = useRef({ x: 0, y: 0 });
  const RADIUS = 42;

  useEffect(() => {
    const handle = (e: TouchEvent) => {
      if (!baseRef.current) return;
      // start
      if (e.type === "touchstart") {
        for (const t of Array.from(e.changedTouches)) {
          const r = baseRef.current.getBoundingClientRect();
          if (
            t.clientX >= r.left &&
            t.clientX <= r.right &&
            t.clientY >= r.top &&
            t.clientY <= r.bottom &&
            touchId.current === null
          ) {
            touchId.current = t.identifier;
            center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            setActive(true);
            updateKnob(t.clientX, t.clientY);
            e.preventDefault();
          }
        }
      } else if (e.type === "touchmove") {
        for (const t of Array.from(e.changedTouches)) {
          if (t.identifier === touchId.current) {
            updateKnob(t.clientX, t.clientY);
            e.preventDefault();
          }
        }
      } else {
        for (const t of Array.from(e.changedTouches)) {
          if (t.identifier === touchId.current) {
            touchId.current = null;
            setActive(false);
            setKnob({ x: 0, y: 0 });
            onChange(0, 0);
          }
        }
      }
    };
    function updateKnob(cx: number, cy: number) {
      let dx = cx - center.current.x;
      let dy = cy - center.current.y;
      const d = Math.hypot(dx, dy);
      if (d > RADIUS) {
        dx = (dx / d) * RADIUS;
        dy = (dy / d) * RADIUS;
      }
      setKnob({ x: dx, y: dy });
      onChange(dx / RADIUS, dy / RADIUS);
    }
    window.addEventListener("touchstart", handle, { passive: false });
    window.addEventListener("touchmove", handle, { passive: false });
    window.addEventListener("touchend", handle);
    window.addEventListener("touchcancel", handle);
    return () => {
      window.removeEventListener("touchstart", handle);
      window.removeEventListener("touchmove", handle);
      window.removeEventListener("touchend", handle);
      window.removeEventListener("touchcancel", handle);
    };
  }, [onChange]);

  return (
    <div
      ref={baseRef}
      className={`absolute bottom-6 left-6 h-28 w-28 rounded-full border-4 border-foreground/60 bg-foreground/20 backdrop-blur-sm transition-opacity ${
        active ? "opacity-100" : "opacity-70"
      }`}
      style={{ touchAction: "none" }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground/80 bg-primary shadow-pixel"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  big?: boolean;
}

export function ActionButton({ label, onPress, className = "", disabled, big }: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onTouchStart={(e) => {
        e.preventDefault();
        if (!disabled) onPress();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onPress();
      }}
      className={`pixel-btn select-none rounded-full border-4 border-foreground font-pixel text-xs uppercase shadow-pixel-lg active:translate-y-1 active:shadow-pixel ${
        big ? "h-20 w-20" : "h-14 w-14 text-[10px]"
      } ${disabled ? "opacity-40" : ""} ${className}`}
      style={{ touchAction: "none" }}
    >
      {label}
    </button>
  );
}
