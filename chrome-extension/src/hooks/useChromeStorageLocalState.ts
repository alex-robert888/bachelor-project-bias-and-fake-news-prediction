import { useChromeStorageLocal } from 'use-chrome-storage';
import { useContext, useEffect } from 'react';
import AppContext from '../AppContext';


export default function useChromeStorageLocalState() {
  const chromeWindowContext = useContext(AppContext)
  const stateChromeLocalStorageKey = `state_${chromeWindowContext.windowId}`
  
  return useChromeStorageLocal(stateChromeLocalStorageKey, {
    shouldShowReliabilityAnalysis: false,
    biasedOrDeceptiveLanguageScore: undefined,
    sourceReliabilityScore: undefined,
    urlReliabilityScore: undefined,
    citedSourcesScore: undefined
  })
}
