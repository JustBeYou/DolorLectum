import random
import time

from paho.mqtt import client as mqtt_client

import json

from controllers.action_controller import get_last_action
from controllers.status_controller import get_current_status

broker = 'localhost'
port = 1883
topic = "mattress_vacuum.state"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 1000)}'


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client):
    state = {
        'curr_status': str(bool(get_current_status())),
        'last_action': str(get_last_action()),
    }
    while True:
        time.sleep(1)
        result = client.publish(topic, json.dumps(state))
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send state to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")


def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)


if __name__ == '__main__':
    run()