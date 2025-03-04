import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from "react-chartjs-2";
import 'chart.js/auto';
import './Reports.css';

export default function ReportComponent() {
  const [reports, setReports] = useState([]);
  const [profitGoals, setProfitGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetching data from provided endpoints
      const reportRes = await axios.get('http://localhost:4001/api/report/getAll');
      console.log('Reports:', reportRes.data); 
  
      const profitGoalsRes = await axios.get('http://localhost:4001/api/profitGoal/get/all');
      console.log('Profit Goals:', profitGoalsRes.data); 
  
      const incomeFixedRes = await axios.get('http://localhost:4001/api/fixedIncome/fixed-incomes');
      console.log('Fixed Income:', incomeFixedRes.data); 
  
      const expenseFixedRes = await axios.get('http://localhost:4001/api/fixedExpense/fixed-expenses');
      console.log('Fixed Expenses:', expenseFixedRes.data); 
  
      const incomeRecurringRes = await axios.get('http://localhost:4001/api/recuringIncome/recurring-incomes');
      console.log('Recurring Income:', incomeRecurringRes.data);
  
      const expenseRecurringRes = await axios.get('http://localhost:4001/api/recuringExpense/recurring-expenses');
      console.log('Recurring Expenses:', expenseRecurringRes.data);
      setReports(reportRes.data);
      setProfitGoals(profitGoalsRes.data);
  
      // Merge all transactions into one array
      const combinedTransactions = [
        ...incomeFixedRes.data.data.map(tx => ({ ...tx, transaction_type: "income" })),  
        ...expenseFixedRes.data.data.map(tx => ({ ...tx, transaction_type: "expense" })), 
        ...incomeRecurringRes.data.data.map(tx => ({ ...tx, transaction_type: "income" })), 
        ...expenseRecurringRes.data.data.map(tx => ({ ...tx, transaction_type: "expense" })), 
      ];
  
      console.log('Combined Transactions:', combinedTransactions); 
      setTransactions(combinedTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  // Safe date function
  const safeDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toISOString().split('T')[0];
  };

  // Match profit goals to transactions
  const getProfitGoalName = (profitgoalId) => {
    console.log('Checking for Profit Goal with ID:', profitgoalId); 
    const goal = profitGoals.find(pg => pg.id === profitgoalId);
    return goal ? goal.goalName : "Unknown Goal";
  };

  // Group transactions by profit goal
  const groupedTransactions = {};
  transactions.forEach(transaction => {
    const goalName = getProfitGoalName(transaction.profitgoalId);
    if (!groupedTransactions[goalName]) {
      groupedTransactions[goalName] = { income: 0, expense: 0 };
    }
    if (transaction.transaction_type === "income") {
      groupedTransactions[goalName].income += transaction.amount;
    } else {
      groupedTransactions[goalName].expense += transaction.amount;
    }
  });
  console.log('Grouped Transactions:', groupedTransactions);

  // Prepare chart data
  const lineChartData = {
    labels: reports.map(report => safeDate(report.startDate)), // X-Axis (Date)
    datasets: [
      {
        label: "Total Income",
        data: Object.values(groupedTransactions).map(item => item.income),
        borderColor: "blue",
        borderWidth: 2,
      },
      {
        label: "Total Expenses",
        data: Object.values(groupedTransactions).map(item => item.expense),
        borderColor: "red",
        borderWidth: 2,
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(groupedTransactions), // X-Axis (Profit Goal Names)
    datasets: [
      {
        label: "Total Income",
        data: Object.values(groupedTransactions).map(item => item.income),
        backgroundColor: "green",
      },
      {
        label: "Total Expenses",
        data: Object.values(groupedTransactions).map(item => item.expense),
        backgroundColor: "orange",
      }
    ]
  };

  return (
    <div className="Report-Container">
      <h2>Reports Overview</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <div className="chart-container">
            <h3>Income & Expense Over Time</h3>
            <Line data={lineChartData} />
          </div>

          <div className="chart-container">
            <h3>Profit Goal Comparisons</h3>
            <Bar data={barChartData} />
          </div>

          <div className="table-container">
            <h3>Detailed Transactions</h3>
            <table className='transaction-table'>
              <thead>
                <tr>
                  <th>Profit Goal</th>
                  <th>Transaction Type</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{getProfitGoalName(transaction.profitgoalId)}</td>
                    <td>{transaction.transaction_type}</td>
                    <td>{transaction.title}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.currency}</td>
                    <td>{safeDate(transaction.startDate)}</td>
                    <td>{safeDate(transaction.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
