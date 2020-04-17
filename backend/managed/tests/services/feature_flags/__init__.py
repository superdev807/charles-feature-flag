from unittest import mock

from django.test import TestCase

from managed.services.feature_flags import *
from managed.constants import *

# https://docs.djangoproject.com/en/1.11/topics/testing/overview/
# https://docs.djangoproject.com/en/1.11/topics/testing/tools/

SOME_RANDOM_FLAG_NAME = 'some-random-flag'


# Create your tests here.
class TestTests(TestCase):
    def testing_feature_flags_fail(self):
        ff = FeatureFlag(SOME_RANDOM_FLAG_NAME)
        ff._feature_flag_status_check_url = 'a.bad.url.com'

        self.assertEqual(ff.is_active(), False)
        self.assertEqual(ff.check_successful, False)

    def testing_feature_flags_success_mocked_api_call(self):
        return_value = {
            KEY_REQUEST: {
                PARAM_FLAG_NAME: SOME_RANDOM_FLAG_NAME,
                PARAM_FLAG_STORE_LOCATION_ID: None
            },
            KEY_RESPONSE: {
                KEY_ACTIVE_STATUS: True
            },
            KEY_SUCCESS: RESPONSE_SUCCESS_TRUE
        }

        with mock.patch.object(FeatureFlag, '_feature_flag_request_content', return_value=return_value):
            ff = FeatureFlag(SOME_RANDOM_FLAG_NAME)

            self.assertEqual(ff.is_active(), True)
            self.assertEqual(ff.check_successful, True)

    def testing_feature_flags_class(self):
        ff = FeatureFlag(SOME_RANDOM_FLAG_NAME)

        expected_params = {
            PARAM_FLAG_NAME: SOME_RANDOM_FLAG_NAME,
            PARAM_FLAG_STORE_LOCATION_ID: None
        }

        self.assertEqual(ff.check_successful, True)
        self.assertEqual(ff.store_location_id, None)
        self.assertEqual(ff.error, '')
        self.assertJSONEqual(json.dumps(ff._request_params()), json.dumps(expected_params))
