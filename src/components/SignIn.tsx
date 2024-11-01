import { onMount } from 'solid-js';
import { signIn } from '../data/auth';

export const SignIn = () => {
  onMount(() => {
    signIn();
  });

  return <div id="firebase-auth"></div>;
};
