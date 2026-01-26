import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';
import gigService from '../../services/gigService';
import toast from 'react-hot-toast';

const initialState = {
  jobs: [],
  gigs: [],
  currentJob: null,
  currentGig: null,
  myJobs: [],
  myGigs: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
  filters: {
    category: '',
    jobType: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    experienceLevel: '',
    keyword: '',
  },
};

// Get all jobs
export const getAllJobs = createAsyncThunk(
  'job/getAllJobs',
  async (params, thunkAPI) => {
    try {
      const response = await jobService.getAllJobs(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk(
  'job/getJobById',
  async (id, thunkAPI) => {
    try {
      const response = await jobService.getJobById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create job (client)
export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData, thunkAPI) => {
    try {
      const response = await jobService.createJob(jobData);
      toast.success('Job posted successfully! Awaiting admin approval.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my jobs (client)
export const getMyJobs = createAsyncThunk(
  'job/getMyJobs',
  async (params, thunkAPI) => {
    try {
      const response = await jobService.getMyJobs(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update job (client)
export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, jobData }, thunkAPI) => {
    try {
      const response = await jobService.updateJob(id, jobData);
      toast.success('Job updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete job (client)
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (id, thunkAPI) => {
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all gigs
export const getAllGigs = createAsyncThunk(
  'job/getAllGigs',
  async (params, thunkAPI) => {
    try {
      const response = await gigService.getAllGigs(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get gig by ID
export const getGigById = createAsyncThunk(
  'job/getGigById',
  async (id, thunkAPI) => {
    try {
      const response = await gigService.getGigById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create gig (client)
export const createGig = createAsyncThunk(
  'job/createGig',
  async (gigData, thunkAPI) => {
    try {
      const response = await gigService.createGig(gigData);
      toast.success('Gig posted successfully! Awaiting admin approval.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my gigs (client)
export const getMyGigs = createAsyncThunk(
  'job/getMyGigs',
  async (params, thunkAPI) => {
    try {
      const response = await gigService.getMyGigs(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Jobs
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Job By ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs.unshift(action.payload.job);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Jobs
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload.jobs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.map((job) =>
          job._id === action.payload.job._id ? action.payload.job : job
        );
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.filter((job) => job._id !== action.payload);
      })
      // Get All Gigs
      .addCase(getAllGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload.gigs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getAllGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Gig By ID
      .addCase(getGigById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGig = action.payload.gig;
      })
      .addCase(getGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Gig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs.unshift(action.payload.gig);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Gigs
      .addCase(getMyGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload.gigs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentJob, clearCurrentGig } = jobSlice.actions;
export default jobSlice.reducer;