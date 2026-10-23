import { cropFor } from '../photo';

describe('cropFor', () => {
  const landscape = { width: 400, height: 200 };

  it('shows the centered square at zoom 1', () => {
    expect(cropFor(landscape, 100, 1, { x: 0, y: 0 }).crop).toEqual({
      x: 100,
      y: 0,
      side: 200,
    });
  });

  it('keeps the image covering the frame when dragged too far', () => {
    const fit = cropFor(landscape, 100, 1, { x: 999, y: 999 });
    expect(fit.offset).toEqual({ x: 50, y: 0 });
    expect(fit.crop).toEqual({ x: 0, y: 0, side: 200 });
  });

  it('crops a smaller area when zoomed in', () => {
    expect(cropFor(landscape, 100, 2, { x: -100, y: 0 }).crop).toEqual({
      x: 250,
      y: 50,
      side: 100,
    });
  });
});
