import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PreviewPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/preview")
      .then(res => {
        setColumns(res.data.columns || []);
        setRows(res.data.rows || []);
      })
      .catch(err => console.error(err));
  }, []);

  const handleClean = () => {
    axios.get("http://localhost:5000/clean")
      .then(res => {
        alert("✅ Data cleaned successfully!");
        navigate("/visualize");
      })
      .catch(err => {
        alert("❌ Failed to clean data");
        console.error(err);
      });
  };

  return (
    <div>
      <h2>📋 Preview Uploaded Data</h2>
      <button onClick={handleClean}>🧹 Clean Data</button>
      <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PreviewPage;
