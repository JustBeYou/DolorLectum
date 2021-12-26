#!/usr/bin/env python3

import connexion
import json
from openapi_server import encoder


def main():
    app = connexion.App(__name__, specification_dir="./openapi/")
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api(
        "openapi.yaml", arguments={"title": "Mattress Vacuum"}, pythonic_params=True
    )
    with open("state", "w") as f:
        obj = {"ready": True, "temp": 24, "realtemp": 26}
        f.write(json.dumps(obj))
    app.run(port=8083)


if __name__ == "__main__":
    main()
