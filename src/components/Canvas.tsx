import { createEffect } from 'solid-js';
import type { TrialData } from '../data/types';
import { canvasHeight, canvasWidth, drawBorder, drawFigure } from '../utils/figures';

export const Canvas = (props: { showFigure: boolean; trial: TrialData | undefined }) => {
  let canvasRef: HTMLCanvasElement | null = null;

  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBorder(ctx, canvasRef);
    if (props.showFigure && props.trial) drawFigure(ctx, canvasRef, props.trial);
  });

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};
