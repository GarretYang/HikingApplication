# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import random
import base64
import google.oauth2.id_token

from routes.themesRoute import themes_api

from flask import Flask, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
from bson import Binary
from bson.objectid import ObjectId
from db_api import find_or_create_user, find_photo, find_report, read_all_features

firebase_request_adapter = requests.Request()

# [END gae_python37_datastore_store_and_fetch_user_times]
app = Flask(__name__)
app.register_blueprint(themes_api)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.

    app.run(host='127.0.0.1', port=8000, debug=True)


