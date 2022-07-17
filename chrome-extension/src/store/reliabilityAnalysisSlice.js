import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

// Slice
export const reliabilityAnalysisSlice = createSlice({
  name: "reliabilityAnalysis",
  initialState: {
    shouldShowReliabilityAnalysis: false
  },
  reducers: {
    showReliabilityAnalysis: (state, _) => {
      state.shouldShowReliabilityAnalysis = true;
    },

    hideReliabilityAnalysis: (state, _) => {
      state.shouldShowReliabilityAnalysis = false;
    }
  }
})

// Actions
export const { 
  showReliabilityAnalysis, 
  hideReliabilityAnalysis 
} = reliabilityAnalysisSlice.actions

// Selectors
export const selectShouldShowReliabilityAnalysis = (state: any) => state.shouldShowReliabilityAnalysis;

// Reducer
export default reliabilityAnalysisSlice.reducer;


