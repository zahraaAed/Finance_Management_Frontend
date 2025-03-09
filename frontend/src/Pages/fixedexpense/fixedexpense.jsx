import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './fixedexpense.css';

const FixedExpenses = () => {
  const [fixedExpenses, setFixedExpenses] = useState([]);
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
    fetchFixedExpenses();
    fetchCategories();
    fetchProfitGoals();
  }, []);

  const fetchFixedExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/fixedExpense/fixed-expenses");
      setFixedExpenses(response.data.data);
    } catch (error) {
      console.error("Error fetching fixed expenses:", error);
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
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("Created Date cannot be in the future.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:4001/api/fixedExpense/fixed-expense/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:4001/api/fixedExpense/addfixed-expenses", formData);
      }
      setShowModal(false);
      fetchFixedExpenses();
    } catch (error) {
      console.error("Error saving fixed expense:", error);
    }
  };

  return (
    <div className="fixed-expenses-container">
      <div className="fixed-expenses-title">
        <h1>Fixed Expenses</h1>
        <Button variant="primary" onClick={() => {
          setShowModal(true);
          setIsEditing(false);
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
      <table className="fixed-expenses-table">
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
          {fixedExpenses.length > 0 ? (
            fixedExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.currency}</td>
                <td>{categories.find((cat) => cat.id === expense.categoryId)?.name || "No Category"}</td>
                <td>{profitGoals.find((goal) => goal.id === expense.profitGoalId)?.goalName || "No Profit Goal"}</td>
                <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
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
          <Modal.Title>{isEditing ? "Update Fixed Expense" : "Add Fixed Expense"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddOrUpdate}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="date" value={formData.createdDate} onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })} required />
            <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} required>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="LBP">LBP</option>
            </select>
            <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select value={formData.profitGoalId} onChange={(e) => setFormData({ ...formData, profitGoalId: e.target.value })} required>
              <option value="">Select Profit Goal</option>
              {profitGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>{goal.goalName}</option>
              ))}
            </select>
            <Button variant="primary" type="submit">{isEditing ? "Update" : "Add"}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FixedExpenses;
