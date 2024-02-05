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
    image = random.choice(images)
    
    #send notification to user
    fcm_push_notifications(message=body,title=title,image=image,username=username)