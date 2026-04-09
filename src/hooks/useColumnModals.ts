import { useState } from 'react';
import type { AppState } from '../types';

interface DeleteTarget {
  id: string;
  title: string;
  taskCount: number;
}

interface AppActions {
  state: AppState;
  addColumn: (title: string) => void;
  deleteColumn: (id: string) => void;
}

export function useColumnModals(
  { state, addColumn, deleteColumn }: AppActions,
  removeFromSelection: (taskIds: string[]) => void,
) {
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const openAddColumn = () => setAddColumnOpen(true);

  const closeAddColumn = () => {
    setAddColumnOpen(false);
    setNewColumnTitle('');
  };

  const confirmAddColumn = () => {
    if (newColumnTitle.trim()) addColumn(newColumnTitle.trim());
    closeAddColumn();
  };

  const openDeleteColumn = (columnId: string) => {
    const col = state.columns.find((c) => c.id === columnId)!;
    const taskCount = state.tasks.filter((t) => t.columnId === columnId).length;
    setDeleteTarget({ id: columnId, title: col.title, taskCount });
  };

  const closeDeleteColumn = () => setDeleteTarget(null);

  const confirmDeleteColumn = () => {
    if (!deleteTarget) return;
    const taskIds = state.tasks
      .filter((t) => t.columnId === deleteTarget.id)
      .map((t) => t.id);
    deleteColumn(deleteTarget.id);
    removeFromSelection(taskIds);
    setDeleteTarget(null);
  };

  return {
    addColumnOpen,
    newColumnTitle,
    setNewColumnTitle,
    openAddColumn,
    closeAddColumn,
    confirmAddColumn,
    deleteTarget,
    openDeleteColumn,
    closeDeleteColumn,
    confirmDeleteColumn,
  };
}
