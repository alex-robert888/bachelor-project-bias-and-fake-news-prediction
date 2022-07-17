import React from 'react';
import PercentageTag from '../PercentageTag';
import DropdownContainer from '../DropdownContainer';
import BiasedLanguageAnalysis from './BiasedLanguageAnalysis';


const ReliabilityAnalysis: React.FC<{}> = ({}) => {
	return (
    <section>
      <div className="flex flex-row items-center">
        <h1 className="text-2xl mr-3 font-bold">Reliability Score:</h1>
        <PercentageTag value={88} size="large" isLoading />
      </div>

      <ul className="mt-6 space-y-4">
        <li>
          <BiasedLanguageAnalysis />
        </li>

        <li>
          <DropdownContainer title="Source Reliability" percentage={100}>
            <></>
          </DropdownContainer>
        </li>
        
        <li>
          <DropdownContainer title="URL Reliability" percentage={66}>
            <></>
          </DropdownContainer>
        </li>

        <li>
          <DropdownContainer title="Cited Sources" percentage={33}>
            <></>
          </DropdownContainer>
        </li>
      </ul>
    </section>
	)
}

export default ReliabilityAnalysis;