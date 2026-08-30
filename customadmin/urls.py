from django.urls import path
from .views import AdminLoginAPIView

urlpatterns = [
    path('login/', AdminLoginAPIView.as_view(), name='admin_login'),
]