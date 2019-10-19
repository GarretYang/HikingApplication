from flask import Blueprint, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from db_api import create_feature
from mongoDatabase import db, firebase_request_adapter
import random

newcreatedfeature_api = Blueprint('newcreatedfeature_api', __name__)

# [START createNewFeature]
# this route allow the user to create new feature on Mongo Database
@newcreatedfeature_api.route('/newCreatedFeature', methods=['GET', 'POST'])
def newCreatedFeature():
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
    return render_template('created_new_feature.html', status=submit, user_data=claims, error_message=error_message, times=times)
# [END createthefeature]