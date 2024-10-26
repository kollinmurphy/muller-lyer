import { onMount } from 'solid-js';
import { mountAuthUI } from '../data/auth';

export const SignIn = () => {
  onMount(() => {
    mountAuthUI('#firebase-auth');
  });

  return <div id="firebase-auth"></div>;
};
