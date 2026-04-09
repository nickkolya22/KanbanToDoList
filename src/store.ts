import type { AppState, Column, FilterStatus, Task } from "./types";

const STORAGE_KEY = "todo-state";

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const defaultState: AppState = {
  columns: [
    { id: "col-1", title: "To Do", order: 0 },
    { id: "col-2", title: "In Progress", order: 1 },
    { id: "col-3", title: "Done", order: 2 },
  ],
  tasks: [
    {
      id: "task-1",
      text: "Test task",
      completed: true,
      columnId: "col-3",
      order: 2,
    },
  ],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getTasksForColumn(tasks: Task[], columnId: string): Task[] {
  return tasks
    .filter((t) => t.columnId === columnId)
    .sort((a, b) => a.order - b.order);
}

export function getSortedColumns(columns: Column[]): Column[] {
  return [...columns].sort((a, b) => a.order - b.order);
}

export function filterTasks(tasks: Task[], status: FilterStatus, query: string): Task[] {
  return tasks.filter((t) => {
    if (status === 'completed' && !t.completed) return false;
    if (status === 'incomplete' && t.completed) return false;
    if (query.trim()) return t.text.toLowerCase().includes(query.toLowerCase());
    return true;
  });
}
