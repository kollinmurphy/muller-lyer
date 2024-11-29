import { For } from 'solid-js';
import { Canvas } from './Canvas';
import { configurationVariations, trialConfiguration } from '../utils/configuration';

export const Samples = () => {
  return (
    <div>
      <h1>Samples</h1>

      <For each={configurationVariations}>
        {([configuration, variation]) => (
          <Canvas
            mode="figure"
            trial={{
              configuration,
              variant: variation,
              leftLength: trialConfiguration.lengthBuckets[2],
              rightLength: trialConfiguration.lengthBuckets[2]
            }}
            hideBorder={true}
            download={true}
          />
        )}
      </For>
    </div>
  );
};
