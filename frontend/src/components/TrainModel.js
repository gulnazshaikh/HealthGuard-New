import React, { useState } from "react";
import axios from "axios";
import "./TrainModel.css";

export default function TrainModel() {
  const [file, setFile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📤 Upload CSV (backend clean bhi yahin karta hai)
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:5000/upload", formData);
      alert("File uploaded successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };

  // 🤖 Train Model
  const trainModel = async () => {
    setLoading(true);
    setLeaderboard([]);

    try {
      const res = await axios.post("http://127.0.0.1:5000/train-model");
      setLeaderboard(res.data.leaderboard);
    } catch (err) {
      alert("Training failed");
    }

    setLoading(false);
  };

  return (
    <div className="train-container">
      <h1>Train Your Model</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadFile}>Upload File</button>
      <button onClick={trainModel}>Train Model</button>

      {loading && <p>Training model...</p>}

      {/* 📊 LEADERBOARD — PDF STYLE */}
      {leaderboard.length > 0 && (
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
      )}
    </div>
  );
}
