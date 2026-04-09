import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

interface UseColumnDragOptions {
  columnId: string;
  taskCount: number;
  onDropTask: (
    taskId: string,
    targetColumnId: string,
    targetOrder: number,
  ) => void;
  onDropColumn: (dragId: string, hoverId: string) => void;
}

export function useColumnDrag({
  columnId,
  taskCount,
  onDropTask,
  onDropColumn,
}: UseColumnDragOptions) {
  const colRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const el = colRef.current;
    const handle = headerRef.current;
    const dropZone = dropZoneRef.current;
    if (!el || !handle || !dropZone) return;

    return combine(
      draggable({
        element: el,
        dragHandle: handle,
        getInitialData: () => ({ type: "column", columnId }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: dropZone,
        canDrop: ({ source }) => source.data.type === "task",
        onDragEnter: () => setIsDraggingOver(true),
        onDragLeave: () => setIsDraggingOver(false),
        onDrop: ({ source }) => {
          setIsDraggingOver(false);
          if (source.data.type === "task") {
            onDropTask(source.data.taskId as string, columnId, taskCount);
          }
        },
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) =>
          source.data.type === "column" && source.data.columnId !== columnId,
        onDrop: ({ source }) => {
          if (source.data.type === "column") {
            onDropColumn(source.data.columnId as string, columnId);
          }
        },
      }),
    );
  }, [columnId, taskCount, onDropTask, onDropColumn]);

  return { colRef, headerRef, dropZoneRef, isDragging, isDraggingOver };
}
