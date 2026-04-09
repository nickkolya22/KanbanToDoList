import type { Column } from '../../types';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import styles from './ColumnHeader.module.css';

interface ColumnHeaderProps {
  column: Column;
  taskCount: number;
  completedCount: number;
  headerRef: React.RefObject<HTMLDivElement | null>;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function ColumnHeader({ column, taskCount, completedCount, headerRef, onRename, onDelete }: ColumnHeaderProps) {
  const edit = useInlineEdit(column.title, onRename);

  return (
    <div ref={headerRef} className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.dragHandle} title="Drag column">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="2.5" cy="2.5" r="1.5" />
            <circle cx="7.5" cy="2.5" r="1.5" />
            <circle cx="2.5" cy="7" r="1.5" />
            <circle cx="7.5" cy="7" r="1.5" />
            <circle cx="2.5" cy="11.5" r="1.5" />
            <circle cx="7.5" cy="11.5" r="1.5" />
          </svg>
        </div>
        {edit.isEditing ? (
          <input
            ref={edit.inputRef}
            className={styles.titleInput}
            value={edit.value}
            onChange={(e) => edit.setValue(e.target.value)}
            onBlur={edit.commit}
            onKeyDown={edit.handleKeyDown}
          />
        ) : (
          <h3
            className={styles.title}
            onDoubleClick={edit.startEditing}
            title="Double-click to rename"
          >
            {column.title}
          </h3>
        )}
        <span className={styles.count}>{completedCount}/{taskCount}</span>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.btn} onClick={edit.startEditing} title="Rename column">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button className={`${styles.btn} ${styles.btnDelete}`} onClick={onDelete} title="Delete column">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
