import { createEffect, createSignal, onMount } from 'solid-js';

export const ThankYou = () => {
  const [url, setUrl] = createSignal('');

  createEffect(() => {
    if (url()) return;
    fetch('https://dog.ceo/api/breeds/image/random')
      .then((response) => response.json())
      .then((data) => setUrl(data.message));
  });

  return (
    <div class="flex flex-col items-center">
      <span>Thank you! You have completed the task. Here is a dog photo for your enjoyment.</span>
      <button class="btn btn-primary my-4" onClick={() => setUrl('')}>
        Get another dog
      </button>
      <div class="max-w-[75vw]">
        <img src={url()} class="rounded-lg shadow-xl mt-4 w-full max-h-[50vh] object-cover" />
      </div>
    </div>
  );
};
