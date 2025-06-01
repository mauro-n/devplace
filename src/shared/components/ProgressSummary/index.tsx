import { CheckCircle2, Clock, Target } from "lucide-react";
import { useTaskContext } from "../../../context/taskContext";
import { useEffect, useRef, useState } from "react";

const ProgressSummary = () => {
  const { tasks: taskGroups } = useTaskContext();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<any>(null);
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

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 col-span-1 h-112 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h2 className="font-medium text-gray-900">Progress</h2>
        </div>
      </div>
      <div className="px-4 py-2 space-y-2 flex-1">
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
  );
}

export default ProgressSummary;