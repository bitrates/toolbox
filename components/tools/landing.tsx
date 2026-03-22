"use client"

import { Code2, Palette, Sparkles, Shapes, Blend, ArrowRight, Wind, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const tools = [
  {
    id: "code",
    label: "Code Beautifier",
    description: "Paste your code, pick a theme and background, export a gorgeous image.",
    icon: Code2,
    colorClass: "text-tool-code",
    bgStyle: { backgroundColor: "oklch(0.55 0.22 160 / 0.08)" },
    borderStyle: { borderColor: "oklch(0.55 0.22 160 / 0.25)" },
    dotStyle: { backgroundColor: "oklch(0.55 0.22 160)" },
  },
  {
    id: "palette",
    label: "Color Palette",
    description: "Generate harmonious palettes, lock swatches, add your own colors, export CSS.",
    icon: Palette,
    colorClass: "text-tool-palette",
    bgStyle: { backgroundColor: "oklch(0.60 0.22 25 / 0.08)" },
    borderStyle: { borderColor: "oklch(0.60 0.22 25 / 0.25)" },
    dotStyle: { backgroundColor: "oklch(0.60 0.22 25)" },
  },
  {
    id: "icon",
    label: "Icon Creator",
    description: "Browse 500+ icons, apply gradient backgrounds, download as SVG or PNG.",
    icon: Sparkles,
    colorClass: "text-tool-icon",
    bgStyle: { backgroundColor: "oklch(0.55 0.22 230 / 0.08)" },
    borderStyle: { borderColor: "oklch(0.55 0.22 230 / 0.25)" },
    dotStyle: { backgroundColor: "oklch(0.55 0.22 230)" },
  },
  {
    id: "svg",
    label: "SVG Patterns",
    description: "Generate tiling SVG patterns — dots, grids, waves, hexagons — and copy CSS.",
    icon: Shapes,
    colorClass: "text-tool-svg",
    bgStyle: { backgroundColor: "oklch(0.62 0.20 55 / 0.08)" },
    borderStyle: { borderColor: "oklch(0.62 0.20 55 / 0.25)" },
    dotStyle: { backgroundColor: "oklch(0.62 0.20 55)" },
  },
  {
    id: "gradient",
    label: "Gradient Builder",
    description: "Build linear, radial, and conic gradients visually. Add blur. Copy CSS or export.",
    icon: Blend,
    colorClass: "text-tool-gradient",
    bgStyle: { backgroundColor: "oklch(0.58 0.28 295 / 0.08)" },
    borderStyle: { borderColor: "oklch(0.58 0.28 295 / 0.25)" },
    dotStyle: { backgroundColor: "oklch(0.58 0.28 295)" },
  },
  {
    id: "noise",
    label: "Noise & Mesh",
    description: "Generate abstract noise textures, mesh gradients, fluid blobs, and organic backgrounds.",
    icon: Wind,
    colorClass: "text-violet-600",
    bgStyle: { backgroundColor: "oklch(0.58 0.28 295 / 0.07)" },
    borderStyle: { borderColor: "oklch(0.58 0.28 295 / 0.20)" },
    dotStyle: { backgroundColor: "oklch(0.55 0.27 295)" },
  },
  {
    id: "wavy",
    label: "Wavy Lines",
    description: "Create flowing sine waves, ripples, coils, and oscillating line art in SVG.",
    icon: Activity,
    colorClass: "text-sky-600",
    bgStyle: { backgroundColor: "oklch(0.55 0.22 230 / 0.07)" },
    borderStyle: { borderColor: "oklch(0.55 0.22 230 / 0.20)" },
    dotStyle: { backgroundColor: "oklch(0.52 0.22 230)" },
  },
] as const

type ToolId = "code" | "palette" | "icon" | "svg" | "gradient" | "noise" | "wavy"

interface LandingProps {
  onSelect: (id: ToolId) => void
}

export function Landing({ onSelect }: LandingProps) {
  return (
    <div className="relative flex flex-col gap-14 py-4 max-w-4xl mx-auto overflow-hidden">

      {/* Decorative blobs — behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Top-right violet blob */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "oklch(0.58 0.28 295)" }}
        />
        {/* Top-left cyan-green blob */}
        <div
          className="absolute -top-12 -left-12 w-72 h-72 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "oklch(0.55 0.22 160)" }}
        />
        {/* Bottom-center orange blob */}
        <div
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "oklch(0.60 0.22 25)" }}
        />
      </div>

        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-[1.08]">
            Tools For{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.58 0.28 295), oklch(0.55 0.22 230))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Designers
            </span>
            {" "}&amp;{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.22 160), oklch(0.62 0.20 55))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Developers.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
            A collection of creative design tools for Designers and Developers to make things look cooler!
          </p>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onSelect("palette")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
            style={{ background: "linear-gradient(135deg, oklch(0.58 0.28 295), oklch(0.55 0.22 230))" }}
          >
            Start creating
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-muted-foreground text-sm">or pick a tool below</span>
        </div>
      </div>

      {/* Tool cards grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => onSelect(tool.id)}
                className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06]"
              >
                {/* Icon badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ ...tool.bgStyle, ...tool.borderStyle }}
                >
                  <Icon className={cn("w-5 h-5", tool.colorClass)} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-sm">{tool.label}</span>
                    <ArrowRight className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all", tool.colorClass)} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{tool.description}</p>
                </div>

                {/* Bottom color bar */}
                <div className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-300" style={tool.dotStyle} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-10 flex-wrap border-t border-border pt-8 pb-4">
        {[
          { value: "Built By", label: "Bitrates" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
