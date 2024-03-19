from main.tasks import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.response import Response
from rest_framework import status


class run_jobs(APIView):
    permission_classes = []
    authentication_classes = ()
    www_authenticate_realm = "api"
    throttle_scope = 'important'
    
    def get(self,request):
        try:
            update_goals(task="goal")
            update_goals(task="task")
            send_regular_notifications()
            
            return Response({"message": "Done sucessfully"},status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"message": f"Error: {e}"}, status=status.HTTP_400_BAD_REQUEST)
