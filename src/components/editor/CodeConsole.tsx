"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/src/store/useEditorStore";

export function CodeConsole() {
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const slides = useEditorStore((s) => s.slides);
  const updateSlideFromJSON = useEditorStore((s) => s.updateSlideFromJSON);

  const [code, setCode] = useState("");

  const currentSlide = slides.find((s) => s.id === activeSlideId);

  // Sincronizar el textarea cuando cambia en el lienzo, PERO
  // solo si la diferencia es real, para no sobreescribir al usuario mientras tipea JSON válido
  useEffect(() => {
    if (!currentSlide) {
      setCode("");
      return;
    }
    
    const stringified = JSON.stringify(currentSlide, null, 2);
    
    // Simplificación: Siempre actualizamos desde Zustand hacia el textarea, 
    // asumiendo que Zustand es la única fuente de la verdad
    try {
      const currentParsed = JSON.parse(code || "{}");
      // Evitamos re-setear si el JSON es estructuralmente idéntico para que
      // no salte el cursor del usuario mientras edita
      if (JSON.stringify(currentParsed) !== JSON.stringify(currentSlide)) {
        setCode(stringified);
      }
    } catch {
      // Si el código actual es inválido (estaban tipeando), lo dejamos quieto,
      // a menos que el usuario interactúe con el lienzo y cause un re-render fuerte.
      // Para este caso básico, si cambia en el lienzo lo sobreescribimos.
      setCode(stringified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  if (!currentSlide) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-neutral-500 bg-neutral-950 font-mono">
        &gt; SELECCIONE_DIAPOSITIVA
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCode(value);
    if (activeSlideId) {
      updateSlideFromJSON(activeSlideId, value);
    }
  };

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 bg-neutral-900">
        <span className="text-xs font-semibold text-green-500 font-mono">
          &gt; slide_data.json
        </span>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        spellCheck={false}
        className="flex-1 w-full bg-transparent p-4 font-mono text-sm leading-relaxed text-green-400 focus:outline-none resize-none"
      />
    </div>
  );
}
