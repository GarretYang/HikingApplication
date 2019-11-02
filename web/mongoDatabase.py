import pymongo
from google.auth.transport import requests


# Mongodb client
client = pymongo.MongoClient("mongodb+srv://TeamTwo:team12345two@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking_test_2']

# Firebase authentication
firebase_request_adapter = requests.Request()
