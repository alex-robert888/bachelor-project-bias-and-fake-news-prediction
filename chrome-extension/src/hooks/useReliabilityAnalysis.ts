import axios, { AxiosResponse } from "axios";
import TArticle from "../types/t-article";
import useChromeStorageLocalState from "./useChromeStorageLocalState";


type TBiasedLanguageScoreApiResponse = {
  bias_score: number
}

type TClickbaitHeadlineScoreApiResponse = {
  clickbait: number
}

type TSourceReliabilityScoreApiResponse = {
  name: string,
  url: string,
  summary: string,
  status: Array<"generally reliable" | "no consensus" | "generally unreliable" | "deprecated" | "blacklisted">
}

const SourceStatusToReliabilityScore = {
  "blacklisted": 0,
  "deprecated": 0,
  "generally unreliable": 0,
  "no consensus": 50,
  "generally reliable": 100
}

const useReliabilityAnalysis = () => {
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState();

  async function run(article: TArticle) {  
    // Display the reliability analysis on the popup and reset all scores to undefined.
    let currentState = {...chromeStorageLocalState, 
      shouldShowReliabilityAnalysis: true,
      analysisTotalScore: undefined,
      analysisItems: {...chromeStorageLocalState.analysisItems, 
        biasedLanguage: {...chromeStorageLocalState.analysisItems.biasedLanguage, score: undefined},
        sourceReliability: {...chromeStorageLocalState.analysisItems.sourceReliability, score: undefined},
        headlineClickbait: {...chromeStorageLocalState.analysisItems.headlineClickbait, score: undefined},
        urlReliability: {...chromeStorageLocalState.analysisItems.urlReliability, score: undefined},
        citedSources: {...chromeStorageLocalState.analysisItems.citedSources, score: undefined},
      }
    }
    setChromeStorageLocalState(currentState);
  
    // Perform the analysis
    try {
      // Wait for 1 second so that the buffering icons will be seen
      await new Promise(r => setTimeout(r, 1000));
    
      // Perform the analysis items
      let biasedLanguageScore, sourceReliabilityScore, headlineClickbaitScore;
      [currentState, biasedLanguageScore] = await analyzeBiasedLanguage(article, currentState);
      [currentState, sourceReliabilityScore] = await analyzeSourceReliability(article, currentState);
      [currentState, headlineClickbaitScore] = await analyzeHeadlineClickbait(article, currentState);
      console.log(">>> HEADLINE CLICKBAIT SCORE: ", headlineClickbaitScore);
      

      // Compute total score
      const totalScore = Math.floor((biasedLanguageScore + sourceReliabilityScore + headlineClickbaitScore) / 3);
      
      // Finish the analysis and display the total score
      setChromeStorageLocalState({...currentState, isAnalysisInProgress: false, analysisTotalScore: totalScore});
    } catch(e) {
      console.error("-- Unhandled error: ", e);
    }
  }
  
  // Perform biased/deceptive language analysis and display resulting score 
  async function analyzeBiasedLanguage(article: TArticle, currentState: any) {
    const response = await fetchBiasedLanguageScore(article);
    const score = response.data.bias_score;
    currentState = {...currentState, analysisItems: {...currentState.analysisItems, biasedLanguage: {...currentState.analysisItems.biasedLanguage, score: score}}};
    setChromeStorageLocalState(currentState);
    return [currentState, score];
  }
  
  // Perform source reliability analysis and display resulting score 
  async function analyzeSourceReliability(article: TArticle, currentState: any) {
    const response = await fetchSourceReliabilityScore(article);
    const score = computeSourceReliabilityScore(response.data);
    currentState = {...currentState, analysisItems: {...currentState.analysisItems, sourceReliability: {...currentState.analysisItems.sourceReliability, score: score}}};
    setChromeStorageLocalState(currentState); 
    return [currentState, score];
  }

  // Perform source reliability analysis and display resulting score 
  async function analyzeHeadlineClickbait(article: TArticle, currentState: any) {
    const response = await fetchHeadlineClickbaitScore(article);
    const score = response.data.clickbait;
    currentState = {...currentState, analysisItems: {...currentState.analysisItems, headlineClickbait: {...currentState.analysisItems.headlineClickbait, score: score}}};
    setChromeStorageLocalState(currentState);
    return [currentState, score];
  }
  
  // Send article content and title to API and get SVM model prediction.
  async function fetchBiasedLanguageScore(article: TArticle): Promise<AxiosResponse<TBiasedLanguageScoreApiResponse, any>> {
    return await axios.get<TBiasedLanguageScoreApiResponse>('http://127.0.0.1:5000/svm', { 
      params: { content: article.content }
    })
  }
  
  // Send article url and get the reliability of the source.
  async function fetchSourceReliabilityScore(article: TArticle): Promise<AxiosResponse<TSourceReliabilityScoreApiResponse, any>> {
    return await axios.get<TSourceReliabilityScoreApiResponse>('http://127.0.0.1:8080/sources', { 
      params: { url: article.url }
    })
  }

  // Send article title and get the clickbait score of the article.
  async function fetchHeadlineClickbaitScore(article: TArticle): Promise<AxiosResponse<TClickbaitHeadlineScoreApiResponse, any>> {
    return await axios.get<TClickbaitHeadlineScoreApiResponse>('http://127.0.0.1:5000/headlines-lr', { 
      params: { headline: article.title }
    })
  }
  
  // Compute source reliability score by taking all statuses given by Wikipedia and take the minimum of them.
  function computeSourceReliabilityScore(responseSourceReliabilityScoreApi: TSourceReliabilityScoreApiResponse): number {
    let score = 100
    for (const s of responseSourceReliabilityScoreApi.status) {
      score = Math.min(score, SourceStatusToReliabilityScore[s]);
    }
    return score;
  }

  return run;
}
  

export default useReliabilityAnalysis;