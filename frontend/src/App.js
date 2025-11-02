import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import LiveData from "./components/LiveData";
import ChartSection from "./components/ChartSection";
import AlertBox from "./components/AlertBox";
import VoiceAssistant from "./components/VoiceAssistant";

const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    socket.on("new_data", (newData) => {
      setData((prev) => [...prev.slice(-19), newData]);
    });
    socket.on("alert", (alertMsg) => setAlert(alertMsg));

    fetchPrediction();
    const predInterval = setInterval(fetchPrediction, 10000);
    return () => clearInterval(predInterval);
  }, []);

  const fetchPrediction = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/predict`);
    const json = await res.json();
    setPrediction(json);
  } catch (e) {
    console.error("Prediction fetch failed:", e);
  }
};


  const menuItems = ["Dashboard", "Live Data", "Analytics", "Alerts"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "linear-gradient(180deg, #1e88e5, #1565c0)",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: "700",
              fontSize: "1.5rem",
              marginBottom: "30px",
            }}
          >
            🌐 IoT Dashboard
          </h2>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {menuItems.map((item) => (
                <li
                  key={item}
                  onClick={() => setActivePage(item)}
                  style={{
                    marginBottom: "20px",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    background:
                      activePage === item ? "#1976d2" : "transparent",
                    cursor: "pointer",
                    transition: "0.3s",
                    fontWeight: activePage === item ? "600" : "400",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1976d2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      activePage === item ? "#1976d2" : "transparent")
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <footer style={{ fontSize: "0.8rem", opacity: "0.8" }}>
          © 2025 Smart IoT Systems
        </footer>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "30px 40px", position: "relative" }}>
        {/* Top Navbar */}
        <header
          style={{
            background: "white",
            padding: "15px 25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ fontSize: "1.6rem", color: "#2c3e50", fontWeight: "700" }}>
            {activePage}
          </h1>
          <div
            style={{
              background: "#1976d2",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            🔮 AI Predictions Active
          </div>
        </header>

        {/* Conditional Rendering for Pages */}
        {activePage === "Dashboard" && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
            }}
          >
            <div>
              <LiveData data={data[data.length - 1]} />
              {prediction && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #e1f5fe, #b3e5fc)",
                    borderRadius: "16px",
                    marginTop: "20px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3 style={{ color: "#01579b", fontWeight: "700" }}>
                    🤖 AI Predictions
                  </h3>
                  <p style={{ color: "#0277bd", fontSize: "1.1rem" }}>
                    Predicted Temperature:{" "}
                    <strong>{prediction.predicted_temperature} °C</strong>
                  </p>
                  <p style={{ color: "#0288d1", fontSize: "1.1rem" }}>
                    Predicted Humidity:{" "}
                    <strong>{prediction.predicted_humidity} %</strong>
                  </p>
                  <p
                    style={{
                      color:
                        prediction.anomaly_flag === "Normal"
                          ? "green"
                          : "red",
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginTop: "8px",
                    }}
                  >
                    Status: {prediction.anomaly_flag}
                  </p>
                </div>
              )}
            </div>

            <div>
              <ChartSection data={data} />
              <div style={{ marginTop: "20px" }}>
                <AlertBox alert={alert} />
              </div>
            </div>
          </section>
        )}

        {activePage === "Live Data" && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>📡 Live Data Feed</h3>
            <LiveData data={data[data.length - 1]} />
          </div>
        )}

        {activePage === "Analytics" && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>📊 Analytics Overview</h3>
            <ChartSection data={data} />
          </div>
        )}

        {activePage === "Alerts" && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>⚠️ System Alerts</h3>
            <AlertBox alert={alert} />
          </div>
        )}

        {/* 🧠 AI Voice Assistant (Floating Widget) */}
        <div
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: "1000",
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            width: "320px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          }}
        >
          <VoiceAssistant
            latestData={data[data.length - 1]}
            predictedData={prediction}
            data={data}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
