import { useChromeStorageLocal } from 'use-chrome-storage';
import { useContext, useEffect } from 'react';
import AppContext from '../AppContext';


export default function useChromeStorageLocalState() {
  const chromeWindowContext = useContext(AppContext)
  const stateChromeLocalStorageKey = `state_${chromeWindowContext.windowId}`
  
  return useChromeStorageLocal(stateChromeLocalStorageKey, {
    isReliabilityAnalysisInProgress: false,
    shouldShowReliabilityAnalysis: false,
    biasedOrDeceptiveLanguage: {
      score: undefined
    },
    sourceReliability: {
      score: undefined,
      status: undefined,
      summary: undefined
    },
    urlReliabilityScore: undefined,
    citedSourcesScore: undefined
  })
}
