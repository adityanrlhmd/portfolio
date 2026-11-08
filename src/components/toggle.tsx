import { Button } from '@/components/ui/button';

// one of a few choices, pressed like the mobile Edit/Preview tabs
export const Toggle = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
}) => (
  <div role="group" aria-label={label} className="flex gap-2">
    {(Object.keys(options) as T[]).map(key => (
      <Button
        key={key}
        type="button"
        variant={value === key ? 'secondary' : 'ghost'}
        aria-pressed={value === key}
        onClick={() => onChange(key)}
      >
        {options[key]}
      </Button>
    ))}
  </div>
);
