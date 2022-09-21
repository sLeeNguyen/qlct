import { getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { FS } from 'src/configs/fs';
import { CategoryDoc, collections, InOutDoc } from 'src/firebase/collections';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './user';

export interface UseManagementStore {
  categories?: CategoryDoc[];
  revenuesAndExpenditures?: InOutDoc[];
  numberOfInOuts?: number;
  fetchCategories: (uid: User['uid']) => Promise<void>;
  fetchInOut: (uid: User['uid'], options?: FetchInOutOptions) => Promise<void>;
  categoriesFS: FS;
  inOutFS: FS;
}

export interface FetchInOutOptions {
  page?: number;
  pageSize?: number;
}

export const useManagementStore = create<UseManagementStore, [['zustand/immer', never]]>(
  immer((set) => ({
    categoriesFS: FS.IDLE,
    inOutFS: FS.IDLE,
    fetchCategories: async (uid: User['uid']) => {
      set((state) => {
        if (state.categoriesFS === FS.SUCCESS) {
          state.categoriesFS = FS.UPDATING;
        } else {
          state.categoriesFS = FS.FETCHING;
        }
      });

      try {
        const q = query<CategoryDoc>(collections.category, where('uid', '==', uid));
        const qSnap = await getDocs(q);
        set((state) => {
          state.categories = qSnap.docs.map((doc) => doc.data());
          state.categoriesFS = FS.SUCCESS;
        });
      } catch (error) {
        console.error('fetchCategories', error);
        set((state) => {
          state.categoriesFS = FS.FAILED;
        });
      }
    },
    fetchInOut: async (uid: User['uid'], options: FetchInOutOptions = {}) => {
      set((state) => {
        if (state.inOutFS === FS.SUCCESS) {
          state.inOutFS = FS.UPDATING;
        } else {
          state.inOutFS = FS.FETCHING;
        }
      });

      try {
        const _page = Number(options.page ?? 1);
        const _pageSize = Number(options.pageSize ?? 10);

        // get ref to the last doc of previous page
        let last = null;
        if (_page > 1) {
          const ignoreQ = query<InOutDoc>(
            collections.inOut,
            where('uid', '==', uid),
            orderBy('time', 'desc'),
            limit((_page - 1) * _pageSize)
          );
          const ignoreQSnap = await getDocs(ignoreQ);
          last = ignoreQSnap.docs[ignoreQSnap.docs.length - 1];
        }

        const q = query<InOutDoc>(
          collections.inOut,
          where('uid', '==', uid),
          orderBy('time', 'desc'),
          ...(last !== null ? [startAfter(last), limit(_pageSize)] : [limit(_pageSize)])
        );
        const qSnap = await getDocs(q);
        set((state) => {
          state.revenuesAndExpenditures = qSnap.docs.map((doc) => doc.data());
          state.numberOfInOuts = 100; // TODO: update to real data
          state.inOutFS = FS.SUCCESS;
        });
      } catch (error) {
        console.error('fetchInOut', error);
        set((state) => {
          state.inOutFS = FS.FAILED;
        });
      }
    },
  }))
);
