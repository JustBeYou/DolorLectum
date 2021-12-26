# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.action import Action  # noqa: E501
from openapi_server.test import BaseTestCase


class TestActionController(BaseTestCase):
    """ActionController integration test stubs"""

    def test_work(self):
        """Test case for work

        Action upon the thermal system
        """
        action = {
  "action" : "cancel"
}
        headers = { 
        }
        response = self.client.open(
            '/action',
            method='POST',
            headers=headers,
            data=json.dumps(action),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
