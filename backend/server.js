import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mqtt from "mqtt";
import { Server } from "socket.io";
import http from "http";
import { spawn } from "child_process";   // ✅ moved up
import dataRoutes from "./routes/api.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", dataRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

const sensorSchema = new mongoose.Schema({
  device_id: String,
  temperature: Number,
  humidity: Number,
  air_quality: Number,
  timestamp: Date,
});
const Sensor = mongoose.model("Sensor", sensorSchema);

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

    if (!data.device_id || data.temperature === undefined || data.humidity === undefined || data.air_quality === undefined) {
      console.log("⚠️ Invalid data format, skipping...");
      return;
    }

    data.timestamp = new Date(data.timestamp);
    const sensor = new Sensor(data);
    await sensor.save();
    console.log("💾 Saved to MongoDB:", data);

    io.emit("new_data", data);
  } catch (err) {
    console.error("❌ Error parsing/saving MQTT message:", err);
  }
});

// ✅ Prediction endpoint (before server.listen)
app.get("/api/predict", (req, res) => {
  const py = spawn("python", ["../ml_model/predict.py"]);
  let result = "";

  py.stdout.on("data", (data) => (result += data.toString()));
  py.stderr.on("data", (err) => console.error("Prediction Error:", err.toString()));

  py.on("close", () => {
    res.type("text/plain").send(result);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { Sensor };
