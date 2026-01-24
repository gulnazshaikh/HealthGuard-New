import React, { useState } from "react";
import axios from "axios";
import "./QuickReview.css";

export default function QuickReview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://127.0.0.1:5000/review");

      if (res.data.error) {
        setError("Upload & Clean CSV first");
        setData(null);
      } else {
        setData(res.data);
      }
    } catch {
      setError("Backend not running or fetch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-review">
      <h1>Quick Review Report</h1>

      <button onClick={loadReview}>Load Quick Review</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          {/* Overview */}
          <div className="card">
            <h3>Dataset Overview</h3>
            <p>Rows: {data.shape.rows}</p>
            <p>Columns: {data.shape.columns}</p>
          </div>

          {/* Columns */}
          <div className="card">
            <h3>Columns & Types</h3>
            <ul>
              {Object.entries(data.columns).map(([k, v]) => (
                <li key={k}>{k} — {v}</li>
              ))}
            </ul>
          </div>

          {/* Missing */}
          <div className="card">
            <h3>Missing Values</h3>
            <table>
              <tbody>
                {Object.entries(data.missing).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Describe */}
          <div className="card">
            <h3>Descriptive Statistics</h3>
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  {Object.keys(data.describe).map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(data.describe[Object.keys(data.describe)[0]]).map(stat => (
                  <tr key={stat}>
                    <td>{stat}</td>
                    {Object.keys(data.describe).map(col => (
                      <td key={col}>{data.describe[col][stat]}</td>
                    ))}
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
