from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from .forms import LoginForm, RegisterForm
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import logout
from django.contrib import messages

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
    return render(request, 'register.html', {'form': form})


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
                return HttpResponse("Invalid credentials !")
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


@csrf_exempt
@require_POST
def user_logout(request):
    logout(request)
    print("Afsar")
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'message': 'Successfully logged out'})
    
    return redirect('login')