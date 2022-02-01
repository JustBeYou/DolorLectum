import connexion
import six

import sys, os
sys.path.insert(0, os.path.abspath('..'))

from ..models.action import Action  # noqa: E501

from .status_controller import curr_status

last_action = Action()

def get_last_action():
    return last_action

def clean_mattress(action=None):  # noqa: E501
    """Action upon the cleaner

     # noqa: E501

    :param action: 
    :type action: dict | bytes

    :rtype: Action
    """
    if connexion.request.is_json:
        action = Action.from_dict(connexion.request.get_json())  # noqa: E501

    last_action = action

    if action.action == 'cancel':
        curr_status.ready = False
        return action

    if curr_status.ready == False and action.action == 'clean':
        return 'Device not ready!', 409

    return action
