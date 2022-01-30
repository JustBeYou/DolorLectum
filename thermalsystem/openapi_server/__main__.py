#!/usr/bin/env python3

from pydoc import cli
import connexion
import json
from openapi_server import encoder
import paho.mqtt.client as mqtt
from flask_cors import CORS
topic1="thermalsystem.temperature"
topic2="thermalsystem.status.updates"
client = mqtt.Client()

def push(dictionary):
    global client
    print(1)
    client.publish(topic2,str(dictionary))
    
    

def on_connect(client, userdata, flags,rc):
    client.subscribe(topic1)
    client.publish(topic2, "STARTING SERVER")

# Message receiving callback
def on_message(client, userdata, msg):
    if msg.topic==topic1:
        dic=json.loads(msg.payload.decode)
        temp=dic["temperature"]
        with open("state") as f:
            obj = json.loads(f.readline())
        with open("state", "w") as f:
            obj["temp"] = round(temp, 2)
            f.write(json.dumps(obj))


def main():
    app = connexion.App(__name__, specification_dir="./openapi/")
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api(
        "openapi.yaml", arguments={"title": "Mattress Vacuum"}, pythonic_params=True
    )
    with open("state", "w") as f:
        obj = {"ready": True, "temp": 24, "realtemp": 26}
        f.write(json.dumps(obj))
    
    global client
    client.on_connect = on_connect
    client.on_message=on_message
    client.connect_async('mqtt-server',1883)
    client.loop_start()
    CORS(app.app)
    app.run(port=8080)
    
    


if __name__ == "__main__":
    main()
