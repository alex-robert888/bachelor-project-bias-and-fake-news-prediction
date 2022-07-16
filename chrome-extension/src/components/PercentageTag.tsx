import React from 'react';

type PercentageTagProps = {
  value: number,
  size: 'small' | 'large'
}

const PercentageTag: React.FC<PercentageTagProps> = (props) => {
  /* Get the background color of the tag based on how large is the percentage value */
  function getBackgroundColor() {
    if (props.value <= 33) {
      return "bg-custom-red";
    } else if (props.value <= 66) {
      return "bg-custom-yellow";
    } else {
      return "bg-custom-green";
    }
  }

  function getSizes() {
    /* Get width, height and font-size of the tag based on the size prop */
    if (props.size === 'small') {
      return ["w-12", "h-7", "text-sm"]
    } else {
      return ["w-16", "h-8", "text-lg"];
    }
  }
  
  const backgroundColor = getBackgroundColor();
  const [width, height, fontSize] = getSizes();

	return (
    <article className={`${backgroundColor} ${width} ${height} flex justify-center items-center rounded`}>
      <span className={`text-white ${fontSize} font-bold`}>{props.value}%</span>
    </article>
	)
}

export default PercentageTag;