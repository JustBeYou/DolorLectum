import paho.mqtt.client as mqtt
from threading import Thread
from os import system
from time import sleep

host = "mqtt-server"
port = 1883
topic = "test"

def subscriber():
    def on_connect(client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        client.subscribe(topic)

    def on_message(client, userdata, msg):
        print(msg.topic+" "+str(msg.payload))
        exit()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(host, port, 60)
    client.loop_forever()

def producer():
    sleep(1)
    client = mqtt.Client()
    client.connect(host, port, 60)
    client.publish(topic, "test message")

def main():
    targets = [subscriber, producer]
    ths = []
    for t in targets:
        ths.append(Thread(target=t))
        ths[-1].start()

    for t in ths:
        t.join()

if __name__ == "__main__":
    main()