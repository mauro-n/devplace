type TaskActionType = 'ADD_TASK' | 'REMOVE_TASK' | 'UPDATE_TASK' | 'TOGGLE_TASK' | 'SET_ACTIVE_TAB' | 'ADD_TAB' | 'REMOVE_TAB';

type TaskActions = {
  type: TaskActionType
  payload: TaskActionPayload
}

interface TaskActionPayload extends Partial<Task> {
  activeTab?: string;
}

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type TaskGroup = {
  [key: string]: Task[];
};