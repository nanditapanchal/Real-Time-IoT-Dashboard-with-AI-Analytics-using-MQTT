

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest

# Optional MongoDB import
try:
    from pymongo import MongoClient
    _HAS_PYMONGO = True
except Exception:
    _HAS_PYMONGO = False


DATA_CSV = "sensor_data.csv"
MONGO_URI_ENV = "MONGODB_URI"
COLLECTION_NAME = "sensor_readings"


def load_data_from_csv(path=DATA_CSV, limit=None):
    if not os.path.exists(path):
        return None
    print(f"📄 Loading data from CSV: {path}")
    df = pd.read_csv(path, parse_dates=["timestamp"]) if "timestamp" in pd.read_csv(path, nrows=0).columns else pd.read_csv(path)
    if limit:
        df = df.tail(limit)
    return df


def load_data_from_mongo(uri=None, limit=5000):
    if not _HAS_PYMONGO:
        return None
    uri = uri or os.environ.get(MONGO_URI_ENV)
    if not uri:
        return None
    print("🌐 Attempting to load data from MongoDB...")
    client = MongoClient(uri)
    db = client.get_default_database() if client else None
    if db is None:
        db = client["iot_dashboard"]
    col = db[COLLECTION_NAME]
    cursor = col.find().sort("timestamp", -1).limit(limit)
    data = list(cursor)
    if not data:
        return None
    df = pd.DataFrame(data)
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df


def generate_synthetic(n=1000, seed=42):
    print(f"🧪 Generating synthetic data for training (n={n})")
    rng = np.random.RandomState(seed)
    base_temp = 22 + 5 * np.sin(np.linspace(0, 6.28, n))
    temp = base_temp + rng.normal(scale=2.0, size=n)
    humidity = 50 + 10 * np.cos(np.linspace(0, 6.28, n)) + rng.normal(scale=5.0, size=n)
    air = 80 + rng.normal(scale=20.0, size=n)
    ts = pd.date_range(end=pd.Timestamp.now(tz="UTC"), periods=n, freq="H")
    df = pd.DataFrame({"timestamp": ts, "temperature": temp, "humidity": humidity, "air_quality": air})
    return df


def prepare_features(df):
    df = df.copy().sort_values("timestamp").reset_index(drop=True)
    for col in ["temperature", "humidity", "air_quality"]:
        if col not in df.columns:
            df[col] = 0
    df["temp_lag1"] = df["temperature"].shift(1)
    df["hum_lag1"] = df["humidity"].shift(1)
    df = df.dropna().reset_index(drop=True)
    X = df[["temperature", "humidity", "air_quality", "temp_lag1", "hum_lag1"]]
    return df, X


def train_and_save(df):
    df_full, X = prepare_features(df)
    df_full["temp_next"] = df_full["temperature"].shift(-1)
    df_full["hum_next"] = df_full["humidity"].shift(-1)
    df_full = df_full.dropna().reset_index(drop=True)

    X = df_full[["temperature", "humidity", "air_quality", "temp_lag1", "hum_lag1"]]
    y_temp = df_full["temp_next"].values
    y_hum = df_full["hum_next"].values

    print("🔥 Training temperature model...")
    temp_model = LinearRegression().fit(X, y_temp)
    print("💧 Training humidity model...")
    hum_model = LinearRegression().fit(X, y_hum)

    print("⚠️ Training anomaly detection model...")
    iso = IsolationForest(contamination=0.01, random_state=42).fit(X)

    joblib.dump(temp_model, "temp_model.joblib")
    joblib.dump(hum_model, "hum_model.joblib")
    joblib.dump(iso, "anomaly_model.joblib")

    print("✅ Models saved successfully!")


def main():
    df = load_data_from_csv()
    if df is None:
        df = load_data_from_mongo()
    if df is None:
        df = generate_synthetic(n=1500)
        df.to_csv(DATA_CSV, index=False)
        print(f"📝 Synthetic data written to {DATA_CSV}")

    if "timestamp" not in df.columns:
        df["timestamp"] = pd.date_range(end=pd.Timestamp.now(tz="UTC"), periods=len(df))

    for col in ["temperature", "humidity", "air_quality"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["temperature", "humidity"]).reset_index(drop=True)
    train_and_save(df)


if __name__ == "__main__":
    main()
