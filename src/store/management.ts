import { getDocs, limit, orderBy, query, startAfter, startAt, where } from 'firebase/firestore';
import { CategoryDoc, collections, InOutDoc } from 'src/firebase/collections';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './user';

export interface UseManagementStore {
  categories?: CategoryDoc[];
  revenuesAndExpenditures?: InOutDoc[];
  numberOfInOuts?: number;
  fetchCategories: (uid: User['uid']) => Promise<void>;
  fetchInOut: (uid: User['uid'], options: FetchInOutOptions) => Promise<void>;
}

export interface FetchInOutOptions {
  page?: number;
  pageSize?: number;
}

export const useManagementStore = create<UseManagementStore, [['zustand/immer', never]]>(
  immer((set) => ({
    fetchCategories: async (uid: User['uid']) => {
      const q = query<CategoryDoc>(collections.category, where('uid', '==', uid));
      const qSnap = await getDocs(q);
      set((state) => (state.categories = qSnap.docs.map((doc) => doc.data())));
    },
    fetchInOut: async (uid: User['uid'], options: FetchInOutOptions = {}) => {
      const _page = Number(options.page ?? 1);
      const _pageSize = Number(options.pageSize ?? 10);

      // get ref to the last doc of previous page
      const ignoreQ = query<InOutDoc>(
        collections.inOut,
        where('uid', '==', uid),
        orderBy('time', 'desc'),
        limit(_page * _pageSize)
      );
      const ignoreQSnap = await getDocs(ignoreQ);
      const last = ignoreQSnap.docs[ignoreQSnap.docs.length - 1];

      const q = query<InOutDoc>(
        collections.inOut,
        where('uid', '==', uid),
        orderBy('time', 'desc'),
        startAfter(last),
        limit(_pageSize)
      );
      const qSnap = await getDocs(q);
      set((state) => {
        state.revenuesAndExpenditures = qSnap.docs.map((doc) => doc.data());
        state.numberOfInOuts = 100; // TODO: update to real data
      });
    },
  }))
);
