# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from ..models.action import Action  # noqa: E501
from ..test.__init__ import BaseTestCase

class TestActionController(BaseTestCase):
    """ActionController integration test stubs"""

    def set_status_for_test(self):
        status = {"ready": True}
        headers = {}
        response = self.client.open(
            '/status',
            method='POST',
            headers=headers,
            data=json.dumps(status),
            content_type='application/json')

    def test_cancel_mattress(self):
        """Test case for clean_mattress

        Action upon the cleaner
        """
        self.set_status_for_test()

        action = {"action": "cancel"}
        headers = {}
        response = self.client.open(
            '/action',
            method='POST',
            headers=headers,
            data=json.dumps(action),
            content_type='application/json')
        self.assert200(response, 'Response body is : ' + response.data.decode('utf-8'))

    def test_clean_mattress(self):
        """Test case for clean_mattress

        Action upon the cleaner
        """
        self.set_status_for_test()

        action = {"action": "clean"}
        headers = {}
        response = self.client.open(
            '/action',
            method='POST',
            headers=headers,
            data=json.dumps(action),
            content_type='application/json')
        self.assert200(response, 'Response body is : ' + response.data.decode('utf-8'))

    def test_clean_then_cancel(self):
        self.test_cancel_mattress()
        action = {"action": "clean"}
        headers = {}
        response = self.client.open(
            '/action',
            method='POST',
            headers=headers,
            data=json.dumps(action),
            content_type='application/json')
        assert response.status_code == 409


if __name__ == '__main__':
    unittest.main()
