import React, { useEffect, useState } from 'react';
import './PercentageTag.css'
import ReactTooltip from 'react-tooltip';


type PercentageTagProps = {
  value: number | 'loading' |'N/A',
  size: 'small' | 'large',
}

const PercentageTag: React.FC<PercentageTagProps> = (props) => {
  /* Get the background color of the tag based on how large is the percentage value */
  function getBackgroundColor() {
    if (props.value === 'loading') {
      return "bg-gradient-to-r from-custom-gradient-violet to-custom-gradient-indigo";
    } else if (props.value === 'N/A') {
      return 'bg-custom-gray';
    } else if (props.value <= 20) {
      return "bg-custom-red-200";
    } else if (props.value <= 40) {
      return "bg-custom-red-100";
    } else if (props.value <= 60) {
      return "bg-custom-yellow";
    } else if (props.value <= 80) {
      return "bg-custom-green-100"
    } else {
      return "bg-custom-green-200";
    }
  }

  /* Get width, height and font-size of the tag based on the size prop */
  function getSizes() {
    if (props.size === 'small') {
      return ["w-12", "h-7", "text-sm"]
    } else {
      return ["w-16", "h-8", "text-lg"];
    }
  }

  function renderTagContent() {
    if (props.value === 'loading') {
      return <div className="ml-3 dot-typing"></div>
    } else if (props.value === 'N/A') {
      return <span className={`text-white font-bold bg-custom-gray`}>N/A</span>
    }
    return <span className={`text-white ${fontSize} font-bold`}>{props.value}%</span>
  }
  
  const getTitle = () => {
    if (props.value === 'loading' || props.value === 'N/A') {
      return '';
    } else if (props.value <= 20) {
      return "Highly Unreliable";
    } else if (props.value <= 40) {
      return "Unreliable";
    } else if (props.value <= 60) {
      return "Fairly Unreliable";
    } else if (props.value <= 80) {
      return "Reliable"
    } else {
      return "Highly Reliable";
    }
  }

  const backgroundColor = getBackgroundColor();
  const [width, height, fontSize] = getSizes();

	return (
    <article 
      className={`${backgroundColor} ${width} ${height} flex justify-center items-center rounded`}
      data-tip={getTitle()}
    >
      {renderTagContent()}
      <ReactTooltip /> 
    </article>
	)
}

export default PercentageTag;


