// A square area of the source image, in its pixels.
export type Crop = { x: number; y: number; side: number };

// Where the image sits in a square crop frame of `frame` px: scaled to cover it, times `zoom`,
// shifted by `offset` (kept so the image always covers the frame), and the area it shows.
export const cropFor = (
  image: { width: number; height: number },
  frame: number,
  zoom: number,
  offset: { x: number; y: number }
) => {
  const scale = (frame / Math.min(image.width, image.height)) * zoom;
  const maxX = (image.width * scale - frame) / 2;
  const maxY = (image.height * scale - frame) / 2;
  const x = Math.min(maxX, Math.max(-maxX, offset.x));
  const y = Math.min(maxY, Math.max(-maxY, offset.y));
  return {
    scale,
    offset: { x, y },
    crop: { x: (maxX - x) / scale, y: (maxY - y) / scale, side: frame / scale },
  };
};

// Crops (centered when no crop is given) to a small square JPEG so it fits in localStorage
// and keeps the PDF light.
export const toSquareJpeg = async (file: File, crop?: Crop, size = 256) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const area = crop ?? {
    x: (bitmap.width - side) / 2,
    y: (bitmap.height - side) / 2,
    side,
  };
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas
    .getContext('2d')!
    .drawImage(bitmap, area.x, area.y, area.side, area.side, 0, 0, size, size);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.85);
};
