import React, { useState } from "react";
import "./LandingPage.css";

function LandingPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

const handleSend = async (e) => {
  e.preventDefault();
  
  // 1. Basic Validation
  // Trim the input to check for empty or whitespace-only strings
  const trimmedInput = input.trim(); 
  if (!trimmedInput && !file) return;

  // 2. Add User Message (IMMEDIATELY and using the functional update form)
  const userMessage = {
    sender: "user",
    text: trimmedInput, // Use trimmed input for display
    fileName: file ? file.name : null,
  };
  
  // Use the functional form to ensure you're working with the latest state
  setMessages((prevMessages) => [...prevMessages, userMessage]); 

  // 3. Prepare Form Data & API Call
  const formData = new FormData();
  if (file) formData.append("file", file);
  formData.append("prompt", trimmedInput);

  // 4. Reset Input and File States (Do this BEFORE the await)
  // Clear the controlled components' state
  setInput("");
  setFile(null); 
  
  // Manually clear the <input type="file"> element's value
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = ""; 
  }

  // 5. Fetch Data and Handle Response
  try {
    const res = await fetch("http://localhost:5000/summarize", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // Add AI response
    const aiMessage = {
      sender: "ai",
      text: data.summary || "No summary generated.",
    };
    
    // Use functional form again to add the AI message after the response
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
  } catch (err) {
    console.error("Fetch error:", err);
    
    // Add error message to chat window
    const errorMessage = { sender: "ai", text: "⚠️ Error processing request." };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  }
};

  return (
    <section className="landing-section">
      <div className="chat-container">
        <h2>Research Paper Summarizer</h2>

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.fileName && <p className="file-attachment">📎 {msg.fileName}</p>}
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form className="chat-input-area" onSubmit={handleSend}>
          <label htmlFor="fileInput" className="file-label">📎</label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          <input
            type="text"
            placeholder="Type your prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">➤</button>
        </form>
      </div>
    </section>
  );
}

export default LandingPage;
