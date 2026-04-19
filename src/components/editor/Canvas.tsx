"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Moveable from "react-moveable";
import { useEditorStore } from "@/src/store/useEditorStore";
import { SlideElementRenderer } from "./SlideElementRenderer";

export function Canvas() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const updateElementPosition = useEditorStore((s) => s.updateElementPosition);
  const updateElementSize = useEditorStore((s) => s.updateElementSize);
  const deleteElement = useEditorStore((s) => s.deleteElement);

  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Track the DOM target for Moveable ──
  const [moveableTarget, setMoveableTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedElementId) {
      const el = document.getElementById(`element-${selectedElementId}`);
      setMoveableTarget(el);
    } else {
      setMoveableTarget(null);
    }
  }, [selectedElementId]);

  // ── Keyboard shortcuts: Delete / Backspace to remove element ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, deleteElement]);

  const currentSlide = slides.find((s) => s.id === activeSlideId);

  // ── Convert px back to % relative to the canvas container ──
  const toPercent = useCallback(
    (pxX: number, pxY: number, pxW?: number, pxH?: number) => {
      const container = canvasRef.current;
      if (!container) return { x: 0, y: 0, w: 0, h: 0 };
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      return {
        x: (pxX / cw) * 100,
        y: (pxY / ch) * 100,
        w: pxW !== undefined ? (pxW / cw) * 100 : 0,
        h: pxH !== undefined ? (pxH / ch) * 100 : 0,
      };
    },
    []
  );

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
        ref={canvasRef}
        className="relative aspect-video w-full max-w-4xl rounded-lg shadow-xl ring-1 ring-border/50 transition-shadow overflow-hidden origin-top-left"
        style={{
          backgroundColor: currentSlide?.background ?? "#ffffff",
        }}
        onClick={(e) => {
          // Only deselect if clicking directly on the canvas bg
          if (e.target === e.currentTarget) {
            selectElement(null);
          }
        }}
      >
        {/* ── Empty state ── */}
        {(!currentSlide || currentSlide.elements.length === 0) && (
          <div className="flex h-full items-center justify-center pointer-events-none">
            <p className="text-sm text-muted-foreground/40 select-none">
              {currentSlide
                ? "Haz clic para añadir contenido"
                : "Crea una diapositiva para empezar"}
            </p>
          </div>
        )}

        {/* ── Elements layer ── */}
        {currentSlide?.elements.map((el) => (
          <SlideElementRenderer key={el.id} element={el} />
        ))}
      </div>

      {/* ── Single Moveable controller ── */}
      {moveableTarget && selectedElementId && (
        <Moveable
          target={moveableTarget}
          container={canvasRef.current}
          draggable
          resizable
          snappable={true}
          bounds={{ left: 0, top: 0, right: 100, bottom: 100, position: "css" }}
          /* ── Appearance ── */
          edge={false}
          renderDirections={["nw", "ne", "sw", "se", "n", "s", "e", "w"]}
          /* ─────────────────────────────────────────────────
           *  DRAG: update transform visually during drag,
           *  then commit % position to Zustand on drag end.
           * ───────────────────────────────────────────────── */
          onDrag={(e) => {
            e.target.style.left = `${e.left}px`;
            e.target.style.top = `${e.top}px`;
          }}
          onDragEnd={(e) => {
            const el = e.target as HTMLElement;
            const container = canvasRef.current;
            if (!container || !selectedElementId) return;

            const leftPx = parseFloat(el.style.left) || 0;
            const topPx = parseFloat(el.style.top) || 0;

            const { x, y } = toPercent(leftPx, topPx);

            updateElementPosition(selectedElementId, x, y);

            // Reset inline to let React re-render from Zustand
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
          }}
          /* ─────────────────────────────────────────────────
           *  RESIZE: update size + position during resize,
           *  then commit to Zustand on resize end.
           * ───────────────────────────────────────────────── */
          onResize={(e) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.left = `${e.drag.left}px`;
            e.target.style.top = `${e.drag.top}px`;
          }}
          onResizeEnd={(e) => {
            const el = e.target as HTMLElement;
            const container = canvasRef.current;
            if (!container || !selectedElementId) return;

            const widthPx = parseFloat(el.style.width) || 0;
            const heightPx = parseFloat(el.style.height) || 0;
            const leftPx = parseFloat(el.style.left) || 0;
            const topPx = parseFloat(el.style.top) || 0;

            const { x, y } = toPercent(leftPx, topPx);
            const { w, h } = toPercent(0, 0, widthPx, heightPx);

            updateElementPosition(selectedElementId, x, y);
            updateElementSize(selectedElementId, w, h);

            // Reset inline to let React re-render from Zustand
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
            el.style.width = `${w}%`;
            el.style.height = `${h}%`;
          }}
        />
      )}
    </main>
  );
}
