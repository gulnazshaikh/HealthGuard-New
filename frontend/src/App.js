import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadPage from "./components/UploadPage";
import QuickReview from "./components/QuickReview";
import ChatWithCSV from "./components/ChatWithCSV";
import VisualizePage from "./components/VisualizePage";
import TrainModel from "./components/TrainModel"; // ✅ IMPORTANT

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<UploadPage />} />
        <Route path="/chat" element={<ChatWithCSV />} />
        <Route path="/review" element={<QuickReview />} />
        <Route path="/visualize" element={<VisualizePage />} />
        <Route path="/train" element={<TrainModel />} /> {/* ✅ FIXED */}
      </Routes>
    </Router>
  );
}

export default App;
