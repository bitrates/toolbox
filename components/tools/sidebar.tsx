"use client"

import { Code2, Palette, Sparkles, Shapes, Blend, Home, Wind, Waves, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToolId = "home" | "code" | "palette" | "icon" | "svg" | "gradient" | "noise" | "wavy"

const navItems: {
  id: ToolId
  label: string
  icon: React.ElementType
  activeColor: string
  dotClass?: string
  section?: "home" | "tools"
}[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      activeColor: "text-primary",
      section: "home",
    },
    {
      id: "code",
      label: "Code Beautifier",
      icon: Code2,
      activeColor: "text-tool-code",
      dotClass: "bg-tool-code",
      section: "tools",
    },
    {
      id: "palette",
      label: "Color Palette",
      icon: Palette,
      activeColor: "text-tool-palette",
      dotClass: "bg-tool-palette",
      section: "tools",
    },
    {
      id: "icon",
      label: "Icon Creator",
      icon: Sparkles,
      activeColor: "text-tool-icon",
      dotClass: "bg-tool-icon",
      section: "tools",
    },
    {
      id: "svg",
      label: "SVG Patterns",
      icon: Shapes,
      activeColor: "text-tool-svg",
      dotClass: "bg-tool-svg",
      section: "tools",
    },
    {
      id: "gradient",
      label: "Gradient Builder",
      icon: Blend,
      activeColor: "text-tool-gradient",
      dotClass: "bg-tool-gradient",
      section: "tools",
    },
    {
      id: "noise",
      label: "Noise & Mesh",
      icon: Wind,
      activeColor: "text-violet-600",
      dotClass: "bg-violet-500",
      section: "tools",
    },
    {
      id: "wavy",
      label: "Wavy Lines",
      icon: Activity,
      activeColor: "text-sky-600",
      dotClass: "bg-sky-500",
      section: "tools",
    },
  ]

interface SidebarProps {
  active: ToolId
  onChange: (id: ToolId) => void
}

export function AppSidebar({ active, onChange }: SidebarProps) {
  const homeItem = navItems.filter((n) => n.section === "home")
  const toolItems = navItems.filter((n) => n.section === "tools")

  return (
    <aside className="flex flex-col w-64 shrink-0 h-screen bg-sidebar border-r border-border">
      {/* Logo */}
      <button
        onClick={() => onChange("home")}
        className="flex items-center gap-3 px-5 py-5 border-b border-border hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <Blend className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground tracking-tight text-base">Toolbox</span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {/* Home */}
        {homeItem.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? item.activeColor : "text-muted-foreground")} />
              <span>{item.label}</span>
            </button>
          )
        })}

        {/* Tools section */}
        <p className="text-xs font-medium text-muted-foreground px-3 pt-4 pb-1 uppercase tracking-widest">Tools</p>
        {toolItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? item.activeColor : "text-muted-foreground")} />
              <span>{item.label}</span>
              {isActive && item.dotClass && (
                <span className={cn("ml-auto w-1.5 h-1.5 rounded-full", item.dotClass)} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Creative Tools By Bitrates</p>
      </div>
    </aside>
  )
}
