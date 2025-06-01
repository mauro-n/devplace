import { useContext } from "react";
import { createContext } from "react";

export const TaskContext = createContext<any>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};


