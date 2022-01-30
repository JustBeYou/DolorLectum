import json
import os
import tempfile

import pytest

from ..__main__ import create_app


@pytest.fixture
def client():
    app = create_app()
    with app.app.test_client() as client:
        yield client


def test_empty_get_status(client):
    rv = client.get('/status')
    data = json.loads(rv.data)
    assert data["temp"] == 24
    assert data["realtemp"] == 26
    assert data["ready"] == True



def test_set_status(client):
    rv = client.post('/status', json={'ready':False})
    data = json.loads(rv.data)
    assert data["ready"] == False


def test_set_temp(client):
    rv = client.post('/temp', json={'temp':39})
    data = json.loads(rv.data)
    assert data["temp"] == 39.0



def test_actions(client):
    rv = client.post('/action', json={'action':'work'})
    data = json.loads(rv.data)
    assert data["ready"] == False

    import time
    time.sleep(3)
    rv = client.post('/action', json={'action':'cancel'})
    data = json.loads(rv.data)
    assert data["ready"] == True
    assert data["realtemp"]!=26
