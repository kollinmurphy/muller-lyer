import { createSignal, onMount, Show } from 'solid-js';
import { userDataSignal } from '../data/signals';
import type { CollectedTrial, CollectionResult, LineConfiguration, LineVariant, State, TrialData } from '../data/types';
import { Canvas } from './Canvas';
import { createResponseData } from '../data/firestore';
import { getNextTrialDelay } from '../utils/delay';
import { pickFromList } from '../utils/pick-from-list';
import { configurationVariations, trialConfiguration, trialCountPerConfigurationVariant } from '../utils/constants';

function isCorrect(data: Pick<TrialData, 'leftLength' | 'rightLength' | 'response'>): boolean {
  if (!data.response) return false;
  switch (data.response) {
    case 'left-definitely-longer':
    case 'left-slightly-longer':
      return data.leftLength > data.rightLength;
    case 'same-length':
      return data.leftLength === data.rightLength;
    case 'right-slightly-longer':
    case 'right-definitely-longer':
      return data.rightLength > data.leftLength;
  }
}

function getConfigurationVariation(idx: number): [LineConfiguration, LineVariant] {
  return configurationVariations[Math.floor(idx / trialCountPerConfigurationVariant)];
}

export const DataCollection = () => {
  const startTime = Date.now();
  const [userData] = userDataSignal;
  const [state, setState] = createSignal<State>({
    data: []
  });
  const [showFigure, setShowFigure] = createSignal(false);
  const [done, setDone] = createSignal(false);
  const [enableResponse, setEnableResponse] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [figureShownAt, setFigureShownAt] = createSignal(0);
  const [paused, setPaused] = createSignal(false);

  const next = () => state().data.find((d) => !d.response);

  const prepareNextFigure = () => {
    const currentIdx = state().data.length;
    const [configuration, variation] = getConfigurationVariation(currentIdx);
    const subsequent: TrialData = {
      configuration,
      variant: variation,
      leftLength: pickFromList(trialConfiguration.lengthBuckets),
      rightLength: pickFromList(trialConfiguration.lengthBuckets)
    };
    console.log(subsequent);
    const delay = getNextTrialDelay();
    setTimeout(() => {
      setShowFigure(true);
      setFigureShownAt(Date.now());
    }, delay);
    setTimeout(() => {
      setShowFigure(false);
      setEnableResponse(true);
    }, delay + trialConfiguration.exposureMs);
    setState({
      data: [...state().data, subsequent]
    });
    setPaused(false);
  };

  const respond = (response: TrialData['response']) => {
    const nextData = next();
    if (!nextData) return;
    nextData.response = response;
    nextData.responseTimeMs = Date.now() - figureShownAt();
    // TODO: remove log
    console.log(isCorrect(nextData) ? 'Correct!' : 'Incorrect :(');

    if (state().data.length < trialConfiguration.totalTrials) {
      setShowFigure(false);
      setEnableResponse(false);
      const [nextConfiguration, nextVariant] = getConfigurationVariation(state().data.length);
      const [thisConfiguration, thisVariant] = getConfigurationVariation(state().data.length - 1);
      if (nextConfiguration !== thisConfiguration || nextVariant !== thisVariant) {
        setPaused(true);
      } else {
        prepareNextFigure();
      }
    } else {
      setDone(true);
      setLoading(true);
      createResponseData(userData().id, {
        correct: state().data.filter(isCorrect).length,
        iterations: state().data.length,
        trials: state().data.map(
          (trial) =>
            ({
              configuration: trial.configuration,
              variant: trial.variant,
              leftLength: trial.leftLength,
              response: trial.response!,
              responseTimeMs: trial.responseTimeMs!,
              rightLength: trial.rightLength
            } satisfies CollectedTrial)
        ),
        userId: userData().id,
        endTime: Date.now(),
        startTime,
        exposureDelayMs: trialConfiguration.exposureMs,
        exposureDurationMs: trialConfiguration.exposureMs
      } satisfies CollectionResult).then(() => setLoading(false));
    }
  };

  onMount(prepareNextFigure);

  const isHorizontal = () => next()?.configuration === 'brentano';
  const left = () => (isHorizontal() ? 'left' : 'top');
  const right = () => (isHorizontal() ? 'right' : 'bottom');

  return (
    <div class="flex-1 flex flex-col justify-between items-center mb-4">
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
        <div class="pt-4 flex flex-col gap-4">
          <Canvas trial={next()} showFigure={showFigure()} />
          <Show when={paused()}>
            <div class="bg-gray-200 p-4 rounded-lg flex flex-col gap-3 items-center">
              <span>Section complete.</span>
              <button class="btn btn-primary" onClick={prepareNextFigure}>
                Continue
              </button>
            </div>
          </Show>
        </div>
        <div
          class="flex gap-2 flex-wrap justify-center opacity-30 py-8 transition-opacity w-[100vw] items-center"
          classList={{
            'hover:opacity-100': enableResponse(),
            'flex-row': isHorizontal(),
            'flex-col': !isHorizontal(),
            invisible: !next()
          }}
        >
          <button
            class="btn btn-primary"
            classList={{ 'w-[300px]': !isHorizontal() }}
            disabled={!enableResponse()}
            onClick={() => respond('left-definitely-longer')}
          >
            {left()} is definitely longer
          </button>
          <button
            class="btn btn-primary"
            classList={{ 'w-[300px]': !isHorizontal() }}
            disabled={!enableResponse()}
            onClick={() => respond('left-slightly-longer')}
          >
            {left()} is slightly longer
          </button>
          <button
            class="btn btn-primary"
            classList={{ 'w-[300px]': !isHorizontal() }}
            disabled={!enableResponse()}
            onClick={() => respond('same-length')}
          >
            same length
          </button>
          <button
            class="btn btn-primary"
            classList={{ 'w-[300px]': !isHorizontal() }}
            disabled={!enableResponse()}
            onClick={() => respond('right-slightly-longer')}
          >
            {right()} is slightly longer
          </button>
          <button
            class="btn btn-primary"
            classList={{ 'w-[300px]': !isHorizontal() }}
            disabled={!enableResponse()}
            onClick={() => respond('right-definitely-longer')}
          >
            {right()} is definitely longer
          </button>
        </div>
      </Show>
    </div>
  );
};