import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PrivateRoute from './Auth/privateRoute';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<LoginSuperAdmin />} />
          
          {/* Private Routes (Protected Routes) */}
          <Route element={<SidebarLayout />}>
            <Route path="/users" element={<PrivateRoute element={Users} />} />
            <Route path='/report' element={<PrivateRoute element={ReportChart} />} />
            <Route path='/fixedincome' element={<PrivateRoute element={FixedIncomes} />} />
            <Route path='/categories' element={<PrivateRoute element={CategoryManager} />} />
            <Route path='/goals' element={<PrivateRoute element={Goals} />} />
            <Route path='/chart' element={<PrivateRoute element={ProfitGoalsPieChart} />} />
            <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
