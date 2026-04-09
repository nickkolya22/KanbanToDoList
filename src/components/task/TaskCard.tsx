import type { Task } from '../../types';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { useTaskDrag } from '../../hooks/useTaskDrag';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onToggleSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, text: string) => void;
  searchQuery: string;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className={styles.highlight}>{part}</mark>
    ) : (
      part
    )
  );
}

export function TaskCard({
  task,
  isSelected,
  onToggleSelect,
  onToggleComplete,
  onDelete,
  onEdit,
  searchQuery,
}: TaskCardProps) {
  const { cardRef, dragHandleRef, isDragging } = useTaskDrag(task);
  const edit = useInlineEdit(task.text, (text) => onEdit(task.id, text));

  const cardClass = [
    styles.card,
    task.completed ? styles.done : '',
    isSelected ? styles.selected : '',
    isDragging ? styles.dragging : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={cardRef} className={cardClass}>
      <div className={styles.top}>
        <input
          type="checkbox"
          className={styles.selectBox}
          checked={isSelected}
          onChange={() => onToggleSelect(task.id)}
          title="Select task"
        />
        <div ref={dragHandleRef} className={styles.handle} title="Drag to reorder">
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="9" cy="3" r="1.5" />
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="9" cy="8" r="1.5" />
            <circle cx="3" cy="13" r="1.5" />
            <circle cx="9" cy="13" r="1.5" />
          </svg>
        </div>

        <input
          type="checkbox"
          className={styles.complete}
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        />

        {edit.isEditing ? (
          <input
            ref={edit.inputRef}
            className={styles.editInput}
            value={edit.value}
            onChange={(e) => edit.setValue(e.target.value)}
            onBlur={edit.commit}
            onKeyDown={edit.handleKeyDown}
          />
        ) : (
          <span
            className={styles.text}
            onDoubleClick={edit.startEditing}
            title="Double-click to edit"
          >
            {highlight(task.text, searchQuery)}
          </span>
        )}

        <div className={styles.actions}>
          <button className={styles.btn} onClick={edit.startEditing} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => onDelete(task.id)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
