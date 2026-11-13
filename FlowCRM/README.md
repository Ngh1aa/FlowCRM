# FlowCRM – Sales and Customer Management System

## Overview

FlowCRM is a CRM dashboard and sales management system designed to help sales teams manage leads, customers, deals, tasks, appointments, messages and reports. The project focuses on turning a fragmented sales process into clear requirements, structured user flows and an easy-to-use management interface.

### Key goals

- Provide a clear KPI dashboard so the sales team can track performance in real time
- Manage leads and customers in one place, easy to update and look up
- Visualize the sales pipeline on a Kanban board
- Sort tasks by priority so important work gets done first
- Manage appointments and messages to improve communication with customers
- Consolidate reports to support data-driven business decisions

### Main modules

| Module | Description |
|--------|--------|
| **KPI Dashboard** | Track the key sales performance metrics |
| **Kanban Pipeline** | Visualize deals by sales stage |
| **Customers** | Manage customer details and history |
| **Tasks** | Manage work by priority |
| **Calendar** | Customer and internal appointments |
| **Messages** | Communicate with customers inside the system |
| **Reports** | Summary reports and analysis |

### Business problems addressed

- No overall view of the sales pipeline
- Hard to track progress on leads and deals
- Fragmented communication between team members
- Hard to tell important tasks from unimportant ones
- No data reports to evaluate performance

---

## Installation

### Requirements

- A modern browser (Chrome, Firefox, Edge, Safari)
- VS Code (optional, for Live Server)

### Setup steps

**1. Clone the repository**

```bash
git clone https://github.com/username/FlowCRM.git
```

**2. Go to the project folder**

```bash
cd FlowCRM/FlowCRM
```

**3. Open the project**

Option 1 – Open directly in a browser:
```bash
# Open index.html in the FlowCRM folder
```

Option 2 – Use Live Server in VS Code:
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html`
3. Choose **"Open with Live Server"**

---

## Usage

### Explore the features

1. **KPI Dashboard** – Open the home page for an overview of sales metrics
2. **Leads & Customers** – View and update customer details in Customers
3. **Kanban Sales Pipeline** – Drag deals between sales stages in Pipeline
4. **Tasks by priority** – View and sort work by priority in Tasks
5. **Appointments** – Review and manage appointments in Calendar
6. **Messages** – Communicate with customers in Messages
7. **Reports** – View summary reports in Reports

### Logging in

The workspace opens signed in as An Nguyen (Sales manager). After logging out, use **Continue as An Nguyen**, sign in with `an.nguyen@flowcrm.vn` / `flowcrm2026`, or sign up for a new account:
- Log in page: `login.html`
- Sign up page: `register.html`
- Workspace tools (Reset demo data): add `?demo=1` to any page URL; `?demo=0` hides them

---

## Project structure

```
FlowCRM/
├── index.html          # KPI Dashboard
├── login.html          # Log in page
├── register.html       # Sign up page
├── pipeline.html       # Kanban Sales Pipeline
├── customers.html      # Customer management
├── tasks.html          # Task management
├── calendar.html       # Appointments
├── messages.html       # Messages
├── reports.html        # Reports
├── settings.html       # Settings
└── assets/
    ├── css/
    │   ├── styles.css        # Main styles
    │   ├── design-system.css # Design system
    │   └── auth.css          # Log in / sign up styles
    └── js/
        ├── app.js            # Application logic
        └── auth.js           # Authentication logic
```

---

## Tech stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **No framework dependencies** – easy to extend and integrate

## Design tools

- **Figma** – UI design and prototyping

---

## Portfolio

This project is suited to a portfolio for:

- **Business Analyst** – Business analysis, user flow and wireframe design
- **UI/UX Designer** – UI design, design system and Figma prototypes
- **Front-end Developer** – Building web interfaces with plain HTML, CSS and JavaScript

---

## Author

- **Role**: Business Analyst & UI/UX Designer
- **GitHub**: [username](https://github.com/username)
