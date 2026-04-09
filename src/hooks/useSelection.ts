import { useState } from 'react';
import type { AppState, FilterStatus } from '../types';
import { filterTasks, getTasksForColumn } from '../store';

interface AppActions {
  state: AppState;
  deleteTasks: (ids: string[]) => void;
  setTasksCompleted: (ids: string[], completed: boolean) => void;
  moveTasks: (ids: string[], columnId: string) => void;
  moveTask: (taskId: string, columnId: string, order?: number) => void;
  reorderTask: (taskId: string, columnId: string, order: number) => void;
}

interface Filters {
  filterStatus: FilterStatus;
  searchQuery: string;
}

export function useSelection({ state, deleteTasks, setTasksCompleted, moveTasks, moveTask, reorderTask }: AppActions, filters: Filters) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (taskId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const selectAll = (columnId: string) => {
    const colTasks = filterTasks(
      getTasksForColumn(state.tasks, columnId),
      filters.filterStatus,
      filters.searchQuery,
    );
    const allSelected = colTasks.length > 0 && colTasks.every((t) => selectedIds.has(t.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        colTasks.forEach((t) => next.delete(t.id));
      } else {
        colTasks.forEach((t) => next.add(t.id));
      }
      return next;
    });
  };

  const deleteSelected = () => {
    deleteTasks([...selectedIds]);
    setSelectedIds(new Set());
  };

  const markComplete = () => {
    setTasksCompleted([...selectedIds], true);
    setSelectedIds(new Set());
  };

  const markIncomplete = () => {
    setTasksCompleted([...selectedIds], false);
    setSelectedIds(new Set());
  };

  const moveToColumn = (columnId: string) => {
    moveTasks([...selectedIds], columnId);
    setSelectedIds(new Set());
  };

  const dropTask = (taskId: string, targetColumnId: string, targetOrder: number) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.columnId === targetColumnId) {
      reorderTask(taskId, targetColumnId, targetOrder);
    } else {
      moveTask(taskId, targetColumnId, targetOrder);
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const removeFromSelection = (taskIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      taskIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    deleteSelected,
    markComplete,
    markIncomplete,
    moveToColumn,
    dropTask,
    clearSelection,
    removeFromSelection,
  };
}
