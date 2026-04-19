"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/src/store/useEditorStore";
import type { SlideElement } from "@/src/store/useEditorStore";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PresentationViewer() {
  const slides = useEditorStore((s) => s.slides);
  const slideIndex = useEditorStore((s) => s.presentationSlideIndex);
  const stopPresentation = useEditorStore((s) => s.stopPresentation);
  const nextSlide = useEditorStore((s) => s.nextPresentationSlide);
  const prevSlide = useEditorStore((s) => s.prevPresentationSlide);

  const currentSlide = slides[slideIndex];
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === slides.length - 1;

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          e.preventDefault();
          stopPresentation();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide, stopPresentation]);

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      {/* ── Slide container with AnimatePresence ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-[90vw] max-w-6xl aspect-video rounded-lg overflow-hidden shadow-2xl"
          style={{ backgroundColor: currentSlide.background }}
        >
          {/* ── Elements with staggered entrance ── */}
          {currentSlide.elements.map((el, index) => (
            <PresentationElement key={el.id} element={el} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom controls overlay ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          disabled={isFirst}
          className="rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-xs font-medium text-white/50 tabular-nums">
          {slideIndex + 1} / {slides.length}
        </span>

        <button
          type="button"
          onClick={nextSlide}
          disabled={isLast}
          className="rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* ── Close button ── */}
      <button
        type="button"
        onClick={stopPresentation}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Salir de presentación"
      >
        <X className="h-5 w-5" />
      </button>

      {/* ── Keyboard hint (fades out) ── */}
      <motion.p
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-white/30"
      >
        ← → para navegar · Esc para salir
      </motion.p>
    </div>
  );
}

/* ── Individual element with staggered animation ─────────────── */
interface PresentationElementProps {
  element: SlideElement;
  index: number;
}

function PresentationElement({ element, index }: PresentationElementProps) {
  const { type, x, y, width, height, rotation, content, style } = element;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.2 + index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {type === "text" && (
        <span
          className="block h-full w-full overflow-hidden whitespace-pre-wrap break-words p-1"
          style={{
            color: style.color,
            fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
            fontWeight: style.fontWeight,
            textAlign: style.textAlign,
          }}
        >
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
        <div
          className="h-full w-full"
          style={{
            backgroundColor: style.backgroundColor ?? "#e5e7eb",
            borderRadius: style.borderRadius
              ? `${style.borderRadius}px`
              : undefined,
          }}
        />
      )}
    </motion.div>
  );
}
