import axios from 'axios';
import React, { useState, useEffect } from 'react';
import downArrowIndigo from '../assets/images/down-arrow-indigo.svg';
import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';
import ReliabilityAnalysisForm from '../components/reliability-analysis/ReliabilityAnalysisForm';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import useReliabilityAnalysis from '../hooks/useReliabilityAnalysis';
import TArticle from '../types/t-article';

type TScrapeArticleApiResponse = {
  authors: Array<string>,
  title: string,
  text: string
};

const AutomaticPage: React.FC<{}> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState();
  const [article, setArticle] = useState<TArticle>({
    url: '', title: '', content: '', authors: []
  });
  const runReliabilityAnalysis = useReliabilityAnalysis();
  
  useEffect(() => {
    if (!chromeStorageLocalState.isAnalysisInProgress) return;

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