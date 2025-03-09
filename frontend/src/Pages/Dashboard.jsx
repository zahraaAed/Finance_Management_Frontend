import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      // Call the backend API to logout and invalidate the token
      const response = await fetch("http://localhost:4001/api/user/logout", {
        method: "POST", // Or GET if your backend uses it
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT in the header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      // Remove JWT from localStorage after successful logout
      localStorage.removeItem("token");

      // Show success toast
      toast.success("Successfully logged out!", {
        position: "top-right",
        autoClose: 2000, // Close after 2 seconds
      });

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login page
      }, 2000);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", padding: "20px" }}>
      <ToastContainer /> {/* Toast notifications */}
      
      <header style={{ backgroundColor: "#607789", color: "white", padding: "20px", textAlign: "center" }}>
        <h1>Welcome to Your Dashboard!</h1>
      </header>

      <div style={{ margin: "20px" }}>
        <p>
          Your personalized dashboard gives you real-time insights and data analytics.
          Stay on top of your performance, track progress, and make data-driven decisions with ease.
        </p>
        <ul>
          <li><strong>Total Income:</strong> View your income trends over time.</li>
          <li><strong>Analytics:</strong> Dive into detailed reports and visualizations.</li>
          <li><strong>Settings:</strong> Customize your preferences for a better experience.</li>
        </ul>

        <button
          onClick={logout}
          style={{
            backgroundColor: " #d9534f",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
