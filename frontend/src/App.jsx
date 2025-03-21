import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import LoginSuperAdmin from './Auth/LoginSuperAdmin';
import Users from './Pages/Users/Users';
import SidebarLayout from './Components/sideBarLayout';
import FixedIncomes from './Pages/fixedincome/fixedincome';
import CategoryManager from './Pages/categories/category';
import ReportChart from './Pages/Report/ReportChart';
import Goals from './Pages/ProfitGoals/Goals';
import ProfitGoalsPieChart from './Components/GoalsChart';

import Dashboard from './Pages/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<LoginSuperAdmin />} />
          
          <Route element={<SidebarLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path='/report' element={<ReportChart/>}/>
            <Route path='/fixedincome' element={<FixedIncomes/>}/>
            <Route path='/categories' element={<CategoryManager/>}/>
            <Route path='/goals' element={<Goals/>}/>
            <Route path='/chart' element={<ProfitGoalsPieChart/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
      
          </Route>
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
