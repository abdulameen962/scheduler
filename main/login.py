from rest_framework_simplejwt.tokens import RefreshToken
from .api_base import API_NON_VERIFIED_BASE,API_VERIFIED_BASE
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import status
from main.otp_generator import Otp_manager
from main.models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.template.loader import render_to_string
# from .send_sms import send_text_message
from django.contrib.auth import logout
from .helper_functions import verified_mail

class Login(API_NON_VERIFIED_BASE):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None and user.login_method == User.LoginMethod.EMAIL:
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                "status": "success",
                "message": "Login successful",
                "data": {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
            }
            
            #------Login User------#
            login(request, user)
            
            if verified_mail(user):
                return Response(response_data, status=status.HTTP_200_OK)
            
            response_data["message"] =  "user not email verified"
            response_data["email"] = user.email
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        error_data = {
            "status": "error",
            "message": "Invalid credentials",
            "data": None
        }
        return Response(error_data, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetView(API_NON_VERIFIED_BASE):
    def post(self,request):
        #send the otp to the user
        data = request.data
        email = data.get("email",None)
        if email is None:
            return Response({"message":"Email is required"},status=status.HTTP_400_BAD_REQUEST)
        
        #check if user with email exists
        try:
            user = User.objects.get(email=email)
            
            otp_manager = Otp_manager(180)
            otp = otp_manager.generate_otp(request)
            html_message = render_to_string('main/messages/reset_password_otp.html',{'otp':otp,'username':user.username})
            header = "Reset your password"

            #send email to the user
            plain_message = strip_tags(html_message)   
            send_mail(message=plain_message, from_email=f"Scheduler <{settings.EMAIL_HOST_USER}>",subject=header,recipient_list=[user.email],fail_silently=False,html_message=html_message)
            
            return Response({"message":"otp sent successfully"},status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"message":"User with this email doesn't exist"},status=status.HTTP_404_NOT_FOUND)


    def put(self,request):
        #confirm the otp sent
        data = request.data
        otp = data.get("otp",None)
        if otp is None:
            return Response({"message":"Otp required"},status=status.HTTP_400_BAD_REQUEST)
        
        otp_password_validate = Otp_manager(180).validate_otp(request,otp)
        
        if otp_password_validate:
            return Response({"message":"Otp verification successful"},status=status.HTTP_200_OK)

        return Response({"message":"Otp verification failed"},status=status.HTTP_403_FORBIDDEN)
    
    
class PasswordResetChange(API_NON_VERIFIED_BASE):
    def post(self,request):
        #confirm user has verified his otp
        otp_password_validate = self.request.session['otp_validation']
        if otp_password_validate == False:
            return Response({"message":"Otp verification failed"},status=status.HTTP_403_FORBIDDEN)
        
        #change the password
        data = request.data
        password = data.get("password",None)
        email = data.get("email",None)
        if password is None or email is None:
            return Response({"message":"Password and email required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            #log user out
            logout(request)
            return Response({"message":"Password changed successfully and use logged out"},status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"message":"User with this email doesn't exist"},status=status.HTTP_404_NOT_FOUND)
        
        
class CheckVerificationToken(API_VERIFIED_BASE):
  def get(self,request):
      return Response({"message":"Token is valid"},status=status.HTTP_200_OK)
  
  
class LogoutView(API_VERIFIED_BASE):
    def post(self,request):
        logout(request)
            
        return Response({"message":"Logout successful"},status=status.HTTP_200_OK)
    