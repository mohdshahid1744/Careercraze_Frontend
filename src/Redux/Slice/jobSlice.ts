import { createSlice } from '@reduxjs/toolkit';

interface JobState {
  jobs: any[];
  savedJobs: any[];
}

const initialState: JobState = {
  jobs: [],
  savedJobs: [],
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
    },
    saveJob(state, action) {
      const job = action.payload;
      if (!state.savedJobs.find((savedJob) => savedJob._id === job._id)) {
        state.savedJobs.push(job);
      }
    },
    removeSavedJob(state, action) {
      state.savedJobs = state.savedJobs.filter((job) => job._id !== action.payload);
    },
  },
});

export const { setJobs, saveJob, removeSavedJob } = jobSlice.actions;

export default jobSlice.reducer;
