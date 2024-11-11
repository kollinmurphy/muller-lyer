import { createSignal } from 'solid-js';
import { createUserData } from '../data/firestore';
import type { EyeColor, Gender } from '../data/types';
import { applicationVersion } from '../utils/configuration';

export const AccountSetup = (props: { userId: string }) => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [age, setAge] = createSignal(0);
  const [gender, setGender] = createSignal<Gender>('female');
  const [eyeColor, setEyeColor] = createSignal<EyeColor>('blue');

  const save = async () => {
    await createUserData(props.userId, {
      userId: props.userId,
      userName: name(),
      email: email(),
      collectedData: false,
      age: age(),
      eyeColor: eyeColor(),
      gender: gender()
    });
    location.reload();
  };

  return (
    <div>
      <div class="card w-96 mx-auto shadow-lg">
        <div class="card-body">
          <div class="card-title">
            <h1>Welcome!</h1>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-bold text-xl text-red-600">
              This study can only be completed with a laptop or desktop computer, not a mobile device.
            </p>
            <p>Please fill out the following information to participate in the study.</p>
            <p>It should take less than 10 minutes to complete.</p>
            <label for="name">Name</label>
            <input type="text" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
            <label for="email">Email</label>
            <input type="text" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
            <label for="age">Age</label>
            <input type="number" value={age()} onInput={(e) => setAge(parseInt(e.currentTarget.value))} />
            <label for="gender">Gender</label>
            <select value={gender()} onChange={(e) => setGender(e.currentTarget.value as Gender)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="-">Prefer not to say</option>
            </select>
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
      <div class="text-gray-400 text-xs pt-2">v{applicationVersion}</div>
    </div>
  );
};
