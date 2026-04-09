import { useEffect, useRef, useState } from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  triggerClassName?: string;
}

export function Dropdown({ label, options, onSelect, triggerClassName }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={styles.dropdown}>
      <button className={triggerClassName} onClick={() => setOpen((o) => !o)}>
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                className={styles.item}
                onClick={() => { onSelect(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
