import { create } from 'zustand';

export type ElementType = 'text' | 'image' | 'shape';

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number; // Porcentaje relativo al ancho del lienzo (0-100)
  y: number; // Porcentaje relativo al alto del lienzo (0-100)
  width: number;
  height: number;
  rotation: number;
  content: string; // Texto o URL de imagen
  style: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | 'bolder';
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: number;
  };
}

export interface Slide {
  id: string;
  background: string;
  elements: SlideElement[];
}

export interface EditorState {
  slides: Slide[];
  activeSlideId: string | null;
  selectedElementId: string | null;

  // Slide actions
  addSlide: () => void;
  setActiveSlide: (id: string) => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  updateSlideBackground: (slideId: string, background: string) => void;

  // Element selection
  selectElement: (id: string | null) => void;

  // Element mutations
  updateElementPosition: (elementId: string, x: number, y: number) => void;
  updateElementSize: (elementId: string, width: number, height: number) => void;
  updateElementContent: (elementId: string, content: string) => void;
  updateElementStyle: (elementId: string, styleOverrides: Partial<SlideElement['style']>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  slides: [],
  activeSlideId: null,
  selectedElementId: null,

  // ── Slide actions ──────────────────────────────────────────────
  addSlide: () => set((state) => {
    const newSlide: Slide = { id: crypto.randomUUID(), background: '#ffffff', elements: [] };
    return {
      slides: [...state.slides, newSlide],
      activeSlideId: newSlide.id,
      selectedElementId: null,
    };
  }),

  setActiveSlide: (id) => set({ activeSlideId: id, selectedElementId: null }),

  duplicateSlide: (slideId) => set((state) => {
    const source = state.slides.find((s) => s.id === slideId);
    if (!source) return state;
    const duplicate: Slide = {
      ...source,
      id: crypto.randomUUID(),
      elements: source.elements.map((el) => ({ ...el, id: crypto.randomUUID() })),
    };
    const index = state.slides.findIndex((s) => s.id === slideId);
    const updated = [...state.slides];
    updated.splice(index + 1, 0, duplicate);
    return { slides: updated, activeSlideId: duplicate.id, selectedElementId: null };
  }),

  deleteSlide: (slideId) => set((state) => {
    const filtered = state.slides.filter((s) => s.id !== slideId);
    let nextActive = state.activeSlideId;
    if (state.activeSlideId === slideId) {
      const idx = state.slides.findIndex((s) => s.id === slideId);
      nextActive = filtered[Math.min(idx, filtered.length - 1)]?.id ?? null;
    }
    return { slides: filtered, activeSlideId: nextActive, selectedElementId: null };
  }),

  updateSlideBackground: (slideId, background) => set((state) => ({
    slides: state.slides.map((s) => (s.id === slideId ? { ...s, background } : s)),
  })),

  // ── Element selection ──────────────────────────────────────────
  selectElement: (id) => set({ selectedElementId: id }),

  // ── Element mutations ──────────────────────────────────────────
  updateElementPosition: (elementId, x, y) => set((state) => ({
    slides: state.slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => (el.id === elementId ? { ...el, x, y } : el)),
    })),
  })),

  updateElementSize: (elementId, width, height) => set((state) => ({
    slides: state.slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => (el.id === elementId ? { ...el, width, height } : el)),
    })),
  })),

  updateElementContent: (elementId, content) => set((state) => ({
    slides: state.slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => (el.id === elementId ? { ...el, content } : el)),
    })),
  })),

  updateElementStyle: (elementId, styleOverrides) => set((state) => ({
    slides: state.slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) =>
        el.id === elementId ? { ...el, style: { ...el.style, ...styleOverrides } } : el
      ),
    })),
  })),
}));
