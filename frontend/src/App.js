import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadPage from "./components/UploadPage";
import QuickReview from "./components/QuickReview";
import ChatWithCSV from "./components/ChatWithCSV";
import VisualizePage from "./components/VisualizePage"; // ✅ Import actual VisualizePage
// import LeaderboardTable from "./components/LeaderboardTable"; // ❌ Removed

import "./App.css";

// TrainModel page without leaderboard
const TrainModel = () => (
  <div className="page">
    <h1>Train Your Model</h1>
    {/* LeaderboardTable removed */}
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<UploadPage />} />
        <Route path="/chat" element={<ChatWithCSV />} />
        <Route path="/review" element={<QuickReview />} />
        <Route path="/visualize" element={<VisualizePage />} />  {/* ✅ Fixed */}
        <Route path="/train" element={<TrainModel />} />  {/* ✅ TrainModel route fixed */}
        {/* Optional: 404 Page */}
        <Route
          path="*"
          element={<div style={{ color: "white", padding: "20px" }}>Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
