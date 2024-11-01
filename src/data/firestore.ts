import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import type { CollectionResult, UserData } from './types';
import { userDataSignal } from './signals';

const db = getFirestore(firebaseApp);
const USER_DATA_COLLECTION = 'userData';
const RESPONSE_DATA_COLLECTION = 'responseData';

export const getUserData = async (userId: string) => {
  const docData = await getDoc(doc(db, USER_DATA_COLLECTION, userId));
  if (!docData.exists()) return null;
  return { ...docData.data(), userId } as UserData;
};

export const createUserData = async (userId: string, userData: UserData) => {
  const docRef = await setDoc(doc(collection(db, USER_DATA_COLLECTION), userId), userData);
  return { ...userData, userId } as UserData;
};

export const updateUserData = async (uid: string, userData: Partial<UserData>) => {
  await updateDoc(doc(db, USER_DATA_COLLECTION, uid), userData);
};

export const createResponseData = async (userId: string, data: CollectionResult) => {
  await setDoc(doc(collection(db, RESPONSE_DATA_COLLECTION), userId), { ...data, userId });
  const percentCorrect = data.correct / data.iterations;
  await updateDoc(doc(db, USER_DATA_COLLECTION, userId), {
    collectedData: true,
    percentCorrect
  } satisfies Partial<UserData>);
  const [_, setUserData] = userDataSignal;
  setUserData((prev) => ({ ...prev!, collectedData: true, percentCorrect }));
};
