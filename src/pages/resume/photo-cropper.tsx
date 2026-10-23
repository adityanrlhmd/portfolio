import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { type Crop, cropFor } from '@/lib/resume/photo';

const FRAME = 240;
const STEP = 10;

// Drag (or arrow keys) to move the photo inside the square, the slider to zoom.
export const PhotoCropper = ({
  src,
  onDone,
  onCancel,
  onError,
}: {
  src: string;
  onDone: (crop: Crop) => void;
  onCancel: () => void;
  onError: () => void;
}) => {
  const [image, setImage] = useState<{ width: number; height: number }>();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ px: number; py: number; x: number; y: number }>(null);

  const fit = image && cropFor(image, FRAME, zoom, offset);
  const move = (x: number, y: number) => fit && setOffset({ x, y });

  return (
    <div className="space-y-3">
      <div
        tabIndex={0}
        role="img"
        aria-label="Photo crop area. Drag or use the arrow keys to move the photo."
        className="bg-muted focus-visible:ring-ring/30 relative cursor-grab touch-none overflow-hidden rounded-md outline-none select-none focus-visible:ring-2 active:cursor-grabbing"
        style={{ width: FRAME, height: FRAME }}
        onPointerDown={e => {
          if (!fit) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { px: e.clientX, py: e.clientY, ...fit.offset };
        }}
        onPointerMove={e => {
          const d = drag.current;
          if (d) move(d.x + e.clientX - d.px, d.y + e.clientY - d.py);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={e => {
          if (!fit) return;
          const { x, y } = fit.offset;
          const delta = (
            {
              ArrowLeft: [-STEP, 0],
              ArrowRight: [STEP, 0],
              ArrowUp: [0, -STEP],
              ArrowDown: [0, STEP],
            } as Record<string, [number, number]>
          )[e.key];
          if (!delta) return;
          e.preventDefault();
          move(x + delta[0], y + delta[1]);
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          onLoad={e =>
            setImage({
              width: e.currentTarget.naturalWidth,
              height: e.currentTarget.naturalHeight,
            })
          }
          onError={onError}
          className="absolute max-w-none"
          style={
            fit
              ? {
                  width: image.width * fit.scale,
                  height: image.height * fit.scale,
                  left: (FRAME - image.width * fit.scale) / 2 + fit.offset.x,
                  top: (FRAME - image.height * fit.scale) / 2 + fit.offset.y,
                }
              : { visibility: 'hidden' }
          }
        />
      </div>
      <label
        className="flex items-center gap-3 text-sm"
        style={{ width: FRAME }}
      >
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="accent-primary flex-1"
        />
      </label>
      <div className="flex gap-2">
        <Button
          type="button"
          disabled={!fit}
          onClick={() => fit && onDone(fit.crop)}
        >
          Use photo
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
