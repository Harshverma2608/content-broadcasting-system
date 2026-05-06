# Content Broadcasting System

A React.js frontend for an educational content broadcasting platform where teachers upload content, principals approve it, and students view live broadcasts.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **React Router DOM v6**
- **React Hook Form** + **Zod** (form validation)
- **Axios** (HTTP client with interceptors)
- **React Hot Toast** (notifications)
- **Lucide React** (icons)

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## Demo Credentials

| Role      | Email                  | Password |
|-----------|------------------------|----------|
| Teacher   | teacher@demo.com       | password |
| Teacher 2 | teacher2@demo.com      | password |
| Principal | principal@demo.com     | password |

## Pages

| Route                      | Description                        | Auth     |
|----------------------------|------------------------------------|----------|
| `/login`                   | Login page                         | Public   |
| `/teacher/dashboard`       | Teacher stats + recent content     | Teacher  |
| `/teacher/upload`          | Upload new content with scheduling | Teacher  |
| `/teacher/my-content`      | View all uploaded content          | Teacher  |
| `/principal/dashboard`     | Principal stats + pending queue    | Principal|
| `/principal/pending`       | Approve/reject pending content     | Principal|
| `/principal/all-content`   | All content with search + filter   | Principal|
| `/live/:teacherId`         | Public live broadcast page         | Public   |

## Project Structure

```
src/
├── components/
│   ├── content/      # Content-specific components
│   ├── layout/       # Sidebar, DashboardLayout
│   ├── routing/      # ProtectedRoute
│   └── ui/           # Reusable UI primitives
├── context/          # AuthContext
├── hooks/            # useFetch, useAsync, usePagination
├── pages/            # Page components by role
├── services/         # API service layer (auth, content, approval)
└── utils/            # Constants, helpers, mock data
```

## Key Features

- Role-based routing (teacher / principal / public)
- Service layer — all API calls isolated from components
- Skeleton loaders + empty states + error handling
- Drag & drop file upload with preview
- Pagination (handles 500+ items)
- Content approval workflow with rejection modal
- Live broadcast page with auto-polling (30s) and content rotation
- Fully responsive with mobile sidebar

## Connecting a Real Backend

1. Set `VITE_API_URL=https://your-api.com` in `.env`
2. Replace mock logic in `src/services/*.service.js` with real axios calls
3. The `api.js` interceptor already handles auth token attachment
