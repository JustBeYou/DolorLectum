import connexion
import six

from openapi_server.models.status import Status  # noqa: E501
from openapi_server import util

curr_status = Status(ready=False)

def get_mattress_status():  # noqa: E501
    """Get El status

     # noqa: E501


    :rtype: Status
    """
    return curr_status


def set_mattress_status(status=None):  # noqa: E501
    """Set El status

     # noqa: E501

    :param status: 
    :type status: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        status = Status.from_dict(connexion.request.get_json())  # noqa: E501

    curr_status.ready = status.ready

    return curr_status
