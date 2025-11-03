import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function ChartSection({ data }) {
  if (!data || !data.length)
    return <p style={{ textAlign: "center" }}>No chart data available.</p>;

  const labels = data.map((d) => new Date(d.timestamp).toLocaleTimeString());
  const temp = data.map((d) => d.temperature);
  const humidity = data.map((d) => d.humidity);

  const chartData = {
    labels,
    datasets: [
      {
        label: "🌡️ Temperature (°C)",
        data: temp,
        borderColor: "#e53935",
        backgroundColor: "rgba(229,57,53,0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "💧 Humidity (%)",
        data: humidity,
        borderColor: "#1e88e5",
        backgroundColor: "rgba(30,136,229,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 13 } } },
    },
    scales: {
      x: { ticks: { color: "#555" } },
      y: { ticks: { color: "#555" } },
    },
  };

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px", color: "#2c3e50" }}>
        📊 Sensor Data Trends
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
