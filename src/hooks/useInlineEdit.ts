import { useEffect, useRef, useState } from 'react';

export function useInlineEdit(initialValue: string, onCommit: (value: string) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing() {
    setValue(initialValue);
    setIsEditing(true);
  }

  function commit() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialValue) onCommit(trimmed);
    setValue(initialValue);
    setIsEditing(false);
  }

  function cancel() {
    setValue(initialValue);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  }

  return { isEditing, value, setValue, inputRef, startEditing, commit, cancel, handleKeyDown };
}
