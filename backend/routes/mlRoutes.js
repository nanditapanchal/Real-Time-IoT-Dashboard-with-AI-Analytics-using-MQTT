import express from "express";
// import joblib from "joblib";
import mongoose from "mongoose";
import SensorData from "../models/SensorData.js";
const router = express.Router();

router.get("/predict", async (req, res) => {
  try {
    // Get latest 1 record from MongoDB
    const latest = await SensorData.findOne().sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No sensor data available" });
    }

    // Load trained models
    const tempModel = joblib.load("ml_model/temp_model.joblib");
    const humModel = joblib.load("ml_model/hum_model.joblib");
    const anomalyModel = joblib.load("ml_model/anomaly_model.joblib");

    // Prepare input
    const X = [[latest.temperature, latest.humidity]];

    // Make predictions
    const predTemp = tempModel.predict(X)[0];
    const predHum = humModel.predict(X)[0];
    const anomalyFlag = anomalyModel.predict(X)[0] === -1 ? "Anomaly" : "Normal";

    // Send response
    res.json({
      latest: {
        temperature: latest.temperature,
        humidity: latest.humidity,
      },
      prediction: {
        temperature: predTemp.toFixed(2),
        humidity: predHum.toFixed(2),
      },
      anomaly: anomalyFlag,
    });
  } catch (err) {
    console.error("ML prediction error:", err);
    res.status(500).json({ message: "ML prediction failed", error: err.message });
  }
});

export default router;
