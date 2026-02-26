"use client"

import { useState, useMemo } from "react"
import { Copy, Check, Code, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PatternId = "dots" | "wavy-dots" | "grid" | "hexagons" | "diagonal" | "waves" | "crosshatch" | "circles"

function buildPattern(
  id: PatternId,
  fg: string,
  bg: string,
  size: number,
  opacity: number
): { svgContent: string; css: string; svgDataUrl: string } {
  const op = (opacity / 100).toFixed(2)

  let svgContent = ""
  let bw = size
  let bh = size

  switch (id) {
    case "dots": {
      const r = Math.max(1, Math.round(size * 0.12))
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${bg}'/><circle cx='${size / 2}' cy='${size / 2}' r='${r}' fill='${fg}' opacity='${op}'/></svg>`
      break
    }
    case "wavy-dots": {
      // Grid of dots with sinusoidal size variation creating a 3D wave illusion
      const cols = 8
      const rows = 8
      const cellW = size / cols
      const cellH = size / cols
      bw = size
      bh = size
      const maxR = cellW * 0.38
      const minR = cellW * 0.08
      let dots = ""
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * cellW + cellW / 2
          const cy = row * cellH + cellH / 2
          // Wave: combination of col + row phase
          const phase = (col + row) / (cols + rows - 2)
          const wave = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5
          const r = minR + (maxR - minR) * wave
          // Opacity also varies for extra depth
          const dotOp = ((0.35 + wave * 0.65) * (opacity / 100)).toFixed(2)
          dots += `<circle cx='${cx.toFixed(1)}' cy='${cy.toFixed(1)}' r='${r.toFixed(1)}' fill='${fg}' opacity='${dotOp}'/>`
        }
      }
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${bw}' height='${bh}'><rect width='${bw}' height='${bh}' fill='${bg}'/>${dots}</svg>`
      break
    }
    case "grid": {
      const sw = Math.max(1, Math.round(size * 0.04))
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${bg}'/><path d='M ${size} 0 L 0 0 0 ${size}' fill='none' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/></svg>`
      break
    }
    case "hexagons": {
      const h = Math.round(size * 0.866)
      bh = h
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${h}'><rect width='${size}' height='${h}' fill='${bg}'/><polygon points='${size * 0.5},0 ${size},${h * 0.25} ${size},${h * 0.75} ${size * 0.5},${h} 0,${h * 0.75} 0,${h * 0.25}' fill='none' stroke='${fg}' stroke-width='${Math.max(1, size * 0.03)}' opacity='${op}'/></svg>`
      break
    }
    case "diagonal": {
      const sw = Math.max(1, Math.round(size * 0.04))
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${bg}'/><line x1='0' y1='${size}' x2='${size}' y2='0' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/><line x1='-${size / 2}' y1='${size}' x2='${size / 2}' y2='0' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/><line x1='${size / 2}' y1='${size}' x2='${size * 1.5}' y2='0' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/></svg>`
      break
    }
    case "waves": {
      const amp = Math.round(size * 0.2)
      bw = size * 2
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size * 2}' height='${size}'><rect width='${size * 2}' height='${size}' fill='${bg}'/><path d='M 0 ${size / 2} Q ${size / 2} ${size / 2 - amp} ${size} ${size / 2} Q ${size * 1.5} ${size / 2 + amp} ${size * 2} ${size / 2}' fill='none' stroke='${fg}' stroke-width='${Math.max(1, size * 0.04)}' opacity='${op}'/></svg>`
      break
    }
    case "crosshatch": {
      const sw = Math.max(1, Math.round(size * 0.03))
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${bg}'/><line x1='0' y1='0' x2='${size}' y2='${size}' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/><line x1='${size}' y1='0' x2='0' y2='${size}' stroke='${fg}' stroke-width='${sw}' opacity='${op}'/></svg>`
      break
    }
    case "circles": {
      const r = Math.round(size * 0.35)
      svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${bg}'/><circle cx='${size / 2}' cy='${size / 2}' r='${r}' fill='none' stroke='${fg}' stroke-width='${Math.max(1, size * 0.03)}' opacity='${op}'/></svg>`
      break
    }
  }

  const encoded = encodeURIComponent(svgContent)
  const svgDataUrl = `url("data:image/svg+xml,${encoded}")`
  const css = `background-color: ${bg};\nbackground-image: ${svgDataUrl};\nbackground-size: ${bw}px ${bh}px;`

  return { svgContent, css, svgDataUrl }
}

const PATTERNS: { id: PatternId; label: string }[] = [
  { id: "dots",      label: "Dots" },
  { id: "wavy-dots", label: "Wavy Dots" },
  { id: "grid",      label: "Grid" },
  { id: "hexagons",  label: "Hexagons" },
  { id: "diagonal",  label: "Diagonal" },
  { id: "waves",     label: "Waves" },
  { id: "crosshatch",label: "Crosshatch" },
  { id: "circles",   label: "Circles" },
]

export function SvgPatterns() {
  const [patternId, setPatternId] = useState<PatternId>("wavy-dots")
  const [fgColor, setFgColor] = useState("#7c3aed")
  const [bgColor, setBgColor] = useState("#f5f3ff")
  const [size, setSize] = useState(48)
  const [opacity, setOpacity] = useState(80)
  const [copiedCss, setCopiedCss] = useState(false)
  const [copiedSvg, setCopiedSvg] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const { svgContent, css, svgDataUrl } = useMemo(
    () => buildPattern(patternId, fgColor, bgColor, size, opacity),
    [patternId, fgColor, bgColor, size, opacity]
  )

  const handleCopyCss = async () => {
    await navigator.clipboard.writeText(css)
    setCopiedCss(true)
    setTimeout(() => setCopiedCss(false), 1500)
  }

  const handleCopySvg = async () => {
    await navigator.clipboard.writeText(svgContent)
    setCopiedSvg(true)
    setTimeout(() => setCopiedSvg(false), 1500)
  }

  const exportAsSvg = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pattern-${patternId}.svg`
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const exportAsPng = () => {
    const exportSize = 800
    const img = new Image()
    img.crossOrigin = "anonymous"
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" })
    const svgUrl = URL.createObjectURL(svgBlob)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = exportSize
      canvas.height = exportSize
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, exportSize, exportSize)
      const tileW = img.width || size
      const tileH = img.height || size
      for (let y = 0; y < exportSize; y += tileH) {
        for (let x = 0; x < exportSize; x += tileW) {
          ctx.drawImage(img, x, y, tileW, tileH)
        }
      }
      URL.revokeObjectURL(svgUrl)
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `pattern-${patternId}.png`
        a.click()
        URL.revokeObjectURL(url)
      })
    }
    img.src = svgUrl
    setExportOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">SVG Pattern Generator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate tiling SVG backgrounds — copy as CSS or export</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopySvg} className="gap-2">
            {copiedSvg ? <Check className="w-3.5 h-3.5 text-tool-svg" /> : <Code className="w-3.5 h-3.5" />}
            {copiedSvg ? "Copied!" : "Copy SVG"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyCss} className="gap-2">
            {copiedCss ? <Check className="w-3.5 h-3.5 text-tool-svg" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCss ? "Copied!" : "Copy CSS"}
          </Button>
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-tool-svg text-white hover:bg-tool-svg/90"
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
        <div className="flex flex-col gap-5 w-56 shrink-0">

          {/* Pattern Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pattern</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatternId(p.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                    patternId === p.id
                      ? "bg-tool-svg/15 text-tool-svg border border-tool-svg/30"
                      : "text-muted-foreground hover:bg-accent border border-transparent"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</label>
            <div className="flex flex-col gap-2">
              {[
                { label: "Pattern", value: fgColor, set: setFgColor },
                { label: "Background", value: bgColor, set: setBgColor },
              ].map(({ label, value, set }) => (
                <div key={label} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-secondary"
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-mono text-sm text-foreground">{value.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tile size — {size}px</label>
            <input type="range" min={10} max={120} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[var(--tool-svg)]" />
          </div>

          {/* Opacity */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Opacity — {opacity}%</label>
            <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[var(--tool-svg)]" />
          </div>
        </div>

        {/* Preview + CSS */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div
            className="flex-1 rounded-xl border border-border overflow-hidden min-h-0"
            style={{
              backgroundColor: bgColor,
              backgroundImage: svgDataUrl,
            }}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CSS Output</label>
            <pre className="bg-secondary rounded-xl p-4 text-xs font-mono text-foreground overflow-x-auto border border-border leading-relaxed">
              {css}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
