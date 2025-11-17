import { useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { useTasks } from '../context/TaskContext.jsx'
import TaskForm from './TaskForm.jsx'
import TaskCard from './TaskCard.jsx'
import TaskModal from './TaskModal.jsx'

function TaskBoard() {
  const { columns, statuses, addTask, updateTask, deleteTask, moveTask, getTask } = useTasks()
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const selectedTask = useMemo(
    () => (selectedTaskId ? getTask(selectedTaskId) : null),
    [selectedTaskId, getTask],
  )

  const handleTaskCreate = (values) => {
    addTask(values)
  }

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id)
    setIsModalOpen(true)
  }

  const handleTaskDelete = (taskId) => {
    deleteTask(taskId)
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null)
      setIsModalOpen(false)
    }
  }

  const handleTaskSave = (taskId, updates) => {
    updateTask(taskId, updates)
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    moveTask({
      sourceStatus: source.droppableId,
      destinationStatus: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-sky-500 via-sky-600 to-indigo-600 px-6 py-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide text-sky-100/90">Kanban Board</p>
        <h1 className="text-3xl font-bold">Stay on top of every task</h1>
        <p className="max-w-2xl text-sm text-sky-100">
          Create tasks, assign priorities, and drag them between stages to keep your work moving
          forward. Everything stays saved locally, so you can pick up right where you left off.
        </p>
      </header>
      
      <TaskForm statuses={statuses} onSubmit={handleTaskCreate} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {statuses.map((status) => (
            <Droppable droppableId={status.id} key={status.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={[
                    'flex h-full min-h-[18rem] flex-col rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition',
                    snapshot.isDraggingOver ? 'ring-2 ring-sky-300' : 'hover:border-sky-200',
                  ].join(' ')}
                >
                  <header className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">{status.label}</h2>
                      <p className="text-xs text-slate-500">
                        {(columns[status.id] ?? []).length} tasks
                      </p>
                    </div>
                  </header>

                  <div className="mt-4 grid gap-3">
                    {(columns[status.id] ?? []).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => {
                          const { style: draggableStyle, ...draggableProps } =
                            dragProvided.draggableProps
                          return (
                            <TaskCard
                              ref={dragProvided.innerRef}
                              task={task}
                              isDragging={dragSnapshot.isDragging}
                              draggableProps={draggableProps}
                              dragHandleProps={dragProvided.dragHandleProps}
                              style={draggableStyle}
                              onClick={() => handleTaskClick(task)}
                              onDelete={() => handleTaskDelete(task.id)}
                            />
                          )
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        statuses={statuses}
        onClose={() => setIsModalOpen(false)}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    </div>
  )
}

export default TaskBoard

