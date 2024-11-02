import { createSignal } from 'solid-js';
import { createUserData } from '../data/firestore';
import type { EyeColor } from '../data/types';

export const AccountSetup = (props: { userId: string }) => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [age, setAge] = createSignal(0);
  const [eyeColor, setEyeColor] = createSignal<EyeColor>('blue');

  const save = async () => {
    await createUserData(props.userId, {
      userId: props.userId,
      userName: name(),
      email: email(),
      collectedData: false,
      age: age(),
      eyeColor: eyeColor()
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
          <p>Please fill out the following information to participate in the study.</p>
          <label for="name">Name</label>
          <input type="text" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
          <label for="email">Email</label>
          <input type="text" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
          <label for="age">Age</label>
          <input type="number" value={age()} onInput={(e) => setAge(parseInt(e.currentTarget.value))} />
          <label for="eyeColor">Eye Color</label>
          <select value={eyeColor()} onChange={(e) => setEyeColor(e.currentTarget.value as EyeColor)}>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="green">Green</option>
            <option value="hazel">Hazel</option>
            <option value="amber">Amber</option>
            <option value="gray">Gray</option>
            <option value="other">Other</option>
          </select>
          <button
            class="btn btn-primary mt-2"
            onClick={save}
            classList={{
              'btn-disabled': !name() || !email() || !age()
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
