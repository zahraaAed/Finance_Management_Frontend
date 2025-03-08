import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Users.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  // Open & close modal functions
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role"); 
    if (userRole !== "superadmin") {
      navigate("/loginSuperAdmin");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4001/api/user/admin');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  // Delete admin user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No valid token found. Please log in again.");
          return;
        }

        await axios.delete(`http://localhost:4001/api/user/delete-admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Admin deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting admin:", error.response || error);
        toast.error("Failed to delete admin");
      }
    }
  };

  // Add new admin user
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await axios.post(
        'http://localhost:4001/api/user/add',
        { userName, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Response:', response); 
      if (response.status === 201) {
        toast.success("Admin added successfully");
        setUserName('');
        setEmail('');
        setPassword('');
        setShowModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="user-container">
      <h1>Admin Users</h1>
      
      <Button className="goal-button" variant="primary" onClick={handleShowModal}>
        Add Admin
      </Button>

      <table className="user-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user._id || user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddUser}>
            <input 
              type="text" 
              placeholder="User Name" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserTable;
