# 🛒 ShopNest - Full-Stack MERN E-Commerce App

A professionally engineered **Full-Stack E-Commerce platform** built using modern technologies:

* **Frontend:** React.js (CRA - Create React App)
* **Backend:** Node.js + Express.js
* **Database:** MongoDB with Mongoose
* **Architecture:** Monorepo-friendly full-stack setup

---

# 🛠 Tech Stack Details

## Frontend

* React.js (react-scripts)
* Redux Toolkit for cart state management
* Context API for authentication
* JWT-based user sessions
* Responsive UI components

## Backend

* Node.js runtime
* Express.js framework
* Middleware-based routing architecture
* REST API structure

## Database

* MongoDB
* Mongoose ODM schemas

## Features

* Unified Admin Dashboard
* Product management system
* User profile management
* Order history tracking
* Role-based authentication
* Secure API routes

## Payments

* Razorpay payment gateway integration
* Supports:

  * Test payment environment
  * Placeholder credentials

## Cloud Storage

* Cloudinary integration
* Secure product image uploading
* Multer-based file handling

---

# 🚀 Quick Start / Local Development Guide

## 1️⃣ Install Dependencies & Configure Environment

Make sure MongoDB is running locally or use a remote MongoDB connection.

### Backend `.env` Configuration

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27018/shopnest
JWT_SECRET=super_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Install Dependencies

Run from the root project folder:

```bash
npm run build
```

---

# 2️⃣ Database Seeding

Populate the database with sample products and create an Admin account.

Run:

```bash
npm run seed
```

### Default Admin Credentials

```
Email:
admin@shopnest.com

Password:
password123
```

---

# 3️⃣ Run Application

Start both frontend and backend together:

```bash
npm run dev
```

### Default Ports

* Frontend:

  ```
  http://localhost:3000
  ```

* Backend:

  ```
  http://localhost:5000
  ```

---

# ☁️ Deployment (Render Free-Tier Optimized)

ShopNest supports single-server deployment using Render.

## Deployment Steps

1. Push the repository to GitHub.
2. Open Render Dashboard.
3. Connect your GitHub repository.
4. Create a new Web Service.

## Render Configuration

### Build Command

```bash
npm run render-build
```

This will:

* Install backend dependencies
* Install frontend dependencies
* Generate React production build

### Start Command

```bash
npm start
```

### Environment Variables

Add your `.env` values:

```
NODE_ENV=production
```

Include:

* MongoDB URI
* JWT Secret
* Razorpay Keys
* Other required environment variables

---

# ⚙️ Production Features

* Express serves React production build
* Automatic frontend routing support
* Optimized Node.js deployment
* Single-server architecture
* Free-tier friendly configuration

---

# 📄 Postman API Documentation

The project includes:

```
ShopNest_Postman_Collection.json
```

## Usage

* Import the collection into Postman.
* Test APIs directly.
* Use predefined variables:

```
{{token}}
```

## Available API Testing

* User authentication
* Protected routes
* Admin APIs
* Product APIs
* Order APIs
* User profile APIs

---

# 🎯 Project Highlights

✅ Full MERN Stack Architecture
✅ JWT Authentication
✅ Admin Dashboard
✅ Product Management
✅ Cloudinary Image Uploads
✅ Razorpay Payment Integration
✅ Redux Cart Management
✅ MongoDB Order System
✅ Production Deployment Ready

---

# 👨‍💻 Happy Coding with Next Engineer
