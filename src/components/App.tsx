import { createEffect, createSignal, Show } from 'solid-js';
import { userDataSignal, userSignal } from '../data/signals';
import { SignIn } from './SignIn';
import { signOut } from '../data/auth';
import { getUserData } from '../data/firestore';
import { AccountSetup } from './AccountSetup';
import { isSameDay } from 'date-fns';
import { DataCollection } from './DataCollection';

export const AppComponent = () => {
  const [user] = userSignal;
  const [userData, setUserData] = userDataSignal;

  createEffect(async () => {
    if (!user() || userData()) return;
    const data = await getUserData(user().uid);
    setUserData(data);
  });

  const requiresCollectionToday = () => {
    if (!userData()) return false;
    const lastCollection = new Date(userData().lastCollectionDateTime);
    const today = new Date();
    return !isSameDay(lastCollection, today);
  };

  return (
    <Show when={user()} fallback={<SignIn />}>
      <Show when={userData()} fallback={<AccountSetup userId={user().uid} />}>
        <Show when={requiresCollectionToday()} fallback={<div>You're all set! Check back in tomorrow for your next collection.</div>}>
          <DataCollection />
        </Show>
      </Show>
      <button class="btn btn-outline btn-primary" onClick={signOut}>
        Sign Out
      </button>
    </Show>
  );
};
