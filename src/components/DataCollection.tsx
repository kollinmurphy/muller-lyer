import { createSignal, Show } from 'solid-js';
import { userDataSignal } from '../data/signals';
import type { BrentanoData, Cohort, State } from '../data/types';
import { LinesBrentano } from './LinesBrentano';
import { add, differenceInSeconds } from 'date-fns';
import { MOMENTARY_EXPOSURE_MS, PROLONGED_EXPOSURE_MS, RESPONSE_DELAY_MS } from '../utils/constants';
import { createBrentanoData } from '../data/firestore';

function getIterations(cohort: Cohort) {
  switch (cohort) {
    case 'brentano':
      return 10;
    default:
      throw new Error('Invalid cohort');
  }
}

function isCorrect(data: Pick<BrentanoData, 'abLength' | 'bcLength' | 'response'>): boolean {
  if (!data.response) return false;
  switch (data.response) {
    case 'bc-definitely-shorter':
    case 'bc-slightly-shorter':
      return data.bcLength < data.abLength;
    case 'same-length':
      return data.bcLength === data.abLength;
    case 'bc-slightly-longer':
    case 'bc-definitely-longer':
      return data.bcLength > data.abLength;
  }
}

function getIllusionMm(data: Pick<BrentanoData, 'abLength' | 'bcLength' | 'response'>): number {
  if (!data.response || isCorrect(data)) return 0;
  const estimatedLength = data.abLength + getEstimatedDelta(data.response);
  return estimatedLength - data.bcLength;
}

function getEstimatedDelta(response: BrentanoData['response']): number {
  switch (response) {
    case 'bc-definitely-shorter':
      return -5;
    case 'bc-slightly-shorter':
      return -3;
    case 'same-length':
      return 0;
    case 'bc-slightly-longer':
      return 3;
    case 'bc-definitely-longer':
      return 5;
  }
}

export const DataCollection = () => {
  const [userData] = userDataSignal;
  const iterations = () => getIterations(userData().cohort);
  const [state, setState] = createSignal<State>({
    currentIteration: 0,
    data: [
      {
        abLength: 100,
        bcLength: 100,
        exposure: 'prolonged',
        showAt: add(new Date(), { seconds: 5 }).getTime(),
        hideAt: add(new Date(), { seconds: 10 }).getTime()
      }
    ]
  });
  const [show, setShow] = createSignal(true);
  const [done, setDone] = createSignal(false);
  const [enableResponse, setEnableResponse] = createSignal(true);
  const [loading, setLoading] = createSignal(false);

  const next = () => state().data.find((d) => !d.response);

  const respond = (response: BrentanoData['response']) => {
    const nextData = next();
    if (!nextData) return;
    nextData.response = response;
    nextData.responseTime = Date.now();
    nextData.illusionMm = getIllusionMm(nextData);
    console.log((isCorrect(nextData) ? 'Correct!' : 'Incorrect :(') + ' Illusion: ' + nextData.illusionMm + 'mm');
    const subsequent: BrentanoData = {
      abLength: 100,
      bcLength: 100 + Math.round(Math.random() * 30 - 10),
      exposure: state().currentIteration < 5 ? 'prolonged' : 'momentary',
      showAt: add(new Date(), { seconds: 5 }).getTime(),
      hideAt: add(new Date(), { seconds: 10 }).getTime()
    };
    if (state().currentIteration < iterations()) {
      setShow(false);
      setEnableResponse(false);
      setTimeout(() => setShow(true), RESPONSE_DELAY_MS);
      setTimeout(() => {
        setShow(false);
        setEnableResponse(true);
      }, RESPONSE_DELAY_MS + (subsequent.exposure === 'momentary' ? MOMENTARY_EXPOSURE_MS : PROLONGED_EXPOSURE_MS));
      setState({
        currentIteration: state().currentIteration + 1,
        data: [...state().data, subsequent]
      });
    } else {
      setDone(true);
      setLoading(true);
      createBrentanoData(userData().id, {
        correct: state().data.filter(isCorrect).length,
        iterations: state().data.length,
        data: state().data
      }).then(() => setLoading(false));
    }
  };

  return (
    <div>
      <Show
        when={!done()}
        fallback={
          <div>
            <Show when={loading()}>
              <div class="mb-2 font-bold">Loading...</div>
            </Show>
            Thank you! You have completed the task.
          </div>
        }
      >
        <div
          classList={{
            invisible: !show()
          }}
        >
          <LinesBrentano lengthAb={next().abLength} lengthBc={next().bcLength} />
        </div>
        <div>
          <button class="btn btn-primary" disabled={!enableResponse()} onClick={() => respond('bc-definitely-shorter')}>
            BC is definitely shorter
          </button>
          <button class="btn btn-primary" disabled={!enableResponse()} onClick={() => respond('bc-slightly-shorter')}>
            BC is slightly shorter
          </button>
          <button class="btn btn-primary" disabled={!enableResponse()} onClick={() => respond('same-length')}>
            BC is the same length
          </button>
          <button class="btn btn-primary" disabled={!enableResponse()} onClick={() => respond('bc-slightly-longer')}>
            BC is slightly longer
          </button>
          <button class="btn btn-primary" disabled={!enableResponse()} onClick={() => respond('bc-definitely-longer')}>
            BC is definitely longer
          </button>
        </div>
      </Show>
    </div>
  );
};
