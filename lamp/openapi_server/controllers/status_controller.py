import connexion

from openapi_server.models.status import Status  # noqa: E501
from openapi_server import util

from openapi_server.__main__ import push

current_status = Status(power="full_power", red=255, green=255, blue=255)


def get_lamp_state():  # noqa: E501
    """Get the status

     # noqa: E501


    :rtype: Status
    """

    return current_status.to_dict()


def set_color(status=None):  # noqa: E501
    """Set the light

     # noqa: E501

    :param status:
    :type status: dict | bytes

    :rtype: None
    """
    global current_status
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501
        red = status.red
        green = status.green
        blue = status.blue
        current_status.red = red if red is not None else current_status.red
        current_status.green = green if green is not None else current_status.green
        current_status.blue = blue if blue is not None else current_status.blue

    push(current_status.to_dict())
    return current_status.to_dict()


def set_light_status(body=None):  # noqa: E501
    """Set the status

     # noqa: E501

    :param body:
    :type body: str

    :rtype: None
    """
    global current_status

    current_status.power = body
    return current_status.to_dict()

