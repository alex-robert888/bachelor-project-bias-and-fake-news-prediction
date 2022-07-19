import axios from 'axios';
import React, { useState, useRef } from 'react';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import handleErrors from '../utils/handleErrors';

type TArticle = {
  title: string,
  content: string,
}

const ManualForm: React.FC<{}> = ({}) => {
  const [articleAttributes, setArticleAttributes] = useState<TArticle>({title: '', content: ''})
  const [state, setState] = useChromeStorageLocalState();

  async function articleFormOnSubmit(e: React.SyntheticEvent) {
    /* On form submission, send article content and title to API and get SVM model prediction. */
    e.preventDefault();
    const newState = {
      ...state, 
      shouldShowReliabilityAnalysis: true,
      biasedOrDeceptiveLanguageScore: undefined,
      sourceReliabilityScore: undefined,
      urlReliabilityScore: undefined,
      citedSourcesScore: undefined,
    }
    setState(newState);

    handleErrors(async () => {
      await new Promise(r => setTimeout(r, 1000));
      const response = await predictWithSvm();
      setState({...newState, biasedOrDeceptiveLanguageScore: response.data.bias_score });
    })
  }

  async function predictWithSvm() {
    /* Send article content and title to API and get SVM model prediction. */
    return await axios.get('http://127.0.0.1:5000/svm', { 
      params: {
        title: articleAttributes.title,
        content: articleAttributes.content
      }
    })
  }

	return (
    <form id="article-form" className="flex flex-col space-y-5" onSubmit={articleFormOnSubmit}>
    <fieldset className="flex flex-col space-y-1.5">
      <label className="font-bold" htmlFor="article-title">Article title:</label>
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
      <label className="font-bold" htmlFor="article-content">Article content:</label>
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