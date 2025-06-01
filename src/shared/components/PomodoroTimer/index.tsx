import TasksPanel from '../TasksPanel';
import ProgressSummary from '../ProgressSummary';
import PomodoroClock from '../PomodoroClock';

export default function PomodoroTimer() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-x-4">
      <PomodoroClock />
      <TasksPanel />
      <ProgressSummary />
    </section>
  );
}