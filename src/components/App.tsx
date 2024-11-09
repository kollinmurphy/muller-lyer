import { createEffect, createSignal, Show } from 'solid-js';
import { userDataSignal, userSignal } from '../data/signals';
import { SignIn } from './SignIn';
import { signOut } from '../data/auth';
import { getUserData } from '../data/firestore';
import { AccountSetup } from './AccountSetup';
import { DataCollection } from './DataCollection';
import { ThankYou } from './ThankYou';
import { applicationVersion } from '../utils/configuration';

export const AppComponent = () => {
  const [user] = userSignal;
  const [userData, setUserData] = userDataSignal;

  createEffect(async () => {
    if (!user() || userData()) return;
    console.log('fetching user data');
    const data = await getUserData(user().uid);
    console.log('fetched user data', data);
    setUserData(data);
  });

  const requiresCollection = () => {
    if (!userData()) return false;
    return !userData().collectedData;
  };

  return (
    <div class="flex flex-col items-center justify-between h-screen pb-4">
      <Show when={user()} fallback={<SignIn />}>
        <Show when={userData()} fallback={<AccountSetup userId={user().uid} />}>
          <Show
            when={requiresCollection()}
            fallback={
              <div class="mt-4">
                <ThankYou />
              </div>
            }
          >
            <DataCollection />
          </Show>
        </Show>
        <button class="btn btn-ghost btn-primary btn-xs" onClick={signOut}>
          Sign Out
        </button>
        <div class="text-gray-400 text-xs pt-2 absolute top-1 right-1">v{applicationVersion}</div>
      </Show>
    </div>
  );
};
