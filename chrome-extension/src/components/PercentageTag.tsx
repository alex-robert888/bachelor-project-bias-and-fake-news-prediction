import React, { useEffect, useState } from 'react';
import './PercentageTag.css'

type PercentageTagProps = {
  value: number | undefined,
  size: 'small' | 'large',
}

const PercentageTag: React.FC<PercentageTagProps> = (props) => {
  /* Get the background color of the tag based on how large is the percentage value */
  function getBackgroundColor() {
    if (props == null || props.value === undefined) {
      return "bg-gradient-to-r from-custom-gradient-violet to-custom-gradient-indigo";
    } else if (props.value <= 33) {
      return "bg-custom-red";
    } else if (props.value <= 66) {
      return "bg-custom-yellow";
    } else {
      return "bg-custom-green";
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
    if (props == null || props.value === undefined) {
      return (<div className="ml-3 dot-typing"></div>)
    }
    return (<span className={`text-white ${fontSize} font-bold`}>{props.value}%</span>)
  }
  
  const backgroundColor = getBackgroundColor();
  const [width, height, fontSize] = getSizes();

	return (
    <article className={`${backgroundColor} ${width} ${height} flex justify-center items-center rounded`}>
      {renderTagContent()}
    </article>
	)
}

export default PercentageTag;


