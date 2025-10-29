# Real‑Time IoT Dashboard with AI Analytics using MQTT

## Project Structure
- /frontend — React app (connects to backend via Socket.io + REST)
- /backend — Node.js Express server that subscribes to MQTT, stores to MongoDB, exposes APIs and Socket.io events
- /ml_model — Python scripts to train a simple regression and anomaly detection model using stored data
- /docs — This documentation and setup steps
- mqtt_publisher.py — MQTT data simulator (publishes JSON every 5 seconds)

## Quick Setup (local)
1. Start MongoDB locally (or set MONGODB_URI to a hosted DB).
2. Backend:
   - cd backend
   - npm install
   - edit .env if needed
   - npm start
3. Frontend:
   - cd frontend
   - npm install
   - npm start
4. Run the publisher:
   - python3 mqtt_publisher.py --broker test.mosquitto.org --topic sensors/room1
5. Train ML models:
   - cd ml_model
   - pip install -r requirements.txt
   - python train_model.py

## Features implemented in skeleton
- MQTT publisher script (Python)
- Backend that subscribes to MQTT topic, saves readings to MongoDB, emits live events via Socket.io
- Frontend React app that shows live reading, historical chart and alerts
- ML training script (LinearRegression) and anomaly detector (IsolationForest)
- Basic REST endpoints for history, current reading and alerts

## Deployment notes
- You can dockerize each component and orchestrate with docker-compose (not included in skeleton).
- For production use, use a managed MQTT broker (HiveMQ Cloud / EMQX) and hosted MongoDB Atlas.

## Deliverables
- Project folder containing /frontend /backend /ml_model /docs and mqtt_publisher.py
