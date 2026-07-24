# 🚀 RenewCred CMS Assignment

A production-ready **Content Management System (CMS)** with an **Admin Dashboard** and a **dynamic Public Website**. The application follows a **Headless CMS architecture**, where all website content is managed through an authenticated admin panel and rendered dynamically on the public website via REST APIs.

---

## 📌 Overview

This project demonstrates a scalable CMS that enables administrators to create, edit, publish, and manage website content without modifying frontend code.

The public website consumes content from the backend APIs, ensuring that all displayed information is dynamic and database-driven.

---

## ✨ Features

### 🔐 Authentication
- Admin Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt
- Role-based authorization middleware

### 🛠️ Admin Dashboard
- Responsive Admin Interface
- Dashboard
- Create Pages
- Edit Pages
- Delete Pages
- Publish / Unpublish Pages
- Rich Block-based Content Editor
- Settings Management

### 🌐 Public Website
- Dynamic Pages
- Server-side Rendering (Next.js)
- SEO Friendly Routes
- Dynamic Content Rendering
- Responsive UI
- Error & Loading States

### 📦 Content Blocks
Supports multiple content types including:

- Hero Sections
- Headings
- Paragraphs
- Images
- Buttons
- Lists
- Nested Lists
- Tables
- Quotes
- Code Blocks
- Mathematical Equations (KaTeX)
- Rich Text
- Mixed Content

---

# 🏗️ Architecture

```
                +----------------------+
                |    Admin Dashboard   |
                |      (React/Vite)    |
                +----------+-----------+
                           |
                           |
                    REST APIs (JWT)
                           |
                           ▼
                +----------------------+
                |   Express Backend    |
                |   Business Logic     |
                +----------+-----------+
                           |
                     Mongoose ODM
                           |
                           ▼
                +----------------------+
                |    MongoDB Atlas     |
                +----------+-----------+
                           ▲
                           |
                    REST APIs
                           |
                           ▼
                +----------------------+
                |  Public Website      |
                |      (Next.js)       |
                +----------------------+
```

---

# 🛠️ Tech Stack

## Frontend
- Next.js
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios

## Admin Panel
- React
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod Validation

## Infrastructure
- Docker
- Docker Compose

---

# 📁 Project Structure

```
cms-assignment/

├── backend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── admin-frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── public-frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/renewcred-cms-assignment.git
cd renewcred-cms-assignment
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Admin Frontend

```bash
cd ../admin-frontend
npm install
```

### Public Frontend

```bash
cd ../public-frontend
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret
```

---

# 🌱 Seed Database

Populate MongoDB with the default administrator and sample content.

```bash
cd backend

npm run seed
```

---

# ▶️ Run Backend

```bash
cd backend

npm run dev
```

Runs on:

```
http://localhost:5000
```

---

# ▶️ Run Admin Panel

```bash
cd admin-frontend

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# ▶️ Run Public Website

```bash
cd public-frontend

npm run dev
```

Runs on:

```
http://localhost:3000
```

---

# 🔑 Default Admin Credentials

```
Email:
admin@renewcred.com

Password:
Admin@12345
```

> These credentials are created automatically after running the seed script.

---

# 🔄 Application Flow

```
Admin Login
      │
      ▼
Create / Update Page
      │
      ▼
Express Backend APIs
      │
      ▼
MongoDB Atlas
      │
      ▼
Public Website fetches data
      │
      ▼
Dynamic Rendering
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/logout` |

---

## Pages

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/pages` |
| GET | `/api/v1/pages/:slug` |
| POST | `/api/v1/pages` |
| PUT | `/api/v1/pages/:id` |
| DELETE | `/api/v1/pages/:id` |

---

## Settings

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/settings` |
| PUT | `/api/v1/settings` |

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Input Validation
- Environment Variables
- Centralized Error Handling

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Tablet
- Mobile

---

# 📈 Future Improvements

- Multi-user Roles & Permissions
- Media Upload (Cloudinary / S3)
- Draft Versioning
- Scheduled Publishing
- Analytics Dashboard
- Audit Logs
- Search & Filters
- Rich Text Enhancements
- API Documentation (Swagger)
- Automated Testing (Jest + Supertest)
- CI/CD Pipeline

---

# 🧠 Architectural Decisions

- Adopted a **Headless CMS architecture** to separate content management from content presentation.
- Implemented a **block-based content model** for flexibility and future scalability.
- Used **Redux Toolkit** only for global application state (authentication and CMS data), while keeping local UI state within components.
- Structured the backend using **MVC architecture** to improve maintainability and separation of concerns.
- Designed RESTful APIs with consistent response structures to simplify frontend integration.
- Used **MongoDB** to efficiently store flexible, block-based content.

---

# 📄 Deliverables

- ✅ Source Code
- ✅ GitHub Repository
- ✅ README
- ✅ Environment Variable Template
- ✅ Seed Script
- ✅ Docker Configuration

---

# 👨‍💻 Author

**Om Prakash Karri**

- GitHub: https://github.com/OMPRAKASHKARRI
- LinkedIn: https://www.linkedin.com/in/omprakash-k-/

---

## ⭐ Thank You

Thank you for reviewing this assignment. I enjoyed building this project and focused on creating a clean, scalable, and production-oriented solution that reflects real-world software engineering practices.