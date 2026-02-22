import React, { useState } from "react";
import axios from "axios";

export default function ChatWithCSV() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      setAnswer("❌ Please type a question first.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question: question
      });

      if (res.data.answer) {
        setAnswer(res.data.answer);
      } else if (res.data.error) {
        setAnswer("❌ " + res.data.error);
      } else {
        setAnswer("❌ No response from server.");
      }

    } catch (error) {
      console.error("CHAT ERROR:", error);
      setAnswer("⚠️ Backend error. Make sure CSV is uploaded & cleaned.");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <h2>🤖 Chat with CSV (Gemini AI)</h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about your dataset..."
        style={{ width: "60%", padding: "10px" }}
      />

      <button 
        onClick={handleAsk}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        Ask
      </button>

      {loading && <p>🤖 Thinking...</p>}

      <div style={{ marginTop: "20px" }}>
        <h3>Answer:</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
      </div>
    </div>
  );
}