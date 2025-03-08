import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FixedIncomes.css";

const FixedIncomes = () => {
  const [fixedIncomes, setFixedIncomes] = useState([]);

  useEffect(() => {
    fetchFixedIncomes();
  }, []);

  const fetchFixedIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/fixed-expenses");
      setFixedIncomes(response.data.data); // Fix: Extract data correctly
    } catch (error) {
      console.error("Error fetching fixed incomes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/fixed-incomes/${id}`);
      setFixedIncomes(fixedIncomes.filter((income) => income.id !== id));
    } catch (error) {
      console.error("Error deleting fixed income:", error);
    }
  };

  return (
    <div className="fixed-incomes-container">
      <h2>Fixed Incomes</h2>
      <ul>
        {fixedIncomes.length > 0 ? (
          fixedIncomes.map((income) => (
            <li key={income.id} className="fixed-income-item">
              <div>
                <h3>{income.title}</h3>
                <p>{income.description}</p>
                <p>Amount: {income.amount} {income.currency}</p>
                <p>Category: {income.Category?.name || "No Category"}</p>
                <p>Date: {new Date(income.date).toLocaleDateString()}</p>
              </div>
              <div>
                <button onClick={() => handleDelete(income.id)} className="delete-btn">Delete</button>
                <button className="update-btn">Update</button>
              </div>
            </li>
          ))
        ) : (
          <p>No fixed incomes available.</p>
        )}
      </ul>
    </div>
  );
};

export default FixedIncomes;
