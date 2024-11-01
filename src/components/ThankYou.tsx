import { createEffect, createSignal, onMount } from 'solid-js';
import { userDataSignal } from '../data/signals';

export const ThankYou = () => {
  const [url, setUrl] = createSignal('');
  const [userData] = userDataSignal;

  createEffect(() => {
    if (url()) return;
    fetch('https://dog.ceo/api/breeds/image/random')
      .then((response) => response.json())
      .then((data) => setUrl(data.message));
  });

  const percentCorrect = () => Math.round((userData()?.percentCorrect ?? 0) * 100);

  return (
    <div class="flex flex-col gap-4 items-center text-lg">
      <div class="rounded-lg py-4 px-6 bg-green-100 text-green-900 flex flex-col gap-2">
        <span class="font-semibold">Thank you! You have completed the study.</span>
        <span class="font-light">You answered {percentCorrect()}% of the questions correctly.</span>
      </div>
      <span>Here is a dog photo for your enjoyment.</span>
      <button class="btn btn-primary m4-4" onClick={() => setUrl('')}>
        See another dog
      </button>
      <div class="max-w-[75vw]">
        <img src={url()} class="rounded-lg shadow-xl mt-4 w-full max-h-[50vh] object-cover" />
      </div>
    </div>
  );
};
