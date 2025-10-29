import express from "express";
import { Sensor } from "../server.js";

const router = express.Router();

// ✅ Fetch last 100 records
router.get("/data/history", async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Server error fetching history" });
  }
});

// ✅ Fetch latest record safely
router.get("/data/live", async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ timestamp: -1 });

    if (!latest) {
      console.log("⚠️ No sensor data yet in MongoDB");
      return res.json({ message: "No data yet", temperature: 0, humidity: 0 });
    }

    res.json(latest);
  } catch (err) {
    console.error("Error fetching live data:", err);
    res.status(500).json({ error: "Server error fetching live data" });
  }
});

// ✅ Fetch alerts (temperature > 32°C)
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Sensor.find({ temperature: { $gt: 32 } })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(alerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: "Server error fetching alerts" });
  }
});

export default router;
