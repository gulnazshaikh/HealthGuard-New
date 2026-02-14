import React, { useState } from "react";
import axios from "axios";
import "./TrainModel.css";

export default function TrainModel() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [target, setTarget] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [summary, setSummary] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [featureImportance, setFeatureImportance] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Select CSV first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:5000/upload", formData);
      await axios.post("http://127.0.0.1:5000/clean");

      const res = await axios.get("http://127.0.0.1:5000/visualize");
      setColumns(res.data.columns);

      alert("Uploaded & Cleaned. Select target column.");
    } catch {
      alert("Upload failed");
    }
  };

  const trainModel = async () => {
    if (!target) {
      alert("Select target column");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/train-model", {
        target: target
      });

      setLeaderboard(res.data.leaderboard || []);
      setSummary(res.data.summary || []);
      setMetrics(res.data.metrics || {});
      setFeatureImportance(res.data.feature_importance || []);

    } catch {
      alert("Training failed");
    }

    setLoading(false);
  };

  return (
    <div className="train-container">
      <h1>Train Model using H2O AutoML</h1>

      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />

      <br /><br />
      <button onClick={uploadFile}>Upload CSV</button>

      {columns.length > 0 && (
        <>
          <br /><br />
          <label>Select Target Column:</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">-- Select --</option>
            {columns.map((col, i) => (
              <option key={i} value={col}>{col}</option>
            ))}
          </select>

          <br /><br />
          <button onClick={trainModel}>Train Model</button>
        </>
      )}

      {loading && <p>Training model...</p>}

      {/* 🔥 LEADERBOARD */}
      {leaderboard.length > 0 && (
        <>
          <h2>Model Leaderboard</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                {Object.keys(leaderboard[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* 🔥 MODEL SUMMARY TABLE */}
      {summary && summary.length > 0 && (
        <>
          <h2>Model Summary</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                {Object.keys(summary[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* 🔥 FEATURE IMPORTANCE */}
      {featureImportance.length > 0 && (
        <>
          <h2>Feature Importance</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                {Object.keys(featureImportance[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureImportance.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* 🔥 EVALUATION METRICS TABLE */}
      {metrics && Object.keys(metrics).length > 0 && (
        <>
          <h2>Evaluation Metrics</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([key, value], i) => (
                <tr key={i}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </div>
  );
}
