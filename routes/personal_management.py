from flask import Blueprint, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from db_api import find_or_create_user,find_report,find_photo
from mongoDatabase import db, firebase_request_adapter
import random

personal_api = Blueprint('personal_api', __name__)

# this route shows the loggin user's own reports and themes
@personal_api.route('/personal', methods=['GET', 'POST'])
def getPersonal():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    user_input = {}

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
            reports_date = []
            reports_loc = []
            reports_desc = []
            for r in mongo_reports:
                reports_theme.append(r['feature_name'])
                reports_date.append(r['date_in'])
                reports_loc.append(r['location'])
                reports_desc.append(r['description'])
                report_img = []
                if 'photos' in r and len(r['photos']) > 0:
                    report_img = find_photo(db, r['photos'])
                reports_img.append(report_img)
            user_input['reports_img'] = reports_img
            user_input['reports_theme'] = reports_theme
            user_input['reports_date'] = reports_date
            user_input['reports_loc'] = reports_loc
            user_input['reports_desc'] = reports_desc
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
        'personal_management.html',
        user_data=claims,
        error_message=error_message,
        user_input=user_input)
