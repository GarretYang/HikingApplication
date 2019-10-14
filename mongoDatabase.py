import pymongo

# Mongodb client
client = pymongo.MongoClient("mongodb+srv://GarretYang:1lNZD6YooaYrYRSd@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking']