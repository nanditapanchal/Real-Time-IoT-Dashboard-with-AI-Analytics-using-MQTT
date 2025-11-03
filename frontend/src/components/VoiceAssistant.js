// import React, { useState, useEffect } from "react";

// export default function VoiceAssistant({ latestData, predictedData, data = [] }) {
//   const [listening, setListening] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [recognition, setRecognition] = useState(null);

//   // 🗣 Initialize SpeechRecognition
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }

//     const recog = new SpeechRecognition();
//     recog.continuous = false;
//     recog.lang = "en-US";

//     recog.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       handleUserQuery(transcript);
//     };

//     recog.onend = () => setListening(false);
//     setRecognition(recog);
//   }, []);

//   // 🎤 Start/stop listening
//   const toggleListening = () => {
//     if (!recognition) return;
//     if (listening) {
//       recognition.stop();
//       setListening(false);
//     } else {
//       setListening(true);
//       recognition.start();
//     }
//   };

//   // 💬 Handle user query
//   const handleUserQuery = (rawQuery) => {
//     const query = rawQuery.trim().toLowerCase();
//     addMessage("user", rawQuery);

//     const reply = generateReply(query);
//     addMessage("bot", reply);
//     speak(reply);
//   };

//   // 🧠 Generate smart replies
//   const generateReply = (query) => {
//     const temps = data.map((d) => d.temperature).filter((t) => !isNaN(t));
//     const hums = data.map((d) => d.humidity).filter((h) => !isNaN(h));

//     const currentTemp =
//       latestData?.temperature ?? predictedData?.predicted_temperature;
//     const currentHum =
//       latestData?.humidity ?? predictedData?.predicted_humidity;

//     let reply = "";

//     if (query.includes("next hour")) {
//       if (predictedData)
//         reply = `In the next hour, the temperature is expected around ${predictedData.predicted_temperature?.toFixed?.(2)}°C and humidity near ${predictedData.predicted_humidity?.toFixed?.(2)}%.`;
//       else reply = "Sorry, I don’t have prediction data yet.";
//     }

//     else if (query.includes("highest")) {
//       if (temps.length > 0)
//         reply = `The highest temperature recorded so far is ${Math.max(...temps).toFixed(2)}°C.`;
//       else reply = "No temperature data available yet.";
//     }

//     else if (query.includes("lowest")) {
//       if (temps.length > 0)
//         reply = `The lowest temperature recorded so far is ${Math.min(...temps).toFixed(2)}°C.`;
//       else reply = "No temperature data available yet.";
//     }

//     else if (query.includes("current temperature")) {
//       if (currentTemp)
//         reply = `The current temperature is around ${currentTemp.toFixed(2)}°C.`;
//       else reply = "Sorry, I don’t have any live sensor data yet.";
//     }

//     else if (query.includes("current humidity")) {
//       if (currentHum)
//         reply = `The current humidity level is ${currentHum.toFixed(2)} percent.`;
//       else reply = "Sorry, I don’t have any live sensor data yet.";
//     }

//     else if (query.includes("average")) {
//       if (temps.length && hums.length)
//         reply = `Today's average temperature is ${(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)}°C and average humidity is ${(hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(2)}%.`;
//       else reply = "No data available to calculate averages.";
//     }

//     else if (query.includes("air") && query.includes("quality")) {
//       reply = "Air quality seems moderate. You can open your windows for better ventilation.";
//     }

//     else if (query.includes("window")) {
//       reply = "Opening windows could help regulate indoor temperature and air quality.";
//     }

//     else {
//       reply = "I'm here to assist with temperature, humidity, and predictions. Try asking: 'What's the next hour prediction?'";
//     }

//     return reply;
//   };

//   // 📢 Voice output
//   const speak = (text) => {
//     const synth = window.speechSynthesis;
//     if (!synth) return;
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.lang = "en-US";
//     utter.rate = 1;
//     synth.speak(utter);
//   };

//   const addMessage = (role, text) => {
//     setMessages((prev) => [...prev, { role, text }]);
//   };

//   // 🧭 UI
//   return (
//     <>
//       {/* Floating Mic Button */}
//       <div
//         onClick={toggleListening}
//         style={{
//           position: "fixed",
//           bottom: 25,
//           right: 25,
//           background: listening ? "#e53935" : "#1976d2",
//           color: "white",
//           borderRadius: "50%",
//           width: 65,
//           height: 65,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 28,
//           cursor: "pointer",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
//           zIndex: 1000,
//         }}
//         title="Ask the AI Assistant"
//       >
//         🎙️
//       </div>

//       {/* Chat Window */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: 100,
//           right: 25,
//           width: 340,
//           background: "white",
//           borderRadius: 12,
//           boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
//           padding: 12,
//           maxHeight: 350,
//           overflowY: "auto",
//           zIndex: 999,
//         }}
//       >
//         <h4 style={{ textAlign: "center", color: "#1976d2", marginBottom: 8 }}>
//           🤖 AI Assistant
//         </h4>

//         {messages.map((m, i) => (
//           <div
//             key={i}
//             style={{
//               textAlign: m.role === "user" ? "right" : "left",
//               margin: "5px 0",
//             }}
//           >
//             <span
//               style={{
//                 background: m.role === "user" ? "#1976d2" : "#f1f1f1",
//                 color: m.role === "user" ? "white" : "black",
//                 padding: "7px 10px",
//                 borderRadius: 10,
//                 display: "inline-block",
//                 maxWidth: "85%",
//                 wordWrap: "break-word",
//               }}
//             >
//               {m.text}
//             </span>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";

export default function VoiceAssistant({ latestData, predictedData, data = [] }) {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);

  // 🧠 Initialize SpeechRecognition
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

  // 🎙️ Toggle listening
  const toggleListening = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setListening(true);
      recognition.start();
    }
  };

  // 💬 Handle user voice/text query
  const handleUserQuery = (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();
    addMessage("user", rawQuery);

    const reply = generateReply(query);
    addMessage("bot", reply);
    speak(reply);
  };

  // 🧩 Generate AI-like response
  const generateReply = (query) => {
    const temps = data.map((d) => d.temperature).filter((t) => !isNaN(t));
    const hums = data.map((d) => d.humidity).filter((h) => !isNaN(h));

    const currentTemp =
      latestData?.temperature ?? predictedData?.predicted_temperature;
    const currentHum =
      latestData?.humidity ?? predictedData?.predicted_humidity;

    let reply = "";

    // --- AI logic ---
    if (query.includes("next hour")) {
      if (predictedData)
        reply = `In the next hour, the temperature is expected around ${predictedData.predicted_temperature?.toFixed(
          2
        )}°C and humidity near ${predictedData.predicted_humidity?.toFixed(
          2
        )}%.`;
      else reply = "Sorry, I don’t have prediction data yet.";
    }

    else if (query.includes("highest")) {
      if (temps.length)
        reply = `The highest temperature recorded so far is ${Math.max(
          ...temps
        ).toFixed(2)}°C.`;
      else reply = "No temperature data available yet.";
    }

    else if (query.includes("lowest")) {
      if (temps.length)
        reply = `The lowest temperature recorded so far is ${Math.min(
          ...temps
        ).toFixed(2)}°C.`;
      else reply = "No temperature data available yet.";
    }

    else if (query.includes("current temperature")) {
      if (currentTemp)
        reply = `The current temperature is around ${currentTemp.toFixed(
          2
        )}°C.`;
      else reply = "Sorry, I don’t have any live sensor data yet.";
    }

    else if (query.includes("humidity")) {
      if (currentHum)
        reply = `The current humidity level is ${currentHum.toFixed(
          2
        )} percent.`;
      else reply = "Sorry, I don’t have any humidity data yet.";
    }

    else if (query.includes("average")) {
      if (temps.length && hums.length)
        reply = `Today's average temperature is ${(temps.reduce(
          (a, b) => a + b,
          0
        ) / temps.length).toFixed(2)}°C and average humidity is ${(
          hums.reduce((a, b) => a + b, 0) / hums.length
        ).toFixed(2)}%.`;
      else reply = "Not enough data to calculate averages yet.";
    }

    // 🌧️ Weather-related keywords
    else if (
      query.includes("rain") ||
      query.includes("barish") ||
      query.includes("storm") ||
      query.includes("aandhi") ||
      query.includes("toofan") ||
      query.includes("flood")
    ) {
      if (currentHum > 75 || predictedData?.predicted_humidity > 75)
        reply =
          "It looks quite humid. There’s a chance of rain today. Keep an umbrella handy!";
      else if (currentTemp > 35)
        reply =
          "The temperature is high and humidity is moderate — unlikely to rain soon.";
      else
        reply =
          "No signs of rain or storm detected based on current conditions.";
    }

    // 🌡️ Safety or comfort prompts
    else if (query.includes("safe") || query.includes("weather")) {
      reply =
        "Weather seems normal right now. Stay hydrated and avoid direct sunlight if it gets hotter.";
    }

    else {
      reply =
        "I'm here to assist with temperature, humidity, and weather. Try asking: 'Will it rain today?' or 'What's the highest temperature?'";
    }

    return reply;
  };

  // 🔊 Speak out loud
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    synth.speak(utter);
  };

  // 💡 Auto alerts based on live data
  useEffect(() => {
    if (!latestData) return;
    if (latestData.temperature > 35)
      speak("⚠️ Warning: High temperature detected. Stay hydrated!");
    if (latestData.humidity > 85)
      speak("⚠️ Humidity levels are very high. There might be a chance of rain.");
  }, [latestData]);

  // 🪶 Helper
  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  // 💬 UI
  return (
    <>
      {/* 🎤 Floating Mic Button */}
      <div
        onClick={toggleListening}
        style={{
          position: "fixed",
          bottom: 25,
          right: 25,
          background: listening ? "#d32f2f" : "#1976d2",
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
          zIndex: 1000,
        }}
        title="Ask the AI Assistant"
      >
        🎙️
      </div>

      {/* 💬 Chat Window */}
      <div
        style={{
          position: "fixed",
          bottom: 100,
          right: 25,
          width: 350,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
          padding: 12,
          maxHeight: 370,
          overflowY: "auto",
          zIndex: 999,
          fontFamily: "Arial",
        }}
      >
        <h4 style={{ textAlign: "center", color: "#1976d2", marginBottom: 8 }}>
          🤖 AI Assistant
        </h4>

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
    </>
  );
}
