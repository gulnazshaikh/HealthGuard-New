import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function TestChart() {
  const data = [
    { name: "A", value: 12 },
    { name: "B", value: 19 },
    { name: "C", value: 5 }
  ];

  return (
    <div style={{ width: "500px", height: "300px", backgroundColor: "#333", color: "white" }}>
      <h3>Test Chart</h3>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
