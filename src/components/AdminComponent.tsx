import { onMount, Show } from 'solid-js';
import { userSignal } from '../data/signals';
import { mountAuthUI } from '../data/auth';
import { listResponseData, listUserData } from '../data/firestore';

export const AdminComponent = () => {
  const [user] = userSignal;

  onMount(() => {
    mountAuthUI('#sign-in');
  });

  const downloadCsv = (data: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([data + '\n'], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const downloadResponseData = async () => {
    const trials = ['userId,configuration,variant,leftLength,rightLength,response,responseTimeMs'];
    const users = [
      'userId,userName,email,age,eyeColor,collectedData,percentCorrect,iterations,startTime,endTime,exposureDelayMs,exposureDurationMs,version'
    ];
    const userData = await listUserData();
    const data = await listResponseData();
    for (const d of data) {
      const user = userData.find((u) => u.userId === d.userId);
      if (!user || user.userName.toLowerCase() === 'testing') {
        continue;
      }
      users.push(
        `${d.userId},${user.userName},${user.email},${user.age},${user.eyeColor},${user.collectedData},${
          user.percentCorrect
        },${d.iterations},${d.startTime},${d.endTime},${d.exposureDelayMs},${d.exposureDurationMs},${
          (d as any).version || '1.0.0'
        }`
      );
      for (const t of d.trials) {
        trials.push(
          `${d.userId},${t.configuration},${t.variant},${t.leftLength},${t.rightLength},${t.response},${t.responseTimeMs}`
        );
      }
    }
    downloadCsv(trials.join('\n'), 'trial-data.csv');
    downloadCsv(users.join('\n'), 'user-data.csv');
  };

  const isAdmin = () => user() && !user().isAnonymous && user().email === 'kollin.murphy@gmail.com';

  return (
    <Show when={isAdmin()} fallback={<div id="sign-in"></div>}>
      <div class="flex flex-col gap-4 mt-6">
        <button onClick={downloadResponseData} class="btn btn-primary">
          Download Data
        </button>
      </div>
    </Show>
  );
};
