from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True, default='')
    last_name = serializers.CharField(required=False, allow_blank=True, default='')
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email address already exists.")
        return value

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, help_text="Enter username or email address")
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        login_input = data.get('username')
        password = data.get('password')

        if login_input and password:
            # Check if input is email address
            username_to_auth = login_input
            if '@' in login_input:
                matched_user = User.objects.filter(email__iexact=login_input).first()
                if matched_user:
                    username_to_auth = matched_user.username

            user = authenticate(username=username_to_auth, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials. Please check your username/email and password.")
            if not user.is_active:
                raise serializers.ValidationError("This account has been disabled.")
        else:
            raise serializers.ValidationError("Must include both username/email and password.")

        data['user'] = user
        return data


class ForgetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)

    def validate_username(self, value):
        if not User.objects.filter(username=value).exists():
            raise serializers.ValidationError("User not found.")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        if not User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "User not found."})
        return data
