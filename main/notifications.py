from .helper_functions import compare_dates,timezone
from .api_base import API_VERIFIED_BASE
from .serializers import NotificationSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Notification,Task


class Notification_api(API_VERIFIED_BASE):
    
    def post(self,request):
        user = self.request.user
        data = request.data
        command = data.get("command",None)
        if command == "newest":
            # get last notifications that was sent in maxiumum 5 mins ago
            notifications = Notification.objects.filter(user=user).order_by("-creation_time")
            notification_arr = []
            for notify in notifications:
                if compare_dates(timezone.now(),notify.creation_time,3):
                    notification_arr.append(notify)
                    
            notifications = NotificationSerializer(notification_arr,many=True).data if len(notification_arr) > 0 else []
            
            return Response(notifications,status=status.HTTP_200_OK)
        
        num = int(data.get("num",50))
        is_read = int(data.get("is_read",False))
        notification = Notification.objects.filter(user=user,is_read=is_read).order_by("-creation_time")[:num]
        notification = NotificationSerializer(notification,many=True).data
        
        return Response(notification,status=status.HTTP_200_OK)
    
    def delete(self,request):
        user = self.request.user
        data = self.request.data
        notification_id = data.get("notification_id",None)
        if notification_id is None:
            return Response({"message":"Notification id is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            notification = user.user_notifications.get(id=notification_id)
            
            notification.delete()
            return Response({"message":"Notification deleted successfully"},status=status.HTTP_200_OK)
        
        except Task.DoesNotExist:
            return Response({"message":"Notification does not exist"},status=status.HTTP_400_BAD_REQUEST)
        