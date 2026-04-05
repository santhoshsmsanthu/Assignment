# Finance Dashboard UI Assignment

A clean and interactive frontend dashboard for tracking financial activity. This project is built with React + TypeScript and uses static/mock data with local state persistence.

## Tech Stack

- React + TypeScript (Vite)
- Recharts for visualizations
- Context + useReducer for state management
- Custom CSS (responsive, animated, role-aware UI)

## Features Implemented

### 1. Dashboard Overview

- Summary cards: Total Balance, Income, Expenses
- Time-based visualization: running balance trend area chart
- Categorical visualization: spending breakdown pie chart

### 2. Transactions Section

- Transaction list with:
  - Date
  - Description
  - Amount
  - Category
  - Type (income/expense)
- Features:
  - Search by description/category
  - Filter by category, type, month
  - Sort by date or amount

### 3. Basic Role-Based UI (Frontend Simulation)

- Role switcher (Viewer/Admin)
- Viewer:
  - Read-only access
- Admin:
  - Can add transactions
  - Can edit existing transactions

### 4. Insights Section

- Highest spending category
- Month-over-month expense comparison
- Savings rate observation

### 5. State Management

Global app state managed via Context + `useReducer`:

- Transactions data
- Filters
- Selected role

State persists in `localStorage`.

### 6. UI/UX and Responsiveness

- Responsive layout for desktop/mobile
- Non-generic visual style with custom theme tokens and expressive typography
- Empty-state handling for filtered/no-data results

## Project Structure

```text
finance-dashboard/
  src/
    components/
    data/
    state/
    App.tsx
    main.tsx
    styles.css
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Notes for Evaluators

- This solution focuses on frontend architecture, readability, and interaction design.
- It intentionally uses mock data (no backend dependency), as requested.
- The implementation is modular and can be extended with API integration or advanced analytics later.
