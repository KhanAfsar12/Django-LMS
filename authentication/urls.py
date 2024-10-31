from django.shortcuts import redirect
from django.urls import path
from .views import  register, resetPassword, user_forget, user_login, user_logout



urlpatterns = [
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('user_forget/', user_forget, name='user_forget'),
    path('resetPassword/', resetPassword, name='resetPassword'),
]