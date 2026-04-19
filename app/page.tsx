import { TopBar } from "@/src/components/editor/TopBar";
import { LeftSidebar } from "@/src/components/editor/LeftSidebar";
import { Canvas } from "@/src/components/editor/Canvas";
import { RightSidebar } from "@/src/components/editor/RightSidebar";

export default function EditorPage() {
  return (
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
  );
}
