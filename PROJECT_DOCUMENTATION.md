# Employee Management Portal (EMP_v1) Documentation

## Overview
EMP_v1 is a full-stack MERN (MongoDB, Express, React, Node.js) application for managing employees, HR, and admin workflows in an organization. It features role-based access, robust CRUD, analytics, a notice board with AI-powered content generation, and a modern UI.

## Key Features
- **Role-based Access:** Admin, HR, and Employee roles with distinct permissions and navigation.
- **Authentication:** JWT-based login, registration, and protected routes.
- **Employee CRUD:** Add, edit, delete, and view employees (with role restrictions).
- **Dashboard Analytics:** Visual analytics for HR/Admin, personal dashboard for employees.
- **Notice Board:** Post news/openings, reply threads, and two-way communication between employees and HR/Admin.
- **AI Text Generation:** Integrated OpenAI API for content suggestions in posts and profile bios.
- **Modern UI:** Responsive, card-based design with clean forms and navigation.

## Workflow
1. **Admin Onboarding:** Admin creates HR and employees, assigns roles.
2. **HR Management:** HR can add employees, manage records, and post notices.
3. **Employee Experience:** Employees can view their profile, respond to notices, and update their bio.
4. **Notice Board:** All users see posts; employees can reply, HR/Admin can reply back and delete posts they created.
5. **AI Assistance:** Users can generate content for posts and bios using AI.

## Concepts Used
- MERN stack (MongoDB, Express, React, Node.js)
- Redux Toolkit for state management
- React Router v6+ for navigation
- JWT authentication
- CORS for development
- RESTful API design
- OpenAI API integration
- Modern CSS for UI/UX

## Backend Structure
- `server.js`: Main server, route setup, JWT middleware
- `routes/auth.js`: Auth endpoints (register, login, profile, password)
- `routes/employees.js`: Employee CRUD endpoints
- `routes/ai.js`: AI text generation endpoint
- `models/User.js`, `models/Employee.js`: Mongoose models

## Frontend Structure
- `AppRouter.jsx`: Main router, role-based navigation
- `components/`: Dashboard, EmployeeList, Profile, PostBoard, PostReply, etc.
- `slices/employeeSlice.js`: Redux logic for employees
- `index.css`: Modern, responsive styles

## AI Integration
- Backend `/ai/generate` endpoint calls OpenAI API
- Frontend uses this endpoint for AI-powered content in posts and bios

## Security
- JWT for authentication
- Role checks for protected routes and actions

## Extensibility
- Easily add new roles, endpoints, or UI features
- Swap AI provider by updating backend route

---
