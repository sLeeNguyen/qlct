import { Timestamp, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { FS } from 'src/configs/fs';
import { CategoryDoc, collections, InOutDoc } from 'src/firebase/collections';
import { RequireID } from 'src/global';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './user';
import { FilterStore } from 'src/modules/management/InOutList/Filter/store';
import dayjs from 'dayjs';

export interface UseManagementStore {
  categories?: RequireID<CategoryDoc>[];
  revenuesAndExpenditures?: {
    [id: string]: RequireID<InOutDoc>;
  };
  numberOfInOuts?: number;
  fetchCategories: (uid: User['uid']) => Promise<void>;
  fetchInOut: (uid: User['uid'], options?: FetchInOutOptions) => Promise<void>;
  fetchInOut2: (uid: User['uid'], options?: FetchInOut2Options) => Promise<void>;
  categoriesFS: FS;
  inOutFS: FS;
  pagination: {
    page: number;
    pageSize: number;
  };
  reset: () => void;
}

export interface FetchInOutOptions {
  page?: number;
  pageSize?: number;
}

export type FetchInOut2Options = Pick<FilterStore, 'time' | 'type' | 'categories'>;

export const useManagementStore = create<UseManagementStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    categoriesFS: FS.IDLE,
    inOutFS: FS.IDLE,
    pagination: {
      page: 1,
      pageSize: 10,
    },
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
          state.categories = qSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
      const pagination = get().pagination;
      set((state) => {
        if (state.inOutFS === FS.SUCCESS) {
          state.inOutFS = FS.UPDATING;
        } else {
          state.inOutFS = FS.FETCHING;
        }
      });

      try {
        const _page = Number(options.page ?? pagination.page);
        const _pageSize = Number(options.pageSize ?? pagination.pageSize);

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
          state.revenuesAndExpenditures = qSnap.docs.reduce<{ [id: string]: RequireID<InOutDoc> }>((acc, doc) => {
            acc[doc.id] = doc.data() as RequireID<InOutDoc>;
            return acc;
          }, {});
          state.numberOfInOuts = 100; // TODO: update to real data
          state.inOutFS = FS.SUCCESS;
          state.pagination = {
            page: _page,
            pageSize: _pageSize,
          };
        });
      } catch (error) {
        console.error('fetchInOut', error);
        set((state) => {
          state.inOutFS = FS.FAILED;
        });
      }
    },
    fetchInOut2: async (uid: User['uid'], options?: FetchInOut2Options) => {
      set((state) => {
        if (state.inOutFS === FS.SUCCESS) {
          state.inOutFS = FS.UPDATING;
        } else {
          state.inOutFS = FS.FETCHING;
        }
      });
      try {
        const constraints = [where('uid', '==', uid), orderBy('time', 'desc')];
        if (options) {
          // type
          if (options.type === 'in') {
            constraints.push(where('type', '==', 'income'));
          } else if (options.type === 'out') {
            constraints.push(where('type', '==', 'outcome'));
          }

          // time
          if (options.time) {
            let from, to;
            if (options.time === '7da') {
              from = new Date(dayjs(new Date()).subtract(7, 'day').toDate().toDateString());
            } else if (options.time === '1ma') {
              from = new Date(dayjs(new Date()).subtract(1, 'month').toDate().toDateString());
            } else if (options.time === '3ma') {
              from = new Date(dayjs(new Date()).subtract(3, 'months').toDate().toDateString());
            } else if (options.time === '6ma') {
              from = new Date(dayjs(new Date()).subtract(6, 'months').toDate().toDateString());
            } else if (options.time === '1ya') {
              from = new Date(dayjs(new Date()).subtract(1, 'year').toDate().toDateString());
            } else {
              if (typeof options.time === 'object') {
                if (!options.time.from || !options.time.to) {
                  throw new Error('Invalid time range');
                }
                from = options.time.from;
                to = options.time.to;
              }
            }
            if (from) {
              constraints.push(where('time', '>=', Timestamp.fromDate(from)));
              if (to) {
                constraints.push(where('time', '<=', Timestamp.fromDate(to)));
              }
            }
          }

          // categories
          if (options.categories && options.categories.length) {
            constraints.push(where('categories', 'array-contains-any', options.categories));
          }
        }
        const q = query<InOutDoc>(collections.inOut, ...constraints);
        const qSnap = await getDocs(q);
        set((state) => {
          state.revenuesAndExpenditures = qSnap.docs.reduce<{ [id: string]: RequireID<InOutDoc> }>((acc, doc) => {
            acc[doc.id] = doc.data() as RequireID<InOutDoc>;
            return acc;
          }, {});
          state.numberOfInOuts = qSnap.size;
          state.inOutFS = FS.SUCCESS;
        });
      } catch (error) {
        console.error('fetchInOut', error);
        set((state) => {
          state.inOutFS = FS.FAILED;
        });
      }
    },
    reset: () => {
      set((state) => {
        state.categoriesFS = FS.IDLE;
        state.inOutFS = FS.IDLE;
        state.pagination = { page: 1, pageSize: 10 };
        state.categories = undefined;
        state.revenuesAndExpenditures = undefined;
        state.numberOfInOuts = undefined;
      });
    },
  }))
);
