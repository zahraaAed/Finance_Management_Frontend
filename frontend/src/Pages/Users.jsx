import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './Users.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the logged-in user is a superadmin
    const userRole = localStorage.getItem("role"); // e.g., "superadmin"
    if (userRole !== "superadmin") {
      // If not a superadmin, redirect to the login page
      navigate("/loginSuperAdmin");
    } else {
      // Otherwise, fetch users if the role is correct
      fetchUsers();
    }
  }, [navigate]);

  // Fetch users from the backend API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/admin');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
//delete
  const handleDelete = async (id) => {
    console.log("Attempting to delete admin with id:", id);
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem('token');
        
        console.log("Using token:", token);  // This should log a valid token
  
        if (!token) {
          toast.error("No valid token found. Please log in again.");
          return;
        }
  
        await axios.delete(`http://localhost:4000/api/user/delete-admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Admin deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting admin:", error.response || error);
        toast.error("Failed to delete admin");
      }
    }
  };
  
  return (
    <div className="user-container">
      <h1>Admin Users</h1>
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
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
