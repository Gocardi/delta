"use client";

import { useEditorStore } from "@/src/store/useEditorStore";
import type { SlideElement } from "@/src/store/useEditorStore";

export function Canvas() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);

  const currentSlide = slides.find((s) => s.id === activeSlideId);

  return (
    <main
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/60 p-8"
      onClick={() => selectElement(null)}
    >
      {/* ── Subtle grid pattern background ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* ── Slide surface (16:9) ── */}
      <div
        className="relative aspect-video w-full max-w-4xl rounded-lg shadow-xl ring-1 ring-border/50 transition-shadow overflow-hidden"
        style={{
          backgroundColor: currentSlide?.background ?? "#ffffff",
        }}
      >
        {/* ── Empty state ── */}
        {(!currentSlide || currentSlide.elements.length === 0) && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground/40 select-none">
              {currentSlide
                ? "Haz clic para añadir contenido"
                : "Crea una diapositiva para empezar"}
            </p>
          </div>
        )}

        {/* ── Elements layer ── */}
        {currentSlide?.elements.map((el) => (
          <SlideElementRenderer
            key={el.id}
            element={el}
            isSelected={el.id === selectedElementId}
            onSelect={selectElement}
          />
        ))}
      </div>
    </main>
  );
}

/* ── Individual element renderer ── */

interface SlideElementRendererProps {
  element: SlideElement;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

function SlideElementRenderer({
  element,
  isSelected,
  onSelect,
}: SlideElementRendererProps) {
  const { id, x, y, width, height, rotation, content, type, style } = element;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelect(id);
        }
      }}
      className={`absolute cursor-pointer transition-[box-shadow] ${
        isSelected
          ? "ring-2 ring-primary ring-offset-1"
          : "hover:ring-1 hover:ring-primary/40"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
        fontWeight: style.fontWeight,
        textAlign: style.textAlign,
        borderRadius: style.borderRadius
          ? `${style.borderRadius}px`
          : undefined,
      }}
    >
      {/* ── Render content based on type ── */}
      {type === "text" && (
        <span className="block h-full w-full overflow-hidden whitespace-pre-wrap break-words p-1">
          {content}
        </span>
      )}

      {type === "image" && content && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={content}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {type === "shape" && (
        <div className="h-full w-full" />
      )}
    </div>
  );
}
