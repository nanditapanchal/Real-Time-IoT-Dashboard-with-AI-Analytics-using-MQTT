import React, { useState, useEffect, useRef } from "react";

export default function VoiceAssistant({ latestData, predictedData, data = [] }) {
  const [listening, setListening] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  // 🗣 Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserQuery(transcript);
    };

    recog.onend = () => setListening(false);
    setRecognition(recog);
  }, []);

  // 🎧 Scroll chat to latest
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // 🎤 Start/stop listening
  const toggleListening = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
      setShowChat(true);
    }
  };

  // 💬 Handle user query
  const handleUserQuery = (query) => {
    addMessage("user", query);
    const reply = generateReply(query);
    addMessage("bot", reply);
    speak(reply);
  };

  // 🧠 AI reply generator
  const generateReply = (query) => {
    if (!latestData && !predictedData) {
      return "Sorry, I don’t have any live sensor data yet.";
    }

    const temps = data.map((d) => d.temperature).filter((t) => !isNaN(t));
    const hums = data.map((d) => d.humidity).filter((h) => !isNaN(h));
    const currentTemp =
      latestData?.temperature ?? predictedData?.predicted_temperature ?? 0;
    const currentHum =
      latestData?.humidity ?? predictedData?.predicted_humidity ?? 0;
    const lower = query.toLowerCase();

    if (lower.includes("current temperature"))
      return `The current temperature is around ${currentTemp.toFixed(1)}°C.`;

    if (lower.includes("current humidity"))
      return `The current humidity level is ${currentHum.toFixed(1)}%.`;

    if (lower.includes("highest"))
      return temps.length
        ? `The highest temperature recorded so far is ${Math.max(...temps).toFixed(
            1
          )}°C.`
        : "No temperature records available yet.";

    if (lower.includes("lowest"))
      return temps.length
        ? `The lowest temperature recorded so far is ${Math.min(...temps).toFixed(
            1
          )}°C.`
        : "No temperature records available yet.";

    if (lower.includes("average"))
      return temps.length && hums.length
        ? `The average temperature today is ${(
            temps.reduce((a, b) => a + b, 0) / temps.length
          ).toFixed(1)}°C and average humidity is ${(
            hums.reduce((a, b) => a + b, 0) / hums.length
          ).toFixed(1)}%.`
        : "No data available to calculate averages.";

    if (lower.includes("next hour") || lower.includes("prediction"))
      return predictedData
        ? `In the next hour, the temperature is expected around ${predictedData.predicted_temperature}°C and humidity near ${predictedData.predicted_humidity}%.`
        : "Prediction data is not available yet.";

    if (lower.includes("air quality"))
      return "Air quality seems moderate. Consider opening your windows for better ventilation.";

    if (lower.includes("window"))
      return "Opening windows can improve air circulation if the outdoor air is clean.";

    return "I'm here to assist with temperature, humidity, and predictions. Try asking: 'What's the next hour prediction?'";
  };

  // 🔊 Voice output
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;
    synth.speak(utter);
  };

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserQuery(input.trim());
      setInput("");
    }
  };

  // 🎨 UI Rendering
  return (
    <>
      {/* 🎙 Floating Button */}
      <div
        onClick={toggleListening}
        style={{
          position: "fixed",
          bottom: 25,
          right: 25,
          background: listening ? "#e53935" : "#1976d2",
          color: "white",
          borderRadius: "50%",
          width: 65,
          height: 65,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          transition: "0.3s ease",
          zIndex: 1000,
        }}
        title="Ask the AI Assistant"
      >
        🎙️
      </div>

      {/* 💬 Chat Window */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 25,
            width: 340,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            maxHeight: 360,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: "#1976d2",
              marginBottom: 8,
              fontSize: 16,
            }}
          >
            🤖 AI Assistant
          </div>

          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 5,
              marginBottom: 8,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <span
                  style={{
                    background: m.role === "user" ? "#1976d2" : "#f1f1f1",
                    color: m.role === "user" ? "white" : "black",
                    padding: "7px 10px",
                    borderRadius: 10,
                    display: "inline-block",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <form onSubmit={handleSubmit} style={{ display: "flex" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px 0 0 8px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "0 8px 8px 0",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
