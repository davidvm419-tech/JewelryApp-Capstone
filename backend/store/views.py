from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt

import json

from .models import (Category, CartItem, Comment, Order, OrderItem, Product, 
                     ProductImage, Rating, User, Wishlist)

# Create your views here.

def get_csrf_token(request):
    # Generate and return a CSRF token for the client to use
    token = get_token(request)
    return JsonResponse({'token': token})
    

def login_view(request):
    # Confirm method
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    
    identification = data.get("identification", "").strip()
    password = data.get("password", "").strip()

    # Check if user login with email or username
    if "@" in identification:
        try:
            user = User.objects.get(email=identification)
            username = user.username
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid username/email, please try again"}, status=400)
    else:
        username = identification

    # Authenticate user information
    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Invalid username/email or password, please try again"}, status=400)
    
    # Log in user and return JSON response
    login(request, user)
    return JsonResponse({"message": f"welcome back {user.username}!"}, status=200)


def register_view(request):
    # Confirm post method
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirmation = data.get("confirmation", "").strip()
    email = data.get("email", "").strip()
    first_name = data.get("name", "").strip()
    last_name = data.get("last_name", "").strip()

    # Check password constrains (8 char and 1 number) and passwords match
    if len(password) < 8:
        return JsonResponse({"error": "password must have at least 8 characters and 1 number!"}, status=400) 
    
    is_digit = False
    for char in password:
        if char.isdigit():
            is_digit = True
            break
    if not is_digit:
        return JsonResponse({"error": "password must have at least 8 characters and 1 number!"}, status=400)

    if password != password_confirmation:
        return JsonResponse({"error": "passwords don't match!"}, status=400)
    
    # Check username is not taken
    user_check = User.objects.filter(username=username).exists()
    if user_check:
        return JsonResponse({"error": "user already exists"}, status=400)
    
    # Check vaild email
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "invalid email"}, status=400)
    
    # Avoid user creates an account with the same email
    email_check = User.objects.filter(email=email).exists()
    if email_check:
        return JsonResponse({"error": "user already exists"}, status=400)

    # Add data to data base
    try:
        user = User.objects.create_user(
            username=username, password=password, email=email, 
            first_name=first_name, last_name=last_name)
    except IntegrityError:
        return JsonResponse({"error": "User already exists"}, status=400) 
    
    # login user and return JSON response
    login(request, user)
    return JsonResponse({"message": "User successfully created!"}, status=200) 


def logout_view(request):
    # Confirm post method 
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Log out user and return JSON response
    logout(request)
    return JsonResponse({"message": "logout successfull, see you later!"}, status=200)