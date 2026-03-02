import React from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

export default function Navbar() {

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">HealthGuard</span>
      </div>

      <div className="navbar-right">
        <NavLink to="/home" className="link">Home</NavLink>
        <NavLink to="/chat" className="link">Chat with CSV</NavLink>
        <NavLink to="/review" className="link">Quick Review</NavLink>
        <NavLink to="/visualize" className="link">Visualize</NavLink>
        <NavLink to="/train" className="link">Train Your Model</NavLink>

        {/* 🔥 Logout Button Added */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}