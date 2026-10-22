// Center-crops to a small square JPEG so it fits in localStorage and keeps the PDF light.
export const toSquareJpeg = async (file: File, size = 256) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas
    .getContext('2d')!
    .drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size
    );
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.85);
};
