import React from 'react';
import manualIcon from '../assets/images/manual-icon.svg';
import pinocchioIcon from '../assets/images/pinocchio-icon.svg';
import automaticIcon from '../assets/images/automatic-icon.svg';
import useChromeStorageLocalState from '../hooks/useChromeStorageLocalState';
import TPage from '../types/t-page';


type TToolbarProps = {
	activePage: TPage,
	changeActivePage: (page: TPage) => void
}

const Toolbar: React.FC<TToolbarProps> = (props) => {
	function setPageButtonBg(page: TPage) {
		return page === props.activePage ? 'bg-custom-purplish-gray-300' : '';
	}

	return (
		<aside className="flex flex-col bg-custom-purplish-gray-100 h-full w-toolbar fixed top-0 left-0 items-center">
			<section className="py-3 flex flex-row justify-center">
				<img className="w-10" src={pinocchioIcon} alt="pinocchio icon"/>
			</section>
			
			<section className="my-5 flex flex-col font-bold w-full">            
				<ul className="flex flex-col items-center w-full">
					<li className={`${setPageButtonBg(TPage.Automatic)} hover:bg-custom-purplish-gray-200 w-full flex justify-center py-3`}>
						<button 
							className="flex flex-col items-center" 
							onClick={() => props.changeActivePage(TPage.Automatic)}
						>
							<img className="w-5" src={automaticIcon} alt="automatic icon"/>
							<span className="text-custom-indigo font-normal">Automatic</span>
						</button>
					</li>

					<li className={`${setPageButtonBg(TPage.Manual)} hover:bg-custom-purplish-gray-200 w-full flex justify-center py-3`}>
						<button 
							className="flex flex-col items-center w-full"
							onClick={() => props.changeActivePage(TPage.Manual)}
						>
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