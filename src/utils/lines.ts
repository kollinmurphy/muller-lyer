import { OBLIQUE_X, OBLIQUE_Y } from './constants';

export function drawLine(
  ctx: CanvasRenderingContext2D,
  topLeft: [number, number],
  length: number,
  options: {
    obliquesInward: boolean;
  }
) {
  const [topLeftX, topLeftY] = topLeft;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const headDir = options.obliquesInward ? 1 : -1;

  // center
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + length, topLeftY);

  // top left
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + OBLIQUE_X * headDir, topLeftY - OBLIQUE_Y);

  // top right
  ctx.moveTo(topLeftX + length, topLeftY);
  ctx.lineTo(topLeftX + length - OBLIQUE_X * headDir, topLeftY - OBLIQUE_Y);

  // bottom left
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX + OBLIQUE_X * headDir, topLeftY + OBLIQUE_Y);

  // bottom right
  ctx.moveTo(topLeftX + length, topLeftY);
  ctx.lineTo(topLeftX + length - OBLIQUE_X * headDir, topLeftY + OBLIQUE_Y);

  ctx.stroke();
}
