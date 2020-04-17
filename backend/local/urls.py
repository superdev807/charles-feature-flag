from django.urls import include, path

from app.views import *

urlpatterns = [
    path('v1/', include([
        path('featureflag/', include([
            path('', feature_flag, name='feature_flag'),
            path('status/', feature_flag_status, name='feature_flag_status'),
            path('statuses/', feature_flag_statuses, name='feature_flag_statuses'),
        ])),
        path('featureflags/', feature_flags, name='feature_flags'),
    ]))
]
