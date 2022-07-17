import React from 'react';
import PercentageTag from './PercentageTag';
import downArrow from '../assets/images/down-arrow.svg';

const DropdownContainer = (props) => {
	return (
    <article className='shadow-custom px-4'>
      {/* Dropdown title section */}
      <div className="flex flex-row items-center py-3 rounded">
        <h2 className="font-bold">{props.title}</h2>

        <div className='ml-auto flex flex-row items-center'>
          <PercentageTag value={props.percentage} size="small" isLoading />
          <button>
            <img className="ml-6" src={downArrow} alt="down arrow" />
          </button>
        </div>
      </div>

      {/* Dropdown content */}
      <div>
        {props.children}
      </div>
    </article>
	)
}

export default DropdownContainer;