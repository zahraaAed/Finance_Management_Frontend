import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Goals.css';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import GoalsPagination from '../Pagination';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProfitGoalsPieChart from '../../Components/GoalsChart';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Goals() {
  // Initializing useStates
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalData, setGoalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('');
  const [goalToUpdate, setGoalToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshPage, setRefreshPage] = useState(false);
  const [fixedData, setFixedData] = useState([]);
  const [recurringData, setRecurringData] = useState([]);
  const [goal, setGoal] = useState(5000);
  const [filter, setFilter] = useState("monthly"); // Default filter to "monthly"
  const [statusFilter, setStatusFilter] = useState(''); // Default to empty string or 'all'
  const [pieFilter, setPieFilter] = useState('all');
  const itemsPerPage = 6;

  const totalPages = Math.ceil(goalData.length / itemsPerPage);

  // Pie chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Merge both fetchData calls into one
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const userAdminId = localStorage.getItem('userAdminId');
      try {
        const [fixedIncomeRes, fixedExpenseRes, recurringIncomeRes, recurringExpenseRes, goalRes] = await Promise.all([
          axios.get("http://localhost:4001/api/fixedIncome/fixed-incomes"),
          axios.get("http://localhost:4001/api/fixedExpense/fixed-expenses"),
          axios.get("http://localhost:4001/api/recuringIncome/recurring-incomes"),
          axios.get("http://localhost:4001/api/recuringExpense/recurring-expenses"),
          axios.get("http://localhost:4001/api/profitGoal/get/all")
        ]);

        setFixedData([
          ...fixedIncomeRes.data.data.map(item => ({ amount: item.amount, type: "income" })),
          ...fixedExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount), type: "expense" }))
        ]);

        setRecurringData([
          ...recurringIncomeRes.data.data.map(item => ({ amount: item.amount, type: "income" })),
          ...recurringExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount), type: "expense" }))
        ]);

        const totalGoal = goalRes.data.reduce((sum, goal) => sum + goal.remainingProfit, 0);
        setGoal(totalGoal || 5000);

        // Goal data fetching
        const goalResponse = await axios.get('http://localhost:4001/api/profitGoal/get/all', {
          data: { userId, userAdminId },
        });

        const formattedGoals = goalResponse.data.map(goal => ({
          goalName: goal.goalName,
          targetAmount: goal.targetAmount,
          actualProfit: goal.actualProfit,
          currency: goal.currency,
          deadline: goal.deadline,
          status: goal.status,
          achievementPercentage: goal.achievementPercentage,
          remainingProfit: goal.remainingProfit,
          averageMonthlyProfit: goal.averageMonthlyProfit,
          id: goal.id
        }));

        setGoalData(formattedGoals);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [refreshPage]);

   // Filter Data Based on Status
   const filterByStatus = (data) => {
    if (statusFilter) {
      return data.filter((goal) => goal.status.toLowerCase() === statusFilter.toLowerCase());
    }
    return data;
  };

  // Filter Pie Chart Data
  const getFilteredPieData = (data) => {
    switch (pieFilter) {
      case 'income':
        return data.filter(d => d.type === 'income');
      case 'expense':
        return data.filter(d => d.type === 'expense');
      default:
        return data; // 'all' case, returns all data
    }
  };
  
  const filteredGoals = filterByStatus(goalData);
  const filteredFixedData = getFilteredPieData(fixedData);
  const filteredRecurringData = getFilteredPieData(recurringData);

  
  // Calculate Totals
  const fixedTotalIncome = filteredFixedData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const fixedTotalExpense = filteredFixedData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const achievement = fixedTotalIncome - fixedTotalExpense;
  const fixedTotal = fixedTotalIncome + fixedTotalExpense + goal + achievement;

  const fixedChartData = [
    { name: "Fixed Income", value: (fixedTotalIncome / fixedTotal) * 100 },
    { name: "Fixed Expense", value: (fixedTotalExpense / fixedTotal) * 100 },
    { name: "Fixed Goal", value: (goal / fixedTotal) * 100 },
    { name: "Achievement", value: (achievement / fixedTotal) * 100 }
  ];

  const recurringTotalIncome = filteredRecurringData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const recurringTotalExpense = filteredRecurringData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const recurringTotal = recurringTotalIncome + recurringTotalExpense + goal;

  const recurringChartData = [
    { name: "Recurring Income", value: (recurringTotalIncome / recurringTotal) * 100 },
    { name: "Recurring Expense", value: (recurringTotalExpense / recurringTotal) * 100 },
    { name: "Recurring Goal", value: (goal / recurringTotal) * 100 }
  ];

  // Handle Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedGoals = goalData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //posting goal
  const addGoal = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); 
    const userAdminId = localStorage.getItem('userAdminId'); 
  
    try {
      console.log('State Values:', { name, target,deadline,deadline, type, userId, userAdminId });
  
      const response = await axios.post('http://localhost:4001/api/profitGoal/add', {
        goalName: name,           
        targetAmount: parseFloat(target), 
        currency: "USD",          
       deadline:deadline,  
        status: "Pending",     
      });
  
      console.log('Response:', response); // Check response
  
      if (response.status === 200) {
        setGoalData((prevGoals) => [...prevGoals, response.data]);
        setName('');
        setTarget(0);
        setDeadline('');
        
        setType('');
        handleShowSuccessModal();
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };
  
  
  // Update Goal
  const updateGoal = async (e) => {
    e.preventDefault();
    if (!goalToUpdate) return;

    try {
      const response = await axios.patch(
        `http://localhost:4001/api/profitGoal/update/${goalToUpdate.id}`,
        {
          goalName: name,
          targetAmount: parseFloat(target),
          deadline,
          type,
        }
      );

      if (response.status === 200) {
        setGoalData(goalData.map((goal) => (goal.id === goalToUpdate.id ? response.data : goal)));
        handleCloseUpdateForm();
        setRefreshPage(!refreshPage);
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  // Delete Goal
  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    
    try {
      const userId = localStorage.getItem('userId');
      const userAdminId = localStorage.getItem('userAdminId');

      const response = await axios.delete(`http://localhost:4001/api/profitGoal/delete/${goalToDelete}`, {
        data: { userId, userAdminId },
      });

      if (response.status === 200) {
        setGoalData(goalData.filter((goal) => goal.id !== goalToDelete));
        setConfirmDelete(false);
        setGoalToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setGoalToDelete(null);
  };

  // Handle Update Click
  const handleUpdateClick = (goalId) => {
    const goal = goalData.find((g) => g.id === goalId);
    if (!goal) return;

    setGoalToUpdate(goal);
    setName(goal.goalName);
    setTarget(goal.targetAmount);
    setDeadline(goal.deadline);
    setType(goal.type);
    setShowUpdateForm(true);
  };

  

  
  //handeling the delete function

  //setting boolean values for showing the modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowUpdateForm = () => setShowUpdateForm(true);
  const handleCloseUpdateForm = () => setShowUpdateForm(false);



  //setting boolean values for showing the modal

//Fetching the Goal Data
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
      const userAdminId = localStorage.getItem('userAdminId'); 
      try {
        const response = await axios.get('http://localhost:4001/api/profitGoal//get/all', {
          data: { userId, userAdminId }, // Send both IDs to backend
        });
        console.log("API Response:", response.data);
  
        // Normalize data structure for frontend
        const formattedGoals = response.data.map(goal => ({
          
            goalName: goal.goalName,
            targetAmount: goal.targetAmount,
            actualProfit: goal.actualProfit,
            currency: goal.currency,
           deadline: goal.deadline,
            status: goal.status,
            achievementPercentage: goal.achievementPercentage,
            remainingProfit: goal.remainingProfit,
            averageMonthlyProfit: goal.averageMonthlyProfit,
            id: goal.id
        }));
  
        setGoalData(formattedGoals);
        console.log("Formatted Goals:", formattedGoals);

      }
       catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
  
    fetchData();
  }, [refreshPage]);
  //Fetching the Goal Data
  
  const Box = ({ goal,handleDeleteClick,handleUpdateClick}) => (
    <div className="box">
      <h2>{goal.name}</h2>
      <ul className='goals-ul'>
        <li className='goals-li'>{goal.target}</li>
        <div className='goal-img'>
  <AiFillDelete className="delete-icon" onClick={() => handleDeleteClick(goal.id)} />
  <AiFillEdit className="edit-icon" onClick={() => handleUpdateClick(goal.id)} />
</div>
<span className='goals-span'>{goal.Deadline}</span>&nbsp;&nbsp;
<FaRegCalendarAlt className="calendar-icon" />&nbsp;&nbsp;
<span className='goals-span'>{goal.deadline}</span>
      </ul>
      <GoalsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="pagination-transactions" // Add your desired class name here
          />
    </div>
  );
  console.log("Formatted Goals:", paginatedGoals);

      
  return (
    <div>
      <div className="goal-title">
        <div className='goal-header'>
        <h1>Profit Goals</h1>
        <div className="filter-buttons">
        <button onClick={() => setStatusFilter('')} className={statusFilter === '' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => setStatusFilter('pending')} className={statusFilter === 'pending' ? 'active' : ''}>
          Pending
        </button>
        <button onClick={() => setStatusFilter('achieved')} className={statusFilter === 'achieved' ? 'active' : ''}>
          Achieved
        </button>
        <button onClick={() => setStatusFilter('missed')} className={statusFilter === 'missed' ? 'active' : ''}>
          Missed
        </button>
       
<button onClick={() => setPieFilter('income')}>Income</button>
<button onClick={() => setPieFilter('expense')}>Expense</button>

      
      </div>
</div>
      <div className="Add-Goal">
        <Button className="goal-button" variant="primary" onClick={handleShowModal}>
          Add Goal
        </Button>
      </div>
      
      </div>
      

      {/* Table for displaying goals */}
      <div className="goal-container">
        <table className="table">
          <thead>
            <tr>
          
            <th>Goal Name</th>
            <th>Target Amount</th>
            <th>Actual Profit</th>
            <th>Remaining Profit</th>
            <th>Status</th>
            <th>Achievement Percentage</th>
            <th>Average Monthly Profit</th>
            <th>Deadline</th>
            <th>Actions </th>
          </tr>
          </thead>
  {/*         <tbody>
            
          {paginatedGoals.map((goal, index) => (
  <tr key={goal.id}>  
    <td>{goal.goalName}</td>
    <td>{goal.target} {goal.currency}</td>
    <td>{goal.actualProfit} {goal.currency}</td>
    <td>{goal.remainingProfit} {goal.currency}</td>
    <td>{goal.status}</td>
    <td>{goal.achievementPercentage}%</td>
    <td>{goal.averageMonthlyProfit} {goal.currency}</td>
    <td>{new Date(goal.deadline).toLocaleDateString()}</td>

                <td>
                
                  <AiFillEdit className="edit-icon" onClick={() => handleUpdateClick(goal.id)} />
                  <AiFillDelete className="delete-icon" onClick={() => handleDeleteClick(goal.id)} />
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
    {filteredGoals.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ).map((goal) => (
        <tr key={goal.id}>
            <td>{goal.goalName}</td>
            <td>{goal.targetAmount} {goal.currency}</td>
            <td>{goal.actualProfit} {goal.currency}</td>
            <td>{goal.remainingProfit} {goal.currency}</td>
            <td>{goal.status}</td>
            <td>{goal.achievementPercentage}%</td>
            <td>{goal.averageMonthlyProfit} {goal.currency}</td>
            <td>{new Date(goal.deadline).toLocaleDateString()}</td>
            <td>
                <AiFillEdit className="edit-icon" onClick={() => handleUpdateClick(goal.id)} />
                <AiFillDelete className="delete-icon" onClick={() => handleDeleteClick(goal.id)} />
            </td>
        </tr>
    ))}
</tbody>

        </table>
        <div className="charts">
        {/* Fixed Chart */}
        <div className="chart">
          <h2>Fixed Income & Expenses</h2>
          <div className="chart-wrapper">
          <PieChart width={400} height={400}>
  <Pie
    data={fixedChartData} // This should be based on filtered data
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label
  >
    {fixedChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>


          </div>
        </div>

        {/* Recurring Chart */}
        <div className="chart">
          <h2>Recurring Income & Expenses</h2>
          <div className="chart-wrapper">
          <PieChart width={350} height={450}>
  <Pie
    data={recurringChartData} // This should be based on filtered data
    cx="50%"
    cy="50%"
    outerRadius={100}
    fill="#8884d8"
    dataKey="value"
    label
  >
    {recurringChartData.map((_, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend layout="vertical" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 60 }} />
</PieChart>

          </div>
        </div>
      </div>

        {/* Pagination Component */}
        <GoalsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="pagination-transactions" // Add your desired class name here
        />
      </div>

      {/* Modals for Add Goal, Update Goal, Delete Confirmation, Success Message */}
      {/* Add Goal Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addGoal}>
            {/* Add goal form fields */}
            <div className="form-group">
              <label htmlFor="goalName">Goal Name:</label>
              <input
                type="text"
                className="form-control"
                id="goalName"
                placeholder="Enter goal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="target">Target:</label>
              <input
                type="number"
                className="form-control"
                id="target"
                placeholder="Enter target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          
            <div className="form-group">
              <label htmlFor="Deadline">Deadline</label>
              <input
                type="date"
                className="form-control"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                className="form-control"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* Update Goal Modal */}
      <Modal show={showUpdateForm} onHide={handleCloseUpdateForm}>
        <Modal.Header closeButton>
          <Modal.Title>Update Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={updateGoal}>
            {/* Update goal form fields (similar to Add Goal) */}
            <div className="form-group">
              <label htmlFor="goalName">Goal Name:</label>
              <input
                type="text"
                className="form-control"
                id="goalName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="target">Target:</label>
              <input
                type="number"
                className="form-control"
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
        
            <div className="form-group">
              <label htmlFor="deadline">Deadline:</label>
              <input
                type="date"
                className="form-control"
                id="deadline"
                value={deadline}
                onChange={(e) => setdeadline(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                className="form-control"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateForm}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      {confirmDelete && goalToDelete && (
        <Modal show={confirmDelete} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this goal?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Goal has been successfully added!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};