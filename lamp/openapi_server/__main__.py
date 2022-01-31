#!/usr/bin/env python3

import connexion
import json
from openapi_server import encoder
from flask_cors import CORS

import paho.mqtt.client as mqtt


topic1 = "lamp.color.queue"
topic2 = "lamp.status.updates"
client = mqtt.Client()


# Message receiving callback
def on_message(client, userdata, msg):
    global current_status
    if msg.topic == topic1:
        dic = json.loads(msg.payload.decode)
        red = dic["red"]
        green = dic["green"]
        blue = dic["blue"]
        client.publish(topic2, "color: (" + red + " " + green + " " + blue + ") was added to queue")


def push(dictionary):
    global client
    client.publish(topic2, str(dictionary))


def on_connect(client, userdata, flags, rc):
    client.subscribe(topic1)
    client.publish(topic2, "STARTING SERVER")


def main():
    app = connexion.App(__name__, specification_dir='./openapi/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('openapi.yaml',
                arguments={'title': 'lamp'},
                pythonic_params=True)

    global client
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect_async('mqtt-server', 1883)
    client.loop_start()
    
    CORS(app.app)
    app.run(port=8080)

if __name__ == '__main__':
    main()
