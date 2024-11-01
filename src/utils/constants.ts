import type { LineConfiguration, LineVariant } from '../data/types';

export const PIXELS_PER_MM = 5.1;

export const figureConfiguration = {
  diagramWidthMm: 100,
  diagramHeightMm: 40,
  canvasColor: 'transparent',
  lineColor: 'black',
  lineWidth: 2,
  border: {
    dashLength: 5,
    dashSpace: 5,
    padding: 5,
    strokeStyle: 'black',
    lineWidth: 1
  },
  sample: {
    strokeStyle: 'red',
    dashLength: 5,
    dashSpace: 5,
    lineWidth: 3,
    mmOffsetY: 5
  }
};
const OBLIQUE_LENGTH = 10;
const obliqueX = Math.round(Math.sin(36 * (Math.PI / 180)) * OBLIQUE_LENGTH);
const obliqueY = Math.round(Math.cos(36 * (Math.PI / 180)) * OBLIQUE_LENGTH);

export const configurations: LineConfiguration[] = ['vertical', 'offset', 'brentano'];
export const variations: LineVariant[] = ['arrowhead', 'square', 'circle'];

export const trialConfiguration = {
  exposureMs: 200,
  trialDelayMs: 3_000,
  totalTrials: 30,
  lengthBuckets: [18, 19, 20, 21],
  configurations: {
    offset: {
      verticalOffsetMm: 10,
      horizontalOffsetMm: 10
    },
    vertical: {
      verticalOffsetMm: 10
    }
  },
  variations: {
    arrowhead: {
      obliqueX,
      obliqueY
    },
    circle: {
      radiusMm: 3
    },
    square: {
      sideLengthMm: 5
    }
  }
};

export const configurationVariations: [LineConfiguration, LineVariant][] = configurations.flatMap(
  (c): [LineConfiguration, LineVariant][] => variations.map((v): [LineConfiguration, LineVariant] => [c, v])
);

export const trialCountPerConfigurationVariant = Math.ceil(
  trialConfiguration.totalTrials / configurationVariations.length
);

trialConfiguration.totalTrials = trialCountPerConfigurationVariant * configurationVariations.length;
