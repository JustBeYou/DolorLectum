import connexion
import six

from openapi_server import util


def echo_message_get(message):  # noqa: E501
    """echo_message_get

    The damn message will be echoed # noqa: E501

    :param message: 
    :type message: str

    :rtype: str
    """
    return 'do some magic!'
