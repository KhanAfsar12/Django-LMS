from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User


class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        label='',
        widget=forms.EmailInput(attrs={'placeholder': 'Enter email'})
    )
    username = forms.CharField(
        label= '',
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Enter username'})
    )
    password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'})
    )
    password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'})
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'usable_password' in self.fields:
            del self.fields['usable_password']


class LoginForm(forms.Form):
    username = forms.CharField(
        label='',
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Enter username'})
    )
    password = forms.CharField(
        label='',
        max_length=100,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'})
        )