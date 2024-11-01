import type { TrialData } from '../data/types';
import { figureConfiguration, PIXELS_PER_MM, trialConfiguration } from './constants';

export const canvasWidth = figureConfiguration.diagramWidthMm * PIXELS_PER_MM;
export const canvasHeight = figureConfiguration.diagramHeightMm * PIXELS_PER_MM;
const sampleOffsetY = figureConfiguration.sample.mmOffsetY * PIXELS_PER_MM;

function drawArrowheadLine(
  ctx: CanvasRenderingContext2D,
  topLeft: [number, number],
  length: number,
  options: {
    obliquesInward: boolean;
    drawLeft: boolean;
    sample: boolean;
  }
) {
  const [topLeftX, topLeftY] = topLeft;
  ctx.strokeStyle = figureConfiguration.lineColor;
  ctx.lineWidth = figureConfiguration.lineWidth;
  ctx.beginPath();

  const headDir = options.obliquesInward ? 1 : -1;

  // center
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + length, topLeftY);

  if (options.drawLeft) {
    // top left
    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(
      topLeftX + trialConfiguration.variations.arrowhead.obliqueX * headDir,
      topLeftY - trialConfiguration.variations.arrowhead.obliqueY
    );

    // bottom left
    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(
      topLeftX + trialConfiguration.variations.arrowhead.obliqueX * headDir,
      topLeftY + trialConfiguration.variations.arrowhead.obliqueY
    );
  }

  // top right
  ctx.moveTo(topLeftX + length, topLeftY);
  ctx.lineTo(
    topLeftX + length - trialConfiguration.variations.arrowhead.obliqueX * headDir,
    topLeftY - trialConfiguration.variations.arrowhead.obliqueY
  );

  // bottom right
  ctx.moveTo(topLeftX + length, topLeftY);
  ctx.lineTo(
    topLeftX + length - trialConfiguration.variations.arrowhead.obliqueX * headDir,
    topLeftY + trialConfiguration.variations.arrowhead.obliqueY
  );

  ctx.stroke();

  if (options.sample) {
    ctx.setLineDash([figureConfiguration.sample.dashLength, figureConfiguration.sample.dashSpace]);
    ctx.beginPath();
    ctx.strokeStyle = figureConfiguration.sample.strokeStyle;
    ctx.lineWidth = figureConfiguration.sample.lineWidth;

    if (options.drawLeft) {
      ctx.moveTo(topLeftX, topLeftY - sampleOffsetY);
      ctx.lineTo(topLeftX, topLeftY + sampleOffsetY);
    }

    ctx.moveTo(topLeftX + length, topLeftY - sampleOffsetY);
    ctx.lineTo(topLeftX + length, topLeftY + sampleOffsetY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawCircleLine(
  ctx: CanvasRenderingContext2D,
  topLeft: [number, number],
  length: number,
  options: {
    obliquesInward: boolean;
    drawLeft: boolean;
    sample: boolean;
  }
) {
  const radius = trialConfiguration.variations.circle.radiusMm * PIXELS_PER_MM;
  const [topLeftX, topLeftY] = topLeft;
  ctx.strokeStyle = figureConfiguration.lineColor;
  ctx.lineWidth = figureConfiguration.lineWidth;
  ctx.beginPath();

  // center
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + length, topLeftY);
  ctx.stroke();

  const headDir = options.obliquesInward ? 1 : -1;
  const offset = headDir * radius;

  // left circle
  if (options.drawLeft) {
    ctx.beginPath();
    ctx.arc(topLeftX + offset, topLeftY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // right circle
  ctx.beginPath();
  ctx.arc(topLeftX + length - offset, topLeftY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  if (options.sample) {
    ctx.setLineDash([figureConfiguration.sample.dashLength, figureConfiguration.sample.dashSpace]);
    ctx.beginPath();
    ctx.strokeStyle = figureConfiguration.sample.strokeStyle;
    ctx.lineWidth = figureConfiguration.sample.lineWidth;

    if (options.drawLeft) {
      ctx.moveTo(topLeftX, topLeftY - sampleOffsetY);
      ctx.lineTo(topLeftX, topLeftY + sampleOffsetY);
    }

    ctx.moveTo(topLeftX + length, topLeftY - sampleOffsetY);
    ctx.lineTo(topLeftX + length, topLeftY + sampleOffsetY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawSquareLine(
  ctx: CanvasRenderingContext2D,
  topLeft: [number, number],
  length: number,
  options: {
    obliquesInward: boolean;
    drawLeft: boolean;
    sample: boolean;
  }
) {
  const sideLength = trialConfiguration.variations.square.sideLengthMm * PIXELS_PER_MM;
  const [topLeftX, topLeftY] = topLeft;
  ctx.strokeStyle = figureConfiguration.lineColor;
  ctx.lineWidth = figureConfiguration.lineWidth;
  ctx.beginPath();

  // center
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + length, topLeftY);
  ctx.stroke();

  const halfSideLength = sideLength / 2;
  const y = topLeftY - halfSideLength;

  // left square
  if (options.drawLeft) {
    const offset = (options.obliquesInward ? 0 : -2) * halfSideLength;
    ctx.beginPath();
    ctx.rect(topLeftX + offset, y, sideLength, sideLength);
    ctx.stroke();
  }

  // right square
  const offset = (options.obliquesInward ? -2 : 0) * halfSideLength;
  ctx.beginPath();
  ctx.rect(topLeftX + length + offset, y, sideLength, sideLength);
  ctx.stroke();

  if (options.sample) {
    ctx.setLineDash([figureConfiguration.sample.dashLength, figureConfiguration.sample.dashSpace]);
    ctx.beginPath();
    ctx.strokeStyle = figureConfiguration.sample.strokeStyle;
    ctx.lineWidth = figureConfiguration.sample.lineWidth;
    if (options.drawLeft) {
      ctx.moveTo(topLeftX, topLeftY - sampleOffsetY);
      ctx.lineTo(topLeftX, topLeftY + sampleOffsetY);
    }

    ctx.moveTo(topLeftX + length, topLeftY - sampleOffsetY);
    ctx.lineTo(topLeftX + length, topLeftY + sampleOffsetY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function drawBorder(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.setLineDash([figureConfiguration.border.dashLength, figureConfiguration.border.dashSpace]);
  ctx.strokeStyle = figureConfiguration.border.strokeStyle;
  ctx.lineWidth = figureConfiguration.border.lineWidth;
  ctx.strokeRect(
    figureConfiguration.border.padding,
    figureConfiguration.border.padding,
    canvas.width - figureConfiguration.border.padding * 2,
    canvas.height - figureConfiguration.border.padding * 2
  );
  ctx.setLineDash([]);
}

export function selectPositions(config: TrialData): { left: [number, number]; right: [number, number] } {
  const leftLength = config.leftLength * PIXELS_PER_MM;
  const rightLength = config.rightLength * PIXELS_PER_MM;
  switch (config.configuration) {
    case 'brentano': {
      const diagramPadding = canvasWidth / 2 - (leftLength + rightLength) / 2;
      return {
        left: [diagramPadding, canvasHeight / 2],
        right: [diagramPadding + leftLength, canvasHeight / 2]
      };
    }
    case 'vertical': {
      const halfOffsetY = (trialConfiguration.configurations.vertical.verticalOffsetMm * PIXELS_PER_MM) / 2;
      return {
        left: [canvasWidth / 2 - leftLength / 2, canvasHeight / 2 - halfOffsetY],
        right: [canvasWidth / 2 - rightLength / 2, canvasHeight / 2 + halfOffsetY]
      };
    }
    case 'offset': {
      const halfOffsetY = (trialConfiguration.configurations.offset.verticalOffsetMm * PIXELS_PER_MM) / 2;
      return {
        left: [canvasWidth / 2 - leftLength / 2, canvasHeight / 2 - halfOffsetY],
        right: [
          canvasWidth / 2 -
            leftLength / 2 +
            trialConfiguration.configurations.offset.horizontalOffsetMm * PIXELS_PER_MM,
          canvasHeight / 2 + halfOffsetY
        ]
      };
    }
  }
}

export function drawFigure(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: TrialData,
  sample: boolean = false
) {
  ctx.fillStyle = figureConfiguration.canvasColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const leftLength = config.leftLength * PIXELS_PER_MM;
  const rightLength = config.rightLength * PIXELS_PER_MM;
  const { left: leftUnrounded, right: rightUnrounded } = selectPositions(config);
  const left = leftUnrounded.map((v) => Math.round(v)) as [number, number];
  const right = rightUnrounded.map((v) => Math.round(v)) as [number, number];
  switch (config.variant) {
    case 'arrowhead':
      drawArrowheadLine(ctx, left, leftLength, { obliquesInward: true, drawLeft: true, sample });
      drawArrowheadLine(ctx, right, rightLength, {
        obliquesInward: false,
        drawLeft: config.configuration !== 'brentano',
        sample
      });
      break;
    case 'circle':
      drawCircleLine(ctx, left, leftLength, { obliquesInward: true, drawLeft: true, sample });
      drawCircleLine(ctx, right, rightLength, {
        obliquesInward: false,
        drawLeft: config.configuration !== 'brentano',
        sample
      });
      break;
    case 'square':
      drawSquareLine(ctx, left, leftLength, { obliquesInward: true, drawLeft: true, sample });
      drawSquareLine(ctx, right, rightLength, {
        obliquesInward: false,
        drawLeft: config.configuration !== 'brentano',
        sample
      });
  }
}

export function drawSampleOverlay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: TrialData) {
  drawFigure(ctx, canvas, config, true);
  ctx.fillStyle = 'black';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Sample', 15, 15);
}
