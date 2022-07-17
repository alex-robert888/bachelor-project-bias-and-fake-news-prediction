import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ManualForm from '../components/ManualForm';
// import { selectShouldShowReliabilityAnalysis } from '../../public/store/reliabilityAnalysisSlice';
// import ReliabilityAnalysis from '../components/reliability-analysis/ReliabilityAnalysis';


const ManualPage = ({}) => {
  // const shouldShowReliabilityAnalysis = useSelector((state: any) => state.shouldShowReliabilityAnalysis);
  // const shouldShowReliabilityAnalysis = false;
  
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