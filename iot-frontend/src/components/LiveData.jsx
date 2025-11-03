import React from "react";

export default function LiveData({ data }) {
  if (!data) return <p>Loading live data...</p>;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fff3e0, #ffecb3)",
        borderRadius: "16px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#e65100", fontWeight: "700", marginBottom: "10px" }}>
        🌡️ Live Sensor Data
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#333",
        }}
      >
        <div>
          <p style={{ color: "#d84315", margin: "5px 0" }}>
            Temperature:{" "}
            <span style={{ fontWeight: "700" }}>
              {data.temperature?.toFixed(2)} °C
            </span>
          </p>
        </div>
        <div>
          <p style={{ color: "#00695c", margin: "5px 0" }}>
            Humidity:{" "}
            <span style={{ fontWeight: "700" }}>
              {data.humidity?.toFixed(2)} %
            </span>
          </p>
        </div>
      </div>
      <p style={{ color: "#777", marginTop: "10px", fontSize: "0.9rem" }}>
        Last Updated:{" "}
        <strong>{new Date(data.timestamp).toLocaleTimeString()}</strong>
      </p>
    </div>
  );
}
