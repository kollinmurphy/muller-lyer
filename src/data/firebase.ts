import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyADLgGrUZrPvUZYXiLoJ_Xhtopv-Jhxn-Y',
  authDomain: 'muller-lyer.firebaseapp.com',
  projectId: 'muller-lyer',
  storageBucket: 'muller-lyer.appspot.com',
  messagingSenderId: '288605487901',
  appId: '1:288605487901:web:80e829ed4c8f7bdbfc57f4'
};

export const firebaseApp = initializeApp(firebaseConfig);
