import os
import joblib
import pandas as pd
import numpy as np
import json

# Optional MongoDB import
try:
    from pymongo import MongoClient
    _HAS_PYMONGO = True
except Exception:
    _HAS_PYMONGO = False

# ✅ Match your actual saved model names (.joblib)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_TEMP = os.path.join(BASE_DIR, "temp_model.joblib")
MODEL_HUM = os.path.join(BASE_DIR, "hum_model.joblib")
MODEL_ANOM = os.path.join(BASE_DIR, "anomaly_model.joblib")
DATA_CSV = os.path.join(BASE_DIR, "sensor_data.csv")


def load_latest_from_mongo(uri=None):
    if not _HAS_PYMONGO:
        return None
    uri = uri or os.environ.get("MONGODB_URI")
    if not uri:
        return None
    try:
        client = MongoClient(uri)
        db = client.get_default_database() or client["iot_dashboard"]
        col = db["sensor_readings"]
        data = list(col.find().sort("timestamp", -1).limit(10))
        if not data:
            return None
        df = pd.DataFrame(data)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        return df
    except Exception:
        return None


def load_latest_from_csv(path=DATA_CSV):
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df.tail(10) if not df.empty else None


def build_features_from_df(df):
    df = df.sort_values("timestamp").reset_index(drop=True)

    # Ensure required columns
    for col in ["temperature", "humidity", "air_quality"]:
        if col not in df.columns:
            df[col] = 0

    # ✅ Create lag features (just like training)
    df["temp_lag1"] = df["temperature"].shift(1)
    df["hum_lag1"] = df["humidity"].shift(1)
    df = df.dropna()

    # ✅ Use exactly the same 5 features as in training
    X = df[["temperature", "humidity", "air_quality", "temp_lag1", "hum_lag1"]]
    return df, X


def main():
    # Ensure models exist
    if not (os.path.exists(MODEL_TEMP) and os.path.exists(MODEL_HUM) and os.path.exists(MODEL_ANOM)):
        print(json.dumps({"error": "Model files not found. Run train_model.py first."}))
        return

    # Load models
    temp_model = joblib.load(MODEL_TEMP)
    hum_model = joblib.load(MODEL_HUM)
    anom_model = joblib.load(MODEL_ANOM)

    # Load data
    df = load_latest_from_mongo() or load_latest_from_csv()
    if df is None:
        print(json.dumps({"error": "No data available for prediction."}))
        return

    df_proc, X = build_features_from_df(df)
    if X is None or X.empty:
        print(json.dumps({"error": "Insufficient data to make prediction."}))
        return

    # Predict next values
    last_row = X.iloc[[-1]]
    pred_temp = temp_model.predict(last_row)[0]
    pred_hum = hum_model.predict(last_row)[0]
    anom_flag = anom_model.predict(last_row)[0]

    result = {
        "predicted_temperature": round(float(pred_temp), 2),
        "predicted_humidity": round(float(pred_hum), 2),
        "anomaly_flag": "ANOMALY" if anom_flag == -1 else "Normal"
    }

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
