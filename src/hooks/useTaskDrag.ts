import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Task } from '../types';

export function useTaskDrag(task: Task) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef(task);
  const [isDragging, setIsDragging] = useState(false);

  taskRef.current = task;

  useEffect(() => {
    const el = cardRef.current;
    const handle = dragHandleRef.current;
    if (!el || !handle) return;

    return draggable({
      element: el,
      dragHandle: handle,
      getInitialData: () => ({
        type: 'task',
        taskId: taskRef.current.id,
        columnId: taskRef.current.columnId,
        order: taskRef.current.order,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [task.id]);

  return { cardRef, dragHandleRef, isDragging };
}
