"use client";

import type { SlideElement } from "@/src/store/useEditorStore";
import { useEditorStore } from "@/src/store/useEditorStore";

interface Props {
  element: SlideElement;
}

export function SlideElementRenderer({ element }: Props) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);

  const isSelected = element.id === selectedElementId;
  const { id, type, x, y, width, height, rotation, content, style } = element;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(id);
  };

  return (
    <div
      id={`element-${id}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          selectElement(id);
        }
      }}
      className={`absolute origin-top-left cursor-pointer ${
        isSelected ? "" : "hover:outline hover:outline-1 hover:outline-primary/30"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* ── Text element ── */}
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

      {/* ── Image element ── */}
      {type === "image" && content && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={content}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {/* ── Shape element ── */}
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
    </div>
  );
}
