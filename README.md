# FlowCRM

## Running the project

This is a static web project. There is no build step and no dependencies to install.

### Option 1: Open directly in a browser
1. Open `FlowCRM/index.html` in a browser (Chrome, Firefox, Edge, etc.)

### Option 2: Use a local server (recommended)
Run a local server with Python or Node.js:

**Python:**
```bash
cd FlowCRM
python -m http.server 8000
```
Then open http://localhost:8000

**Node.js (npx):**
```bash
cd FlowCRM
npx serve
```

**VS Code:**
Install the "Live Server" extension, right-click `index.html` → "Open with Live Server"

## Folder structure

```
FlowCRM/
├── index.html        # Dashboard
├── pipeline.html    # Deal pipeline (Kanban board)
├── customers.html   # Customer management
├── tasks.html      # Tasks
├── calendar.html   # Appointments calendar
├── messages.html   # Messages
└── assets/
    ├── css/
    │   ├── design-system.css  # Design system (CSS variables)
    │   └── styles.css         # Custom styles
    └── js/
        └── app.js            # JavaScript
```

## Features

- **Dashboard**: KPIs, pipeline chart, today's tasks, recent activity
- **Pipeline**: Kanban board with drag and drop, create new deals
- **Customers**: Customer table with add, edit, delete and search
- **Tasks**: Tasks grouped by due date, with filters and task creation
- **Calendar**: Calendar view and a list of upcoming appointments
- **Messages**: Chat interface for sending new messages
