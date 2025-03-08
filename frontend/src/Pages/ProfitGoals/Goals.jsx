
//importing libraries
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import './Goals.css';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import GoalsPagination from '../Pagination';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProfitGoalsPieChart from '../../Components/GoalsChart';


//importing libraries


export default function Goals() {
  //intializing useStates
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalData, setGoalData] = useState([]);
  const itemsPerPage = 6; 
  const totalPages = Math.ceil(goalData.length / itemsPerPage);
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
  //intializing useStates

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedGoals = goalData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isDuplicateGoalName = (nameToCheck, currentGoalId) => {
    return goalData.some((goal) => goal.name === nameToCheck && goal.id !== currentGoalId);
  };
  

 
  //posting goal
  const addGoal = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); 
    const userAdminId = localStorage.getItem('userAdminId'); 
  
    try {
      console.log('State Values:', { name, target, startDate, deadline, type, userId, userAdminId });
  
      const response = await axios.post('http://localhost:4001/api/profitGoal/add', {
        goalName: name,           
        targetAmount: parseFloat(target), 
        currency: "USD",          
        deadline: deadline,  
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
  
  
    //posting goal

  //updating goal
  const updateGoal = async (e) => {
    e.preventDefault();
  
    // Check if goalToUpdate is set
    if (!goalToUpdate || !goalToUpdate.id) {
      console.error('Error: Goal ID is not defined.');
      return;
    }
  
    if (isDuplicateGoalName(name, goalToUpdate) && name !== goalToUpdate.name) {
      alert('Duplicate goal name');
      return;
    }
  
    if (startDate >= endDate) {
      alert('End date should be greater than start date');
      return;
    }
  
    console.log('State Values:', { name, target, startDate, endDate, type });
  
    try {
      const response = await axios.patch(
        `http://localhost:4001/api/profitGoal/update/${goalToUpdate.id}`,  // Use goalToUpdate.id instead of goalToUpdate
        {
          name,
          target: parseInt(target),
          startDate,
          endDate,
          type,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const updatedGoal = response.data;
  
        // Update the existing goal in the array
        setGoalData((prevGoals) =>
          prevGoals.map((goal) =>
            goal.id === updatedGoal.id ? updatedGoal : goal
          )
        );
  
        setName('');
        setTarget(0);
       setDeadline('');
        
        setType('');
        handleCloseUpdateForm();
        setRefreshPage(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

///hande update clock
const handleUpdateClick = (goalId) => {
  const goal = goalData.find((g) => g.id === goalId);
  if (!goal) return;

  // Set goalToUpdate with the entire goal object, not just the id
  setGoalToUpdate(goal);

  // Populate the form with goal details
  setName(goal.name);
  setTarget(goal.target);
setDeadline(goal.deadline);
  setType(goal.type);

  handleShowUpdateForm();  // Show update modal
};


  
  //setting the vlue when the user presses on the pen in order to update the goal

//handeling the delete function
const handleDeleteClick = async (goalId) => {
    const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
    const userAdminId = localStorage.getItem('userAdminId'); // Get the user Admin ID from localStorage
  
    setGoalToDelete(goalId);
    setConfirmDelete(true);
  
    const handleConfirmDelete = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:4001/api/profitGoal/delete/${goalToDelete}`,
          {
            data: { userId, userAdminId }, // Send both IDs to backend
          }
        );
  
        console.log('Delete Response:', response);
  
        if (response.status === 200) {
          setConfirmDelete(false);
          setGoalToDelete(null);
          setGoalData((prevGoals) => prevGoals.filter((goal) => goal.id !== goalToDelete));
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    };
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

      } catch (error) {
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
<span className='goals-span'>{goal.startDate}</span>&nbsp;&nbsp;
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
        <h1>Profit Goals</h1>
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
          <tbody>
            
          {paginatedGoals.map((goal, index) => (
  <tr key={goal.id}>  {/* Use `goal.id` as the unique key */}
    <td>{goal.goalName}</td>
    <td>{goal.target} {goal.currency}</td>
    <td>{goal.actualProfit} {goal.currency}</td>
    <td>{goal.remainingProfit} {goal.currency}</td>
    <td>{goal.status}</td>
    <td>{goal.achievementPercentage}%</td>
    <td>{goal.averageMonthlyProfit} {goal.currency}</td>
    <td>{new Date(goal.deadline).toLocaleDateString()}</td>

                <td>
                  {/* Action buttons */}
                  <AiFillEdit className="edit-icon" onClick={() => handleUpdateClick(goal.id)} />
                  <AiFillDelete className="delete-icon" onClick={() => handleDeleteClick(goal.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ProfitGoalsPieChart/>

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