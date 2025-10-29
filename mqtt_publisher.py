import paho.mqtt.client as mqtt
import json, time, random, datetime

BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "iot/sensors"

client = mqtt.Client("iot_publisher")
client.connect(BROKER, PORT)

while True:
    data = {
        "device_id": "sensor_01",
        "temperature": round(random.uniform(20, 35), 2),
        "humidity": round(random.uniform(40, 90), 2),
        "air_quality": round(random.uniform(50, 150), 2),
        "timestamp": datetime.datetime.now(datetime.UTC).isoformat()

    }
    client.publish(TOPIC, json.dumps(data))
    print(f"Published: {data}")
    time.sleep(5)
