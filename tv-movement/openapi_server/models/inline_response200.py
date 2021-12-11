# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server.models.status import Status
from openapi_server import util

from openapi_server.models.status import Status  # noqa: E501

class InlineResponse200(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, data=None):  # noqa: E501
        """InlineResponse200 - a model defined in OpenAPI

        :param data: The data of this InlineResponse200.  # noqa: E501
        :type data: Status
        """
        self.openapi_types = {
            'data': Status
        }

        self.attribute_map = {
            'data': 'data'
        }

        self._data = data

    @classmethod
    def from_dict(cls, dikt) -> 'InlineResponse200':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The inline_response_200 of this InlineResponse200.  # noqa: E501
        :rtype: InlineResponse200
        """
        return util.deserialize_model(dikt, cls)

    @property
    def data(self):
        """Gets the data of this InlineResponse200.


        :return: The data of this InlineResponse200.
        :rtype: Status
        """
        return self._data

    @data.setter
    def data(self, data):
        """Sets the data of this InlineResponse200.


        :param data: The data of this InlineResponse200.
        :type data: Status
        """

        self._data = data