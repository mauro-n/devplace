import {
  createBrowserRouter,
} from "react-router";
import App from "./App";
import PomodoroTimer from "./shared/components/PomodoroTimer";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/pomodoro",
    element: <PomodoroTimer />,
  },
]);
