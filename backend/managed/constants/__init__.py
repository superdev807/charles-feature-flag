import os

#
# QUEUES
#
API_HIGH = 'api_high'
API_LOW = 'api_low'
CRON_HIGH = 'cron_high'
CRON_LOW = 'cron_low'
LOGS = 'logs'
PRINT = 'print'

MESSAGE_ERROR = 'Error'
MESSAGE_SUCCESS = 'Success'

# General error messages
ERROR_MESSAGE_ERROR_DELETING = 'Error deleting.'
ERROR_MESSAGE_ERROR_SAVING_NEW = 'Error saving new.'
ERROR_MESSAGE_ERROR_UPDATING = 'Error updating.'
ERROR_MISSING_REQUIRED_PARAMS = 'Missing required parameters.'
ERROR_MESSAGE_ERROR_GETTING = 'Error getting requested object.'
ERROR_APPEND_DOES_NOT_EXIST = ' does not exist.'

ERROR_MESSAGE_REQUEST_TYPE_NOT_PERMITTED = 'Request type not permitted on this end point.'
ERROR_MESSAGE_REQUEST_NOT_PERMITTED = 'Request not permitted on this end point.'

ERROR_MESSAGE_SOMETHING_WENT_WRONG = 'Something went wrong.'
ERROR_MESSAGE_NO_DATA_FOUND = 'No Data Found.'

#
# Requests
#
CONTENT_TYPE = 'content-type'
APPLICATION_JSON = 'application/json'

JSON_REQUEST_HEADERS = {
    CONTENT_TYPE: APPLICATION_JSON
}

#
# Request Keys
#
KEY_ERROR = 'error'
KEY_REQUEST = 'request'
KEY_RESPONSE = 'response'
KEY_SUCCESS = 'success'
KEY_EXCEPTION_MESSAGE = 'exceptionMessage'

#
# Response Keys
#
RESPONSE_SUCCESS_FALSE = False
RESPONSE_SUCCESS_TRUE = True
RESPONSE_STATUS_200 = 200
RESPONSE_STATUS_404 = 404

