import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({
  title,
  stage,
  tasks,
  onEdit,
  onDelete,
  onMoveStage,
  onDragDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDragDrop(taskId, stage);
    }
  };

  const getStageClass = () => {
    switch (stage) {
      case 'Todo':
        return 'column-todo';
      case 'In Progress':
        return 'column-in-progress';
      case 'Done':
        return 'column-done';
      default:
        return '';
    }
  };

  return (
    <div
      className={`board-column ${getStageClass()} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-column-message">
            <p>No tasks in this stage</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveStage={onMoveStage}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
