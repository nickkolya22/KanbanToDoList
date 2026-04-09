import type { Column } from '../../types';
import { Dropdown } from '../ui/Dropdown';
import styles from './BulkActionBar.module.css';

interface BulkActionBarProps {
  selectedCount: number;
  columns: Column[];
  onDeleteSelected: () => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onMoveToColumn: (columnId: string) => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  columns,
  onDeleteSelected,
  onMarkComplete,
  onMarkIncomplete,
  onMoveToColumn,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.info}>
        <span className={styles.count}>{selectedCount} selected</span>
        <button className={styles.clear} onClick={onClearSelection} title="Clear selection">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnComplete}`} onClick={onMarkComplete}>
          Mark complete
        </button>
        <button className={`${styles.btn} ${styles.btnIncomplete}`} onClick={onMarkIncomplete}>
          Mark incomplete
        </button>
        <Dropdown
          label="Move to..."
          options={columns.map((col) => ({ value: col.id, label: col.title }))}
          onSelect={onMoveToColumn}
          triggerClassName={`${styles.btn} ${styles.btnMove}`}
        />
        <button className={`${styles.btn} ${styles.btnDelete}`} onClick={onDeleteSelected}>
          Delete
        </button>
      </div>
    </div>
  );
}
