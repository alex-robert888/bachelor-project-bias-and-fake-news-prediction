import React from 'react';
import manualIcon from '../assets/images/manual-icon.svg';
import pinocchioIcon from '../assets/images/pinocchio-icon.svg';
import automaticIcon from '../assets/images/automatic-icon.svg';
import selectionIcon from '../assets/images/selection-icon.svg';

const Toolbar = ({}) => {
	return (
		<aside className="flex flex-col bg-custom-gray h-full fixed top-0 left-0 px-2">
		<section className="py-3 flex flex-row justify-center">
			<img className="w-10" src={pinocchioIcon} alt="pinocchio icon"/>
		</section>
		
		<section className="my-5 flex flex-col font-bold">            
			<ul className="flex flex-col items-center space-y-5 my-3">
				<li>
					<button className="flex flex-col items-center">
						<img className="w-5" src={automaticIcon} alt="automatic icon"/>
						<span className="text-custom-indigo font-normal">Automatic</span>
					</button>
				</li>

				<li>
					<button className="flex flex-col items-center">
						<img className="w-5" src={selectionIcon} alt="selection icon"/>
						<span className="text-custom-indigo font-normal">Selection</span>
					</button>
				</li>

				<li>
					<button className="flex flex-col items-center">
						<img className="w-5" src={manualIcon} alt="manual icon"/>
						<span className="text-custom-indigo font-normal">Manual</span>
					</button>
				</li>
			</ul>
		</section>
	</aside>
	)
}

export default Toolbar;