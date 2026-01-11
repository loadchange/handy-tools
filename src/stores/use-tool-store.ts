import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tool {
  name: string;
  path: string;
  component: React.ComponentType;
  category: string;
  description?: string;
  keywords?: string[];
}

interface ToolStore {
  tools: Tool[];
  favoriteTools: string[]; // store by unique tool name
  searchQuery: string;
  selectedCategory: string | null;
  searchHistory: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleFavorite: (toolName: string) => void;
  isFavorite: (toolName: string) => boolean;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      tools: [],
      favoriteTools: [],
      searchQuery: '',
      selectedCategory: null,
      searchHistory: [],

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      toggleFavorite: (toolName) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.includes(toolName)
            ? state.favoriteTools.filter((name) => name !== toolName)
            : [...state.favoriteTools, toolName],
        })),

      isFavorite: (toolName) => get().favoriteTools.includes(toolName),

      addToSearchHistory: (q) => {
          const query = q.trim();
          if (!query) return;
          set((state) => {
            const next = [query, ...state.searchHistory.filter((i) => i !== query)].slice(0, 10);
            return { searchHistory: next };
          });
        },

      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'handy-tools-store',
      partialize: (state) => ({ favoriteTools: state.favoriteTools, searchHistory: state.searchHistory }),
    }
  )
);
