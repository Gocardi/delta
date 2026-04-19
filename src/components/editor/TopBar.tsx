import { Presentation, Download, Save, Undo2, Redo2, Play } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-border bg-background shrink-0 select-none">
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
      </div>

      {/* ── Center: Document name ── */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xs font-medium text-muted-foreground">
          Presentación sin título
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
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Save className="h-3.5 w-3.5" />
          Guardar
        </button>
      </div>
    </header>
  );
}
