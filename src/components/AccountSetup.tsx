import { createSignal } from 'solid-js';
import type { Cohort } from '../data/types';
import { createUserData } from '../data/firestore';

export const AccountSetup = (props: { userId: string }) => {
  const [name, setName] = createSignal('');
  const [cohort, setCohort] = createSignal<Cohort | null>(null);

  const save = async () => {
    await createUserData({
      userId: props.userId,
      userName: name(),
      cohort: cohort(),
      lastCollectionDateTime: 0
    });
    location.reload();
  };

  return (
    <div class="card w-96 mx-auto shadow-lg">
      <div class="card-body">
        <div class="card-title">
          <h1>Welcome!</h1>
        </div>
        <div class="flex flex-col gap-2">
          <p>Please fill out the following information to complete your account setup.</p>
          <label for="name">Name</label>
          <input type="text" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
          <label for="cohort">Cohort</label>
          <select value={cohort()} onChange={(e) => setCohort(e.currentTarget.value as Cohort)}>
            <option value="brentano">Brentano</option>
          </select>
          <button class="btn btn-primary mt-2" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
