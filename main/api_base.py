from .helper_functions import verified_mail
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_api_key.permissions import HasAPIKey


class API_VERIFIED_BASE(APIView):
    permission_classes = [HasAPIKey,IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    # def has_permission(self,request,view):
    #     user = self.request.user
        
    #     if user.is_anonymous:
    #         return False
        
    #     return verified_mail(user)
    
class API_NON_VERIFIED_BASE(APIView):
    permission_classes = [HasAPIKey]
    authentication_classes = ()
    www_authenticate_realm = "api"
    throttle_scope = 'important'