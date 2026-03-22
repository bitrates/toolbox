"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Download, Copy, Check, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BACKGROUNDS = [
  {
    id: "violet",
    label: "Violet",
    from: "#7c3aed",
    to: "#4338ca",
    class: "bg-gradient-to-br from-violet-600 to-indigo-700",
  },
  {
    id: "rose",
    label: "Rose",
    from: "#f43f5e",
    to: "#be185d",
    class: "bg-gradient-to-br from-rose-500 to-pink-700",
  },
  {
    id: "cyan",
    label: "Cyan",
    from: "#06b6d4",
    to: "#1d4ed8",
    class: "bg-gradient-to-br from-cyan-500 to-blue-700",
  },
  {
    id: "amber",
    label: "Amber",
    from: "#f59e0b",
    to: "#ea580c",
    class: "bg-gradient-to-br from-amber-400 to-orange-600",
  },
  {
    id: "emerald",
    label: "Emerald",
    from: "#10b981",
    to: "#0f766e",
    class: "bg-gradient-to-br from-emerald-400 to-teal-600",
  },
  {
    id: "night",
    label: "Night",
    from: "#1e293b",
    to: "#0f172a",
    class: "bg-gradient-to-br from-slate-700 to-slate-950",
  },
  {
    id: "peach",
    label: "Peach",
    from: "#fb923c",
    to: "#e11d48",
    class: "bg-gradient-to-br from-orange-400 to-rose-600",
  },
  {
    id: "lime",
    label: "Lime",
    from: "#a3e635",
    to: "#16a34a",
    class: "bg-gradient-to-br from-lime-400 to-green-600",
  },
  {
    id: "sky",
    label: "Sky",
    from: "#38bdf8",
    to: "#7c3aed",
    class: "bg-gradient-to-br from-sky-400 to-violet-600",
  },
  {
    id: "gold",
    label: "Gold",
    from: "#fde68a",
    to: "#d97706",
    class: "bg-gradient-to-br from-yellow-200 to-amber-600",
  },
  {
    id: "dusk",
    label: "Dusk",
    from: "#c026d3",
    to: "#1e40af",
    class: "bg-gradient-to-br from-fuchsia-600 to-blue-800",
  },
  {
    id: "forest",
    label: "Forest",
    from: "#4ade80",
    to: "#1e3a5f",
    class: "bg-gradient-to-br from-green-400 to-blue-900",
  },
];

const THEMES = [
  {
    id: "dark",
    label: "Dark",
    bg: "#0f0f0f",
    text: "#e2e8f0",
    comment: "#6b7280",
    keyword: "#a78bfa",
    string: "#34d399",
    number: "#fb923c",
  },
  {
    id: "light",
    label: "Light",
    bg: "#fafafa",
    text: "#1e293b",
    comment: "#94a3b8",
    keyword: "#7c3aed",
    string: "#059669",
    number: "#ea580c",
  },
  {
    id: "monokai",
    label: "Monokai",
    bg: "#272822",
    text: "#f8f8f2",
    comment: "#75715e",
    keyword: "#f92672",
    string: "#a6e22e",
    number: "#ae81ff",
  },
  {
    id: "nord",
    label: "Nord",
    bg: "#2e3440",
    text: "#d8dee9",
    comment: "#4c566a",
    keyword: "#81a1c1",
    string: "#a3be8c",
    number: "#b48ead",
  },
  {
    id: "dracula",
    label: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    comment: "#6272a4",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    number: "#bd93f9",
  },
  {
    id: "solarized",
    label: "Solarized",
    bg: "#002b36",
    text: "#839496",
    comment: "#586e75",
    keyword: "#268bd2",
    string: "#2aa198",
    number: "#d33682",
  },
];

const DEFAULT_CODE = `function greet(name) {
  const message = \`Hello, \${name}!\`
  console.log(message)
  return message
}

greet("World")`;

function syntaxHighlight(code: string, theme: (typeof THEMES)[0]) {
  return code
    .split("\n")
    .map((line) => {
      let l = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (/^\s*(\/\/.*)/.test(l)) {
        return l.replace(
          /(\/\/.*)/,
          `<span style="color:${theme.comment}">$1</span>`,
        );
      }

      const stringSlots: string[] = [];
      l = l.replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, (m) => {
        stringSlots.push(`<span style="color:${theme.string}">${m}</span>`);
        return `\x00STR${stringSlots.length - 1}\x00`;
      });

      l = l.replace(
        /\b(function|return|const|let|var|if|else|for|while|class|import|export|default|new|async|await|typeof|null|undefined|true|false)\b/g,
        `<span style="color:${theme.keyword}">$1</span>`,
      );

      l = l.replace(
        /\b(\d+)\b/g,
        `<span style="color:${theme.number}">$1</span>`,
      );
      l = l.replace(/\x00STR(\d+)\x00/g, (_, i) => stringSlots[Number(i)]);

      return l;
    })
    .join("\n");
}

// Extract plain text from a contentEditable element, preserving newlines
function getPlainText(el: HTMLElement): string {
  const lines: string[] = [];
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      lines.push(node.textContent ?? "");
    } else if (
      (node as HTMLElement).tagName === "DIV" ||
      (node as HTMLElement).tagName === "P"
    ) {
      lines.push((node as HTMLElement).innerText ?? "");
    } else if ((node as HTMLElement).tagName === "BR") {
      lines.push("");
    } else {
      lines.push((node as HTMLElement).innerText ?? node.textContent ?? "");
    }
  });
  return lines.join("\n");
}

export function CodeBeautifier() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [padding, setPadding] = useState(48);
  const [filename, setFilename] = useState("snippet.js");
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const isComposing = useRef(false);

  // Keep caret position across re-renders by not overwriting innerHTML while user is typing
  const highlighted = syntaxHighlight(code, theme);

  // On theme change, force refresh innerHTML (safe, user not actively editing)
  const lastThemeId = useRef(theme.id);
  useEffect(() => {
    if (lastThemeId.current !== theme.id && codeRef.current) {
      codeRef.current.innerHTML = highlighted;
      lastThemeId.current = theme.id;
    }
  }, [theme.id, highlighted]);

  // Initialize innerHTML on mount
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = highlighted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = useCallback(() => {
    if (isComposing.current || !codeRef.current) return;
    const plain = getPlainText(codeRef.current);
    setCode(plain);
  }, []);

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    if (codeRef.current) {
      codeRef.current.innerHTML = syntaxHighlight(DEFAULT_CODE, theme);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildSvg = () => {
    const lines = code.split("\n");
    const lineHeight = 22;
    const fontSize = 13;
    const charWidth = 7.8;
    const maxLineLen = Math.max(...lines.map((l) => l.length), 10);
    const codeW = Math.max(360, maxLineLen * charWidth + 48);
    const codeH = lines.length * lineHeight + 48;
    const chromH = 40;
    const totalW = codeW + padding * 2;
    const totalH = codeH + chromH + padding * 2;

    const codeStartX = padding + 20;
    const codeStartY = padding + chromH + 20;
    const textEls = lines
      .map((l, i) => {
        const escaped = l
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<text x="${codeStartX}" y="${codeStartY + i * lineHeight}" font-family="'Geist Mono', 'Fira Code', monospace" font-size="${fontSize}" fill="${theme.text}" xml:space="preserve">${escaped}</text>`;
      })
      .join("\n    ");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">
  <defs>
    <linearGradient id="outerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg.from}"/>
      <stop offset="100%" stop-color="${bg.to}"/>
    </linearGradient>
  </defs>
  <rect width="${totalW}" height="${totalH}" fill="url(#outerBg)" rx="20"/>
  <rect x="${padding}" y="${padding}" width="${codeW}" height="${codeH + chromH}" rx="12" fill="${theme.bg}"/>
  <rect x="${padding}" y="${padding + chromH - 1}" width="${codeW}" height="1" fill="${theme.text}" opacity="0.08"/>
  <circle cx="${padding + 16}" cy="${padding + 20}" r="5" fill="#ef4444" opacity="0.85"/>
  <circle cx="${padding + 32}" cy="${padding + 20}" r="5" fill="#eab308" opacity="0.85"/>
  <circle cx="${padding + 48}" cy="${padding + 20}" r="5" fill="#22c55e" opacity="0.85"/>
  <text x="${padding + codeW / 2}" y="${padding + 25}" text-anchor="middle" font-family="monospace" font-size="12" fill="${theme.text}" opacity="0.4">${filename.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  ${textEls}
</svg>`;
  };

  const exportAsSvg = () => {
    const blob = new Blob([buildSvg()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-snippet.svg";
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportAsPng = () => {
    const svg = buildSvg();
    const scale = 2;
    const wMatch = svg.match(/width="(\d+)"/);
    const hMatch = svg.match(/height="(\d+)"/);
    const w = wMatch ? parseInt(wMatch[1]) * scale : 800;
    const h = hMatch ? parseInt(hMatch[1]) * scale : 600;
    const img = new Image();
    img.crossOrigin = "anonymous";
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "code-snippet.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
    setExportOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Code Beautifier
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click directly on the code preview to edit
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-tool-code" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-muted-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-tool-code text-white hover:bg-tool-code/90"
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
          {/* Background */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Background
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBg(b)}
                  title={b.label}
                  className={cn(
                    "h-7 rounded-md transition-all",
                    b.class,
                    bg.id === b.id
                      ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-105"
                      : "opacity-60 hover:opacity-90 hover:scale-105",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Code Theme
            </label>
            <div className="flex flex-col gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all",
                    theme.id === t.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <span>{t.label}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-border shrink-0"
                    style={{ background: t.bg }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Padding — {padding}px
            </label>
            <input
              type="range"
              min={16}
              max={96}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-[var(--tool-code)]"
            />
          </div>
        </div>

        {/* Preview — click to edit directly */}
        <div className="flex-1 flex items-center justify-center rounded-xl bg-secondary/60 border border-border overflow-auto">
          <div
            className={cn("rounded-2xl shadow-2xl", bg.class)}
            style={{ padding, margin: 24 }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-xl"
              style={{ minWidth: 320 }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: theme.bg,
                  borderBottom: "1px solid rgba(128,128,128,0.12)",
                }}
              >
                <span className="w-3 h-3 rounded-full bg-red-500/80 shrink-0" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 shrink-0" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 shrink-0" />
                <input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="mx-auto text-xs font-mono bg-transparent border-none outline-none text-center w-32 opacity-40 hover:opacity-70 focus:opacity-90 transition-opacity"
                  style={{ color: theme.text }}
                  spellCheck={false}
                />
              </div>
              {/* Editable code — contentEditable with syntax highlighting */}
              <pre
                ref={codeRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onCompositionStart={() => {
                  isComposing.current = true;
                }}
                onCompositionEnd={() => {
                  isComposing.current = false;
                  handleInput();
                }}
                onKeyDown={(e) => {
                  // Allow Tab to insert spaces instead of losing focus
                  if (e.key === "Tab") {
                    e.preventDefault();
                    document.execCommand("insertText", false, "  ");
                  }
                }}
                spellCheck={false}
                className="p-5 text-sm leading-relaxed overflow-x-auto font-mono focus:outline-none cursor-text"
                style={{
                  background: theme.bg,
                  color: theme.text,
                  margin: 0,
                  whiteSpace: "pre",
                  minWidth: 320,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
