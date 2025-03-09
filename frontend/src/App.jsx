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
import FixedExpenses from './Pages/fixedexpense/fixedexpense';
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
            <Route path="/users" element={<Users />} />
            <Route path='/report' element={<ReportChart/>}/>
            <Route path='/fixedincome' element={<FixedIncomes/>}/>
            <Route path='/fixedexpense' element={<FixedExpenses/>}/>
            <Route path='/categories' element={<CategoryManager/>}/>
            <Route path='/goals' element={<Goals/>}/>
            <Route path='/chart' element={<ProfitGoalsPieChart/>}/>
            <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
