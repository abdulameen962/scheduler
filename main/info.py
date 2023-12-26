# from django.urls import reverse
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.views import APIView
from rest_framework import status
from .api_base import API_VERIFIED_BASE
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Goal,Task,Notification
from .serializers import GoalSerializer,NotificationSerializer,TaskSerializer
from .helper_functions import verified_mail
# from django.core.paginator import Paginator

# profile api
# goals api - to get all goals of users  - done
# task api -to get all tasks under a goal
# should have like options like GOAL, FILTER based on state like days,ongoing completed
# notifications api
# task api single

class goal_info(APIView):
    """_summary_

    Args:
        user must have correct api key and authenticated with jwt

    Returns:
        General information of the user such as goals,tasks
    """
    permission_classes = [HasAPIKey,IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_classes = GoalSerializer
    
    def has_permission(self,request,view):
        user = self.request.user
        
        if user.is_anonymous:
            return False
        
        return verified_mail(user)
    
    def post(self,request):
        user = self.request.user
        data = request.data
        num = data.get("num",None)
        num = num if num is None else int(num)
        is_completed = int(data.get("is_completed",None))
        goals = Goal.objects.filter(user=user,is_completed=is_completed).order_by("-creation_time") if is_completed is not None else Goal.objects.filter(user=user).order_by("-creation_time")
        goals = goals[:num] if num is not None else goals
        goals = GoalSerializer(goals,many=True).data
        
        return Response(goals,status=status.HTTP_200_OK)
    
    
class task_api(API_VERIFIED_BASE):
    
    def post(self,request):
        # get a task under
        user = request.user
        data = self.request.data
        goal_id = data.get("goal_id",None)
        is_completed = data.get("is_completed",None)
        num = data.get("num",None)
        num = num if num is None else int(num)
        if goal_id is None:
            return Response({"message":"Goal id is required"},status=status.HTTP_400_BAD_REQUEST) 
        
        try:
            goal = Goal.objects.get(id=goal_id,user=user)
            
            if num is None:
                all_tasks = goal.goal_tasks.filter(is_completed=is_completed) if is_completed is not None else goal.goal_tasks.all()
                
            else:
                all_tasks = goal.goal_tasks.filter(is_completed=is_completed) if is_completed is not None else goal.goal_tasks.all()
                all_tasks = all_tasks[:num] if num is not None else all_tasks[:num]
                
            all_tasks = TaskSerializer(all_tasks,many=True).data
            
            return Response(all_tasks,status=status.HTTP_200_OK)
            
        except Goal.DoesNotExist:
            return Response({"message":"Goal does not exist"},status=status.HTTP_400_BAD_REQUEST)
            
    def put(self,request):
        user = self.request.user
        data = self.request.data
        task_id = data.get("task_id",None)
        if task_id is None:
            return Response({"message":"Task id is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            task = Task.objects.get(id=task_id,user=user)
            
            task.is_completed = True
            task.save()
            return Response({"message":"Task completed successfully"},status=status.HTTP_200_OK)
            
        except Task.DoesNotExist:
            return Response({"message":"Task does not exist"},status=status.HTTP_400_BAD_REQUEST)
        
        
    def delete(self,request):
        user = self.request.user
        data = self.request.data
        task_id = data.get("task_id",None)
        if task_id is None:
            return Response({"message":"Task id is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            task = Task.objects.get(id=task_id,user=user)
            
            task.delete()
            return Response({"message":"Task deleted successfully"},status=status.HTTP_200_OK)
            
        except Task.DoesNotExist:
            return Response({"message":"Task does not exist"},status=status.HTTP_400_BAD_REQUEST)
        
        
class Filter_task(API_VERIFIED_BASE):
    """_summary_

    Args:
        user must have correct api key and authenticated with jwt
        and also pass whether he wants ongoing or completed
        and the number

    Returns:
        Tasks whether ongoing or completed of the user with the number requested
    """
    
    def post(self,request):
        user = self.request.user
        data = self.request.data
        command = data.get("command",None)
        num = data.get("num",None)
        num = num if num is None else int(num)
        if command is None or num is None:
            return Response({"message":"Command and number of tasks are required"},status=status.HTTP_400_BAD_REQUEST)
        
        if command == "ongoing":
            tasks = Task.objects.filter(user=user,is_completed=False).order_by("-creation_time")[:num]
            tasks = TaskSerializer(tasks,many=True).data
            return Response(tasks,status=status.HTTP_200_OK)
        
        elif command == "completed":
            tasks = Task.objects.filter(user=user,is_completed=True).order_by("-creation_time")[:num]
            tasks = TaskSerializer(tasks,many=True).data
            return Response(tasks,status=status.HTTP_200_OK)
        
        else:
            return Response({"message":"Command not supported"},status=status.HTTP_400_BAD_REQUEST)
        
        
class Task_creation(API_VERIFIED_BASE):
    pass


class goal_creation(API_VERIFIED_BASE):
    pass


from .helper_functions import compare_dates,timezone

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
        