import React, { useEffect, useState } from 'react';
import PercentageTag from '../PercentageTag';
import downArrow from '../../assets/images/down-arrow.svg';

type TPropsReliabilityAnalysisCard = {
  title: string,
  percentage: number | 'loading' | 'N/A',
  children: JSX.Element
}

const ReliabilityAnalysisCard: React.FC<TPropsReliabilityAnalysisCard> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
    <article className='shadow-custom px-4'>
      {/* Dropdown title section */}
      <div className="flex flex-row items-center py-3 rounded">
        <h2 className="font-semibold">{props.title}</h2>

        <div className='ml-auto flex flex-row items-center'>
          <PercentageTag value={props.percentage} size="small" />

          <button onClick={() => setIsOpen(true)}>
            <img className="ml-6" src={downArrow} alt="down arrow" />
          </button>
        </div>
      </div>

      {/* Dropdown content */}
      <div>
        {isOpen && props.children}
      </div>
    </article>
	)
}

export default ReliabilityAnalysisCard;