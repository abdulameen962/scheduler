from rest_framework import status
from .api_base import API_VERIFIED_BASE
from rest_framework.response import Response
# from .models import Goal,Task,Notification
from .serializers import UserInfoSerializer

class Profile(API_VERIFIED_BASE):
    serializer_classes = UserInfoSerializer
    
    def post(self,request):
        user = self.request.user
        
        data = UserInfoSerializer(user,many=False).data
        
        return Response(data,status=status.HTTP_200_OK)