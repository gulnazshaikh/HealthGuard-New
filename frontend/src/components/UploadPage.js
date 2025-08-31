import React, { useState } from "react";
import "./UploadPage.css";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      setMessage("File uploaded successfully!");
    } else {
      setMessage("Please choose a file first.");
    }
  };

  const handleClean = () => {
    if (file) {
      setMessage("CSV cleaned successfully!");
    } else {
      setMessage("Upload or cleaning failed!");
    }
  };

  return (
    <div className="upload-section">
      <h1>HealthGuard</h1>

      <input type="file" onChange={handleFileChange} />
      {file && <p>{file.name}</p>}

      <div className="buttons">
        <button onClick={handleUpload} className="upload-btn">
          Upload
        </button>
        <button onClick={handleClean} className="clean-btn">
          Clean CSV
        </button>
      </div>

      <a href="/review" className="report-link">
        View Quick Review Report →
      </a>

      <button className="download-btn">Download Report</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UploadPage;
