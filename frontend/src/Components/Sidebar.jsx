import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faChartBar, faBullseye, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleIncomeDropdown = () => {
    setIsIncomeOpen(!isIncomeOpen);
  };

  const toggleExpenseDropdown = () => {
    setIsExpenseOpen(!isExpenseOpen);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`} aria-label="Sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
       
          <p className="sidebar-logo-text">Dashboard</p>
      
          {/* Burger Menu for Mobile */}
          <button className="burger-btn" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
      </div>

      {/* Sidebar Links */}
      <div className="sidebar-links">
        <ul className="sidebar-list">
          {/* User */}
          <li className="sidebar-item">
            <span>
            <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
              <span>User</span>
            </span>
          </li>

          {/* Reports */}
          <li className="sidebar-item">
            <span>
            <FontAwesomeIcon icon={faChartBar} className="sidebar-icon" />
             <Link to="/report"> <span>Reports</span></Link>
            </span>
          </li>

          {/* Profit Goals */}
          <li className="sidebar-item">
            <span>
            <FontAwesomeIcon icon={faBullseye} className="sidebar-icon" />
              <span>Profit Goals</span>
            </span>
          </li>

          {/* Income Dropdown */}
          <li className={`sidebar-item ${isIncomeOpen ? 'active' : ''}`} onClick={toggleIncomeDropdown}>
            <div className="dropdown-list">
              <span className="dropdown-item">
              <FontAwesomeIcon icon={faArrowUp} className="sidebar-icon" />
                <span className="sidebar-text">
                  <span>Income</span>

                  <svg className="sidebar-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </span>
              {isIncomeOpen && (
                <ul className="dropdown">
                  <li>
                    <Link to="income/fixed" className="sidebar-item">Fixed Transactions</Link>
                  </li>
                  <li>
                    <Link to="income/recurring" className="sidebar-item">Recurring Transactions</Link>
                  </li>
                </ul>
              )}
            </div>
          </li>

          {/* Expense Dropdown */}
          <li className={`sidebar-item ${isExpenseOpen ? 'active' : ''}`} onClick={toggleExpenseDropdown}>
            <div className="dropdown-list">
              <span className="dropdown-item">
              <FontAwesomeIcon icon={faArrowDown} className="sidebar-icon" />
                <span className="sidebar-text">
                <span>Expense</span>
              
              <svg className="sidebar-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
              </span>
              </span>
               {isExpenseOpen && (
                 <ul className="dropdown">
              <li>
                <Link to="expense/fixed" className="sidebar-item">Fixed Transactions</Link>
              </li>
              <li>
                <Link to="expense/recurring" className="sidebar-item">Recurring Transactions</Link>
              </li>
            </ul>
          )}
      </div>
    </li>
        </ul >
      </div >
    </aside >
  );
};

export default Sidebar;
