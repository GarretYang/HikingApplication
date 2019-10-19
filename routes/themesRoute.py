from flask import Blueprint, render_template
from db_api import read_all_features
from mongoDatabase import db

themes_api = Blueprint('themes_api', __name__)

# this route shows the available themes of our page.
# it is also the main page of the web
@themes_api.route('/', methods=['GET', 'POST'])
def getThemes():
    claims  = None
    error_message = None
    theme_input = {}
    # Get all themes/features in db
    mongo_all_themes = read_all_features(db)
    
    feature_names = []
    feature_id = []
    for t in mongo_all_themes:
        feature_names.append(t['feature_name'])
        feature_id.append(t['_id'])

    theme_input['feature_names'] = feature_names
    theme_input['feature_id'] = feature_id
    
    return render_template(
        'ThemeManagement/theme_management.html',
        user_data=claims,
        error_message=error_message,
        user_input=theme_input)    