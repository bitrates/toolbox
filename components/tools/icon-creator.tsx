"use client";

// i have to find a better way to import all the Font Awesome icons

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faTerminal,
  faDatabase,
  faServer,
  faMicrochip,
  faWifi,
  faCloud,
  faGlobe,
  faBug,
  faGear,
  faGears,
  faRobot,
  faLaptop,
  faMobileScreen,
  faDesktop,
  faKeyboard,
  faPalette,
  faPen,
  faPencil,
  faRuler,
  faPaintbrush,
  faFillDrip,
  faEraser,
  faShapes,
  faLayerGroup,
  faImage,
  faIcons,
  faCropSimple,
  faPlay,
  faMusic,
  faHeadphones,
  faMicrophone,
  faCamera,
  faFilm,
  faVideo,
  faSun,
  faMoon,
  faStar,
  faLeaf,
  faTree,
  faSeedling,
  faFire,
  faBolt,
  faSnowflake,
  faRainbow,
  faCloudRain,
  faToolbox,
  faWrench,
  faHammer,
  faLock,
  faKey,
  faShieldHalved,
  faBell,
  faBookmark,
  faTag,
  faPaperPlane,
  faEnvelope,
  faPhone,
  faMapPin,
  faCompass,
  faHeart,
  faTrophy,
  faMedal,
  faCrown,
  faGift,
  faRocket,
  faGem,
  faGamepad,
  faDice,
  faThumbsUp,
  faFaceSmile,
  faAtom,
  faDna,
  faMicroscope,
  faFlask,
  faStethoscope,
  faBrain,
  faEye,
  faCar,
  faPlane,
  faBicycle,
  faShip,
  faTrain,
  faHouse,
  faBuilding,
  faSchool,
  faStore,
  faHospital,
  faChartBar,
  faChartPie,
  faChartLine,
  faTable,
  faMagnifyingGlass,
  faShareNodes,
  faLink,
  faQrcode,
  faDownload,
  faUpload,
  faFileCode,
} from "@fortawesome/free-solid-svg-icons";
import { Download, Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FAIcon = { name: string; icon: IconDefinition };

const FA_ICONS: FAIcon[] = [
  // Tech & Dev
  { name: "Code", icon: faCode },
  { name: "Terminal", icon: faTerminal },
  { name: "Database", icon: faDatabase },
  { name: "Server", icon: faServer },
  { name: "Microchip", icon: faMicrochip },
  { name: "Wifi", icon: faWifi },
  { name: "Cloud", icon: faCloud },
  { name: "Globe", icon: faGlobe },
  { name: "Bug", icon: faBug },
  { name: "Gear", icon: faGear },
  { name: "Gears", icon: faGears },
  { name: "Robot", icon: faRobot },
  { name: "Laptop", icon: faLaptop },
  { name: "Mobile", icon: faMobileScreen },
  { name: "Desktop", icon: faDesktop },
  { name: "Keyboard", icon: faKeyboard },
  { name: "Download", icon: faDownload },
  { name: "Upload", icon: faUpload },
  { name: "File Code", icon: faFileCode },
  { name: "QR Code", icon: faQrcode },
  // Design & UI
  { name: "Palette", icon: faPalette },
  { name: "Pen", icon: faPen },
  { name: "Pencil", icon: faPencil },
  { name: "Ruler", icon: faRuler },
  { name: "Paintbrush", icon: faPaintbrush },
  { name: "Fill Drip", icon: faFillDrip },
  { name: "Eraser", icon: faEraser },
  { name: "Shapes", icon: faShapes },
  { name: "Layers", icon: faLayerGroup },
  { name: "Image", icon: faImage },
  { name: "Icons", icon: faIcons },
  { name: "Crop", icon: faCropSimple },
  // Media
  { name: "Play", icon: faPlay },
  { name: "Music", icon: faMusic },
  { name: "Headphones", icon: faHeadphones },
  { name: "Microphone", icon: faMicrophone },
  { name: "Camera", icon: faCamera },
  { name: "Film", icon: faFilm },
  { name: "Video", icon: faVideo },
  // Nature
  { name: "Sun", icon: faSun },
  { name: "Moon", icon: faMoon },
  { name: "Star", icon: faStar },
  { name: "Leaf", icon: faLeaf },
  { name: "Tree", icon: faTree },
  { name: "Seedling", icon: faSeedling },
  { name: "Fire", icon: faFire },
  { name: "Bolt", icon: faBolt },
  { name: "Snowflake", icon: faSnowflake },
  { name: "Rainbow", icon: faRainbow },
  { name: "Cloud Rain", icon: faCloudRain },
  // Objects & Tools
  { name: "Toolbox", icon: faToolbox },
  { name: "Wrench", icon: faWrench },
  { name: "Hammer", icon: faHammer },
  { name: "Lock", icon: faLock },
  { name: "Key", icon: faKey },
  { name: "Shield", icon: faShieldHalved },
  { name: "Bell", icon: faBell },
  { name: "Bookmark", icon: faBookmark },
  { name: "Tag", icon: faTag },
  { name: "Paper Plane", icon: faPaperPlane },
  { name: "Envelope", icon: faEnvelope },
  { name: "Phone", icon: faPhone },
  { name: "Map Pin", icon: faMapPin },
  { name: "Compass", icon: faCompass },
  { name: "Link", icon: faLink },
  { name: "Share", icon: faShareNodes },
  // Fun & Social
  { name: "Heart", icon: faHeart },
  { name: "Trophy", icon: faTrophy },
  { name: "Medal", icon: faMedal },
  { name: "Crown", icon: faCrown },
  { name: "Gift", icon: faGift },
  { name: "Rocket", icon: faRocket },
  { name: "Diamond", icon: faGem },
  { name: "Gamepad", icon: faGamepad },
  { name: "Dice", icon: faDice },
  { name: "Thumbs Up", icon: faThumbsUp },
  { name: "Face Smile", icon: faFaceSmile },
  // Science
  { name: "Atom", icon: faAtom },
  { name: "DNA", icon: faDna },
  { name: "Microscope", icon: faMicroscope },
  { name: "Flask", icon: faFlask },
  { name: "Stethoscope", icon: faStethoscope },
  { name: "Brain", icon: faBrain },
  { name: "Eye", icon: faEye },
  // Transport & Places
  { name: "Car", icon: faCar },
  { name: "Plane", icon: faPlane },
  { name: "Bicycle", icon: faBicycle },
  { name: "Ship", icon: faShip },
  { name: "Train", icon: faTrain },
  { name: "House", icon: faHouse },
  { name: "Building", icon: faBuilding },
  { name: "School", icon: faSchool },
  { name: "Store", icon: faStore },
  { name: "Hospital", icon: faHospital },
  // Data
  { name: "Bar Chart", icon: faChartBar },
  { name: "Pie Chart", icon: faChartPie },
  { name: "Line Chart", icon: faChartLine },
  { name: "Table", icon: faTable },
  { name: "Search", icon: faMagnifyingGlass },
];

const GRADIENTS = [
  { id: "green-teal", label: "Toolbox", from: "#7ed957", to: "#0d9488" },
  { id: "violet-indigo", label: "Violet", from: "#7c3aed", to: "#4338ca" },
  { id: "rose-pink", label: "Rose", from: "#f43f5e", to: "#db2777" },
  { id: "cyan-blue", label: "Cyan", from: "#06b6d4", to: "#2563eb" },
  { id: "amber-orange", label: "Amber", from: "#f59e0b", to: "#ea580c" },
  { id: "emerald-teal", label: "Emerald", from: "#10b981", to: "#0d9488" },
  { id: "fuchsia", label: "Fuchsia", from: "#d946ef", to: "#9333ea" },
  { id: "slate", label: "Slate", from: "#475569", to: "#1e293b" },
];

const BG_SHAPES = [
  { id: "rounded-2xl", label: "Rounded" },
  { id: "rounded-full", label: "Circle" },
  { id: "rounded-none", label: "Square" },
];

const SIZES = [64, 96, 128, 192];

export function IconCreator() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FAIcon>(FA_ICONS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [bgShape, setBgShape] = useState("rounded-2xl");
  const [iconSize, setIconSize] = useState(96);
  const [iconColor, setIconColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = FA_ICONS.filter((ic) =>
    ic.name.toLowerCase().includes(search.toLowerCase()),
  );

  const containerSize = Math.round(iconSize * 1.6);
  const iconRenderSize = Math.round(iconSize * 0.5);
  const rx =
    bgShape === "rounded-full"
      ? containerSize / 2
      : bgShape === "rounded-none"
        ? 0
        : bgShape === "rounded-2xl"
          ? 24
          : 16;

  const buildSvgString = () => {
    // Build an SVG from the icon's path data directly
    const iconDef = selected.icon;
    const [w, h, , , pathData] = iconDef.icon;
    const path = Array.isArray(pathData) ? pathData.join(" ") : pathData;
    const pad = Math.round(containerSize * 0.22);
    const iconW = containerSize - pad * 2;
    const iconH = containerSize - pad * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${containerSize}" height="${containerSize}" viewBox="0 0 ${containerSize} ${containerSize}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient.from}"/>
      <stop offset="100%" stop-color="${gradient.to}"/>
    </linearGradient>
  </defs>
  <rect width="${containerSize}" height="${containerSize}" rx="${rx}" fill="url(#bg)"/>
  <g transform="translate(${pad}, ${pad})">
    <svg width="${iconW}" height="${iconH}" viewBox="0 0 ${w} ${h}">
      <path d="${path}" fill="${iconColor}"/>
    </svg>
  </g>
</svg>`;
  };

  const handleCopySvg = async () => {
    await navigator.clipboard.writeText(buildSvgString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportAsSvg = () => {
    const blob = new Blob([buildSvgString()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icon-${selected.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportAsPng = () => {
    const svgStr = buildSvgString();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = containerSize * 2;
      canvas.height = containerSize * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `icon-${selected.name.toLowerCase().replace(/\s+/g, "-")}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;
    setExportOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Icon Creator
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pick an icon, style it, and export as PNG or SVG
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySvg}
            className="gap-2"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
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
          {/* Gradient */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gradient
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGradient(g)}
                  title={g.label}
                  className={cn(
                    "h-8 rounded-lg transition-all",
                    gradient.id === g.id
                      ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-105"
                      : "opacity-60 hover:opacity-100",
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
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Shape
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {BG_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setBgShape(shape.id)}
                  title={shape.label}
                  className={cn(
                    "h-8 w-full border transition-all flex items-center justify-center",
                    shape.id,
                    bgShape === shape.id
                      ? "bg-primary/10 border-primary/50 text-foreground"
                      : "bg-secondary border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 block",
                      shape.id,
                      bgShape === shape.id
                        ? "bg-primary"
                        : "bg-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Size
            </label>
            <div className="flex gap-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setIconSize(s)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-mono transition-all border",
                    iconSize === s
                      ? "bg-primary/10 text-primary border-primary/40"
                      : "bg-secondary text-muted-foreground hover:bg-accent border-transparent",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Icon color */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Icon Color
            </label>
            <div className="flex items-center gap-2">
              <label className="w-9 h-9 rounded-lg border border-border cursor-pointer overflow-hidden shrink-0 block relative">
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
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
                  style={{ background: iconColor }}
                />
              </label>
              <span className="font-mono text-sm text-muted-foreground">
                {iconColor.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-xl bg-secondary/50 border border-border">
          <div
            className={cn(
              "flex items-center justify-center shadow-2xl transition-all",
              bgShape,
            )}
            style={{
              width: containerSize,
              height: containerSize,
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            }}
          >
            <FontAwesomeIcon
              icon={selected.icon}
              style={{
                width: iconRenderSize,
                height: iconRenderSize,
                color: iconColor,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {selected.name}
          </p>
        </div>

        {/* Icon Picker */}
        <div className="flex flex-col gap-3 w-56 shrink-0">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm bg-secondary border-border h-8"
          />
          <div className="grid grid-cols-5 gap-1 overflow-y-auto flex-1 content-start">
            {filtered.map((ic) => (
              <button
                key={ic.name}
                onClick={() => setSelected(ic)}
                title={ic.name}
                className={cn(
                  "flex items-center justify-center w-full aspect-square rounded-lg transition-all border",
                  selected.name === ic.name
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border-transparent",
                )}
              >
                <FontAwesomeIcon icon={ic.icon} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
