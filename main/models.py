from datetime import timezone
import datetime
import uuid
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from django.utils.translation import gettext_lazy as _

# Create your models here.
class User(AbstractUser,models.Model):
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    
    def __str__(self):
        return f"{self.username}"
    
    
class Userprofile(models.Model):
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    user = models.OneToOneField(User,related_name="user_profile",on_delete=models.CASCADE)  

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User profiles"
        
    def __str__(self):
        return f"{self.user}"
    
    
class Notification(models.Model):
    
    id = models.UUIDField(_("Id of notification"),editable=False,primary_key=True,default=uuid.uuid4)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_notifications")
    header = models.CharField(_("header of notification"), max_length=100)
    body = models.TextField(_("Body of the notification"),max_length=500)
    creation_time = models.DateTimeField(_("Date of notification creation"),auto_now_add=False,editable=False,default=timezone.now)
    is_read = models.BooleanField(_("Notification seen state"),default=False)
    
    def __str__(self):
        return f"{self.user.username} has a notification titled {self.header}"
    
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ("-creation_time",)
        unique_together = ["header","body","user","creation_time"]