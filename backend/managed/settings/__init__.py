import os
import pickle

from local.settings import *
from managed.settings.constants import LOCAL_BASE_DIR
from managed.settings.allowed_hosts import ALLOWED_HOSTS
from managed.settings.databases import DATABASES
from managed.settings.installed_apps import INSTALLED_APPS
from managed.settings.logging import LOGGING
from managed.settings.middleware import MIDDLEWARE
from managed.settings.redis_queues import REDIS_QUEUES
from managed.settings.templates import TEMPLATES

# For compatibility with the API/Python2.7
pickle.HIGHEST_PROTOCOL = 2

#
# Use managed settings or use over ridden settings
#
ALLOWED_HOSTS = OVERRIDE_ALLOWED_HOSTS if OVERRIDE_ALLOWED_HOSTS else ALLOWED_HOSTS
CORS_ORIGIN_ALLOW_ALL = True
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
DATABASES = OVERRIDE_DATABASES if OVERRIDE_DATABASES else DATABASES
INSTALLED_APPS = OVERRIDE_INSTALLED_APPS if OVERRIDE_INSTALLED_APPS else INSTALLED_APPS
LOGGING = OVERRIDE_LOGGING if OVERRIDE_LOGGING else LOGGING
MIDDLEWARE = OVERRIDE_MIDDLEWARE if OVERRIDE_MIDDLEWARE else MIDDLEWARE
ROOT_URLCONF = 'managed.urls'
RQ_QUEUES = REDIS_QUEUES
SITE_ID = 1
SECRET_KEY = os.environ.get('SECRET_KEY', 'development')
STATIC_ROOT = os.path.join(LOCAL_BASE_DIR, "static/")
STATIC_URL = "/static/"
TEMPLATES = OVERRIDE_TEMPLATES if OVERRIDE_TEMPLATES else TEMPLATES
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication'
    ]
}
JWT_AUTH = {
    'JWT_ALLOW_REFRESH': True,
}
#
# Append service specific settings to managed settings.
#
# Appending empty lists/dictionaries acts weird,
# so I checked them before trying to append/update.
#
if LOCAL_ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(LOCAL_ALLOWED_HOSTS)
if LOCAL_DATABASES:
    DATABASES.update(LOCAL_DATABASES)
if LOCAL_INSTALLED_APPS:
    INSTALLED_APPS.append(LOCAL_INSTALLED_APPS)
if LOCAL_LOGGING:
    LOGGING.update(LOCAL_LOGGING)
if LOCAL_MIDDLEWARE:
    MIDDLEWARE.append(LOCAL_MIDDLEWARE)
if LOCAL_TEMPLATES:
    TEMPLATES.append(LOCAL_TEMPLATES)

#
# Another weird thing since list/dicts
# append/update in place and return None
#
ALLOWED_HOSTS = ALLOWED_HOSTS
DATABASES = DATABASES
INSTALLED_APPS = INSTALLED_APPS
LOGGING = LOGGING
MIDDLEWARE = MIDDLEWARE
TEMPLATES = TEMPLATES
