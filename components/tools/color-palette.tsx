"use client";

import { useState, useCallback, useRef } from "react";
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Shuffle,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//  Color conversion helpers

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

/** Validate and normalise a hex string typed by the user */
function normaliseHex(raw: string): string | null {
  const cleaned = raw.trim().replace(/^#*/, "");
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) return `#${cleaned.toUpperCase()}`;
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    const [a, b, c] = cleaned;
    return `#${a}${a}${b}${b}${c}${c}`.toUpperCase();
  }
  return null;
}

function generateHarmoniousPalette(count: number, baseHue?: number): string[] {
  const hue = baseHue ?? Math.floor(Math.random() * 360);
  const sat = 55 + Math.floor(Math.random() * 30);
  return Array.from({ length: count }, (_, i) => {
    const l =
      20 +
      Math.round((70 / (count - 1 || 1)) * i) +
      Math.floor(Math.random() * 6);
    const analogueH = (hue + i * 15) % 360;
    return hslToHex(analogueH, sat, Math.min(l, 90));
  });
}

// Types of paletts

type Swatch = { hex: string; locked: boolean };

const SCHEMES = [
  "Analogous",
  "Triadic",
  "Complementary",
  "Monochrome",
] as const;
type Scheme = (typeof SCHEMES)[number];

const MIN_COLORS = 2;
const MAX_COLORS = 10;

// component

export function ColorPalette() {
  const [swatches, setSwatches] = useState<Swatch[]>(
    generateHarmoniousPalette(5).map((hex) => ({ hex, locked: false })),
  );
  const [scheme, setScheme] = useState<Scheme>("Analogous");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  // Track which swatch is being edited (hex input)
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // palett generation

  const generate = useCallback(() => {
    setSwatches((prev) => {
      const unlockedCount = prev.filter((s) => !s.locked).length;
      const newColors = generateHarmoniousPalette(unlockedCount);
      let newIdx = 0;
      return prev.map((s) =>
        s.locked ? s : { hex: newColors[newIdx++], locked: false },
      );
    });
  }, []);

  const applyScheme = useCallback(
    (s: Scheme) => {
      setScheme(s);
      const hue = Math.floor(Math.random() * 360);
      const sat = 55 + Math.floor(Math.random() * 25);
      const count = swatches.length;

      const buildHues = (): number[] => {
        switch (s) {
          case "Triadic":
            return Array.from(
              { length: count },
              (_, i) => (hue + (i % 3) * 120) % 360,
            );
          case "Complementary":
            return Array.from(
              { length: count },
              (_, i) => (hue + (i % 2) * 180) % 360,
            );
          case "Monochrome":
            return Array.from({ length: count }, () => hue);
          default: // Analogous
            return Array.from(
              { length: count },
              (_, i) => (hue + i * 20) % 360,
            );
        }
      };
      const hues = buildHues();
      const step = 70 / (count - 1 || 1);
      setSwatches(
        hues.map((h, i) => ({
          hex: hslToHex(
            h,
            s === "Monochrome" ? sat - 10 : sat,
            Math.round(20 + step * i),
          ),
          locked: false,
        })),
      );
    },
    [swatches.length],
  );

  //  swatch mutations

  const toggleLock = (idx: number) =>
    setSwatches((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, locked: !s.locked } : s)),
    );

  const updateColor = (idx: number, hex: string) =>
    setSwatches((prev) => prev.map((s, i) => (i === idx ? { ...s, hex } : s)));

  const addSwatch = () => {
    if (swatches.length >= MAX_COLORS) return;
    const randomHex = hslToHex(Math.floor(Math.random() * 360), 60, 55);
    setSwatches((prev) => [...prev, { hex: randomHex, locked: false }]);
  };

  const removeSwatch = (idx: number) => {
    if (swatches.length <= MIN_COLORS) return;
    setSwatches((prev) => prev.filter((_, i) => i !== idx));
  };

  //  hex text editing

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(swatches[idx].hex);
    setTimeout(() => inputRef.current?.select(), 10);
  };

  const commitEdit = () => {
    if (editingIdx === null) return;
    const valid = normaliseHex(editValue);
    if (valid) updateColor(editingIdx, valid);
    setEditingIdx(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditingIdx(null);
  };

  //  copy button

  const copyHex = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    const css = swatches
      .map((s, i) => `--color-${i + 1}: ${s.hex};`)
      .join("\n");
    await navigator.clipboard.writeText(css);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  // color render
  return (
    <div className="flex flex-col gap-6 h-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Color Palette
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate or build your own palette — click any hex to edit it
            manually
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyAll}
            className="gap-2"
          >
            {copiedAll ? (
              <Check className="w-3.5 h-3.5 text-tool-palette" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedAll ? "Copied!" : "Copy CSS"}
          </Button>
          <Button
            size="sm"
            onClick={generate}
            className="gap-2 bg-tool-palette text-white hover:bg-tool-palette/90"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Generate
          </Button>
        </div>
      </div>

      {/* Toolbar: scheme + count */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Scheme pills */}
        <div className="flex gap-1.5 flex-wrap">
          {SCHEMES.map((s) => (
            <button
              key={s}
              onClick={() => applyScheme(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                scheme === s
                  ? "bg-tool-palette/15 text-tool-palette border-tool-palette/35"
                  : "text-muted-foreground hover:bg-accent border-transparent hover:border-border",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Count control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Colors:</span>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => removeSwatch(swatches.length - 1)}
              disabled={swatches.length <= MIN_COLORS}
              className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-foreground tabular-nums">
              {swatches.length}
            </span>
            <button
              onClick={addSwatch}
              disabled={swatches.length >= MAX_COLORS}
              className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Palette strips */}
      <div className="flex flex-1 gap-2 min-h-0" style={{ minHeight: 320 }}>
        {swatches.map((swatch, idx) => {
          const light = isLight(swatch.hex);
          const [h, s, l] = hexToHsl(swatch.hex);
          const iconClass = light
            ? "text-black/60 hover:text-black/90"
            : "text-white/60 hover:text-white/90";
          const badgeClass = light
            ? "bg-black/10 text-black/60"
            : "bg-white/10 text-white/60";

          return (
            <div
              key={idx}
              className="flex-1 rounded-2xl flex flex-col justify-between overflow-hidden group transition-all duration-300 min-h-0 relative"
              style={{ background: swatch.hex, minWidth: 0 }}
            >
              {/* Top action row */}
              <div className="flex justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleLock(idx)}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all bg-black/10 hover:bg-black/20",
                    iconClass,
                  )}
                  title={swatch.locked ? "Unlock" : "Lock"}
                >
                  {swatch.locked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Unlock className="w-3 h-3" />
                  )}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyHex(swatch.hex, idx)}
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-all bg-black/10 hover:bg-black/20",
                      iconClass,
                    )}
                    title="Copy hex"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  {swatches.length > MIN_COLORS && (
                    <button
                      onClick={() => removeSwatch(idx)}
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-all bg-black/10 hover:bg-red-500/60 hover:text-white",
                        iconClass,
                      )}
                      title="Remove swatch"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Locked badge */}
              {swatch.locked && (
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      badgeClass,
                    )}
                  >
                    Locked
                  </span>
                </div>
              )}

              {/* Bottom info */}
              <div className="p-4 flex flex-col gap-2">
                {/* Native color picker (shows on hover) */}
                <label
                  className="block opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Pick color"
                >
                  <input
                    type="color"
                    value={swatch.hex}
                    onChange={(e) => updateColor(idx, e.target.value)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit",
                      badgeClass,
                    )}
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Pick
                  </span>
                </label>

                {/* Hex — click to edit inline */}
                {editingIdx === idx ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleEditKeyDown}
                    maxLength={7}
                    className={cn(
                      "font-mono text-sm font-semibold tracking-wide bg-transparent border-b outline-none w-full",
                      light
                        ? "text-black/90 border-black/30 caret-black"
                        : "text-white/90 border-white/30 caret-white",
                    )}
                    spellCheck={false}
                  />
                ) : (
                  <button
                    onClick={() => startEdit(idx)}
                    className={cn(
                      "font-mono text-sm font-semibold tracking-wide text-left hover:opacity-70 transition-opacity",
                      light ? "text-black/80" : "text-white/90",
                    )}
                    title="Click to edit hex"
                  >
                    {swatch.hex.toUpperCase()}
                  </button>
                )}

                <p
                  className={cn(
                    "font-mono text-xs",
                    light ? "text-black/45" : "text-white/45",
                  )}
                >
                  {h}° {s}% {l}%
                </p>
              </div>
            </div>
          );
        })}

        {/* Add swatch button */}
        {swatches.length < MAX_COLORS && (
          <button
            onClick={addSwatch}
            className="w-12 shrink-0 rounded-2xl border-2 border-dashed border-border hover:border-tool-palette/50 flex items-center justify-center text-muted-foreground hover:text-tool-palette transition-all duration-200 group"
            title="Add color"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        Click any hex label to edit it manually &middot; hover a swatch to lock,
        pick, copy, or remove
      </p>
    </div>
  );
}
