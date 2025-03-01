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
      const response = await axios.post("http://localhost:4000/api/login/createUser", formData);
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
      <section className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <img className="signup-logo" src={signupLogo} alt="Signup" />
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
