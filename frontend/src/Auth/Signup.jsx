import React, { useState } from 'react';
import signupLogo from '../assets/signupLogo.svg';
import usernameLogo from '../assets/usernameLogo.svg';
import passwordLogo from '../assets/passwordLogo.svg';
import emailLogo from '../assets/emailLogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import './Signup.css'; // Import the CSS file for custom styles

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
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
      const response = await axios.post("http://localhost:4001/api/login/createUser", formData);
      toast.success('Account created successfully');
      navigate('/login');  // Redirect to login page after successful signup
    } catch (error) {
      toast.error('Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={4001}
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
      <section className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-logo">
        <svg width="93" height="71" viewBox="0 0 93 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M59.1818 44.375C47.895 44.375 25.3636 50.2769 25.3636 62.125V71H93V62.125C93 50.2769 70.4686 44.375 59.1818 44.375ZM21.1364 26.625V13.3125H12.6818V26.625H0V35.5H12.6818V48.8125H21.1364V35.5H33.8182V26.625M59.1818 35.5C63.6664 35.5 67.9673 33.6299 71.1383 30.3011C74.3094 26.9724 76.0909 22.4576 76.0909 17.75C76.0909 13.0424 74.3094 8.52762 71.1383 5.19885C67.9673 1.87008 63.6664 0 59.1818 0C54.6972 0 50.3964 1.87008 47.2253 5.19885C44.0542 8.52762 42.2727 13.0424 42.2727 17.75C42.2727 22.4576 44.0542 26.9724 47.2253 30.3011C50.3964 33.6299 54.6972 35.5 59.1818 35.5Z" fill="#F4D03F"/>
</svg>

  </div>

          <div className="input-container">
            <img src={usernameLogo} alt="Username" />
            <input
              className="input-field"
              type="text"
              name="userName"
              placeholder="USERNAME"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <img src={emailLogo} alt="Email" />
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
            <img src={passwordLogo} alt="Password" />
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
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
          <p className="signup-text">
        
            Already have an account?
            <Link className="signup-link" to="/login">
              Sign in
            </Link>
         
          </p>
        </form>
      </section>
    </>
  );
};

export default Signup;
