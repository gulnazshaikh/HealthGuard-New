import React, { useState } from "react";
import axios from "axios";

export default function ChatWithCSV() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "⚠️ Ask dataset related questions (rows, columns, summary, missing values)." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    const userMessage = { type: "user", text: question };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question: question
      });

      let botReply = "❌ No response from server.";

      if (res.data.answer) {
        botReply = res.data.answer;
      } else if (res.data.error) {
        botReply = "❌ " + res.data.error;
      }

      setMessages(prev => [...prev, { type: "bot", text: botReply }]);

    } catch (error) {
      console.error("CHAT ERROR:", error);
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "⚠️ Backend error. Make sure CSV is uploaded & cleaned." }
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div style={{ width: "70%", margin: "auto", marginTop: "30px" }}>
      <h2>🤖 Chat with CSV</h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "15px",
          background: "#f9f9f9"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              marginBottom: "10px"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "15px",
                background: msg.type === "user" ? "#4CAF50" : "#e0e0e0",
                color: msg.type === "user" ? "white" : "black",
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && <p>🤖 Thinking...</p>}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask about your dataset..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleAsk}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            background: "#4CAF50",
            color: "white",
            cursor: "pointer"
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}