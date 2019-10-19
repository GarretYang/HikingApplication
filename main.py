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

from routes.theme_management import themes_api
from routes.personal_management import personal_api
from routes.new_report import newreport_api
from routes.created_new_report import newcreatereport_api
from routes.new_feature import newfeature_api
from routes.created_new_feature import newcreatedfeature_api
from routes.single_theme import singletheme_api
from flask import Flask, render_template, request

app = Flask(__name__)
app.register_blueprint(themes_api)
app.register_blueprint(personal_api)
app.register_blueprint(newreport_api)
app.register_blueprint(newcreatereport_api)
app.register_blueprint(newfeature_api)
app.register_blueprint(newcreatedfeature_api)
app.register_blueprint(singletheme_api)
 
if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.

    app.run(host='127.0.0.1', port=8000, debug=True)
