from flask import Blueprint, render_template, request, Response
import google.oauth2.id_token
from db_api import create_feature
from mongoDatabase import db, firebase_request_adapter
import random

newcreatedfeature_api = Blueprint('newcreatedfeature_api', __name__)

# [START createNewFeature]
# this route allow the user to create new feature on Mongo Database
@newcreatedfeature_api.route('/newCreatedFeature', methods=['POST'])
@newcreatedfeature_api.route('/newCreatedFeatureJson', methods=['POST'])
def newCreatedFeature():
    if (request.path == '/newCreatedFeature'):
        claims, error_message = firebase_auth(request)
        new_feature_in = request.form.get('feature_name')
        new_location_in = request.form.get('location')

    else:
        req = request.get_json()
        print(req)
        new_feature_in = req.get('feature_name')
        new_location_in = req.get('location')

    new_feature_result = create_feature(db, new_feature_in, new_location_in)

    if new_feature_result is False:
        status = "Error creating a new feature!"
        status_code = 202
    elif new_feature_result == -1:
        status = "The feature already exists!"
        status_code = 202
    else:
        status = "Successfully created feature: " + new_feature_in + " at " + new_location_in + "!"
        status_code = 201

    if(request.path == "/newCreatedFeature"):
        return render_template('created_new_feature.html', status=status, user_data=claims, error_message=error_message)
    else:
        return Response("{'status':'" + status + "'}", status=status_code, mimetype='application/json')
# [END createthefeature]


def firebase_auth(request):
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

        return claims, error_message