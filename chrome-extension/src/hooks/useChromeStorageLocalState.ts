import { useChromeStorageLocal } from 'use-chrome-storage';
import { useContext } from 'react';
import AppContext from '../AppContext';
import TPage from '../types/t-page';


export default function useChromeStorageLocalState() {
  const chromeWindowContext = useContext(AppContext)
  const stateChromeLocalStorageKey = `state_${chromeWindowContext.windowId}`
  
  return useChromeStorageLocal(stateChromeLocalStorageKey, {
    activePage: TPage.Automatic,
    isAnalysisInProgress: false,
    currentArticle: {
      url: undefined,
      title: undefined,
      content: undefined,
      authors: []
    },
    isReliabilityAnalysisInProgress: false,
    shouldShowReliabilityAnalysis: false,
    analysisTotalScore: undefined,
    analysisItems: {
      biasedLanguage: {
        score: undefined
      },
      sourceReliability: {
        score: undefined,
        status: undefined,
        summary: undefined
      },
      headlineClickbait: {
        score: undefined
      },
      urlReliability: {
        score: undefined,
      },
      citedSources: {
        score: undefined
      }
    }
  })
}
