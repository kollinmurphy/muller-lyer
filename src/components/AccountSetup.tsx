import { createSignal } from 'solid-js';
import { createUserData } from '../data/firestore';

export const AccountSetup = (props: { userId: string }) => {
  const [name, setName] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [email, setEmail] = createSignal('');

  const save = async () => {
    await createUserData(props.userId, {
      userId: props.userId,
      userName: name(),
      phone: phone(),
      email: email(),
      collectedData: false
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
          <label for="phone">Phone</label>
          <input type="text" value={phone()} onInput={(e) => setPhone(e.currentTarget.value)} />
          <label for="email">Email</label>
          <input type="text" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
          <button
            class="btn btn-primary mt-2"
            onClick={save}
            classList={{
              'btn-disabled': !name() || !phone() || !email()
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
