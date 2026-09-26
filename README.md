# Clinic Management System

Admin panel for a network of clinics / beauty centers: staff, services, clients, schedule and cash desk.
Full-stack project: **REST API on Laravel** + **SPA on Vue 3**.

> Early project (2022). Kept as an example of a full-stack PHP + Vue application.

## Features

- JWT authentication (login / registration / logout) and role-based access (`ROLE_ADMIN` middleware)
- Centers with addresses, services, collaborators (staff) — full CRUD via REST API
- Unified JSON response format through a base controller and API Resources
- Vue SPA pages: clients, services, staff, salary, cash desk, settings
- Client-side routing with auth / guest guards, state management with Vuex
- Form validation with VeeValidate + Yup, calendar for appointments

## Tech stack

- **Backend:** PHP 8, Laravel 8, Eloquent ORM, MySQL, tymon/jwt-auth, Laravel Sanctum
- **Frontend:** Vue 3, Vue Router 4, Vuex 4, Axios, VeeValidate, Bootstrap 4

## Structure

```
backend/    Laravel REST API (app/Http/Controllers, Models, Resources, migrations)
frontend/   Vue 3 SPA (components, store modules, API services)
```

## Running locally

**Backend**

```bash
cd backend
composer install
cp .env.example .env        # set DB_* credentials
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan serve           # http://127.0.0.1:8000
```

**Frontend**

```bash
cd frontend
npm install
npm run serve               # http://localhost:8080
```

The frontend expects the API at `http://127.0.0.1:8000/api`.

The frontend authentication flow started from a public Vue 3 + JWT starter template and was extended into the clinic admin panel.
