from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from .forms import LoginForm, RegisterForm, ForgetForm, ResetPasswordForm
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import logout
from django.contrib import messages
from django.contrib.auth.models import User

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            password1 = form.cleaned_data.get('password1')
            password2 = form.cleaned_data.get('password2')
            if password1 != password2:
                return HttpResponse("Your provided password is not equal.")
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"{username}, Your account created successfully")
            return redirect('login')
        else:
            messages.warning(request, 'You have missing the field ')
    else:
        form = RegisterForm()
<<<<<<< HEAD
    return render(request, 'authentication/register.html', {'form': form})
=======
    return render(request, 'register.html', {'form': form})
>>>>>>> 54fb3efbf3f95277ba87d02031ae3980816b5d52


def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = authenticate(request, username=data['username'], password=data['password'])
            if user is not None:
                login(request, user)
                return redirect('viewCourse')
            else:
                messages.warning(request, 'You need to create your account')
    else:
        form = LoginForm()
<<<<<<< HEAD
    return render(request, 'authentication/login.html', {'form': form})
=======
    return render(request, 'login.html', {'form': form})
>>>>>>> 54fb3efbf3f95277ba87d02031ae3980816b5d52



def user_logout(request):
    if request.user.is_authenticated: 
        logout(request)
        messages.success(request, "You are successfully logged out")
        return redirect('login')
    else:
        messages.warning("You may need to login")
    return redirect('login')
        
    


def user_forget(request):
    if request.method == 'POST':
        form = ForgetForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data['username']
            user = User.objects.filter(username=data).first()
            request.session['user'] = user.username
            if user:
                return redirect('resetPassword') 
            else:
                messages.error(request, "User not found.")
                return redirect('user_forget')
        else:
            messages.error(request, "There was an issue with the form.")
    else:
        form = ForgetForm()

<<<<<<< HEAD
    return render(request, 'authentication/user_forget.html', {'form': form})
=======
    return render(request, 'user_forget.html', {'form': form})
>>>>>>> 54fb3efbf3f95277ba87d02031ae3980816b5d52




def resetPassword(request):
    if request.method == 'POST':
        form = ResetPasswordForm(request.POST)
        if form.is_valid():
            password1 = form.cleaned_data.get('password1')
            password2 = form.cleaned_data.get('password2')

            if password1 != password2:
                return HttpResponse('Password must be same')
            
            username = request.session.get('user') 
            if not username:
                return redirect('user_forget')
            
            user = User.objects.filter(username=username).first()
            if not user:
                messages.warning(request, f'User {username} is not found!')
                return redirect('register')
            
            user.set_password(password1)
            user.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"{username}, You are successfully reset your password.")
            return redirect('login')

    else:
        form = ResetPasswordForm()
    return render(request, 'reset_password.html', {'form': form})