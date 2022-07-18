import React, { useEffect } from 'react';
import ManualForm from '../components/ManualForm';
import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';


const ManualPage: React.FC<{}> = ({}) => {
  function renderReliabilityAnalysis() {
    // console.log(shouldShowReliabilityAnalysis)
    return null;
    // return !shouldShowReliabilityAnalysis ? null : (
    //   <div className="mt-10">
    //     <ReliabilityAnalysis />
    //   </div>
    // )      
  }

	return (
    <main className="py-2 my-5 w-full">
      <ManualForm />

      {renderReliabilityAnalysis()}
    </main>
	)
}

export default ManualPage;