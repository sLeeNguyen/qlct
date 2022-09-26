import { collection, FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { User } from 'src/store';
import firebase from '.';

export type InOrOut = 'income' | 'outcome';

export type InOutDoc = {
  id?: string;
  content: string;
  value: number;
  type: InOrOut;
  time: number;
  uid: User['uid'];
  categories: string[];
  createdAt: number;
};

export type CategoryDoc = {
  id?: string;
  name: string;
  description: string;
  uid: User['uid'];
  count: number;
};

export type History<T = unknown> = {
  [timestamp: number]: T;
};

export type OverallDoc = {
  id?: string;
  uid: string;
  inOutCount: number;
  categoryCount: number;
  totalIncome: number;
  totalOutcome: number;
  timeAggregated: number;
};

export type HistoryDoc = {
  id?: string;
  uid: string;
  timestamp: number;
  balance: number;
  income: number;
  outcome: number;
};

const inOutConverter: FirestoreDataConverter<InOutDoc> = {
  toFirestore(modelObject) {
    return {
      ...modelObject,
      time: Timestamp.fromMillis(modelObject.time as number),
    };
  },
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      time: (data.time as Timestamp).toMillis(),
      createdAt: data.createdAt ?? 1664167085378,
    } as InOutDoc;
  },
};

const categoryConverter: FirestoreDataConverter<CategoryDoc> = {
  toFirestore(modelObject) {
    return modelObject;
  },
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      count: data.count ?? 0,
    } as CategoryDoc;
  },
};

const overallConverter: FirestoreDataConverter<OverallDoc> = {
  toFirestore(modelObject) {
    return {
      ...modelObject,
      timeAggregated: Timestamp.fromMillis(modelObject.timeAggregated as number),
    };
  },
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      timeAggregated: (data.timeAggregated as Timestamp).toMillis(),
    } as OverallDoc;
  },
};

const historyConverter: FirestoreDataConverter<HistoryDoc> = {
  toFirestore(modelObject) {
    return {
      ...modelObject,
      timestamp: Timestamp.fromMillis(modelObject.timestamp as number),
    };
  },
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      timestamp: (data.timestamp as Timestamp).toMillis(),
    } as HistoryDoc;
  },
};

export const collections = {
  inOut: collection(firebase.db, 'inOut').withConverter(inOutConverter),
  category: collection(firebase.db, 'category').withConverter(categoryConverter),
  overall: collection(firebase.db, 'overall').withConverter(overallConverter),
  history: collection(firebase.db, 'history').withConverter(historyConverter),
};
