import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./GoalsChart.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const ProfitGoalsPieChart = () => {
  const [data, setData] = useState([]);
  const [goal, setGoal] = useState(5000);
  const [timeFilter, setTimeFilter] = useState("weekly");

  const filterData = (rawData) => {
    return rawData.map(item => {
      let amount = item.amount;
      
      switch (timeFilter) {
        case "weekly":
          // Convert monthly amounts to weekly
          amount = item.type === "expense"
            ? -Math.abs(amount / 4)
            : amount / 4;
          break;
        case "yearly":
          // Convert monthly amounts to yearly
          amount = item.type === "expense"
            ? -Math.abs(amount * 12)
            : amount * 12;
          break;
        default:
          // Monthly stays unchanged
          amount = item.type === "expense"
            ? -Math.abs(amount)
            : amount;
      }
      
      return { ...item, amount };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fixedIncomeRes, fixedExpenseRes, recurringIncomeRes, 
               recurringExpenseRes, goalRes] = await Promise.all([
          axios.get("http://localhost:4001/api/fixedIncome/fixed-incomes"),
          axios.get("http://localhost:4001/api/fixedExpense/fixed-expenses"),
          axios.get("http://localhost:4001/api/recuringIncome/recurring-incomes"),
          axios.get("http://localhost:4001/api/recuringExpense/recurring-expenses"),
          axios.get("http://localhost:4001/api/profitGoal/get/all")
        ]);

        // Combine raw data
        let combinedData = [
          ...fixedIncomeRes.data.data.map(item => ({
            amount: item.amount,
            type: "income",
            status: item.status || "pending"
          })),
          ...recurringIncomeRes.data.data.map(item => ({
            amount: item.amount,
            type: "income",
            status: item.status || "pending"
          })),
          ...fixedExpenseRes.data.data.map(item => ({
            amount: item.amount,
            type: "expense",
            status: item.status || "pending"
          })),
          ...recurringExpenseRes.data.data.map(item => ({
            amount: item.amount,
            type: "expense",
            status: item.status || "pending"
          }))
        ];

        // Calculate total goal
        const totalGoal = goalRes.data.reduce(
          (sum, g) => sum + g.remainingProfit, 
          0
        );

        // Apply time filter
        const filteredData = filterData(combinedData);

        setData(filteredData);
        setGoal(totalGoal || 5000);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [timeFilter]);

  // Calculate totals based on filtered data
  const totalIncome = data.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const totalExpense = data.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const achievement = totalIncome - totalExpense;

  // Prepare chart data
  const total = totalIncome + totalExpense + goal + achievement;
  const chartData = [
    { name: "Income", value: (totalIncome / total) * 100 },
    { name: "Expense", value: (totalExpense / total) * 100 },
    { name: "Goal", value: (goal / total) * 100 },
    { name: "Achievement", value: (achievement / total) * 100 }
  ];

  return (
    <div className="pie-chart-container">
      {/* Time period filters */}
      <div className="filter-buttons">
        <button onClick={() => setTimeFilter("weekly")} 
                className={timeFilter === "weekly" ? "active" : ""}>
          Weekly
        </button>
        <button onClick={() => setTimeFilter("monthly")} 
                className={timeFilter === "monthly" ? "active" : ""}>
          Monthly
        </button>
        <button onClick={() => setTimeFilter("yearly")} 
                className={timeFilter === "yearly" ? "active" : ""}>
          Yearly
        </button>
      </div>

      {/* Chart display */}
      <div className="chart-report">
       
        <PieChart width={350} height={450} margin={{ top: 0 }} >
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            layout="vertical" 
            align="center" 
            verticalAlign="bottom" 
            wrapperStyle={{ paddingTop: 60 }} 
          />
        </PieChart>
      </div>
    </div>
  );
};

export default ProfitGoalsPieChart;