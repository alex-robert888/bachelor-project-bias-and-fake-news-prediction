import axios, { AxiosResponse } from 'axios';
import React, { useState, useRef } from 'react';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import handleErrors from '../utils/handleErrors';

type TArticle = {
  url: string,
  title: string,
  content: string,
}

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

const ManualForm: React.FC<{}> = ({}) => {
  const [articleAttributes, setArticleAttributes] = useState<TArticle>({url: '', title: '', content: ''})
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState();

  /* On form submission, send article content and title to API and get SVM model prediction. */
  async function articleFormOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    let newState = {...chromeStorageLocalState, 
      shouldShowReliabilityAnalysis: true,
      biasedOrDeceptiveLanguageScore: undefined,
      sourceReliabilityScore: undefined,
      urlReliabilityScore: undefined,
      citedSourcesScore: undefined,
    }
    setChromeStorageLocalState(newState);

    handleErrors(async () => {
      await new Promise(r => setTimeout(r, 500));
      const responseBiasedOrDeceptiveLanguageScoreApi = await fetchBiasedOrDeceptiveLanguageScore();
      setChromeStorageLocalState({...newState, biasedOrDeceptiveLanguageScore: responseBiasedOrDeceptiveLanguageScoreApi.data.bias_score });
      newState = {...newState, biasedOrDeceptiveLanguageScore: responseBiasedOrDeceptiveLanguageScoreApi.data.bias_score}
      
      await new Promise(r => setTimeout(r, 500));
      const responseSourceReliabilityScoreApi = await fetchSourceReliabilityScore();
      const sourceReliabilityScore = computeSourceReliabilityScore(responseSourceReliabilityScoreApi.data);
      setChromeStorageLocalState({...newState, sourceReliabilityScore: sourceReliabilityScore });
    })
  } 

  /* Send article content and title to API and get SVM model prediction. */
  async function fetchBiasedOrDeceptiveLanguageScore(): Promise<AxiosResponse<TBiasedOrDeceptiveLanguageScoreApiResponse, any>> {
    return await axios.get<TBiasedOrDeceptiveLanguageScoreApiResponse>('http://127.0.0.1:5000/svm', { 
      params: { title: articleAttributes.title, content: articleAttributes.content }
    })
  }

  async function fetchSourceReliabilityScore(): Promise<AxiosResponse<TSourceReliabilityScoreApiResponse, any>> {
    return await axios.get<TSourceReliabilityScoreApiResponse>('http://127.0.0.1:8080/sources', { 
      params: { url: articleAttributes.url }
    })
  }

  function computeSourceReliabilityScore(responseSourceReliabilityScoreApi: TSourceReliabilityScoreApiResponse): number {
    let score = 100
    for (const s of responseSourceReliabilityScoreApi.status) {
      score = Math.min(score, SourceStatusToReliabilityScore[s]);
    }
    return score;
  }

	return (
    <form id="article-form" className="flex flex-col space-y-5" onSubmit={articleFormOnSubmit}>
      <fieldset className="flex flex-col space-y-1.5">
        <label className="font-bold" htmlFor="article-url">URL:</label>
        <input 
          className="border border-solid border-gray-300 px-3 py-1.5 rounded" 
          name="article-url" 
          id="article-url" 
          placeholder="URL of the article.."
          value={articleAttributes.url}
          onChange={(e) => setArticleAttributes({...articleAttributes, url: e.target.value})}
        />
      </fieldset>

      <fieldset className="flex flex-col space-y-1.5">
        <label className="font-bold" htmlFor="article-title">Title:</label>
        <input 
          className="border border-solid border-gray-300 px-3 py-1.5 rounded" 
          name="article-title" 
          id="article-title" 
          placeholder="Title of the article.."
          value={articleAttributes.title}
          onChange={(e) => setArticleAttributes({...articleAttributes, title: e.target.value})}
        />
      </fieldset>

      <fieldset className="flex flex-col space-y-2">
        <label className="font-bold" htmlFor="article-content">Content:</label>
        <textarea 
          className="border border-solid border-gray-300 px-3 py-1.5 rounded" 
          name="article-content" 
          id="article-content" 
          cols={30} rows={10} 
          placeholder="Content of the article.."
          value={articleAttributes.content}
          onChange={(e) => setArticleAttributes({...articleAttributes, content: e.target.value})} 
        />
      </fieldset>

      <button 
        className="bg-gradient-to-r from-custom-gradient-violet to-custom-gradient-indigo text-white py-3 cursor-pointer font-bold rounded" 
        type="submit" 
        value="Predict"
      >
        Start Analysis
      </button>
    </form>

	)
}

export default ManualForm;
