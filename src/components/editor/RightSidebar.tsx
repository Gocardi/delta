"use client";

import {
  Settings2,
  Palette,
  Type,
  Move,
  Copy,
  Trash2,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
} from "lucide-react";
import { useEditorStore } from "@/src/store/useEditorStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeConsole } from "./CodeConsole";

/* ── Curated color palette ─────────────────────────────────── */
const BACKGROUND_COLORS = [
  "#ffffff",
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#1e293b",
  "#0f172a",
  "#020617",
  "#000000",
  "#fef2f2",
  "#fef9c3",
  "#ecfdf5",
  "#eff6ff",
  "#f5f3ff",
  "#fdf2f8",
  "#dc2626",
  "#2563eb",
] as const;

export function RightSidebar() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const updateElementStyle = useEditorStore((s) => s.updateElementStyle);
  const updateElementContent = useEditorStore((s) => s.updateElementContent);
  const updateElementPosition = useEditorStore((s) => s.updateElementPosition);
  const updateElementSize = useEditorStore((s) => s.updateElementSize);
  const updateSlideBackground = useEditorStore((s) => s.updateSlideBackground);
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const deleteElement = useEditorStore((s) => s.deleteElement);

  const activeSlide = slides.find((s) => s.id === activeSlideId);
  const selectedElement = activeSlide?.elements.find(
    (el) => el.id === selectedElementId
  );

  return (
    <aside className="flex w-72 flex-col border-l border-border bg-background shrink-0 select-none">
      <Tabs defaultValue="visual" className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="px-4 pt-3 pb-2 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selectedElement ? "Elemento" : "Diapositiva"}
            </span>
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">JSON</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Scrollable panel ── */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="visual" className="h-full m-0 data-[state=active]:flex flex-col overflow-y-auto">
            {!activeSlide ? (
              <EmptyState />
            ) : selectedElement ? (
              <ElementPanel
                element={selectedElement}
                onUpdatePosition={updateElementPosition}
                onUpdateSize={updateElementSize}
                onUpdateContent={updateElementContent}
                onUpdateStyle={updateElementStyle}
                onDelete={() => deleteElement(selectedElement.id)}
              />
            ) : (
              <SlidePanel
                slide={activeSlide}
                slideCount={slides.length}
                onUpdateBackground={(bg) =>
                  updateSlideBackground(activeSlide.id, bg)
                }
                onDuplicate={() => duplicateSlide(activeSlide.id)}
                onDelete={() => deleteSlide(activeSlide.id)}
              />
            )}
          </TabsContent>
          <TabsContent value="code" className="h-full m-0 data-[state=active]:flex flex-col">
            <CodeConsole />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  EMPTY STATE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="flex items-center gap-2 text-muted-foreground/40">
        <Palette className="h-5 w-5" />
        <Type className="h-5 w-5" />
        <Move className="h-5 w-5" />
      </div>
      <p className="text-xs text-muted-foreground/60 leading-relaxed">
        Crea una diapositiva para comenzar a editar
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  SLIDE PANEL (Case A: nothing selected)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface SlidePanelProps {
  slide: { id: string; background: string };
  slideCount: number;
  onUpdateBackground: (color: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SlidePanel({
  slide,
  slideCount,
  onUpdateBackground,
  onDuplicate,
  onDelete,
}: SlidePanelProps) {
  return (
    <div className="space-y-1">
      {/* ── Background color ── */}
      <section className="px-4 py-3">
        <Label className="text-xs text-muted-foreground mb-2">
          <Palette className="h-3.5 w-3.5" />
          Fondo
        </Label>

        <div className="grid grid-cols-8 gap-1.5 mt-2">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onUpdateBackground(color)}
              className={`h-6 w-6 rounded-md border transition-all hover:scale-110 ${
                slide.background === color
                  ? "ring-2 ring-primary ring-offset-1 border-primary"
                  : "border-border hover:border-muted-foreground/50"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-2 mt-3">
          <Label htmlFor="bg-custom" className="text-xs text-muted-foreground shrink-0">
            Personalizado
          </Label>
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="color"
              id="bg-custom"
              value={slide.background}
              onChange={(e) => onUpdateBackground(e.target.value)}
              className="h-7 w-7 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
            <Input
              value={slide.background}
              onChange={(e) => onUpdateBackground(e.target.value)}
              className="h-7 font-mono text-xs"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Slide actions ── */}
      <section className="px-4 py-3 space-y-2">
        <Label className="text-xs text-muted-foreground">Acciones</Label>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={slideCount <= 1}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ELEMENT PANEL (Case B: element selected)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface ElementPanelProps {
  element: {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    style: {
      color?: string;
      backgroundColor?: string;
      fontSize?: number;
      fontWeight?: "normal" | "bold" | "bolder";
      textAlign?: "left" | "center" | "right";
      borderRadius?: number;
      animation?: "none" | "fade" | "slide-up" | "bounce";
    };
  };
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, w: number, h: number) => void;
  onUpdateContent: (id: string, content: string) => void;
  onUpdateStyle: (
    id: string,
    overrides: Partial<ElementPanelProps["element"]["style"]>
  ) => void;
  onDelete: () => void;
}

function ElementPanel({
  element,
  onUpdatePosition,
  onUpdateSize,
  onUpdateContent,
  onUpdateStyle,
  onDelete,
}: ElementPanelProps) {
  const { id, type, x, y, width, height, content, style } = element;

  return (
    <div className="space-y-1">
      {/* ── Type badge ── */}
      <div className="px-4 pt-3 pb-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {type === "text" && <Type className="h-3 w-3" />}
          {type === "shape" && <Square className="h-3 w-3" />}
          {type}
        </span>
      </div>

      {/* ── Transform section ── */}
      <section className="px-4 py-3">
        <Label className="text-xs text-muted-foreground mb-2">
          <Move className="h-3.5 w-3.5" />
          Transformación
        </Label>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <NumericField
            label="X"
            value={x}
            min={0}
            max={100}
            step={0.5}
            onChange={(v) => onUpdatePosition(id, v, y)}
          />
          <NumericField
            label="Y"
            value={y}
            min={0}
            max={100}
            step={0.5}
            onChange={(v) => onUpdatePosition(id, x, v)}
          />
          <NumericField
            label="Ancho"
            value={width}
            min={1}
            max={100}
            step={0.5}
            onChange={(v) => onUpdateSize(id, v, height)}
          />
          <NumericField
            label="Alto"
            value={height}
            min={1}
            max={100}
            step={0.5}
            onChange={(v) => onUpdateSize(id, width, v)}
          />
        </div>
      </section>

      <Separator />

      {/* ── Content section ── */}
      <section className="px-4 py-3">
        <Label htmlFor="el-content" className="text-xs text-muted-foreground mb-2">
          Contenido
        </Label>
        <Textarea
          id="el-content"
          value={content}
          onChange={(e) => onUpdateContent(id, e.target.value)}
          placeholder={type === "image" ? "URL de la imagen…" : "Escribe algo…"}
          className="mt-1 min-h-[60px] text-xs resize-none"
          rows={3}
        />
      </section>

      <Separator />

      {/* ── Style section (type-dependent) ── */}
      {type === "text" && (
        <TextStyleSection
          style={style}
          onUpdate={(overrides) => onUpdateStyle(id, overrides)}
        />
      )}

      {type === "shape" && (
        <ShapeStyleSection
          style={style}
          onUpdate={(overrides) => onUpdateStyle(id, overrides)}
        />
      )}

      {type === "image" && (
        <section className="px-4 py-3">
          <Label className="text-xs text-muted-foreground">Estilo</Label>
          <p className="mt-1 text-[11px] text-muted-foreground/60">
            Las imágenes se ajustan automáticamente al contenedor.
          </p>
        </section>
      )}

      <Separator />

      {/* ── Animation section ── */}
      <section className="px-4 py-3">
        <Label className="text-xs text-muted-foreground mb-2">Animación</Label>
        <Select
          value={style.animation || "none"}
          onValueChange={(val: "none" | "fade" | "slide-up" | "bounce") => onUpdateStyle(id, { animation: val })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Selecciona..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Ninguna</SelectItem>
            <SelectItem value="fade">Aparecer (Fade)</SelectItem>
            <SelectItem value="slide-up">Deslizar Arriba</SelectItem>
            <SelectItem value="bounce">Rebotar</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <Separator />

      {/* ── Delete element ── */}
      <section className="px-4 py-3">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Eliminar elemento
        </button>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
          o presiona Delete / Backspace
        </p>
      </section>
    </div>
  );
}

/* ── Text style controls ─────────────────────────────────────── */
interface TextStyleSectionProps {
  style: ElementPanelProps["element"]["style"];
  onUpdate: (overrides: Partial<ElementPanelProps["element"]["style"]>) => void;
}

function TextStyleSection({ style, onUpdate }: TextStyleSectionProps) {
  return (
    <section className="px-4 py-3 space-y-3">
      <Label className="text-xs text-muted-foreground">
        <Type className="h-3.5 w-3.5" />
        Tipografía
      </Label>

      {/* Font size slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Tamaño</span>
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {style.fontSize ?? 16}px
          </span>
        </div>
        <Slider
          value={[style.fontSize ?? 16]}
          onValueChange={([v]) => onUpdate({ fontSize: v })}
          min={8}
          max={120}
          step={1}
        />
      </div>

      {/* Font weight toggle */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-muted-foreground">Peso</span>
        <div className="flex gap-1">
          {(["normal", "bold"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onUpdate({ fontWeight: w })}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                (style.fontWeight ?? "normal") === w
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {w === "bold" && <Bold className="h-3 w-3" />}
              {w === "normal" ? "Normal" : "Bold"}
            </button>
          ))}
        </div>
      </div>

      {/* Text align */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-muted-foreground">Alineación</span>
        <div className="flex gap-1">
          {([
            { value: "left" as const, Icon: AlignLeft },
            { value: "center" as const, Icon: AlignCenter },
            { value: "right" as const, Icon: AlignRight },
          ]).map(({ value, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onUpdate({ textAlign: value })}
              className={`inline-flex items-center justify-center rounded-md p-1.5 transition-colors ${
                (style.textAlign ?? "left") === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-label={`Alinear ${value}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Text color */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-muted-foreground">Color de texto</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.color ?? "#000000"}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="h-7 w-7 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
          />
          <Input
            value={style.color ?? "#000000"}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="h-7 font-mono text-xs"
          />
        </div>
      </div>
    </section>
  );
}

/* ── Shape style controls ────────────────────────────────────── */
interface ShapeStyleSectionProps {
  style: ElementPanelProps["element"]["style"];
  onUpdate: (overrides: Partial<ElementPanelProps["element"]["style"]>) => void;
}

function ShapeStyleSection({ style, onUpdate }: ShapeStyleSectionProps) {
  return (
    <section className="px-4 py-3 space-y-3">
      <Label className="text-xs text-muted-foreground">
        <Palette className="h-3.5 w-3.5" />
        Apariencia
      </Label>

      {/* Background color */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-muted-foreground">Color de fondo</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.backgroundColor ?? "#6366f1"}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="h-7 w-7 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
          />
          <Input
            value={style.backgroundColor ?? "#6366f1"}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="h-7 font-mono text-xs"
          />
        </div>
      </div>

      {/* Border radius slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Radio de borde</span>
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {style.borderRadius ?? 0}px
          </span>
        </div>
        <Slider
          value={[style.borderRadius ?? 0]}
          onValueChange={([v]) => onUpdate({ borderRadius: v })}
          min={0}
          max={100}
          step={1}
        />
      </div>
    </section>
  );
}

/* ── Reusable numeric field ──────────────────────────────────── */
interface NumericFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function NumericField({ label, value, min, max, step, onChange }: NumericFieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          if (!Number.isNaN(parsed)) {
            onChange(Math.min(max, Math.max(min, parsed)));
          }
        }}
        className="h-7 text-xs font-mono tabular-nums"
      />
    </div>
  );
}
