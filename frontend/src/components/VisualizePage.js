import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid
} from "recharts";
import Plot from "react-plotly.js";

export default function VisualizePage() {
  const [vizData, setVizData] = useState(null);
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/visualize")
      .then(res => {
        console.log("✅ vizData:", res.data); // Debug: check backend data
        setVizData(res.data);
      })
      .catch(err => console.error("❌ Visualization API error:", err));
  }, []);

  if (!vizData || Object.keys(vizData).length === 0) {
    return <h2 style={{ color: "white" }}>⚠️ Please upload and clean a CSV first.</h2>;
  }

  // Prepare data for charts
  const outcomeData = Object.entries(vizData.outcome_counts || {}).map(([k, v]) => ({ name: k, value: v }));
  const glucoseData = Object.entries(vizData.glucose_counts || {}).map(([k, v]) => ({ range: k, count: v }));
  const bmiData = Object.entries(vizData.bmi_counts || {}).map(([k, v]) => ({ name: k, value: v }));
  const ageInsulinData = vizData.age_insulin || [];

  const corrMatrix = vizData.correlation
    ? Object.keys(vizData.correlation).map(row => Object.values(vizData.correlation[row]))
    : [];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Data Visualizations</h2>

      {/* Outcome Distribution */}
      <h3>Outcome Distribution</h3>
      <BarChart width={400} height={300} data={outcomeData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>

      {/* Glucose Distribution */}
      <h3>Glucose Distribution</h3>
      <BarChart width={500} height={300} data={glucoseData}>
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      {/* BMI Categories */}
      <h3>BMI Categories</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={bmiData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {bmiData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>

      {/* Age vs Insulin */}
      <h3>Age vs Insulin</h3>
      <LineChart width={500} height={300} data={ageInsulinData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="Age" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Insulin" stroke="#ff7300" />
      </LineChart>

      {/* Correlation Heatmap */}
      <h3>Correlation Heatmap</h3>
      <Plot
        data={[
          {
            z: corrMatrix,
            x: Object.keys(vizData.correlation || {}),
            y: Object.keys(vizData.correlation || {}),
            type: "heatmap",
            colorscale: "Viridis",
          },
        ]}
        layout={{ width: 600, height: 600, title: "Correlation Heatmap" }}
      />
    </div>
  );
}
