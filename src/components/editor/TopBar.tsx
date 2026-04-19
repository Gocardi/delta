"use client";

import {
  Presentation,
  Download,
  Save,
  Undo2,
  Redo2,
  Play,
  Type,
  Square,
  Cloud,
  Loader2,
  Check,
} from "lucide-react";
import { useEditorStore } from "@/src/store/useEditorStore";

const STATIC_PRESENTATION_ID = "test_presentation_1";

export function TopBar() {
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const isSaving = useEditorStore((s) => s.isSaving);
  const saveToCloud = useEditorStore((s) => s.saveToCloud);

  const hasSlide = activeSlideId !== null;

  return (
    <header className="relative flex items-center justify-between h-12 px-4 border-b border-border bg-background shrink-0 select-none">
      {/* ── Left: Brand + History ── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Presentation className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Delta
          </span>
        </div>

        <span className="h-4 w-px bg-border" aria-hidden="true" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Deshacer"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Rehacer"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        <span className="h-4 w-px bg-border" aria-hidden="true" />

        {/* ── Toolbox ── */}
        <div className="flex items-center gap-0.5">
          <ToolboxButton
            icon={<Type className="h-4 w-4" />}
            label="Texto"
            disabled={!hasSlide}
            onClick={() => addElement("text")}
          />
          <ToolboxButton
            icon={<Square className="h-4 w-4" />}
            label="Forma"
            disabled={!hasSlide}
            onClick={() => addElement("shape")}
          />
        </div>
      </div>

      {/* ── Center: Document name + save status ── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Presentación sin título
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Check className="h-3 w-3" />
              Guardado
            </>
          )}
        </span>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Play className="h-3.5 w-3.5" />
          Presentar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
        </button>
        <button
          type="button"
          disabled={isSaving || !hasSlide}
          onClick={() => void saveToCloud(STATIC_PRESENTATION_ID)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Guardar
        </button>
      </div>
    </header>
  );
}

/* ── Toolbox button ──────────────────────────────────────────── */
interface ToolboxButtonProps {
  icon: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function ToolboxButton({ icon, label, disabled, onClick }: ToolboxButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
