import React, { useState } from "react";
import axios from "axios";

export default function ChatWithCSV() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("⚠️ Error fetching answer from backend.");
    }
  };

  return (
    <div className="page">
      <h2>Chat with CSV</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about your CSV..."
      />
      <button onClick={handleAsk}>Ask</button>
      <div>
        <h3>Answer:</h3>
        <p>{answer}</p>
      </div>
    </div>
  );
}
