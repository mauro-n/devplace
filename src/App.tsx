import './App.css'
import { Outlet } from 'react-router'
import Sidebar from './shared/components/Sidebar'
import { useReducer, useState } from 'react'
import { TaskContext } from './context/taskContext'
import { taskReducer } from './reducers/taskReducer'

const initialTasks: Task[] = [
  { id: '0', text: 'Philosopher’s Path', completed: true },
  { id: '1', text: 'Visit the temple', completed: false },
  { id: '2', text: 'Drink matcha', completed: false }
];

function App() {
  const [colapsed, setColapsed] = useState(false)
  const [tasks, dispatch] = useReducer(taskReducer, {
    'Work': initialTasks,
    'Personal': []
  });

  return (
    <div className={`h-screen w-full ${colapsed ? 'flex flex-row' : 'grid grid-cols-12'} bg-gray-100`}>
      <div className={`${colapsed ? '' : 'col-span-2'} bg-transparent`}>
        <Sidebar
          currentPage={'matrix'}
          onNavigate={() => { }}
          isCollapsed={colapsed}
          onToggleCollapse={() => { setColapsed(!colapsed) }}
        />
      </div>
      <div className={`${colapsed ? 'w-full' : 'col-span-10'} p-4 overflow-y-auto bg-transparent`}>
        <TaskContext.Provider value={{tasks, dispatch}}>
          <Outlet />
        </TaskContext.Provider>
      </div>
    </div>
  )
}

export default App
