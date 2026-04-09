import type { AppState, Column } from "../types";
import { generateId, getSortedColumns } from "../store";

export function useColumnActions(
  setState: React.Dispatch<React.SetStateAction<AppState>>,
) {
  const addColumn = (title: string) => {
    setState((prev) => {
      const maxOrder = prev.columns.reduce((m, c) => Math.max(m, c.order), -1);
      const newCol: Column = { id: generateId(), title, order: maxOrder + 1 };
      return { ...prev, columns: [...prev.columns, newCol] };
    });
  };

  const deleteColumn = (columnId: string) => {
    setState((prev) => ({
      columns: prev.columns.filter((c) => c.id !== columnId),
      tasks: prev.tasks.filter((t) => t.columnId !== columnId),
    }));
  };

  const renameColumn = (columnId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === columnId ? { ...c, title } : c,
      ),
    }));
  };

  const moveColumn = (dragId: string, hoverId: string) => {
    setState((prev) => {
      const sorted = getSortedColumns(prev.columns);
      const dragIdx = sorted.findIndex((c) => c.id === dragId);
      const hoverIdx = sorted.findIndex((c) => c.id === hoverId);
      if (dragIdx === -1 || hoverIdx === -1) return prev;
      const reordered = [...sorted];
      const [dragged] = reordered.splice(dragIdx, 1);
      reordered.splice(hoverIdx, 0, dragged);
      const updated = reordered.map((c, i) => ({ ...c, order: i }));
      return { ...prev, columns: updated };
    });
  };

  return { addColumn, deleteColumn, renameColumn, moveColumn };
}
