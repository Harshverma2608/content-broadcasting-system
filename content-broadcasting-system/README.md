# Content Broadcasting System

A frontend project I built for managing and broadcasting educational content in schools. Teachers upload content, the principal reviews and approves it, and once approved it shows up on a live broadcast page that auto-rotates through active slides.

The whole thing runs on mock data right now so you can try it out without setting up a backend. Swapping in a real API is just a matter of updating the service files.

---

## What it does

- Teachers log in and upload image-based content with a title, subject, description, and a scheduled time window
- The principal sees a queue of pending submissions and can approve or reject each one (with a reason if rejecting)
- Approved content that falls within its scheduled time window shows up on the public live page at `/live/:teacherId`
- The live page auto-rotates through active content and polls for new content every 30 seconds

---

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- React Hook Form + Zod for form validation
- Axios for HTTP (with auth interceptors ready to go)
- React Hot Toast for notifications
- Lucide React for icons

---

## Getting started

You need Node.js 18+ installed. That's it.

```bash
# clone the repo and go into the project folder
git clone <your-repo-url>
cd content-broadcasting-system

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

```bash
npm run build      # production build → output goes to /dist
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

---

## Logging in

The app uses mock credentials. Just pick one of these on the login page — you can click the demo account cards to auto-fill the form.

| Name | Role | Email | Password |
|---|---|---|---|
| Khushi Sharma | Teacher | teacher@demo.com | password |
| Ayush Verma | Teacher | teacher2@demo.com | password |
| Harsh Patel | Principal | principal@demo.com | password |

---

## Pages

| Route | Who can access | What it does |
|---|---|---|
| `/login` | Everyone | Login page |
| `/teacher/dashboard` | Teacher | Stats overview + recent uploads |
| `/teacher/upload` | Teacher | Upload new content with scheduling |
| `/teacher/my-content` | Teacher | All their uploads with status + filters |
| `/principal/dashboard` | Principal | Stats + pending approvals queue |
| `/principal/pending` | Principal | Approve or reject pending content |
| `/principal/all-content` | Principal | Full content list with search and filters |
| `/live/:teacherId` | Everyone | Public live broadcast page |

For the live page demo, try `/live/u1` (Khushi's content) or `/live/u2` (Ayush's content).

---

## Project structure

```
src/
├── components/
│   ├── content/        ContentPreview, StatusBadge, ScheduleBadge,
│   │                   ContentDetailModal, RejectModal
│   ├── layout/         DashboardLayout, Sidebar
│   ├── routing/        ProtectedRoute
│   └── ui/             Button, Modal, Badge, StatCard, Pagination,
│                       Spinner, EmptyState, ErrorAlert, SkeletonCard, SkeletonRow
├── context/
│   └── AuthContext.jsx global auth state (user, login, logout)
├── hooks/
│   ├── useAsync.js     for manual async ops (form submits, actions)
│   ├── useFetch.js     auto-fetches on mount, returns data/loading/error/refetch
│   └── usePagination.js client-side pagination with memoized slicing
├── pages/
│   ├── LoginPage.jsx
│   ├── LivePage.jsx
│   ├── teacher/        TeacherDashboard, UploadContent, MyContent
│   └── principal/      PrincipalDashboard, PendingApprovals, AllContent
├── services/
│   ├── api.js          axios instance — base URL + auth interceptor
│   ├── auth.service.js login, logout, getCurrentUser
│   ├── content.service.js  all content CRUD + stats
│   └── approval.service.js approve and reject actions
└── utils/
    ├── constants.js    roles, statuses, subjects, file limits, localStorage keys
    ├── helpers.js      formatDate, status colors, schedule status logic
    └── mockData.js     in-memory mock database (520+ items for perf testing)
```

---

## How the auth works

Login validates against the mock users in `mockData.js`. On success, the token and user object get stored in `localStorage`. `AuthContext` reads that on load so sessions survive a page refresh.

`ProtectedRoute` checks two things — is the user logged in, and do they have the right role for the route. Wrong role redirects to their own dashboard instead of showing an error.

The axios instance in `api.js` has a request interceptor that attaches the Bearer token automatically, so service functions don't have to think about headers.

---

## Connecting a real backend

The service layer is the only thing that needs to change. Everything else — components, hooks, pages — stays the same.

1. Create a `.env` file in the project root:

```
VITE_API_URL=https://your-api.example.com
```

2. Replace the mock logic in each service file with real axios calls. For example in `content.service.js`:

```js
// before
async getAllContent() {
  await delay(600);
  return [...MOCK_CONTENT];
}

// after
async getAllContent(filters = {}) {
  const { data } = await api.get('/content', { params: filters });
  return data;
}
```

3. Update `auth.service.js` to call your real auth endpoint and return a token + user object in the same shape.

The auth token injection is already handled by the interceptor in `api.js` — no changes needed there.

---

## Notes

- Mock data has 520+ items so pagination and performance are testable without a backend
- The live page polls every 30 seconds — change `POLL_INTERVAL` at the top of `LivePage.jsx` if needed
- Token is stored in localStorage which is fine for a demo; httpOnly cookies would be better in production
- File uploads in mock mode use blob URLs for preview — they don't survive a page refresh, which is expected
