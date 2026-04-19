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
  addSlide: () => void;
  setActiveSlide: (id: string) => void;
  selectElement: (id: string | null) => void;
  updateElementPosition: (elementId: string, x: number, y: number) => void;
  updateElementContent: (elementId: string, content: string) => void;
  updateElementStyle: (elementId: string, styleOverrides: Partial<SlideElement['style']>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  slides: [],
  activeSlideId: null,
  selectedElementId: null,
  addSlide: () => set((state) => {
    const newSlide: Slide = { id: crypto.randomUUID(), background: '#ffffff', elements: [] };
    return {
      slides: [...state.slides, newSlide],
      activeSlideId: newSlide.id,
      selectedElementId: null,
    };
  }),
  setActiveSlide: (id) => set({ activeSlideId: id }),
  selectElement: (id) => set({ selectedElementId: id }),
  updateElementPosition: (elementId, x, y) => set((state) => ({
    slides: state.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(el => el.id === elementId ? { ...el, x, y } : el)
    }))
  })),
  updateElementContent: (elementId, content) => set((state) => ({
    slides: state.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(el => el.id === elementId ? { ...el, content } : el)
    }))
  })),
  updateElementStyle: (elementId, styleOverrides) => set((state) => ({
    slides: state.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(el => el.id === elementId ? { ...el, style: { ...el.style, ...styleOverrides } } : el)
    }))
  }))
}));
