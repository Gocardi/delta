"use client";

import { useEffect } from "react";
import { TopBar } from "@/src/components/editor/TopBar";
import { LeftSidebar } from "@/src/components/editor/LeftSidebar";
import { Canvas } from "@/src/components/editor/Canvas";
import { RightSidebar } from "@/src/components/editor/RightSidebar";
import { PresentationViewer } from "@/src/components/editor/PresentationViewer";
import { useAutosave } from "@/src/hooks/useAutosave";
import { useEditorStore } from "@/src/store/useEditorStore";

const STATIC_PRESENTATION_ID = "test_presentation_1";

export function EditorShell() {
  const loadFromCloud = useEditorStore((s) => s.loadFromCloud);
  const isPresenting = useEditorStore((s) => s.isPresenting);

  // Load saved data on mount
  useEffect(() => {
    void loadFromCloud(STATIC_PRESENTATION_ID);
  }, [loadFromCloud]);

  // Autosave on slides change (debounced 3s)
  useAutosave(STATIC_PRESENTATION_ID);

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {/* ── Top bar ── */}
        <TopBar />

        {/* ── Main workspace: sidebar + canvas + properties ── */}
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>

      {/* ── Presentation overlay ── */}
      {isPresenting && <PresentationViewer />}
    </>
  );
}
