# 🎓 Yearbook 25-06-EON Project Summary

## **Project Name**
**JAHRBUCH 25-06-EON** – Interactive Digital Graduation Yearbook

## **Project Objective**
A high-end digital yearbook application designed for the graduating Class of 25-06. The platform features teacher and student profiles, an interactive peer-to-peer messaging system, and course information, all wrapped in a modern web interface.

---

## **Technology Stack**

### **Backend (`server/`)**
* **Runtime:** Node.js + Express.js
* **Database:** PostgreSQL (Cloud hosted via Railway)
* **Authentication:** JWT (JSON Web Tokens)
* **API Architecture:** RESTful Endpoints

### **Frontend (`yearbook-v2/`)**
* **Framework:** React 18 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **UI Components:** Radix UI + shadcn/ui
* **Routing:** React Router

---

## **Project Structure**

```text
Yearbook_2506_EON/
├── server/                    # Backend API Service
│   └── src/
│       ├── index.js           # Express server entry point
│       ├── config/            # DB & Environment configurations
│       ├── controllers/       # Route logic handlers
│       ├── routes/            # API route definitions
│       ├── middleware/        # Authentication & Security logic
│       └── jobs/              # Background tasks & schedulers
│
├── yearbook-v2/               # Frontend Application (Vite+React)
│   ├── client/
│   │   └── src/
│   │       ├── pages/         # Home, Dashboard, Profiles
│   │       ├── components/    # Reusable UI components
│   │       ├── hooks/         # Custom React hooks
│   │       └── styles/        # Global CSS & Tailwind configs
│   └── shared/                # Shared Types & Constants
│
├── docker-compose.yml         # Local development orchestration
├── railway.toml               # Railway deployment configuration
└── Dockerfile                 # Client-side container build
```

---

## **Key Features**

1. **Authentication System** – Secure Login, Registration, and Password Reset.
2. **Course Details** – Comprehensive information about the "Klasse 25-06" curriculum.
3. **Teacher Directory** – Interactive profiles with direct messaging capabilities.
4. **Student Directory** – Profiles featuring peer-to-peer messaging.
5. **Interactive Messaging** – Ability to leave public or private messages on profiles.
6. **Holographic UI** – Modern, glassmorphism-inspired interface with advanced CSS effects.

---

## **Deployment & DevOps**
* **Frontend:** Railway (Static Asset Hosting)
* **Backend:** Railway (Node.js Environment)
* **Database:** Railway Managed PostgreSQL

---

## **API Endpoints (Core)**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/register` | User account creation |
| `GET` | `/api/yearbook/teachers` | Retrieve teacher list |
| `GET` | `/api/yearbook/students` | Retrieve student list |
| `GET/POST` | `/api/yearbook/messages/:type/:id` | Fetch or post profile messages |

**Crafted by The_Bozgun - 2026**
