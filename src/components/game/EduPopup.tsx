import { EduFact } from "@/game/edukasi";

interface EduPopupProps {
  fact: EduFact;
  onClose: () => void;
}

export function EduPopup({ fact, onClose }: EduPopupProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-pop-in rounded-md border-4 border-foreground bg-card p-5 shadow-pixel-lg">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-3xl" aria-hidden>{fact.emoji}</span>
          <span className="rounded border-2 border-foreground bg-accent px-2 py-0.5 font-pixel text-[9px] uppercase text-accent-foreground sm:text-[10px]">
            {fact.title}
          </span>
        </div>
        <p className="font-body text-sm leading-relaxed text-card-foreground sm:text-base">
          {fact.text}
        </p>
        <button
          onClick={onClose}
          className="pixel-btn mt-4 w-full rounded border-4 border-foreground bg-primary px-4 py-3 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
        >
          ▶ LANJUT MAIN
        </button>
      </div>
    </div>
  );
}
