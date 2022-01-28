import connexion
import six
from threading import Timer

from openapi_server.models.error import Error  # noqa: E501
from openapi_server.models.inline_response200 import InlineResponse200  # noqa: E501
from openapi_server.models.status import Status  # noqa: E501
from openapi_server import util

currentStatus = Status(ready=False)
secondsTillBlockTV = 10  # For test purpose


def blockTV():
    global makeInactiveThread
    currentStatus.ready = False
    makeInactiveThread = Timer(secondsTillBlockTV, blockTV)


makeInactiveThread = Timer(secondsTillBlockTV, blockTV)


def get_status():  # noqa: E501
    return currentStatus


def set_status(status=None):  # noqa: E501
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501

    global makeInactiveThread

    if status.ready == currentStatus.ready:
        return Error(code=409,
                     message="Status is alredy set to intended state.")

    currentStatus.ready = status.ready

    if currentStatus.ready == True:
        makeInactiveThread.start()
    else:
        makeInactiveThread.cancel()
        makeInactiveThread = Timer(secondsTillBlockTV, blockTV)

    return InlineResponse200(data=currentStatus)
