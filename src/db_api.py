from pymongo import MongoClient
from bson.objectid import ObjectId

def create_report(db, feature_name_in, tags_in, location_in, user_id_in, **kwargs):
    """
    CREATE method for creating a users' report
    INVARIANT: Each report has unique <user_id, feature_name> pair.

    Parameters
    ----------
    db: a database instance
    feature_name_in: the name of the feature being created
    tags_in: tags that associate with report
    location_in: location information (possibly coordinates)
    user_id_in: user_id of the creator of the report
    **kwargs: optional input, possibly an array of photos for the report

    Returns
    -------
    Boolean: object id of the report if successfully created. Otherwise, false.

    """
    report = {
        'feature_name': feature_name_in,
        'tags': tags_in,
        'location': location_in,
        'user_id': user_id_in,
    }
    if 'photos' in kwargs:
        report.append({'photos': kwargs.get('photo')})
    try:
        _id = db.Reports.insert_one(report).inserted_id
        existed_report = db.Features.find_one({'feature_name': feature_name_in})
        if existed_report is None:
            db.Features.insert_one({'feature_name': feature_name_in, 'feature_reports': [_id]})
        else:
            existed_report['feature_reports'].append(_id)
            query = {'_id': ObjectId(existed_report['_id'])}
            new_values = {'$set': {"feature_reports": existed_report['feature_reports']}}
            db.Features.update_one(query, new_values)
    except AssertionError as error:
        print(error)
        return False
    else:
        return _id


def read_report(db, _id):
    """
    READ method for reading a users' report by object id
    INVARIANT: Each report has unique <user_id, feature_name> pair.

    Parameters
    ----------
    db: a database instance
    _id: the object id of a report instance

    Returns
    -------
    Boolean: True if successfully create. Otherwise, false.

    """
    report = db.Reports.find_one({'_id': ObjectId(_id)})
    if report is None:
        print("Cannot find the report with object id " + _id)
        return False
    return report


def update_report(db, _id, **kwargs):
    '''
    UPDATE method for updating users' reports
    INVARIANT: Each report has unique <user_id, feature_name> pair.

    Parameters
    ----------
    db: report collection instance
    #user_id_in: user_id of the report to be updated
    #feature_name_in: name of the report to be updated
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
    update_res = db.Reports.update_one( \
        {'_id': ObjectId(_id)}, {'$set': kwargs})
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
    find_res = db.Reports.find_one_and_delete(
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
    client = MongoClient('mongodb+srv://user:pass@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority')
    db = client.hiking
    reportID = create_report(db, 'mountain', ['wet', 'rock'], 'ann arbor', 9999)
    print(read_report(db, reportID))
    if delete_report(db, 9999, 'mountain'):
        print('Successful update!')
    else:
        print('Update fails!')
