import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Edit3, Plus, Trash2, Check, Circle, Clock, Target, CheckCircle2 } from 'lucide-react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(25);
  const [taskGroups, setTaskGroups] = useState<any>({
    'Work': [],
    'Personal': []
  });
  const [activeTab, setActiveTab] = useState('Work');
  const [newTodo, setNewTodo] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const intervalRef = useRef<any>(null);

  // Progress tracking state
  const [totalFocusedTime, setTotalFocusedTime] = useState(0); // in seconds
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Session completed - add to total focused time and increment sessions
            const sessionDuration = initialTime;
            setTotalFocusedTime(prev => prev + sessionDuration);
            setCompletedSessions(prev => prev + 1);
            setIsActive(false);
            setIsPaused(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, initialTime]);

  // Track completed tasks
  useEffect(() => {
    const allTodos = Object.values(taskGroups).flat() as any[];
    const completedCount = allTodos.filter((todo: any) => todo.completed).length;
    setTotalCompletedTasks(completedCount);
  }, [taskGroups]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(initialTime);
  };

  const handleEditTime = () => {
    if (!isActive && !isPaused) {
      setIsEditing(true);
      setEditMinutes(Math.floor(initialTime / 60));
    }
  };

  const handleSaveTime = () => {
    const newTime = Math.max(1, Math.min(60, editMinutes)) * 60; // Clamp between 1-60 minutes
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditMinutes(Math.floor(initialTime / 60));
  };

  const addNewTab = () => {
    if (!newTabName.trim()) return;
    setTaskGroups((prev: any) => {
      return {
        ...prev,
        [newTabName.trim()]: []
      };
    })
    setIsAddingTab(false);
    setNewTabName('');
  }

  const deleteTab = (name: string) => { }

  const handleTabKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      addNewTab();
    } else if (e.key === 'Escape') {
      setIsAddingTab(false);
      setNewTabName('');
    }
  };

  const addTodo = () => {
    if (!newTodo.trim()) return
    if (taskGroups[activeTab]) {
      setTaskGroups((prev: any) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false
        }]
      }));
    }

    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTaskGroups((prev: any) => {
      const updatedGroup = prev[activeTab].map((todo: any) => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
      return {
        ...prev,
        [activeTab]: updatedGroup
      }
    })
  };

  const deleteTodo = (id: number) => {
    setTaskGroups((prev: any) => {
      const updatedGroup = prev[activeTab].filter((todo: any) => todo.id !== id);
      return {
        ...prev,
        [activeTab]: updatedGroup
      };
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const currentTodos = taskGroups[activeTab] || [];
  const allTodos = Object.values(taskGroups).flat();

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto space-y-4 flex flex-row gap-4 items-start">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-112 w-80">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-gray-900 mb-1">Focus</h1>
            <p className="text-sm text-gray-500">1 of 2</p>
          </div>

          {/* Timer Circle */}
          <div className="relative mb-6">
            <div className="w-48 h-48 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={283}
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {isEditing ? (
                    <div className="flex flex-col items-center space-y-3">
                      <input
                        type="number"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(parseInt(e.target.value) || 1)}
                        className="text-3xl font-light text-gray-900 bg-transparent border-b border-gray-300 text-center w-16 focus:outline-none focus:border-blue-500"
                        min="1"
                        max="60"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveTime}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-light text-gray-900 mb-1">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        {timeLeft === 0 ? 'Time\'s up!' : isActive && !isPaused ? 'Stop music' : 'Ready to focus'}
                      </div>
                      {!isActive && !isPaused && (
                        <button
                          onClick={handleEditTime}
                          className="absolute -top-2 -right-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full p-1.5 shadow-sm"
                          title="Edit time"
                        >
                          <Edit3 size={12} className="text-gray-500" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isActive && !isPaused ? 'bg-blue-500' :
                isPaused ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              <span className="text-xs text-gray-600">
                Upcoming: 5 min break
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-3">
            {!isActive || isPaused ? (
              <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm"
              >
                <Play size={16} />
                <span>{isPaused ? 'Resume' : 'Start'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm"
              >
                <Pause size={16} />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm border border-gray-200"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>


        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-112 flex flex-col w-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h2 className="font-medium text-gray-900">Tasks</h2>
            </div>
            <span className="text-xs text-gray-500">{(allTodos as any[]).filter((t: any) => !t.completed).length} remaining</span>
          </div>



          {/* Add Task Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Circle size={20} className="text-gray-300 flex-shrink-0" />
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Select a task for your session"
                className="flex-1 bg-transparent text-sm placeholder-gray-400 text-gray-900 focus:outline-none"
              />
              {newTodo.trim() && (
                <button
                  onClick={addTodo}
                  className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="max-h-64 overflow-y-auto grow-1">
            {taskGroups[activeTab].length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <Circle size={24} className="mx-auto" />
                </div>
                <p className="text-sm text-gray-500">No tasks yet. Add one above!</p>
              </div>
            ) : (
              taskGroups[activeTab].map((todo: any, index: number) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors duration-150 ${index !== taskGroups[activeTab].length - 1 ? 'border-b border-gray-50' : ''
                    } group`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${todo.completed
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                      }`}
                  >
                    {todo.completed && <Check size={12} />}
                  </button>

                  <span
                    className={`flex-1 text-sm transition-all duration-200 ${todo.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900'
                      }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 p-2 border-b border-gray-100 overflow-x-auto min-h-16">
            {Object.keys(taskGroups).map((tabName) => (
              <div key={tabName} className="relative group">
                <button
                  onClick={() => setActiveTab(tabName)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-200 whitespace-nowrap ${activeTab === tabName
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {tabName}
                  {taskGroups[tabName].filter((t: any) => !t.completed).length > 0 && (
                    <span className="ml-1 bg-gray-400 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                      {taskGroups[tabName].filter((t: any) => !t.completed).length}
                    </span>
                  )}
                </button>
                {Object.keys(taskGroups).length > 1 && (
                  <button
                    onClick={() => deleteTab(tabName)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Add Tab Button */}
            {isAddingTab ? (
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  onKeyDown={handleTabKeyPress}
                  onBlur={() => {
                    if (!newTabName.trim()) {
                      setIsAddingTab(false);
                    }
                  }}
                  placeholder="Tab name"
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-20"
                  autoFocus
                />
                <button
                  onClick={addNewTab}
                  className="text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTab(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                title="Add new tab"
              >
                <Plus size={12} />
              </button>
            )}
          </div>

          {/* Task Stats */}
          {currentTodos.length > 0 && (
            <div className="p-4 bg-gray-50 text-xs text-gray-500 flex justify-between border-t border-gray-100">
              <span>{currentTodos.length} total</span>
              <span>{currentTodos.filter((t: any) => t.completed).length} completed</span>
            </div>
          )}

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-80 h-112 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h2 className="font-medium text-gray-900">Progress</h2>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="px-4 py-2 space-y-2 flex-1">
            {/* Total Focused Time */}
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">
                  {formatDuration(totalFocusedTime)}
                </div>
                <div className="text-xs text-gray-500">Total focused time</div>
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">
                  {completedSessions}
                </div>
                <div className="text-xs text-gray-500">Sessions completed</div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">
                  {totalCompletedTasks}
                </div>
                <div className="text-xs text-gray-500">Tasks completed</div>
              </div>
            </div>

            {/* Current Session Progress */}
            {(isActive || isPaused) && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Session</span>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {formatTime(initialTime - timeLeft)} / {formatTime(initialTime)}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Today's Goal</div>
                <div className="text-xs text-gray-400">
                  {completedSessions >= 4 ? '🎉 Goal achieved!' : `${4 - completedSessions} more sessions to go`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}