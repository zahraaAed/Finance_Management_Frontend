import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import LoginSuperAdmin from './Auth/LoginSuperAdmin';
import SideBar from './Components/Sidebar';
import FixedIncomes from './Components/fixedincome';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loginSuperAdmin" element={<LoginSuperAdmin />} />
          <Route path="/sidebar" element={<SideBar />} />
          <Route path="/sidebar/income/fixed" element={<FixedIncomes/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
