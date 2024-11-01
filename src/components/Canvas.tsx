import { createEffect } from 'solid-js';
import type { TrialData } from '../data/types';
import { canvasHeight, canvasWidth, drawBorder, drawFigure, drawSampleOverlay } from '../utils/figures';

export const Canvas = (props: { mode: 'hidden' | 'sample' | 'figure'; trial: TrialData | undefined }) => {
  let canvasRef: HTMLCanvasElement | null = null;

  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBorder(ctx, canvasRef);
    if (props.trial) {
      if (props.mode === 'figure') drawFigure(ctx, canvasRef, props.trial);
      else if (props.mode === 'sample') drawSampleOverlay(ctx, canvasRef, props.trial);
    }
  });

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};
