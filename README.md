# NestFinder – Buyer Portal

## Overview

A simple full-stack buyer portal for managing favourite properties.

Features:

* User registration & login (JWT auth)
* Add/remove favourite properties
* User-specific data (secure access)
* Clean UI with feedback messages

---

## Tech Stack

Frontend:

* React (Create React App)
* Axios

Backend:

* Django REST Framework
* JWT Authentication (SimpleJWT)

---

## Setup Instructions

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

This project does not require environment variables for local development.

For production, you may configure:

* SECRET_KEY
* DEBUG


---

## Example Flow

1. Register a new user
2. Login
3. Add a property to favourites
4. View favourites
5. Remove a property

---

## Screenshots

(Add your screenshots here)

---

## Notes

* Passwords are securely hashed
* Users can only access their own data
* Basic validation & error handling implemented
