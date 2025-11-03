import React from "react";

export default function AlertBox({ alert }) {
  if (!alert) return null;

  const isCritical = alert?.data?.temperature > 32;

  return (
    <div
      style={{
        background: isCritical
          ? "linear-gradient(135deg, #ff8a80, #ff5252)"
          : "linear-gradient(135deg, #fff9c4, #fff59d)",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        color: isCritical ? "#fff" : "#333",
      }}
    >
      <strong style={{ fontSize: "1.2rem" }}>
        {isCritical ? "🔥 Critical Alert!" : "⚠️ Warning"}
      </strong>
      <p style={{ margin: "10px 0", fontWeight: "500" }}>{alert.message}</p>
      {alert.data && (
        <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>
          <strong>Sensor Data:</strong>{" "}
          {`Temperature: ${alert.data.temperature}°C, Humidity: ${alert.data.humidity}%`}
        </p>
      )}
    </div>
  );
}
