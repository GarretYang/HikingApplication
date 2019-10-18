import pymongo
from google.auth.transport import requests


# Mongodb client
client = pymongo.MongoClient("mongodb+srv://GarretYang:dy9Rr5Wkp26yeeh4@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking']

# Firebase authentication
firebase_request_adapter = requests.Request()