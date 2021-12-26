# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.status import Status  # noqa: E501
from openapi_server.test import BaseTestCase


class TestStatusController(BaseTestCase):
    """StatusController integration test stubs"""

    def test_get_thermal_status(self):
        """Test case for get_thermal_status

        Get El status
        """
        headers = { 
        }
        response = self.client.open(
            '/status',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_set_temperature(self):
        """Test case for set_temperature

        Set El temperatura
        """
        status = {
  "ready" : true
}
        headers = { 
        }
        response = self.client.open(
            '/temp',
            method='POST',
            headers=headers,
            data=json.dumps(status),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_set_thermal_status(self):
        """Test case for set_thermal_status

        Set El status
        """
        status = {
  "ready" : true
}
        headers = { 
        }
        response = self.client.open(
            '/status',
            method='POST',
            headers=headers,
            data=json.dumps(status),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
