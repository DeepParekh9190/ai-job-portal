import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const initialState = {
  pendingJobs: [],
  pendingGigs: [],
  users: [],
  clients: [],
  analytics: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  }
};

export const getPendingJobs = createAsyncThunk(
  'admin/getPendingJobs',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getAllJobsForApproval(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveJob = createAsyncThunk(
  'admin/approveJob',
  async ({ id, approvalStatus, rejectionReason }, thunkAPI) => {
    try {
      const response = await adminService.approveJob(id, { approvalStatus, rejectionReason });
      toast.success(`Job ${approvalStatus} successfully!`);
      return { id, approvalStatus };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (_, thunkAPI) => {
    try {
      const response = await adminService.getAnalytics();
      return response.analytics;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getAllUsers(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ id, isActive }, thunkAPI) => {
    try {
      const response = await adminService.updateUserStatus(id, isActive);
      return { id, isActive };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllClients = createAsyncThunk(
  'admin/getAllClients',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getAllClients(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateClientStatus = createAsyncThunk(
  'admin/updateClientStatus',
  async ({ id, isActive }, thunkAPI) => {
    try {
      const response = await adminService.updateClientStatus(id, isActive);
      return { id, isActive };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPendingJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingJobs = action.payload.jobs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getPendingJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveJob.fulfilled, (state, action) => {
        state.pendingJobs = state.pendingJobs.filter(job => job._id !== action.payload.id);
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.id);
        if (index !== -1) {
          state.users[index].isActive = action.payload.isActive;
        }
      })
      .addCase(updateClientStatus.fulfilled, (state, action) => {
        const index = state.clients.findIndex(c => c._id === action.payload.id);
        if (index !== -1) {
          state.clients[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default adminSlice.reducer;
