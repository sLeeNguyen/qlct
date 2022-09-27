import { FS } from 'src/configs/fs';
import { aggregateData } from 'src/firebase/apis';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UseUtilsStore {
  syncFS: FS;
  syncData: () => Promise<void>;
  syncError?: Error | undefined;
}

export const useUtilsStore = create<UseUtilsStore, [['zustand/immer', never]]>(
  immer((set) => ({
    syncFS: FS.IDLE,
    syncData: async () => {
      try {
        set((state) => {
          state.syncFS = FS.UPDATING;
        });
        await aggregateData();
        set((state) => {
          state.syncFS = FS.SUCCESS;
          state.syncError = undefined;
        });
      } catch (error) {
        console.error('(syncData) Failed to sync data', error);
        set((state) => {
          state.syncFS = FS.FAILED;
          state.syncError = error as Error;
        });
      }
    },
  }))
);
