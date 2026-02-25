# BinBot Frontend

The frontend is a React-based web application that provides the user interface for the BinBot waste management system.

## Overview

The frontend allows users to classify waste items, track their disposal history, and view analytics about their environmental impact. It communicates with the backend REST API to handle user data and waste records.

## Features

- User registration and login
- Waste classification tool
- Dashboard with summary statistics
- History of disposed items
- Analytics with charts and insights
- Profile management
- Responsive design

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | / | Landing page with app information |
| Login | /login | User sign in page |
| Register | /register | New user registration |
| Dashboard | /dashboard | Main screen with waste summary |
| Classify | /classify | Enter items to find correct bin |
| History | /history | View past disposed items |
| Analytics | /analytics | Charts and statistics |
| Profile | /profile | User account settings |

## Project Structure

```
frontend/
├── src/
│   ├── api/                # API calling functions
│   │   ├── auth/          # Authentication API calls
│   │   ├── dashboard/     # Dashboard API calls
│   │   └── waste/          # Waste management API calls
│   ├── assets/            # Static assets
│   ├── components/        # Reusable components
│   │   └── Navigation.jsx
│   ├── helper/            # Layout components
│   │   ├── Layout.jsx     # Main layout with navbar
│   │   └── PublicLayout.jsx
│   ├── pages/             # Page components
│   │   ├── Analytics.jsx
│   │   ├── Classify.jsx
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   ├── validation/        # Form validation
│   │   ├── auth/
│   │   └── waste/
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios (implied by api folder structure)
- **Styling**: CSS with Tailwind-like classes (custom)
- **Icons**: Lucide React
- **Forms**: React Hook Form (implied)
- **Notifications**: React Toastify

## Installation

```
bash
cd frontend
npm install
```

## Running the Application

```
bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server typically runs on `http://localhost:5173`.

## API Integration

The frontend communicates with the backend at `http://localhost:5000`. API calls are organized in the `src/api` folder:

- `src/api/auth/index.js` - Login, register, get user
- `src/api/waste/index.js` - Create waste record, get history
- `src/api/dashboard/index.js` - Get summary, get analytics

## Authentication

The frontend uses JWT tokens for authentication. After login, the token is stored and included in API request headers for protected routes.

## Key Components

### Navigation
The Navigation component provides the top navigation bar with links to all main sections of the app. It is visible only on protected pages.

### Layouts
- **PublicLayout**: Used for Home, Login, Register pages (no navbar)
- **Layout**: Used for protected pages (includes navbar)

## Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `lucide-react` - Icons
- `react-toastify` - Notifications
- `eslint` - Code linting
- `vite` - Build tool

## Environment Variables

The frontend communicates with the backend API. Ensure the backend is running before starting the frontend.
