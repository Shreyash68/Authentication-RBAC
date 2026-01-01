# TaskFlow (Authentication & RBAC Project)

A robust **Task Management Application** featuring secure authentication, Role-Based Access Control (RBAC), and a modern tech stack.

## 🚀 Features
- **Authentication**:
    - **JWT** (JSON Web Tokens) stored in **HTTP-Only Cookies** to prevent XSS attacks.
    - **Argon2** hashing for secure password storage.
- **RBAC**: Distinct generic **User** and **Admin** roles.
- **Task Management**: Create, Read, Update, Delete (CRUD) tasks.
- **Dashboard**:
    - **Admin**: Manage all users and tasks, view global statistics.
    - **User**: View and manage personal tasks.
- **Dockerized**: Fully containerized for easy deployment.

## 🔐 Role-Based Access Control (RBAC)

| Feature | User | Admin |
| :--- | :---: | :---: |
| **View Own Tasks** | ✅ | ✅ |
| **Create Tasks** | ❌ | ✅ |
| **Delete Tasks** | ❌ | ✅ |
| **Update Task Status** | ✅ | ✅ |
| **Update Task Details** | ❌ | ✅ |
| **Assign Tasks** | ❌ | ✅ |
| **View All Users** | ❌ | ✅ |

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python), Motor (Async MongoDB)
- **Frontend**: React, Vite, TailwindCSS
- **Database**: MongoDB
- **DevOps**: Docker, Docker Compose, Nginx

## 📂 Project Structure
```
├── backend/          # FastAPI Application
├── frontend/         # React + Vite Application
├── docker-compose.yml # Docker Orchestration
└── README.md         # This file
```

## ⚡ Quick Start (Docker)
The easiest way to run the application is using Docker.

1.  **Clone the repository**
2.  **Run Docker Compose**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the App**:
    - Frontend: [http://localhost](http://localhost)
    - Backend Docs: [http://localhost/api/docs](http://localhost/api/docs)
    - Deployed Backend Docs: [http:ip-address/api/docs](http:ip-address/api/docs)

---

## 🔧 Manual Setup
For local development without Docker, please refer to the detailed guides in each directory:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
