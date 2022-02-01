# coding: utf-8

from __future__ import absolute_import

import datetime
import unittest

from flask import json
from six import BytesIO

from ..util import _deserialize_object, deserialize_date, _deserialize, _deserialize_primitive, _deserialize_list, _deserialize_dict

from openapi_server.models.status import Status  # noqa: E501
from openapi_server.test import BaseTestCase


class TestStatusController(BaseTestCase):
    """StatusController integration test stubs"""

    def test_deserialize_object(self):
        """
            Test return value
        """
        tester = float(3.2)
        response = _deserialize_object(tester)
        assert(response == tester)

    def test_deserialize_date(self):
        """
            Test date desererialization
        """
        date = datetime.date.today()
        date_str = date.__str__()
        response = deserialize_date(date_str)
        assert(response == date)

    def test_deserialize_datetime(self):
        """
            Test date desererialization
        """
        date = datetime.date.today()
        date_str = date.__str__()
        response = deserialize_date(date_str)
        assert (response == date)

    def test_deserialize(self):
        """
            Test date desererialization
        """
        date = 3.2

        response = _deserialize(date, float)
        assert (response == date)

    def test_deserialize_primitive(self):
        """
            Test date desererialization
        """
        date = 3.2

        response = _deserialize_primitive(date, float)
        assert (response == date)

    def test_deserialize_list(self):
        """
            Test date desererialization
        """
        tester = []

        response = _deserialize_primitive(tester, float)
        assert (response == tester)

    def test_deserialize_dict(self):
        """
            Test date desererialization
        """
        tester = 3.2

        response = _deserialize_primitive(tester, float)
        assert (response == tester)
