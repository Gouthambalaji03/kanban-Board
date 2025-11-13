import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

const STORAGE_KEY = 'kanban.tasks'

const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

const emptyState = STATUSES.reduce((acc, status) => {
  acc[status.id] = []
  return acc
}, {})

const TaskContext = createContext(null)

const loadInitialState = () => {
  if (typeof window === 'undefined') return emptyState
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return emptyState
    const parsed = JSON.parse(stored)
    return STATUSES.every(({ id }) => Array.isArray(parsed?.[id])) ? parsed : emptyState
  } catch (error) {
    console.error('Failed to parse stored tasks', error)
    return emptyState
  }
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE': {
      return action.payload
    }
    case 'ADD_TASK': {
      const { task } = action.payload
      return {
        ...state,
        [task.status]: [task, ...(state[task.status] ?? [])],
      }
    }
    case 'UPDATE_TASK': {
      const { id, updates } = action.payload
      let targetStatus = null
      let currentTask = null

      for (const status of STATUSES) {
        const found = state[status.id]?.find((task) => task.id === id)
        if (found) {
          currentTask = found
          targetStatus = updates.status ?? status.id
          break
        }
      }

      if (!currentTask) return state

      const updatedTask = { ...currentTask, ...updates, status: targetStatus }
      const nextState = { ...state }

      for (const status of STATUSES) {
        nextState[status.id] = nextState[status.id].filter((task) => task.id !== id)
      }

      const insertionIndex = action.payload.insertionIndex ?? 0
      const destination = [...(nextState[targetStatus] ?? [])]
      destination.splice(insertionIndex, 0, updatedTask)
      nextState[targetStatus] = destination

      return nextState
    }
    case 'DELETE_TASK': {
      const { id } = action.payload
      const nextState = { ...state }
      for (const status of STATUSES) {
        nextState[status.id] = nextState[status.id].filter((task) => task.id !== id)
      }
      return nextState
    }
    case 'MOVE_TASK': {
      const { sourceStatus, destinationStatus, sourceIndex, destinationIndex } = action.payload
      if (!state[sourceStatus]) return state

      const nextState = { ...state }
      const sourceTasks = [...nextState[sourceStatus]]
      const [moved] = sourceTasks.splice(sourceIndex, 1)
      if (!moved) return state

      const destinationTasks =
        sourceStatus === destinationStatus ? sourceTasks : [...(nextState[destinationStatus] ?? [])]

      const updatedTask = { ...moved, status: destinationStatus }
      destinationTasks.splice(destinationIndex, 0, updatedTask)

      nextState[sourceStatus] = sourceTasks
      nextState[destinationStatus] = destinationTasks

      return nextState
    }
    default:
      return state
  }
}

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function TaskProvider({ children }) {
  const [columns, dispatch] = useReducer(taskReducer, emptyState, loadInitialState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(columns))
  }, [columns])

  const addTask = useCallback((values) => {
    const task = {
      id: createId(),
      title: values.title?.trim() ?? '',
      description: values.description?.trim() ?? '',
      status: values.status,
      priority: values.priority ?? 'none',
      tags: values.tags ?? [],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TASK', payload: { task } })
    return task
  }, [])

  const updateTask = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
  }, [])

  const deleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } })
  }, [])

  const moveTask = useCallback((details) => {
    dispatch({ type: 'MOVE_TASK', payload: details })
  }, [])

  const getTask = useCallback(
    (id) => {
      for (const status of STATUSES) {
        const found = columns[status.id]?.find((task) => task.id === id)
        if (found) return found
      }
      return null
    },
    [columns],
  )

  const value = useMemo(
    () => ({
      columns,
      statuses: STATUSES,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      getTask,
    }),
    [columns, addTask, updateTask, deleteTask, moveTask, getTask],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within a TaskProvider')
  return context
}
