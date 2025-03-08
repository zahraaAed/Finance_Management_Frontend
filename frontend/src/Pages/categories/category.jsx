import React, { useState, useEffect } from "react";
import axios from "axios";
import "./categorycss.css";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    // Fetch all categories
    useEffect(() => {
        fetchCategories();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:4001/api/category/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Add a new category
    const handleAddCategory = async () => {
        if (!name) {
            alert("Category name is required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/category/addcategorie", {
                name
            });

            setCategories([...categories, response.data.category]);
            setName("");
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // Update category name only
    const handleUpdateCategory = async () => {
        if (!editingCategory || !name) {
            alert("Category name is required.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:4000/api/categories/${editingCategory.id}/name`, 
                { name }
            );

            setCategories(categories.map(cat => 
                cat.id === editingCategory.id ? response.data.category : cat
            ));
            
            setEditingCategory(null);
            setName("");
        } catch (error) {
            console.error("Error updating category name:", error);
        }
    };

    // Delete a category
    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/category/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    // Handle edit click
    const handleEditClick = (category) => {
        setEditingCategory(category);
        setName(category.name);
    };

    return (
        <div className="category-container">
            <h2>Manage Categories</h2>

            {/* Category Form */}
            <div className="category-form">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {editingCategory ? (
                    <button onClick={handleUpdateCategory}>Update Category</button>
                ) : (
                    <button onClick={handleAddCategory}>Add Category</button>
                )}
            </div>

            {/* Categories List */}
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category.id}>
                        <span>{category.name}</span>
                        <button className=".edit-btn" onClick={() => handleEditClick(category)}>Edit</button>
                        <button className=".delete-btn" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
