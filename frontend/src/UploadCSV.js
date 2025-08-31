import React, { useState } from 'react';
import axios from 'axios';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setResponse(res.data);
    } catch (error) {
      alert('Upload failed. Make sure Flask server is running.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Health CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Upload Result:</h3>
          <p><strong>Message:</strong> {response.message}</p>
          <p><strong>Columns:</strong> {response.columns.join(', ')}</p>
          <p><strong>Rows:</strong> {response.rows}</p>
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
