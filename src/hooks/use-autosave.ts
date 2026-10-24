import {
  type FieldValues,
  type UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

// Saves the form 200ms after typing stops and returns those settled values (for the
// preview), warning once if the browser won't store them.
export const useAutosave = <T extends FieldValues>(
  form: UseFormReturn<T>,
  save: (values: T) => boolean
) => {
  const values = useWatch({ control: form.control }) as T;
  const [debounced, setDebounced] = useState(values);
  const warned = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(values), 200);
    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    if (save(debounced) || warned.current) return;
    warned.current = true;
    toast.error("Couldn't save your progress in this browser.");
  }, [debounced, save]);

  // the debounced save can miss the last keystrokes when the visitor leaves right away
  useEffect(() => {
    const flush = () => save(form.getValues());
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [form, save]);

  return debounced;
};
