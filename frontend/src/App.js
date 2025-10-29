import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import LiveData from "./components/LiveData";
import ChartSection from "./components/ChartSection";
import AlertBox from "./components/AlertBox";

const socket = io("http://localhost:5000");

function App() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    socket.on("new_data", (newData) => {
      setData((prev) => [...prev.slice(-19), newData]);
    });
    socket.on("alert", (alertMsg) => setAlert(alertMsg));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🌡️ Real-Time IoT Dashboard</h2>
      <LiveData data={data[data.length - 1]} />
      <ChartSection data={data} />
      <AlertBox alert={alert} />
    </div>
  );
}

export default App;
