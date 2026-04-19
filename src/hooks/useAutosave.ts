"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/src/store/useEditorStore";

const AUTOSAVE_DELAY_MS = 3000;

/**
 * Watches the slides array in Zustand and auto-saves to Appwrite
 * after `AUTOSAVE_DELAY_MS` of inactivity.
 */
export function useAutosave(presentationId: string | null) {
  const slides = useEditorStore((s) => s.slides);
  const saveToCloud = useEditorStore((s) => s.saveToCloud);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial render (don't save on mount / load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!presentationId || slides.length === 0) return;

    // Clear any pending save
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Debounce: wait for inactivity before saving
    timerRef.current = setTimeout(() => {
      void saveToCloud(presentationId);
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [slides, presentationId, saveToCloud]);
}
