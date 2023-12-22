import datetime
from rest_framework import serializers
from .models import *

#-----------------------------------------------------------------------------#
#New UserSerializer with more security  to validate input
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, error_messages={
        'required': 'Please enter a password',
        'min_length': 'Password must be at least 8 characters long',
        'max_length': 'Password must be no more than 128 characters long',
        'invalid': 'Please enter a valid password'
    })
    username = serializers.CharField(min_length=4, max_length=150, error_messages={
        'required': 'Please enter a username',
        'min_length': 'Username must be at least 4 characters long',
        'max_length': 'Username must be no more than 150 characters long',
        'invalid': 'Please enter a valid username',
    })
    
    class Meta:
        model = User
        fields = ['username', 'password']
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user
    
    
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
    
#-----------------------------------------------------------------------------#
# Goal serializer
class GoalSerializer(serializers.ModelSerializer):
    # user = UserInfoSerializer(many=False,read_only=True)
    class Meta:
        model = Goal
        fields = ['id','goal_image', 'title', 'description', 'creation_time', 'deadline','task_num']
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','header', 'body', 'creation_time','is_read']
        
class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id','name','color']        

class TaskSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True,read_only=True)
    
    class Meta:
        model = Task
        fields = ['id','title','description','creation_time','start_time','deadline','is_completed','labels']