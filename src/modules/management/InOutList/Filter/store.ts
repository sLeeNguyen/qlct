import { immer } from 'zustand/middleware/immer';
import create from 'zustand';

export type TypeOption = 'in' | 'out' | 'both';
export type TimeOption =
  | '7da'
  | '1ma'
  | '3ma'
  | '6ma'
  | '1ya'
  | {
      from: Date | null;
      to: Date | null;
    }
  | null;

export interface FilterStore {
  categories: string[];
  type: TypeOption;
  time: TimeOption;
  appliedFilters?: {
    categories: string[];
    type: TypeOption;
    time: TimeOption;
  };
  updateCategories: (categories: string[]) => void;
  updateType: (type: TypeOption) => void;
  updateTime: (time: TimeOption) => void;
  applyCurrentFilter: () => void;
  reset: () => void;
  clearFilter: () => void;
  resetCurrentFilter: () => void;
}

export const useFilterStore = create<FilterStore, [['zustand/immer', never]]>(
  immer((set) => ({
    categories: [],
    type: 'both',
    time: null,
    appliedFilters: undefined,
    applyCurrentFilter: () => {
      set((state) => {
        state.appliedFilters = {
          categories: state.categories,
          time: state.time,
          type: state.type,
        };
      });
    },
    updateCategories: (categories: string[]) => {
      set((state) => {
        state.categories = categories;
      });
    },
    updateType: (type) => {
      set((state) => {
        state.type = type;
      });
    },
    updateTime: (time) => {
      set((state) => {
        state.time = time;
      });
    },
    reset: () => {
      set((state) => {
        state.appliedFilters = undefined;
        state.categories = [];
        state.type = 'both';
        state.time = null;
      });
    },
    resetCurrentFilter: () => {
      set((state) => {
        if (state.appliedFilters) {
          state.categories = state.appliedFilters.categories;
          state.type = state.appliedFilters.type;
          state.time = state.appliedFilters.time;
        } else {
          state.categories = [];
          state.type = 'both';
          state.time = null;
        }
      });
    },
    clearFilter: () => {
      set((state) => {
        state.categories = [];
        state.type = 'both';
        state.time = null;
      });
    },
  }))
);
