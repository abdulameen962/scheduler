from django.contrib import admin

from .models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Userprofile)
admin.site.register(Goal)
admin.site.register(Task)
admin.site.register(Label)
