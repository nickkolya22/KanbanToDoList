import type { AppState, Task } from "../types";
import { generateId } from "../store";

export function useTaskActions(
  setState: React.Dispatch<React.SetStateAction<AppState>>,
) {
  const addTask = (columnId: string, text: string) => {
    setState((prev) => {
      const colTasks = prev.tasks.filter((t) => t.columnId === columnId);
      const maxOrder = colTasks.reduce((m, t) => Math.max(m, t.order), -1);
      const newTask: Task = {
        id: generateId(),
        text,
        completed: false,
        columnId,
        order: maxOrder + 1,
      };
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
  };

  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const deleteTasks = (taskIds: string[]) => {
    const idSet = new Set(taskIds);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !idSet.has(t.id)),
    }));
  };

  const toggleTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    }));
  };

  const setTasksCompleted = (taskIds: string[], completed: boolean) => {
    const idSet = new Set(taskIds);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        idSet.has(t.id) ? { ...t, completed } : t,
      ),
    }));
  };

  const editTask = (taskId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, text } : t)),
    }));
  };

  const moveTask = (taskId: string, targetColumnId: string, targetOrder?: number) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const colTasks = prev.tasks
        .filter((t) => t.columnId === targetColumnId && t.id !== taskId)
        .sort((a, b) => a.order - b.order);

      const order = targetOrder ?? colTasks.length;

      const reordered = [...colTasks];
      reordered.splice(order, 0, { ...task, columnId: targetColumnId });
      const updatedColTasks = reordered.map((t, i) => ({ ...t, order: i }));

      const otherTasks = prev.tasks.filter(
        (t) => t.id !== taskId && t.columnId !== targetColumnId,
      );
      return { ...prev, tasks: [...otherTasks, ...updatedColTasks] };
    });
  };

  const moveTasks = (taskIds: string[], targetColumnId: string) => {
    const idSet = new Set(taskIds);
    setState((prev) => {
      const colTasks = prev.tasks
        .filter((t) => t.columnId === targetColumnId && !idSet.has(t.id))
        .sort((a, b) => a.order - b.order);
      const movingTasks = prev.tasks.filter((t) => idSet.has(t.id));
      const combined = [...colTasks, ...movingTasks].map((t, i) => ({
        ...t,
        columnId: targetColumnId,
        order: i,
      }));
      const otherTasks = prev.tasks.filter(
        (t) => !idSet.has(t.id) && t.columnId !== targetColumnId,
      );
      return { ...prev, tasks: [...otherTasks, ...combined] };
    });
  };

  const reorderTask = (taskId: string, columnId: string, newOrder: number) => {
    setState((prev) => {
      const colTasks = prev.tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order);
      const oldIdx = colTasks.findIndex((t) => t.id === taskId);
      if (oldIdx === -1) return prev;
      const reordered = [...colTasks];
      const [moved] = reordered.splice(oldIdx, 1);
      reordered.splice(newOrder, 0, moved);
      const updated = reordered.map((t, i) => ({ ...t, order: i }));
      const otherTasks = prev.tasks.filter((t) => t.columnId !== columnId);
      return { ...prev, tasks: [...otherTasks, ...updated] };
    });
  };

  return {
    addTask,
    deleteTask,
    deleteTasks,
    toggleTask,
    setTasksCompleted,
    editTask,
    moveTask,
    moveTasks,
    reorderTask,
  };
}
