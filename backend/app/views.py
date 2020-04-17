from django.db.models import Q
from django.utils import timezone
from django.http import JsonResponse
from django.contrib.auth.models import User

from rest_framework.decorators import api_view

from managed.helpers import *

from local.constants import *

from app.constants import *
from app.helpers import GetFeatureFlag
from app.models import FeatureFlag, FeatureFlagByStore


def format_flag_json(flag, include_history=False):
    flag_details_json = {
        KEY_RESPONSE_ACTIVE: flag.active,
        KEY_RESPONSE_DELETED: flag.deleted,
        KEY_RESPONSE_DESCRIPTION: flag.description,
        KEY_RESPONSE_STORE_SPECIFIC: flag.store_specific,
        KEY_RESPONSE_ENABLED: flag.enabled,
        KEY_RESPONSE_NAME: flag.name,
        KEY_RESPONSE_ACTIVATED_AT: flag.activated_at.__str__() if flag.activated_at else None,
        KEY_RESPONSE_LONG_TERM: flag.long_term
    }

    if flag.store_specific:
        flag_store_locations = FeatureFlagByStore.objects.filter(feature_flag=flag).all()
        store_locations = [
            {
                KEY_RESPONSE_STORE_LOCATION_ID: flag_store_location.store_location_id.__str__(),
                KEY_RESPONSE_STORE_LOCATION_ACTIVE: flag_store_location.active,
                KEY_RESPONSE_STORE_LOCATION_ACTIVATED_AT: flag_store_location.activated_at.__str__() if flag_store_location.activated_at else None
            }
            for flag_store_location in flag_store_locations
        ]

        flag_details_json[KEY_RESPONSE_STORE_LOCATIONS] = store_locations
    else:
        flag_details_json[KEY_RESPONSE_STORE_LOCATIONS] = []

    if include_history:
        flag_details_json[KEY_HISTORY] = format_flag_history_json(flag.history.all().order_by(ORDER_HISTORY_BY))

    return flag_details_json


def format_flag_history_json(history):
    return [
        {
            KEY_RESPONSE_HISTORY_ACTIVE: moment.active,
            KEY_RESPONSE_HISTORY_DELETED: moment.deleted,
            KEY_RESPONSE_HISTORY_DESCRIPTION: moment.description,
            KEY_RESPONSE_HISTORY_ENABLED: moment.enabled,
            KEY_RESPONSE_HISTORY_HISTORY_DATE: moment.history_date.__str__() if moment.history_date else None,
            KEY_RESPONSE_HISTORY_HISTORY_CHANGE_REASON: moment.history_change_reason,
            KEY_RESPONSE_HISTORY_HISTORY_TYPE: moment.history_type,
            KEY_RESPONSE_HISTORY_HISTORY_USER: moment.history_user_id if moment.history_user_id else None,
            KEY_RESPONSE_HISTORY_LONG_TERM: moment.long_term,
        } for moment in history
    ]


'''
# Feature Flag
## Feature Flag Management [/feature_flag/]
### Get Feature Flag [GET]
Gets a single feature flag

+ Parameters
    + flagName (required, string) - Flag Name
    + includeHistory (optional) - Whether to include flag history in response
    + includeDeleted (optional) - Whether to include deleted flags in response
    + includeLongTerm (optional) - Whether to include long term flags in response

+ Response 200 (application/json)

### Put Feature Flag [PUT]
Updates a single feature flag

+ Parameters
    + flagName (required, string) - Flag Name
    + flagDescription (optional, string) - Description of flag.
    + status (optional, string) - Must be one of [activate, deactivate, enable, disable]

+ Response 200 (application/json)

### Put Feature Flag [POST]
Creates a new feature flag

+ Parameters
    + flagName (required, string) - Flag Name
    + flagDescription (optional, string) - Description of flag.
    + longTerm (optional, boolean) - If flag is to be kept for longer terms

+ Response 200 (application/json)

### Delete Feature Flag [DELETE]
(Soft) Deletes a feature flag

+ Parameters
    + flagName (required, string) - Flag Name

+ Response 200 (application/json)
'''


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def feature_flag(request):
    if request.body:
        json_data = json.loads(request.body)
    else:
        json_data = None
    if request.method == "PUT" and json_data.get(PARAM_FLAG_NAME):

        flag_name = json_data.get(PARAM_FLAG_NAME)
        flag_new_status = json_data.get(PARAM_FLAG_STATUS)

        flag = FeatureFlag.objects.filter(name=flag_name).first()
        flag_description = json_data.get(PARAM_FLAG_DESCRIPTION, flag.description)
        flag_store_specific = json_data.get(PARAM_FLAG_STORE_SPECIFIC, flag.store_specific)
        flag_store_locations = json_data.get(PARAM_FLAG_STORE_LOCATIONS, [])
        flag_long_term = json_data.get(PARAM_FLAG_LONG_TERM, flag.long_term)

        request_params = {
            PARAM_FLAG_NAME: flag_name,
            PARAM_FLAG_STATUS: flag_new_status,
            PARAM_FLAG_DESCRIPTION: flag_description,
            PARAM_FLAG_STORE_SPECIFIC: flag_store_specific,
            PARAM_FLAG_STORE_LOCATIONS: flag_store_locations,
            PARAM_FLAG_LONG_TERM: flag_long_term
        }

        if flag_new_status == STATUS_ACTIVATE and not flag.enabled:
            response = format_error_response_json(ERROR_MESSAGE_FLAG_MUST_BE_ENABLED, request_params)

        else:

            if flag_new_status == STATUS_ACTIVATE:
                flag.active = True
                flag.activated_at = timezone.now()
            if flag_new_status == STATUS_DEACTIVATE:
                flag.active = False
                flag.activated_at = None
            if flag_new_status == STATUS_ENABLE:
                flag.enabled = True
                flag.deleted = False
            if flag_new_status == STATUS_DISABLE:
                flag.enabled = False
                flag.active = False
                flag.activated_at = None

            flag.description = flag_description
            flag.store_specific = flag_store_specific
            flag.long_term = flag_long_term

            try:

                flag.save()

                ffbs_ids = []
                for store_location in flag_store_locations:
                    ffbs, created = FeatureFlagByStore.objects.get_or_create(
                        store_location_id=store_location,
                        feature_flag=flag
                    )

                    ffbs_ids.append(ffbs.id)

                    if not created and not ffbs.active:
                        ffbs.active = True
                        ffbs.activated_at = timezone.now()
                        ffbs.save()

                FeatureFlagByStore.objects.filter(
                    feature_flag=flag
                ).exclude(id__in=ffbs_ids).update(active=False)

                flag_details_json = format_flag_json(flag, True)

                response = format_success_response_json(
                    flag_details_json,
                    request_params
                )

            except Exception as e:

                response = format_error_response_json(ERROR_MESSAGE_ERROR_UPDATING_FLAG, request_params, e)

    elif request.method == "POST" and json_data.get(PARAM_FLAG_NAME):

        flag_name = json_data.get(PARAM_FLAG_NAME)
        flag_description = json_data.get(PARAM_FLAG_DESCRIPTION, DEFAULT_FLAG_DESCRIPTION)
        flag_long_term = json_data.get(PARAM_FLAG_LONG_TERM)

        existing_flag = FeatureFlag.objects.filter(name=flag_name).first()

        request_params = {
            PARAM_FLAG_NAME: flag_name,
            PARAM_FLAG_DESCRIPTION: flag_description,
            PARAM_FLAG_LONG_TERM: flag_long_term,
        }

        if existing_flag:
            response = format_error_response_json(ERROR_MESSAGE_ERROR_DUPLICATE_FLAG, request_params)

        else:

            new_flag = FeatureFlag(name=flag_name, description=flag_description)

            if flag_long_term is not None:
                new_flag.long_term = flag_long_term

            try:
                new_flag.save()
                saved_flag = FeatureFlag.objects.filter(name=flag_name, deleted=False).first()
                flag_details_json = format_flag_json(saved_flag, True)

                response = format_success_response_json(
                    flag_details_json,
                    request_params
                )

            except Exception as e:

                response = format_error_response_json(ERROR_MESSAGE_ERROR_SAVING_NEW_FLAG, request_params, e)

    elif request.method == "GET" and request.GET.get(PARAM_FLAG_NAME):

        get_request = request.GET
        include_deleted = param_to_boolean(PARAM_DELETED, get_request)
        include_history = param_to_boolean(PARAM_HISTORY, get_request)
        include_long_term = param_to_boolean(PARAM_LONG_TERM, get_request)
        flag_name = get_request.get(PARAM_FLAG_NAME)
        store_location_id = get_request.get(PARAM_FLAG_STORE_LOCATION_ID, None)

        request_params = {
            PARAM_FLAG_NAME: flag_name,
            PARAM_FLAG_STORE_LOCATION_ID: store_location_id,
            KEY_HISTORY: include_history,
            KEY_DELETED: include_deleted,
            KEY_LONG_TERM: include_long_term
        }

        query = Q(name=flag_name)

        if not include_long_term:
            query.add(Q(long_term=include_long_term), Q.AND)

        if not include_deleted:
            query.add(Q(deleted=include_deleted), Q.AND)

        flag = FeatureFlag.objects.filter(query).first()

        if flag:
            flag_details_json = format_flag_json(flag, include_history)

            response = format_success_response_json(
                flag_details_json,
                request_params
            )

        else:
            response = format_error_response_json(ERROR_MESSAGE_FLAG_NOT_FOUND, request_params)

    elif request.method == "DELETE" and json_data.get(PARAM_FLAG_NAME):

        flag_name = json_data.get(PARAM_FLAG_NAME)
        request_params = {
            PARAM_FLAG_NAME: flag_name
        }

        try:
            flag_to_be_deleted = FeatureFlag.objects.filter(name=flag_name).first()

            flag_to_be_deleted.deleted = True
            flag_to_be_deleted.active = False
            flag_to_be_deleted.enabled = False

            flag_to_be_deleted.save()

            FeatureFlagByStore.objects.filter(feature_flag=flag_to_be_deleted).update(
                active=False
            )

            flag_details_json = format_flag_json(flag_to_be_deleted, True)

            response = format_success_response_json(
                flag_details_json,
                request_params
            )

        except Exception as e:
            response = format_error_response_json(ERROR_MESSAGE_ERROR_DELETING_FLAG, request_params, e)

    else:
        response = format_error_response_json(ERROR_MESSAGE_FLAG_NAME_REQUIRED)

    return formatted_response(response)


'''
# Feature Flag
## Feature Flag Management [/feature_flags/]
### Get Feature Flag [GET]
Gets all feature flags

+ Parameters
    + includeHistory (optional) - Whether to include flag history in response
    + includeDeleted (optional) - Whether to include deleted flags in response

+ Response 200 (application/json)
'''


@api_view(['GET'])
def feature_flags(request):

    if request.method == "GET":
        get_request = request.GET
        include_deleted = param_to_boolean(PARAM_DELETED, get_request)
        include_history = param_to_boolean(PARAM_HISTORY, get_request)
        include_long_term = param_to_boolean(PARAM_LONG_TERM, get_request)

        request_params = {
            KEY_HISTORY: include_history,
            KEY_DELETED: include_deleted,
            KEY_LONG_TERM: include_long_term,
        }

        query = Q()

        if not include_long_term:
            query.add(Q(long_term=include_long_term), Q.AND)

        if not include_deleted:
            query.add(Q(deleted=include_deleted), Q.AND)

        flags = FeatureFlag.objects.filter(query).all()

        response = format_success_response_json(
            [format_flag_json(flag, include_history) for flag in flags],
            request_params
        )

    else:
        response = format_error_response_json(ERROR_MESSAGE_REQUEST_TYPE_NOT_PERMITTED)

    return formatted_response(response)


'''
# Feature Flag
## Feature Flag Status [/featureflag/status/]
### Get Feature Flag [GET]
Gets the active status [true/false] of a enabled, non-deleted feature flag.

+ Parameters
    + flagName (required, string) - Flag Name

+ Response 200 (application/json)
'''


@api_view(['GET'])
def feature_flag_status(request):

    if request.method == "GET":
        get_request = request.GET

        flag_name = get_request.get(PARAM_FLAG_NAME)
        store_location_id = get_request.get(PARAM_FLAG_STORE_LOCATION_ID)

        request_params = {
            PARAM_FLAG_NAME: flag_name,
            PARAM_FLAG_STORE_LOCATION_ID: store_location_id
        }

        if flag_name:
            flag = FeatureFlag.objects.filter(name=flag_name).first()
            if flag:
                active_status = flag.status(store_location_id)

                response = format_success_response_json(
                    {
                        KEY_ACTIVE_STATUS: active_status
                    },
                    request_params
                )
            else:
                response = format_error_response_json(ERROR_MESSAGE_FLAG_NOT_FOUND, request_params)
        else:
            response = format_error_response_json(ERROR_MESSAGE_FLAG_NAME_REQUIRED, request_params)

    else:
        response = format_error_response_json(ERROR_MESSAGE_REQUEST_TYPE_NOT_PERMITTED)

    return formatted_response(response)


'''
# Feature Flag
## Feature Flag Status [/featureflag/statuses/]
### Get Feature Flag [GET]
Gets the active status [true/false] of all enabled, non-deleted feature flags.

+ Parameters

+ Response 200 (application/json)
'''


@api_view(['GET'])
def feature_flag_statuses(request):

    if request.method == "GET":
        active_statuses = GetFeatureFlag.statuses()

        response = format_success_response_json(active_statuses)
    else:
        response = format_error_response_json(ERROR_MESSAGE_REQUEST_TYPE_NOT_PERMITTED)

    return formatted_response(response)


@api_view(['GET'])
def users(request):
    if 'user_id' in request.GET:
        user = User.objects.filter(id=request.GET.get('user_id')).first()
        response = {'user': GetUser.json(user)}

    return JsonResponse(response, safe=False, status=200)


class GetUser:

    def __init__(self):
        pass

    @classmethod
    def json(cls, user):
        user_json = {}

        user_json['id'] = user.id
        user_json['first_name'] = user.first_name
        user_json['last_name'] = user.last_name
        user_json['username'] = user.username
        user_json['email'] = user.email
        user_json['date_joined'] = user.date_joined
        user_json['is_staff'] = user.is_staff
        user_json['role'] = 'DEVELOPER'
        user_json['stores'] = []

        return user_json