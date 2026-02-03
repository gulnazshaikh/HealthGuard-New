


import React, { useEffect, useState } from "react";
import axios from "axios";

import PieChartCustom from "./charts/PieChart";
import BarChartCustom from "./charts/BarChart";
import LineChartCustom from "./charts/LineChart";
import HeatMap from "./charts/HeatMap";

export default function VisualizePage() {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [vizData, setVizData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/visualize?column=Age")
      .then(res => setColumns(res.data.columns))
      .catch(() => {});
  }, []);

  const loadCharts = async (col) => {
    const res = await axios.get(
      `http://127.0.0.1:5000/visualize?column=${col}`
    );
    setVizData(res.data);
  };

  return (
    <div style={{ background: "#05072b", minHeight: "100vh", color: "white", padding: 20 }}>
      <h2>📊 Data Visualization Dashboard</h2>

      <select
        value={selectedColumn}
        onChange={(e) => {
          setSelectedColumn(e.target.value);
          loadCharts(e.target.value);
        }}
      >
        <option value="">Select Data Column</option>
        {columns.map(col => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>

      {vizData && (
        <>
          <PieChartCustom data={vizData.pie} />
          <HeatMap data={vizData.heatmap} />
          <BarChartCustom data={vizData.bar} column={selectedColumn} />
          <LineChartCustom data={vizData.line} column={selectedColumn} />
        </>
      )}
      
    </div>
  );
}
