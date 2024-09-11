from django.shortcuts import redirect
from django.urls import path
from .views import  register, resetPassword, user_forget, user_login, user_logout
from django.contrib.auth.views import  LogoutView
from django.contrib.auth import logout

class CustomLogoutView(LogoutView):
    http_method_names = ['get', 'post']
    def dispatch(self, request, *args, **kwargs):
        logout(request)
        return redirect('viewCourse')

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('user_forget/', user_forget, name='user_forget'),
    path('resetPassword/', resetPassword, name='resetPassword'),
]