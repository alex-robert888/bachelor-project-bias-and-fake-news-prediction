import React from 'react';
import PercentageTag from '../PercentageTag';
import ReliabilityAnalysisCard from './ReliabilityAnalysisCard';
import useChromeStorageLocalState from '../../hooks/useChromeStorageLocalState';


const ReliabilityAnalysis: React.FC<{}> = ({}) => {
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState(); 

  const getPercentageTagValue = (score: number) => {
    if (score !== undefined) return score;
        
    return (chromeStorageLocalState.isAnalysisInProgress) ? 'loading' : 'N/A';
  }

	return (
    <section className="mt-10">
      {/* Reliability score top section */}
      <div id="reliability-analysis-header" className="flex flex-row items-center">
        <h1 className="text-2xl mr-3 font-bold">Reliability Score:</h1>
        <PercentageTag value={getPercentageTagValue(chromeStorageLocalState.analysisTotalScore)} size="large" />
      </div>

      {/* List of cards for each individual point of analysis */}
      <ul className="mt-6 space-y-4">
        <li>
          <ReliabilityAnalysisCard 
            title="Biased/Deceptive Language"
            percentage={getPercentageTagValue(chromeStorageLocalState.analysisItems.biasedLanguage.score)}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>

        <li>
          <ReliabilityAnalysisCard 
            title="Source Reliability" 
            percentage={getPercentageTagValue(chromeStorageLocalState.analysisItems.sourceReliability.score)}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>

        <li>
          <ReliabilityAnalysisCard 
            title="Headline Clickbait" 
            percentage={getPercentageTagValue(chromeStorageLocalState.analysisItems.headlineClickbait.score)}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>
        
        <li>
          <ReliabilityAnalysisCard 
            title="URL Reliability" 
            percentage={getPercentageTagValue(chromeStorageLocalState.analysisItems.urlReliability.score)}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>

        <li>
          <ReliabilityAnalysisCard 
            title="Cited Sources" 
            percentage={getPercentageTagValue(chromeStorageLocalState.analysisItems.citedSources.score)}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>
      </ul>
    </section>
	)
}

export default ReliabilityAnalysis;