import { create } from 'zustand';
import { ID, Query } from 'appwrite';
import {
  databases,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_SLIDES,
} from '@/src/lib/appwrite';

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
  isSaving: boolean;
  isPresenting: boolean;
  presentationSlideIndex: number;

  // Slide actions
  addSlide: () => void;
  setActiveSlide: (id: string) => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  updateSlideBackground: (slideId: string, background: string) => void;

  // Element selection
  selectElement: (id: string | null) => void;

  // Element creation & deletion
  addElement: (type: ElementType) => void;
  deleteElement: (elementId: string) => void;

  // Element mutations
  updateElementPosition: (elementId: string, x: number, y: number) => void;
  updateElementSize: (elementId: string, width: number, height: number) => void;
  updateElementContent: (elementId: string, content: string) => void;
  updateElementStyle: (elementId: string, styleOverrides: Partial<SlideElement['style']>) => void;

  // Cloud persistence
  saveToCloud: (presentationId: string) => Promise<void>;
  loadFromCloud: (presentationId: string) => Promise<void>;

  // Presentation mode
  startPresentation: () => void;
  stopPresentation: () => void;
  nextPresentationSlide: () => void;
  prevPresentationSlide: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  slides: [],
  activeSlideId: null,
  selectedElementId: null,
  isSaving: false,
  isPresenting: false,
  presentationSlideIndex: 0,

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

  // ── Element creation ───────────────────────────────────────────
  addElement: (type) => set((state) => {
    if (!state.activeSlideId) return state;

    const newId = `el_${Date.now()}`;

    const base: SlideElement = {
      id: newId,
      type,
      x: 40,
      y: 40,
      width: 20,
      height: 20,
      rotation: 0,
      content: '',
      style: {},
    };

    if (type === 'text') {
      base.width = 30;
      base.height = 10;
      base.content = 'Nuevo Texto';
      base.style = { fontSize: 24, color: '#171717', textAlign: 'left' };
    } else if (type === 'shape') {
      base.width = 20;
      base.height = 20;
      base.content = '';
      base.style = { backgroundColor: '#e5e7eb', borderRadius: 0 };
    } else if (type === 'image') {
      base.width = 30;
      base.height = 30;
      base.content = '';
      base.style = {};
    }

    return {
      slides: state.slides.map((slide) =>
        slide.id === state.activeSlideId
          ? { ...slide, elements: [...slide.elements, base] }
          : slide
      ),
      selectedElementId: newId,
    };
  }),

  // ── Element deletion ───────────────────────────────────────────
  deleteElement: (elementId) => set((state) => {
    if (!state.activeSlideId) return state;
    return {
      slides: state.slides.map((slide) =>
        slide.id === state.activeSlideId
          ? { ...slide, elements: slide.elements.filter((el) => el.id !== elementId) }
          : slide
      ),
      selectedElementId:
        state.selectedElementId === elementId ? null : state.selectedElementId,
    };
  }),

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

  // ── Cloud persistence ──────────────────────────────────────────
  saveToCloud: async (presentationId) => {
    const { slides } = get();
    if (slides.length === 0) return;

    set({ isSaving: true });

    try {
      // 1. Fetch existing slide docs for this presentation
      const existing = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_SLIDES,
        [Query.equal('presentationId', presentationId), Query.limit(100)]
      );

      const existingIds = new Set(existing.documents.map((d) => d.$id));
      const processedIds = new Set<string>();

      // 2. Upsert each slide
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const docId = `${presentationId}_slide_${i}`;
        const payload = {
          presentationId,
          order: i,
          jsConfig: JSON.stringify(slide),
        };

        processedIds.add(docId);

        if (existingIds.has(docId)) {
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_SLIDES,
            docId,
            payload
          );
        } else {
          await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_SLIDES,
            docId,
            payload
          );
        }
      }

      // 3. Delete orphan docs (slides removed locally)
      for (const doc of existing.documents) {
        if (!processedIds.has(doc.$id)) {
          await databases.deleteDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_SLIDES,
            doc.$id
          );
        }
      }
    } catch (err) {
      console.error('[Delta] Save to cloud failed:', err);
    } finally {
      set({ isSaving: false });
    }
  },

  loadFromCloud: async (presentationId) => {
    try {
      const result = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_SLIDES,
        [
          Query.equal('presentationId', presentationId),
          Query.orderAsc('order'),
          Query.limit(100),
        ]
      );

      const slides: Slide[] = result.documents.map((doc) => {
        const parsed = JSON.parse(doc.jsConfig as string) as Slide;
        return parsed;
      });

      if (slides.length > 0) {
        set({
          slides,
          activeSlideId: slides[0].id,
          selectedElementId: null,
        });
      }
    } catch (err) {
      console.error('[Delta] Load from cloud failed:', err);
    }
  },

  // ── Presentation mode ──────────────────────────────────────────
  startPresentation: () => set((state) => {
    if (state.slides.length === 0) return state;
    const currentIndex = state.activeSlideId
      ? state.slides.findIndex((s) => s.id === state.activeSlideId)
      : 0;
    return {
      isPresenting: true,
      presentationSlideIndex: Math.max(0, currentIndex),
      selectedElementId: null,
    };
  }),

  stopPresentation: () => set({ isPresenting: false }),

  nextPresentationSlide: () => set((state) => ({
    presentationSlideIndex: Math.min(
      state.presentationSlideIndex + 1,
      state.slides.length - 1
    ),
  })),

  prevPresentationSlide: () => set((state) => ({
    presentationSlideIndex: Math.max(state.presentationSlideIndex - 1, 0),
  })),
}));
