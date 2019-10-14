from bson.objectid import ObjectId
from bson import Binary
import base64
import pymongo


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
        report['photos'] = create_photo(db, kwargs['photos'])
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


def create_feature(db, feature_name_in, location_in):
    """
    CREATE FEATURE method for creating a theme for users

    Parameters
    ----------
    db: a database instance
    feature_name_in: the name of the feature being created
    feature_location: the location of the feature being created

    Returns
    -------
    object id of the report if successfully created.
    -1 if the feature existed already.
    Otherwise, false.

    """
    feature = {
        'feature_name': feature_name_in,
        'feature_location': location_in,
        'feature_reports': []
    }
    try:
        existed_feature = db.Features.find_one({'feature_name': feature_name_in})
        if (existed_feature is None):
            feature_id = db.Features.insert_one(feature).inserted_id
        else:
            return -1
    except AssertionError as error:
        print(error)
        return False
    else:
        return feature_id
        

def read_report(db, report_id):
    """
    READ method for reading a users' report by object id

    Parameters
    ----------
    db: a database instance
    report_id: the object id of a report instance

    Returns
    -------
    Report: Otherwise None.

    """
    report = db.Reports.find_one({'_id': ObjectId(report_id)})
    if report is None:
        print("Cannot find the report with object id " + report_id)
        return False, None
    return report


def update_report(db, report_id, **kwargs):
    """
    UPDATE method for updating users' reports

    Parameters
    ----------
    db: report collection instance
    report_id: _id of the report to be updated
    kwargs: update content
        Possible update fields: feature_name, tags, photos

    Returns
    -------
    Boolean: True if successfully updated. Otherwise, False.

    """
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
        {'_id': ObjectId(report_id)}, {'$set': kwargs})
    if update_res.matched_count == 1:
        return True
    else:
        return False


def delete_report(db, report_id):
    """
    DELETE method for deleting specific report. 
    The corresponding foreign keys in Features will also be deleted.

    Parameters
    ----------
    db: report collection instance
    report_id: _id of the report to be deleted

    Returns
    -------
    Boolean: True if deletion succeeds, otherwise False.

    """
    find_res = db.Reports.find_one_and_delete(
        {'_id': report_id})
    if find_res is None:
        print('Can not find the report to delete.')
        return False
    del_obj_id = find_res['_id']
    # Delete report_id in Feature table
    db.Features.update_many({}, {'$pullAll': {'feature_reports': [del_obj_id]}})
    return True


def find_report(db, **kwargs):
    """
    Method for finding all reports matching certain criteria

    Parameters
    ----------
    db: report collection instance
    kwargs: update content
        Possible update fields: feature_name, user_id, location

    Returns
    -------
    Cursor: Cursor of all matching results.

    """
    query_fields = ['feature_name', 'user_id', 'location']

    for query_field in kwargs:
        if query_field not in query_fields:
            print('Unsupported field in report query.')
            return None

    return db.Reports.find(kwargs)


def create_photo(db, photo_paths):
    """
    Method for inserting new photo into Photos collection

    Parameters
    ----------
    db: pymongo db instance
    photo_paths: array of local file system path for inserted photos

    Returns
    -------
    ObjectId: Array of object Ids of inserted photos.

    """
    new_photos = [{'encode_raw': Binary(base64.b64encode(open(p, "rb").read()), 0)} for p in photo_paths]
    result = db.Photos.insert_many(new_photos)
    print(result.inserted_ids)
    return result.inserted_ids


def find_or_create_user(db, name, email):
    """
    Method for finding the user_id based on user's name, email
    Create one user if there is no matching user

    Parameters
    ----------
    db: pymongo db instance
    name: user's name
    email: user's email

    Returns
    -------
    ObjectId: Object Id of created/found user.

    """
    mongo_user_id = db.Users.find_one({'email': email,
                                       'name': name})
    if mongo_user_id is None:
        mongo_user_id = db.Users.insert_one({'email': email,
                                             'name': name}).inserted_id
    else:
        mongo_user_id = mongo_user_id['_id']
    return mongo_user_id


def find_photo(db, photo_ids):
    """
    Method for finding an array of decoded images
    corresponding to the specific report

    Parameters
    ----------
    db: pymongo db instance
    photo_ids: array of photo object id

    Returns
    -------
    ObjectId: Arrary of decoded raw images

    """
    ret = []
    for p in photo_ids:
        for x in db.Photos.find({'_id': p}):
            ret.append(x['encode_raw'].decode('ascii'))
    return ret


if __name__ == "__main__":

    client = pymongo.MongoClient('mongodb+srv://YangHu-yh:Fhsjzzx.48@cluster0-tohqa.mongodb.net/test?retryWrites=true&w=majority')
    db = client['hiking']
    create_result = create_feature(db, "kayak", "Austin")
    if create_result is False:
        print("There is an error!")
    elif create_result == -1:
        print("The feature already exist!")
    else:
        print('Successful update!')
