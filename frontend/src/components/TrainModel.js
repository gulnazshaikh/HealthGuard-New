import TrainModel from "./TrainModel";

import React, { useState } from "react";
import "./TrainModel.css";

function TrainModel({ columns = [] }) {
  const [target, setTarget] = useState("");
  const [trained, setTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [modelName, setModelName] = useState("");

  const handleTrain = () => {
    // Simulation (no package install)
    const fakeAccuracy = (Math.random() * 15 + 80).toFixed(2);

    setModelName("H2O AutoML (Simulated)");
    setAccuracy(fakeAccuracy);
    setTrained(true);
  };

  return (
    <div className="train-model-container">
      <h2>Train Your Model</h2>

      <p className="subtitle">
        Select target column and train machine learning model
      </p>

      <select
        className="target-select"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      >
        <option value="">Select Target Column</option>
        {columns.map((col, index) => (
          <option key={index} value={col}>
            {col}
          </option>
        ))}
      </select>

      <button
        className="train-btn"
        onClick={handleTrain}
        disabled={!target}
      >
        Train Model
      </button>

      {trained && (
        <div className="result-card">
          <p><b>Model Used:</b> {modelName}</p>
          <p><b>Accuracy:</b> {accuracy}%</p>
        </div>
      )}
    </div>
  );
}

export default TrainModel;
