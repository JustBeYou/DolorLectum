from ast import dump
from aiohttp import Payload
import connexion
import six
import json
import asyncio
import time
from openapi_server.models.action import Action  # noqa: E501
from openapi_server import util
from threading import Thread
import sys

sys.path.append("../../")
from __main__ import  push



def wrk():
    while True:
        time.sleep(0.3)
        with open("state") as f:
            obj = json.loads(f.readline())
        with open("state", "w") as f:
            obj["realtemp"] = round(
                obj["realtemp"] + 0.01 *
                (1 if obj["temp"] > obj["realtemp"] else -1), 2
            )
            obj["ready"] = obj["temp"] == obj["realtemp"] or obj["ready"]
            f.write(json.dumps(obj))
        if obj["ready"]:
            break
        push(obj)


def work(action=None):  # noqa: E501
    """Action upon the thermal system

     # noqa: E501

    :param action:
    :type action: dict | bytes

    :rtype: Action
    """
    if connexion.request.is_json:
        action = Action.from_dict(connexion.request.get_json())  # noqa: E501
    if action.action == "cancel":
        with open("state") as f:
            obj = json.loads(f.readline())
        with open("state", "w") as f:
            obj["ready"] = True
            f.write(json.dumps(obj))
            push(obj)

            return obj
    if action.action == "work":
        with open("state") as f:
            obj = json.loads(f.readline())
        with open("state", "w") as f:
            obj["ready"] = False
            f.write(json.dumps(obj))
            T = Thread(target=wrk)
            T.setDaemon(True)
            T.start()
            return obj
    return {}
