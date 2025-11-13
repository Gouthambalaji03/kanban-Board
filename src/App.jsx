import { TaskProvider } from './context/TaskContext.jsx'
import TaskBoard from './components/TaskBoard.jsx'

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-100">
        <TaskBoard />
      </div>
    </TaskProvider>
  )
}

export default App