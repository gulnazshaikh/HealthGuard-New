import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Server Response:", response.data);
      alert("File uploaded and cleaned successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
