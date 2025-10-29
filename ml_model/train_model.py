import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
import joblib

data = pd.read_csv("sensor_data.csv")  # from backend exports or manual
X = data[["temperature", "humidity"]].shift(1).dropna()
y_temp = data["temperature"][1:]
y_hum = data["humidity"][1:]

temp_model = LinearRegression().fit(X, y_temp)
hum_model = LinearRegression().fit(X, y_hum)
anomaly_model = IsolationForest(contamination=0.05).fit(X)

joblib.dump(temp_model, "temp_model.pkl")
joblib.dump(hum_model, "hum_model.pkl")
joblib.dump(anomaly_model, "anomaly_model.pkl")
print("✅ Models trained and saved.")
