export function taskReducer(state: TaskGroup, action: TaskActions): TaskGroup {
  const activeTab = action.payload.activeTab || 'Tasks';

  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        [activeTab]: [
          ...state[activeTab],
          {
            id: Date.now(),
            text: action.payload.text || '',
            completed: false
          }]
      } as TaskGroup
    }
    case 'REMOVE_TASK': {
      const updatedGroup = state[activeTab].filter((task: Task) => task.id !== action.payload.id);
      return {
        ...state,
        [activeTab]: updatedGroup
      }
    }
    // case 'UPDATE_TASK':
    //   return state.map(task =>
    //     task.id === action.payload.id ? { ...task, ...action.payload } : task
    //   );
    case 'TOGGLE_TASK': {
      const updatedGroup = state[activeTab].map((todo: any) => todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo)
      return {
        ...state,
        [activeTab]: updatedGroup
      }
    }
    case 'ADD_TAB': {
      return {
        ...state,
        [activeTab]: []
      };
    }
    default:
      return state;
  }
}

function parseTaskGroup(taskGroup: Task[]) {
  if (!taskGroup || !Array.isArray(taskGroup)) {
    return [];
  } else {
    return taskGroup
  }
}