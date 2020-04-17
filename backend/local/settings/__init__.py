import os

from managed.constants import API_LOW, API_HIGH, CRON_LOW, CRON_HIGH

#
# THIS LIST IS EXPECTED, but can be empty if
# this service doesn't need to work any queues
#
SERVICE_QUEUE_LIST = []

#
# This is a settings override file
# local to a specific service

#
# These will REPLACE the managed setting
#
OVERRIDE_ALLOWED_HOSTS = []
OVERRIDE_DATABASES = {
   'default': {
       'CONN_MAX_AGE': 0,
       'ENGINE': 'django.db.backends.postgresql_psycopg2',
       'NAME': os.environ.get('POSTGRES_DB'),
       'USER': os.environ.get('POSTGRES_USER'),
       'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
       'HOST': os.environ.get('POSTGRES_HOST'),
       'PORT': os.environ.get('POSTGRES_PORT', '5432')
   }
}
OVERRIDE_INSTALLED_APPS = []
OVERRIDE_LOGGING = {}
OVERRIDE_MIDDLEWARE = []
OVERRIDE_TEMPLATES = []

#
# These will APPEND to the managed setting
# (Or append to the override if it exists above)
#
LOCAL_ALLOWED_HOSTS = []
LOCAL_DATABASES = {}
LOCAL_INSTALLED_APPS = []
LOCAL_LOGGING = {}
LOCAL_MIDDLEWARE = []
LOCAL_TEMPLATES = []
