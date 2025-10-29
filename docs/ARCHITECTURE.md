# Architecture Diagram (textual)

[IoT Device / Simulator]
        |
        | MQTT (topic: sensors/room1)
        v
[MQTT Broker (Mosquitto / HiveMQ)]
        |
        | MQTT subscription
        v
[Backend - Node.js Express]
  - Subscribes to MQTT, saves to MongoDB
  - Emits Socket.io events to frontend
  - Exposes REST APIs (/api/history, /api/current, /api/alerts)
        |
        v
[Frontend - React]
  - Connects to backend via Socket.io and REST
  - Displays live readings, charts, alerts
        |
        v
[ML Component - Python]
  - Reads historical data from MongoDB
  - Trains regression & anomaly detection models
  - Models saved and can be loaded by backend or separate service
