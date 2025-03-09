import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./GoalsChart.css";

const COLORS = ["#607789", "#1b2028", "#f4d03f", "red"];

const ProfitGoalsPieChart = () => {
  const [fixedData, setFixedData] = useState([]);
  const [recurringData, setRecurringData] = useState([]);
  const [goal, setGoal] = useState(5000);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Filter Data Based on Selection
  const filterData = (data) => {
    switch (filter) {
      case "weekly":
        return data.map(d => ({ ...d, amount: d.amount / 4 }));
      case "yearly":
        return data.map(d => ({ ...d, amount: d.amount * 12 }));
      default:
        return data;
    }
  };

  const filteredFixedData = filterData(fixedData);
  const filteredRecurringData = filterData(recurringData);

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

  return (
    <div className="pie-chart-container">
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("weekly")} className={filter === "weekly" ? "active" : ""}>Weekly</button>
        <button onClick={() => setFilter("monthly")} className={filter === "monthly" ? "active" : ""}>Monthly</button>
        <button onClick={() => setFilter("yearly")} className={filter === "yearly" ? "active" : ""}>Yearly</button>
      </div>

      {/* Pie Charts in Row */}
      <div className="charts">
        {/* Fixed Chart */}
        <div className="chart">
          <h2>Fixed Income & Expenses</h2>
          <div className="chart-wrapper">
          <PieChart width={350} height={450} margin={{top:50}}>
            <Pie data={fixedChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
              {fixedChartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
         
            <Legend layout="vertical" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 60}}/>
          </PieChart>
          </div>
        </div>

        {/* Recurring Chart */}
        <div className="chart">
          <h2>Recurring Income & Expenses</h2>
          <div className="chart-wrapper">
          <PieChart width={350} height={450}>
            <Pie data={recurringChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
              {recurringChartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop:60}}/>
          
          </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitGoalsPieChart;
