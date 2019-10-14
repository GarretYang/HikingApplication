# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
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

import datetime

from flask import Flask, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
import pymongo
from db_api import create_feature

firebase_request_adapter = requests.Request()

# [START gae_python37_datastore_store_and_fetch_user_times]
datastore_client = datastore.Client()

# [END gae_python37_datastore_store_and_fetch_user_times]
app = Flask(__name__)

# Mongodb client
client = pymongo.MongoClient("mongodb+srv://YangHu-yh:Fhsjzzx.48@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking']


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
@app.route('/')
def root():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    times = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)

            store_time(claims['email'], datetime.datetime.today())
            times = fetch_times(claims['email'], 10)

        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

    return render_template(
        'index.html',
        user_data=claims, error_message=error_message, times=times)
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


# # [END gae_python37_datastore_store_and_fetch_user_times]
# app = Flask(__name__)






@app.route('/createFeature', methods=['POST'])
def createFeature():
    # Add New Feature to Mongo Database
    # submit = ""
    # cookies = request.cookies
    new_feature_in = request.form.get('feature_name')
    new_location_in = request.form.get('location')
    new_feature_result = create_feature(db, new_feature_in, new_location_in)
    if new_feature_result is False:
        submit = "There is an error!"
    elif new_feature_result == -1:
        submit = "The feature already exist!"
    else:
        submit = "You just successfully created feature: "+new_feature_in+" at " +new_location_in+"!"
    return submit


# # Mongodb client
# client = MongoClient("mongodb+srv://YangHu-yh:Fhsjzzx.48@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
# db = client['hiking']

# # [END gae_python37_datastore_store_and_fetch_user_times]
# app = Flask(__name__)



# @app.route('/new_feature', methods=['GET', 'POST'])
# def new_feature():
#     # get input feature from user/admin
#     return render_template('index.html', feature_id=create_feature(db, request.form['new_feature'], request.form['location'])

# def root():
#     # Add to Mongodb about feature
#     feature_id = create_feature(db, request.form['new_feature'], request.form['location'])
#     if feature is not None:
#         return render_template('index.html', feature_id)



