"use client"

import { useState, useMemo, useCallback } from "react"
import { Copy, Check, Download, ChevronDown, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MeshStyle = "noise" | "mesh" | "fluid" | "blob"

// Seeded pseudo-random for deterministic re-generation
function seededRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function buildNoiseSvg(
  style: MeshStyle,
  colors: string[],
  seed: number,
  complexity: number
): string {
  const rand = seededRand(seed)
  const size = 600
  const c = colors.length ? colors : ["#7c3aed", "#06b6d4", "#f59e0b"]

  if (style === "noise") {
    // Turbulence-based noise using SVG feTurbulence
    const freq = (0.008 + (complexity / 100) * 0.025).toFixed(4)
    const octaves = Math.round(2 + (complexity / 100) * 5)
    const stops = c.map((col, i) => `<stop offset="${Math.round((i / (c.length - 1)) * 100)}%" stop-color="${col}"/>`).join("")
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="${seed % 100}" result="nz"/>
      <feColorMatrix type="saturate" values="3" in="nz" result="colored"/>
      <feBlend in="SourceGraphic" in2="colored" mode="multiply"/>
    </filter>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <rect width="${size}" height="${size}" fill="url(#grad)" filter="url(#noise)" opacity="0.55"/>
</svg>`
  }

  if (style === "mesh") {
    const pts = Math.round(3 + (complexity / 100) * 5)
    let circles = ""
    for (let i = 0; i < pts * pts; i++) {
      const x = rand() * size
      const y = rand() * size
      const r = 60 + rand() * 160
      const col = c[Math.floor(rand() * c.length)]
      circles += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${col}" opacity="${(0.25 + rand() * 0.45).toFixed(2)}"/>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="bl"><feGaussianBlur stdDeviation="${20 + complexity * 0.4}"/></filter>
  </defs>
  <rect width="${size}" height="${size}" fill="${c[0]}"/>
  <g filter="url(#bl)">${circles}</g>
</svg>`
  }

  if (style === "fluid") {
    // Organic fluid blobs via bezier paths
    const numBlobs = Math.round(3 + (complexity / 100) * 6)
    let paths = ""
    for (let i = 0; i < numBlobs; i++) {
      const cx = rand() * size
      const cy = rand() * size
      const r = 80 + rand() * 140
      const pts2 = 5 + Math.round(rand() * 3)
      let d = ""
      for (let j = 0; j <= pts2; j++) {
        const angle = (j / pts2) * Math.PI * 2
        const rVar = r * (0.7 + rand() * 0.6)
        const x = cx + Math.cos(angle) * rVar
        const y = cy + Math.sin(angle) * rVar
        const cpAngle = angle - Math.PI / pts2
        const cpR = r * (0.8 + rand() * 0.4)
        const cpX = cx + Math.cos(cpAngle) * cpR
        const cpY = cy + Math.sin(cpAngle) * cpR
        d += j === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` Q${cpX.toFixed(1)},${cpY.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
      }
      d += "Z"
      const col = c[i % c.length]
      paths += `<path d="${d}" fill="${col}" opacity="${(0.3 + rand() * 0.45).toFixed(2)}"/>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="bl"><feGaussianBlur stdDeviation="${15 + complexity * 0.3}"/></filter>
  </defs>
  <rect width="${size}" height="${size}" fill="${c[c.length - 1]}"/>
  <g filter="url(#bl)">${paths}</g>
</svg>`
  }

  // blob: large overlapping circles with turbulence
  const numBlobs = Math.round(4 + (complexity / 100) * 8)
  let circles = ""
  for (let i = 0; i < numBlobs; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 100 + rand() * 180
    const col = c[i % c.length]
    circles += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r * (0.6 + rand() * 0.7)).toFixed(0)}" fill="${col}" opacity="${(0.4 + rand() * 0.4).toFixed(2)}"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="bl"><feGaussianBlur stdDeviation="${25 + complexity * 0.5}"/></filter>
    <filter id="noise2">
      <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="${seed % 50}" result="nz"/>
      <feDisplacementMap in="SourceGraphic" in2="nz" scale="${30 + complexity * 0.5}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="${c[0]}"/>
  <g filter="url(#bl)">${circles}</g>
</svg>`
}

const STYLE_OPTIONS: { id: MeshStyle; label: string; description: string }[] = [
  { id: "noise",  label: "Noise",  description: "SVG turbulence noise layered over gradient" },
  { id: "mesh",   label: "Mesh",   description: "Blurred color blobs forming a mesh gradient" },
  { id: "fluid",  label: "Fluid",  description: "Organic bezier blob shapes with blur" },
  { id: "blob",   label: "Blob",   description: "Large overlapping ellipses with displacement" },
]

const DEFAULT_PALETTES = [
  ["#7c3aed", "#06b6d4", "#10b981"],
  ["#f59e0b", "#ef4444", "#7c3aed"],
  ["#0ea5e9", "#2563eb", "#1e1b4b"],
  ["#d946ef", "#8b5cf6", "#06b6d4"],
  ["#f43f5e", "#fb923c", "#fde68a"],
  ["#a3e635", "#22c55e", "#0d9488"],
]

export function NoiseMesh() {
  const [style, setStyle] = useState<MeshStyle>("mesh")
  const [colors, setColors] = useState(["#7c3aed", "#06b6d4", "#10b981"])
  const [complexity, setComplexity] = useState(50)
  const [seed, setSeed] = useState(42)
  const [copied, setCopied] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const svgString = useMemo(
    () => buildNoiseSvg(style, colors, seed, complexity),
    [style, colors, seed, complexity]
  )

  const svgDataUrl = useMemo(
    () => `data:image/svg+xml,${encodeURIComponent(svgString)}`,
    [svgString]
  )

  const randomize = () => setSeed(Math.floor(Math.random() * 9999))

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgString)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const exportAsSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `noise-${style}.svg`
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const exportAsPng = () => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 1200
      canvas.height = 1200
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0, 1200, 1200)
      URL.revokeObjectURL(url)
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return
        const pngUrl = URL.createObjectURL(pngBlob)
        const a = document.createElement("a")
        a.href = pngUrl
        a.download = `noise-${style}.png`
        a.click()
        URL.revokeObjectURL(pngUrl)
      }, "image/png")
    }
    img.src = url
    setExportOpen(false)
  }

  const updateColor = (i: number, val: string) => {
    setColors((prev) => prev.map((c, idx) => (idx === i ? val : c)))
  }

  const addColor = () => setColors((prev) => (prev.length < 5 ? [...prev, "#ffffff"] : prev))
  const removeColor = (i: number) => setColors((prev) => prev.length > 2 ? prev.filter((_, idx) => idx !== i) : prev)

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Noise & Mesh</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate abstract noise, mesh, and fluid SVG backgrounds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={randomize} className="gap-2">
            <Shuffle className="w-3.5 h-3.5" />
            Randomize
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-violet-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy SVG"}
          </Button>
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export
              <ChevronDown className="w-3 h-3" />
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <button onClick={exportAsPng} className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors font-medium">Export PNG</button>
                <button onClick={exportAsSvg} className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors font-medium">Export SVG</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Controls */}
        <div className="flex flex-col gap-5 w-56 shrink-0 overflow-y-auto pr-1">
          {/* Style */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Style</label>
            <div className="flex flex-col gap-1">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "flex flex-col px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                    style === s.id
                      ? "bg-violet-50 text-violet-700 border border-violet-200"
                      : "text-muted-foreground hover:bg-accent border border-transparent"
                  )}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs opacity-70">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</label>
              <button onClick={addColor} disabled={colors.length >= 5} className="text-xs text-violet-600 hover:opacity-70 disabled:opacity-30">+ Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="w-9 h-9 rounded-lg border border-border cursor-pointer overflow-hidden shrink-0 block relative">
                    <input
                      type="color"
                      value={c}
                      onChange={(e) => updateColor(i, e.target.value)}
                      className="absolute opacity-0 cursor-pointer"
                      style={{ width: "200%", height: "200%", top: "-50%", left: "-50%" }}
                    />
                    <span className="block w-full h-full" style={{ background: c }} />
                  </label>
                  <span className="font-mono text-sm text-foreground flex-1">{c.toUpperCase()}</span>
                  <button onClick={() => removeColor(i)} disabled={colors.length <= 2}
                    className="text-muted-foreground text-xs hover:text-destructive disabled:opacity-20">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick palettes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Palettes</label>
            <div className="grid grid-cols-3 gap-1.5">
              {DEFAULT_PALETTES.map((p, i) => (
                <button key={i} onClick={() => setColors(p)} title="Apply palette"
                  className="h-7 rounded-md overflow-hidden border border-border hover:scale-105 transition-transform">
                  <div className="flex h-full">
                    {p.map((col, j) => (
                      <div key={j} className="flex-1" style={{ background: col }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Complexity — {complexity}</label>
            <input type="range" min={0} max={100} value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full accent-violet-600" />
          </div>

          {/* Seed */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Seed — {seed}</label>
            <input type="range" min={0} max={9999} value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-full accent-violet-600" />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 rounded-xl border border-border overflow-hidden min-h-0 bg-secondary/40">
          <img
            src={svgDataUrl}
            alt="Generated background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
