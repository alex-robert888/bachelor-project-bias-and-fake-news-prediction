import React from 'react';
import PercentageTag from '../PercentageTag';
import ReliabilityAnalysisCard from './ReliabilityAnalysisCard';
import useChromeStorageLocalState from '../../hooks/useChromeStorageLocalState';


const ReliabilityAnalysis: React.FC<{}> = ({}) => {
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState(); 

	return (
    <section className="mt-10">
      {/* Reliability score top section */}
      <div id="reliability-analysis-header" className="flex flex-row items-center">
        <h1 className="text-2xl mr-3 font-bold">Reliability Score:</h1>
        <PercentageTag value={88} size="large" />
      </div>

      {/* List of cards for each individual point of analysis */}
      <ul className="mt-6 space-y-4">
        <li>
          <ReliabilityAnalysisCard 
            title="Biased/Deceptive Language"
            percentage={chromeStorageLocalState.biasedOrDeceptiveLanguage.score}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>

        <li>
          <ReliabilityAnalysisCard 
            title="Source Reliability" 
            percentage={chromeStorageLocalState.sourceReliability.score}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>
        
        <li>
          <ReliabilityAnalysisCard 
            title="URL Reliability" 
            percentage={chromeStorageLocalState.urlReliabilityScore}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>

        <li>
          <ReliabilityAnalysisCard 
            title="Cited Sources" 
            percentage={chromeStorageLocalState.citedSourcesReliability}
          >
            <></>
          </ReliabilityAnalysisCard>
        </li>
      </ul>
    </section>
	)
}

export default ReliabilityAnalysis;