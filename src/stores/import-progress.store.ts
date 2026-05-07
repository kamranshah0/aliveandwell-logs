import { create } from 'zustand';

interface ImportProgressState {
  progress: { current: number; total: number; fileName: string } | null;
  setProgress: (progress: { current: number; total: number; fileName: string } | null) => void;
  clearProgress: () => void;
}

export const useImportProgressStore = create<ImportProgressState>((set) => ({
  progress: null,
  setProgress: (progress) => set({ progress }),
  clearProgress: () => set({ progress: null }),
}));
