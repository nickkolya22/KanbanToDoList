import type { Column as ColumnType, FilterStatus, Task } from '../../types';
import { filterTasks } from '../../store';
import { useColumnDrag } from '../../hooks/useColumnDrag';
import { ColumnHeader } from './ColumnHeader';
import { AddTaskForm } from '../task/AddTaskForm';
import { TaskDropTarget } from '../task/TaskDropTarget';
import { TaskCard } from '../task/TaskCard';
import styles from './Column.module.css';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  selectedIds: Set<string>;
  filterStatus: FilterStatus;
  searchQuery: string;
  onToggleSelect: (taskId: string) => void;
  onSelectAll: (columnId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, text: string) => void;
  onAddTask: (columnId: string, text: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDropTask: (taskId: string, targetColumnId: string, targetOrder: number) => void;
  onDropColumn: (dragId: string, hoverId: string) => void;
}

export function Column({
  column,
  tasks,
  selectedIds,
  filterStatus,
  searchQuery,
  onToggleSelect,
  onSelectAll,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onAddTask,
  onDeleteColumn,
  onRenameColumn,
  onDropTask,
  onDropColumn,
}: ColumnProps) {
  const filteredTasks = filterTasks(tasks, filterStatus, searchQuery);

  const { colRef, headerRef, dropZoneRef, isDragging, isDraggingOver } = useColumnDrag({
    columnId: column.id,
    taskCount: filteredTasks.length,
    onDropTask,
    onDropColumn,
  });

  const allVisibleSelected = filteredTasks.length > 0 && filteredTasks.every((t) => selectedIds.has(t.id));
  const completedCount = tasks.filter((t) => t.completed).length;

  const columnClass = [
    styles.column,
    isDragging ? styles.dragging : '',
    isDraggingOver ? styles.dragOver : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={colRef} className={columnClass}>
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        completedCount={completedCount}
        headerRef={headerRef}
        onRename={(title) => onRenameColumn(column.id, title)}
        onDelete={() => onDeleteColumn(column.id)}
      />

      <div className={styles.selectAllRow}>
        <label className={styles.selectAll}>
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={() => onSelectAll(column.id)}
            disabled={filteredTasks.length === 0}
          />
          <span>Select all</span>
        </label>
      </div>

      <div ref={dropZoneRef} className={styles.tasks}>
        {filteredTasks.map((task) => (
          <TaskDropTarget key={task.id} task={task} columnId={column.id} onDropTask={onDropTask}>
            <TaskCard
              task={task}
              isSelected={selectedIds.has(task.id)}
              onToggleSelect={onToggleSelect}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              searchQuery={searchQuery}
            />
          </TaskDropTarget>
        ))}
        {filteredTasks.length === 0 && (
          <div className={styles.empty}>
            {searchQuery ? 'No matching tasks' : 'No tasks yet'}
          </div>
        )}
      </div>

      <AddTaskForm onAdd={(text) => onAddTask(column.id, text)} />
    </div>
  );
}
