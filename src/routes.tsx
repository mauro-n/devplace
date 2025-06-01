import {
  createBrowserRouter,
} from "react-router";
import App from "./App";
import PomodoroTimer from "./shared/components/PomodoroTimer";
import MatrixEisen from "./shared/components/MatrixEinsen";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MatrixEisen />
      },
      {
        path: "/pomodoro",
        element: <PomodoroTimer />,
      },
    ]
  },

]);
