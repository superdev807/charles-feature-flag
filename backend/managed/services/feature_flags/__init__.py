import json
import requests

from managed.services.constants import *
from managed.services.feature_flags.constants import *


class FeatureFlag:
    def __init__(self, flag_name, store_location_id=None):
        self.flag_name = flag_name
        self.store_location_id = store_location_id
        self.check_successful = True
        self.error = ''
        self._feature_flag_status_check_url = FEATURE_FLAG_STATUS_CHECK_URL

    def _request_params(self):
        return {
            PARAM_FLAG_NAME: self.flag_name,
            PARAM_FLAG_STORE_LOCATION_ID: self.store_location_id
        }

    def _feature_flag_request_content(self):
        return json.loads(requests.get(
                    url=self._feature_flag_status_check_url,
                    params=self._request_params()
                ).content)

    def is_active(self):
        status = False
        try:
            response = self._feature_flag_request_content().get(KEY_RESPONSE)
            status = response.get(KEY_ACTIVE_STATUS)
        except Exception as e:
            self.error = str(e)
            self.check_successful = False

        return status
