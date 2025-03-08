import React from 'react';
import { Outlet } from 'react-router-dom';  // To render nested routes
import SideBar from './Sidebar';
import './sideBarLayout.css';

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout" style={{ display: 'flex' }}>
      <SideBar /> 
      
      <div className="content">
        {/* Outlet will render the child route components */}
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
