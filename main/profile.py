from rest_framework_api_key.permissions import HasAPIKey
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# from .models import Goal,Task,Notification
from .serializers import UserInfoSerializer

class Profile(APIView):
    permission_classes = [HasAPIKey,IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_classes = UserInfoSerializer
    
    def post(self,request):
        user = self.request.user
        
        data = UserInfoSerializer(user,many=False).data
        
        return Response(data,status=status.HTTP_200_OK)