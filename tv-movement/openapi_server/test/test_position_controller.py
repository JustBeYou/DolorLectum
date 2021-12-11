# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.error import Error  # noqa: E501
from openapi_server.models.inline_response2001 import InlineResponse2001  # noqa: E501
from openapi_server.models.position import Position  # noqa: E501
from openapi_server.test import BaseTestCase


class TestPositionController(BaseTestCase):
    """PositionController integration test stubs"""

    def test_get_position(self):
        """Test case for get_position

        Get position of TV.
        """
        headers = { 
        }
        response = self.client.open(
            '/position',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_set_position(self):
        """Test case for set_position

        Set position of TV.
        """
        position = {
  "x" : -41,
  "y" : 10,
  "z" : 7
}
        headers = { 
        }
        response = self.client.open(
            '/position',
            method='POST',
            headers=headers,
            data=json.dumps(position),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
