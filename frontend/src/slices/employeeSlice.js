import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for CRUD operations (API integration placeholder)

const API_URL = 'http://localhost:5000/employees';

export const fetchEmployees = createAsyncThunk('employees/fetch', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch employees');
  return await res.json();
});


export const addEmployee = createAsyncThunk('employees/add', async (employee) => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return await res.json();
});


export const updateEmployee = createAsyncThunk('employees/update', async (employee) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${employee._id || employee.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return await res.json();
});


export const deleteEmployee = createAsyncThunk('employees/delete', async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete employee');
  return id;
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const idx = state.list.findIndex(emp => emp.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
