from app.models import FeatureFlag, FeatureFlagByStore
from managed.constants.feature_flags import *


class GetFeatureFlag:

    def __init__(self):
        pass

    # @classmethod
    # def status(cls, flag_name, store_location_id=None):
    #     response = False
    #     flag = FeatureFlag.objects.filter(name=flag_name).first()
    #     if flag:
    #         response = flag.active and flag.enabled and not flag.deleted
    #         if response and flag.store_specific:
    #             response = False
    #             if store_location_id:
    #                 flag_by_store = FeatureFlagByStore.objects.filter(feature_flag=flag, store_location_id=store_location_id).first()
    #                 if flag_by_store:
    #                     response = flag_by_store.active
    #     return response

    @classmethod
    def statuses(cls):
        flags = FeatureFlag.objects.all()
        response = {}
        for flag in flags:
            if flag.store_specific:
                ffbses = FeatureFlagByStore.objects.filter(feature_flag=flag).all()
                response[flag.name] = {str(ffbs.store_location.id): ffbs.active for ffbs in ffbses}
            else:
                response[flag.name] = flag.active and flag.enabled and not flag.deleted

        return response

