import React from 'react';
import './Sidebar.css';
import { useContext } from 'react';
import AuthContext from './Context/AuthProvider';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import goldenRetrieverIcon from './/images/golden_icon.png'

const Sidebar = ({ isOpen, toggleSidebar, getErrorMessage  }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  

  // Check if feature is enabled, set error if not
  const handleProfileClick = () => {
    if (checkAuthHelper()) {
      navigate("/profile")
    } else {
      getErrorMessage('Please login to use this feature');
    }
  }


  // Check if feature is enabled, set error if not
  const handleWalkHistoryClick = () => {
    if (checkAuthHelper()) {
      navigate("/walks");
    } else {
      getErrorMessage('Please login to use this feature');    
    }
  };

  const handleFamilyClick = () => {
    if (checkAuthHelper()) {
      navigate("/walks");
    } else {
      getErrorMessage('Please login to use this feature');    
    }
  }

  // authentication check helper
  function checkAuthHelper() {
    if (auth?.user) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <ul>
        <img src={goldenRetrieverIcon}></img>
        <li onClick={handleProfileClick}>My Profile</li>
        <li onClick={handleWalkHistoryClick}>Walk History</li>
        <li onClick={handleFamilyClick}>My Family</li>
      </ul>
    </div>
  );
};

export default Sidebar;