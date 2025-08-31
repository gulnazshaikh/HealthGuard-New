import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/QuickReview.css";

export default function QuickReview() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/review");
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setSummary(res.data);
        }
      } catch (e) {
        console.error(e);
        setError("Error fetching review — upload & clean a CSV first.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="center">Loading review…</div>;
  if (error) return <div className="center error">{error}</div>;
  if (!summary) return null;

  const { shape, columns, dtypes, missing_values, describe } = summary;

  // Build describe table (rows = stats, cols = features)
  const featureCols = Object.keys(describe || {});
  const stats = [...new Set(featureCols.flatMap(c => Object.keys(describe[c] || {})))];

  return (
    <div className="quick-container">
      <h1 className="title">Quick Review Report</h1>

      <div className="card">
        <h3>Dataset Overview</h3>
        <div className="metrics">
          <div className="metric">
            <div className="label">Rows</div>
            <div className="value">{shape?.rows}</div>
          </div>
          <div className="metric">
            <div className="label">Columns</div>
            <div className="value">{shape?.columns}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Columns & Types</h3>
        <ul>
          {columns.map(c => (
            <li key={c}><strong style={{color:'#9bd3ff'}}>{c}</strong> — {dtypes[c]}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Missing Values</h3>
        <table>
          <thead><tr><th>Column</th><th>Missing</th></tr></thead>
          <tbody>
            {Object.entries(missing_values).map(([k,v]) => (
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Descriptive Statistics</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="describe-table">
            <thead>
              <tr>
                <th>stat</th>
                {featureCols.map(fc => <th key={fc}>{fc}</th>)}
              </tr>
            </thead>
            <tbody>
              {stats.map(stat => (
                <tr key={stat}>
                  <td className="stat-name">{stat}</td>
                  {featureCols.map(fc => (
                    <td key={fc + stat}>
                      {describe[fc] && describe[fc][stat] !== undefined && describe[fc][stat] !== null
                        ? String(describe[fc][stat])
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
