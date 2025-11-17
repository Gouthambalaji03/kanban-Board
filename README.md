# Kanban Board

Stay on top of every task with a lightweight drag-and-drop workflow board. This project mirrors the in-app hero copy in `TaskBoard.jsx` by helping you “Stay on top of every task.”

## Features

- Columns for `To Do`, `In Progress`, and `Done`
- Create, edit, and delete tasks with descriptions, priority, and tags
- Drag-and-drop powered by `@hello-pangea/dnd`
- Task modal for inline updates
- Local persistence through `localStorage`

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Context API with hooks
- `@hello-pangea/dnd` for reordering

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL (default `http://localhost:5173`) to use the board.

### Useful scripts

```bash
npm run build   # Production build
npm run preview # Preview the production bundle
npm run lint    # ESLint checks
```

## Usage

1. Add a task with the form; pick its starting status and priority.
2. Drag cards between columns to update progress.
3. Click a card to open the modal, then edit or delete it.
4. Data persists per browser via `localStorage`.

## Structure

```
src/
  components/   Task board UI, forms, modal, cards
  context/      Task context + persistence helpers
  App.jsx       Application shell
  main.jsx      Vite entry point
```

## Contribution

Pull requests are welcome. Run `npm run lint` before submitting to keep things consistent.
