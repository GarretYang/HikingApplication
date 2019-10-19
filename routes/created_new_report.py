from flask import Blueprint, render_template, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
from db_api import *
from mongoDatabase import db, firebase_request_adapter
import random

newcreatereport_api = Blueprint('newcreatereport_api', __name__)

# [START createdReport]
@newcreatereport_api.route('/newcreatereport', methods=['GET', 'POST'])
def newcreatereport():
    print(request.form)
    feature = request.form.get('feature')
    location = request.form.get('location')
    tags = request.form.getlist('tag')
    photo = request.form.get('photo')
    print(feature, location, tags, photo)
    create_report(db, feature, tags, location, 'test-user')
    return 'personal management page w/ successfully create the report'
# [END createReport]