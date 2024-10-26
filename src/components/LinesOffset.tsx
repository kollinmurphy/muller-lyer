import { createEffect } from 'solid-js';
import { DIAGRAM_HEIGHT, DIAGRAM_WIDTH, LINES_HORIZONTAL_OFFSET, LINES_VERTICAL_OFFSET, OBLIQUE_X, OBLIQUE_Y } from '../utils/constants';
import { drawLine } from '../utils/lines';

export const LinesOffset = () => {
  let canvasRef: HTMLCanvasElement | null = null;
  const lengthA = 100;
  const lengthB = 100;

  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, DIAGRAM_WIDTH, DIAGRAM_HEIGHT);
    drawLine(ctx, [DIAGRAM_WIDTH / 2, DIAGRAM_HEIGHT / 2], lengthA, { obliquesInward: true });
    drawLine(ctx, [DIAGRAM_WIDTH / 2 + LINES_HORIZONTAL_OFFSET, DIAGRAM_HEIGHT / 2 + LINES_VERTICAL_OFFSET], lengthB, { obliquesInward: false });
  });

  return <canvas ref={canvasRef} width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} />;
};
