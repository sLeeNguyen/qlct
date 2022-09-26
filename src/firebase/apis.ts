import { addDoc, doc, getDocs, increment, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { User } from 'src/store';
import { useManagementStore } from 'src/store/management';
import firebase from '.';
import { collections, History, InOutDoc } from './collections';

export async function addInOut(data: InOutDoc) {
  const docRef = await addDoc<InOutDoc>(collections.inOut, data);
  const wb = writeBatch(firebase.db);
  data.categories.forEach((id) => {
    wb.update(doc(collections.category, id), {
      count: increment(1),
    });
  });
  wb.commit().catch((error) => console.error('(addInOut) Failed to write batch', error));
  return docRef;
}

export async function deleteInOuts(ids: string[]) {
  const wb = writeBatch(firebase.db);
  const items = useManagementStore.getState().revenuesAndExpenditures ?? {};
  const categoryIds: { [cId: string]: number } = {};
  ids.forEach((id) => {
    wb.delete(doc(collections.inOut, id));
    items[id]?.categories?.forEach((cId) => {
      if (typeof categoryIds[cId] === 'number') {
        categoryIds[cId] += 1;
      } else {
        categoryIds[cId] = 1;
      }
    });
  });
  Object.entries(categoryIds).forEach(([cId, cnt]) => {
    wb.update(doc(collections.category, cId), {
      count: increment(-cnt),
    });
  });
  await wb.commit();
}

export async function removeCategories(cIds: string[]) {
  const wb = writeBatch(firebase.db);
  cIds.forEach((id) => {
    wb.delete(doc(collections.category, id));
  });
  await wb.commit();
}

export async function aggregateData(uid: User['uid']) {
  const all = await getDocs(query(collections.inOut, where('uid', '==', uid), orderBy('time', 'asc')));
  const categories = await getDocs(query(collections.category, where('uid', '==', uid)));

  let totalIncome = 0,
    totalOutcome = 0;
  const history: History<{
    balance: number;
    income: number;
    outcome: number;
  }> = {};
  const DAY = 24 * 60 * 60 * 1000; // milliseconds

  all.forEach((doc) => {
    const data = doc.data();
    const t = Math.floor(data.time / DAY) * DAY;
    if (!history[t]) {
      history[t] = {
        balance: 0,
        income: 0,
        outcome: 0,
      };
    }
    if (data.type === 'income') {
      history[t].income += data.value;
      totalIncome += data.value;
    } else if (data.type == 'outcome') {
      history[t].outcome += data.value;
      totalOutcome += data.value;
    }
    history[t].balance = totalIncome - totalOutcome;
  });
  const wb = writeBatch(firebase.db);
  wb.set(doc(collections.overall, uid), {
    uid: uid,
    categoryCount: categories.size,
    inOutCount: all.size,
    totalIncome: totalIncome,
    totalOutcome: totalOutcome,
    timeAggregated: new Date().getTime(),
  });
  Object.entries(history).forEach(([t, v]) => {
    wb.set(doc(collections.history, `${uid}_${t}`), {
      uid: uid,
      timestamp: Number(t),
      ...v,
    });
  });
  await wb.commit();
}