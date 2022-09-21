import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UseYourCategoriesStore {
  selectedCategories: { [id: string]: boolean };
  toggleSelectedCategory: (id: string) => void;
  reset: () => void;
}

export const useYourCategoriesStore = create<UseYourCategoriesStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    selectedCategories: {},
    toggleSelectedCategory: (id: string) => {
      const currentSelectedCategories = Object.assign({}, get().selectedCategories);

      if (currentSelectedCategories[id] === undefined) {
        currentSelectedCategories[id] = true;
      } else {
        delete currentSelectedCategories[id];
      }
      set((state) => {
        state.selectedCategories = currentSelectedCategories;
      });
    },
    reset: () => {
      set((state) => {
        state.selectedCategories = {};
      });
    },
  }))
);
