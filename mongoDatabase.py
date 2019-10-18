import pymongo

# Mongodb client
client = pymongo.MongoClient("mongodb+srv://GarretYang:dy9Rr5Wkp26yeeh4@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority")
db = client['hiking']