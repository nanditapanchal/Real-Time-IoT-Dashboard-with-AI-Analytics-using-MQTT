import React from "react";

export default function AlertBox({ alert }) {
  if (!alert) return null;
  return (
    <div style={{ background: "#ffcccc", padding: "10px", marginTop: "20px" }}>
      <strong>⚠️ Alert:</strong> {alert.message}
      <br />
      <small>{JSON.stringify(alert.data)}</small>
    </div>
  );
}
