import connexion
import six

from openapi_server.models.action import Action  # noqa: E501
from openapi_server import util

from .status_controller import curr_status

def clean_mattress(action=None):  # noqa: E501
    """Action upon the cleaner

     # noqa: E501

    :param action: 
    :type action: dict | bytes

    :rtype: Action
    """
    if connexion.request.is_json:
        action = Action.from_dict(connexion.request.get_json())  # noqa: E501

    if action.action == 'cancel':
        curr_status.ready = False
        return action

    if curr_status.ready == False and action.action == 'clean':
        return 'Device not ready!', 409

    return action
