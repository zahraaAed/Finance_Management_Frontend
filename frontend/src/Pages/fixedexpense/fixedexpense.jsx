import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const FixedIncomes = () => {
  const [fixedIncomes, setFixedIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profitGoals, setProfitGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    amount: "",
    currency: "USD",
    categoryId: "",
    profitGoalId: "",
    createdDate: ""
  });

  useEffect(() => {
    fetchFixedIncomes();
    fetchCategories();
    fetchProfitGoals();
  }, []);

  const fetchFixedIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/fixedexpense/fixed-expenses");
      setFixedIncomes(response.data.data);
    } catch (error) {
      console.error("Error fetching fixed incomes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/category/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProfitGoals = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/profitGoal/get/all");
      setProfitGoals(response.data);
    } catch (error) {
      console.error("Error fetching profit goals:", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
  
    const selectedDate = new Date(formData.createdDate);
    const today = new Date();
  
    // Normalize both selected date and today's date to remove time part
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    // Check if the selected date is in the future (strictly after today)
    if (selectedDate > today) {
      alert("Created Date cannot be in the future.");
      return;
    }
  
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4001/api/fixedIncome/fixed-income/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:4001/api/fixedIncome/addfixed-incomes", formData);
      }
      setShowModal(false);
      fetchFixedIncomes();
    } catch (error) {
      console.error("Error saving fixed income:", error);
    }
  };

  const handleEdit = (income) => {
    setFormData({
      id: income.id,
      title: income.title,
      description: income.description,
      amount: income.amount,
      currency: income.currency,
      categoryId: income.categoryId,
      profitGoalId: income.profitgoalId, // Set the profit goal ID here
      createdDate: new Date(income.createdAt).toISOString().split("T")[0],
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fixed income?")) {
      try {
        await axios.delete(`http://localhost:4001/api/fixedExpense/fixed-expenses/${id}`);
        fetchFixedIncomes();
      } catch (error) {
        console.error("Error deleting fixed income:", error);
      }
    }
  };

  return (
    <div className="fixed-incomes-container">
      <div className="fixed-incomes-title">
        <h1>Fixed expenses</h1>
        <Button className="add-btn" variant="primary" onClick={() => {
          setShowModal(true); // Show the modal
          setIsEditing(false); // Set editing mode to false (for adding)
          // Reset formData to its initial state when adding
          setFormData({
            id: null,
            title: "",
            description: "",
            amount: "",
            currency: "USD",
            categoryId: "",
            profitGoalId: "",
            createdDate: "",
          });
        }}>
          Add
        </Button>
      </div>
      <table className="fixed-incomes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Profit Goal</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fixedIncomes.length > 0 ? (
            fixedIncomes.map((income) => (
              <tr key={income.id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{income.amount}</td>
                <td>{income.currency}</td>
                <td>{categories.find((cat) => cat.id === income.categoryId)?.name || "No Category"}</td>
                <td>{profitGoals.find((goal) => goal.id === income.profitGoalId)?.goalName || "No Profit Goal"}</td>
                <td>{new Date(income.createdAt).toLocaleDateString()}</td>
                <td className="actions-column">
                  <Button variant="warning" onClick={() => handleEdit(income)} className="update-btn">Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(income.id)} className="delete-btn">Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No fixed expenses available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Update Fixed Income" : "Add Fixed Income"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddOrUpdate}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <input
              type="date"
              value={formData.createdDate}
              onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              required
            />
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="LBP">LBP</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Profit Goal Dropdown */}
            <select
              value={formData.profitGoalId} // Bind this to formData.profitGoalId
              onChange={(e) => setFormData({ ...formData, profitGoalId: e.target.value })} // Handle change
              required
            >
              <option value="">Select Profit Goal</option>
              {profitGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.goalName} {/* Display the goal name */}
                </option>
              ))}
            </select>

            <Button variant="primary" type="submit">{isEditing ? "Update" : "Add"}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FixedIncomes;
