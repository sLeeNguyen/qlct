import { getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { collections, InOutDoc } from 'src/firebase/collections';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './user';

export type HistoryData = { [timestamp: number]: number };

export interface UseDashboardStore {
  balance?: number;
  balanceFluctuation?: HistoryData;
  totalIncome?: number;
  totalOutcome?: number;
  incomeHistory?: HistoryData;
  outcomeHistory?: HistoryData;
  inOutHistories?: InOutDoc[];
  fetchOverall: (uid: User['uid']) => Promise<void>;
  fetchHistories: (uid: User['uid']) => Promise<void>;
}

export const useDashboardStore = create<UseDashboardStore, [['zustand/immer', UseDashboardStore]]>(
  immer((set) => ({
    fetchOverall: async (uid: User['uid']) => {
      const q = query<InOutDoc>(collections.inOut, where('uid', '==', uid), orderBy('time', 'desc'));
      const qSnap = await getDocs(q);
      let totalIncome = 0,
        totalOutcome = 0;
      qSnap.forEach((doc) => {
        const _data = doc.data();
        if (_data.type === 'income') {
          totalIncome += _data.value;
        } else if (_data.type === 'outcome') {
          totalOutcome += _data.value;
        }
      });
      set((state: UseDashboardStore) => {
        state.balance = totalIncome - totalOutcome;
        state.totalIncome = totalIncome;
        state.totalOutcome = totalOutcome;
        state.inOutHistories = qSnap.docs.map((d) => d.data());
      });
    },
    fetchHistories: async (uid: User['uid']) => {
      const q = query<InOutDoc>(
        collections.inOut,
        where('uid', '==', uid),
        where('time', '>=', Timestamp.fromMillis(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
        orderBy('time', 'desc')
      );
      const qSnap = await getDocs(q);
      const balanceFluctuation: HistoryData = {},
        incomeHistory: HistoryData = {},
        outcomeHistory: HistoryData = {};

      let currentBalance = 0;
      const DAY = 24 * 60 * 60 * 1000;

      qSnap.forEach((doc) => {
        const _data = doc.data();
        const tDay = Math.floor(_data.time / DAY) * DAY; // rounded to day
        if (_data.type === 'income') {
          currentBalance += _data.value;
          if (incomeHistory[tDay] === undefined) {
            incomeHistory[tDay] = _data.value;
          } else {
            incomeHistory[tDay] += _data.value;
          }
          incomeHistory[tDay] += 0;
        } else if (_data.type === 'outcome') {
          currentBalance -= _data.value;
          if (outcomeHistory[tDay] === undefined) {
            outcomeHistory[tDay] = _data.value;
          } else {
            outcomeHistory[tDay] += _data.value;
          }
        }
        if (balanceFluctuation[tDay] === undefined) {
          balanceFluctuation[tDay] = currentBalance;
        } else {
          balanceFluctuation[tDay] += currentBalance;
        }
      });

      set((state) => {
        state.balanceFluctuation = balanceFluctuation;
        state.incomeHistory = incomeHistory;
        state.outcomeHistory = outcomeHistory;
      });
    },
  }))
);

// useDashboardStore.subscribe((state) => {
//   console.log('useUserStore', state);
// });