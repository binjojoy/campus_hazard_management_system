# Campus Hazard Management System — Quick Start

## Backend Setup

1. Navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with:

```
PORT=5001
FRONTEND_ORIGIN=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Start the backend:

```bash
npm run dev
```

- Backend runs at `http://localhost:5001`

---

## Frontend Setup

1. Navigate to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

- Frontend runs at `http://localhost:3000`

---

## Testing

### Signup

```bash
curl -X POST http://localhost:5001/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"email":"testuser@domain.com","password":"test123","username":"testuser","role":"student"}'
```

### Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"testuser@domain.com","password":"test123"}'
```

- Or use the React frontend login/signup pages at `http://localhost:3000`

