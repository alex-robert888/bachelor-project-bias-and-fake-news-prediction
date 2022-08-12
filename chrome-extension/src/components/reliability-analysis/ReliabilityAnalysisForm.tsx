import React from 'react';
import TArticle from '../../types/t-article';
import useReliabilityAnalysis from '../../hooks/useReliabilityAnalysis';


type TPropsReliabilityAnalysisForm = {
  article: TArticle,
  setArticle: (article: TArticle) => void
}

const ReliabilityAnalysisForm: React.FC<TPropsReliabilityAnalysisForm> = (props) => {
  const styleInput = "border border-solid border-gray-300 px-3 py-1.5 rounded";
  const styleFieldset = "flex flex-col space-y-1.5";
  const runReliabilityAnalysis = useReliabilityAnalysis();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runReliabilityAnalysis(props.article);
  }

  return (
    <form id="article-form" className="flex flex-col space-y-5" onSubmit={onFormSubmit}>
      <fieldset className={styleFieldset}>
        <label className="font-bold" htmlFor="article-url">URL:</label>
        <input 
          className={styleInput}
          name="article-url" 
          id="article-url" 
          placeholder="URL of the article.."
          value={props.article.url}
          onChange={(e) => props.setArticle({...props.article, url: e.target.value})}
        />
      </fieldset>

      <fieldset className={styleFieldset}>
        <label className="font-bold" htmlFor="article-title">Title:</label>
        <input 
          className={styleInput}
          name="article-title" 
          id="article-title" 
          placeholder="Title of the article.."
          value={props.article.title}
          onChange={(e) => props.setArticle({...props.article, title: e.target.value})}
        />
      </fieldset>

      <fieldset className={styleFieldset}>
        <label className="font-bold" htmlFor="article-content">Content:</label>
        <textarea 
          className={styleInput} 
          name="article-content" 
          id="article-content" 
          cols={30} rows={10} 
          placeholder="Content of the article.."
          value={props.article.content}
          onChange={(e) => props.setArticle({...props.article, content: e.target.value})} 
        />
      </fieldset>

      <button 
        className="bg-gradient-to-r from-custom-gradient-violet to-custom-gradient-indigo 
                text-white py-3 cursor-pointer font-bold rounded" 
        type="submit" 
        value="Predict"
      >
        Start Analysis
      </button>
    </form>
  )
}

export default ReliabilityAnalysisForm;