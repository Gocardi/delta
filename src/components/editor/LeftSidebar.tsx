"use client";

import { Plus } from "lucide-react";
import { useEditorStore } from "@/src/store/useEditorStore";

export function LeftSidebar() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);

  return (
    <aside className="flex w-60 flex-col border-r border-border bg-muted/40 shrink-0 select-none">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Diapositivas
        </span>
        <button
          type="button"
          onClick={addSlide}
          className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Añadir diapositiva"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ── Slide thumbnails (scrollable) ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {slides.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Sin diapositivas aún
            </p>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Plus className="h-3 w-3" />
              Crear primera
            </button>
          </div>
        )}

        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(slide.id)}
              className="group relative w-full text-left"
            >
              <div className="flex items-start gap-2">
                <span className="mt-1 text-[10px] font-medium text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <div
                  className={`flex-1 aspect-video rounded-md transition-all overflow-hidden ${
                    isActive
                      ? "border-2 border-primary shadow-sm"
                      : "border border-border group-hover:border-muted-foreground/50 group-hover:shadow-sm"
                  }`}
                  style={{ backgroundColor: slide.background }}
                >
                  {/* ── Miniature element preview ── */}
                  <div className="relative h-full w-full">
                    {slide.elements.map((el) => (
                      <div
                        key={el.id}
                        className="absolute overflow-hidden"
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          width: `${el.width}%`,
                          height: `${el.height}%`,
                          fontSize: "2px",
                          color: el.style.color,
                          backgroundColor: el.style.backgroundColor,
                          borderRadius: el.style.borderRadius
                            ? `${el.style.borderRadius}px`
                            : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
