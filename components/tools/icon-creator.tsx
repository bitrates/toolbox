"use client"

import { useState, useRef } from "react"
import * as LucideIcons from "lucide-react"
import { Download, Copy, Check, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const ICON_NAMES = [
  "Zap", "Star", "Heart", "Flame", "Bolt", "Sun", "Moon", "Cloud", "Rainbow",
  "Rocket", "Sparkles", "Diamond", "Crown", "Shield", "Sword", "Key", "Lock",
  "Globe", "Map", "Compass", "Anchor", "Wave", "Leaf", "Tree", "Flower",
  "Coffee", "Pizza", "Music", "Headphones", "Camera", "Film", "Gamepad2",
  "Trophy", "Medal", "Gift", "Box", "Package", "Archive", "Layers",
  "Code2", "Terminal", "Database", "Server", "Cpu", "Wifi", "Bluetooth",
  "Monitor", "Smartphone", "Tablet", "Laptop", "Mouse", "Keyboard",
  "Mail", "MessageCircle", "Bell", "Calendar", "Clock", "Timer",
  "Home", "Building", "Store", "Library", "School", "Hospital",
  "Car", "Plane", "Train", "Bike", "Bus", "Ship",
  "Apple", "Cherry", "Grape", "Banana", "Lemon",
  "Pencil", "Pen", "Highlighter", "Eraser", "Ruler",
  "Microscope", "Telescope", "Atom", "Dna", "Beaker",
]

const GRADIENTS = [
  { id: "violet-indigo", label: "Violet", from: "#7c3aed", to: "#4338ca" },
  { id: "rose-pink", label: "Rose", from: "#f43f5e", to: "#db2777" },
  { id: "cyan-blue", label: "Cyan", from: "#06b6d4", to: "#2563eb" },
  { id: "amber-orange", label: "Amber", from: "#f59e0b", to: "#ea580c" },
  { id: "emerald-teal", label: "Emerald", from: "#10b981", to: "#0d9488" },
  { id: "fuchsia-purple", label: "Fuchsia", from: "#d946ef", to: "#9333ea" },
  { id: "lime-green", label: "Lime", from: "#84cc16", to: "#16a34a" },
  { id: "slate", label: "Slate", from: "#475569", to: "#1e293b" },
]

const BG_SHAPES = ["rounded-2xl", "rounded-full", "rounded-xl", "rounded-none"]
const SIZES = [64, 96, 128, 192]

export function IconCreator() {
  const [search, setSearch] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("Rocket")
  const [gradient, setGradient] = useState(GRADIENTS[0])
  const [bgShape, setBgShape] = useState("rounded-2xl")
  const [iconSize, setIconSize] = useState(96)
  const [iconColor, setIconColor] = useState("#ffffff")
  const [strokeWidth, setStrokeWidth] = useState(1.5)
  const [copied, setCopied] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const filteredIcons = ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[selectedIcon] as React.ElementType | undefined

  const previewSize = iconSize
  const containerSize = Math.round(previewSize * 1.6)
  const iconRenderSize = Math.round(previewSize * 0.5)

  const rx = bgShape === "rounded-full" ? containerSize / 2 : bgShape === "rounded-none" ? 0 : bgShape === "rounded-2xl" ? 24 : 16

  const buildSvgString = () => {
    const half = containerSize / 2
    const iconR = iconRenderSize / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient.from}"/>
      <stop offset="100%" stop-color="${gradient.to}"/>
    </linearGradient>
  </defs>
  <rect width="${containerSize}" height="${containerSize}" rx="${rx}" fill="url(#bg)"/>
</svg>`
  }

  const handleCopySvg = async () => {
    await navigator.clipboard.writeText(buildSvgString())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const exportAsSvg = () => {
    const blob = new Blob([buildSvgString()], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `icon-${selectedIcon.toLowerCase()}.svg`
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const exportAsPng = () => {
    const canvas = document.createElement("canvas")
    canvas.width = containerSize
    canvas.height = containerSize
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const grad = ctx.createLinearGradient(0, 0, containerSize, containerSize)
    grad.addColorStop(0, gradient.from)
    grad.addColorStop(1, gradient.to)
    ctx.fillStyle = grad
    if (rx > 0) {
      ctx.beginPath()
      ctx.roundRect(0, 0, containerSize, containerSize, rx)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, containerSize, containerSize)
    }
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `icon-${selectedIcon.toLowerCase()}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
    setExportOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Icon Creator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pick an icon, style it with gradients and export</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopySvg} className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-tool-icon" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy SVG"}
          </Button>
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              className="gap-1.5 bg-tool-icon text-white hover:bg-tool-icon/90"
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
        {/* Left: Controls */}
        <div className="flex flex-col gap-5 w-56 shrink-0 overflow-y-auto">
          {/* Gradient */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gradient</label>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGradient(g)}
                  title={g.label}
                  className={cn(
                    "h-8 rounded-lg transition-all",
                    gradient.id === g.id
                      ? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
                      : "opacity-60 hover:opacity-100"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Shape */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Shape</label>
            <div className="grid grid-cols-4 gap-1.5">
              {BG_SHAPES.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setBgShape(shape)}
                  className={cn(
                    "h-8 w-8 border border-border transition-all flex items-center justify-center",
                    shape,
                    bgShape === shape
                      ? "bg-accent border-primary/50"
                      : "bg-secondary hover:bg-accent"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Size — {iconSize}px
            </label>
            <div className="flex gap-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setIconSize(s)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-mono transition-all",
                    iconSize === s
                      ? "bg-tool-icon/20 text-tool-icon border border-tool-icon/40"
                      : "bg-secondary text-muted-foreground hover:bg-accent border border-transparent"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Icon color */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-secondary"
              />
              <span className="font-mono text-sm text-muted-foreground">{iconColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Stroke */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Stroke — {strokeWidth}
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.25}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-[var(--tool-icon)]"
            />
          </div>
        </div>

        {/* Center: Preview */}
        <div className="flex-1 flex items-center justify-center rounded-xl bg-secondary/50 border border-border">
          {IconComponent ? (
            <div
              className={cn("flex items-center justify-center shadow-2xl", bgShape)}
              style={{
                width: containerSize,
                height: containerSize,
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              }}
            >
              <IconComponent
                width={iconRenderSize}
                height={iconRenderSize}
                color={iconColor}
                strokeWidth={strokeWidth}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Select an icon</p>
          )}
        </div>

        {/* Right: Icon picker */}
        <div className="flex flex-col gap-3 w-52 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm bg-secondary border-border h-8"
            />
          </div>
          <div className="grid grid-cols-5 gap-1 overflow-y-auto flex-1 content-start">
            {filteredIcons.map((name) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (LucideIcons as any)[name] as React.ElementType | undefined
              if (!Icon) return null
              return (
                <button
                  key={name}
                  onClick={() => setSelectedIcon(name)}
                  title={name}
                  className={cn(
                    "flex items-center justify-center w-full aspect-square rounded-lg transition-all",
                    selectedIcon === name
                      ? "bg-tool-icon/20 text-tool-icon border border-tool-icon/40"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
