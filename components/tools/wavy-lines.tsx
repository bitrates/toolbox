"use client";

// this tool is not that great, i will replace it soon

import { useState, useMemo } from "react";
import { Copy, Check, Download, ChevronDown, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WaveStyle = "sine" | "coil" | "oscillate" | "ripple";

function buildWaveSvg(
  style: WaveStyle,
  fgColor: string,
  bgColor: string,
  amplitude: number,
  frequency: number,
  strokeWidth: number,
  lineCount: number,
  seed: number,
): string {
  const W = 800;
  const H = 600;
  const lines: string[] = [];

  function seededRand(s: number) {
    let st = s;
    return () => {
      st = (st * 1664525 + 1013904223) & 0xffffffff;
      return (st >>> 0) / 0xffffffff;
    };
  }
  const rand = seededRand(seed);

  for (let li = 0; li < lineCount; li++) {
    const progress = li / (lineCount - 1);
    const yBase = progress * H * 1.1 - H * 0.05;
    const phaseShift = (li / lineCount) * Math.PI * 2 + (rand() - 0.5) * 0.5;
    const amp = amplitude * (0.6 + rand() * 0.8);
    const freq = frequency * (0.8 + rand() * 0.4);
    const opacity = (0.35 + progress * 0.65).toFixed(2);

    if (style === "sine") {
      const steps = 200;
      let d = `M 0 ${yBase + amplitude}`;
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * W;
        const y =
          yBase + Math.sin((i / steps) * Math.PI * 2 * freq + phaseShift) * amp;
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      lines.push(
        `<path d="${d}" fill="none" stroke="${fgColor}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round"/>`,
      );
    }

    if (style === "coil") {
      // Spiral coil lines
      const turns = freq * 1.5;
      const steps = 300;
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 2 * turns + phaseShift;
        const r = (10 + amp * t) * (0.5 + 0.5 * Math.sin(angle * 0.3));
        const x =
          W / 2 + Math.cos(angle) * r * (W / (2 * amp + 20)) * (0.2 + t * 0.8);
        const y = yBase + Math.sin(angle) * amp * 0.5;
        d +=
          i === 0
            ? `M ${x.toFixed(1)} ${y.toFixed(1)}`
            : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      lines.push(
        `<path d="${d}" fill="none" stroke="${fgColor}" stroke-width="${strokeWidth * 0.8}" opacity="${opacity}" stroke-linecap="round"/>`,
      );
    }

    if (style === "oscillate") {
      // Curvy line with alternating amplitude
      const steps = 160;
      let d = `M 0 ${yBase}`;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = t * W;
        const y =
          yBase +
          Math.sin(t * Math.PI * 2 * freq + phaseShift) *
            amp *
            Math.sin(t * Math.PI * freq * 0.5);
        d += ` C ${(x - (W / steps) * 0.7).toFixed(1)} ${(y + amp * 0.2 * Math.cos(t * 10)).toFixed(1)}, ${(x - (W / steps) * 0.3).toFixed(1)} ${y.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      lines.push(
        `<path d="${d}" fill="none" stroke="${fgColor}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`,
      );
    }

    if (style === "ripple") {
      // Concentric ripple circles emanating from center
      const cx = W / 2 + (rand() - 0.5) * W * 0.3;
      const cy = H / 2 + (rand() - 0.5) * H * 0.3;
      const baseR = (li / lineCount) * Math.max(W, H) * 0.7 + 10;
      const numPts = 120;
      let d = "";
      for (let i = 0; i <= numPts; i++) {
        const angle = (i / numPts) * Math.PI * 2;
        const r = baseR + Math.sin(angle * freq + phaseShift) * amp * 0.4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        d +=
          i === 0
            ? `M ${x.toFixed(1)} ${y.toFixed(1)}`
            : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      d += "Z";
      lines.push(
        `<path d="${d}" fill="none" stroke="${fgColor}" stroke-width="${strokeWidth * 0.7}" opacity="${opacity}"/>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bgColor}"/>
  ${lines.join("\n  ")}
</svg>`;
}

const STYLES: { id: WaveStyle; label: string }[] = [
  { id: "sine", label: "Sine Wave" },
  { id: "oscillate", label: "Oscillate" },
  { id: "coil", label: "Coil" },
  { id: "ripple", label: "Ripple" },
];

export function WavyLines() {
  const [style, setStyle] = useState<WaveStyle>("sine");
  const [fgColor, setFgColor] = useState("#7c3aed");
  const [bgColor, setBgColor] = useState("#f5f3ff");
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(3);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [lineCount, setLineCount] = useState(20);
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const svgString = useMemo(
    () =>
      buildWaveSvg(
        style,
        fgColor,
        bgColor,
        amplitude,
        frequency,
        strokeWidth,
        lineCount,
        seed,
      ),
    [
      style,
      fgColor,
      bgColor,
      amplitude,
      frequency,
      strokeWidth,
      lineCount,
      seed,
    ],
  );

  const svgDataUrl = useMemo(
    () => `data:image/svg+xml,${encodeURIComponent(svgString)}`,
    [svgString],
  );

  const randomize = () => setSeed(Math.floor(Math.random() * 9999));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportAsSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waves-${style}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportAsPng = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 1600, 1200);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `waves-${style}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
    setExportOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Wavy Lines</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate flowing sine waves, coils, ripples and oscillating lines
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={randomize}
            className="gap-2"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Randomize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-sky-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy SVG"}
          </Button>
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-sky-600 text-white hover:bg-sky-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export
              <ChevronDown className="w-3 h-3" />
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={exportAsPng}
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors font-medium"
                >
                  Export PNG
                </button>
                <button
                  onClick={exportAsSvg}
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors font-medium"
                >
                  Export SVG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Controls */}
        <div className="flex flex-col gap-5 w-56 shrink-0 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Style
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    style === s.id
                      ? "bg-sky-50 text-sky-700 border border-sky-200"
                      : "text-muted-foreground hover:bg-accent border border-transparent",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Colors
            </label>
            {[
              { label: "Line", value: fgColor, set: setFgColor },
              { label: "Background", value: bgColor, set: setBgColor },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center gap-3">
                <label className="w-9 h-9 rounded-lg border border-border cursor-pointer overflow-hidden shrink-0 block relative">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="absolute opacity-0 cursor-pointer"
                    style={{
                      width: "200%",
                      height: "200%",
                      top: "-50%",
                      left: "-50%",
                    }}
                  />
                  <span
                    className="block w-full h-full"
                    style={{ background: value }}
                  />
                </label>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-mono text-sm text-foreground">
                    {value.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {[
            {
              label: "Amplitude",
              value: amplitude,
              set: setAmplitude,
              min: 5,
              max: 120,
            },
            {
              label: "Frequency",
              value: frequency,
              set: setFrequency,
              min: 1,
              max: 12,
              step: 0.5,
            },
            {
              label: "Stroke Width",
              value: strokeWidth,
              set: setStrokeWidth,
              min: 0.5,
              max: 6,
              step: 0.5,
            },
            {
              label: "Line Count",
              value: lineCount,
              set: setLineCount,
              min: 3,
              max: 60,
            },
          ].map(({ label, value, set, min, max, step }) => (
            <div key={label} className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label} — {value}
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step={step ?? 1}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Seed — {seed}
            </label>
            <input
              type="range"
              min={0}
              max={999}
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 rounded-xl border border-border overflow-hidden min-h-0">
          <img
            src={svgDataUrl}
            alt="Wave preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
