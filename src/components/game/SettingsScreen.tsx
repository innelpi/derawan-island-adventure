import { useState } from "react";
import { HowToPlay } from "@/components/game/HowToPlay";
import { SFX, setMuted, setSfxVolume } from "@/game/audio";
import { setMusicMuted, setMusicVolume } from "@/game/music";
import { loadSettings, saveSettings } from "@/game/settings";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const initial = loadSettings();
  const [name, setName] = useState(initial.playerName);
  const [music, setMusic] = useState(initial.musicVolume);
  const [sfx, setSfx] = useState(initial.sfxVolume);
  const [muted, setMutedLocal] = useState(initial.muted);
  const [showHelp, setShowHelp] = useState(false);

  const updateSfx = (v: number) => {
    setSfx(v);
    setSfxVolume(v);
    saveSettings({ sfxVolume: v });
    SFX.click();
  };
  const updateMusic = (v: number) => {
    setMusic(v);
    setMusicVolume(v);
    saveSettings({ musicVolume: v });
  };
  const toggleMute = () => {
    const next = !muted;
    setMutedLocal(next);
    setMuted(next);
    setMusicMuted(next);
    saveSettings({ muted: next });
  };

  const save = () => {
    saveSettings({ playerName: name.trim() || "Pahlawan" });
    SFX.click();
    onBack();
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-y-auto bg-gradient-to-b from-sky to-primary/40 p-4 sm:p-8">
      <div className="w-full max-w-md animate-pop-in rounded-md border-4 border-foreground bg-card p-5 shadow-pixel-lg sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-pixel text-base sm:text-lg">⚙ PENGATURAN</h2>
          <button
            onClick={() => {
              SFX.click();
              onBack();
            }}
            aria-label="Tutup pengaturan"
            className="rounded border-2 border-foreground bg-background px-2 py-1 font-pixel text-[10px]"
          >
            ✕
          </button>
        </div>

        {/* Player name */}
        <div className="mb-5 space-y-2">
          <label className="font-pixel text-[10px] uppercase">👤 Nama Pemain</label>
          <input
            type="text"
            value={name}
            maxLength={14}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pahlawan"
            className="w-full rounded border-4 border-foreground bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="font-body text-xs text-muted-foreground">
            Maksimal 14 karakter. Nama kamu akan dipakai di dialog & layar kemenangan!
          </p>
        </div>

        {/* Mute */}
        <div className="mb-5 flex items-center justify-between rounded border-4 border-foreground bg-background p-3">
          <span className="font-pixel text-[10px] uppercase">{muted ? "🔇" : "🔊"} Suara</span>
          <button
            onClick={toggleMute}
            className={`pixel-btn rounded border-4 border-foreground px-4 py-1 font-pixel text-[10px] shadow-pixel ${
              muted ? "bg-destructive text-destructive-foreground" : "bg-success text-white"
            }`}
          >
            {muted ? "OFF" : "ON"}
          </button>
        </div>

        {/* SFX volume */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-pixel text-[10px] uppercase">🎮 Volume SFX</label>
            <span className="font-pixel text-[10px]">{Math.round(sfx * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={sfx}
            onChange={(e) => updateSfx(parseFloat(e.target.value))}
            disabled={muted}
            className="w-full accent-primary"
          />
        </div>

        {/* Music volume — saved for future use */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-pixel text-[10px] uppercase">🎵 Volume Musik</label>
            <span className="font-pixel text-[10px]">{Math.round(music * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={music}
            onChange={(e) => updateMusic(parseFloat(e.target.value))}
            disabled={muted}
            className="w-full accent-primary"
          />
          <p className="font-body text-[10px] text-muted-foreground">
            🎵 Musik chiptune santai untuk menemanimu menjelajah Derawan.
          </p>
        </div>

        {/* Tutorial button */}
        <button
          onClick={() => {
            SFX.click();
            setShowHelp(true);
          }}
          className="mb-4 w-full rounded border-4 border-foreground bg-secondary py-2.5 font-pixel text-[10px] text-secondary-foreground shadow-pixel active:translate-y-1"
        >
          📖 LIHAT CARA BERMAIN
        </button>

        {/* Controls info */}
        <div className="mb-5 rounded border-4 border-foreground bg-muted p-3">
          <h3 className="mb-2 font-pixel text-[10px] uppercase">🎯 Cara Main Singkat</h3>
          <ul className="space-y-1 font-body text-xs text-card-foreground">
            <li>💻 <strong>Desktop:</strong> WASD gerak · SPASI serang · E clean wave</li>
            <li>📱 <strong>HP:</strong> Joystick kiri · Tombol kanan untuk serang</li>
            <li>❤️ Jawab <strong>kuis kilat</strong> dengan benar untuk dapat +1 nyawa!</li>
          </ul>
        </div>

        <button
          onClick={save}
          className="pixel-btn w-full rounded border-4 border-foreground bg-primary py-3 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
        >
          ✅ SIMPAN & KEMBALI
        </button>

        <p className="mt-4 text-center font-body text-[10px] text-muted-foreground">
          Derawan Island · Game Edukasi Anak SD
        </p>
      </div>
    </div>
  );
}
