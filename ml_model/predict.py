import joblib, pandas as pd, numpy as np

temp_model = joblib.load("temp_model.pkl")
hum_model = joblib.load("hum_model.pkl")
X_latest = pd.DataFrame([[30, 70]], columns=["temperature", "humidity"])

pred_temp = temp_model.predict(X_latest)[0]
pred_hum = hum_model.predict(X_latest)[0]

print(f"Predicted next temperature: {pred_temp:.2f} °C")
print(f"Predicted next humidity: {pred_hum:.2f} %")
