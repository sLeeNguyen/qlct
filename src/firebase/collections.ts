import {
  collection,
  CollectionReference,
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';
import { User } from 'src/store';
import firebase from '.';

export type InOrOut = 'income' | 'outcome';

export type InOutDoc = {
  id: string;
  title: string;
  value: number;
  type: InOrOut;
  time: number;
  uid: User['uid'];
  categories: string[];
};

export type CategoryDoc = {
  id: string;
  name: string;
  description: string;
  uid: User['uid'];
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
    } as CategoryDoc;
  },
};

export const collections = {
  inOut: collection(firebase.db, 'inOut').withConverter(inOutConverter),
  category: collection(firebase.db, 'category').withConverter(categoryConverter),
};
