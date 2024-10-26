import { createEffect } from 'solid-js';
import { DIAGRAM_HEIGHT, DIAGRAM_WIDTH } from '../utils/constants';
import { drawLine } from '../utils/lines';

export const LinesBrentano = (props: { lengthAb: number; lengthBc: number }) => {
  let canvasRef: HTMLCanvasElement | null = null;
  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, DIAGRAM_WIDTH, DIAGRAM_HEIGHT);
    drawLine(ctx, [DIAGRAM_WIDTH / 2, DIAGRAM_HEIGHT / 2], props.lengthAb, { obliquesInward: true });
    drawLine(ctx, [DIAGRAM_WIDTH / 2 + 100, DIAGRAM_HEIGHT / 2], props.lengthBc, { obliquesInward: false });
  });

  return <canvas ref={canvasRef} width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} />;
};
