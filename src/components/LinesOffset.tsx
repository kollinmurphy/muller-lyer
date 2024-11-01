import { createEffect } from 'solid-js';
import {
  DIAGRAM_HEIGHT_MM,
  DIAGRAM_WIDTH_MM,
  LINES_HORIZONTAL_OFFSET,
  LINES_VERTICAL_OFFSET,
  OBLIQUE_X,
  OBLIQUE_Y
} from '../utils/configuration';
import { drawArrowheadLine } from '../utils/figures';

export const LinesOffset = () => {
  let canvasRef: HTMLCanvasElement | null = null;
  const lengthA = 100;
  const lengthB = 100;

  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, DIAGRAM_WIDTH_MM, DIAGRAM_HEIGHT_MM);
    drawArrowheadLine(ctx, [DIAGRAM_WIDTH_MM / 2, DIAGRAM_HEIGHT_MM / 2], lengthA, { obliquesInward: true });
    drawArrowheadLine(
      ctx,
      [DIAGRAM_WIDTH_MM / 2 + LINES_HORIZONTAL_OFFSET, DIAGRAM_HEIGHT_MM / 2 + LINES_VERTICAL_OFFSET],
      lengthB,
      { obliquesInward: false }
    );
  });

  return <canvas ref={canvasRef} width={DIAGRAM_WIDTH_MM} height={DIAGRAM_HEIGHT_MM} />;
};
