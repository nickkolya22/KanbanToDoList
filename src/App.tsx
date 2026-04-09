import styles from './App.module.css';
import modalStyles from './App.modal.module.css';
import { useAppState } from './hooks/useAppState';
import { useFilters } from './hooks/useFilters';
import { useSelection } from './hooks/useSelection';
import { useColumnModals } from './hooks/useColumnModals';
import { getSortedColumns, getTasksForColumn } from './store';
import { BulkActionBar } from './components/toolbar/BulkActionBar';
import { Column } from './components/board/Column';
import { Toolbar } from './components/toolbar/Toolbar';
import { Modal } from './components/ui/Modal';

export default function App() {
  const appState = useAppState();
  const filters = useFilters();
  const selection = useSelection(appState, filters);
  const columnModals = useColumnModals(appState, selection.removeFromSelection);

  const sortedColumns = getSortedColumns(appState.state.columns);

  return (
    <div className={styles.app}>
      <Toolbar
        searchQuery={filters.searchQuery}
        onSearchChange={filters.setSearchQuery}
        filterStatus={filters.filterStatus}
        onFilterChange={filters.setFilterStatus}
        onAddColumn={columnModals.openAddColumn}
      />

      <BulkActionBar
        selectedCount={selection.selectedIds.size}
        columns={sortedColumns}
        onDeleteSelected={selection.deleteSelected}
        onMarkComplete={selection.markComplete}
        onMarkIncomplete={selection.markIncomplete}
        onMoveToColumn={selection.moveToColumn}
        onClearSelection={selection.clearSelection}
      />

      <main className={styles.board}>
        <div className={styles.boardColumns}>
          {sortedColumns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={getTasksForColumn(appState.state.tasks, col.id)}
              selectedIds={selection.selectedIds}
              filterStatus={filters.filterStatus}
              searchQuery={filters.searchQuery}
              onToggleSelect={selection.toggleSelect}
              onSelectAll={selection.selectAll}
              onToggleComplete={appState.toggleTask}
              onDeleteTask={appState.deleteTask}
              onEditTask={appState.editTask}
              onAddTask={appState.addTask}
              onDeleteColumn={columnModals.openDeleteColumn}
              onRenameColumn={appState.renameColumn}
              onDropTask={selection.dropTask}
              onDropColumn={appState.moveColumn}
            />
          ))}
        </div>
      </main>

      <Modal
        isOpen={columnModals.addColumnOpen}
        onClose={columnModals.closeAddColumn}
        title="Add Column"
      >
        <form
          className={modalStyles.form}
          onSubmit={(e) => { e.preventDefault(); columnModals.confirmAddColumn(); }}
        >
          <input
            className={modalStyles.input}
            placeholder="Column name"
            value={columnModals.newColumnTitle}
            onChange={(e) => columnModals.setNewColumnTitle(e.target.value)}
            autoFocus
          />
          <div className={modalStyles.actions}>
            <button type="button" className={modalStyles.btnCancel} onClick={columnModals.closeAddColumn}>
              Cancel
            </button>
            <button type="submit" className={modalStyles.btnConfirm} disabled={!columnModals.newColumnTitle.trim()}>
              Add
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!columnModals.deleteTarget}
        onClose={columnModals.closeDeleteColumn}
        title="Delete Column"
      >
        <div className={modalStyles.form}>
          <p className={modalStyles.confirmText}>
            Delete column <strong>"{columnModals.deleteTarget?.title}"</strong>
            {columnModals.deleteTarget?.taskCount
              ? ` and its ${columnModals.deleteTarget.taskCount} task(s)`
              : ''}?
          </p>
          <div className={modalStyles.actions}>
            <button type="button" className={modalStyles.btnCancel} onClick={columnModals.closeDeleteColumn}>
              Cancel
            </button>
            <button type="button" className={modalStyles.btnDanger} onClick={columnModals.confirmDeleteColumn}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
