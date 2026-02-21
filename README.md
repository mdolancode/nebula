# Nebula (Prototype)

Nebula is a full-stack mobile productivity app that helps you manage tasks and decide what to work on next — including a random task selector that picks an incomplete task for you when you're not sure where to start.

Built for anyone who has too many tasks and doesn't know where to begin.

---

## Why Nebula Exists

Most task apps give you a list and leave you staring at it. Nebula adds a randomizer — a small but meaningful feature that removes the decision fatigue of choosing what to tackle next. You add your tasks, and when you're stuck, you let Nebula pick for you.

---

## Core Features

- Add tasks via a slide-up modal
- Swipe left to delete tasks
- Tap a checkbox to mark tasks complete (completed tasks sort to the bottom automatically)
- Random task selector highlights a random incomplete task for 5 seconds
- Input validation prevents empty task submission
- REST API backend with full CRUD support

---

## Tech Stack

### Frontend
- React Native (v0.72)
- TypeScript
- react-native-gesture-handler
- react-native-swipe-list-view
- React Native Checkbox

### Backend
- Node.js
- Express
- TypeScript
- CORS-enabled REST API running on port 3000

### Testing
- Jest (backend API tests and frontend render test)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Toggle task completion |
| DELETE | `/tasks/:id` | Delete a task |

---

## Project Structure

```
nebula/
├── App.tsx              # Main React Native app
├── assets/icons/        # Custom icons (add, random)
├── backend/
│   └── src/
│       ├── app.ts       # Express routes and middleware
│       └── index.ts     # Server entry point
└── __tests__/           # Jest test suite
```

---

## Domain Logic

- Tasks are typed with a `Task` interface (`id`, `title`, `completed`)
- Completed tasks are sorted to the bottom of the list on every render
- The random selector filters to incomplete tasks only — it will not select something already done
- Selected task highlight auto-clears after 5 seconds via a cleanup timer
- All open swipe rows are closed before a delete request is made to prevent UI conflicts

---

## Known Gaps (Intentional)

These are deliberately omitted to keep the prototype focused:

- Persistent storage (tasks are in-memory and reset on server restart)
- Authentication / user accounts
- Push notifications or reminders
- Google Ads integration (planned, not yet implemented)

These would be natural next steps in a production version.

---

## Running Locally

### Backend
```bash
cd backend
npm install
npx ts-node src/index.ts
```

### Frontend
```bash
npm install
npx react-native run-ios
# or
npx react-native run-android
```

---

## Project Status

Core functionality is complete. The backend API is fully wired to the frontend. The random task selector, swipe-to-delete, and checkbox completion flows are all working. Persistent storage and user accounts are the most meaningful next steps toward a production-ready app.
