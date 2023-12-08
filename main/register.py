from main.serializers import *
from allauth.account import app_settings as allauth_account_settings
from allauth.account.utils import complete_signup
from allauth.account.models import EmailAddress
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.views import APIView
# from django.core.management.utils import get_random_secret_key
# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from main.otp_generator import Otp_manager
from main.models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from main.helper_functions import verified_mail,get_google_login
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.template.loader import render_to_string
from allauth.account.models import EmailAddress
# from .send_sms import send_text_message
from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.models import TokenModel
from dj_rest_auth.utils import jwt_encode
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from rest_framework_simplejwt.authentication import JWTAuthentication

otp_time_limit = int(settings.OTP_TIME_LIMIT)
sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters('password1', 'password2'),
)
class RegisterView(CreateAPIView):
    serializer_class = api_settings.REGISTER_SERIALIZER
    permission_classes = (HasAPIKey,)
    authentication_classes = ()
    www_authenticate_realm = "api"
    token_model = TokenModel
    throttle_scope = 'dj_rest_auth'

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_response_data(self, user):
        if allauth_account_settings.EMAIL_VERIFICATION == \
                allauth_account_settings.EmailVerificationMethod.MANDATORY:
            return {'detail': _('Verification e-mail sent.')}

        if api_settings.USE_JWT:
            data = {
                'user': user,
                'access': self.access_token,
                'refresh': self.refresh_token,
            }
            return api_settings.JWT_SERIALIZER(data, context=self.get_serializer_context()).data
        elif api_settings.SESSION_LOGIN:
            return None
        else:
            return api_settings.TOKEN_SERIALIZER(user.auth_token, context=self.get_serializer_context()).data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.get_response_data(user)

        if data:
            response = Response(
                data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            response = Response(status=status.HTTP_204_NO_CONTENT, headers=headers)

        return response

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if allauth_account_settings.EMAIL_VERIFICATION != \
                allauth_account_settings.EmailVerificationMethod.MANDATORY:
            if api_settings.USE_JWT:
                self.access_token, self.refresh_token = jwt_encode(user)
            elif not api_settings.SESSION_LOGIN:
                # Session authentication isn't active either, so this has to be
                #  token authentication
                api_settings.TOKEN_CREATOR(self.token_model, user, serializer)

        #send registration otp
        otp_manager = Otp_manager(otp_time_limit)
        otp = otp_manager.generate_otp(self.request)
        html_message = render_to_string('main/messages/otp_email.html',{'otp':otp,'username':user.username})
        header = "Verify your account"

        #send email to the user
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(message=plain_message, from_email=f"Scheduler <{settings.EMAIL_HOST_USER}>",subject=header,recipient_list=[user.email],fail_silently=False,html_message=html_message)
            complete_signup(
                self.request._request, user,
                allauth_account_settings.EMAIL_VERIFICATION,
                None,
            )
            return user
        
        except Exception:
            return Response({"message":"Something went wrong,otp couldn't be sent"},status=status.HTTP_201_CREATED)
        
class GoogleLogin(APIView):
    permission_classes = (HasAPIKey,)
    authentication_classes = [JWTAuthentication]
    www_authenticate_realm = "api"
    
    def post(self,request):
        data = request.data
        token = data.get("token",None)
        if token is None:
            return Response({"message":"Token is required"},status=status.HTTP_400_BAD_REQUEST)
        
        #get google details from token and create user if not exists and login user
        # global google_details
        google_details = get_google_login(token)
        
        if google_details is None:
            return Response({"message":"Something went wrong,google details couldn't be fetched"},status=status.HTTP_400_BAD_REQUEST)
        
        #create user if not exists and login user
        if google_details['verified_email'] == False :
            return Response({"message":"Email not verified"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=google_details['email'])
            login(request,user)

        except User.DoesNotExist:
            user = User.objects.create_user(username=google_details['given_name'],email=google_details['email'])
            user.first_name = google_details['given_name']
            user.last_name = google_details['family_name']
            user.save()
            
            #login user
            login(request,user)
            
        refresh = RefreshToken.for_user(user)
        response_data = {
            "status": "success",
            "message": "Login successful",
            "data": {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }
        }
    
        return Response(response_data,status=status.HTTP_200_OK)

from rest_framework_simplejwt.authentication import JWTAuthentication

class generate_registration_otp(APIView):
  permission_classes = [HasAPIKey,IsAuthenticated]
  authentication_classes = [JWTAuthentication]
  throttle_scope = 'important'
  
    
  def has_permission(self,request,view):
        user = self.request.user
        if user.is_anonymous:
            return False
            
        #check if user is logged in but not verified mail
        elif user.is_authenticated and not verified_mail(user):
            return True

        return False
  
  def get(self,request):
        user = self.request.user
        #send registration otp
        otp_manager = Otp_manager(otp_time_limit)
        otp = otp_manager.generate_otp(self.request)
        html_message = render_to_string('main/messages/otp_email.html',{'otp':otp,'username':user.username})
        header = "Verify your account"

        #send email to the user
        plain_message = strip_tags(html_message)
        
        send_mail(message=plain_message, from_email=f"Scheduler <{settings.EMAIL_HOST_USER}>",subject=header,recipient_list=[user.email],fail_silently=False,html_message=html_message)
        
        return Response({"message":"Otp sent sucessfully"},status=status.HTTP_201_CREATED)
      
  def post(self,request):
    #verify otp sent
    user = self.request.user
    data = request.data
    otp = data.get("otp","")
    try:
        otp_validate = Otp_manager(otp_time_limit).validate_otp(request,otp)
        
        if otp_validate:
            #verify email address
            email_address = EmailAddress.objects.get_or_create(user=request.user)
            email_address[0].verified = True
            email_address[0].save()
            
            #send verification mail
            html_message = render_to_string('main/messages/otp_verified.html',{'otp':otp,'username':user.username})
            header = "Account verification successful"

            #send email to the user
            plain_message = strip_tags(html_message)
            send_mail(message=plain_message, from_email=f"Handyman <{settings.EMAIL_HOST_USER}>",subject=header,recipient_list=[user.email],fail_silently=False,html_message=html_message)
            
            return Response({"message":"otp validated successfulyy"},status=status.HTTP_202_ACCEPTED)
        
        return Response({"message":"Otp verification failed"},status=status.HTTP_403_FORBIDDEN)
    
    except KeyError:
        return Response({"message":"Something went wrong,try to get another otp and try again"},status=status.HTTP_400_BAD_REQUEST)