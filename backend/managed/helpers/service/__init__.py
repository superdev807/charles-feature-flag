import json
import os

from django.http import HttpResponse


def basic_health_check():
    db_host = os.environ.get('POSTGRES_HOST', '[WARNING] VALUE NOT SET')
    if len(db_host.split('.')) > 1:
        db_host = db_host.split('.')[0] + '-' + db_host.split('.')[1][-3:]

    redis_host = os.environ.get('REDIS_HOST', '[WARNING] VALUE NOT SET')
    if len(redis_host.split('.')) > 1:
        redis_host = redis_host.split('.')[0] + '-' + redis_host.split('.')[1][-3:]

    status = {
        'aService': os.environ.get('SERVICE_NAME', '[WARNING] VALUE NOT SET'),
        'Details': {
            'Build Environment': '{}'.format(os.environ.get('BUILD_ENVIRONMENT', '[WARNING] VALUE NOT SET')),
            'Database': {
                'NAME': os.environ.get('POSTGRES_DB', '[WARNING] VALUE NOT SET'),
                'USER': os.environ.get('POSTGRES_USER', '[WARNING] VALUE NOT SET'),
                'HOST': db_host,
                'PORT': os.environ.get('POSTGRES_PORT', '[WARNING] VALUE NOT SET')
            },
            'Redis-Queue': {
                'NAME': os.environ.get('REDIS_DB', '[WARNING] VALUE NOT SET'),
                'USER': os.environ.get('REDIS_USER', '[WARNING] VALUE NOT SET'),
                'HOST': redis_host,
                'PORT': os.environ.get('REDIS_PORT', '[WARNING] VALUE NOT SET')
            },
            'Email': {
                'EMAIL_ADDRESS': os.environ.get('EMAIL_ADDRESS', '[WARNING] VALUE NOT SET'),
                'EMAIL_HOST': os.environ.get('EMAIL_HOST', '[WARNING] VALUE NOT SET'),
                'EMAIL_PORT': os.environ.get('EMAIL_PORT', '[WARNING] VALUE NOT SET')
            },
        }
    }

    return HttpResponse(json.dumps(status, indent=4), content_type="application/json", status=200)
