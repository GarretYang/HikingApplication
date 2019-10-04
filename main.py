
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

# import datetime
import random

from flask import Flask, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
import pymongo
import base64
from bson import Binary
from bson.objectid import ObjectId
from db_api import find_or_create_user, find_photo, find_report

firebase_request_adapter = requests.Request()

# [START gae_python37_datastore_store_and_fetch_user_times]
datastore_client = datastore.Client()

# Mongodb client
client = pymongo.MongoClient("mongodb+srv://username:password@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking']

# [END gae_python37_datastore_store_and_fetch_user_times]
app = Flask(__name__)


class ReusableForm(Form):
    name = TextField('Name:', validators=[validators.required()])
    surname = TextField('Surname:', validators=[validators.required()])


# [START gae_python37_datastore_store_and_fetch_user_times]
def store_time(email, dt):
    entity = datastore.Entity(key=datastore_client.key('User', email, 'visit'))
    entity.update({
        'timestamp': dt
    })

    datastore_client.put(entity)


def fetch_times(email, limit):
    ancestor = datastore_client.key('User', email)
    query = datastore_client.query(kind='visit', ancestor=ancestor)
    query.order = ['-timestamp']

    times = query.fetch(limit=limit)

    return times
# [END gae_python37_datastore_store_and_fetch_user_times]


# [START gae_python37_datastore_render_user_times]
@app.route('/', methods=['GET', 'POST'])
def root():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    user_input = {}
    form = ReusableForm(request.form)

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)

            # Check user info in mongodb
            mongo_user_id = find_or_create_user(db, claims['name'], claims['email'])
            # Get report cursor
            mongo_reports = find_report(db, user_id=mongo_user_id)
            # mongo_reports = db.Reports.find({'user_id': mongo_user_id})
            reports_img = []
            reports_theme = []
            for r in mongo_reports:
                reports_theme.append(r['feature_name'])
                report_img = []
                if 'photos' in r and len(r['photos']) > 0:
                    report_img = find_photo(db, r['photos'])
                reports_img.append(report_img)
            user_input['reports_img'] = reports_img
            user_input['reports_theme'] = reports_theme
            display_theme = list(set(reports_theme))
            display_theme_img = []
            # Randomly pick a cover photo for each theme
            for t in display_theme:
                t_reports = find_report(db, feature_name=t)
                for r in t_reports:
                    if 'photos' in r and len(r['photos']) > 0:
                        report_img = find_photo(db, r['photos'])
                        display_theme_img.append(random.choice(report_img))
                        break
            user_input['themes_name'] = display_theme
            user_input['themes_img'] = display_theme_img
        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

    return render_template(
        'index.html',
        user_data=claims,
        error_message=error_message,
        user_input=user_input)
# [END gae_python37_datastore_render_user_times]


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
