import random
from flask import Blueprint, render_template, jsonify, request
from db_api import read_all_features, find_report, find_photo, find_photos_by_theme
from mongoDatabase import db
from bson.json_util import dumps

themes_api = Blueprint('themes_api', __name__)

# this route shows the available themes of our page.
# it is also the main page of the web
@themes_api.route('/', methods=['GET', 'POST'])
@themes_api.route('/json', methods=['GET', 'POST'])
def getThemes():
    claims  = None
    error_message = None
    theme_input = {}
    # Get all themes/features in db
    mongo_all_themes = read_all_features(db)

    feature_names = []
    feature_id = []
    feature_imgs = []

    themeJson = []

    for t in mongo_all_themes:
        feature_names.append(t['feature_name'])
        feature_id.append(t['_id'])
        report_imgs = find_photos_by_theme(db, t['feature_name'])
        report_img_id = []

        if report_imgs.count() != 0 :
            report_img_id.append(report_imgs[0]['_id'])

        themeJson.append({
            "feature_id": t['_id'],
            "feature_name": t['feature_name'],
            "feature_img_id": report_img_id[0]
        })

        if report_imgs.count() != 0:        
            feature_imgs.append(find_photo(db, report_img_id)[0])
        else:
            feature_imgs.append("0")
    theme_input['feature_names'] = feature_names
    theme_input['feature_id'] = feature_id
    theme_input['feature_imgs'] = feature_imgs

    if (request.path == '/json'):
        return dumps(themeJson)
    else:
        return render_template(
            'theme_management.html',
            user_data=claims,
            error_message=error_message,
            user_input=theme_input)