// frontend/src/components/LiveData.js
import React, { useEffect, useState } from "react";

export default function LiveData() {
  const [data, setData] = useState({ temperature: 0, humidity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/data/live");
        const json = await res.json();

        // ✅ Validate data before setting it
        if (
          json &&
          typeof json.temperature === "number" &&
          typeof json.humidity === "number"
        ) {
          setData(json);
        } else {
          console.warn("⚠️ Invalid data received:", json);
          setData({ temperature: 0, humidity: 0 });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching live data:", err);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2">🌡️ Live Sensor Data</h2>
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-xl font-semibold mb-2">🌡️ Live Sensor Data</h2>
      <p className="text-lg">Temperature: {data.temperature} °C</p>
      <p className="text-lg">Humidity: {data.humidity} %</p>
    </div>
  );
}
