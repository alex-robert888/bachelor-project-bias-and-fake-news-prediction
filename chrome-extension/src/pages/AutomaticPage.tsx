import axios from 'axios';
import React, { useState, useEffect } from 'react';
import downArrowIndigo from '../assets/images/down-arrow-indigo.svg';
import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';
import ReliabilityAnalysisForm from '../components/reliability-analysis/ReliabilityAnalysisForm';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import useReliabilityAnalysis from '../hooks/useReliabilityAnalysis';
import TArticle from '../types/t-article';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

type TScrapeArticleApiResponse = {
  authors: Array<string>,
  title: string,
  text: string
};

type TFeedbackRating = "highly unreliable" | "unreliable" | "fairly unreliable" | "reliable" | "highly reliable"

const AutomaticPage: React.FC<{}> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState();
  const [article, setArticle] = useState<TArticle>({
    url: '', title: '', content: '', authors: []
  });
  const runReliabilityAnalysis = useReliabilityAnalysis();
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<TFeedbackRating>();
  const [feedbackComment, setFeedbackComment] = useState<string>();

  const onFeedbackFormSubmit = async () => {
    setIsFeedbackSubmitted(true);
    
    try {
      await axios.post("http://127.0.0.1:8080/feedbacks", {
        url: article.url,
        title: article.title,
        text: article.content,
        authors: article.authors,
        rating: feedbackRating,
        comment: feedbackComment
      });
    } catch(e) {
      console.error("-- Unhandled error: ", e);
    }
  }

  useEffect(() => {
    if (!chromeStorageLocalState.isAnalysisInProgress) return;
    setIsFeedbackSubmitted(false);

    (async() => {
      try {
        // Scrape the article and get its attributes.
        const response = await axios.get<TScrapeArticleApiResponse>('http://127.0.0.1:5000/scrape-article', 
          {params: {url: chromeStorageLocalState.currentArticle.url}}
        );
        const article = {          
          url: chromeStorageLocalState.currentArticle.url,
          title: response.data.title,
          content: response.data.text,
          authors: response.data.authors
        }

        // Run the reliability analysis.
        await runReliabilityAnalysis(article);
        
        setArticle(article);
      } catch(e) {
        console.error("-- Unhandled error: ", e)
      }
    })();
  }, [chromeStorageLocalState.isAnalysisInProgress]);

	return (
    <main className="py-2 my-5 w-full">

      {!isFeedbackSubmitted &&
        <article>
          <h2 className="font-semibold text-lg">Provide Your Feedback</h2>

          <div className="flex justify-between mb-7 mt-2">
            <button onClick={() => setFeedbackRating("highly unreliable")} className="hover:bg-custom-red-200 hover:text-white h-10 w-32 font-bold bg-white text-custom-red-200 border-2 border-custom-red-200">Highly Unreliable</button>
            <button onClick={() => setFeedbackRating("unreliable")} className="hover:bg-custom-red-100 hover:text-white h-10 w-32 font-bold bg-white text-custom-red-100 border-2 2 border-custom-red-100">Unreliable</button>
            <button onClick={() => setFeedbackRating("fairly unreliable")} className="hover:bg-custom-yellow hover:text-white h-10 w-32 font-bold bg-white text-custom-yellow border-2 2 border-custom-yellow">Fairly Unreliable</button>
            <button onClick={() => setFeedbackRating("reliable")} className="hover:bg-custom-green-100 hover:text-white h-10 w-32 font-bold bg-white text-custom-green-100 border-2 border-custom-green-100">Reliable</button>
            <button onClick={() => setFeedbackRating("highly reliable")} className="hover:bg-custom-green-200 hover:text-white h-10 w-32 font-bold bg-white text-custom-green-200 border-2 border-custom-green-200">Highly Reliable</button>
          </div>

          <form onSubmit={onFeedbackFormSubmit}>
            <fieldset className='flex flex-col space-y-1.5 w-full'>
              <label htmlFor="feedback-comment">Comment</label>
              <textarea 
                className="border border-solid border-gray-600 px-3 py-1.5 rounded"
                name="feedback-comment" 
                id="feedback-comment"
                cols={30} rows={10} 
                placeholder="Your comment..."
              />`
            </fieldset>

            <button 
              className="w-full bg-gradient-to-r from-custom-gradient-violet to-custom-gradient-indigo 
                      text-white py-3 cursor-pointer font-bold rounded" 
              type="submit" 
              value="Predict"
            > 
              Submit
            </button>
          </form>
        </article>
      } 

      {isFeedbackSubmitted &&
        <h2 className="font-semibold text-xl mb-5">Thank you for your Feedback!</h2>
      }

      {/* Expandable card for editing/viewing automatically collected data. */}
      <article className='px-4 bg-custom-purplish-gray-100'>
        {/* Card unexpanded (top section) */}
        <div className="flex flex-row items-center py-3 rounded">
          <h2 className="font-semibold  text-custom-indigo">View/Edit Auto-collected Data</h2>

          <div className='ml-auto flex flex-row items-center'>
            <button onClick={() => setIsOpen(true)}>
              <img className="ml-6" src={downArrowIndigo} alt="down arrow" />
            </button>
          </div>
        </div>

        {/* Card expanded (main section) */}
        <div>
          {isOpen && <ReliabilityAnalysisForm article={article} setArticle={setArticle} />}
        </div>
      </article>

      {/* Reliability analysis */}
      {chromeStorageLocalState.shouldShowReliabilityAnalysis && 
        <ReliabilityAnalysis />
      }
    </main>
	)
}

export default AutomaticPage;