# from django.urls import reverse
from rest_framework import status
from .api_base import API_VERIFIED_BASE
from rest_framework.response import Response
from .models import Goal,Label
from .serializers import GoalSerializer,LabelSerializer
from .helper_functions import confirm_real_color,compare_greater_dates
from datetime import datetime
from cloudinary.uploader import upload
# from django.core.paginator import Paginator

# profile api
# goals api - to get all goals of users  - done
# task api -to get all tasks under a goal
# should have like options like GOAL, FILTER based on state like days,ongoing completed
# notifications api
# task api single

class goal_info(API_VERIFIED_BASE):
    """_summary_

    Args:
        user must have correct api key and authenticated with jwt

    Returns:
        General information of the user such as goals,tasks
    """
    serializer_classes = [GoalSerializer]
    
    def post(self,request):
        user = self.request.user
        data = request.data
        num = data.get("num",None)
        num = num if num is None else int(num)
        is_completed = int(data.get("is_completed",None))
        goals = Goal.objects.filter(user=user,is_completed=is_completed,expired=False).order_by("-creation_time") if is_completed is not None else Goal.objects.filter(user=user).order_by("-creation_time")
        goals = goals[:num] if num is not None else goals
        goals = self.serializer_classes[0](goals,many=True).data
        
        return Response(goals,status=status.HTTP_200_OK)
    
    
class labels(API_VERIFIED_BASE):
    def get(self,request):
        all_labels = Label.objects.all()
        
        all_labels = LabelSerializer(all_labels,many=True).data
        
        return Response(all_labels,status=status.HTTP_200_OK)
    
    
    def post(self,request):
        data = self.request.data
        
        name = data.get("name",None)
        
        color = data.get("color",None)
        
        if name is None or color is None:
            return Response({"message":"name and color are required"},status=status.HTTP_400_BAD_REQUEST)
        
        if confirm_real_color(color) is False:
            return Response({"message":"color is invalid"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            Label.objects.create(name=name,color=color)
            
        except Exception as e:
            return Response({"message":f"Something went wrong {e}"},status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message":"Label created successfully"},status=status.HTTP_200_OK)
        
    
    
class goal_creation(API_VERIFIED_BASE):
    def post(self,request):
        user = self.request.user
        data = self.request.data
        goal_name = data.get("goal_name",None)
        goal_description = data.get("goal_description",None)
        
        try:
            
            start_time = datetime.strptime(data.get("start_time",None),"%Y-%m-%d %H:%M:%S")
            deadline = datetime.strptime(data.get("deadline",None),"%Y-%m-%d %H:%M:%S")
            
            if not compare_greater_dates(deadline,start_time,2):
                return Response({"message":"Start time cannot be greater than deadline"},status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"message":f"Start time and deadline are required {e}"},status=status.HTTP_400_BAD_REQUEST)
            
        image = data.get("image",None)
        if goal_name is None or goal_description is None:
            return Response({"message":"Goal name and description are required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            goal = Goal(user=user,title=goal_name,description=goal_description,start_time=start_time,deadline=deadline)
            goal.save()
            
        except Exception as e:
            return Response({"message":f"An error occured {e}"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = upload(image,resource_type="image")
            goal.image = image.url
            goal.save()
            
        except Exception as e:
            return Response({"message":f"An error occured in image processing,but goal has been created {e}"}, status=status.HTTP_200_OK)

        return Response({"message":"Goal created successfully"},status=status.HTTP_200_OK)