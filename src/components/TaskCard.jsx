import { forwardRef } from 'react'

const priorityStyles = {
  none: 'bg-slate-100 text-slate-600',
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
}

const TaskCard = forwardRef(function TaskCard(
  { task, isDragging, onClick, onDelete, dragHandleProps, draggableProps, style: draggableStyle },
  ref,
) {
  const priorityStyle = priorityStyles[task.priority ?? 'none']

  return (
    <article
      ref={ref}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      style={{
        ...draggableStyle,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : draggableStyle?.zIndex,
      }}
      className={[
        'group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition',
        isDragging ? 'ring-2 ring-sky-400' : 'hover:border-sky-300 hover:shadow-md',
      ].join(' ')}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800">{task.title}</h3>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          className="rounded-md border border-transparent px-2 py-1 text-xs font-medium text-slate-500 transition hover:border-rose-500 hover:text-rose-600"
        >
          Delete
        </button>
      </header>

      {task.description && <p className="mt-2 text-sm text-slate-600">{task.description}</p>}

      <footer className="mt-3 flex flex-wrap items-center gap-2">
        {task.priority && task.priority !== 'none' && (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityStyle}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
        {Array.isArray(task.tags) &&
          task.tags
            .filter(Boolean)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
      </footer>
    </article>
  )
})

export default TaskCard

