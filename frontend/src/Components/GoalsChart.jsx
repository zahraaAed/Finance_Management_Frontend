import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#607789","#1b2028","#f4d03f"]; // Green = Income, Red = Expense, Yellow = Goal

const ProfitGoalsPieChart = () => {
  const [fixedData, setFixedData] = useState([]);
  const [recurringData, setRecurringData] = useState([]);
  const [goal, setGoal] = useState(5000); // Default goal if API fails

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

        console.log("Fixed Income Data:", fixedIncomeRes.data);
        console.log("Fixed Expense Data:", fixedExpenseRes.data);
        console.log("Recurring Income Data:", recurringIncomeRes.data);
        console.log("Recurring Expense Data:", recurringExpenseRes.data);
        console.log("Profit Goal Data:", goalRes.data);

        // Extract data correctly from response
        setFixedData([
          ...fixedIncomeRes.data.data.map(item => ({ amount: item.amount })),
          ...fixedExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount) }))
        ]);

        setRecurringData([
          ...recurringIncomeRes.data.data.map(item => ({ amount: item.amount })),
          ...recurringExpenseRes.data.data.map(item => ({ amount: -Math.abs(item.amount) }))
        ]);

        // Sum all goals' remainingProfit
        const totalGoal = goalRes.data.reduce((sum, goal) => sum + goal.remainingProfit, 0);
        setGoal(totalGoal || 5000); // Default if API returns empty

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Process fixed income/expense
  const fixedTotalIncome = fixedData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const fixedTotalExpense = fixedData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const fixedChartData = [
    { name: "Fixed Income", value: fixedTotalIncome },
    { name: "Fixed Expense", value: fixedTotalExpense },
    { name: "Fixed Goal", value: goal }
  ];

  // Process recurring income/expense
  const recurringTotalIncome = recurringData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const recurringTotalExpense = recurringData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const recurringChartData = [
    { name: "Recurring Income", value: recurringTotalIncome },
    { name: "Recurring Expense", value: recurringTotalExpense },
    { name: "Recurring Goal", value: goal }
  ];

  return (
    <div className="flex justify-center gap-10">
      {/* Fixed Chart */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-center">Fixed Income & Expenses</h2>
        <PieChart width={300} height={300}>
          <Pie data={fixedChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
            {fixedChartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Recurring Chart */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-center">Recurring Income & Expenses</h2>
        <PieChart width={300} height={300}>
          <Pie data={recurringChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
            {recurringChartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default ProfitGoalsPieChart;
