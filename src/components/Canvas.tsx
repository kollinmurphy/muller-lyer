import { createEffect } from 'solid-js';
import type { TrialData } from '../data/types';
import { canvasHeight, canvasWidth, drawBorder, drawFigure, drawSampleOverlay } from '../utils/figures';

export const Canvas = (props: {
  mode: 'hidden' | 'sample' | 'figure';
  trial: TrialData | undefined;
  hideBorder?: boolean;
  download?: boolean;
}) => {
  let canvasRef: HTMLCanvasElement | null = null;

  const downloadCanvas = () => {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', `${props.trial.configuration}-${props.trial.variant}.png`);
    (canvasRef as any).toBlob((blob) => {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
  };

  createEffect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (!props.hideBorder) drawBorder(ctx, canvasRef);
    if (props.trial) {
      if (props.mode === 'figure') drawFigure(ctx, canvasRef, props.trial);
      else if (props.mode === 'sample') drawSampleOverlay(ctx, canvasRef, props.trial);
    }
    if (props.download) downloadCanvas();
  });

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};
