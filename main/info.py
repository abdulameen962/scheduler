from django.urls import reverse
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class GeneralInfo(APIView):
    """_summary_

    Args:
        user must have correct api key and authenticated with jwt

    Returns:
        General information of the user such as goals,tasks
    """
    permission_classes = [HasAPIKey,IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self,request):
        
        return Response(status=status.HTTP_200_OK)