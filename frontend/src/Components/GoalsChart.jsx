import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./GoalsChart.css";

const COLORS = ["#607789", "#1b2028", "#f4d03f", "red"];

const ProfitGoalsPieChart = () => {
  const [data, setData] = useState([]);
  const [goal, setGoal] = useState(5000);
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [goalFilter, setGoalFilter] = useState("all");

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

        let combinedData = [
          ...fixedIncomeRes.data.data.map(item => ({ amount: item.amount, type: "income" })),
          ...recurringIncomeRes.data.data.map(item => ({ amount: item.amount, type: "income" })),
          ...fixedExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount), type: "expense" })),
          ...recurringExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount), type: "expense" }))
        ];

        if (goalFilter !== "all") {
          combinedData = combinedData.filter(item => item.status?.toLowerCase() === goalFilter);
        }

        let totalGoal = goalRes.data
          .filter(g => goalFilter === "all" || g.status.toLowerCase() === goalFilter)
          .reduce((sum, g) => sum + g.remainingProfit, 0);

        setData(combinedData);
        setGoal(totalGoal || 5000);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [goalFilter, timeFilter]);

  const filterData = (data) => {
    switch (timeFilter) {
      case "weekly":
        return data.map(d => ({ ...d, amount: d.amount / 4 }));
      case "yearly":
        return data.map(d => ({ ...d, amount: d.amount * 12 }));
      default:
        return data;
    }
  };

  const filteredData = filterData(data);

  const totalIncome = filteredData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const totalExpense = filteredData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const achievement = totalIncome - totalExpense;
  const total = totalIncome + totalExpense + goal + achievement;

  const chartData = [
    { name: "Income", value: (totalIncome / total) * 100 },
    { name: "Expense", value: (totalExpense / total) * 100 },
    { name: "Goal", value: (goal / total) * 100 },
    { name: "Achievement", value: (achievement / total) * 100 }
  ];

  return (
    <div className="pie-chart-container">
      <div className="filter-buttons">
        <button onClick={() => setTimeFilter("weekly")} className={timeFilter === "weekly" ? "active" : ""}>Weekly</button>
        <button onClick={() => setTimeFilter("monthly")} className={timeFilter === "monthly" ? "active" : ""}>Monthly</button>
        <button onClick={() => setTimeFilter("yearly")} className={timeFilter === "yearly" ? "active" : ""}>Yearly</button>
      </div>

      <div className="goal-filter-buttons">
        <button onClick={() => setGoalFilter("all")} className={goalFilter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setGoalFilter("achieved")} className={goalFilter === "achieved" ? "active" : ""}>Achieved</button>
        <button onClick={() => setGoalFilter("missed")} className={goalFilter === "missed" ? "active" : ""}>Missed</button>
        <button onClick={() => setGoalFilter("pending")} className={goalFilter === "pending" ? "active" : ""}>Pending</button>
      </div>

      <div className="chart">
        <h2>Income & Expenses</h2>
        <PieChart width={350} height={450} margin={{ top: 50 }}>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
            {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 60 }} />
        </PieChart>
      </div>
    </div>
  );
};

export default ProfitGoalsPieChart;
