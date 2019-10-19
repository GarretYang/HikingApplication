import random
from flask import Blueprint, render_template, request
from db_api import read_all_features, find_report, find_photo, find_userinfo_by_id
from mongoDatabase import db

singletheme_api = Blueprint('singletheme_api', __name__)

# [START gae_python37_datastore_render_user_times]
#@singletheme.route('/', methods=['GET', 'POST'])
@singletheme_api.route('/reports', methods=['GET', 'POST'])
def getReports():
    # Verify Firebase auth.
    error_message = None
    claims = None

    selected_feature = request.args.get('theme')

    #selected_feature = 'Board Walk Trail'

    mongo_reports = find_report(db, feature_name=selected_feature)

    user_name = []
    report_img = []
    all_images = []
    all_tags = []
    for r in mongo_reports:
        user_name.append(find_userinfo_by_id(db, r['user_id'])['name'])
        if 'photos' in r and len(r['photos']) > 0:
            img = find_photo(db, r['photos'])
            report_img.append(img)
            for i in img:
                all_images.append(i)
        if 'tags' in r and len(r['tags']) > 0:
            for i in r['tags']:
                all_tags.append(i)

    mongo_reports = find_report(db, feature_name=selected_feature)

    return render_template(
        'single_theme.html',
        user_data=claims,
        error_message=error_message,
        reports=mongo_reports,
        user_name=user_name,
        report_images=report_img,
        theme_image=all_images,
        theme_tags=all_tags)
