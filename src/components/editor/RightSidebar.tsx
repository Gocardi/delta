import { Settings2, Palette, Type, Move } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="flex w-72 flex-col border-l border-border bg-background shrink-0 select-none">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Propiedades
        </span>
      </div>

      {/* ── Properties panel (scrollable) ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Placeholder empty state */}
        <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
          <div className="flex items-center gap-2 text-muted-foreground/40">
            <Palette className="h-5 w-5" />
            <Type className="h-5 w-5" />
            <Move className="h-5 w-5" />
          </div>
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            Selecciona un elemento en el lienzo para editar sus propiedades
          </p>
        </div>

        {/* ── Placeholder property sections ── */}
        <div className="space-y-px">
          {(["Posición", "Estilo", "Texto", "Apariencia"] as const).map(
            (section) => (
              <div
                key={section}
                className="border-t border-border px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {section}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
