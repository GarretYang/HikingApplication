from src.db_api import create_report, read_report, update_report, delete_report
from pymongo import MongoClient
from src.secrets import username, password

# Simple test
if __name__ == '__main__':
    client = MongoClient('mongodb+srv://' + username + ':' + password + '@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority')
    db = client.hiking

    #Demonstrate create and read
    reportID = create_report(db, 'rock wall', ['crumbly', 'slippery'], 'yosemite', 9997)
    print(read_report(db, reportID))
    delete_report(db, 9997, 'rock wall')

    #Demonstrate delete
    reportID = create_report(db, 'mountain', ['wet', 'rock'], 'ann arbor', 9999)
    print(read_report(db, reportID))
    if delete_report(db, 9999, 'mountain'):
        print('Successful delete')
    else:
        print('Delete failed!')
    #This should create a "Cannot find report" error
    #print(read_report(db, reportID))

    #Demonstrate update
    reportID = create_report(db, 'stream', ['dry', 'barren'], 'austin', 9998)
    print(read_report(db, reportID))
    if update_report(db, reportID, tags=['flowing', 'testing']):
        print('Successful update!')
    else:
        print('Update fails!')
    print(read_report(db, reportID))
    delete_report(db, 9998, 'stream')

    #Demonstrate another update
    reportID = create_report(db, 'stream', ['dry', 'barren'], 'austin', 9998)
    print(read_report(db, reportID))
    if update_report(db, reportID, feature_name='raging river', tags=['flooding']):
        print('Successful update!')
    else:
        print('Update fails!')
    print(read_report(db, reportID))
    delete_report(db, 9998, 'stream')