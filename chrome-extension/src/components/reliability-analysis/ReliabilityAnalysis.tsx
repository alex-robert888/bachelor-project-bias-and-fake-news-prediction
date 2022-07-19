import React from 'react';
import PercentageTag from '../PercentageTag';
import DropdownContainer from '../DropdownContainer';
import useChromeStorageLocalState from '../../hooks/useChromeStorageLocalState';


const ReliabilityAnalysis: React.FC<{}> = ({}) => {
  const [chromeStorageLocalState, setChromeStorageLocalState] = useChromeStorageLocalState(); 

	return (
    <section>
      <div className="flex flex-row items-center">
        <h1 className="text-2xl mr-3 font-bold">Reliability Score:</h1>
        <PercentageTag value={88} size="large" />
      </div>

      <ul className="mt-6 space-y-4">
        <li>
          <DropdownContainer title="Biased/Deceptive Language" percentage={chromeStorageLocalState.biasedOrDeceptiveLanguageScore}>
            <></>
          </DropdownContainer>
        </li>

        <li>
          <DropdownContainer title="Source Reliability" percentage={chromeStorageLocalState.sourceReliabilityScore}>
            <></>
          </DropdownContainer>
        </li>
        
        <li>
          <DropdownContainer title="URL Reliability" percentage={chromeStorageLocalState.urlReliabilityScore}>
            <></>
          </DropdownContainer>
        </li>

        <li>
          <DropdownContainer title="Cited Sources" percentage={chromeStorageLocalState.citedSourcesReliability}>
            <></>
          </DropdownContainer>
        </li>
      </ul>
    </section>
	)
}

export default ReliabilityAnalysis;