import { useState } from 'react';
import styles from './AddTaskForm.module.css';

interface AddTaskFormProps {
  onAdd: (text: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed);
      setText('');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Add a task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={styles.btn} disabled={!text.trim()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </form>
  );
}
