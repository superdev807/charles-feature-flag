MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # This needs to be above everything: https://pypi.org/project/django-cors-headers/
    'whitenoise.middleware.WhiteNoiseMiddleware',  # This needs to be above everything except security middleware and CORS: http://whitenoise.evans.io/en/stable/
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware'
]