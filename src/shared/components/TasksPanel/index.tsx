import { Check, Circle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTaskContext } from "../../../context/taskContext";

const TasksPanel = () => {
  const { tasks: taskGroups, dispatch: dispatchTaskGroups } = useTaskContext();
  const [activeTab, setActiveTab] = useState('Work');
  const [newTodo, setNewTodo] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  const addNewTab = () => {
    if (!newTabName.trim()) return;
    const trimmedTabName = newTabName.trim();
    dispatchTaskGroups({
      type: 'ADD_TAB',
      payload: { activeTab: trimmedTabName },
    });
    setActiveTab(trimmedTabName);
    setIsAddingTab(false);
    setNewTabName('');
  };

  const deleteTab = (name: string) => { };

  const handleTabKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      addNewTab();
    } else if (e.key === 'Escape') {
      setIsAddingTab(false);
      setNewTabName('');
    }
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    dispatchTaskGroups({
      type: 'ADD_TASK',
      payload: { text: newTodo.trim(), activeTab: activeTab },
    });
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    dispatchTaskGroups({
      type: 'TOGGLE_TASK',
      payload: { id, activeTab: activeTab },
    });
  };

  const deleteTodo = (id: number) => {
    dispatchTaskGroups({
      type: 'REMOVE_TASK',
      payload: { id, activeTab: activeTab },
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const currentTodos = taskGroups[activeTab] || [];
  const allTodos = Object.values(taskGroups).flat();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-112 flex flex-col col-span-1">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h2 className="font-medium text-gray-900">Tasks</h2>
        </div>
        <span className="text-xs text-gray-500">{(allTodos as any[]).filter((t: any) => !t.completed).length} remaining</span>
      </div>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Plus size={20} className="text-gray-300 flex-shrink-0" />
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new task"
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
      {currentTodos.length > 0 && (
        <div className="p-4 bg-gray-50 text-xs text-gray-500 flex justify-between border-t border-gray-100">
          <span>{currentTodos.length} total</span>
          <span>{currentTodos.filter((t: any) => t.completed).length} completed</span>
        </div>
      )}
    </div>
  );
};

export default TasksPanel;