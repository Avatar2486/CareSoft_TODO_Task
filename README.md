# Task Tracker — Angular + FastAPI

A simple task management app. You can sign up, log in, and manage your tasks (create, edit, delete, filter by status). Data lives in memory, so it resets when the backend restarts.

---

## What you need before starting

- Python 3.10+
- Node.js 18+
- npm

---

## Running the backend

```bash
cd TODO_BE

# Create a virtual environment (first time only)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`.  
You can explore the API at `http://localhost:8000/docs`.

---

## Running the frontend

Open a new terminal tab:

```bash
cd Todo_FE

# Install dependencies (first time only)
npm install

# Start the dev server
ng serve
```

Frontend runs at `http://localhost:4200`.

---

## How to use the app

1. Open `http://localhost:4200` in your browser.
2. Go to **Sign Up** and create an account.
3. **Log in** with your credentials.
4. On the dashboard you can:
   - Add a new task using the form on the left.
   - Edit or delete any task from the list.
   - Filter tasks by status (All / Open / In Progress / Completed) using the dropdown.

---

## API endpoints (quick reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/login` | Log in and get a token |
| GET | `/tasks` | Get your tasks (optional `?status=` filter) |
| POST | `/tasks` | Create a task |
| PUT | `/task/{id}` | Update a task |
| DELETE | `/task/{id}` | Delete a task |
