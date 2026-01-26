import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';

const initialState = {
  applications: [],
  currentApplication: null,
  applicants: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
  stats: {},
};

// Apply for job
export const applyForJob = createAsyncThunk(
  'application/applyForJob',
  async ({ jobId, applicationData }, thunkAPI) => {
    try {
      const response = await applicationService.applyForJob(jobId, applicationData);
      toast.success('Application submitted successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Apply for gig
export const applyForGig = createAsyncThunk(
  'application/applyForGig',
  async ({ gigId, applicationData }, thunkAPI) => {
    try {
      const response = await applicationService.applyForGig(gigId, applicationData);
      toast.success('Proposal submitted successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my applications
export const getMyApplications = createAsyncThunk(
  'application/getMyApplications',
  async (params, thunkAPI) => {
    try {
      const response = await applicationService.getMyApplications(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job applicants (client)
export const getJobApplicants = createAsyncThunk(
  'application/getJobApplicants',
  async ({ jobId, params }, thunkAPI) => {
    try {
      const response = await applicationService.getJobApplicants(jobId, params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update application status (client)
export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ applicationId, status, note }, thunkAPI) => {
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, status, note);
      toast.success('Application status updated!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Withdraw application (user)
export const withdrawApplication = createAsyncThunk(
  'application/withdraw',
  async (applicationId, thunkAPI) => {
    try {
      const response = await applicationService.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Accept offer (user)
export const acceptOffer = createAsyncThunk(
  'application/acceptOffer',
  async (applicationId, thunkAPI) => {
    try {
      const response = await applicationService.acceptOffer(applicationId);
      toast.success('Offer accepted! Congratulations!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Decline offer (user)
export const declineOffer = createAsyncThunk(
  'application/declineOffer',
  async ({ applicationId, reason }, thunkAPI) => {
    try {
      const response = await applicationService.declineOffer(applicationId, reason);
      toast.success('Offer declined.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply for Gig
      .addCase(applyForGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
      })
      .addCase(applyForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Applications
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.stats = action.payload.stats || {};
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Job Applicants
      .addCase(getJobApplicants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload.applications;
        state.stats = action.payload.stats || {};
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getJobApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.applicants = state.applicants.map((app) =>
          app._id === action.payload.application._id ? action.payload.application : app
        );
      })
      // Withdraw Application
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload.application._id ? action.payload.application : app
        );
      })
      // Accept Offer
      .addCase(acceptOffer.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload.application._id ? action.payload.application : app
        );
      })
      // Decline Offer
      .addCase(declineOffer.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload.application._id ? action.payload.application : app
        );
      });
  },
});

export const { clearError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;