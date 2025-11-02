import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mqtt from "mqtt";
import { Server } from "socket.io";
import http from "http";
import { spawn } from "child_process";
import dataRoutes from "./routes/api.js";
import mlRoutes from "./routes/mlRoutes.js";
import SensorData from "./models/SensorData.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "https://real-time-io-t-dashboard-with-ai-analytics-using-ljrz7ho1t.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api", dataRoutes);
app.use("/api/ml", mlRoutes);

// Server + Socket.io setup
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// MQTT Setup
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}:${process.env.MQTT_PORT}`);

mqttClient.on("connect", () => {
  console.log("📡 Connected to MQTT Broker");
  mqttClient.subscribe(process.env.MQTT_TOPIC, () =>
    console.log(`✅ Subscribed to topic: ${process.env.MQTT_TOPIC}`)
  );
});

mqttClient.on("message", async (topic, message) => {
  console.log(`📩 Message arrived on topic: ${topic}`);
  console.log("📦 Raw message:", message.toString());

  try {
    const data = JSON.parse(message.toString());
    console.log("✅ Parsed data:", data);

    if (
      !data.device_id ||
      data.temperature === undefined ||
      data.humidity === undefined ||
      data.air_quality === undefined
    ) {
      console.log("⚠️ Invalid data format, skipping...");
      return;
    }

    data.timestamp = new Date(data.timestamp);

    // ✅ Use the correct model name
    const sensor = new SensorData(data);
    await sensor.save();
    console.log("💾 Saved to MongoDB:", data);

    io.emit("new_data", data);
  } catch (err) {
    console.error("❌ Error parsing/saving MQTT message:", err);
  }
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/predict", (req, res) => {
  const scriptPath = path.join(__dirname, "../ml_model/predict.py");

  // ✅ Wrap script path in quotes to handle spaces (Windows-safe)
  const command = `python "${scriptPath}"`;

  const py = spawn(command, { shell: true });

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => (output += data.toString()));
  py.stderr.on("data", (data) => (errorOutput += data.toString()));

  py.on("close", () => {
    if (errorOutput) {
      console.error("⚠️ Prediction Error:", errorOutput);
      return res.status(500).json({ error: "Python script error", details: errorOutput });
    }

    try {
      const parsed = JSON.parse(output);
      res.json(parsed);
    } catch (e) {
      console.error("⚠️ JSON parse error:", output);
      res.type("text/plain").send(output);
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { SensorData };
