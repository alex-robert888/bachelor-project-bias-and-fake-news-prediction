import axios, { AxiosResponse } from "axios";
import TArticle from "../types/t-article";
import useChromeStorageLocalState from "./useChromeStorageLocalState";


type TBiasedLanguageScoreApiResponse = {
  bias_score: number
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

  // On form submission, send article content and title to API and get SVM model prediction.
  async function run(article: TArticle) {  
    console.log(article);

    // Display the reliability analysis on the popup.
    let currentState = {...chromeStorageLocalState, shouldShowReliabilityAnalysis: true}
    setChromeStorageLocalState(currentState);
  
    // Perform the analysis
    try {
      // Wait for 1 second so that the buffering icons will be seen
      await new Promise(r => setTimeout(r, 1000));
    
      currentState = await analyzeBiasedLanguage(article, currentState);
      await analyzeSourceReliability(article, currentState);
    } catch(e) {
      console.error("-- Unhandled error: ", e);
    }
  }
  
  // Perform biased/deceptive language analysis and display resulting score 
  async function analyzeBiasedLanguage(article: TArticle, currentState: any) {
    const responseBiasedLanguageScoreApi = await fetchBiasedLanguageScore(article);
    currentState = {...currentState, analysisItems: {...currentState.analysisItems, biasedLanguage: {...currentState.analysisItems.biasedLanguage, score: responseBiasedLanguageScoreApi.data.bias_score}}};
    setChromeStorageLocalState(currentState);
    return currentState;
  }
  
  // Perform source reliability analysis and display resulting score 
  async function analyzeSourceReliability(article: TArticle, currentState: any) {
    const responseSourceReliabilityScoreApi = await fetchSourceReliabilityScore(article);
    const sourceReliabilityScore = computeSourceReliabilityScore(responseSourceReliabilityScoreApi.data);
    currentState = {...currentState, analysisItems: {...currentState.analysisItems, sourceReliability: {...currentState.analysisItems.sourceReliability, score: sourceReliabilityScore}}};
    setChromeStorageLocalState(currentState);
  }
  
  // Send article content and title to API and get SVM model prediction.
  async function fetchBiasedLanguageScore(article: TArticle): Promise<AxiosResponse<TBiasedLanguageScoreApiResponse, any>> {
    return await axios.get<TBiasedLanguageScoreApiResponse>('http://127.0.0.1:5000/svm', { 
      params: { title: article.title, content: article.content }
    })
  }
  
  // Send article url and get the reliability of the source.
  async function fetchSourceReliabilityScore(article: TArticle): Promise<AxiosResponse<TSourceReliabilityScoreApiResponse, any>> {
    return await axios.get<TSourceReliabilityScoreApiResponse>('http://127.0.0.1:8080/sources', { 
      params: { url: article.url }
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