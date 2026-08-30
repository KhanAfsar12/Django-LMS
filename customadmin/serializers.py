from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = User.objects.filter(username=username).first()
        if not user:
            raise serializers.ValidationError("Account not found.")

        authenticated_user = authenticate(username=username, password=password)
        if not authenticated_user or not authenticated_user.is_superuser:
            raise serializers.ValidationError("Invalid credentials or user is not a superuser.")

        data['user'] = authenticated_user
        return data
