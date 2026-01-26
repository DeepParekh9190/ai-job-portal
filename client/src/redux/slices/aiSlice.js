import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

const initialState = {
  generatedResume: null,
  resumeAnalysis: null,
  matchScore: null,
  recommendedJobs: [],
  loading: false,
  error: null,
};

// Generate AI resume
export const generateResume = createAsyncThunk(
  'ai/generateResume',
  async (resumeData, thunkAPI) => {
    try {
      const response = await aiService.generateResume(resumeData);
      toast.success('Resume generated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Analyze resume
export const analyzeResume = createAsyncThunk(
  'ai/analyzeResume',
  async (resumeData, thunkAPI) => {
    try {
      const response = await aiService.analyzeResume(resumeData);
      toast.success('Resume analyzed successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Calculate job match
export const calculateJobMatch = createAsyncThunk(
  'ai/calculateJobMatch',
  async (jobId, thunkAPI) => {
    try {
      const response = await aiService.calculateJobMatch(jobId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recommended jobs
export const getRecommendedJobs = createAsyncThunk(
  'ai/getRecommendedJobs',
  async (limit, thunkAPI) => {
    try {
      const response = await aiService.getRecommendedJobs(limit);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate professional summary
export const generateSummary = createAsyncThunk(
  'ai/generateSummary',
  async (data, thunkAPI) => {
    try {
      const response = await aiService.generateSummary(data);
      toast.success('Summary generated!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate job description
export const generateJobDescription = createAsyncThunk(
  'ai/generateJobDescription',
  async (data, thunkAPI) => {
    try {
      const response = await aiService.generateJobDescription(data);
      toast.success('Job description generated!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Improve section
export const improveSection = createAsyncThunk(
  'ai/improveSection',
  async (data, thunkAPI) => {
    try {
      const response = await aiService.improveSection(data);
      toast.success('Section improved!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate cover letter
export const generateCoverLetter = createAsyncThunk(
  'ai/generateCoverLetter',
  async (jobId, thunkAPI) => {
    try {
      const response = await aiService.generateCoverLetter(jobId);
      toast.success('Cover letter generated!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearGeneratedResume: (state) => {
      state.generatedResume = null;
    },
    clearResumeAnalysis: (state) => {
      state.resumeAnalysis = null;
    },
    clearMatchScore: (state) => {
      state.matchScore = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Resume
      .addCase(generateResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedResume = action.payload.resume;
      })
      .addCase(generateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analyze Resume
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeAnalysis = action.payload.analysis;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Calculate Job Match
      .addCase(calculateJobMatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateJobMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matchScore = action.payload.match;
      })
      .addCase(calculateJobMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Recommended Jobs
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload.jobs;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearGeneratedResume, 
  clearResumeAnalysis, 
  clearMatchScore, 
  clearError 
} = aiSlice.actions;

export default aiSlice.reducer;