import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './recurringincome.css';

const RecurringIncomes = () => {
  const [recurringIncomes, setRecurringIncomes] = useState([]);
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
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchRecurringIncomes();
    fetchCategories();
    fetchProfitGoals();
  }, []);

  const fetchRecurringIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/recurringIncome/recurring-incomes");
      setRecurringIncomes(response.data.data);
    } catch (error) {
      console.error("Error fetching recurring incomes:", error);
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
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      alert("Start Date must be before End Date.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:4001/api/recurringIncome/recurring-income/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:4001/api/recurringIncome/addrecurring-incomes", formData);
      }
      setShowModal(false);
      fetchRecurringIncomes();
    } catch (error) {
      console.error("Error saving recurring income:", error);
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
      profitGoalId: income.profitgoalId,
      startDate: new Date(income.startDate).toISOString().split("T")[0],
      endDate: new Date(income.endDate).toISOString().split("T")[0],
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recurring income?")) {
      try {
        await axios.delete(`http://localhost:4001/api/recurringIncome/recurring-incomes/${id}`);
        fetchRecurringIncomes();
      } catch (error) {
        console.error("Error deleting recurring income:", error);
      }
    }
  };

  return (
    <div className="recurring-incomes-container">
      <div className="recurring-incomes-title">
        <h1>Recurring Incomes</h1>
        <Button className="add-btn" variant="primary" onClick={() => {
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
            startDate: "",
            endDate: "",
          });
        }}>
          Add
        </Button>
      </div>
      <table className="recurring-incomes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Profit Goal</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recurringIncomes.length > 0 ? (
            recurringIncomes.map((income) => (
              <tr key={income.id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{income.amount}</td>
                <td>{income.currency}</td>
                <td>{categories.find((cat) => cat.id === income.categoryId)?.name || "No Category"}</td>
                <td>{profitGoals.find((goal) => goal.id === income.profitGoalId)?.goalName || "No Profit Goal"}</td>
                <td>{new Date(income.startDate).toLocaleDateString()}</td>
                <td>{new Date(income.endDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(income)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(income.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No recurring incomes available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Update Recurring Income" : "Add Recurring Income"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddOrUpdate}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
            <Button variant="primary" type="submit">{isEditing ? "Update" : "Add"}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RecurringIncomes;
