import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FixedIncomes.css";

const FixedIncomes = () => {
  const [fixedIncomes, setFixedIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    amount: "",
    currency: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchFixedIncomes();
    fetchCategories();
  }, []);

  const fetchFixedIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/fixedIncome/fixed-incomes");
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/fixedIncome/fixed-incomes/${id}`);
      setFixedIncomes(fixedIncomes.filter((income) => income.id !== id));
    } catch (error) {
      console.error("Error deleting fixed income:", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4001/api/fixedIncome/fixed-incomes/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:4001/api/fixedIncome/fixed-incomes", formData);
      }
      setShowForm(false);
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
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="fixed-incomes-container">
      <h2>Fixed Incomes</h2>
      <button className="add-btn" onClick={() => { setShowForm(true); setIsEditing(false); }}>+ Add</button>

      <table className="fixed-incomes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
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
                <td>
                  {categories.find((cat) => cat.id === income.categoryId)?.name || "No Category"}
                </td>
                <td>
                  <button onClick={() => handleEdit(income)} className="update-btn">Edit</button>
                  <button onClick={() => handleDelete(income.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No fixed incomes available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-form">
          <form onSubmit={handleAddOrUpdate}>
            <h3>{isEditing ? "Update Fixed Income" : "Add Fixed Income"}</h3>
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
              type="text"
              placeholder="Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            />
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button type="submit">{isEditing ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FixedIncomes;
