"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faToolbox, faHouse, faCode, faPalette, faIcons, faShapes,
  faCircleHalfStroke, faWind, faWaveSquare,
  faChevronLeft, faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"

export type ToolId = "home" | "code" | "palette" | "icon" | "svg" | "gradient" | "noise" | "wavy"

interface NavItem {
  id: ToolId
  label: string
  icon: typeof faHouse
  activeColor: string
  dotClass?: string
  section: "home" | "tools"
}

const navItems: NavItem[] = [
  { id: "home",     label: "Home",             icon: faHouse,             activeColor: "text-primary",      section: "home"  },
  { id: "code",     label: "Code Beautifier",  icon: faCode,              activeColor: "text-tool-code",    dotClass: "bg-tool-code",     section: "tools" },
  { id: "palette",  label: "Color Palette",    icon: faPalette,           activeColor: "text-tool-palette", dotClass: "bg-tool-palette",  section: "tools" },
  { id: "icon",     label: "Icon Creator",     icon: faIcons,             activeColor: "text-tool-icon",    dotClass: "bg-tool-icon",     section: "tools" },
  { id: "svg",      label: "SVG Patterns",     icon: faShapes,            activeColor: "text-tool-svg",     dotClass: "bg-tool-svg",      section: "tools" },
  { id: "gradient", label: "Gradient Builder", icon: faCircleHalfStroke,  activeColor: "text-tool-gradient",dotClass: "bg-tool-gradient", section: "tools" },
  { id: "noise",    label: "Noise & Mesh",     icon: faWind,              activeColor: "text-violet-600",   dotClass: "bg-violet-500",    section: "tools" },
  { id: "wavy",     label: "Wavy Lines",       icon: faWaveSquare,        activeColor: "text-sky-600",      dotClass: "bg-sky-500",       section: "tools" },
]

interface SidebarProps {
  active: ToolId
  onChange: (id: ToolId) => void
}

export function AppSidebar({ active, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const homeItems = navItems.filter((n) => n.section === "home")
  const toolItems = navItems.filter((n) => n.section === "tools")

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header row: logo + collapse toggle */}
      <div className={cn(
        "flex items-center border-b border-border shrink-0",
        collapsed ? "flex-col gap-2 py-4 px-0" : "px-4 py-4 gap-3"
      )}>
        <button
          onClick={() => onChange("home")}
          className={cn(
            "flex items-center gap-3 hover:opacity-80 transition-opacity flex-1 min-w-0",
            collapsed && "justify-center flex-none"
          )}
        >
          <FontAwesomeIcon
            icon={faToolbox}
            className="w-5 h-5 shrink-0"
            style={{ color: "rgb(126, 217, 87)" }}
          />
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight text-base whitespace-nowrap truncate">
              Toolbox
            </span>
          )}
        </button>

        {/* Collapse button — in header when expanded, below logo when collapsed */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-accent transition-colors shrink-0 text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FontAwesomeIcon
            icon={collapsed ? faChevronRight : faChevronLeft}
            className="w-3 h-3"
          />
        </button>
      </div>

      {/* Nav */}
      <nav className={cn(
        "flex flex-col gap-1 p-2 flex-1 overflow-y-auto",
        collapsed && "items-center"
      )}>
        {/* Home item */}
        {homeItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150 w-full",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={cn("w-4 h-4 shrink-0", isActive ? item.activeColor : "text-muted-foreground")}
              />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* Tools label */}
        {!collapsed
          ? <p className="text-xs font-medium text-muted-foreground px-3 pt-4 pb-1 uppercase tracking-widest">Tools</p>
          : <div className="w-8 h-px bg-border my-2" />
        }

        {/* Tool items */}
        {toolItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150 w-full",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={cn("w-4 h-4 shrink-0", isActive ? item.activeColor : "text-muted-foreground")}
              />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && isActive && item.dotClass && (
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.dotClass)} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-border shrink-0">
          <p className="text-xs text-muted-foreground">Creative Tools Collection</p>
        </div>
      )}
    </aside>
  )
}
