import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState } from 'react'

function TaskModal({ isOpen, task, statuses, onClose, onSave, onDelete }) {
  const portalTarget = useMemo(() => (typeof document !== 'undefined' ? document.body : null), [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  if (!isOpen || !task || !portalTarget) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <TaskModalContent
        key={task.id}
        task={task}
        statuses={statuses}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>,
    portalTarget,
  )
}

function TaskModalContent({ task, statuses, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(() => ({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority ?? 'none',
    tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
  }))

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    onSave(task.id, {
      title: draft.title,
      description: draft.description,
      status: draft.status,
      priority: draft.priority,
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    onClose()
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  return (
    <div
      className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
      >
        Close
      </button>

      <form onSubmit={handleSave} className="space-y-4">
        <header>
          <input
            name="title"
            value={draft.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          {task.createdAt && (
            <p className="mt-1 text-xs text-slate-400">
              Created {new Date(task.createdAt).toLocaleString()}
            </p>
          )}
        </header>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Description
          <textarea
            name="description"
            value={draft.description}
            onChange={handleChange}
            className="min-h-[8rem] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Status
            <select
              name="status"
              value={draft.status}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Priority
            <select
              name="priority"
              value={draft.priority ?? 'none'}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="none">No priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Tags
          <input
            name="tags"
            value={draft.tags}
            onChange={handleChange}
            placeholder="design, qa, release"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <div className="flex flex-col justify-between gap-3 pt-2 md:flex-row">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            Delete task
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskModal

