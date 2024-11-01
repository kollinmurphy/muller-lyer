import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import type { CollectionResult, UserData } from './types';

const db = getFirestore(firebaseApp);
const USER_DATA_COLLECTION = 'userData';
const RESPONSE_DATA_COLLECTION = 'responseData';

export const getUserData = async (userId: string) => {
  const q = query(collection(db, USER_DATA_COLLECTION), where('userId', '==', userId));
  const docs = await getDocs(q);
  if (docs.empty) return null;
  const userData = docs.docs[0];
  const data = userData.data();
  return { id: userData.id, ...data } as UserData;
};

export const createUserData = async (userData: Omit<UserData, 'id'>) => {
  const docRef = await addDoc(collection(db, USER_DATA_COLLECTION), userData);
  return { id: docRef.id, ...userData } as UserData;
};

export const updateUserData = async (id: UserData['id'], userData: Partial<UserData>) => {
  await updateDoc(doc(db, USER_DATA_COLLECTION, id), userData);
};

export const createResponseData = async (userId: string, data: CollectionResult) => {
  await addDoc(collection(db, RESPONSE_DATA_COLLECTION), { userId, ...data });
  await updateDoc(doc(db, USER_DATA_COLLECTION, userId), { lastCollectionDateTime: Date.now() });
};
