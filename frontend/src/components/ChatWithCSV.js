import React, { useState } from "react";
import axios from "axios";

export default function ChatWithCSV() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      setAnswer("❌ Please type a question first.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question: question
      });

      if (res.data && res.data.answer) {
        setAnswer(res.data.answer);
      } else {
        setAnswer("❌ No answer received from backend.");
      }
    } catch (err) {
      console.error(err);
      setAnswer("⚠️ Backend error. Upload & clean CSV first.");
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

      <div style={{ marginTop: "20px" }}>
        <h3>Answer:</h3>
        <p>{answer}</p>
      </div>
    </div>
  );
}
