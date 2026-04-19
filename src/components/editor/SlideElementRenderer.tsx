"use client";

import type { SlideElement } from "@/src/store/useEditorStore";
import { useEditorStore } from "@/src/store/useEditorStore";

interface Props {
  element: SlideElement;
}

export function SlideElementRenderer({ element }: Props) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const updateElementContent = useEditorStore((s) => s.updateElementContent);

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
        position: "absolute",
        margin: 0,
        transformOrigin: "top left",
        boxSizing: "border-box",
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* ── Text element ── */}
      {type === "text" && (
        <div
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateElementContent(id, e.currentTarget.innerText)}
          className="block h-full w-full overflow-hidden whitespace-pre-wrap break-words p-1 outline-none"
          style={{
            color: style.color,
            fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
            fontWeight: style.fontWeight,
            textAlign: style.textAlign,
            pointerEvents: "auto",
          }}
        >
          {content}
        </div>
      )}

      {/* ── Image element ── */}
      {type === "image" && content && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={content}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
