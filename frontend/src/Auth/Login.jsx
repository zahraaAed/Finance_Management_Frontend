import React, { useState } from 'react';
import loginLogo from '../assets/loginLogo.svg';
import emailLogo from '../assets/emailLogo.svg';
import passwordLogo from '../assets/passwordLogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import './Login.css'; // Import the external CSS file

const Login = () => {
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
      const response = await axios.post('http://localhost:4000/api/login/signin', formData);
      console.log("Login response:", response.data); 
      localStorage.setItem("token", response.data.accessToken);
      toast.success('Login successful');
      navigate('/dashboard'); // Redirect to the dashboard or home page after successful login
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
          <div className="login-logo">
          <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M77.6192 24.5735L47.2154 11.0527C46.9916 10.9474 46.7473 10.8929 46.5 10.8929C46.2527 10.8929 46.0084 10.9474 45.7846 11.0527L15.3808 24.5735C15.0664 24.7106 14.7981 24.9353 14.6078 25.2207C14.4175 25.506 14.3134 25.8401 14.3077 26.1831V35.7692C14.3077 53.3677 24.8238 74.6861 45.8561 82.0546C46.2737 82.1963 46.7263 82.1963 47.1438 82.0546C68.1761 74.6861 78.6923 53.3677 78.6923 35.7692V26.1831C78.6866 25.8401 78.5824 25.506 78.3922 25.2207C78.2019 24.9353 77.9336 24.7106 77.6192 24.5735ZM63.2686 36.4131L44.3824 60.4572C44.1079 60.8038 43.7635 61.0887 43.3715 61.2933C42.9795 61.4979 42.5489 61.6176 42.1075 61.6447L41.9215 61.6518C41.0899 61.6504 40.2926 61.3199 39.7038 60.7326L29.9746 51.0033C29.3879 50.4152 29.0588 49.618 29.0598 48.7872C29.0608 47.9564 29.3918 47.1601 29.98 46.5733C30.5681 45.9866 31.3653 45.6575 32.1961 45.6585C33.0269 45.6595 33.8232 45.9905 34.41 46.5787L41.6425 53.8112L58.3468 32.5464C58.869 31.9206 59.6145 31.5229 60.4251 31.4377C61.2357 31.3525 62.0476 31.5866 62.6885 32.0902C63.3294 32.5938 63.7489 33.3273 63.8578 34.135C63.9668 34.9428 63.7567 35.7612 63.2722 36.4166L63.2686 36.4131Z" fill="#F4D03F"/>
</svg>
</div>

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

export default Login;
