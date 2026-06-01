import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onMoveStage }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getNextStages = () => {
    switch (task.stage) {
      case 'Todo':
        return [{ label: 'Work On', stage: 'In Progress' }];
      case 'In Progress':
        return [
          { label: 'Backlog', stage: 'Todo' },
          { label: 'Complete', stage: 'Done' }
        ];
      case 'Done':
        return [{ label: 'Reopen', stage: 'In Progress' }];
      default:
        return [];
    }
  };

  return (
    <div
      className={`task-card priority-${task.priority.toLowerCase()}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        <span className={`task-priority-badge badge-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      <p className="task-card-desc">
        {task.description || <i>No description provided</i>}
      </p>

      <div className="task-card-actions">
        <div className="card-control-buttons">
          <button
            onClick={() => onEdit(task)}
            className="btn-card-icon edit"
            title="Edit Task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="btn-card-icon delete"
            title="Delete Task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>

        <div className="move-stage-actions">
          {getNextStages().map((opt) => (
            <button
              key={opt.stage}
              onClick={() => onMoveStage(task._id, opt.stage)}
              className="btn-move"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
