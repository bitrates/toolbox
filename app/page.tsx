"use client"

import { useState } from "react"
import { AppSidebar, type ToolId } from "@/components/tools/sidebar"
import { Landing } from "@/components/tools/landing"
import { CodeBeautifier } from "@/components/tools/code-beautifier"
import { ColorPalette } from "@/components/tools/color-palette"
import { IconCreator } from "@/components/tools/icon-creator"
import { SvgPatterns } from "@/components/tools/svg-patterns"
import { GradientGenerator } from "@/components/tools/gradient-generator"
import { NoiseMesh } from "@/components/tools/noise-mesh"
import { WavyLines } from "@/components/tools/wavy-lines"

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("home")

  const renderContent = () => {
    switch (activeTool) {
      case "home":     return <Landing onSelect={setActiveTool} />
      case "code":     return <CodeBeautifier />
      case "palette":  return <ColorPalette />
      case "icon":     return <IconCreator />
      case "svg":      return <SvgPatterns />
      case "gradient": return <GradientGenerator />
      case "noise":    return <NoiseMesh />
      case "wavy":     return <WavyLines />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <AppSidebar active={activeTool} onChange={setActiveTool} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
