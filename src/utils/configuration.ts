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

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

const OBLIQUE_LENGTH_MM = 3;
const OBLIQUE_DEGREES = 36;

function calculateObliqueLengths(degrees: number, mm: number): [number, number] {
  return [
    Math.round(Math.sin(degreesToRadians(degrees)) * mm * PIXELS_PER_MM),
    Math.round(Math.cos(degreesToRadians(degrees)) * mm * PIXELS_PER_MM)
  ];
}

const [obliqueX, obliqueY] = calculateObliqueLengths(OBLIQUE_DEGREES, OBLIQUE_LENGTH_MM);
const [circleObliqueX, circleObliqueY] = calculateObliqueLengths(60, 5);

// export const configurations: LineConfiguration[] = ['brentano'];
// export const variations: LineVariant[] = ['obliques'];

// export const trialsPerConfigurationVariation = 1;

export const configurations: LineConfiguration[] = ['vertical', 'offset', 'brentano'];
export const variations: LineVariant[] = ['arrowhead', 'square', 'circle', 'obliques'];

export const trialsPerConfigurationVariation = 5;

export const configurationVariations: [LineConfiguration, LineVariant][] = configurations.flatMap(
  (c): [LineConfiguration, LineVariant][] => variations.map((v): [LineConfiguration, LineVariant] => [c, v])
);

export const trialConfiguration = {
  exposureMs: 350,
  trialDelayMs: 3_000,
  totalTrials: configurationVariations.length * trialsPerConfigurationVariation,
  lengthBuckets: [18, 19, 20, 21],
  configurations: {
    offset: {
      verticalOffsetMm: 13,
      horizontalOffsetMm: 10
    },
    vertical: {
      verticalOffsetMm: 13
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
    },
    obliqueCircles: {
      obliqueX: circleObliqueX,
      obliqueY: circleObliqueY,
      radiusMm: 1
    }
  }
};
