import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
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
      </div>
    </nav>
  );
}
