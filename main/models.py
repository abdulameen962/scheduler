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
    """
        User model
    """
    class LoginMethod(models.TextChoices):
        EMAIL = "email"
        GOOGLE = "google"
        FACEBOOK = "facebook"
        TWITTER = "twitter"
        GITHUB = "github"
        LINKEDIN = "linkedin"
        WEIBO = "weibo"
        QQ = "qq"
        WECHAT = "wechat"
        OTHER = "other"
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    login_method = models.CharField(_("Login method"),max_length=20,choices=LoginMethod.choices,default=LoginMethod.EMAIL)
    
    def __str__(self):
        return f"{self.username}"
    
    class Meta:
        unique_together = ["email"]
    
    
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
        
        
class Goal(models.Model):
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_goals")
    image = CloudinaryField("image",null=True,blank=True,default=None)
    title = models.CharField(_("Title of goal"),max_length=100)
    description = models.TextField(_("Description of goal"),max_length=500)
    creation_time = models.DateTimeField(_("Date of goal creation"),auto_now_add=False,editable=False,default=timezone.now)
    deadline = models.DateTimeField(_("Deadline of goal"),auto_now_add=False,editable=False,default=timezone.now)
    is_completed = models.BooleanField(_("Completion state of goal"),default=False)
    
    def __str__(self):
        return f"{self.user.username} has a goal titled {self.title}"
    
    class Meta:
        verbose_name = "Goal"
        verbose_name_plural = "Goals"
        ordering = ("-creation_time",)    
        
    @property
    def goal_image(self):
        return self.image.url if self.image else "#"
        
class Task(models.Model):
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_tasks",default=None,null=True)
    goal = models.ForeignKey(Goal,on_delete=models.CASCADE,related_name="goal_tasks")
    title = models.CharField(_("Title of task"),max_length=100)
    description = models.TextField(_("Description of task"),max_length=500)
    creation_time = models.DateTimeField(_("Date of task creation"),auto_now_add=False,editable=False,default=timezone.now)
    deadline = models.DateTimeField(_("Deadline of task"),auto_now_add=False,editable=False,default=timezone.now)
    labels = models.ManyToManyField("main.Label",related_name="task_labels")
    is_completed = models.BooleanField(_("Completion state of task"),default=False)
    
    def __str__(self):
        return f"{self.user.username} has a task titled {self.title}"
    
    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
        ordering = ("-creation_time",)
        
        
class Label(models.Model):
    
    id = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    name = models.CharField(_("Name of label"),max_length=100)
    color = models.CharField(_("Color of label"),max_length=7)
    
    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        verbose_name = "Label"
        verbose_name_plural = "Labels"
    