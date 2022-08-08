import React from 'react';
import downArrowFilled from '../assets/images/down-arrow-filled.svg';

const AutomaticPage: React.FC<{}> = ({}) => {
	return (
    <main className="py-2 my-5 w-full">
      <article>
        <span className="text-custom-indigo text-base flex items-center underline cursor-pointer">
          <img className="mr-1 w-3" src={downArrowFilled} alt="down arrow" />
          View/Edit Auto-Collected Data
        </span>
      </article>
    </main>
	)
}

export default AutomaticPage;