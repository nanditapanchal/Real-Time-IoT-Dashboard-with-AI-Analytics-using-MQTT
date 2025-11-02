import React, { useEffect, useState } from "react";
import LiveData from "../components/LiveData";
import ChartSection from "../components/ChartSection";
import AlertBox from "../components/AlertBox";
import VoiceAssistant from "../components/VoiceAssistant";
export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // ✅ Fetch last 100 sensor readings
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/data/history");
      const json = await res.json();
      setHistory(json);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // ✅ Fetch latest alert if any
  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/alerts");
      const json = await res.json();
      if (json.length > 0) {
        setAlert({
          message: "Temperature exceeded 32°C threshold!",
          data: json[0],
        });
      } else {
        setAlert(null);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // ✅ Fetch AI prediction (temperature & humidity forecast)
  const fetchPrediction = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/predict");
      const json = await res.json();
      setPrediction(json);
    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  };

  // ⏱️ Refresh every few seconds
  useEffect(() => {
    fetchHistory();
    fetchAlerts();
    fetchPrediction();
    const interval = setInterval(() => {
      fetchHistory();
      fetchAlerts();
      fetchPrediction();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌍 Real-Time IoT Dashboard
      </h1>

      <div className="flex flex-col items-center gap-6">
        <LiveData />

        {alert && <AlertBox alert={alert} />}

        <ChartSection data={history} />

        {prediction && (
          <div className="bg-white p-4 rounded-xl shadow-md text-center mt-4 w-1/2">
            <h3 className="text-xl font-semibold mb-2">🤖 AI Prediction</h3>
            <p>Next Temperature: {prediction.predicted_temperature} °C</p>
            <p>Next Humidity: {prediction.predicted_humidity} %</p>
            <p>
              Anomaly Status:{" "}
              <span
                style={{
                  color:
                    prediction.anomaly_flag === "Normal" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {prediction.anomaly_flag}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
