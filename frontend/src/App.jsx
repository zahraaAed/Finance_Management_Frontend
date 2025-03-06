import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import LoginSuperAdmin from './Auth/LoginSuperAdmin';
import Users from './Pages/Users';
import SidebarLayout from './Components/sideBarLayout';
import ReportChart from './Pages/ReportChart';
import FixedIncomes from './Components/fixedincome';
import CategoryManager from './Components/category';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loginSuperAdmin" element={<LoginSuperAdmin />} />
          <Route element={<SidebarLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path='/report' element={<ReportChart/>}/>
            <Route path='/fixedincome' element={<FixedIncomes/>}/>
            <Route path='/categories' element={<CategoryManager/>}/>

          </Route>
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
