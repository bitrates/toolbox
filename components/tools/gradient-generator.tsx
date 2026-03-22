"use client"

import { useState, useMemo, useRef } from "react"
import { Plus, Trash2, Copy, Check, Shuffle, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GradientType = "linear" | "radial" | "conic"

interface ColorStop {
  id: string
  color: string
  position: number
}

const PRESETS = [
  { label: "Aurora",  stops: [{ color: "#7c3aed", pos: 0 }, { color: "#06b6d4", pos: 50 }, { color: "#10b981", pos: 100 }] },
  { label: "Sunset",  stops: [{ color: "#f59e0b", pos: 0 }, { color: "#ef4444", pos: 50 }, { color: "#7c3aed", pos: 100 }] },
  { label: "Ocean",   stops: [{ color: "#0ea5e9", pos: 0 }, { color: "#2563eb", pos: 50 }, { color: "#1e1b4b", pos: 100 }] },
  { label: "Fire",    stops: [{ color: "#fde68a", pos: 0 }, { color: "#f97316", pos: 40 }, { color: "#7f1d1d", pos: 100 }] },
  { label: "Neon",    stops: [{ color: "#d946ef", pos: 0 }, { color: "#8b5cf6", pos: 50 }, { color: "#06b6d4", pos: 100 }] },
  { label: "Mint",    stops: [{ color: "#a7f3d0", pos: 0 }, { color: "#34d399", pos: 50 }, { color: "#065f46", pos: 100 }] },
]

function genId() { return Math.random().toString(36).slice(2) }

function randomColor(): string {
  const h = Math.floor(Math.random() * 360)
  const s = 60 + Math.floor(Math.random() * 30)
  const l = 40 + Math.floor(Math.random() * 30)
  const sl = s / 100, ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function GradientGenerator() {
  const [type, setType] = useState<GradientType>("linear")
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<ColorStop[]>([
    { id: genId(), color: "#7c3aed", position: 0 },
    { id: genId(), color: "#06b6d4", position: 50 },
    { id: genId(), color: "#10b981", position: 100 },
  ])
  const [blurAmount, setBlurAmount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const cssValue = useMemo(() => {
    const stopsStr = [...stops]
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ")
    switch (type) {
      case "linear": return `linear-gradient(${angle}deg, ${stopsStr})`
      case "radial":  return `radial-gradient(circle, ${stopsStr})`
      case "conic":   return `conic-gradient(from ${angle}deg, ${stopsStr})`
    }
  }, [type, angle, stops])

  const cssOutput = blurAmount > 0
    ? `background: ${cssValue};\nfilter: blur(${blurAmount}px);`
    : `background: ${cssValue};`

  const addStop = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position)
    const last = sorted[sorted.length - 1]?.position ?? 80
    setStops((prev) => [...prev, { id: genId(), color: randomColor(), position: Math.min(100, last + 10) }])
  }

  const removeStop = (id: string) => {
    if (stops.length <= 2) return
    setStops((prev) => prev.filter((s) => s.id !== id))
  }

  const updateStop = (id: string, field: "color" | "position", value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setStops(preset.stops.map((s) => ({ id: genId(), color: s.color, position: s.pos })))
  }

  const randomize = () => {
    setAngle(Math.floor(Math.random() * 360))
    setStops((prev) => prev.map((s) => ({ ...s, color: randomColor() })))
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const exportAsPng = () => {
    const size = 800
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const sorted = [...stops].sort((a, b) => a.position - b.position)

    if (type === "linear") {
      // Match CSS linear-gradient angle convention: 0deg = bottom to top, 90deg = left to right
      const cssRad = ((angle - 90) * Math.PI) / 180
      const cx = size / 2, cy = size / 2
      const len = size / 2
      const x0 = cx - Math.cos(cssRad) * len
      const y0 = cy - Math.sin(cssRad) * len
      const x1 = cx + Math.cos(cssRad) * len
      const y1 = cy + Math.sin(cssRad) * len
      const grad = ctx.createLinearGradient(x0, y0, x1, y1)
      sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color))
      ctx.fillStyle = grad
    } else if (type === "radial") {
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color))
      ctx.fillStyle = grad
    } else {
      // conic fallback — approximate with linear
      const grad = ctx.createLinearGradient(0, 0, size, size)
      sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color))
      ctx.fillStyle = grad
    }

    if (blurAmount > 0) ctx.filter = `blur(${blurAmount}px)`
    ctx.fillRect(0, 0, size, size)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "gradient.png"
      a.click()
      URL.revokeObjectURL(url)
    })
    setExportOpen(false)
  }

  const exportAsSvg = () => {
    const size = 800
    const sorted = [...stops].sort((a, b) => a.position - b.position)
    const stopsXml = sorted.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}"/>`).join("\n    ")
    const blurFilter = blurAmount > 0
      ? `<filter id="bl"><feGaussianBlur stdDeviation="${blurAmount}"/></filter>`
      : ""
    const filterAttr = blurAmount > 0 ? ` filter="url(#bl)"` : ""

    let gradDef = ""
    if (type === "linear") {
      // Convert CSS angle (0=up, clockwise) to SVG gradient vector
      // CSS angle 0deg = top to bottom in CSS but SVG uses math angle
      // Convert: SVG x1,y1 -> x2,y2 based on CSS angle convention
      const cssRad = ((angle - 90) * Math.PI) / 180
      const x1 = 50 - Math.cos(cssRad) * 50
      const y1 = 50 - Math.sin(cssRad) * 50
      const x2 = 50 + Math.cos(cssRad) * 50
      const y2 = 50 + Math.sin(cssRad) * 50
      gradDef = `<linearGradient id="g" x1="${x1.toFixed(2)}%" y1="${y1.toFixed(2)}%" x2="${x2.toFixed(2)}%" y2="${y2.toFixed(2)}%">${stopsXml}</linearGradient>`
    } else if (type === "radial") {
      gradDef = `<radialGradient id="g" cx="50%" cy="50%" r="50%">${stopsXml}</radialGradient>`
    } else {
      // conic — approximate with linear for SVG since SVG conic support is limited
      const cssRad = ((angle - 90) * Math.PI) / 180
      const x1 = 50 - Math.cos(cssRad) * 50
      const y1 = 50 - Math.sin(cssRad) * 50
      const x2 = 50 + Math.cos(cssRad) * 50
      const y2 = 50 + Math.sin(cssRad) * 50
      gradDef = `<linearGradient id="g" x1="${x1.toFixed(2)}%" y1="${y1.toFixed(2)}%" x2="${x2.toFixed(2)}%" y2="${y2.toFixed(2)}%">${stopsXml}</linearGradient>`
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${gradDef}${blurFilter}</defs>
  <rect width="${size}" height="${size}" fill="url(#g)"${filterAttr}/>
</svg>`

    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "gradient.svg"
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Gradient Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Build beautiful CSS gradients with full control over stops and blur</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={randomize} className="gap-2">
            <Shuffle className="w-3.5 h-3.5" />
            Randomize
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-tool-gradient" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy CSS"}
          </Button>
          {/* Export dropdown */}
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-tool-gradient text-white hover:bg-tool-gradient/90"
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
        <div className="flex flex-col gap-5 w-60 shrink-0 overflow-y-auto">

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</label>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                    type === t ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {(type === "linear" || type === "conic") && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Angle — {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--tool-gradient)]" />
            </div>
          )}

          {/* Blur */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Blur — {blurAmount}px</label>
            <input type="range" min={0} max={40} value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} className="w-full accent-[var(--tool-gradient)]" />
          </div>

          {/* Color stops */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color Stops</label>
              <button onClick={addStop} className="flex items-center gap-1 text-xs text-tool-gradient hover:opacity-70 transition-opacity">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {/* Render stops in insertion order so rows never jump while dragging */}
              {stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2 bg-secondary rounded-lg p-2 border border-border">
                  {/* Full-bleed color swatch — wrapper clips the native color input */}
                  <label className="w-8 h-8 rounded-md border border-border cursor-pointer overflow-hidden shrink-0 block relative">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      style={{ width: "200%", height: "200%", top: "-50%", left: "-50%" }}
                    />
                    <span className="block w-full h-full" style={{ background: stop.color }} />
                  </label>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground">{stop.color.toUpperCase()}</span>
                    <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))} className="w-full accent-[var(--tool-gradient)] h-1" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-8 text-right shrink-0">{stop.position}%</span>
                  <button onClick={() => removeStop(stop.id)} disabled={stops.length <= 2} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Presets</label>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESETS.map((p) => {
                const gradientStyle = `linear-gradient(135deg, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`
                return (
                  <button key={p.label} onClick={() => applyPreset(p)} title={p.label} className="flex flex-col gap-1 group">
                    <div className="h-8 rounded-lg w-full transition-all opacity-80 group-hover:opacity-100 group-hover:ring-2 group-hover:ring-foreground/20 group-hover:ring-offset-1 group-hover:ring-offset-background" style={{ background: gradientStyle }} />
                    <span className="text-xs text-muted-foreground text-center group-hover:text-foreground transition-colors">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Preview + output */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div
            ref={previewRef}
            className="flex-1 rounded-2xl border border-border overflow-hidden min-h-0"
            style={{
              background: cssValue,
              filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
            }}
          />
          <div className="h-6 rounded-full border border-border" style={{ background: cssValue }} />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CSS Output</label>
            <pre className="bg-secondary rounded-xl p-4 text-xs font-mono text-foreground overflow-x-auto border border-border leading-relaxed whitespace-pre-wrap break-all">
              {cssOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
