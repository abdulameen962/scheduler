from .models import Goal,Task,Notification,User
from .helper_functions import compare_greater_dates,fcm_push_notifications
from django.utils import timezone
import random

def update_goals(**kwargs):
    """For updating either goals or tasks

    Raises:
        Exception: Except task name isnt correct or isnt added

    Returns:
        _type_: Nothing
    """
    try:
        type_task = kwargs["task"]
        if type_task in ["goal","task"]:
            if type_task == "goal":
                goals = Goal.objects.filter(is_completed=False,expired=False)
            
            elif type_task == "task":
                goals = Task.objects.select_related("goal").filter(is_completed=False,expired=False)
                
            if len(goals) > 0:
                for goal in goals:
                    print(goal)
                    print(goal.deadline)
                    if compare_greater_dates(timezone.now(),goal.deadline,0):
                        goal.expired = True
                        goal.save()
                        if type_task == "goal":
                            Notification.objects.create(user=goal.user,header="Goal expired",body=f"Your goal {goal.title} has expired,you can still mark it as complete on the application or revive the goal",image=goal.goal_image)
                            
                        else:
                            Notification.objects.create(user=goal.user,header="Task expired",body=f"Your task {goal.title} has expired,you can still mark it as complete on the application",image=goal.goal.goal_image)
            
        raise Exception("Task name not correct")
        
    except Exception as e:
        return f"An error occured {e}"
    
    
def send_regular_notifications():
    """
        For sending notifications to a user about
        his tasks and goals
    """
    # if a user has a goal that is not expired and,send him a notification
    users = User.objects.all()
    for user in users:
        user_goals = user.user_goals.filter(expired=False,is_completed=False)
        if len(user_goals) > 0:
            # send him a push notification
            image_goal = random.choice(user_goals)
            message = f"Hi {user.username},your goals are waiting,go and crush them today"
            title = "Go get it!"
            image = image_goal.goal_image
            username = user.username
            fcm_push_notifications(message=message,title=title,image=image,username=username)
            
            
    return "Completed"