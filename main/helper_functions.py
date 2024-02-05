from .models import User
from allauth.account.models import EmailAddress
from django.utils import timezone
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail,send_mass_mail
from datetime import datetime
from django.template.defaultfilters import slugify
from django.utils.html import strip_tags
from cloudinary import api
import cloudinary.uploader
from django.contrib.auth.models import Group
from django.utils.html import strip_tags
from django.template.loader import render_to_string
import requests


def verified_mail(user:User):
    """
    Check whether a user has a verified email
    """
    if user.login_method != User.LoginMethod.EMAIL:
        return True
        
    res = False
    try:
        emailuser = EmailAddress.objects.get_or_create(user=user)
        emailuser = emailuser[0]
        if emailuser.verified:
            res = True
            
    except EmailAddress.DoesNotExist:
        res = False        
        
    return res

def just_created(date,difference_time:int):
    """
        Returns whether the current time and date has that difference
    """
    today = timezone.now()
    today = timezone.localtime(today)
    today = today.strftime("%m/%d/%Y %I:%M %p")
    today = datetime.strptime(today,"%m/%d/%Y %I:%M %p")
    date_joined = timezone.localtime(date)
    date_joined = date_joined.strftime("%m/%d/%Y %I:%M %p")
    date_joined = datetime.strptime(date_joined,"%m/%d/%Y %I:%M %p")
    difference = today - date_joined
    difference = difference.total_seconds()
    
    #convert to a minute
    difference = difference / 60
    if difference <= int(difference_time) and difference >= 0:
        return True
    
    return False

def compare_dates(date1,date2,differenced:int):
    """
        Compares 2 dates whether they have the difference specified
    """
    # date1 = timezone.localtime(date1)
    date1 = date1.strftime("%m/%d/%Y %I:%M %p")
    date1 = datetime.strptime(date1,"%m/%d/%Y %I:%M %p")
    # date2 = timezone.localtime(date2)
    date2 = date2.strftime("%m/%d/%Y %I:%M %p")
    date2 = datetime.strptime(date2,"%m/%d/%Y %I:%M %p")
    difference = date1 - date2
    difference = difference.total_seconds()
    
    #convert to a minute
    difference = difference / 60
    if difference <= int(differenced):
        return True
    
    return False

def compare_greater_dates(date1,date2,differenced:int):
    """
        Compares 2 dates whether they have the difference specified
    """
    # date1 = timezone.localtime(date1)
    date1 = date1.strftime("%Y-%m-%d %H:%M:%S")
    date1 = datetime.strptime(date1,"%Y-%m-%d %H:%M:%S")
    # date2 = timezone.localtime(date2)
    date2 = date2.strftime("%Y-%m-%d %H:%M:%S")
    date2 = datetime.strptime(date2,"%Y-%m-%d %H:%M:%S")
    difference = date1 - date2
    difference = difference.total_seconds()

    #convert to a minute
    difference = difference / 60
    if difference >= int(differenced):
        return True
    
    return False


def send_mail_comparison(date_joined,difference_time:int,header:str,html_message:str,recipient_list:list,send_notify:bool,user,notify_header:str,body:str):
    """
    A function for sending mail by comparing current time with time specified
    """
    from .models import Notification
    
    if just_created(date_joined,difference_time):
        #send email
        plain_message = strip_tags(html_message)
        send_mail(message=plain_message, from_email=f"Scheduler <{settings.EMAIL_HOST_USER}>",subject=header,recipient_list=recipient_list,fail_silently=False,html_message=html_message)

        if send_notify:
            notification = Notification(user=user,header=notify_header,body=body)
            notification.save()

    #send notification
    
    
def get_google_login(token:str) -> object:
    """
       Gets a token and returns the google api login results

    Args:
        token (str): token passed from google

    Returns:
        object: {email,username}
    """
    
    headers = {"Authorization": f"Bearer {token}"}
    url = "https://www.googleapis.com/userinfo/v2/me"
    
    response = requests.get(url,headers=headers)

    if not response.ok:
        return None
    
    result = response.json()
    
    return result

def fcm_push_notifications(**kwargs):
    from firebase_admin.messaging import Message,Notification
    from fcm_django.models import FCMDevice
    
    # FCMDevice.objects.all().handle_topic_subscription(True, topic=message)
    try:
        message = kwargs["message"]
        title = kwargs["title"]
        image = kwargs["image"] if kwargs["image"] else "https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic1_yge1z0.png"
        username = kwargs["username"]
        user = User.objects.get(username=username)
        
    except KeyError or User.DoesNotExist as e:
        print(f"An error occured: {e}")
        return
    
    message_obj = Message(
        data={
            "Nick" : "Mario",
            "body" : "great match!",
            "Room" : "PortugalVSDenmark"
        },
    )
    
    new_message = Message(
        notification=Notification(title=title, body=f"{message}", image=image),
        # topic=message,
    )

    # You can still use .filter() or any methods that return QuerySet (from the chain)
    device = FCMDevice.objects.get(user=user)
    # send_message parameters include: message, dry_run, app
    # device.handle_topic_subscription(True, topic=message)
    device.send_message(message_obj)
    device.send_message(new_message)
        # device.send_topic_message(new_message,message)

    # Unsubscribing
    # FCMDevice.objects.all().handle_topic_subscription(False, topic=message)
    
    # for device in devices:
    #     device.handle_topic_subscription(False, topic=message)
    
def create_fcm_object(fcm_token:str=None,device_type:str=None,user:User=None):
    if fcm_token is None or device_type is None or user is None:
        return 
    
    from fcm_django.models import FCMDevice,DeviceType
    if device_type.lower() == "android":
        type_of_device = DeviceType.ANDROID
        
    elif device_type.lower() == "ios":
        type_of_device = DeviceType.IOS
        
    else:
        type_of_device = DeviceType.WEB
        
    try:
        fcm_device = FCMDevice.objects.get(user=user)
        fcm_device.device_id = fcm_token
        fcm_device.registration_id = fcm_token
        fcm_device.type = type_of_device
        fcm_device.name = user.username
        fcm_device.save()
    
    except FCMDevice.DoesNotExist:
        try:
            FCMDevice.objects.create(device_id=fcm_token,registration_id=fcm_token,type=type_of_device,name=user.username,user=user)
          
        except Exception as e:
            raise Exception(f"An error occured {e}")  
    
def confirm_real_color(color:str=None):
    """
        Confirm whether the color is a real color, it must be in hex
    """
    if color is None:
        return False
    
    if color.startswith("#") and len(color) <= 7 and len(color) > 3:
        return True
    
    return False


def convert_to_https(link:str=None):
    if link is None:
        return link
    
    if link.startswith("https"):
        return link
    
    new_link = link.replace("http","https")
    
    return new_link