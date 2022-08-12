import axios, { AxiosResponse } from "axios";
import TArticle from "../types/t-article";
import useChromeStorageLocalState from "./useChromeStorageLocalState";


type TBiasedOrDeceptiveLanguageScoreApiResponse = {
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
    
      currentState = await analyzeBiasedOrDeceptiveLanguage(article, currentState);
      await analyzeSourceReliability(article, currentState);
    } catch(e) {
      console.error("-- Unhandled error: ", e);
    }
  }
  
  // Perform biased/deceptive language analysis and display resulting score 
  async function analyzeBiasedOrDeceptiveLanguage(article: TArticle, currentState: any) {
    const responseBiasedOrDeceptiveLanguageScoreApi = await fetchBiasedOrDeceptiveLanguageScore(article);
    currentState = {...currentState, 
      biasedOrDeceptiveLanguage: {...currentState.biasedOrDeceptiveLanguage, 
        score: responseBiasedOrDeceptiveLanguageScoreApi.data.bias_score
      }
    }
    setChromeStorageLocalState(currentState);
    return currentState;
  }
  
  // Perform source reliability analysis and display resulting score 
  async function analyzeSourceReliability(article: TArticle, currentState: any) {
    const responseSourceReliabilityScoreApi = await fetchSourceReliabilityScore(article);
    const sourceReliabilityScore = computeSourceReliabilityScore(responseSourceReliabilityScoreApi.data);
    currentState = {...currentState, 
      sourceReliability: {...currentState.sourceReliabilityScore, 
        score: sourceReliabilityScore
      }
    };
    setChromeStorageLocalState(currentState);
  }
  
  // Send article content and title to API and get SVM model prediction.
  async function fetchBiasedOrDeceptiveLanguageScore(article: TArticle): Promise<AxiosResponse<TBiasedOrDeceptiveLanguageScoreApiResponse, any>> {
    return await axios.get<TBiasedOrDeceptiveLanguageScoreApiResponse>('http://127.0.0.1:5000/svm', { 
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