# Employee Directory MERN App

This is a full-stack Employee Directory application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, role-based access, and a modern UI.

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd EMP_v1
```

### 2. Backend Setup
```
cd backend
npm install
```
- Create a `.env` file in the `backend` folder with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
- Start the backend server:
```
npm start
```

### 3. Frontend Setup
```
cd ../frontend
npm install
```
- Start the frontend development server:
```
npm run dev
```

### 4. Access the App
- Open your browser and go to: [http://localhost:5173](http://localhost:5173)

## Features
- Employee CRUD (Create, Read, Update, Delete)
- JWT Authentication (Login, Register)
- Role-based access (Admin, HR)
- Modern UI with gradients and animations

## Folder Structure
```
EMP_v1/
  backend/
    server.js
    routes/
    models/
    .env
  frontend/
    src/
    public/
    .env (if needed)
```

## Notes
- Make sure MongoDB is running and accessible.
- The default backend port is 5000, frontend is 5173.
- For production, set secure values in `.env` files and use a process manager for Node.js.

## ScreenShots

<img width="1849" height="885" alt="image" src="https://github.com/user-attachments/assets/1b4587f8-6cbd-45ca-bf5d-954a3fe2bf84" />
<img width="1590" height="871" alt="image" src="https://github.com/user-attachments/assets/168ba99a-007f-4884-a0ff-56e8cf226ef4" />
<img width="1661" height="846" alt="image" src="https://github.com/user-attachments/assets/2f7baa52-354e-4cbc-a9ed-e093dad2a86f" />


