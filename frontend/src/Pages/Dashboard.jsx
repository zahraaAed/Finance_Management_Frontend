import React from "react";

function Dashboard() {
  // Logout function
  const logout = () => {
    // Remove the JWT from localStorage
    localStorage.removeItem("token");

   
    window.location.href = "/login"; // Example: redirect to login page
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", padding: "20px" }}>
      <header style={{ backgroundColor: "#607789", color: "white", padding: "20px", textAlign: "center" }}>
        <h1>Welcome to Your Dashboard!</h1>
      </header>

      <div style={{ margin: "20px" }}>
        <p>
          Your personalized dashboard gives you real-time insights and data analytics.
          Stay on top of your performance, track progress, and make data-driven decisions with ease.
        </p>
        <ul>
          <li><strong>Total Income & Expense:</strong> View your income trends over time.</li>
          <li><strong>Analytics:</strong> Dive into detailed reports and visualizations.</li>
         
        </ul>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#ff4c4c",
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
