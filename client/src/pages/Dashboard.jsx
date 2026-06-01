import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError(API.getErrorMessage(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // CRUD: Create or Update Task
  const handleTaskSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        // Update task
        const res = await API.put(`/tasks/${selectedTask._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTask._id ? res.data : t))
        );
      } else {
        // Create task
        const res = await API.post('/tasks', taskData);
        setTasks((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
      setSelectedTask(null);
    } catch (err) {
      throw new Error(API.getErrorMessage(err) || 'Task Action Failed');
    }
  };

  // CRUD: Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Optimistic UI updates
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await API.delete(`/tasks/${taskId}`);
    } catch (err) {
      setError(API.getErrorMessage(err) || 'Task Deletion Failed');
      setTasks(previousTasks); // Rollback
    }
  };

  // CRUD: Move / Drag-Drop Task
  const handleMoveStage = async (taskId, newStage) => {
    // Optimistic UI updates
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, stage: newStage } : t))
    );

    try {
      await API.put(`/tasks/${taskId}`, { stage: newStage });
    } catch (err) {
      setError(API.getErrorMessage(err) || 'Failed to move task');
      setTasks(previousTasks); // Rollback
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  // Search Filter
  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();
    const titleMatch = task.title?.toLowerCase().includes(search);
    const descMatch = task.description?.toLowerCase().includes(search);
    return titleMatch || descMatch;
  });

  // Group tasks by stages
  const getTasksByStage = (stage) => {
    return filteredTasks.filter((task) => task.stage === stage);
  };

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="search-bar-container">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks by title or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="btn-create-task"
            id="create-task-button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span>Add Task</span>
          </button>
        </header>

        {error && (
          <div className="error-banner" style={{ marginBottom: '30px' }}>
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <Loader message="Loading your task board..." />
        ) : (
          <div className="board-grid">
            <TaskColumn
              title="To Do"
              stage="Todo"
              tasks={getTasksByStage('Todo')}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onMoveStage={handleMoveStage}
              onDragDrop={handleMoveStage}
            />
            <TaskColumn
              title="In Progress"
              stage="In Progress"
              tasks={getTasksByStage('In Progress')}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onMoveStage={handleMoveStage}
              onDragDrop={handleMoveStage}
            />
            <TaskColumn
              title="Done"
              stage="Done"
              tasks={getTasksByStage('Done')}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onMoveStage={handleMoveStage}
              onDragDrop={handleMoveStage}
            />
          </div>
        )}

        {showModal && (
          <TaskForm
            task={selectedTask}
            onSubmit={handleTaskSubmit}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </>
  );
};

export default Dashboard;
