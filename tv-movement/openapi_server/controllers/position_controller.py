import connexion
import six

from openapi_server.models.error import Error
from openapi_server.models.inline_response200 import InlineResponse200  # noqa: E501
from openapi_server.models.inline_response2001 import InlineResponse2001  # noqa: E501
from openapi_server.models.position import Position  # noqa: E501
from openapi_server import util

from openapi_server.controllers.status_controller import currentStatus

currentPosition = Position(x=0, y=0, z=0)

def get_position():  # noqa: E501
    if currentStatus.ready == False:
        return Error(code=409, message="Position is not disponible.")
    
    return InlineResponse2001(data=currentPosition)


def set_position(position=None):  # noqa: E501
    if connexion.request.is_json:
        position = Position.from_dict(connexion.request.get_json())  # noqa: E501


    if currentStatus.ready == False:
        return Error(code=409, message="Can't move while status is not ready.")

    currentPosition.x = position.x
    currentPosition.y = position.y
    currentPosition.z = position.z


    return InlineResponse2001(data=currentPosition)
