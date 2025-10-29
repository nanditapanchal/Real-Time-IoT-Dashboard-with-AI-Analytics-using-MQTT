import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function ChartSection({ data }) {
  if (!data.length) return null;
  const labels = data.map((d) => new Date(d.timestamp).toLocaleTimeString());
  const temp = data.map((d) => d.temperature);
  const humidity = data.map((d) => d.humidity);

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h3>Sensor Trends</h3>
      <Line
        data={{
          labels,
          datasets: [
            { label: "Temperature (°C)", data: temp },
            { label: "Humidity (%)", data: humidity },
          ],
        }}
      />
    </div>
  );
}
