from django.urls import path
from . import views
from django.views.generic import TemplateView
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )
# from dj_rest_auth.views import LogoutView

# from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('users/login/',views.Login.as_view(),name="rest_login"),
    path('users/registration/', views.RegisterView.as_view(),name="register"),
    path('users/logout/',views.LogoutView.as_view(),name="rest_logout"),
    path('users/password/reset/',views.PasswordResetView.as_view(),name="password_reset"),
    path('users/password/reset/change/',views.PasswordResetChange.as_view(),name="password_reset_confirm"),
    path('users/google/',views.GoogleLogin.as_view(),name="google_login"),
    path('token/', views.TokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.TokenFreshView.as_view(), name='token_refresh'),
    path('check-token/',views.CheckVerificationToken.as_view()),
    path('generate-registration-otp/',views.generate_registration_otp.as_view(),name="generate_registration_otp"),
    path('goals/',views.goal_info.as_view(),name="goal_info"),
    path('tasks/',views.task_api.as_view(),name="task_info"),
    path('notification/',views.Notification_api.as_view(),name="notification"),
    path('profile/',views.Profile.as_view(),name="profile"),
    
    path("firebase-messaging-sw.js",
        TemplateView.as_view(
            template_name="main/firebase-messaging-sw.js",
            content_type="application/javascript",
        ),
        name="firebase-messaging-sw.js"
    ),
]