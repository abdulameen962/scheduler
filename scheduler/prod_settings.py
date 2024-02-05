"""
Django settings for scheduler project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import dj_database_url
import os
from datetime import timedelta
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

SITE_ID = 1

#for production
SECURE_SSL_REDIRECT  = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE =  True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 518400 
SECURE_HSTS_PRELOAD = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
        'allauth.account.auth_backends.AuthenticationBackend',
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework_simplejwt.authentication.JWTStatelessUserAuthentication',
    ),
        'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    "DEFAULT_THROTTLE_RATES": {
        'anon': '100/min',
        'user': '300/min'
    },
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework_api_key.permissions.HasAPIKey",
        'rest_framework.permissions.AllowAny'
    ]
}

REST_SESSION_LOGIN = False
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'main-auth',
    'JWT_AUTH_REFRESH_COOKIE': 'main-refresh-token',
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_COOKIE_USE_CSRF': True,
    'JWT_AUTH_COOKIE_ENFORCE_CSRF_ON_UNAUTHENTICATED': True,
    
    # for production
    # 'JWT_AUTH_SECURE': True
}
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_CONFIRM_EMAIL_ON_GET = False
ACCOUNT_EMAIL_CONFIRMATION_COOLDOWN = 150
ACCOUNT_MAX_EMAIL_ADDRESSES = 1
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 5
ACCOUNT_LOGIN_ATTEMPTS_TIMEOUT  = 400
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
    "graphql_jwt.backends.JSONWebTokenBackend",
]
# Application definition

INSTALLED_APPS = [
    "whitenoise.runserver_nostatic",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django.contrib.sites",
    'main',
    
    "corsheaders",
    
    'cloudinary',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    "django_extensions",
    'rest_framework',
    "rest_framework_api_key",
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework_simplejwt',
    
    # 'fcm_django',
]

API_KEY_CUSTOM_HEADER = "HTTP_X_API_KEY"

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

ROOT_URLCONF = 'scheduler.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'scheduler.wsgi.application'

cloudinary.config( 
  cloud_name = os.environ.get('cloud_name'), 
  api_key = os.environ.get('api_key'), 
  api_secret = os.environ.get('api_secret')
)

AUTH_USER_MODEL = "main.User"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'URL': os.environ.get('DATABASE_URL'),
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USER'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': os.environ.get('DATABASE_PORT'),
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DATABASES['default'] = dj_database_url.config(conn_max_age=600,ssl_require=True)

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles', 'static')
CORS_ALLOW_ALL_ORIGINS = True # If this is used then `CORS_ALLOWED_ORIGINS` will not have any effect
CORS_ALLOW_CREDENTIALS = True
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = default_headers + (
'x-api-key',
    # 'access-control-allow-origin'
)
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
EMAIL_FROM_USER = os.environ.get('EMAIL_FROM_USER',"")
EMAIL_HOST = os.environ.get('EMAIL_HOST',"")
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS',"")
EMAIL_PORT = os.environ.get('EMAIL_PORT',"")
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER',"")
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD',"")
OTP_TIME_LIMIT = os.environ.get('OTP_TIME_LIMIT',300)

# fire base configuration
# from firebase_admin import initialize_app

# Optional ONLY IF you have initialized a firebase app already:
# Visit https://firebase.google.com/docs/admin/setup/#python
# for more options for the following:
# Store an environment variable called GOOGLE_APPLICATION_CREDENTIALS
# which is a path that point to a json file with your credentials.
# Additional arguments are available: credentials, options, name
# FIREBASE_APP = initialize_app()
# # To learn more, visit the docs here:
# # https://cloud.google.com/docs/authentication/getting-started>

# FCM_DJANGO_SETTINGS = {
#      # default: _('FCM Django')
#     "APP_VERBOSE_NAME": "main",
#      # true if you want to have only one active device per registered user at a time
#      # default: False
#     "ONE_DEVICE_PER_USER": False,
#      # devices to which notifications cannot be sent,
#      # are deleted upon receiving error response from FCM
#      # default: False
#     "DELETE_INACTIVE_DEVICES": False,
# }