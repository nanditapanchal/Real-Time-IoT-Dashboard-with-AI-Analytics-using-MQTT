# 📘 ML Notebook Instructions — IoT Dashboard

### 1️⃣ Data Ingestion
- Load `sensor_data.csv` or pull from MongoDB (`sensor_readings`).
- Check timestamp format and convert to datetime.

### 2️⃣ Exploratory Data Analysis
- Plot temperature and humidity trends.
- Identify missing data or anomalies.

### 3️⃣ Feature Engineering
- Create lag features: `temp_lag1`, `hum_lag1`.
- Optional: rolling mean, time-of-day encoding.

### 4️⃣ Model Training
- Train `LinearRegression` for next temperature & humidity.
- Train `IsolationForest` for anomaly detection.

### 5️⃣ Evaluation
- Split into train/test (80/20).
- Plot predicted vs actual.

### 6️⃣ Save Artifacts
```python
joblib.dump(temp_model, "temp_model.joblib")
joblib.dump(hum_model, "hum_model.joblib")
joblib.dump(anom_model, "anomaly_model.joblib")
