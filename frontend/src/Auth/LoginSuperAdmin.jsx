import React, { useState } from 'react';
import loginLogo from '../assets/loginLogo.svg';
import emailLogo from '../assets/emailLogo.svg';
import passwordLogo from '../assets/passwordLogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import './Login.css'; // Import the external CSS file

const LoginSuperAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/login/signin/superadmin', formData);
      console.log("Login response:", response.data); 
     
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("role", response.data.role); 
    
      toast.success('Login successful');
      navigate('/users'); // Redirect to the dashboard or home page after successful login
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={4000}
        limit={4}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <img className="login-logo" src={loginLogo} alt="Login" />
          <div className="input-container">
            <img src={emailLogo} alt="email" />
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <img src={passwordLogo} alt="password" />
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="signup-link">
            New user?{' '}
            <Link className="signup-text-link" to="/signup">
             Create an account
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default LoginSuperAdmin;
