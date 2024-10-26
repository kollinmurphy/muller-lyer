import * as fbAuth from 'firebase/auth';
import { auth as AuthUI } from 'firebaseui';
import { firebaseApp } from './firebase';
import { userSignal } from './signals';

const auth = fbAuth.getAuth(firebaseApp);
const authUI = new AuthUI.AuthUI(auth);

export const mountAuthUI = (id: string) => {
  authUI.start(id, {
    signInOptions: [fbAuth.EmailAuthProvider.PROVIDER_ID],
    signInFlow: 'popup',
    signInSuccessUrl: '/app'
  });
};

export const signOut = () => auth.signOut();

const [user, setUser] = userSignal;

auth.onAuthStateChanged((u) => {
  setUser(u);
});

export const initializeAuth = () => {};
