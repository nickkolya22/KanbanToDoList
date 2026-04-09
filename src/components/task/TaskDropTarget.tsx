import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Task } from '../../types';
import styles from './TaskDropTarget.module.css';

interface TaskDropTargetProps {
  task: Task;
  columnId: string;
  onDropTask: (taskId: string, targetColumnId: string, targetOrder: number) => void;
  children: React.ReactNode;
}

export function TaskDropTarget({ task, columnId, onDropTask, children }: TaskDropTargetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === 'task' && source.data.taskId !== task.id,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: ({ source }) => {
        setIsOver(false);
        if (source.data.type === 'task') {
          onDropTask(source.data.taskId as string, columnId, task.order);
        }
      },
    });
  }, [task.id, task.order, columnId, onDropTask]);

  return (
    <div ref={ref} className={`${styles.target}${isOver ? ` ${styles.over}` : ''}`}>
      {children}
    </div>
  );
}
