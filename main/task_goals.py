from .api_base import API_VERIFIED_BASE
from rest_framework.response import Response
from .models import Goal,Task,Label
from rest_framework import status
from .serializers import TaskSerializer
from datetime import datetime
from .helper_functions import compare_greater_dates

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
    def post(self,request):
        user = self.request.user
        data = self.request.data
        goal_id = data.get("goal_id",None)
        task_name = data.get("task_name",None)
        task_description = data.get("task_description",None)
        
        try:
            goal = Goal.objects.get(id=goal_id,user=user)
            
        except Goal.DoesNotExist:
            
            return Response({"message":"Goal doesn't exist"},status=status.HTTP_400_BAD_REQUEST)
            
        try:
            start_time = datetime.strptime(data.get("start_time",None),"%Y-%m-%d %H:%M:%S")
            deadline = datetime.strptime(data.get("deadline",None),"%Y-%m-%d %H:%M:%S")
            
            if not compare_greater_dates(deadline,start_time,2):
                return Response({"message":"Start time cannot be greater than deadline"},status=status.HTTP_400_BAD_REQUEST)
            
            if not compare_greater_dates(start_time,goal.start_time,2) or not compare_greater_dates(goal.deadline,deadline,2):
                return Response({"message":f"Start time and deadline must be between goal start and end time {compare_greater_dates(start_time,goal.start_time,2)} {compare_greater_dates(goal.deadline,deadline,2)}"},status=status.HTTP_400_BAD_REQUEST)
        
            
        except Exception as e:
            
            return Response({"message":f"Start time and deadline are required or an error occured {e}"},status=status.HTTP_400_BAD_REQUEST)
        
        labels = data.getlist("labels",None)
        if goal_id is None or task_name is None or task_description is None or start_time is None or deadline is None or labels is None:
            return Response({"message":"Goal id and task name are required"},status=status.HTTP_400_BAD_REQUEST)
        
        
        try:
            
            task = Task(user=user,goal=goal,task_name=task_name,task_description=task_description)
            task.save()
            
            for label in labels:
                label = Label.objects.get(name=label)
                task.labels.add(label)
                
            return Response({"message":"Task created successfully"},status=status.HTTP_200_OK)
            
        except Label.DoesNotExist or Exception as e:
            return Response({"message":f"An error occured {e}"},status=status.HTTP_400_BAD_REQUEST)