import connexion
import six
from openapi_server.models.status import Status  # noqa: E501
from openapi_server import util
import json


def get_thermal_status():  # noqa: E501
    """Get El status
     # noqa: E501
    :rtype: Status
    """
    with open("state") as f:
        return json.loads(f.readline())


def set_thermal_status(status=None):  # noqa: E501
    """Set El status

     # noqa: E501

    :param status:
    :type status: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501
    with open("state") as f:
        obj = json.loads(f.readline())

    with open("state", "w") as f:
        obj["ready"] = status.ready
        f.write(json.dumps(obj))
        return json.dumps(obj)


def set_temperature(status=None):  # noqa: E501
    """Set El temperatura

     # noqa: E501

    :param status:
    :type status: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501
    with open("state") as f:
        obj = json.loads(f.readline())
    with open("state", "w") as f:
        obj["temp"] = round(status.temp, 2)
        f.write(json.dumps(obj))
        return json.dumps(obj)
