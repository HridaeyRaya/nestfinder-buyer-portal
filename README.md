# NestFinder — Buyer Portal

A full-stack real estate buyer portal where users can register, log in, and manage their favourite properties.

---

## Tech Stack

- **Backend:** Django, Django REST Framework, SimpleJWT
- **Frontend:** React, Axios, React Router
- **Database:** SQLite

---

## Project Structure
```
BuyerPortal_Project/
├── backend/      # Django REST API
└── frontend/     # React app
```

---

## How to Run

### 1. Backend
```bash
cd backend
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

API docs available at: `http://localhost:8000/swagger/`

---

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Example Flows

### Sign up → Login → Add Favourite

1. Go to `http://localhost:3000/register`
2. Enter an email and password (min. 6 characters) → click **Create account**
3. You'll be redirected to login automatically
4. Enter your credentials → click **Sign in**
5. You're now on the dashboard
6. Enter a property name, select a type, optionally paste an image URL
7. Click **+ Save to favourites**
8. The property appears in your favourites grid
9. Click **Remove** to delete it from your list

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register/` | No | Register new user |
| POST | `/api/login/` | No | Login, returns JWT |
| GET | `/api/favourites/` | Yes | List user's favourites |
| POST | `/api/favourites/add/` | Yes | Add a favourite |
| DELETE | `/api/favourites/delete/<id>/` | Yes | Remove a favourite |

---

## Security

- Passwords are hashed using Django's built-in `create_user`
- JWT tokens are required for all favourites endpoints
- Users can only view and modify their own favourites
- Expired tokens automatically redirect to login
