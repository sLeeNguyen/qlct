import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UseYourCategoriesStore {
  openAddForm: boolean;
  selectedCategories: { [id: string]: boolean };
  toggleSelectedCategory: (id: string) => void;
  toggleAddForm: () => void;
  reset: () => void;
}

export const useYourCategoriesStore = create<UseYourCategoriesStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    openAddForm: false,
    selectedCategories: {},
    toggleSelectedCategory(id: string) {
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
    toggleAddForm() {
      set((state) => {
        state.openAddForm = !state.openAddForm;
      });
    },
    reset() {
      set((state) => {
        state.selectedCategories = {};
        state.openAddForm = false;
      });
    },
  }))
);
