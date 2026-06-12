# toikhana.kz

Monorepo-style scaffold for the toikhana.kz catalog.

## Backend

The Spring Boot app lives at the repo root.

Run:

```powershell
\.\mvnw.cmd test
```

The repository currently uses:
- Spring Boot 2.7.x
- Java 8 compatibility
- H2 for local dev
- PostgreSQL via `prod` profile

## Frontend

The React + TypeScript + Tailwind app lives in `frontend/`.

Run:

```powershell
cd frontend
npm install
npm run dev
```

## Notes

- Public endpoints are wired for cities, toikhanas, bookings, and admin operations.
- Admin uses HTTP Basic Auth with default credentials from `application.yml`.
- Photo uploads are stored under `uploads/`.
