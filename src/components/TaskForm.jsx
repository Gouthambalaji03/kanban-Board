import { useState } from 'react'

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'none',
  tags: '',
}

const priorityOptions = [
  { id: 'none', label: 'No priority' },
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

function TaskForm({ statuses, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    onSubmit(payload)
    setForm((current) => ({ ...emptyForm, status: current.status }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur"
    >
      <h2 className="text-lg font-semibold text-slate-800">Create a new task</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Draft product brief"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add more details to keep everyone aligned..."
            className="h-24 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Status
          <select
            name="status"
            value={form.status}
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

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {priorityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Tags
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Press enter or use commas to add multiple tags"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <span className="text-xs font-normal text-slate-400">
            Separate tags with commas. Example: design, release, qa
          </span>
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          Add Task
        </button>
      </div>
    </form>
  )
}

export default TaskForm

