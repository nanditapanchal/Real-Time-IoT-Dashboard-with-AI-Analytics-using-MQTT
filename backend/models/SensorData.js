import mongoose from "mongoose";

// Define a schema for IoT sensor data
const sensorSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    air_quality: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "sensor_readings", // name of MongoDB collection
  }
);

// ✅ Create and export the model (only once)
const SensorData = mongoose.model("SensorData", sensorSchema);

export default SensorData;
