from rest_framework.decorators import api_view

from managed.helpers.service import basic_health_check

@api_view(['GET'])
def health_check(request):
    return basic_health_check()
