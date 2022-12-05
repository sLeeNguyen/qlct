import { doc, getDoc, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { FS } from 'src/configs/fs';
import { getInOutThisMonth } from 'src/firebase/apis';
import { collections, HistoryDoc, OverallDoc } from 'src/firebase/collections';
import { RequireID } from 'src/global';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './user';

export type HistoryData = { [timestamp: number]: number };

export interface UseDashboardStore {
  overall?: RequireID<OverallDoc>;
  thisMonth?: {
    income: number;
    outcome: number;
  };
  balanceFluctuation?: HistoryData;
  incomeHistory?: HistoryData;
  outcomeHistory?: HistoryData;
  fetchOverall: (uid: User['uid']) => Promise<void>;
  fetchHistories: (uid: User['uid']) => Promise<void>;
  overallFS: FS;
  historiesFS: FS;
  reset: () => void;
}

export const useDashboardStore = create<UseDashboardStore, [['zustand/immer', never]]>(
  immer((set) => ({
    overallFS: FS.IDLE,
    historiesFS: FS.IDLE,
    fetchOverall: async (uid: User['uid']) => {
      set((state) => {
        if (state.overallFS === FS.IDLE || state.overallFS === FS.FETCHING) {
          state.overallFS = FS.FETCHING;
        } else {
          state.overallFS = FS.UPDATING;
        }
      });
      try {
        const docSnap = await getDoc(doc(collections.overall, uid));
        const inOutThisMonthSnap = await getInOutThisMonth(uid);
        const thisMonth = { income: 0, outcome: 0 };
        inOutThisMonthSnap.forEach((doc) => {
          const data = doc.data();
          if (data.type === 'income') {
            thisMonth.income += data.value;
          } else if (data.type === 'outcome') {
            thisMonth.outcome += data.value;
          }
        });
        set((state: UseDashboardStore) => {
          state.overall = docSnap.data() as RequireID<OverallDoc>;
          state.thisMonth = thisMonth;
          state.overallFS = FS.SUCCESS;
        });
      } catch (error) {
        console.error(error);
        set((state) => {
          state.overall = undefined;
          state.thisMonth = undefined;
          state.overallFS = FS.FAILED;
        });
      }
    },
    fetchHistories: async (uid: User['uid']) => {
      set((state) => {
        if (state.historiesFS === FS.IDLE || state.historiesFS == FS.FETCHING) {
          state.historiesFS = FS.FETCHING;
        } else {
          state.historiesFS = FS.UPDATING;
        }
      });
      try {
        const q = query<HistoryDoc>(
          collections.history,
          where('uid', '==', uid),
          where('timestamp', '>=', Timestamp.fromMillis(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
          orderBy('timestamp', 'asc')
        );
        const qSnap = await getDocs(q);
        const balanceFluctuation: HistoryData = {},
          incomeHistory: HistoryData = {},
          outcomeHistory: HistoryData = {};

        qSnap.forEach((doc) => {
          const _data = doc.data();
          const tDay = _data.timestamp;
          incomeHistory[tDay] = _data.income;
          outcomeHistory[tDay] = _data.outcome;
          balanceFluctuation[tDay] = _data.balance;
        });

        set((state) => {
          state.balanceFluctuation = balanceFluctuation;
          state.incomeHistory = incomeHistory;
          state.outcomeHistory = outcomeHistory;
          state.historiesFS = FS.SUCCESS;
        });
      } catch (error) {
        console.error(error);
        set((state) => {
          state.balanceFluctuation = undefined;
          state.incomeHistory = undefined;
          state.outcomeHistory = undefined;
          state.historiesFS = FS.FAILED;
        });
      }
    },
    reset: () => {
      set((state) => {
        state.overallFS = FS.IDLE;
        state.historiesFS = FS.IDLE;
        state.overall = undefined;
        state.thisMonth = undefined;
        state.balanceFluctuation = undefined;
        state.incomeHistory = undefined;
        state.outcomeHistory = undefined;
      });
    },
  }))
);

// useDashboardStore.subscribe((state) => {
//   console.log('useUserStore', state);
// });
