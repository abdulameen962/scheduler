from django.db.models.signals import pre_save,post_save,pre_delete,post_delete
from django.dispatch import receiver
from .models import *
from django.template.defaultfilters import slugify
from allauth.account.models  import EmailAddress
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail,send_mass_mail
from .helper_functions import send_mail_comparison,fcm_push_notifications
import random

@receiver(post_save,sender=User)
def create_user_profile(sender,instance,**kwargs):
    #check if user profile has created before
    try:
        Userprofile.objects.get(user=instance)
    except Userprofile.DoesNotExist:
        Userprofile.objects.create(user=instance)
        
    # print("it came here")
    date_joined = instance.date_joined
    header = f"Welcome to the Scheduler {instance.username}"
    html_message = render_to_string("main/messages/welcome_message.html",{"username":instance.username})
    send_mail_comparison(date_joined,1,header,html_message,[instance.email],False,instance,header,html_message)
    
    
@receiver(post_save,sender=Notification)
def send_notification_to_user(sender,instance,**kwargs):
    images = ["https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic1_yge1z0.png","https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic2_a0ukhq.png","https://res.cloudinary.com/abdulameen/image/upload/v1703262902/pic3_o471pa.png"]
    username = instance.user.username
    title = instance.header
    body = instance.body
    image = instance.notification_image if instance.notification_image != "#" else random.choice(images)
    
    #send notification to user
    fcm_push_notifications(message=body,title=title,image=image,username=username)
    
    
@receiver(pre_save, sender=Goal)
def goal_pre_save(sender,instance,**kwargs):
    tasks = instance.goal_tasks.all()
    
    situation = True
    for task in tasks:
        if task.is_completed == False:
            situation = False
            
    if situation and instance.is_completed == False:
        instance.is_completed = True
        Notification.objects.create(user=instance.user,header="Goal Completed",body=f"You have completed the goal {instance.title}",image=instance.goal_image)
        
        
@receiver(post_save,sender=Goal)
def goal_post_save(sender,instance,**kwargs):
    if instance.expired:
        # get all tasks under instance that are not expired
        tasks = instance.goal_tasks.filter(expired=False,is_completed=False)
        for task in tasks:
            task.expired = True
            task.save()
            
# @receiver(pre_save,sender=Task)
# def task_pre_save(sender,instance,**kwargs):
#     # check whether in the former state,it wasnt expired
    
#     if instance.id and instance.expired == False:
                

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, **kwargs):
    goal = instance.goal
    
    if instance.is_completed and goal.is_completed is False:
        goal.save()
        # goal.goal_tasks.filter(id=instance.id).update(is_completed=True)
