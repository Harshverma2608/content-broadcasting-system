# Content Broadcasting System — Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [How to Run](#4-how-to-run)
5. [Architecture Overview](#5-architecture-overview)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Routing](#7-routing)
8. [Pages](#8-pages)
9. [Components](#9-components)
10. [Services](#10-services)
11. [Custom Hooks](#11-custom-hooks)
12. [Utilities & Constants](#12-utilities--constants)
13. [Mock Data](#13-mock-data)
14. [Data Flow Walkthroughs](#14-data-flow-walkthroughs)
15. [Connecting to a Real Backend](#15-connecting-to-a-real-backend)

---

## 1. Project Overview

**Content Broadcasting System (CBS)** is a role-based educational content management and live broadcasting platform. It allows teachers to upload educational content (images), schedule when it should be displayed, and submit it for approval. A principal reviews and approves or rejects submissions. Once approved, content is broadcast live on a public-facing page that auto-rotates through active content.

### User Roles

| Role | What they can do |
|---|---|
| **Teacher** | Upload content, view their own submissions, track approval status |
| **Principal** | Review pending content, approve or reject with a reason, view all content |
| **Public (no login)** | View the live broadcast page for a specific teacher |

---

## 2. Tech Stack

| Category | Library / Tool | Version |
|---|---|---|
| UI Framework | React | ^19.2.5 |
| Build Tool | Vite | ^8.0.10 |
| Routing | React Router DOM | ^7.15.0 |
| Styling | Tailwind CSS | ^4.2.4 |
| Form Handling | React Hook Form | ^7.75.0 |
| Schema Validation | Zod | ^4.4.3 |
| HTTP Client | Axios | ^1.16.0 |
| Toast Notifications | React Hot Toast | ^2.6.0 |
| Icons | Lucide React | ^1.14.0 |

---

## 3. Project Structure

```
content-broadcasting-system/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                        # Root component — router + providers
│   ├── main.jsx                       # React entry point
│   ├── index.css                      # Tailwind CSS import
│   │
│   ├── assets/                        # Static images
│   │
│   ├── components/
│   │   ├── content/                   # Content-specific display components
│   │   │   ├── ContentDetailModal.jsx
│   │   │   ├── ContentPreview.jsx
│   │   │   ├── RejectModal.jsx
│   │   │   ├── ScheduleBadge.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── layout/                    # Page layout wrappers
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── routing/                   # Route guards
│   │   │   └── ProtectedRoute.jsx
│   │   └── ui/                        # Generic reusable UI primitives
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ErrorAlert.jsx
│   │       ├── Modal.jsx
│   │       ├── Pagination.jsx
│   │       ├── SkeletonCard.jsx
│   │       ├── SkeletonRow.jsx
│   │       ├── Spinner.jsx
│   │       └── StatCard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx            # Global auth state
│   │
│   ├── hooks/
│   │   ├── useAsync.js                # Manual async operations
│   │   ├── useFetch.js                # Auto-fetch on mount
│   │   └── usePagination.js           # Client-side pagination
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── LivePage.jsx
│   │   ├── teacher/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── UploadContent.jsx
│   │   │   └── MyContent.jsx
│   │   └── principal/
│   │       ├── PrincipalDashboard.jsx
│   │       ├── PendingApprovals.jsx
│   │       └── AllContent.jsx
│   │
│   ├── services/
│   │   ├── api.js                     # Axios base instance
│   │   ├── auth.service.js            # Login / logout / session
│   │   ├── content.service.js         # Content CRUD + stats
│   │   └── approval.service.js        # Approve / reject actions
│   │
│   └── utils/
│       ├── constants.js               # App-wide constants
│       ├── helpers.js                 # Pure utility functions
│       └── mockData.js                # In-memory mock database
│
├── index.html
├── vite.config.js
├── package.json
└── eslint.config.js
```

---

## 4. How to Run

```bash
# Install dependencies
cd content-broadcasting-system
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Teacher (Alice) | teacher@demo.com | password |
| Teacher (Bob) | teacher2@demo.com | password |
| Principal | principal@demo.com | password |

---

## 5. Architecture Overview

The app follows a layered architecture:

```
Pages / Components
       ↓
  Custom Hooks  (useFetch, useAsync, usePagination)
       ↓
  Service Layer (auth.service, content.service, approval.service)
       ↓
  API Client    (axios instance in api.js)
       ↓
  Backend / Mock Data
```

- **Pages** are responsible for layout and orchestrating data fetching and user actions.
- **Components** are purely presentational or handle isolated UI logic.
- **Hooks** abstract async state management (loading, error, data, refetch).
- **Services** are the only place that talks to the backend (or mock data). Swapping mock for real API only requires changing the service files.
- **AuthContext** provides global user state to the entire tree.

---

## 6. Authentication & Authorization

### AuthContext (`src/context/AuthContext.jsx`)

Wraps the entire app and provides:

| Value | Type | Description |
|---|---|---|
| `user` | object \| null | Currently logged-in user (null if not logged in) |
| `loading` | boolean | True while login request is in flight |
| `login(email, password)` | async function | Calls auth service, sets user state |
| `logout()` | function | Clears localStorage, sets user to null |

On app load, `AuthContext` reads the user from `localStorage` via `authService.getCurrentUser()`, so sessions persist across page refreshes.

### Auth Service (`src/services/auth.service.js`)

- `login(email, password)` — Validates credentials against `MOCK_USERS`. Strips the password field before storing the user object in `localStorage` under `cbs_user`. Stores the token under `cbs_token`.
- `logout()` — Removes both keys from `localStorage`.
- `getCurrentUser()` — Parses and returns the stored user object.
- `getToken()` — Returns the raw token string.
- `isAuthenticated()` — Returns `true` if a token exists.

### ProtectedRoute (`src/components/routing/ProtectedRoute.jsx`)

A route wrapper that enforces two rules:

1. **Authentication check** — If no user is in context, redirects to `/login` and saves the attempted path in `location.state.from` so the user can be sent back after login.
2. **Role check** — If the route requires a specific role (e.g., `role="teacher"`) and the logged-in user has a different role, redirects them to their own dashboard (e.g., `/principal/dashboard`).

```jsx
<ProtectedRoute role="teacher">
  <TeacherDashboard />
</ProtectedRoute>
```

### API Client (`src/services/api.js`)

An Axios instance configured with:
- `baseURL` from `VITE_API_URL` environment variable (falls back to `/api`)
- **Request interceptor** — Reads the token from `localStorage` and attaches it as `Authorization: Bearer {token}` on every outgoing request.
- **Response interceptor** — Normalizes error responses into a consistent `Error` object with a readable message.

---

## 7. Routing

Defined in `App.jsx` using React Router DOM v7.

```
/login                    → LoginPage           (public)
/live/:teacherId          → LivePage            (public)

/teacher/dashboard        → TeacherDashboard    (protected, role: teacher)
/teacher/upload           → UploadContent       (protected, role: teacher)
/teacher/my-content       → MyContent           (protected, role: teacher)

/principal/dashboard      → PrincipalDashboard  (protected, role: principal)
/principal/pending        → PendingApprovals    (protected, role: principal)
/principal/all-content    → AllContent          (protected, role: principal)

/                         → redirect to /login
*                         → redirect to /login
```

`App.jsx` also mounts the global `<Toaster />` from `react-hot-toast` for toast notifications.

---

## 8. Pages

### LoginPage (`src/pages/LoginPage.jsx`)

The entry point for authenticated users.

- Uses `react-hook-form` with a `zod` schema for client-side validation (email format, required fields).
- On successful login, navigates to `/{role}/dashboard`.
- If the user is already logged in (e.g., navigating back to `/login`), a `useEffect` redirects them to their dashboard immediately.
- Shows demo credentials in a card at the bottom for easy testing.

---

### LivePage (`src/pages/LivePage.jsx`)

A public broadcast page accessible at `/live/:teacherId`. No login required.

**Key behaviors:**
- Fetches approved content for the given teacher that falls within the current time window (`startTime <= now <= endTime`).
- **Auto-rotation** — Cycles through content items using `setTimeout`. Each item's `rotationDuration` (in seconds) controls how long it stays on screen.
- **Auto-polling** — Calls the API every 30 seconds (`POLL_INTERVAL`) to pick up newly approved content without a page refresh.
- **Manual refresh** — A refresh button triggers a silent re-fetch (no full loading spinner).
- Displays a thumbnail strip when multiple items are active; clicking a thumbnail jumps to that item.
- Shows a "No content available" state when nothing is active.

---

### TeacherDashboard (`src/pages/teacher/TeacherDashboard.jsx`)

The teacher's home screen.

- Fetches and displays four stat cards: Total Uploaded, Pending, Approved, Rejected.
- Shows the 5 most recent content items with thumbnail, title, subject, date, and status badge.
- "View all" link goes to `/teacher/my-content`.
- "Upload Content" button in the header goes to `/teacher/upload`.

---

### UploadContent (`src/pages/teacher/UploadContent.jsx`)

A multi-section form for submitting new content.

**Sections:**
1. **File Upload** — Drag-and-drop zone or click-to-browse. Validates file type (JPG, PNG, GIF) and size (max 10MB). Shows a preview of the selected image.
2. **Content Details** — Title (required, max 100 chars), Subject (dropdown from `SUBJECTS` constant), Description (optional, max 500 chars).
3. **Scheduling** — Start Time, End Time (datetime-local inputs), Rotation Duration (5–300 seconds, default 30).

**Validation** is handled by a Zod schema passed to `react-hook-form`. A cross-field refinement ensures end time is after start time.

On submit, calls `contentService.uploadContent()`, shows a success toast, and redirects to `/teacher/my-content`.

---

### MyContent (`src/pages/teacher/MyContent.jsx`)

A paginated table of all content uploaded by the logged-in teacher.

- Fetches content filtered by `user.id`.
- Client-side status filter (All / Pending / Approved / Rejected).
- Each row shows: thumbnail preview, title (with rejection reason if rejected), subject, status badge, schedule badge, upload date, and a view button.
- Clicking the view button opens `ContentDetailModal`.
- Pagination handles large lists (15 items per page).

---

### PrincipalDashboard (`src/pages/principal/PrincipalDashboard.jsx`)

The principal's home screen.

- Fetches global stats (total, pending, approved, rejected) and the pending content queue.
- Displays four stat cards.
- Shows the 5 most recent pending items with thumbnail, title, teacher, subject, date, and status badge.
- "View all" link goes to `/principal/pending`.

---

### PendingApprovals (`src/pages/principal/PendingApprovals.jsx`)

A focused queue for reviewing content awaiting approval.

- Fetches only `status === "pending"` content.
- Each row has: thumbnail, title, teacher name, subject, submitted date, and action buttons (View, Approve, Reject).
- **Approve** — Calls `approvalService.approveContent()`, shows success toast, refetches list.
- **Reject** — Opens `RejectModal` to collect a reason, then calls `approvalService.rejectContent()`.
- Per-row loading state prevents double-clicks.
- Pagination at 15 items per page.

---

### AllContent (`src/pages/principal/AllContent.jsx`)

A full content browser with search and filtering.

- Fetches all content regardless of status.
- **Search** — Real-time client-side search across title, subject, and teacher name.
- **Status filter** — Dropdown to filter by All / Pending / Approved / Rejected.
- Both filters reset pagination to page 1 when changed.
- Table columns: thumbnail, title, teacher, subject, status badge, schedule badge, upload date, actions.
- Actions: View (all items), Approve + Reject buttons (pending items only).
- Pagination at 20 items per page.

---

## 9. Components

### Layout

#### DashboardLayout (`src/components/layout/DashboardLayout.jsx`)

Wraps all authenticated pages. Provides:
- A persistent `Sidebar` on desktop (always visible).
- A slide-in sidebar on mobile with a hamburger toggle button in a top bar.
- A semi-transparent overlay that closes the sidebar when clicked on mobile.
- A `<main>` area that renders `{children}`.

#### Sidebar (`src/components/layout/Sidebar.jsx`)

The left navigation panel. Reads `user` from `AuthContext` to:
- Show the correct nav links based on role (teacher links vs. principal links).
- Display the user's name, email, and avatar initial.
- Highlight the active route using React Router's `NavLink`.
- Provide a "Live Page (Demo)" link that opens `/live/u1` in a new tab.
- Provide a Logout button that calls `logout()` from `AuthContext`.

---

### Routing

#### ProtectedRoute (`src/components/routing/ProtectedRoute.jsx`)

See [Authentication & Authorization](#6-authentication--authorization) above.

---

### Content Components

#### ContentDetailModal (`src/components/content/ContentDetailModal.jsx`)

A modal that shows the full details of a content item:
- Full-width image preview
- Title, subject, description
- Teacher name, schedule range, rotation duration
- Status badge + schedule badge
- Rejection reason (shown in a red box if present)

Uses the base `Modal` component with `maxWidth="max-w-2xl"`.

#### ContentPreview (`src/components/content/ContentPreview.jsx`)

A memoized image component that renders a thumbnail. If the image URL is missing or fails to load (`onError`), it shows a fallback placeholder with an `ImageOff` icon. Uses `loading="lazy"` for performance.

#### RejectModal (`src/components/content/RejectModal.jsx`)

A modal with a textarea for entering a rejection reason. Validates that the reason is not empty before calling `onConfirm(reason)`. Clears its state when closed.

#### StatusBadge (`src/components/content/StatusBadge.jsx`)

A memoized badge that maps content status to a color:
- `pending` → yellow
- `approved` → green
- `rejected` → red

#### ScheduleBadge (`src/components/content/ScheduleBadge.jsx`)

A memoized badge that computes the schedule status from `startTime` and `endTime` relative to the current time:
- `scheduled` (start is in the future) → purple
- `active` (now is between start and end) → blue
- `expired` (end is in the past) → gray

---

### UI Primitives

#### Button (`src/components/ui/Button.jsx`)

A flexible button with:
- **Variants**: `primary` (indigo), `danger` (red), `success` (green), `ghost` (gray), `outline` (bordered)
- **Sizes**: `sm`, `md`, `lg`
- **Loading state**: Shows a `Spinner` and disables the button
- Forwards all other props to the underlying `<button>` element

#### Modal (`src/components/ui/Modal.jsx`)

A centered overlay modal with:
- Semi-transparent blurred backdrop
- Click-outside to close
- Escape key to close (via `keydown` event listener)
- Configurable `maxWidth` prop
- Header with title and close button
- Renders `null` when `open` is false (no DOM presence)

#### Badge (`src/components/ui/Badge.jsx`)

A small inline label. Accepts `label` and `className` for custom color styling. Used by `StatusBadge` and `ScheduleBadge`.

#### Pagination (`src/components/ui/Pagination.jsx`)

A page navigation component that:
- Renders nothing if `totalPages <= 1`
- Shows a window of ±2 pages around the current page
- Adds ellipsis and first/last page buttons when the range doesn't include them
- Highlights the current page in indigo

#### StatCard (`src/components/ui/StatCard.jsx`)

A card displaying a metric with an icon, label, and value. Supports a `loading` prop that shows a skeleton placeholder.

#### EmptyState (`src/components/ui/EmptyState.jsx`)

A centered placeholder shown when a list has no items. Accepts `title`, `description`, and an optional `icon` component.

#### ErrorAlert (`src/components/ui/ErrorAlert.jsx`)

Displays an error message in a red alert box. Accepts an optional `onRetry` callback that renders a "Try again" button. Renders nothing if `message` is falsy.

#### Spinner (`src/components/ui/Spinner.jsx`)

An animated circular loading indicator. Accepts a `size` prop (`sm`, `md`, `lg`) and a `className` for custom border colors.

#### SkeletonCard (`src/components/ui/SkeletonCard.jsx`)

An animated gray placeholder shaped like a stat card. Used in dashboards while stats are loading.

#### SkeletonRow (`src/components/ui/SkeletonRow.jsx`)

An animated gray placeholder for a table row. Accepts a `cols` prop to render the correct number of cells. Used in tables while data is loading.

---

## 10. Services

All services simulate network latency with `delay()` and operate on in-memory `MOCK_CONTENT` / `MOCK_USERS` arrays. To connect a real backend, replace the mock logic with `api.js` calls.

### api.js (`src/services/api.js`)

The base Axios instance. All real API calls should use this instead of raw `axios` to get automatic token injection and error normalization.

```js
import api from './api';
const data = await api.get('/content');
```

### auth.service.js (`src/services/auth.service.js`)

| Method | Description |
|---|---|
| `login(email, password)` | Validates credentials, stores token + user in localStorage, returns user object |
| `logout()` | Removes token and user from localStorage |
| `getCurrentUser()` | Returns parsed user from localStorage (used on app init) |
| `getToken()` | Returns raw token string |
| `isAuthenticated()` | Returns boolean |

### content.service.js (`src/services/content.service.js`)

| Method | Description |
|---|---|
| `getAllContent(filters)` | Returns all content, optionally filtered by status and search query |
| `getTeacherContent(teacherId)` | Returns content uploaded by a specific teacher |
| `getContentById(id)` | Returns a single content item or throws if not found |
| `getLiveContent(teacherId)` | Returns approved content within the active time window for a teacher |
| `uploadContent(teacherId, teacherName, formData)` | Creates a new content item with `status: "pending"` and prepends it to the list |
| `getPendingContent()` | Returns all items with `status: "pending"` |
| `getStats()` | Returns `{ total, pending, approved, rejected }` counts |
| `getTeacherStats(teacherId)` | Returns the same counts scoped to a specific teacher |

### approval.service.js (`src/services/approval.service.js`)

| Method | Description |
|---|---|
| `approveContent(contentId)` | Sets `status = "approved"`, clears `rejectionReason` |
| `rejectContent(contentId, reason)` | Sets `status = "rejected"`, stores `rejectionReason` |

---

## 11. Custom Hooks

### useAsync (`src/hooks/useAsync.js`)

For **manually triggered** async operations (form submissions, approve/reject actions).

```js
const { data, loading, error, execute } = useAsync(myAsyncFn);
// Call execute() when the user clicks a button
```

- Manages `{ data, loading, error }` state.
- `execute(...args)` resets state, runs the function, and updates state on completion or error.
- Re-throws errors so callers can catch them for toast notifications.

### useFetch (`src/hooks/useFetch.js`)

For **automatic** data fetching on component mount.

```js
const { data, loading, error, refetch } = useFetch(myAsyncFn);
// Runs automatically on mount; call refetch() to reload
```

- Runs `asyncFn` immediately on mount via `useEffect`.
- `refetch()` re-runs the same function.
- Uses a `ref` to always call the latest version of `asyncFn` without re-triggering the effect.
- The `asyncFn` passed in should be wrapped in `useCallback` to keep it stable.

### usePagination (`src/hooks/usePagination.js`)

Client-side pagination for arrays.

```js
const { paginated, page, totalPages, goTo, next, prev, reset } = usePagination(items, 15);
```

- `paginated` — The slice of items for the current page.
- `goTo(n)` — Navigate to a specific page (clamped to valid range).
- `next()` / `prev()` — Move one page forward or back.
- `reset()` — Jump back to page 1 (call this when filters change).
- Uses `useMemo` so the slice is only recalculated when `items` or `page` changes.

---

## 12. Utilities & Constants

### constants.js (`src/utils/constants.js`)

```js
ROLES            // { TEACHER: 'teacher', PRINCIPAL: 'principal' }
CONTENT_STATUS   // { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
SUBJECTS         // Array of 10 subject strings
ALLOWED_FILE_TYPES  // ['image/jpeg', 'image/png', 'image/gif']
MAX_FILE_SIZE    // 10MB in bytes
TOKEN_KEY        // 'cbs_token' (localStorage key)
USER_KEY         // 'cbs_user'  (localStorage key)
```

### helpers.js (`src/utils/helpers.js`)

| Function | Description |
|---|---|
| `formatDate(dateStr)` | Converts ISO string to locale date/time string. Returns `—` for falsy input. |
| `getStatusColor(status)` | Returns Tailwind CSS classes for a content status badge. |
| `getScheduleStatus(startTime, endTime)` | Returns `"scheduled"`, `"active"`, or `"expired"` based on current time. |
| `getScheduleStatusColor(scheduleStatus)` | Returns Tailwind CSS classes for a schedule status badge. |
| `safeGet(obj, path, fallback)` | Safely reads a nested property path (e.g., `"a.b.c"`) without throwing. |

---

## 13. Mock Data

### mockData.js (`src/utils/mockData.js`)

Acts as the in-memory database for the demo. It is a mutable module-level variable, so changes (approve, reject, upload) persist for the lifetime of the browser session.

**MOCK_USERS** — 3 users: Alice Johnson (teacher), Bob Smith (teacher), Principal Carol (principal).

**MOCK_CONTENT** — 6 hand-crafted items covering all statuses and schedule states, plus 514 auto-generated items (items 7–520) for pagination and performance testing. Each item has:

```
id, teacherId, teacherName, title, subject, description,
fileUrl, fileName, fileType, startTime, endTime,
rotationDuration, status, rejectionReason, createdAt
```

**generateId()** — Returns a unique ID for newly uploaded content.

---

## 14. Data Flow Walkthroughs

### Login Flow

```
User fills form → Zod validation → login(email, password)
  → authService.login() → validates against MOCK_USERS
  → stores token + user in localStorage
  → AuthContext sets user state
  → navigate to /{role}/dashboard
```

### Teacher Upload Flow

```
Teacher fills upload form → Zod validation + file validation
  → contentService.uploadContent(userId, userName, formData)
  → new item created with status: "pending"
  → prepended to MOCK_CONTENT
  → toast success → navigate to /teacher/my-content
```

### Approval Flow

```
Principal opens /principal/pending
  → useFetch → contentService.getPendingContent()
  → table renders pending items

Approve:
  → approvalService.approveContent(id)
  → item.status = "approved"
  → toast success → refetch()

Reject:
  → RejectModal opens
  → principal enters reason → submit
  → approvalService.rejectContent(id, reason)
  → item.status = "rejected", item.rejectionReason = reason
  → toast success → refetch()
```

### Live Broadcast Flow

```
/live/:teacherId loads
  → contentService.getLiveContent(teacherId)
  → filters: teacherId match + status === "approved" + now between startTime and endTime
  → content array rendered

Auto-rotation:
  → setTimeout fires after activeContent.rotationDuration seconds
  → activeIndex increments (wraps around)
  → new content displayed

Auto-polling:
  → setInterval fires every 30 seconds
  → silent re-fetch (no loading spinner)
  → content array updated, activeIndex resets to 0
```

### Search & Filter Flow (AllContent)

```
User types in search box or changes status dropdown
  → setSearch / setStatusFilter updates state
  → reset() resets pagination to page 1
  → useMemo recomputes filtered array
  → usePagination slices filtered array for current page
  → table re-renders
```

---

## 15. Connecting to a Real Backend

The service layer is designed to be swapped out with minimal changes.

**Step 1** — Set the API base URL in `.env`:
```
VITE_API_URL=https://your-api.example.com
```

**Step 2** — Replace mock logic in each service with real `api.js` calls. Example for `content.service.js`:

```js
// Before (mock)
async getAllContent() {
  await delay(600);
  return [...MOCK_CONTENT];
}

// After (real API)
async getAllContent(filters = {}) {
  const { data } = await api.get('/content', { params: filters });
  return data;
}
```

**Step 3** — The auth token is already injected automatically by the request interceptor in `api.js`. No changes needed there.

**Step 4** — Update `authService.login()` to call a real auth endpoint and return a token + user object in the same shape the app expects.

The rest of the app — components, hooks, pages — requires no changes.
