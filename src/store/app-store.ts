import { create } from 'zustand';
import type { Config } from '../types';

interface AppState {
  config: Config | null;
  currentCategory: string | null;
  currentDocument: string | null;

  setConfig: (config: Config) => void;
  setCurrentCategory: (categoryId: string) => void;
  setCurrentDocument: (documentId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  config: null,
  currentCategory: null,
  currentDocument: null,

  setConfig: (config) => set({ config }),
  setCurrentCategory: (categoryId) => set({ currentCategory: categoryId }),
  setCurrentDocument: (documentId) => set({ currentDocument: documentId }),
}));
