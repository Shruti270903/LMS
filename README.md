# 🎓 Learning Management System (LMS)

A full-stack **Learning Management System (LMS)** built to manage courses, users, payments, and content delivery with secure authentication and scalable architecture.

This project is designed as a **monorepo** with a modern frontend and a robust backend, ready for deployment on cloud platforms like **Render**.

---

## 🚀 Features

### 👨‍🎓 Student
- Secure authentication & authorization
- Browse and enroll in courses
- Access purchased course content
- Stripe-based secure payments
- Profile & dashboard management

### 👨‍🏫 Educator / Admin
- Create & manage courses
- Upload course content (Cloudinary)
- Manage students & enrollments
- Dashboard with course insights

### 🔐 Security & Integrations
- Authentication using **Clerk**
- Payments using **Stripe**
- Media storage with **Cloudinary**
- MongoDB for persistent data storage
- Environment-based configuration (no secrets in repo)

---

## 🛠 Tech Stack

### Frontend (Client)
- **React + Vite**
- **Tailwind CSS**
- **Clerk (Auth)**
- **Axios**
- **Stripe JS**

### Backend (Server)
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Stripe API**
- **Cloudinary**
- **Clerk Webhooks**

---

## 📂 Project Structure

LMS/
├── client/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .env.example
│
├── server/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middlewares/
│ ├── configs/
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── .gitignore
└── README.md