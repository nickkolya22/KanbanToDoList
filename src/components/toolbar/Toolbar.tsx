import type { FilterStatus } from "../../types";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (s: FilterStatus) => void;
  onAddColumn: () => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onAddColumn,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.brand}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>KanbanToDoList</span>
      </div>

      <div className={styles.search}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.searchClear}
            onClick={() => onSearchChange("")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {(["all", "incomplete", "completed"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            className={`${styles.filter}${filterStatus === f ? ` ${styles.filterActive}` : ""}`}
            onClick={() => onFilterChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <button className={styles.addCol} onClick={onAddColumn}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add Column</span>
      </button>
    </div>
  );
}
