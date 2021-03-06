# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server import util


class Status(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, ready=None, temp=None, realtemp=None):  # noqa: E501
        """Status - a model defined in OpenAPI

        :param ready: The ready of this Status.  # noqa: E501
        :type ready: bool
        :param temp: The temp of this Status.  # noqa: E501
        :type temp: float
        :param realtemp: The realtemp of this Status.  # noqa: E501
        :type realtemp: float
        """
        self.openapi_types = {
            'ready': bool,
            'temp': float,
            'realtemp': float
        }

        self.attribute_map = {
            'ready': 'ready',
            'temp': 'temp',
            'realtemp': 'realtemp'
        }

        self._ready = ready
        self._temp = temp
        self._realtemp = realtemp

    @classmethod
    def from_dict(cls, dikt) -> 'Status':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Status of this Status.  # noqa: E501
        :rtype: Status
        """
        return util.deserialize_model(dikt, cls)

    @property
    def ready(self):
        """Gets the ready of this Status.


        :return: The ready of this Status.
        :rtype: bool
        """
        return self._ready

    @ready.setter
    def ready(self, ready):
        """Sets the ready of this Status.


        :param ready: The ready of this Status.
        :type ready: bool
        """

        self._ready = ready

    @property
    def temp(self):
        """Gets the temp of this Status.


        :return: The temp of this Status.
        :rtype: float
        """
        return self._temp

    @temp.setter
    def temp(self, temp):
        """Sets the temp of this Status.


        :param temp: The temp of this Status.
        :type temp: float
        """

        self._temp = temp

    @property
    def realtemp(self):
        """Gets the realtemp of this Status.


        :return: The realtemp of this Status.
        :rtype: float
        """
        return self._realtemp

    @realtemp.setter
    def realtemp(self, realtemp):
        """Sets the realtemp of this Status.


        :param realtemp: The realtemp of this Status.
        :type realtemp: float
        """

        self._realtemp = realtemp
