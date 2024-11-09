import { createSignal, For, Show } from 'solid-js';
import { userDataSignal } from '../data/signals';
import type { CollectedTrial, CollectionResult, LineConfiguration, LineVariant, State, TrialData } from '../data/types';
import { Canvas } from './Canvas';
import { createResponseData } from '../data/firestore';
import { pickFromList } from '../utils/pick-from-list';
import { configurationVariations, trialConfiguration, trialsPerConfigurationVariation } from '../utils/configuration';
import { ThankYou } from './ThankYou';

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
  return configurationVariations[Math.floor(idx / trialsPerConfigurationVariation)];
}

interface SampleFigure extends TrialData {
  instructions: string[];
}

function getInstructions(configuration: LineConfiguration, variant: LineVariant): string[] {
  switch (variant) {
    case 'baseline': {
      if (configuration === 'vertical') {
        return [
          'You will be asked to compare the lengths of the two lines in the figure above. The lines may be of different lengths.',
          '- "Definitely longer" means that you are confident that the line is much longer.',
          '- "Slightly longer" means that you think the line is a little longer, or you may not be completely sure.',
          '- If you think the lines are the same length, select "same length".',
          'The figure above is a sample figure. The actual figures will be different and will only be shown for a short period of time. If you did not see a figure, please click the "Skip" button below to view a new figure.',
          'There will be variations on the sample figure that you will need to compare. Please read any additional instructions carefully for each new type of figure as they are presented.',
          'The dashed red lines are only for demonstration purposes and will not be present in the actual figures. They indicate the ends of the line segments that you will be comparing.'
        ];
      }
      break;
    }
    case 'arrowhead': {
      if (configuration === 'vertical') {
        return [
          'The following figures will now include additional symbols at the ends of the lines. Only the lines should be compared, not the symbols.'
        ];
      }
      if (configuration === 'brentano') {
        return ['Compare the lengths of the center line segments as indicated by the dashed red lines.'];
      }
      break;
    }
    case 'square': {
      if (configuration === 'brentano') {
        return ['Compare the lengths of the center line segments as indicated by the dashed red lines.'];
      }
      break;
    }
    case 'obliques': {
      if (configuration === 'vertical') {
        return ['Compare the distances between the points of the arrow heads as indicated by the dashed red lines.'];
      }
      if (configuration === 'brentano') {
        return ['Compare the distances between the points of the arrow heads as indicated by the dashed red lines.'];
      }
      break;
    }
  }
  return [];
}

function getSampleFigure(configuration: LineConfiguration, variant: LineVariant): SampleFigure {
  const length = pickFromList(trialConfiguration.lengthBuckets);
  return {
    configuration,
    variant,
    leftLength: length,
    rightLength: length,
    instructions: getInstructions(configuration, variant)
  };
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
  const [figureHiddenAt, setFigureHiddenAt] = createSignal(0);
  const [sampleFigure, setSampleFigure] = createSignal<SampleFigure | null>(
    getSampleFigure(getConfigurationVariation(0)[0], getConfigurationVariation(0)[1])
  );
  const [understandChecked, setUnderstandChecked] = createSignal(false);

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
    setTimeout(() => {
      setShowFigure(true);
    }, trialConfiguration.trialDelayMs);
    setTimeout(() => {
      setFigureHiddenAt(Date.now());
      setShowFigure(false);
      setEnableResponse(true);
    }, trialConfiguration.trialDelayMs + trialConfiguration.exposureMs);
    setState({
      data: [...state().data, subsequent]
    });
    setSampleFigure(null);
  };

  const submitResponse = () => {
    setDone(true);
    setLoading(true);
    createResponseData(userData().userId, {
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
      userId: userData().userId,
      endTime: Date.now(),
      startTime,
      exposureDelayMs: trialConfiguration.trialDelayMs,
      exposureDurationMs: trialConfiguration.exposureMs
    } satisfies CollectionResult).then(() => setLoading(false));
  };

  const respond = (response: TrialData['response']) => {
    const nextData = next();
    if (!nextData) return;
    nextData.response = response;
    nextData.responseTimeMs = Date.now() - figureHiddenAt();
    // TODO: remove log
    // console.log(isCorrect(nextData) ? 'Correct!' : 'Incorrect :(');

    if (state().data.length < trialConfiguration.totalTrials) {
      setShowFigure(false);
      setEnableResponse(false);
      const [nextConfiguration, nextVariant] = getConfigurationVariation(state().data.length);
      const [thisConfiguration, thisVariant] = getConfigurationVariation(state().data.length - 1);
      if (nextConfiguration !== thisConfiguration || nextVariant !== thisVariant) {
        const sample = getSampleFigure(nextConfiguration, nextVariant);
        setSampleFigure(sample);
        setUnderstandChecked(sample.instructions.length === 0);
      } else {
        prepareNextFigure();
      }
    } else {
      submitResponse();
    }
  };

  const skipFigure = () => {
    const data = state().data;
    data.pop();
    setState({ data });
    setShowFigure(false);
    setEnableResponse(false);
    prepareNextFigure();
  };

  const isHorizontal = () => next()?.configuration === 'brentano';
  const left = () => (isHorizontal() ? 'left' : 'top');
  const right = () => (isHorizontal() ? 'right' : 'bottom');
  const mode = () => (showFigure() ? 'figure' : sampleFigure() ? 'sample' : 'hidden');
  const nextOrSample = () => sampleFigure() || next();

  return (
    <div class="flex-1 flex flex-col justify-between items-center mb-4">
      <Show
        when={!done()}
        fallback={
          <div class="py-4 font-bold text-lg">
            <Show when={loading()} fallback={<ThankYou />}>
              <div>Loading...</div>
            </Show>
          </div>
        }
      >
        <div class="pt-4 flex flex-col gap-4 items-center">
          <Canvas trial={nextOrSample()} mode={mode()} />
          <Show when={sampleFigure()}>
            <For each={sampleFigure().instructions}>
              {(instruction) => <div class="text-xl self-start">{instruction}</div>}
            </For>
            <Show when={sampleFigure().instructions.length > 0}>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text text-lg mr-2">I understand the instructions</span>
                  <input
                    type="checkbox"
                    checked={understandChecked()}
                    onChange={() => setUnderstandChecked(!understandChecked())}
                    class="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </Show>
            <button class="btn btn-primary w-min mx-auto" onClick={prepareNextFigure} disabled={!understandChecked()}>
              Continue
            </button>
          </Show>
        </div>
        <Show when={!sampleFigure()}>
          <div
            class="flex gap-2 flex-wrap justify-center py-8 transition-opacity w-[100vw] items-center"
            classList={{
              'opacity-20': !enableResponse(),
              'opacity-100': enableResponse(),
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
          <div>
            <button
              class="btn btn-ghost btn-sm"
              onClick={skipFigure}
              disabled={!enableResponse()}
              classList={{
                'opacity-20': !enableResponse()
              }}
            >
              Skip
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
};
