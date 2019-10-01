from src.db_api import create_report, read_report, update_report, delete_report, find_report
from pymongo import MongoClient
from src.secrets import username, password

# Simple test
if __name__ == '__main__':
    client = MongoClient('mongodb+srv://' + username + ':' + password + '@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority')
    db = client.hiking

    print('Demonstrate create and read')
    reportID = create_report(db, 'rock wall', ['crumbly', 'slippery'], 'yosemite', 9997)
    print(read_report(db, reportID))
    delete_report(db, reportID)

    print('Demonstrate delete')
    reportID = create_report(db, 'mountain', ['wet', 'rock'], 'ann arbor', 9999)
    print(read_report(db, reportID))
    if delete_report(db, reportID):
        print('Successful delete')
    else:
        print('Delete failed!')

    print('Demonstrate update')
    reportID = create_report(db, 'stream', ['dry', 'barren'], 'austin', 9998)
    print(read_report(db, reportID))
    if update_report(db, reportID, tags=['flowing', 'testing']):
        print('Successful update!')
    else:
        print('Update fails!')
    print(read_report(db, reportID))
    delete_report(db, reportID)

    print('Demonstrate another update')
    reportID = create_report(db, 'stream', ['dry', 'barren'], 'austin', 9998)
    print(read_report(db, reportID))
    if update_report(db, reportID, feature_name='raging river', tags=['flooding']):
        print('Successful update!')
    else:
        print('Update fails!')
    print(read_report(db, reportID))
    delete_report(db, reportID)

    print('Demonstrate find_report')
    reportID = create_report(db, 'hollow', ['pleasant'], 'washington', 9996)
    reportID = create_report(db, 'hollow', ['awful'], 'washington', 9996)
    reportID = create_report(db, 'hollow', ['nice'], 'oregon', 9996)
    reportID = create_report(db, 'hollow', ['mediocre'], 'oregon', 9998)
    reportID = create_report(db, 'mountain', ['snowy'], 'washington', 9996)

    print('user query')
    results = find_report(db, user_id=9996)
    for result in results:
        print(result)

    print('feature_name')
    results = find_report(db, feature_name='mountain')
    for result in results:
        print(result)

    print('location query')
    results = find_report(db, location='oregon')
    for result in results:
        print(result)

    print('all')
    results = find_report(db)
    for result in results:
        print(result)
        delete_report(db, result['_id'])

#questions: why bson Objects? How do people feel about updated API query structure? How do photos work?