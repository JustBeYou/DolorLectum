import connexion
import six

from openapi_server.models.error import Error  # noqa: E501
from openapi_server.models.inline_response200 import InlineResponse200  # noqa: E501
from openapi_server.models.status import Status  # noqa: E501
from openapi_server import util


currentStatus = Status(ready=False)

def get_status():  # noqa: E501
    return currentStatus


def set_status(status=None):  # noqa: E501
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501

    if status.ready == currentStatus.ready:
        return Error(code=409, message="Status is alredy set to intended state.")
    
    currentStatus.ready = status.ready

    return InlineResponse200(data=currentStatus)
