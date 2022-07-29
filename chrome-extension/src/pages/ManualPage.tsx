import React, { useContext, useEffect } from 'react';
import ManualForm from '../components/ManualForm';
import AppContext from '../AppContext';
import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';

const ManualPage: React.FC<{}> = ({}) => {
  const [state, setState] = useChromeStorageLocalState();

  function renderReliabilityAnalysis() {
    if (!state.shouldShowReliabilityAnalysis)
      return null;
    
    return (
      <div className="mt-10">
        <ReliabilityAnalysis />
      </div>
    )      
  }

	return (
    <main id="manual-page" className="py-2 my-5 w-full">
      <ManualForm />

      {renderReliabilityAnalysis()}
    </main>
	)
}

export default ManualPage;