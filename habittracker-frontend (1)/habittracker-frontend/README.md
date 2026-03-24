# StreakForge — Habit Tracker Frontend

A polished React + Vite frontend for the Spring Boot habit tracker backend.

## Project Structure

```
habittracker-frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx     # Streak banner + progress ring
│   │   ├── HabitForm.jsx     # Add new habit form
│   │   ├── HabitList.jsx     # List of today's habits with check-off
│   │   ├── History.jsx       # Grouped timeline of past activity
│   │   ├── Navbar.jsx        # Top nav with Habits / Tasks / History tabs
│   │   ├── TaskForm.jsx      # Create task form
│   │   ├── TaskList.jsx      # Task list with due dates & overdue alerts
│   │   └── UserForm.jsx      # Editable user profile form
│   ├── pages/
│   │   └── LoginPage.jsx     # Login page with status bar below
│   ├── services/
│   │   ├── notifications.js  # Hourly reminder system
│   │   └── storage.js        # localStorage persistence + backend API stubs
│   ├── App.jsx               # Root component — state + routing
│   ├── App.css               # Global design tokens + shared styles
│   ├── index.css             # Reset styles
│   └── main.jsx              # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## Connecting to Spring Boot Backend

Open `src/services/storage.js` and uncomment the `fetch()` calls inside each API function:

```js
export async function apiSaveHabit(habit) {
  return fetch('http://localhost:8080/api/habits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  });
}
```

Make sure your Spring Boot server runs on `http://localhost:8080` and has CORS enabled for `http://localhost:5173`.

## Features

- 🔐 Login page with username, email, password validation
- 📊 Status bar below login showing live stats & streaks
- 🎯 Habit tracking with Daily / Weekly / Monthly frequency
- 🔥 Streak counter per habit + global streak banner
- 📈 Daily progress ring (% habits done today)
- ✅ Task creation with title, description, due date
- 🚨 Overdue task highlighting
- ⏰ Hourly notifications for pending habits & overdue tasks
- 📜 History timeline grouped by date
- 💾 All data persisted in localStorage
