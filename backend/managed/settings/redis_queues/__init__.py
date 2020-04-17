import os
from local.settings import SERVICE_QUEUE_LIST

REDIS_QUEUES = {
    # 'default': {
    #     'HOST': os.getenv('REDIS_HOST'),
    #     'PORT': os.getenv('REDIS_PORT'),
    #     'DB': os.getenv('REDIS_DB'),
    #     # 'PASSWORD': 'some-password',
    #     'DEFAULT_TIMEOUT': 360,
    # },
    # 'with-sentinel': {
    #     'SENTINELS': [('localhost', 26736), ('localhost', 26737)],
    #     'MASTER_NAME': 'redismaster',
    #     'DB': 0,
    #     'PASSWORD': 'secret',
    #     'SOCKET_TIMEOUT': None,
    #     'CONNECTION_KWARGS': {
    #         'socket_connect_timeout': 0.3
    #     },
    # },
    # },
    # 'low': {
    #     'HOST': 'localhost',
    #     'PORT': 6379,
    #     'DB': 0,
    # }
}

for queue in SERVICE_QUEUE_LIST:
    REDIS_QUEUES[queue] = {
        'URL': 'redis://' + os.getenv('REDIS_HOST') + ':' + os.getenv('REDIS_PORT') + '/' + os.getenv('REDIS_DB'),
        'DEFAULT_TIMEOUT': os.getenv('REDIS_DEFAULT_TIMEOUT', 500),
    }

# RQ_EXCEPTION_HANDLERS = ['path.to.my.handler'] # If you need custom exception handlers

# Adds a link to the queue page on the admin page
RQ_SHOW_ADMIN_LINK = True

# Allows us to define an API token for monitoring the queue JSON
api_token = os.getenv('RQ_API_TOKEN', None)
if api_token:
    RQ_API_TOKEN = api_token
