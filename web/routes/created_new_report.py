from flask import Blueprint, render_template, request, Response
import google.oauth2.id_token
from db_api import *
from mongoDatabase import db, firebase_request_adapter

newcreatereport_api = Blueprint('newcreatereport_api', __name__)

# [START createdReport]
@newcreatereport_api.route('/newcreatereport', methods=['POST'])
@newcreatereport_api.route('/newcreatereportjson', methods=['POST'])
def newcreatereport():
    if (request.path == '/newcreatereport'):
        claims, error_message = firebase_auth(request)
        photos = request.files.getlist('photo')
        feature = request.form.get('feature')
        location = get_feature_location(db, feature)
        tags = request.form.getlist('tag')
        description = request.form.get('description')
        date = request.form.get('date')
        user = find_or_create_user(db, claims['name'], claims['email'])
        print(claims['name'])
        print(claims['email'])
        photos = [Binary(base64.b64encode(p.read()), 0) for p in photos]
    else:
        req = request.get_json()
        print(req)
        photos = req['photos']
        print(photos)
        photos = [Binary(bytes(p, 'UTF-8'), 0) for p in photos]
        print(photos)
        feature = req.get('feature')
        location = req.get('location')
        tags = req.get('tags')
        description = req.get('description')
        date = req.get('date')
        user = find_or_create_user(db, req.get('name'), req.get('email'))

    new_report_result = create_report(db, feature, tags, location, description, date, user, photos=photos)
    #new_report_result = False

    if new_report_result is False:
        status = "Error creating new report!"
        status_code = 202
    else:
        status = "Successfully created a report for: " + str(feature) + " at " + str(location) + "!"
        status_code = 201

    if request.path == '/newcreatereport':
        return render_template('created_new_report.html', status=status, user_data=claims, error_message=error_message)
    else:
        return Response("{'status':'" + status + "'}", status=status_code, mimetype='application/json')
# [END createReport]


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
