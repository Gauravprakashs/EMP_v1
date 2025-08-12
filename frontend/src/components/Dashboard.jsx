import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../slices/employeeSlice";
import PieChart from "./PieChart";

const PIE_COLORS = [
  "#2563eb", "#60a5fa", "#7b00ff", "#00c9ff", "#00ffb3", "#ffb347", "#ff6384"
];

function Dashboard() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list);
  const totalEmployees = employees.length;
  const byDepartment = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(byDepartment).map(([label, value]) => ({ label, value }));

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <div className="dashboard-bg refined-dashboard">
      <h2 className="dashboard-title refined-title">Dashboard Analytics</h2>
      <div className="dashboard-cards refined-cards">
        <div className="dashboard-card refined-card">
          <h3>Total Employees</h3>
          <p className="dashboard-count refined-count">{totalEmployees}</p>
        </div>
        <div className="dashboard-card refined-card" style={{ minWidth: 320 }}>
          <h3>Employees by Department</h3>
          {pieData.length > 0 ? (
            <div className="piechart-container">
              <PieChart data={pieData} colors={PIE_COLORS} />
              <ul className="piechart-legend">
                {pieData.map((d, i) => (
                  <li key={d.label}>
                    <span className="piechart-legend-color" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    {d.label}: {d.value}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: '#aaa', marginTop: '1rem' }}>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
