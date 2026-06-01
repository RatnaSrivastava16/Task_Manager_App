# TaskFlow - Task Manager Application

TaskFlow is a responsive, full-stack Task Manager application that allows users to register, log in, and manage tasks across three workflow stages: **Todo**, **In Progress**, and **Done**. It features a premium dark-mode UI ], live status counts, HTML5 drag-and-drop, real-time search, and priority categorizations.

---

## Features

* **Secure Authentication**: User registration and login utilizing password hashing with `bcryptjs` and 7-day `JSON Web Tokens (JWT)` stored in `localStorage`.
* **Complete CRUD Capabilities**: Create, view, update, and delete tasks.
* **Responsive Task Board**: Fluid columns mapping tasks by stage ("Todo", "In Progress", "Done").
* **Interactive Drag & Drop**: Move task cards dynamically between stages using HTML5 native dragging.
* **Fast Search**: Instant, client-side searching matching task titles and descriptions.
* **Visual Priorities**: Categorize task importance with Low (Blue), Medium (Yellow), and High (Red) color-coded badges.
* **Loading & Error Feedback**: Animated loaders during database queries and user authentication along with helpful error banners.

---

## Tech Stack

### Frontend
* **React.js (Vite)**
* **React Router DOM**
* **Axios (with Interceptors for Authorization Headers)**
* **React Context API (State Management)**
* **Vanilla CSS (Premium glassmorphism theme)**

### Backend
* **Node.js & Express.js**
* **MongoDB Atlas (via Mongoose ODM)**
* **JWT (Authentication)**
* **Bcrypt.js (Password Hashing)**

---

## Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* A running MongoDB database (local instance or MongoDB Atlas connection string)

### 1. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `server` directory (a template `.env` is already configured):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/task_manager # Replace with your Atlas connection string if needed
   JWT_SECRET=super_secret_key
   ```
4. Start the development server (runs on port 5000):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the client folder in a new terminal:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` to start using the app.

---

## Assumptions & Tradeoffs

### Assumptions
* **Single-User Ownership**: Each task is private and strictly belongs to the user who created it.
* **JWT Expiration**: Tokens expire after 7 days, maintaining active user sessions for convenience.
* **No Database Pre-Seeding**: A clean database is expected; users register new accounts to begin task tracking.

### Tradeoffs
* **localStorage Caching**: We utilize `localStorage` to cache JWT sessions for simplicity. This avoids cookie parsing dependencies but makes the client session susceptible to cross-site scripting (XSS) if third-party scripts are injected.
* **No Refresh Tokens**: To keep the architecture compact and lightweight, we do not implement a refresh token pattern. Users are logged out once the token expires after 7 days.

---

## Future Improvements

* **Task Deadlines**: Add due dates and visual overdue badges.
* **Shared Workspace**: Collaborate on tasks and assign team members.
* **Drag-and-Drop Order**: Reorder task cards inside a single column.
* **Activity Logs**: Display user activity log history (e.g. "Ratna moved task to Done").
* **Dark/Light Mode**: User preference theme toggle.
