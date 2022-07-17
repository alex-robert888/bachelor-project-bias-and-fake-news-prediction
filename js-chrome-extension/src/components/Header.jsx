import React from 'react';
import pinocchioLogo from '../assets/images/pinocchio-logo.svg';
import hamburgerMenuIcon from '../assets/images/hamburger-menu-icon.svg';


const Header = ({}) => {
	return (
    <header className="py-5 flex flex-row bg-white">
      <img src={pinocchioLogo} alt="pinocchio logo"/>
      <img className="ml-auto" src={hamburgerMenuIcon} alt="hamburger menu icon"/>
    </header>
	)
}

export default Header;