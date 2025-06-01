import { Edit3, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PomodoroClock = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [initialTime, setInitialTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editMinutes, setEditMinutes] = useState(25)
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    // Always clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Session completed
            setIsActive(false);
            setIsPaused(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    // Cleanup function - this is crucial for preventing memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused]); // Removed initialTime from dependencies as it's not needed

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

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 col-span-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h2 className="font-medium text-gray-900">Focus</h2>
        </div>
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

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {(!isActive && !isPaused && !isEditing) && (
              <button
                onClick={handleEditTime}
                className="bg-white border border-gray-200 hover:bg-gray-50 rounded-full p-1.5 shadow-sm mb-1"
                title="Edit time"
              >
                <Edit3 size={12} className="text-gray-500" />
              </button>
            )}
            <div className="text-center">
              {isEditing ? (
                <div className="flex flex-col items-center space-y-3 -mt-4">
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
                    {timeLeft === 0 ? 'Time\'s up!' : isActive && !isPaused ? 'Focusing...' : 'Ready to focus'}
                  </div>
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
  )
}

export default PomodoroClock