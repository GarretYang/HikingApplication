from flask import Blueprint, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from db_api import *
from mongoDatabase import db, firebase_request_adapter
import random

newfeature_api = Blueprint('newfeature_api', __name__)

# [START createNewFeature]
# this route allow the user to create new feature on Mongo Database
@newfeature_api.route('/newFeature', methods=['GET', 'POST'])
def newFeature():
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

    return render_template('CreateNewFeature/create_the_feature.html', user_data=claims, error_message=error_message, times=times)
# [END createNewFeature]