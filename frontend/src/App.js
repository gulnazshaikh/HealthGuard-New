import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import UploadPage from "./components/UploadPage";
import QuickReview from "./components/QuickReview";
import ChatWithCSV from "./components/ChatWithCSV";
import VisualizePage from "./components/VisualizePage";
import TrainModel from "./components/TrainModel";
import Login from "./Login";
import Register from "./Register";

import "./App.css";

function App() {
  const [user, setUser] = useState(undefined); // undefined first

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Jab tak Firebase check kar raha hai
  if (user === undefined) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        {/* If not logged in */}
        {!user && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* If logged in */}
        {user && (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<UploadPage />} />
            <Route path="/chat" element={<ChatWithCSV />} />
            <Route path="/review" element={<QuickReview />} />
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/train" element={<TrainModel />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;