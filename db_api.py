from bson.objectid import ObjectId
from bson import Binary
import base64


def create_report(db, feature_name_in, tags_in, location_in, description_in, date_in, user_id_in, **kwargs):
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
        'description': description_in,
        'date_in': date_in,
        'user_id': user_id_in,
    }

    if 'photos' in kwargs:
        report['photos'] = create_photo(db, kwargs['photos'], feature_name_in)
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
        # create each tag that didn't exist and associate each existing tag with this report
        for tag in tags_in:
            update_or_create_tag(db, tag, _id)
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

    

def read_all_features(db):
    """
    READ method for reading all features to display on theme management page
    INVARIANT: Each report has unique <user_id, feature_name> pair.
    Parameters
    ----------
    db: a database instance
    Returns
    -------
    Report: Otherwise None.
    """
    themes = db.Features.find( {} )
    if themes is None:
        print("No themes available")
        return False
    return themes

def read_report(db, report_id):
    """
    READ method for reading a users' report by object id
    INVARIANT: Each report has unique <user_id, feature_name> pair.
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


def create_photo(db, photos, feature_name_in):
    """
    Method for inserting new photo into Photos collection
    Parameters
    ----------
    db: pymongo db instance
    photos: array of photos FileReaders passed to REST API POST request
    Returns
    -------
    ObjectId: Array of object Ids of inserted photos.
    """
    new_photos = [{'encode_raw': Binary(base64.b64encode(p.read()), 0) , 'theme': feature_name_in} for p in photos]
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
                                             'name': name,
                                             'subscribe_feature': []}).inserted_id
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

def update_or_create_tag(db, name, report_id):
    """
    Method for updating or creating a tag based on its name and a new report
    Create one tag if there is no matching tag
    Updates tag with additional report if there is an existing tag
    Parameters
    ----------
    db: pymongo db instance
    name: tag name
    report: report that uses this tag
    Returns
    -------
    Boolean: success or failure.
    """
    mongo_tag = db.Tags.find_one({'name': name})
    print(mongo_tag)
    if mongo_tag is None:
        mongo_tag = db.Tags.insert_one({'name': name, 'reports': [report_id]})
    #Update
    else:
        mongo_tag['reports'].append(report_id)
        query = {'_id': ObjectId(mongo_tag['_id'])}
        new_values = {'$set': {"reports": mongo_tag['reports']}}
        update_res = db.Tags.update_one(query, new_values)
        if update_res.matched_count == 1:
            return True
        else:
            return False


def get_tag(db, name):
    """
    Method for finding a tag object by its name
    Parameters
    ----------
    db: pymongo db instance
    name: tag name
    Returns
    -------
    tag (name, list[reports]) dictionary.
    """
    mongo_tag = db.Tags.find_one({'name': name})
    return mongo_tag


def get_all_tags(db):
    """
    Method for finding a tag object by its name
    Parameters
    ----------
    db: pymongo db instance
    Returns
    -------
    List of tag (name, list[reports]) dictionary.
    """
    mongo_tags = db.Tags.find( {} )
    return mongo_tags


def find_userinfo_by_id(db, user_id):
    """
    Method for finding an array of userinfo
    corresponding to the specific user_id

    Parameters
    ----------
    db: pymongo db instance
    user_id: user_id

    Returns
    -------
    ObjectId: Array of userinfo

    """
    user_info = db.Users.find_one({'_id': user_id})
    if user_info is None:
        print("Cannot find the user with object id " + user_id)
        return False, None
    return user_info
