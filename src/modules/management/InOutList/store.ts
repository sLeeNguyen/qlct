import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UseInOutListStore {
  selectedItems: { [key: string]: boolean };
  toggleItem: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  isSelectAll: boolean;
}

export const useInOutListStore = create<UseInOutListStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    selectedItems: {},
    isSelectAll: false,
    toggleItem(id) {
      const currentSelectedItems = Object.assign({}, get().selectedItems);
      if (currentSelectedItems[id] === undefined) {
        currentSelectedItems[id] = true;
      } else {
        delete currentSelectedItems[id];
      }
      set((state) => {
        state.selectedItems = currentSelectedItems;
        state.isSelectAll = false;
      });
    },
    selectAll(ids) {
      set((state) => {
        state.isSelectAll = true;
        state.selectedItems = ids.reduce<UseInOutListStore['selectedItems']>((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});
      });
    },
    deselectAll() {
      set((state) => {
        state.selectedItems = {};
        state.isSelectAll = false;
      });
    },
    reset() {
      set((state) => {
        state.selectedItems = {};
        state.isSelectAll = false;
      });
    },
  }))
);
