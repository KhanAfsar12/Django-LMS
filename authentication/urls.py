from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    ForgetPasswordAPIView,
    ResetPasswordAPIView,
    MeAPIView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('me/', MeAPIView.as_view(), name='me'),
    path('user_forget/', ForgetPasswordAPIView.as_view(), name='user_forget'),
    path('resetPassword/', ResetPasswordAPIView.as_view(), name='resetPassword'),
]