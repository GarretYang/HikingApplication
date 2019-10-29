from flask import Blueprint, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from db_api import *
from mongoDatabase import db, firebase_request_adapter
import random

newcreatereport_api = Blueprint('newcreatereport_api', __name__)

# [START createdReport]
@newcreatereport_api.route('/newcreatereport', methods=['POST'])
def newcreatereport():
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

        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

    photos = request.files.getlist('photo')
    feature = request.form.get('feature')
    location = get_feature_location(db, feature)
    tags = request.form.getlist('tag')
    description = request.form.get('description')
    date = request.form.get('date')
    user = find_or_create_user(db, claims['name'], claims['email'])
    new_report_result = create_report(db, feature, tags, location, description, date, user, photos=photos)

    if new_report_result is False:
        submit = "There is an error!"
    else:
        submit = "You just successfully created a report for: "+feature+" at " +location+"!"
    return render_template('created_new_report.html', status=submit, user_data=claims, error_message=error_message)
# [END createReport]