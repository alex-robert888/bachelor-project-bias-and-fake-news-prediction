import { configureStore } from "@reduxjs/toolkit";
import reliabilityAnalysisSliceReducer from './reliabilityAnalysisSlice';

export default configureStore({
  reducer: {
    reliabilityAnalysis: reliabilityAnalysisSliceReducer
  }
})

