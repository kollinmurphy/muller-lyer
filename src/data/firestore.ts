import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc, orderBy, limit, query, startAfter, DocumentSnapshot } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import type { CollectionResult, UserData } from './types';
import { userDataSignal } from './signals';
import { applicationVersion } from '../utils/configuration';

const db = getFirestore(firebaseApp);
const USER_DATA_COLLECTION = 'userData';
const RESPONSE_DATA_COLLECTION = 'responseData';

export const getUserData = async (userId: string) => {
  const docData = await getDoc(doc(db, USER_DATA_COLLECTION, userId));
  if (!docData.exists()) return null;
  return { ...docData.data(), userId } as UserData;
};

export const createUserData = async (userId: string, userData: UserData) => {
  await setDoc(doc(collection(db, USER_DATA_COLLECTION), userId), userData);
  return { ...userData, userId } as UserData;
};

export const updateUserData = async (uid: string, userData: Partial<UserData>) => {
  await updateDoc(doc(db, USER_DATA_COLLECTION, uid), userData);
};

export const createResponseData = async (userId: string, data: CollectionResult) => {
  await setDoc(doc(collection(db, RESPONSE_DATA_COLLECTION), userId), { ...data, userId, version: applicationVersion });
  const percentCorrect = data.correct / data.iterations;
  await updateDoc(doc(db, USER_DATA_COLLECTION, userId), {
    collectedData: true,
    percentCorrect
  } satisfies Partial<UserData>);
  const [_, setUserData] = userDataSignal;
  setUserData((prev) => ({ ...prev!, collectedData: true, percentCorrect }));
};

const PAGE_SIZE = 10;

export const listUserData = async () => {
    const data = [];
    let last: DocumentSnapshot | undefined = undefined;
    let page = await getUserDataPage();
    while (page.data.length > 0) {
        data.push(...page.data);
        last = page.last;
        page = await getUserDataPage(last);
    }
    return data as UserData[];
}

export const listResponseData = async () => {
    const data = [];
    let last: DocumentSnapshot | undefined = undefined;
    let page = await getResponseDataPage();
    while (page.data.length > 0) {
        data.push(...page.data);
        last = page.last;
        page = await getResponseDataPage(last);
    }
    return data as (CollectionResult & {version?: string})[];
}

const getUserDataPage = async (last?: DocumentSnapshot) => {
    const filter = [orderBy('userId'), limit(PAGE_SIZE), last ? startAfter(last) : undefined].filter(Boolean);
    const q = query(collection(db, USER_DATA_COLLECTION), ...filter);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id }) as UserData);
    return {data, last: snapshot.docs[snapshot.docs.length - 1]};
}

const getResponseDataPage = async (last?: DocumentSnapshot) => {
    const filter = [orderBy('userId'), limit(PAGE_SIZE), last ? startAfter(last) : undefined].filter(Boolean);
    const q = query(collection(db, RESPONSE_DATA_COLLECTION), ...filter);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id }) as CollectionResult);
    return {data, last: snapshot.docs[snapshot.docs.length - 1]};
}
