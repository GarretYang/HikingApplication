from pymongo import MongoClient
from bson.objectid import ObjectId

# create an report in the "Reports" collection
def create_report(db, feature_name, tags, location, user_id, **kwargs):
    reports = {
        'tags': tags,
        'location': location,
        'user_id': user_id, 
        'feature_name': feature_name
    }
    if 'photos' in kwargs:
        reports['photos'] = kwargs['photos']

    try:
        _id = db.Reports.insert_one(reports).inserted_id
        existed_report = db.Features.find_one({'feature_name': feature_name})
        if existed_report is None:
            db.Features.insert_one({'feature_name': feature_name, 'feature_reports': [_id]})
        else:
            existed_report['feature_reports'].append(_id)
            query = {'_id': ObjectId(existed_report['_id'])}
            new_values = {'$set': {"feature_reports": existed_report['feature_reports']}}
            db.Features.update_one(query, new_values)
    except AssertionError as error:
        print(error)

# read a report by id in the "Features" collection
def read_report(db, _id) :
    res = db.Features.find_one({'_id': ObjectId(_id)})
    print(res)
    return res

def update_report(db, user_id_in, feature_name_in, **kwargs):
    '''
    UPDATE method for updating users' reports
    INVARIANT: Each report has unique <user_id, feature_name> pair.

    Parameters
    ----------
    db: report collection instance
    user_id_in: user_id of the report to be updated
    feature_name_in: name of the report to be updated
    kwargs: update content
        Possible update fields: feature_name, tags, photos

    Returns
    -------
    Boolean: True if successfully update. Otherwise, false.

    '''
    supp_fields = ['feature_name', 'tags', 'photos']
    # Empty case
    if not bool(kwargs):
        return True
    for update_field in kwargs:
        if update_field not in supp_fields:
            print('Unsupported updating field in report.')
            return False
    # Update
    update_res = db.Reports.update_one(            \
                 {'feature_name': feature_name_in, \
                 'user_id': user_id_in}, {'$set': kwargs})
    if update_res.matched_count == 1:
        return True
    else:
        return False
    

def delete_report(db, user_id_in, feature_name_in):
    '''
    DELETE method for deleting specific report. 
    The corresponding foreign keys in Features will also be deleted.

    Parameters
    ----------
    db: report collection instance
    user_id_in: user_id of the report to be deleted
    feature_name_in: feature_name of the report to be deleted

    Returns
    -------
    Boolean: True if deletion succeeds, otherwise false.

    '''
    find_res = db.Reports.find_one_and_delete( \
               {'user_id': user_id_in, 'feature_name': feature_name_in})
    if find_res is None:
        print('Can not find the report to delete.')
        return False
    del_obj_id = find_res['_id']
    # Delete report_id in Feature table
    db.Features.update_many({}, {'$pullAll': {'feature_reports': [del_obj_id]}})
    return True

# Simple test
if __name__ == '__main__':
    client = MongoClient('mongodb+srv://username:password@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority')
    db = client.hiking
    create_report(db, 'mountain', ['wet', 'rock'], 'ann arbor', 9999)
    if delete_report(db, 9999, 'mountain'):
        print('Successful update!')
    else:
        print('Update fails!')
