import json

from django.http import HttpResponse

from managed.constants import *


def formatted_response(json_response):
    return HttpResponse(json.dumps(json_response), content_type="application/json", status=200)


def format_success_response_json(response, request_params=None):
    return {
        KEY_REQUEST: request_params,
        KEY_RESPONSE: response,
        KEY_SUCCESS: RESPONSE_SUCCESS_TRUE
    }


def format_error_response_json(message, request_params=None, exception_message=None):
    return {
        KEY_REQUEST: request_params,
        KEY_ERROR: message,
        KEY_EXCEPTION_MESSAGE: str(exception_message),
        KEY_SUCCESS: RESPONSE_SUCCESS_FALSE
    }


def param_to_boolean(param, request):
    return True if param in request else False
