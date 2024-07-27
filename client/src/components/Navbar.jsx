import React from 'react';
import logo from '../images/logo.png';
import logoutIcon from '../images/logout.svg';

const Navbar = () => {
  return (
    <header>
      <div className="header-content">
            <img src={logo} alt="Logo" className="logo"/>
            <h1 className="navbar-text">HOSTEL ALLOTMENT</h1>
            <button className="logout-btn">
                <img src={logoutIcon} alt="LOGOUT"/>
                LOGOUT
            </button>
        </div>
    </header>
  );
};

export default Navbar;
