import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import handleErrors from '../utils/handleErrors';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';
import type TArticle from '../types/t-article';
import ReliabilityAnalysisForm from '../components/reliability-analysis/ReliabilityAnalysisForm';


const ManualPage: React.FC<{}> = ({}) => {
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState();
  const [article, setArticle] = useState<TArticle>({
    url: '', title: '', content: '', authors: []
  })

	return (
    <main id="manual-page" className="py-2 my-5 w-full">
      <ReliabilityAnalysisForm article={article} setArticle={setArticle} />

      {chromeStorageLocalState.shouldShowReliabilityAnalysis && 
        <ReliabilityAnalysis />
      }
    </main>
	)
}

export default ManualPage;