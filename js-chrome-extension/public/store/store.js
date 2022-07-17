const { configureStore } = require("@reduxjs/toolkit");
import reliabilityAnalysisSliceReducer from './reliabilityAnalysisSlice.js';

export default configureStore({
  reducer: {
    reliabilityAnalysis: reliabilityAnalysisSliceReducer
  }
})

