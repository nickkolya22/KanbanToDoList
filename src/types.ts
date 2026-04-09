export interface Task {
  id: string;
  text: string;
  completed: boolean;
  columnId: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface AppState {
  columns: Column[];
  tasks: Task[];
}

export type FilterStatus = 'all' | 'completed' | 'incomplete';