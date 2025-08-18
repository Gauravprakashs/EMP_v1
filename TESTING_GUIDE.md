
# Testing Guide for EMP_v1 Project
## What Is Covered by Current Tests

### Backend
- `/auth/register`: User registration (success, with mocked DB)
- `/auth/login`: User login (invalid user, wrong password, correct credentials; all DB and password checks mocked)

### Frontend
- `EmployeeList` component: Checks that the heading renders (with Redux, context, and localStorage mocked)

---

This guide explains how to set up and run automated tests for both the backend and frontend after cloning the repository from GitHub.

---

## 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- (Optional) MongoDB for full backend integration tests

---

## 2. Clone the Repository
```sh
git clone <your-repo-url>
cd EMP_v1
```

---

## 3. Install Dependencies

### Backend
```sh
cd backend
npm install
```

### Frontend
```sh
cd ../frontend
npm install
```

---

## 4. Configure Environment Variables

### Backend
- Copy `.env.example` to `.env` (if available) or create a `.env` file in `backend/`.
- Ensure at least the following variable is set:
  ```env
  JWT_SECRET=your_test_secret
  ```
- For integration tests, also set `MONGO_URI` to a test database.

---

## 5. Run Backend Tests
```sh
cd backend
npx jest tests/employee.test.js --json --outputFile=jest-backend-report.json
```
- This will run all backend tests and output a report to `jest-backend-report.json`.

---

## 6. Run Frontend Tests
```sh
cd ../frontend
npx jest src/__tests__/EmployeeList.test.jsx --json --outputFile=jest-frontend-report.json --config=jest.config.cjs
```
- This will run the sample frontend test and output a report to `jest-frontend-report.json`.

---

## 7. Troubleshooting
- If you see errors about missing modules, run `npm install` in the relevant directory.
- If you see errors about environment variables, check your `.env` file.
- For frontend, ensure you are running tests from the `frontend` directory and using the correct Jest config (`jest.config.cjs`).
- For backend, ensure `JWT_SECRET` is set for all tests that require authentication.

---

## 8. Adding More Tests
- Backend tests are in `backend/tests/`. Use Jest and Supertest for API tests.
- Frontend tests are in `frontend/src/__tests__/`. Use Jest and React Testing Library for component tests.

---

## 9. Viewing Reports
- Test results are output as JSON files (`jest-backend-report.json`, `jest-frontend-report.json`).
- You can view these files for detailed results and errors.

---

## 10. Best Practices
- Always run `npm install` after pulling new code.
- Keep your `.env` files up to date.
- Run tests before pushing changes to ensure nothing is broken.
- Expand test coverage for new features and bug fixes.

---

For any issues, check the `TEST_SUMMARY_REPORT.md` and `FINAL_TEST_REPORT.md` for more details and troubleshooting tips.
