
import { create } from 'zustand';

interface ImportProgress {
  current: number;
  total: number;
  fileName: string;
  recordsPerSecond?: number;
}

interface ImportStore {
  progress: ImportProgress | null;
  setProgress: (progress: ImportProgress | null) => void;
  clearProgress: () => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  progress: null,
  setProgress: (progress) => set({ progress }),
  clearProgress: () => set({ progress: null }),
}));
